<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionRequest;
use App\Models\Inspection;
use Barryvdh\DomPDF\Facade\Pdf;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InspectionController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        $inspections = Inspection::query();

        if ($request->filterValue) {
            $inspections->where(function ($query) use ($request) {
                $query->where('area', 'like', "%{$request->filterValue}%")
                    ->orWhere('inspector', 'like', "%{$request->filterValue}%")
                    ->orWhere('correction_responsible', 'like', "%{$request->filterValue}%");
            });
        }

        if ($request->severity) {
            $inspections->where('severity', $request->severity);
        }

        if ($column && $direction) {
            $inspections->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
        }

        $inspections = $inspections->paginate($request->rowsPerPage ?? 5);

        $inspections->getCollection()->transform(function ($inspection) {
            return [
                'id' => $inspection->id,
                'date' => $inspection->date,
                'area' => $inspection->area,
                'inspector' => $inspection->inspector,
                'findings' => $inspection->findings,
                'severity' => $inspection->severity,
                'recommendations' => $inspection->recommendations,
                'correctionDeadline' => $inspection->correction_deadline,
                'correctionResponsible' => $inspection->correction_responsible,
                'createdAt' => $inspection->created_at->format('d-m-Y h:i A'),
            ];
        });

        return $inspections;
    }

    public function store(InspectionRequest $request)
    {
        DB::transaction(function () use ($request) {
            $inspection = new Inspection();

            $inspection->date = $request->date;
            $inspection->area = $request->area;
            $inspection->inspector = $request->inspector;
            $inspection->findings = $request->findings;
            $inspection->severity = $request->severity;
            $inspection->recommendations = $request->recommendations;
            $inspection->correction_deadline = $request->correctionDeadline;
            $inspection->correction_responsible = $request->correctionResponsible;
            $inspection->save();

            return response([
                'message' => 'Inspección registrada correctamente'
            ], 201);
        });
    }

    public function update(InspectionRequest $request)
    {
        DB::transaction(function () use ($request) {
            $inspection = Inspection::find($request->id);

            if (!$inspection) {
                return response([
                    'message' => 'Inspección no encontrada',
                    'error' => 'La inspección no existe en la base de datos',
                    'type' => 'not_found'
                ], 404);
            }

            $inspection->date = $request->date;
            $inspection->area = $request->area;
            $inspection->inspector = $request->inspector;
            $inspection->findings = $request->findings;
            $inspection->severity = $request->severity;
            $inspection->recommendations = $request->recommendations;
            $inspection->correction_deadline = $request->correctionDeadline;
            $inspection->correction_responsible = $request->correctionResponsible;
            $inspection->save();

            return response(['message' => 'Inspección actualizada correctamente'], 200);
        });
    }

    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $inspection = Inspection::find($id);

            if (!$inspection) {
                return response([
                    'message' => 'Inspección no encontrada',
                    'error' => 'La inspección con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $inspection->delete();

            return response(['message' => 'Inspección eliminada correctamente'], 200);
        });
    }

    public function show($id)
    {
        $inspection = Inspection::find($id);

        if (!$inspection) {
            return response([
                'message' => 'Inspección no encontrada',
                'error' => 'La inspección con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        return response([
            'id' => $inspection->id,
            'date' => $inspection->date,
            'area' => $inspection->area,
            'inspector' => $inspection->inspector,
            'findings' => $inspection->findings,
            'severity' => $inspection->severity,
            'recommendations' => $inspection->recommendations,
            'correctionDeadline' => $inspection->correction_deadline,
            'correctionResponsible' => $inspection->correction_responsible,
            'createdAt' => $inspection->created_at->format('d-m-Y h:i A')
        ], 200);
    }

    public function getInspectionReport($id)
    {
        $inspection = Inspection::find($id);

        if (!$inspection) {
            return response()->json([
                'message' => 'Inspección no encontrada',
                'error' => 'La inspección con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        $inspectionData = [
            'date' => $inspection->date,
            'area' => $inspection->area,
            'inspector' => $inspection->inspector,
            'findings' => $inspection->findings,
            'severity' => $inspection->severity,
            'recommendations' => $inspection->recommendations,
            'correctionDeadline' => $inspection->correction_deadline,
            'correctionResponsible' => $inspection->correction_responsible,
            'createdAt' => $inspection->created_at->format('d/m/Y h:i A')
        ];

        $pdf = PDF::loadView('reports.inspection-report', $inspectionData);

        $nameFile = 'Reporte de Inspección - ' . $inspection->area . ' - ' . $inspection->date . '.pdf';

        return $pdf->stream($nameFile);
    }
}