<?php

namespace Database\Factories;

use App\Models\Diagnosis;
use App\Models\Cie10Category;
use App\Models\Cie10Subcategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Diagnosis>
 */
class DiagnosisFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $descriptionOptions = [
            'Diagnóstico de migraña con aura basado en cefalea intensa y fotofobia',
            'Faringitis viral aguda con compromiso de vías respiratorias superiores',
            'Gastroenteritis aguda de probable origen viral',
            'Síndrome de fatiga crónica con manifestaciones musculoesqueléticas',
            'Síndrome vertiginoso periférico con componente visual asociado',
            'Angina de pecho estable con patrón típico de dolor torácico',
            'Dermatitis atópica con manifestaciones cutáneas generalizadas',
            'Hernia discal lumbar L4-L5 con radiculopatía',
            'Trastorno de ansiedad generalizada con alteraciones del sueño',
            'Otitis media aguda con efusión timpánica'
        ];

        $clinicalCriteriaOptions = [
            'Cumple criterios diagnósticos de la Clasificación Internacional de Cefaleas (ICHD-3)',
            'Hallazgos clínicos compatibles con infección viral de vías respiratorias altas',
            'Criterios de Roma IV para trastornos gastrointestinales funcionales',
            'Cumple criterios diagnósticos del Instituto de Medicina para SFC',
            'Hallazgos positivos en maniobras de Dix-Hallpike y Head-Impulse test',
            'Score de riesgo cardiovascular HEART positivo',
            'Criterios diagnósticos de Hanifin y Rajka para dermatitis atópica',
            'Hallazgos compatibles en RMN lumbar y examen neurológico',
            'Cumple criterios DSM-V para trastorno de ansiedad generalizada',
            'Criterios diagnósticos de Paradise para otitis media aguda'
        ];

        return [
            'description' => $this->faker->randomElement($descriptionOptions),
            'clinical_criteria' => $this->faker->randomElement($clinicalCriteriaOptions),
        ];
    }

    public function configure(): self
    {
        return $this->afterCreating(function (Diagnosis $diagnosis) {

            $typeOptions = [
                'Definitivo',
                'Presuntivo',
                'Provisional'
            ];

            $caseOptions = [
                'Nuevo',
                'Repetido',
                'Recidiva',
                'Secuela',
                'Complicación'
            ];

            $categories = Cie10Category::inRandomOrder()->take(rand(1, 2))->get();
            $subcategories = Cie10Subcategory::inRandomOrder()->take(rand(1, 3))->get();

            $diagnosisCodes = array_map(function ($diagnosisCode) use ($typeOptions, $caseOptions) {
                return [
                    'classifiable_id' => $diagnosisCode->id,
                    'classifiable_type' => $diagnosisCode instanceof Cie10Category 
                        ? Cie10Category::class 
                        : Cie10Subcategory::class,
                    'type' => $this->faker->randomElement($typeOptions),
                    'case' => $this->faker->randomElement($caseOptions),
                    'discharge_flag' => $this->faker->boolean()
                ];
            }, $categories->concat($subcategories)->all());

            $diagnosis->diagnosisCodes()->createMany($diagnosisCodes);

        });
    }
}
