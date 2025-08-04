<?php

namespace Database\Factories;

use App\Models\Medication;
use App\Models\Prescription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Prescription>
 */
class PrescriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $notesOptions = [
            'Tomar con el estómago lleno para evitar malestar gástrico',
            'No consumir alcohol durante el tratamiento',
            'Mantener la cadena de frío del medicamento',
            'Tomar el medicamento a la misma hora todos los días',
            'En caso de olvidar una dosis, no duplicar la siguiente',
            'Puede causar somnolencia, evitar conducir',
            'Completar todo el tratamiento aunque los síntomas mejoren',
            'Si presenta reacción alérgica, suspender y consultar',
            'Tomar con abundante agua',
            'No partir ni triturar las tabletas'
        ];

        return [
            'notes' => $this->faker->randomElement($notesOptions),
        ];
    }


    public function configure(): self
    {
        return $this->afterCreating(function (Prescription $prescription) {

            $medications = Medication::inRandomOrder()->take(rand(1, 5))->get();

            $frequencyOptions = [
                '4',
                '6',
                '8',
                '12',
                '24'
            ];

            $instructionsOptions = [
                'Tomar con abundante agua',
                'No partir ni triturar las tabletas',
                'Mantener la cadena de frío del medicamento',
                'Tomar el medicamento a la misma hora todos los días',
                'En caso de olvidar una dosis, no duplicar la siguiente',
            ];

            $pivotMedications = $medications->map(function ($medication) use ($prescription, $frequencyOptions, $instructionsOptions) {
                $frequency = $this->faker->randomElement($frequencyOptions);
                $duration = rand(1, 14);
                $quantity = $frequency * $duration;

                return [
                    'medication_id' => $medication->id,
                    'prescription_id' => $prescription->id,
                    'frequency' => $frequency,
                    'duration' => $duration,
                    'quantity' => $quantity,
                    'instructions' => $this->faker->boolean(40) ?
                        $this->faker->randomElement($instructionsOptions) : null,
                ];
            })->toArray();

            $prescription->medications()->attach($pivotMedications);
        });
    }
}
