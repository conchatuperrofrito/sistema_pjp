<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitteeMinuteRequest;
use App\Models\CommitteeMinute;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use DB;

class CommitteeMinuteController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        $query = CommitteeMinute::query();

        if ($request->filterValue) {
            $query->where('topics', 'like', "%{$request->filterValue}%")
                ->orWhere('followup_responsible', 'like', "%{$request->filterValue}%");
        }

        if ($column && $direction) {
            $query->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
        }

        $minutes = $query->paginate($request->rowsPerPage ?? 5);

        $minutes->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'date' => $item->date,
                'topics' => $item->topics,
                'agreements' => $item->agreements,
                'followupResponsible' => $item->followup_responsible,
                'nextMeetingDate' => $item->next_meeting_date,
                'createdAt' => $item->created_at->format('d-m-Y h:i A'),
            ];
        });

        return $minutes;
    }

    public function store(CommitteeMinuteRequest $request)
    {
        DB::transaction(function () use ($request) {
            $minute = new CommitteeMinute();
            $minute->date = $request->date;
            $minute->topics = $request->topics;
            $minute->agreements = $request->agreements;
            $minute->followup_responsible = $request->followupResponsible;
            $minute->next_meeting_date = $request->nextMeetingDate;
            $minute->save();
            return response(['message' => 'Acta de comité registrada correctamente'], 201);
        });
    }

    public function update(CommitteeMinuteRequest $request)
    {
        DB::transaction(function () use ($request) {
            $minute = CommitteeMinute::find($request->id);
            if (!$minute) {
                return response([
                    'message' => 'Acta de comité no encontrada',
                    'error' => 'El acta de comité no existe en la base de datos',
                    'type' => 'not_found'
                ], 404);
            }
            $minute->date = $request->date;
            $minute->topics = $request->topics;
            $minute->agreements = $request->agreements;
            $minute->followup_responsible = $request->followupResponsible;
            $minute->next_meeting_date = $request->nextMeetingDate;
            $minute->save();
            return response(['message' => 'Acta de comité actualizada correctamente'], 200);
        });
    }

    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $minute = CommitteeMinute::find($id);
            if (!$minute) {
                return response([
                    'message' => 'Acta de comité no encontrada',
                    'error' => 'El acta de comité con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }
            $minute->delete();
            return response(['message' => 'Acta de comité eliminada correctamente'], 200);
        });
    }

    public function show($id)
    {
        $minute = CommitteeMinute::find($id);

        if (!$minute) {
            return response([
                'message' => 'Acta de comité no encontrada',
                'error' => 'El acta de comité con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }
        return response([
            'id' => $minute->id,
            'date' => $minute->date,
            'topics' => $minute->topics,
            'agreements' => $minute->agreements,
            'followupResponsible' => $minute->followup_responsible,
            'nextMeetingDate' => $minute->next_meeting_date,
            'createdAt' => $minute->created_at->format('d-m-Y h:i A')
        ], 200);
    }

    public function getCommitteeMinuteReport($id)
    {
        $minute = CommitteeMinute::find($id);

        if (!$minute) {
            return response()->json([
                'message' => 'Acta de comité no encontrada',
                'error' => 'El acta de comité con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        $data = [
            'date' => $minute->date,
            'topics' => $minute->topics,
            'agreements' => $minute->agreements,
            'followupResponsible' => $minute->followup_responsible,
            'nextMeetingDate' => $minute->next_meeting_date,
            'createdAt' => $minute->created_at->format('d-m-Y h:i A'),
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.committee-minute-report', $data);
        $nameFile = 'Acta de Comité - ' . $minute->date . '.pdf';
        return $pdf->stream($nameFile);
    }
}