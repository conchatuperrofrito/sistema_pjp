<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PhysicalExam>
 */
class PhysicalExamFactory extends Factory
{
    public function definition(): array
    {
        $heightInMeters = $this->faker->randomFloat(2, 1.5, 2.0);
        $weightInKg = $this->faker->randomFloat(2, 50, 100);
    
        $bodyMassIndex = $weightInKg / ($heightInMeters ** 2);
    
        return [
            'respiratory_rate' => $this->faker->numberBetween(12, 20),
            'heart_rate' => $this->faker->numberBetween(60, 100),
            'temperature' => $this->faker->randomFloat(1, 36.5, 37.5),
            'blood_pressure' => $this->faker->numberBetween(90, 120) . '/' . $this->faker->numberBetween(60, 80),
            'height' => $heightInMeters * 100,
            'weight' => $weightInKg,
            'body_mass_index' => round($bodyMassIndex, 2),
        ];
    }
    

    private function generateRange(float $min, float $max): string
    {
        $lower = $this->faker->randomFloat(2, $min, $max - 1);
        $upper = $this->faker->randomFloat(2, $lower, $max);
        return sprintf("%.2f-%.2f", $lower, $upper);
    }
}
