<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use DB;
use Illuminate\Http\Request;
use App\Models\MedicalRecord;
use App\Models\Anamnesis;
use App\Models\Diagnosis;
use App\Models\Cie10Category;
use App\Models\Cie10Subcategory;
use App\Models\TherapeuticPlan;
use App\Models\Prescription;
use App\Models\ConsultationClosure;
use App\Models\PhysicalExam;
use App\Models\RegionalExam;
use App\Models\ClinicalExam;

class MedicalRecordController extends Controller
{

    public function storeMedicalEvaluation(Request $request)
    {
        DB::transaction(function () use ($request) {

            $anamnesis = Anamnesis::create($request->anamnesis);

            $diagnosis = Diagnosis::create($request->diagnosis);

            $diagnosis->diagnosisCodes()->createMany(array_map(function ($item) {
                return [
                    'classifiable_id' => $item['id'],
                    'classifiable_type' => $item['classification'] === 'category'
                        ? Cie10Category::class : Cie10Subcategory::class,
                    'type' => $item['type'],
                    'case' => $item['case'],
                    'discharge_flag' => $item['dischargeFlag'] === 'Sí',
                ];
            }, $request->diagnosis['diagnosisCodes']));

            $therapeuticPlan = TherapeuticPlan::create($request->therapeuticPlan);

            if ($request->prescription['medications']) {
                $prescription = Prescription::create($request->prescription);

                $medications = collect($request->prescription['medications'])->map(function ($med) {
                    return [
                        'medication_id' => $med['id'],
                        'duration' => $med['duration'],
                        'frequency' => $med['frequency'],
                        'instructions' => $med['instructions'],
                        'quantity' => $med['duration'] * $med['frequency']
                    ];
                })->toArray();

                $prescription->medications()->attach($medications);
            }

            $consultationClosure = ConsultationClosure::create($request->consultationClosure);

            $appointment = Appointment::find($request->appointmentId);
            $appointment->status = "Realizada";
            $appointment->save();

            $medicalRecord = $appointment->medicalRecord;

            $medicalRecord->anamnesisId = $anamnesis->id;
            $medicalRecord->diagnosisId = $diagnosis->id;
            $medicalRecord->therapeuticPlanId = $therapeuticPlan->id;
            $medicalRecord->prescriptionId = $prescription->id ?? null;
            $medicalRecord->consultationClosureId = $consultationClosure->id;
            $medicalRecord->save();

            if ($request->consultationClosure['nextAppointmentDate']) {

                $physicalExam = new PhysicalExam();
                $physicalExam->respiratoryRate = 0;
                $physicalExam->heartRate = 0;
                $physicalExam->temperature = 0;
                $physicalExam->bloodPressure = "";
                $physicalExam->save();

                $regionalExam = new RegionalExam();
                $regionalExam->regionalExam = "";
                $regionalExam->save();

                $clinicalExam = new ClinicalExam();
                $clinicalExam->regionalExamId = $regionalExam->id;
                $clinicalExam->physicalExamId = $physicalExam->id;
                $clinicalExam->generalExam = "";
                $clinicalExam->save();

                $doctor = $medicalRecord->doctor;

                $medicalRecord = new MedicalRecord();
                $medicalRecord->clinicalExamId = $clinicalExam->id;
                $medicalRecord->doctorId = $doctor->id;
                $medicalRecord->save();

                $patient = $appointment->patient;
                $appointmentReason = $appointment->reason;

                $appointment = new Appointment();
                $appointment->date = $request->consultationClosure['nextAppointmentDate'];
                $appointment->hour = "00:00";
                $appointment->reason = "Seguimiento: " . $appointmentReason;
                $appointment->patientId = $patient->id;
                $appointment->userId = auth()->id();
                $appointment->status = "Programada";
                $appointment->medicalRecordId = $medicalRecord->id;
                $appointment->save();
            }

            return response(['message' => 'Evaluación médica registrada correctamente'], 201);
        });
    }

    public function getMedicalEvaluation($id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response([
                'message' => 'Cita no encontrada',
                'error' => 'La cita con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        return [
            'appointmentId' => $appointment->id,
            'anamnesis' => collect($appointment->medicalRecord->anamnesis->toArray())
                ->except(['id', 'createdAt', 'updatedAt'])
                ->all(),
            'diagnosis' => collect($appointment->medicalRecord->diagnosis->toArray())
                ->except(['id', 'createdAt', 'updatedAt'])
                ->merge(['diagnosisCodes' => $appointment->medicalRecord->diagnosis->diagnosisCodesMerged])
                ->all(),
            'therapeuticPlan' => collect($appointment->medicalRecord->therapeuticPlan->toArray())
                ->except(['id', 'createdAt', 'updatedAt'])
                ->all(),
            'prescription' => $appointment->medicalRecord->prescription ?
                collect($appointment->medicalRecord->prescription->toArray())
                    ->except(['id', 'createdAt', 'updatedAt'])
                    ->merge([
                        'medications' => collect($appointment->medicalRecord->prescription->medicationsMerged)->map(function ($medication) {
                            return array_merge($medication, ['frequency' => (string) $medication['frequency']]);
                        })
                    ])
                    ->all()
                : ['notes' => '', 'medications' => []],
            'consultationClosure' => collect($appointment->medicalRecord->consultationClosure->toArray())
                ->except(['id', 'createdAt', 'updatedAt'])
                ->all(),
        ];
    }

    public function updateMedicalEvaluation(Request $request)
    {
        DB::transaction(function () use ($request) {

            $appointment = Appointment::find($request->appointmentId);

            if (!$appointment) {
                return response([
                    'message' => 'Cita no encontrada',
                    'error' => 'La cita con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $medicalRecord = $appointment->medicalRecord;

            $medicalRecord->anamnesis->update($request->anamnesis);

            $medicalRecord->diagnosis->update($request->diagnosis);

            $medicalRecord->diagnosis->diagnosisCodes()->delete();

            $medicalRecord->diagnosis->diagnosisCodes()->createMany(array_map(function ($item) {
                return [
                    'classifiable_id' => $item['id'],
                    'classifiable_type' => $item['classification'] === 'category'
                        ? Cie10Category::class : Cie10Subcategory::class,
                    'type' => $item['type'],
                    'case' => $item['case'],
                    'discharge_flag' => $item['dischargeFlag'] === 'Sí',
                ];
            }, $request->diagnosis['diagnosisCodes']));

            $medicalRecord->therapeuticPlan->update($request->therapeuticPlan);

            $prescription = $medicalRecord->prescription;

            if ($request->prescription['medications']) {

                if (!$prescription) {
                    $prescription = Prescription::create($request->prescription);
                    $medicalRecord->update([
                        'prescriptionId' => $prescription->id
                    ]);
                } else {
                    $prescription->update($request->prescription);
                }

                $medications = collect($request->prescription['medications'])->map(function ($med) {
                    return [
                        'medication_id' => $med['id'],
                        'duration' => $med['duration'],
                        'frequency' => $med['frequency'],
                        'instructions' => $med['instructions'],
                        'quantity' => $med['duration'] * $med['frequency']
                    ];
                })->toArray();

                $prescription->medications()->attach($medications);
            } else if ($prescription) {
                $medicalRecord->update([
                    'prescriptionId' => null
                ]);
                $prescription->medications()->detach();
                $prescription->delete();
            }

            $medicalRecord->consultationClosure->update($request->consultationClosure);

            return response(['message' => 'Evaluación médica actualizada correctamente'], 200);

        });
    }

}
