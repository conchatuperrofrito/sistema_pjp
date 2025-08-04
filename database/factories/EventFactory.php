<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Event;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'title' => fake()->randomElement([
                'Conferencia de Salud Mental',
                'Taller de Nutrición Preventiva',
                'Seminario de Primeros Auxilios',
                'Jornada de Vacunación',
                'Charla sobre Prevención de Enfermedades',
                'Curso de RCP',
                'Simposio de Medicina Integrativa',
                'Workshop de Salud Ocupacional',
                'Foro de Salud Pública',
                'Capacitación en Bioseguridad',
                'Congreso de Pediatría',
                'Seminario de Ginecología',
                'Jornada de Donación de Sangre',
                'Taller de Salud Bucal',
                'Conferencia de Neurología'
            ]),
            'subtitle' => fake()->optional(0.7)->randomElement([
                'Promoviendo la salud integral',
                'Cuidando tu bienestar',
                'Prevención y cuidado',
                'Salud para todos',
                'Innovación en salud',
                'Bienestar y calidad de vida',
                'Salud preventiva',
                'Cuidado y prevención'
            ]),
            'description' => fake()->optional(0.8)->paragraph(),
            'venue_name' => fake()->randomElement([
                'Centro Médico San Lucas',
                'Hospital General',
                'Clínica Santa María',
                'Centro de Convenciones Médicas',
                'Auditorio Municipal',
                'Centro de Salud Comunitario',
                'Universidad de Medicina',
                'Centro de Investigación Médica',
                'Hospital Regional',
                'Centro de Especialidades Médicas'
            ]),
            'venue_address' => fake()->address(),
            'target_audience' => fake()->randomElement([
                'Profesionales de la salud',
                'Estudiantes de medicina',
                'Público en general',
                'Personal médico',
                'Enfermeros y técnicos',
                'Especialistas en salud',
                'Comunidad médica',
                'Personal de salud pública'
            ]),
            'organizer' => fake()->randomElement([
                'Ministerio de Salud',
                'Colegio Médico',
                'Hospital Nacional',
                'Universidad de Medicina',
                'Asociación Médica',
                'Centro de Investigación',
                'Clínica Privada',
                'Organización Mundial de la Salud',
                'Instituto Nacional de Salud',
                'Sociedad Médica'
            ]),
            'organizing_area' => fake()->randomElement([
                'Departamento de Salud Pública',
                'División de Educación Médica',
                'Área de Investigación',
                'Departamento de Prevención',
                'Unidad de Capacitación',
                'División de Especialidades',
                'Área de Desarrollo Profesional',
                'Departamento de Innovación Médica'
            ]),
        ];
    }

    public function configure(): self
    {
        return $this->afterCreating(function (Event $event) {
            $schedules = [];
            $numSchedules = fake()->numberBetween(1, 2);

            for ($i = 0; $i < $numSchedules; $i++) {
                $date = fake()->date();
                $startTime = fake()->time();
                $endTime = fake()->time();

                while ($endTime <= $startTime) {
                    $endTime = fake()->time();
                }

                $schedules[] = [
                    'date' => $date,
                    'startTime' => $startTime,
                    'endTime' => $endTime
                ];
            }

            $event->schedules()->createMany($schedules);
        });
    }
}
