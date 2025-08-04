<?php

namespace App\Http\Controllers;

use App\Http\Requests\PatientRequest;
use App\Models\Department;
use App\Models\Patient;
use Barryvdh\DomPDF\Facade\Pdf;
use DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        if ($request->filterValue) {
            $searchResults = Patient::searchDocumentOrName($request->filterValue)->get();
            $patientIds = $searchResults->pluck('id')->toArray();
            $patients = Patient::whereIn('id', $patientIds);
        } else {
            $patients = Patient::query();
        }

        if ($request->sex) {
            $patients->where('sex', $request->sex);
        }

        if ($column && $direction) {
            if ($column === 'fullName') {
                $patients->orderByRaw("CONCAT(first_name, ' ', last_name) " . ($direction === 'descending' ? 'DESC' : 'ASC'));
            } else {
                $patients->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
            }
        }

        $patients = $patients->paginate($request->rowsPerPage ?? 5);

        $patients->getCollection()->transform(function ($patient) {
            return [
                'id' => $patient->id,
                'fullName' => $patient->first_name . ' ' . $patient->last_name,
                'age' => $patient->age,
                'placeOfBirth' => $patient->placeOfBirth,
                'documentType' => $patient->document_type,
                'documentNumber' => $patient->document_number,
                'birthdate' => $patient->birthdate,
                'sex' => $patient->sex,
                'contactNumber' => $patient->contact_number,
                'address' => $patient->address,
                'email' => $patient->email,
                'position' => $patient->position->name ?? null,
                'dependence' => $patient->dependence->name ?? null,
                'createdAt' => $patient->created_at->format('d-m-Y h:i A'),
            ];
        });

        return $patients;
    }

    public function store(PatientRequest $request)
    {
        DB::transaction(function () use ($request) {

            $patient = new Patient();

            $patient->districtId = $request->districtId;
            $patient->firstName = $request->firstName;
            $patient->lastName = $request->lastName;
            $patient->documentType = $request->documentType;
            $patient->documentNumber = $request->documentNumber;
            $patient->birthdate = $request->birthdate;
            $patient->sex = $request->sex;
            $patient->contactNumber = $request->contactNumber;
            $patient->address = $request->address;
            $patient->email = $request->email;
            $patient->positionId = $request->positionId;
            $patient->dependenceId = $request->dependenceId;
            $patient->password = Hash::make($request->documentNumber);
            $patient->save();

            return response([
                'message' => 'Paciente registrado correctamente',
                'data' => [
                    'patientId' => $patient->id,
                    'patientName' => $patient->fullName
                ]
            ], 201);
        });
    }

    public function update(PatientRequest $request)
    {
        DB::transaction(function () use ($request) {
            $patient = Patient::find($request->id);

            if (!$patient) {
                return response([
                    'message' => 'Paciente no encontrado',
                    'error' => 'El paciente no existe en la base de datos',
                    'type' => 'not_found'
                ], 404);
            }

            $patient->districtId = $request->districtId;
            $patient->firstName = $request->firstName;
            $patient->lastName = $request->lastName;
            $patient->documentType = $request->documentType;
            $patient->documentNumber = $request->documentNumber;
            $patient->birthdate = $request->birthdate;
            $patient->sex = $request->sex;
            $patient->contactNumber = $request->contactNumber;
            $patient->address = $request->address;
            $patient->email = $request->email;
            $patient->positionId = $request->positionId;
            $patient->dependenceId = $request->dependenceId;
            $patient->save();

            return response(['message' => 'Paciente actualizado correctamente'], 200);
        });
    }

    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $patient = Patient::find($id);

            if (!$patient) {
                return response([
                    'message' => 'Paciente no encontrado',
                    'error' => 'El paciente con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $patient->delete();

            return response(['message' => 'Paciente eliminado correctamente'], 200);
        });
    }

    public function show($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response([
                'message' => 'Paciente no encontrado',
                'error' => 'El paciente con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        return response([
            'departmentId' => $patient->district->province->department_id ?? null,
            'provinceId' => $patient->district->province_id ?? null,
            'districtId' => $patient->district_id ?? null
        ] + $patient->toArray(), 200);
    }

    public function getDepartments()
    {
        $departments = Department::with([
            'provinces' => function ($query) {
                $query->orderBy('name', 'asc')->with([
                    'districts' => function ($query) {
                        $query->orderBy('name', 'asc');
                    }
                ]);
            }
        ])
            ->orderBy('name', 'asc')
            ->get();

        $data = $departments->transform(function ($department) {
            return [
                'value' => $department->id,
                'label' => $department->name,
                'data' => $department->provinces->transform(function ($province) {
                    return [
                        'value' => $province->id,
                        'label' => $province->name,
                        'data' => $province->districts->transform(function ($district) {
                            return [
                                'value' => $district->id,
                                'label' => $district->name,
                            ];
                        }),
                    ];
                }),
            ];
        });

        return response($data, 200);
    }

    public function getAppointments($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response([
                'message' => 'Paciente no encontrado',
                'error' => 'El paciente con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }
        $appointments = $patient->appointments()->orderBy('date', 'desc')->get()->transform(function ($appointment) {
            return [
                'id' => $appointment->id,
                'date' => $appointment->date,
                'hour' => $appointment->hour,
                'doctor' => $appointment->medicalRecord->doctor->fullName,
                'specialty' => $appointment->medicalRecord->doctor->specialty->name,
                'reason' => $appointment->reason,
                'status' => $appointment->status
            ];
        });

        return $appointments;
    }

    public function getAppointmentsReport($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'message' => 'Paciente no encontrado',
                'error' => 'El paciente con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        $patientData = [
            'fullName' => $patient->fullName,
            'firstName' => $patient->firstName,
            'lastName' => $patient->lastName,
            'age' => $patient->age,
            'documentNumber' => $patient->documentNumber,
            'birthdate' => $patient->birthdate,
            'sex' => $patient->sex,
            'contactNumber' => $patient->contactNumber,
            'address' => $patient->address,
            'placeOfBirth' => $patient->placeOfBirth,
            'position' => $patient->position->name ?? null,
            'dependence' => $patient->dependence->name ?? null,
            'email' => $patient->email,
            'documentTypeAbreviated' => $patient->documentTypeAbreviated
        ];

        $appointments = $patient->appointments()
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($appointment) {
                return [
                    'date' => $appointment->date,
                    'hour' => $appointment->hour,
                    'doctor' => $appointment->medicalRecord->doctor->fullName,
                    'specialty' => $appointment->medicalRecord->doctor->specialty->name,
                    'reason' => $appointment->reason,
                    'status' => $appointment->status
                ];
            });

        $data = [
            'patient' => $patientData,
            'appointments' => $appointments
        ];

        $pdf = PDF::loadView('reports.appointments-report', $data);

        $nameFile = 'Historial de citas médicas - ' . $patient->fullName . ' - ' . now()->format('Y-m-d') . '.pdf';

        return $pdf->stream($nameFile);
    }

    public function getPatientOptions(Request $request)
    {
        $search = $request->search;
        $withData = $request->withData;

        // $patients = Patient::search($search)->take(8)->get();
        $patients = Patient::searchDocumentOrName($search)->limit(7)->get();

        $sortedPatients = $patients->sortBy(function ($patient) use ($search) {
            return levenshtein(
                strtolower($search),
                strtolower($patient->fullName)
            );
        });

        return $sortedPatients->values()
            ->transform(function ($patient) use ($withData) {
                return [
                    'value' => $patient->id,
                    'label' => $patient->fullName . ' (N° Documento: ' . $patient->documentNumber . ')',
                    'data' => $withData ? [
                        'fullName' => $patient->fullName,
                        'documentNumber' => $patient->documentNumber,
                        'documentType' => $patient->documentType,
                        'position' => $patient->position->name ?? null,
                        'dependence' => $patient->dependence->name ?? null,
                    ] : null
                ];
            });
    }

}