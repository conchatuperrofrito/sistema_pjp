<?php

namespace App\Http\Controllers;

use App\Http\Requests\DependenceRequest;
use App\Models\Dependence;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class DependenceController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        if ($request->filterValue) {
            $searchResults = Dependence::searchName($request->filterValue)->get();
            $dependenceIds = $searchResults->pluck('id')->toArray();
            $dependences = Dependence::whereIn('id', $dependenceIds);
        } else {
            $dependences = Dependence::query();
        }

        if ($column && $direction) {
            $dependences->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
        }

        $dependences = $dependences->paginate($request->rowsPerPage ?? 5);

        $dependences->getCollection()->transform(function ($dependence) {
            return [
                'id' => $dependence->id,
                'name' => $dependence->name,
                'createdAt' => $dependence->created_at->format('d-m-Y h:i A'),
            ];
        });

        return $dependences;
    }

    public function store(DependenceRequest $request)
    {
        DB::transaction(function () use ($request) {
            $dependence = Dependence::create($request->validated());

            return response([
                'message' => 'Dependencia registrada correctamente',
                'data' => [
                    'dependenceId' => $dependence->id
                ]
            ], 201);
        });
    }

    public function update(DependenceRequest $request)
    {
        DB::transaction(function () use ($request) {
            $dependence = Dependence::find($request->id);

            if (!$dependence) {
                return response([
                    'message' => 'Dependencia no encontrada',
                    'error' => 'La dependencia con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $dependence->update($request->validated());

            return response(['message' => 'Dependencia actualizada correctamente'], 200);
        });
    }

    public function show($id)
    {
        $dependence = Dependence::find($id);

        if (!$dependence) {
            return response([
                'message' => 'Dependencia no encontrada',
                'error' => 'La dependencia con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        return response([
            'name' => $dependence->name
        ], 200);
    }

    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $dependence = Dependence::find($id);

            if (!$dependence) {
                return response([
                    'message' => 'Dependencia no encontrada',
                    'error' => 'La dependencia con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $dependence->delete();

            return response(['message' => 'Dependencia eliminada correctamente'], 200);
        });
    }

    public function getOptions()
    {
        $dependences = Dependence::orderBy('name')->get();

        return $dependences->transform(function ($dependence) {
            return [
                'value' => $dependence->id,
                'label' => $dependence->name,
            ];
        });
    }
}
