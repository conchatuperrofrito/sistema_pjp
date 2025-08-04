<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccidentRequest;
use App\Models\Accident;
use Barryvdh\DomPDF\Facade\Pdf;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AccidentController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        $accidents = Accident::with(['patient']);

        if ($request->filterValue) {
            $accidents->whereHas('patient', function ($query) use ($request) {
                $query->where('first_name', 'like', "%{$request->filterValue}%")
                    ->orWhere('last_name', 'like', "%{$request->filterValue}%")
                    ->orWhere('document_number', 'like', "%{$request->filterValue}%");
            });
        }

        if ($request->eventType) {
            $accidents->where('event_type', $request->eventType);
        }

        if ($column && $direction) {
            if ($column === 'patientFullName') {
                $accidents->join('patients', 'accidents.patient_id', '=', 'patients.id')
                    ->orderByRaw("CONCAT(patients.first_name, ' ', patients.last_name) " . ($direction === 'descending' ? 'DESC' : 'ASC'));
            } else {
                $accidents->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
            }
        }

        $accidents = $accidents->paginate($request->rowsPerPage ?? 5);

        $accidents->getCollection()->transform(function ($accident) {
            return [
                'id' => $accident->id,
                'date' => $accident->date,
                'hour' => $accident->hour,
                'eventType' => $accident->event_type,
                'patientFullName' => $accident->patient_full_name,
                'patientId' => $accident->patient_id,
                'description' => $accident->description,
                'probableCause' => $accident->probable_cause,
                'consequences' => $accident->consequences,
                'correctiveActions' => $accident->corrective_actions,
                'responsible' => $accident->responsible,
                'createdAt' => $accident->created_at->format('d-m-Y h:i A'),
            ];
        });

        return $accidents;
    }

    public function store(AccidentRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $accident = new Accident();

            $accident->date = $request->date;
            $accident->hour = $request->hour;
            $accident->event_type = $request->eventType;
            $accident->patient_id = $request->patientId;
            $accident->description = $request->description;
            $accident->probable_cause = $request->probableCause;
            $accident->consequences = $request->consequences;
            $accident->corrective_actions = $request->correctiveActions;
            $accident->responsible = $request->responsible;
            $accident->save();

            return response([
                'message' => 'Accidente registrado correctamente'
            ], 201);
        });
    }

    public function update(AccidentRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $accident = Accident::find($request->id);

            if (!$accident) {
                return response([
                    'message' => 'Accidente no encontrado',
                    'error' => 'El accidente no existe en la base de datos',
                    'type' => 'not_found'
                ], 404);
            }

            $accident->date = $request->date;
            $accident->hour = $request->hour;
            $accident->event_type = $request->eventType;
            $accident->patient_id = $request->patientId;
            $accident->description = $request->description;
            $accident->probable_cause = $request->probableCause;
            $accident->consequences = $request->consequences;
            $accident->corrective_actions = $request->correctiveActions;
            $accident->responsible = $request->responsible;
            $accident->save();

            return response(['message' => 'Accidente actualizado correctamente'], 200);
        });
    }

    public function destroy($id)
    {
        return DB::transaction(function () use ($id) {
            $accident = Accident::find($id);

            if (!$accident) {
                return response([
                    'message' => 'Accidente no encontrado',
                    'error' => 'El accidente con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $accident->delete();

            return response(['message' => 'Accidente eliminado correctamente'], 200);
        });
    }

    public function show($id)
    {
        try {
            $accident = Accident::with(['patient'])->find($id);

            if (!$accident) {
                return response([
                    'message' => 'Accidente no encontrado',
                    'error' => 'El accidente con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            return response([
                'id' => $accident->id,
                'date' => $accident->date,
                'hour' => explode(" ", $accident->hour)[0],
                'eventType' => $accident->event_type,
                'patientFullName' => $accident->patient_full_name,
                'patientId' => $accident->patient_id,
                'description' => $accident->description,
                'probableCause' => $accident->probable_cause,
                'consequences' => $accident->consequences,
                'correctiveActions' => $accident->corrective_actions,
                'responsible' => $accident->responsible,
                'createdAt' => $accident->created_at->format('d-m-Y h:i A')
            ], 200);
        } catch (\Exception $e) {
            return response([
                'message' => 'Error al obtener el accidente',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'model' => Accident::class,
                'code' => $e->getCode()
            ], 500);
        }
    }

    public function getAccidentReport($id)
    {
        $accident = Accident::with(['patient'])->find($id);

        if (!$accident) {
            return response()->json([
                'message' => 'Accidente no encontrado',
                'error' => 'El accidente con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        $accidentData = [
            'date' => $accident->date,
            'hour' => $accident->hour,
            'eventType' => $accident->event_type,
            'patientFullName' => $accident->patient->fullName,
            'patientDocument' => $accident->patient->documentTypeAbreviated . ' - ' . $accident->patient->document_number,
            'patientBirthdate' => $accident->patient->birthdate,
            'patientEmail' => $accident->patient->email,
            'patientAddress' => $accident->patient->address,
            'patientContactNumber' => $accident->patient->contact_number,
            'patientPlaceOfBirth' => $accident->patient->place_of_birth,
            'patientAge' => $accident->patient->age,
            'patientSex' => $accident->patient->sex,
            'patientPosition' => $accident->patient->position->name ?? 'No especificado',
            'patientDependence' => $accident->patient->dependence->name ?? 'No especificado',
            'description' => $accident->description,
            'probableCause' => $accident->probable_cause,
            'consequences' => $accident->consequences,
            'correctiveActions' => $accident->corrective_actions,
            'responsible' => $accident->responsible,
            'createdAt' => $accident->created_at->format('d/m/Y h:i A')
        ];

        $pdf = PDF::loadView('reports.accident-report', $accidentData);

        $nameFile = 'Reporte de Accidente - ' . $accident->patient->fullName . ' - ' . $accident->date . '.pdf';

        return $pdf->stream($nameFile);
    }
}