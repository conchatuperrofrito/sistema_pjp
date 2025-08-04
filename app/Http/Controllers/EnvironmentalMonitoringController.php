<?php

namespace App\Http\Controllers;

use App\Http\Requests\EnvironmentalMonitoringRequest;
use App\Models\EnvironmentalMonitoring;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use DB;

class EnvironmentalMonitoringController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        $query = EnvironmentalMonitoring::query();

        if ($request->filterValue) {
            $query->where('area', 'like', "%{$request->filterValue}%")
                ->orWhere('agent_type', 'like', "%{$request->filterValue}%");
        }

        if ($column && $direction) {
            $query->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
        }

        $monitorings = $query->paginate($request->rowsPerPage ?? 5);

        $monitorings->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'area' => $item->area,
                'agentType' => $item->agent_type,
                'agentDescription' => $item->agent_description,
                'measuredValue' => $item->measured_value,
                'unit' => $item->unit,
                'permittedLimit' => $item->permitted_limit,
                'measurementDate' => $item->measurement_date,
                'frequency' => $item->frequency,
                'responsible' => $item->responsible,
                'observations' => $item->observations,
                'createdAt' => $item->created_at->format('d-m-Y h:i A'),
            ];
        });

        return $monitorings;
    }

    public function store(EnvironmentalMonitoringRequest $request)
    {
        DB::transaction(function () use ($request) {
            $monitoring = new EnvironmentalMonitoring();
            $monitoring->area = $request->area;
            $monitoring->agent_type = $request->agentType;
            $monitoring->agent_description = $request->agentDescription;
            $monitoring->measured_value = $request->measuredValue;
            $monitoring->unit = $request->unit;
            $monitoring->permitted_limit = $request->permittedLimit;
            $monitoring->measurement_date = $request->measurementDate;
            $monitoring->frequency = $request->frequency;
            $monitoring->responsible = $request->responsible;
            $monitoring->observations = $request->observations;
            $monitoring->save();
            return response(['message' => 'Monitoreo ambiental registrado correctamente'], 201);
        });
    }

    public function update(EnvironmentalMonitoringRequest $request)
    {
        DB::transaction(function () use ($request) {
            $monitoring = EnvironmentalMonitoring::find($request->id);
            if (!$monitoring) {
                return response([
                    'message' => 'Monitoreo ambiental no encontrado',
                    'error' => 'El monitoreo ambiental no existe en la base de datos',
                    'type' => 'not_found'
                ], 404);
            }
            $monitoring->area = $request->area;
            $monitoring->agent_type = $request->agentType;
            $monitoring->agent_description = $request->agentDescription;
            $monitoring->measured_value = $request->measuredValue;
            $monitoring->unit = $request->unit;
            $monitoring->permitted_limit = $request->permittedLimit;
            $monitoring->measurement_date = $request->measurementDate;
            $monitoring->frequency = $request->frequency;
            $monitoring->responsible = $request->responsible;
            $monitoring->observations = $request->observations;
            $monitoring->save();
            return response(['message' => 'Monitoreo ambiental actualizado correctamente'], 200);
        });
    }

    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $monitoring = EnvironmentalMonitoring::find($id);
            if (!$monitoring) {
                return response([
                    'message' => 'Monitoreo ambiental no encontrado',
                    'error' => 'El monitoreo ambiental con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }
            $monitoring->delete();
            return response(['message' => 'Monitoreo ambiental eliminado correctamente'], 200);
        });
    }

    public function show($id)
    {
        $monitoring = EnvironmentalMonitoring::find($id);

        if (!$monitoring) {
            return response([
                'message' => 'Monitoreo ambiental no encontrado',
                'error' => 'El monitoreo ambiental con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        return response([
            'id' => $monitoring->id,
            'area' => $monitoring->area,
            'agentType' => $monitoring->agent_type,
            'agentDescription' => $monitoring->agent_description,
            'measuredValue' => $monitoring->measured_value,
            'unit' => $monitoring->unit,
            'permittedLimit' => $monitoring->permitted_limit,
            'measurementDate' => $monitoring->measurement_date,
            'frequency' => $monitoring->frequency,
            'responsible' => $monitoring->responsible,
            'observations' => $monitoring->observations,
            'createdAt' => $monitoring->created_at->format('d-m-Y h:i A')
        ], 200);
    }

    public function getEnvironmentalMonitoringReport($id)
    {
        $monitoring = EnvironmentalMonitoring::find($id);

        if (!$monitoring) {
            return response()->json([
                'message' => 'Monitoreo ambiental no encontrado',
                'error' => 'El monitoreo ambiental con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        $data = [
            'area' => $monitoring->area,
            'agentType' => $monitoring->agent_type,
            'agentDescription' => $monitoring->agent_description,
            'measuredValue' => $monitoring->measured_value,
            'unit' => $monitoring->unit,
            'permittedLimit' => $monitoring->permitted_limit,
            'measurementDate' => $monitoring->measurement_date,
            'frequency' => $monitoring->frequency,
            'responsible' => $monitoring->responsible,
            'observations' => $monitoring->observations,
            'createdAt' => $monitoring->created_at->format('d-m-Y h:i A'),
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.environmental-monitoring-report', $data);
        $nameFile = 'Reporte de Monitoreo Ambiental - ' . $monitoring->area . ' - ' . $monitoring->measurement_date . '.pdf';
        return $pdf->stream($nameFile);
    }
}