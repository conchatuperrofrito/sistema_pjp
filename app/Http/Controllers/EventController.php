<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddParticipantRequest;
use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\Patient;
use Barryvdh\DomPDF\Facade\Pdf;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        if ($request->filterValue) {
            $events = Event::search($request->filterValue);
        } else {
            $events = Event::query();
        }

        if ($column && $direction) {
            $events->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
        }

        $events = $events->paginate($request->rowsPerPage ?? 5);

        $events->getCollection()->transform(function ($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'subtitle' => $event->subtitle,
                'description' => $event->description,
                'venueName' => $event->venueName,
                'venueAddress' => $event->venueAddress,
                'targetAudience' => $event->targetAudience,
                'organizer' => $event->organizer,
                'organizingArea' => $event->organizingArea,
                'schedules' => $event->schedules->map(function ($schedule) {
                    return [
                        'date' => $schedule->date,
                        'startTime' => $schedule->startTime,
                        'endTime' => $schedule->endTime,
                    ];
                }),
                'createdBy' => $event->user->fullName,
                'createdAt' => $event->created_at->format('d-m-Y h:i A'),
            ];
        });

        return $events;
    }

    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {

            $data = $request->all();
            $data['userId'] = auth()->user()->id;
            $event = Event::create($data);

            $event->schedules()->createMany($request->schedules);

            return response([
                'message' => 'Evento registrado correctamente',
                'data' => [
                    'eventId' => $event->id
                ]
            ], 201);

        });
    }

    public function show($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response([
                'message' => 'Evento no encontrado',
                'error' => 'El evento con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        return response([
            'id' => $event->id,
            'title' => $event->title,
            'subtitle' => $event->subtitle,
            'description' => $event->description,
            'venueName' => $event->venueName,
            'venueAddress' => $event->venueAddress,
            'targetAudience' => $event->targetAudience,
            'organizer' => $event->organizer,
            'organizingArea' => $event->organizingArea,
            'schedules' => $event->schedules->map(function ($schedule) {
                return [
                    'date' => Carbon::parse($schedule->date)->format('Y-m-d'),
                    'startTime' => Carbon::parse($schedule->startTime)->format('H:i'),
                    'endTime' => Carbon::parse($schedule->endTime)->format('H:i'),
                ];
            }),
            'createdBy' => $event->user->fullName,
            'createdAt' => $event->created_at->format('d-m-Y h:i A'),
        ], 200);
    }

    public function update(Request $request)
    {
        DB::transaction(function () use ($request) {
            $event = Event::find($request->id);

            if (!$event) {
                return response([
                    'message' => 'Evento no encontrado',
                    'error' => 'El evento con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $event->update($request->all());
            $event->schedules()->delete();
            $event->schedules()->createMany($request->schedules);

            return response([
                'message' => 'Evento actualizado correctamente',
            ], 200);
        });
    }


    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $event = Event::find($id);

            if (!$event) {
                return response([
                    'message' => 'Evento no encontrado',
                    'error' => 'El evento con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $event->schedules()->delete();
            $event->delete();

            return response([
                'message' => 'Evento eliminado correctamente',
            ], 200);
        });
    }

    public function getParticipants(Request $request)
    {
        $event = Event::find($request->id);

        if (!$event) {
            return response([
                'message' => 'Evento no encontrado',
                'error' => 'El evento con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        $patientsIds = $event->participants()->pluck('patient_id');

        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        $patients = Patient::whereIn('id', $patientsIds);

        if ($request->filterValue) {
            $patients = $patients->searchDocumentOrName($request->filterValue);
        }

        if ($column && $direction) {
            $patients->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
        }

        $patients = $patients->paginate($request->rowsPerPage ?? 5);
        $patients->getCollection()->transform(function ($patient) {
            return [
                'id' => $patient->id,
                'fullName' => $patient->fullName,
                'documentNumber' => $patient->documentNumber,
                'documentType' => $patient->documentType,
                'position' => $patient->position->name,
                'createdAt' => $patient->created_at->format('d-m-Y h:i A'),
            ];
        });

        return [
            'patients' => $patients,
            'participants' => $event->participants->pluck('id')->toArray(),
        ];
    }
    public function addParticipant(AddParticipantRequest $request)
    {
        DB::transaction(function () use ($request) {
            $event = Event::find($request->id);

            if (!$event) {
                return response([
                    'message' => 'Evento no encontrado',
                    'error' => 'El evento con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            if ($request->documentNumber) {
                $patient = Patient::where('document_number', $request->documentNumber)->first();

                $patientId = $patient->id;
            } else {
                $patientId = $request->patientId;
            }

            if (!$patientId) {
                return response([
                    'message' => 'Paciente no encontrado',
                    'error' => 'El paciente no está registrado',
                    'type' => 'not_found'
                ], 404);
            }

            $exists = $event->participants()->where('patient_id', $patientId)->exists();

            if ($exists) {
                return response([
                    'message' => 'El participante ya está registrado en este evento',
                    'type' => 'duplicate'
                ], 400);
            }

            $event->participants()->attach($patientId);

            return response([
                'message' => 'Participante agregado correctamente',
            ], 200);
        });
    }

    public function removeParticipant(Request $request)
    {
        $event = Event::find($request->id);

        if (!$event) {
            return response([
                'message' => 'Evento no encontrado',
                'error' => 'El evento con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        $event->participants()->detach($request->patientId);

        return response([
            'message' => 'Participante eliminado correctamente'
        ], 200);
    }

    public function eventReport($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response([
                'message' => 'Evento no encontrado',
                'error' => 'El evento con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }

        $pdf = PDF::loadView('reports.event-report', [
            'event' => collect($event->toArray())
                ->except(['id', 'createdAt', 'updatedAt'])->all(),
            'user' => collect($event->user->toArray())
                ->except(['id', 'createdAt', 'updatedAt'])->all(),
            'participants' => $event->participants->map(function ($participant) {
                return [
                    'id' => $participant->id,
                    'fullName' => $participant->fullName,
                    'documentTypeAbreviated' => $participant->documentTypeAbreviated,
                    'documentNumber' => $participant->documentNumber,
                    'position' => $participant->position->name
                ];
            })
        ]);

        $fileName = 'Reporte de Evento - ' . $event->title . ' - ' . now()->format('Y-m-d') . '.pdf';

        return $pdf->stream($fileName);
    }

}