<?php

namespace Database\Factories;

use App\Utils\OdontogramGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DentalEvolution>
 */
class DentalEvolutionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $odontogramGenerator = new OdontogramGenerator();

        $specificationsCases = [
            'Realizar limpieza y profilaxis dental cada 6 meses.',
            'Recomendación de uso de hilo dental y enjuague con fluor.',
            'Realizar seguimiento de encías después del tratamiento periodontal.',
            'Realizar reconstrucción de corona con material cerámico.',
            'Control periódico de las piezas dentales tras el tratamiento de conductos.',
            'Colocación de ortodoncia para corrección de maloclusión.'
        ];

        $observationsCases = [
            'Paciente con buen cuidado oral, pero presenta leve inflamación gingival.',
            'Presenta sensibilidad dental en los molares posteriores tras el tratamiento.',
            'Dificultad para mantener la higiene debido al uso de ortodoncia.',
            'Paciente reporta dolor agudo en la pieza 15 tras el tratamiento de conductos.',
            'Leveza en el sangrado de encías durante el cepillado.',
            'Recomendación de evitar alimentos duros tras la extracción dental.'
        ];

        return [
            "date" => now()->format('Y-m-d'),
            "odontogram" => $odontogramGenerator->generate(),
            "specifications" => $this->faker->randomElement(array: $specificationsCases),
            "observations" => $this->faker->randomElement($observationsCases),
            "basic_dental_discharge" => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
        ];
    }
}
