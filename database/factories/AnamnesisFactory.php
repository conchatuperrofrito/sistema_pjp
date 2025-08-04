<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Anamnesis>
 */
class AnamnesisFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $diseaseDurationOptions = [
            '±1 días',
            '±2 días',
            '±3 días',
            '±5 días',
            '±7 días',
            '±10 días',
            '±14 días',
            '±21 días',
            '±30 días',
            '±60 días',
            '±90 días',
            '±180 días',    
            '±365 días',
        ];

        $onsetTypeOptions = [
            'Insidioso',
            'Brusco',
            'Gradual',
            'Agudo',
        ];

        $courseOptions = [
            'Progresivo',
            'Estacionario',
            'Regresivo',
            'Intermitente',
        ];

        $symptomsSignOptions = [
            'Fiebre de 38.5°C, dolor de cabeza intenso y sensibilidad a la luz',
            'Tos seca persistente, congestión nasal y dolor de garganta al tragar',
            'Dolor abdominal tipo cólico, náuseas y vómitos ocasionales', 
            'Fatiga generalizada, dolores musculares y articulares difusos',
            'Mareos, visión borrosa y sensación de desmayo',
            'Dolor en el pecho opresivo, dificultad para respirar y palpitaciones',
            'Erupciones cutáneas pruriginosas, enrojecimiento y descamación',
            'Dolor lumbar irradiado, hormigueo en piernas y debilidad muscular',
            'Ansiedad, insomnio y disminución del apetito',
            'Dolor de oído, secreción y pérdida auditiva temporal'
        ];

        $clinicalStoryOptions = [
            'Paciente con fiebre de 38.5°C, tos seca y dolor de cabeza',
            'Paciente con dolor abdominal tipo cólico, náuseas y vómitos ocasionales',
            'Paciente con fatiga generalizada, dolores musculares y articulares difusos',
            'Paciente con mareos, visión borrosa y sensación de desmayo',
            'Paciente con dolor en el pecho opresivo, dificultad para respirar y palpitaciones',
            'Paciente con erupciones cutáneas pruriginosas, enrojecimiento y descamación',
            'Paciente con dolor lumbar irradiado, hormigueo en piernas y debilidad muscular',
            'Paciente con ansiedad, insomnio y disminución del apetito',
            'Paciente con dolor de oído, secreción y pérdida auditiva temporal'
        ];

        $appetiteOptions = [
            'Normal',
            'Aumentado',
            'Disminuido',
            'Ninguno',
        ];

        $thirstOptions = [
            'Normal',
            'Aumentada',
            'Disminuida',
        ];

        $urineOptions = [
            'Normal',
            'Frecuente',
            'Dolorosa',
            'Dificultosa',
        ];

        $stoolOptions = [
            'Normal',
            'Estreñimiento',
            'Diarrea',
            'Irregular',
        ];

        $sleepOptions = [
            'Normal',
            'Aumentado',
            'Disminuido',
        ];

        return [
            'disease_duration' => $this->faker->randomElement($diseaseDurationOptions),
            'onset_type' => $this->faker->randomElement($onsetTypeOptions),
            'course' => $this->faker->randomElement($courseOptions),
            'symptoms_signs' => $this->faker->randomElement($symptomsSignOptions),
            'clinical_story' => $this->faker->randomElement($clinicalStoryOptions),
            'appetite' => $this->faker->randomElement($appetiteOptions),
            'thirst' => $this->faker->randomElement($thirstOptions),
            'urine' => $this->faker->randomElement($urineOptions),
            'stool' => $this->faker->randomElement($stoolOptions),
            'weight' => $this->faker->randomFloat(2, 40, 100),
            'sleep' => $this->faker->randomElement($sleepOptions),
        ];
    }
}
