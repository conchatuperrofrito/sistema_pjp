<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use DB;
use Illuminate\Http\Request;
use App\Models\DentalEvolution;
use App\Models\Appointment;
use App\Jobs\GenerateOdontogramImage;
use Spatie\Browsershot\Browsershot;

class DentalEvolutionController extends Controller
{

    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $dentalEvolution = new DentalEvolution();
            $dentalEvolution->date = $request->date;
            $dentalEvolution->odontogram = $request->odontogram;
            $dentalEvolution->specifications = $request->specifications;
            $dentalEvolution->observations = $request->observations;
            $dentalEvolution->basicDentalDischarge = $request->basicDentalDischarge;
            $dentalEvolution->save();

            $appointment = Appointment::find($request->appointmentId);
            $appointment->status = 'Realizada';
            $appointment->save();

            $medicalRecord = $appointment->medicalRecord;
            $medicalRecord->dentalEvolution()->associate($dentalEvolution);
            $medicalRecord->save();

            $imagePath = storage_path("app/odontograms/{$dentalEvolution->id}.png");

            Browsershot::html($request->odontogramHtml)
                ->windowSize(850, 430)
                ->deviceScaleFactor(3)
                ->save($imagePath);

            if (isset($request->prescription["medications"]) && isset($request->prescription["instructions"])) {
                $prescription = new Prescription();
                $prescription->medications = $request->prescription["medications"];
                $prescription->instructions = $request->prescription["instructions"];
                $prescription->notes = $request->prescription["notes"] ?? null;
                $prescription->save();

                $appointment->prescriptionId = $prescription->id;
                $appointment->save();
            }

            // GenerateOdontogramImage::dispatch($request->odontogramHtml, $imagePath);

            return response(['message' => 'Evolución dental registrada correctamente'], 201);
        });
    }


    public function show($id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response(['message' => 'Cita no encontrada'], 404);
        }

        $dentalEvolution = $appointment->medicalRecord->dentalEvolution;

        if ($dentalEvolution) {
            return response([
                'dentalEvolution' => $dentalEvolution,
                'prescription' => $appointment->prescription ?? null
            ], 200);
        } else {
            return response(['message' => 'Evolución dental no encontrada'], 404);
        }
    }

    public function update(Request $request)
    {
        DB::transaction(function () use ($request) {
            $dentalEvolution = DentalEvolution::find($request->id);

            if ($dentalEvolution) {
                $dentalEvolution->date = $request->date;
                $dentalEvolution->odontogram = $request->odontogram;
                $dentalEvolution->specifications = $request->specifications;
                $dentalEvolution->observations = $request->observations;
                $dentalEvolution->basicDentalDischarge = $request->basicDentalDischarge;
                $dentalEvolution->save();

                $imagePath = storage_path("app/odontograms/{$dentalEvolution->id}.png");

                GenerateOdontogramImage::dispatch($request->odontogramHtml, $imagePath);

                $appointment = Appointment::find($request->appointmentId);

                $prescription = Prescription::find($appointment->prescriptionId);

                if ($prescription) {
                    $prescription->medications = $request->prescription["medications"];
                    $prescription->instructions = $request->prescription["instructions"];
                    $prescription->notes = $request->prescription["notes"] ?? null;
                    $prescription->save();
                } else if (isset($request->prescription["medications"]) && isset($request->prescription["instructions"])) {
                    $prescription = new Prescription();
                    $prescription->medications = $request->prescription["medications"];
                    $prescription->instructions = $request->prescription["instructions"];
                    $prescription->notes = $request->prescription["notes"] ?? null;
                    $prescription->save();

                    $appointment->prescriptionId = $prescription->id;
                    $appointment->save();
                }

                return response(['message' => 'Evolución dental actualizada correctamente'], 200);
            } else {
                return response(['message' => 'Evolución dental no encontrada'], 404);
            }
        });
    }
}
