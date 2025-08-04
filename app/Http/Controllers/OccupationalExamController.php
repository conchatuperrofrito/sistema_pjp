<?php

namespace App\Http\Controllers;

use App\Http\Requests\OccupationalExamRequest;
use App\Models\OccupationalExam;
use Barryvdh\DomPDF\Facade\Pdf;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OccupationalExamController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        $occupationalExams = OccupationalExam::with(['patient']);

        if ($request->filterValue) {
            $occupationalExams->whereHas('patient', function ($query) use ($request) {
                $query->where('first_name', 'like', "%{$request->filterValue}%")
                    ->orWhere('last_name', 'like', "%{$request->filterValue}%")
                    ->orWhere('document_number', 'like', "%{$request->filterValue}%");
            });
        }

        if ($request->examType) {
            $occupationalExams->where('exam_type', $request->examType);
        }

        if ($request->result) {
            $occupationalExams->where('result', $request->result);
        }

        if ($column && $direction) {
            if ($column === 'patientFullName') {
                $occupationalExams->join('patients', 'occupational_exams.patient_id', '=', 'patients.id')
                    ->orderByRaw("CONCAT(patients.first_name, ' ', patients.last_name) " . ($direction === 'descending' ? 'DESC' : 'ASC'));
            } else {
                $occupationalExams->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
            }
        }

        $occupationalExams = $occupationalExams->paginate($request->rowsPerPage ?? 5);

        $occupationalExams->getCollection()->transform(function ($occupationalExam) {
            return [
                'id' => $occupationalExam->id,
                'patientId' => $occupationalExam->patient_id,
                'patientFullName' => $occupationalExam->patient_full_name,
                'examType' => $occupationalExam->exam_type,
                'date' => $occupationalExam->date,
                'result' => $occupationalExam->result,
                'medicalObservations' => $occupationalExam->medical_observations,
                'doctor' => $occupationalExam->doctor,
                'createdAt' => $occupationalExam->created_at->format('d-m-Y h:i A'),
            ];
        });

        return $occupationalExams;
    }

    public function store(OccupationalExamRequest $request)
    {
        DB::transaction(function () use ($request) {
            $occupationalExam = new OccupationalExam();

            $occupationalExam->patient_id = $request->patientId;
            $occupationalExam->exam_type = $request->examType;
            $occupationalExam->date = $request->date;
            $occupationalExam->result = $request->result;
            $occupationalExam->medical_observations = $request->medicalObservations;
            $occupationalExam->doctor = $request->doctor;
            $occupationalExam->save();

            return response([
                'message' => 'Examen ocupacional registrado correctamente'
            ], 201);
        });
    }

    public function update(OccupationalExamRequest $request)
    {
        DB::transaction(function () use ($request) {
            $occupationalExam = OccupationalExam::find($request->id);

            if (!$occupationalExam) {
                return response([
                    'message' => 'Examen ocupacional no encontrado',
                    'error' => 'El examen ocupacional no existe en la base de datos',
                    'type' => 'not_found'
                ], 404);
            }

            $occupationalExam->patient_id = $request->patientId;
            $occupationalExam->exam_type = $request->examType;
            $occupationalExam->date = $request->date;
            $occupationalExam->result = $request->result;
            $occupationalExam->medical_observations = $request->medicalObservations;
            $occupationalExam->doctor = $request->doctor;
            $occupationalExam->save();

            return response(['message' => 'Examen ocupacional actualizado correctamente'], 200);
        });
    }

    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $occupationalExam = OccupationalExam::find($id);

            if (!$occupationalExam) {
                return response([
                    'message' => 'Examen ocupacional no encontrado',
                    'error' => 'El examen ocupacional con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $occupationalExam->delete();

            return response(['message' => 'Examen ocupacional eliminado correctamente'], 200);
        });

    }

    public function show($id)
    {
        $occupationalExam = OccupationalExam::with(['patient'])->find($id);

        if (!$occupationalExam) {
            return response([
                'message' => 'Examen ocupacional no encontrado',
                'error' => 'El examen ocupacional con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        return response([
            'id' => $occupationalExam->id,
            'patientId' => $occupationalExam->patient_id,
            'patientFullName' => $occupationalExam->patient_full_name,
            'examType' => $occupationalExam->exam_type,
            'date' => $occupationalExam->date,
            'result' => $occupationalExam->result,
            'medicalObservations' => $occupationalExam->medical_observations,
            'doctor' => $occupationalExam->doctor,
            'createdAt' => $occupationalExam->created_at->format('d-m-Y h:i A')
        ], 200);
    }

    public function getOccupationalExamReport($id)
    {
        $occupationalExam = OccupationalExam::with(['patient'])->find($id);

        if (!$occupationalExam) {
            return response()->json([
                'message' => 'Examen ocupacional no encontrado',
                'error' => 'El examen ocupacional con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        $occupationalExamData = [
            'date' => $occupationalExam->date,
            'examType' => $occupationalExam->exam_type,
            'result' => $occupationalExam->result,
            'doctor' => $occupationalExam->doctor,
            'medicalObservations' => $occupationalExam->medical_observations,
            'patientFullName' => $occupationalExam->patient->fullName,
            'patientDocument' => $occupationalExam->patient->documentTypeAbreviated . ' - ' . $occupationalExam->patient->document_number,
            'patientBirthdate' => $occupationalExam->patient->birthdate,
            'patientEmail' => $occupationalExam->patient->email,
            'patientAddress' => $occupationalExam->patient->address,
            'patientContactNumber' => $occupationalExam->patient->contact_number,
            'patientPlaceOfBirth' => $occupationalExam->patient->place_of_birth,
            'patientAge' => $occupationalExam->patient->age,
            'patientSex' => $occupationalExam->patient->sex,
            'patientPosition' => $occupationalExam->patient->position->name ?? 'No especificado',
            'patientDependence' => $occupationalExam->patient->dependence->name ?? 'No especificado',
            'createdAt' => $occupationalExam->created_at->format('d/m/Y h:i A')
        ];

        $pdf = PDF::loadView('reports.occupational-exam-report', $occupationalExamData);

        $nameFile = 'Reporte de Examen Ocupacional - ' . $occupationalExam->patient->fullName . ' - ' . $occupationalExam->date . '.pdf';

        return $pdf->stream($nameFile);
    }
}