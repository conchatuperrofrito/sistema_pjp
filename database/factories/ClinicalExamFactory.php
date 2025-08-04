<?php

namespace Database\Factories;

use App\Models\RegionalExam;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\PhysicalExam;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClinicalExam>
 */
class ClinicalExamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'physical_exam_id' => PhysicalExam::factory()->create()->id,
            'regional_exam_id' => RegionalExam::factory()->create()->id,
            'general_exam' => $this->faker->randomElement([
                'Paciente en buen estado general',
                'Apariencia pálida y fatigada',
                'Postrado en cama con signos de debilidad',
                'Paciente orientado, consciente y estable',
                'Deshidratado, signos de hipovolemia'
            ])
        ];
    }
}
