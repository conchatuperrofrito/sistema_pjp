<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TherapeuticPlan>
 */
class TherapeuticPlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $treatmentOptions = [
            'Iniciar ibuprofeno 400 mg c/8 h para controlar inflamación, reposo relativo y fisioterapia 3 veces/semana',
            'Iniciar amoxicilina 500 mg c/8 h por 7 días, reposo en cama y nebulizaciones c/12 h',
            'Paracetamol 500 mg c/6 h para control del dolor, compresas frías locales y ejercicios de estiramiento',
            'Omeprazol 20 mg en ayunas, dieta blanda fraccionada y evitar irritantes gástricos por 2 semanas', 
            'Loratadina 10 mg c/24 h, evitar alérgenos identificados y humidificador nocturno',
            'Naproxeno 550 mg c/12 h, terapia física 2 veces/semana y ejercicios de fortalecimiento',
            'Ciprofloxacino 500 mg c/12 h, hidratación abundante y probióticos durante el tratamiento',
            'Metformina 850 mg con comidas, plan nutricional hipocalórico y caminata 30 min diarios',
            'Enalapril 10 mg c/24 h, dieta hiposódica y monitoreo domiciliario de presión arterial',
            'Diclofenaco tópico c/8 h, terapia con frío/calor alternado y ejercicios de movilidad articular'
        ];

        $lifestyleOptions = [
            'Mantener reposo relativo por 48-72 horas',
            'Dieta blanda e hidratación abundante',
            'Evitar alimentos irritantes y bebidas alcohólicas',
            'Realizar ejercicio aeróbico moderado 30 minutos diarios',
            'Mantener dieta baja en sodio y grasas saturadas',
            'Evitar exposición a alérgenos identificados',
            'Dormir 7-8 horas diarias en horarios regulares',
            'Realizar ejercicios de estiramiento suave',
            'Evitar actividades físicas intensas por 1 semana',
            'Mantener elevada la extremidad afectada'
        ];

        return [
            'treatment' => $this->faker->randomElement($treatmentOptions),
            'life_style_instructions' => $this->faker->randomElement($lifestyleOptions),
        ];
    }
}
