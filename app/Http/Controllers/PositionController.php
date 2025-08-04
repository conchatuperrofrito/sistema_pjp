<?php

namespace App\Http\Controllers;

use App\Http\Requests\PositionRequest;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PositionController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        if ($request->filterValue) {
            $searchResults = Position::searchName($request->filterValue)->get();
            $positionIds = $searchResults->pluck('id')->toArray();
            $positions = Position::whereIn('id', $positionIds);
        } else {
            $positions = Position::query();
        }

        if ($column && $direction) {
            $positions->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
        }

        $positions = $positions->paginate($request->rowsPerPage ?? 5);

        $positions->getCollection()->transform(function ($position) {
            return [
                'id' => $position->id,
                'name' => $position->name,
                'createdAt' => $position->created_at->format('d-m-Y h:i A'),
            ];
        });

        return $positions;
    }

    public function store(PositionRequest $request)
    {
        DB::transaction(function () use ($request) {
            $position = Position::create($request->validated());

            return response([
                'message' => 'Cargo registrado correctamente',
                'data' => [
                    'positionId' => $position->id
                ]
            ], 201);
        });
    }

    public function update(PositionRequest $request)
    {
        DB::transaction(function () use ($request) {
            $position = Position::find($request->id);

            if (!$position) {
                return response([
                    'message' => 'Cargo no encontrado',
                    'error' => 'El cargo con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $position->update($request->validated());

            return response(['message' => 'Cargo actualizado correctamente'], 200);
        });

    }

    public function show($id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response([
                'message' => 'Cargo no encontrado',
                'error' => 'El cargo con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        return response([
            'name' => $position->name
        ], 200);
    }

    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $position = Position::find($id);

            if (!$position) {
                return response([
                    'message' => 'Cargo no encontrado',
                    'error' => 'El cargo con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $position->delete();

            return response(['message' => 'Cargo eliminado correctamente'], 200);
        });
    }

    public function getOptions()
    {
        $positions = Position::orderBy('name')->get();

        return $positions->transform(function ($position) {
            return [
                'value' => $position->id,
                'label' => $position->name,
            ];
        });
    }
}