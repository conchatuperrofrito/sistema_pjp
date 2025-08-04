<?php

namespace App\Http\Controllers;

use App\Http\Requests\EppDeliveryRequest;
use App\Models\EppDelivery;
use Barryvdh\DomPDF\Facade\Pdf;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EppDeliveryController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        $deliveries = EppDelivery::with(['patient.position', 'patient.dependence']);

        if ($request->filterValue) {
            $deliveries->whereHas('patient', function ($query) use ($request) {
                $query->where('first_name', 'like', "%{$request->filterValue}%")
                    ->orWhere('last_name', 'like', "%{$request->filterValue}%")
                    ->orWhere('document_number', 'like', "%{$request->filterValue}%");
            });
        }

        if ($request->condition) {
            $deliveries->where('condition', $request->condition);
        }

        if ($column && $direction) {
            if ($column === 'patientFullName') {
                $deliveries->join('patients', 'epp_deliveries.patient_id', '=', 'patients.id')
                    ->orderByRaw("CONCAT(patients.first_name, ' ', patients.last_name) " . ($direction === 'descending' ? 'DESC' : 'ASC'));
            } else {
                $deliveries->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
            }
        }

        $deliveries = $deliveries->paginate($request->rowsPerPage ?? 5);

        $deliveries->getCollection()->transform(function ($delivery) {
            return [
                'id' => $delivery->id,
                'date' => $delivery->date,
                'eppItem' => $delivery->epp_item,
                'quantity' => $delivery->quantity,
                'condition' => $delivery->condition,
                'observations' => $delivery->observations,
                'patientFullName' => $delivery->patient->fullName,
                'patientId' => $delivery->patient_id,
                'createdAt' => $delivery->created_at->format('d-m-Y h:i A'),
            ];
        });

        return $deliveries;
    }

    public function store(EppDeliveryRequest $request)
    {
        DB::transaction(function () use ($request) {
            $delivery = new EppDelivery();
            $delivery->date = $request->date;
            $delivery->patient_id = $request->patientId;
            $delivery->epp_item = $request->eppItem;
            $delivery->quantity = $request->quantity;
            $delivery->condition = $request->condition;
            $delivery->observations = $request->observations;
            $delivery->save();

            return response([
                'message' => 'Entrega de EPP registrada correctamente'
            ], 201);
        });
    }

    public function update(EppDeliveryRequest $request)
    {
        DB::transaction(function () use ($request) {
            $delivery = EppDelivery::find($request->id);

            if (!$delivery) {
                return response([
                    'message' => 'Entrega de EPP no encontrada',
                    'error' => 'La entrega de EPP no existe en la base de datos',
                    'type' => 'not_found'
                ], 404);
            }

            $delivery->date = $request->date;
            $delivery->patient_id = $request->patientId;
            $delivery->epp_item = $request->eppItem;
            $delivery->quantity = $request->quantity;
            $delivery->condition = $request->condition;
            $delivery->observations = $request->observations;
            $delivery->save();

            return response(['message' => 'Entrega de EPP actualizada correctamente'], 200);
        });
    }

    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $delivery = EppDelivery::find($id);

            if (!$delivery) {
                return response([
                    'message' => 'Entrega de EPP no encontrada',
                    'error' => 'La entrega de EPP con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $delivery->delete();

            return response(['message' => 'Entrega de EPP eliminada correctamente'], 200);
        });
    }

    public function show($id)
    {
        $delivery = EppDelivery::with(['patient.position', 'patient.dependence'])->find($id);

        if (!$delivery) {
            return response([
                'message' => 'Entrega de EPP no encontrada',
                'error' => 'La entrega de EPP con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        return response([
            'id' => $delivery->id,
            'date' => $delivery->date,
            'eppItem' => $delivery->epp_item,
            'quantity' => $delivery->quantity,
            'condition' => $delivery->condition,
            'observations' => $delivery->observations,
            'patientFullName' => $delivery->patient->fullName,
            'patientId' => $delivery->patient_id,
            'createdAt' => $delivery->created_at->format('d-m-Y h:i A')
        ], 200);
    }

    public function getEppDeliveryReport($id)
    {
        $delivery = EppDelivery::with(['patient.position', 'patient.dependence'])->find($id);

        if (!$delivery) {
            return response()->json([
                'message' => 'Entrega de EPP no encontrada',
                'error' => 'La entrega de EPP con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        $data = [
            'date' => $delivery->date,
            'eppItem' => $delivery->epp_item,
            'quantity' => $delivery->quantity,
            'condition' => $delivery->condition,
            'observations' => $delivery->observations,
            'patientFullName' => $delivery->patient->fullName,
            'patientDocument' => $delivery->patient->documentTypeAbreviated . ' - ' . $delivery->patient->document_number,
            'patientBirthdate' => $delivery->patient->birthdate,
            'patientEmail' => $delivery->patient->email,
            'patientAddress' => $delivery->patient->address,
            'patientContactNumber' => $delivery->patient->contact_number,
            'patientPlaceOfBirth' => $delivery->patient->place_of_birth,
            'patientAge' => $delivery->patient->age,
            'patientSex' => $delivery->patient->sex,
            'patientPosition' => $delivery->patient->position->name ?? 'No especificado',
            'patientDependence' => $delivery->patient->dependence->name ?? 'No especificado',
            'createdAt' => $delivery->created_at->format('d/m/Y h:i A')
        ];

        $pdf = PDF::loadView('reports.epp-delivery-report', $data);

        $nameFile = 'Reporte de Entrega de EPP - ' . $delivery->patient->fullName . ' - ' . $delivery->date . '.pdf';

        return $pdf->stream($nameFile);
    }
}