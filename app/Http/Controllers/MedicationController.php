<?php

namespace App\Http\Controllers;

use App\Models\Medication;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\DosageForm;
use App\Http\Requests\MedicationRequest;

class MedicationController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        if ($request->filterValue) {
            $searchResults = Medication::search($request->filterValue)->get();
            $medicationIds = $searchResults->pluck('id')->toArray();
            $medications = Medication::whereIn('id', $medicationIds);
        } else {
            $medications = Medication::query();
        }

        $medications = $medications->where('is_custom', true);

        if ($column && $direction) {
            $medications->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
        }

        $medications = $medications->paginate($request->rowsPerPage ?? 5);

        $medications->getCollection()->transform(function ($medication) {
            return [
                'id' => $medication->id,
                'genericName' => $medication->generic_name,
                'concentration' => $medication->concentration,
                'presentation' => $medication->presentation,
                'dosageForm' => $medication->dosageForm->code,
                'dosageDescription' => $medication->dosageForm->description,
                'createdAt' => $medication->created_at->format('d-m-Y h:i A'),
                'updatedAt' => $medication->updated_at->format('d-m-Y h:i A'),
            ];
        });

        return $medications;
    }

    public function store(MedicationRequest $request)
    {
        DB::transaction(function () use ($request) {
            $medication = Medication::create([
                'genericName' => $request->genericName,
                'concentration' => $request->concentration,
                'presentation' => $request->presentation,
                'dosageFormId' => $request->dosageFormId,
            ]);

            return response([
                'message' => 'Medicamento registrado correctamente',
                'data' => [
                    'medicationId' => $medication->id,
                    'medicationName' => $medication->genericName
                ]
            ], 201);
        });
    }

    public function update(MedicationRequest $request)
    {
        DB::transaction(function () use ($request) {
            $medication = Medication::find($request->id);

            if (!$medication) {
                return response([
                    'message' => 'Medicamento no encontrado',
                    'error' => 'El medicamento con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $medication->update([
                'genericName' => $request->genericName,
                'concentration' => $request->concentration,
                'presentation' => $request->presentation,
                'dosageFormId' => $request->dosageFormId,
            ]);

            return response(['message' => 'Medicamento actualizado correctamente'], 200);
        });
    }

    public function show($id)
    {
        $medication = Medication::find($id);

        if (!$medication) {
            return response([
                'message' => 'Medicamento no encontrado',
                'error' => 'El medicamento con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        return response([
            'genericName' => $medication->genericName,
            'concentration' => $medication->concentration,
            'presentation' => $medication->presentation,
            'dosageFormId' => $medication->dosageFormId,
        ], 200);
    }

    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $medication = Medication::find($id);

            if (!$medication) {
                return response([
                    'message' => 'Medicamento no encontrado',
                    'error' => 'El medicamento con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $medication->delete();

            return response(['message' => 'Medicamento eliminado correctamente'], 200);
        });
    }

    public function getMedicationOptions(Request $request)
    {
        $search = $request->search;
        $limit = 10;

        $query = Medication::query();

        if ($search) {
            $query = Medication::search($search);
        } else {
            $query = Medication::limit($limit);
        }

        $medications = $query->get();

        if ($search) {
            $medications = $medications->sortBy(function ($medication) use ($search) {
                return levenshtein(
                    strtolower($search),
                    strtolower($medication->genericName)
                );
            });
        }

        return $medications->values()->map(function ($medication) {
            return [
                'value' => $medication->id,
                'label' => "{$medication->genericName} {$medication->concentration}" .
                    ($medication->presentation ? " ({$medication->presentation})" : "") .
                    " - {$medication->dosageForm->code}",
                'data' => [
                    'genericName' => $medication->genericName,
                    'concentration' => $medication->concentration,
                    'presentation' => $medication->presentation,
                    'dosageForm' => $medication->dosageForm->code,
                    'dosageDescription' => $medication->dosageForm->description,
                ]
            ];
        });
    }

    public function getDosageForms()
    {
        $dosageForms = DosageForm::select('id', 'code', 'description')
            ->orderBy('code')
            ->get()
            ->map(function ($dosageForm) {
                return [
                    'value' => $dosageForm->id,
                    'label' => $dosageForm->code . ' - ' . $dosageForm->description
                ];
            });

        return $dosageForms;
    }
}
