<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\ClinicalExam;
use App\Models\Doctor;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\PhysicalExam;
use App\Models\RegionalExam;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use Spatie\Browsershot\Browsershot;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        if ($request->filterValue) {
            $searchResults = Patient::search($request->filterValue)->get();

            $searchResults = $searchResults->sortBy(function ($patient) use ($request) {
                return levenshtein(
                    strtolower($request->filterValue),
                    strtolower($patient->fullName)
                );
            });

            $patientIds = $searchResults->pluck('id')->toArray();

            $idsList = implode(',', array_map(fn($id) => "'{$id}'", $patientIds));

            $appointments = Appointment::whereIn('patient_id', $patientIds)
                ->orderByRaw("FIELD(patient_id, {$idsList})");
        } else {
            $appointments = Appointment::query();
        }

        if ($request->doctor) {
            $appointments->whereHas('medicalRecord', function ($query) use ($request) {
                $query->where('doctor_id', $request->doctor);
            });
        }

        if ($request->status) {
            $appointments->where('status', $request->status);
        }

        if (auth()->user()->role->id === env('DOCTOR_ROLE_ID')) {
            $appointments->whereHas('medicalRecord', function ($query) {
                $query->where('doctor_id', auth()->user()->doctor->id);
            });
        }

        if ($request->date) {
            $appointments->where('date', $request->date);
        }

        if ($column && $direction) {
            if ($column === 'fullName') {
                $appointments->orderByRaw("CONCAT(first_name, ' ', last_name) " . ($direction === 'descending' ? 'DESC' : 'ASC'));
            } else if ($column === 'scheduledFor') {
                $appointments->orderBy('date', $direction === 'descending' ? 'DESC' : 'ASC')
                    ->orderBy('hour', $direction === 'descending' ? 'DESC' : 'ASC');
            } else if ($column === 'patient') {
                $appointments->join('patients', 'appointments.patient_id', '=', 'patients.id')
                    ->select('appointments.*', 'patients.first_name', 'patients.last_name')
                    ->distinct()
                    ->orderByRaw("CONCAT(patients.first_name, ' ', patients.last_name) " . ($direction === 'descending' ? 'DESC' : 'ASC'));
            } else {
                $appointments->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
            }
        }

        $appointments = $appointments->paginate($request->rowsPerPage ?? 5);

        $appointments->getCollection()->transform(function ($appointment) {
            $doctor = $appointment->medicalRecord->doctor->user->fullName;
            $patient = $appointment->patient;

            return [
                'id' => $appointment->id,
                'scheduledFor' => $appointment->date . ' ' . $appointment->hour,
                'date' => $appointment->date,
                'hour' => $appointment->hour,
                'doctor' => $doctor,
                'patient' => $patient->fullName,
                'patientDocument' => $patient->documentType . ' - ' . $patient->documentNumber,
                'patientId' => $patient->id,
                'reason' => $appointment->reason,
                'status' => $appointment->status,
                'prescription' => $appointment->medicalRecord->prescription ? true : false,
            ];
        });

        return $appointments;
    }

    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $physicalExamRequest = $request->clinicalExam['physicalExam'];
            $regionalExamRequest = $request->clinicalExam['regionalExam'];

            $physicalExam = new PhysicalExam();
            $physicalExam->respiratoryRate = $physicalExamRequest['respiratoryRate'];
            $physicalExam->heartRate = $physicalExamRequest['heartRate'];
            $physicalExam->temperature = $physicalExamRequest['temperature'];
            $physicalExam->bloodPressure = $physicalExamRequest['bloodPressure'];
            $physicalExam->height = $physicalExamRequest['height'];
            $physicalExam->weight = $physicalExamRequest['weight'];
            $physicalExam->bodyMassIndex = $physicalExamRequest['bodyMassIndex'];
            $physicalExam->save();

            $regionalExam = new RegionalExam();
            $regionalExam->regionalExam = $regionalExamRequest['regionalExam'];
            $regionalExam->skin = $regionalExamRequest['skin'];
            $regionalExam->eyes = $regionalExamRequest['eyes'];
            $regionalExam->ears = $regionalExamRequest['ears'];
            $regionalExam->nose = $regionalExamRequest['nose'];
            $regionalExam->mouth = $regionalExamRequest['mouth'];
            $regionalExam->throat = $regionalExamRequest['throat'];
            $regionalExam->teeth = $regionalExamRequest['teeth'];
            $regionalExam->neck = $regionalExamRequest['neck'];
            $regionalExam->thorax = $regionalExamRequest['thorax'];
            $regionalExam->lungs = $regionalExamRequest['lungs'];
            $regionalExam->heart = $regionalExamRequest['heart'];
            $regionalExam->breasts = $regionalExamRequest['breasts'];
            $regionalExam->abdomen = $regionalExamRequest['abdomen'];
            $regionalExam->urinary = $regionalExamRequest['urinary'];
            $regionalExam->lymphatic = $regionalExamRequest['lymphatic'];
            $regionalExam->vascular = $regionalExamRequest['vascular'];
            $regionalExam->locomotor = $regionalExamRequest['locomotor'];
            $regionalExam->extremities = $regionalExamRequest['extremities'];
            $regionalExam->obituaries = $regionalExamRequest['obituaries'];
            $regionalExam->higherFunctions = $regionalExamRequest['higherFunctions'];
            $regionalExam->lowerFunctions = $regionalExamRequest['lowerFunctions'];
            $regionalExam->rectal = $regionalExamRequest['rectal'];
            $regionalExam->gynecological = $regionalExamRequest['gynecological'];
            $regionalExam->save();

            $clinicalExam = new ClinicalExam();
            $clinicalExam->regionalExamId = $regionalExam->id;
            $clinicalExam->physicalExamId = $physicalExam->id;
            $clinicalExam->generalExam = $request->clinicalExam['generalExam'];
            $clinicalExam->save();

            $medicalRecord = new MedicalRecord();
            $medicalRecord->clinicalExamId = $clinicalExam->id;
            $medicalRecord->doctorId = $request->appointment['doctorId'];
            $medicalRecord->save();

            if ($request->appointment['status'] === 'Programada') {
                $appointment = Appointment::find($request->appointment['id']);
                $appointment->status = 'Pendiente';
            } else {
                $appointment = new Appointment();
            }

            $appointment->date = $request->appointment['date'];
            $appointment->hour = $request->appointment['hour'];
            $appointment->reason = $request->appointment['reason'];
            $appointment->patientId = $request->appointment['patientId'];
            $appointment->medicalRecordId = $medicalRecord->id;
            $appointment->userId = auth()->id();
            $appointment->save();

            return response(['message' => 'Cita registrada correctamente'], 201);
        });
    }

    public function storePatientAppointment(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $medicalRecord = new MedicalRecord();
            $medicalRecord->doctorId = $request->doctorId;
            $medicalRecord->save();

            $appointment = new Appointment();
            $appointment->date = $request->date;
            $appointment->hour = $request->hour;
            $appointment->reason = "";
            $appointment->patientId = auth()->user()->id;
            $appointment->medicalRecordId = $medicalRecord->id;
            $appointment->status = 'Programada';
            $appointment->save();

            return response([
                'message' => 'Cita registrada correctamente',
                'data' => [
                    'id' => $appointment->id,
                    'patient' => $appointment->patient->fullName,
                    'documentNumber' => $appointment->patient->documentNumber,
                    'date' => $appointment->date,
                    'hour' => $appointment->hour,
                    'doctor' => $appointment->medicalRecord->doctor->user->fullName,
                    'specialty' => $appointment->medicalRecord->doctor->specialty->name,
                    'status' => $appointment->status,
                ]
            ], 201);
        });
    }

    public function getPatientAppointments()
    {
        $appointments = Appointment::where('patient_id', auth()->user()->id)
            ->get();

        if ($appointments->isEmpty()) {
            return response([
                'message' => 'No hay citas registradas para hoy',
                'error' => 'No se encontró ninguna cita para el paciente en la fecha actual',
                'type' => 'not_found'
            ], 404);
        }

        $response = $appointments->map(function ($appointment) {
            return [
                'id' => $appointment->id,
                'patient' => $appointment->patient->fullName,
                'documentNumber' => $appointment->patient->documentNumber,
                'date' => $appointment->date,
                'hour' => $appointment->hour,
                'doctor' => $appointment->medicalRecord->doctor->user->fullName,
                'specialty' => $appointment->medicalRecord->doctor->specialty->name,
                'status' => $appointment->status,
            ];
        });

        return response($response, 200);
    }
    public function update(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $physicalExamRequest = $request->clinicalExam['physicalExam'];
            $regionalExamRequest = $request->clinicalExam['regionalExam'];
            $appointmentRequest = $request->appointment;

            $appointment = Appointment::find($request->id);

            if (!$appointment) {
                return response([
                    'message' => 'Cita no encontrada',
                    'error' => 'La cita con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $appointment->date = $appointmentRequest['date'];
            $appointment->hour = $appointmentRequest['hour'];
            $appointment->reason = $appointmentRequest['reason'];
            $appointment->patientId = $appointmentRequest['patientId'];
            $appointment->medicalRecord->doctorId = $appointmentRequest['doctorId'];
            if ($appointmentRequest['status'] === 'Cancelada' || $appointmentRequest['status'] === 'Programada') {
                $appointment->status = 'Pendiente';
            }
            $appointment->save();
            $appointment->medicalRecord->save();

            $clinicalExam = $appointment->medicalRecord->clinicalExam;
            $clinicalExam->generalExam = $request->clinicalExam['generalExam'];
            $clinicalExam->save();

            $physicalExam = $clinicalExam->physicalExam;
            $physicalExam->respiratoryRate = $physicalExamRequest['respiratoryRate'];
            $physicalExam->heartRate = $physicalExamRequest['heartRate'];
            $physicalExam->temperature = $physicalExamRequest['temperature'];
            $physicalExam->bloodPressure = $physicalExamRequest['bloodPressure'];
            $physicalExam->height = $physicalExamRequest['height'];
            $physicalExam->weight = $physicalExamRequest['weight'];
            $physicalExam->bodyMassIndex = $physicalExamRequest['bodyMassIndex'];
            $physicalExam->save();

            $regionalExam = $clinicalExam->regionalExam;
            $regionalExam->regionalExam = $regionalExamRequest['regionalExam'];
            $regionalExam->skin = $regionalExamRequest['skin'];
            $regionalExam->eyes = $regionalExamRequest['eyes'];
            $regionalExam->ears = $regionalExamRequest['ears'];
            $regionalExam->nose = $regionalExamRequest['nose'];
            $regionalExam->mouth = $regionalExamRequest['mouth'];
            $regionalExam->throat = $regionalExamRequest['throat'];
            $regionalExam->teeth = $regionalExamRequest['teeth'];
            $regionalExam->neck = $regionalExamRequest['neck'];
            $regionalExam->thorax = $regionalExamRequest['thorax'];
            $regionalExam->lungs = $regionalExamRequest['lungs'];
            $regionalExam->heart = $regionalExamRequest['heart'];
            $regionalExam->breasts = $regionalExamRequest['breasts'];
            $regionalExam->abdomen = $regionalExamRequest['abdomen'];
            $regionalExam->urinary = $regionalExamRequest['urinary'];
            $regionalExam->lymphatic = $regionalExamRequest['lymphatic'];
            $regionalExam->vascular = $regionalExamRequest['vascular'];
            $regionalExam->locomotor = $regionalExamRequest['locomotor'];
            $regionalExam->extremities = $regionalExamRequest['extremities'];
            $regionalExam->obituaries = $regionalExamRequest['obituaries'];
            $regionalExam->higherFunctions = $regionalExamRequest['higherFunctions'];
            $regionalExam->lowerFunctions = $regionalExamRequest['lowerFunctions'];
            $regionalExam->rectal = $regionalExamRequest['rectal'];
            $regionalExam->gynecological = $regionalExamRequest['gynecological'];
            $regionalExam->save();

            return response(['message' => 'Cita actualizada correctamente'], 200);
        });
    }
    public function show($id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response([
                'message' => 'Cita no encontrada',
                'error' => 'La cita con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        $clinicalExam = $appointment->medicalRecord->clinicalExam;
        $physicalExam = $clinicalExam->physicalExam->makeHidden(['id', 'created_at', 'updated_at']);
        $regionalExam = $clinicalExam->regionalExam->makeHidden(['id', 'created_at', 'updated_at']);

        return response([
            'appointment' => [
                'id' => $appointment->id,
                'date' => $appointment->date,
                'hour' => explode(" ", $appointment->hour)[0],
                'reason' => $appointment->reason,
                'doctorId' => $appointment->medicalRecord->doctor->id,
                'patientId' => $appointment->patient->id,
            ],
            'clinicalExam' => [
                "id" => $clinicalExam->id,
                "generalExam" => $clinicalExam->generalExam,
                "physicalExam" => array_map('strval', $physicalExam->toArray()),
                "regionalExam" => array_map('strval', $regionalExam->toArray()),
            ],
        ], 200);
    }

    public function getBasicPatientInfo(Request $request)
    {
        $patient = Patient::find($request->id);

        if ($request->appointmentId) {
            $appointment = Appointment::find($request->appointmentId);
            $physicalExam = $appointment->medicalRecord->clinicalExam->physicalExam;
        }

        if (!$patient) {
            return response([
                'message' => 'Paciente no encontrado',
                'error' => 'El paciente con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        return response([
            'fullName' => $patient->fullName,
            'documentNumber' => $patient->documentNumber,
            'documentType' => $patient->documentType,
            'age' => $patient->age,
            'sex' => $patient->sex,
            'weight' => $physicalExam->weight ?? ""
        ], 200);
    }

    public function getDoctors()
    {
        $doctors = Doctor::whereNot('specialty_id', env('DENTISTRY_SPECIALTY_ID'))->get();

        return $doctors->transform(function ($doctor) {
            return [
                'value' => $doctor->id,
                'label' => $doctor->user->fullName . ' - ' . $doctor->specialty->name,
            ];
        });
    }

    public function generalReport($id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response([
                'message' => 'Cita no encontrada',
                'error' => 'La cita con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        $pdf = PDF::loadView('reports.general-report', [
            'appointment' => (object) $appointment->attributesToArray(),
            'patient' => $appointment->patient,
            'doctor' => $appointment->medicalRecord->doctor->with('specialty')->first(),
            'clinicalExam' => $appointment->medicalRecord->clinicalExam()->with('physicalExam', 'regionalExam')->first(),
            'anamnesis' => $appointment->medicalRecord->anamnesis,
            'diagnosis' => (object) array_merge(
                $appointment->medicalRecord->diagnosis->toArray(),
                ['diagnosisCodes' => $appointment->medicalRecord->diagnosis->diagnosisCodesMerged]
            ),
            'therapeuticPlan' => $appointment->medicalRecord->therapeuticPlan,
            'prescription' => $appointment->medicalRecord->prescription ?
                (object) array_merge(
                    $appointment->medicalRecord->prescription->toArray(),
                    ['medications' => $appointment->medicalRecord->prescription->medicationsMerged]
                ) : null,
            'consultationClosure' => $appointment->medicalRecord->consultationClosure,
        ]);

        $fileName = 'Reporte General - ' . $appointment->patient->fullName . ' - ' . $appointment->date . '.pdf';

        return $pdf->stream($fileName);
    }

    public function dentalReport($id)
    {
        $appointment = Appointment::find($id);

        $pdf = PDF::loadView('reports.dental-report', [
            'appointment' => $appointment,
            'patient' => $appointment->patient,
            'doctor' => $appointment->medicalRecord->doctor,
            'physicalExam' => $appointment->medicalRecord->physicalExam,
            'dentalEvolution' => $appointment->medicalRecord->dentalEvolution,
        ]);

        $fileName = 'Reporte Odontologico - ' . $appointment->patient->fullName . ' - ' . $appointment->date . '.pdf';

        return $pdf->stream($fileName);
    }

    public function getPrescription($id)
    {
        $appointment = Appointment::find($id);


        $pdf = PDF::loadView('reports.prescription', [
            'appointment' => (object) $appointment->attributesToArray(),
            'patient' => $appointment->patient,
            'doctor' => $appointment->medicalRecord->doctor,
            'prescription' => (object) array_merge(
                $appointment->medicalRecord->prescription->toArray(),
                ['medications' => $appointment->medicalRecord->prescription->medicationsMerged]
            )
        ]);

        $fileName = 'Receta Medica - ' . $appointment->patient->fullName . ' - ' . $appointment->date . '.pdf';

        return $pdf->stream($fileName);
    }

}
