<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ConsultationClosure>
 */
class ConsultationClosureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $summaryOptions = [
            'Hallazgos: Signos vitales estables. Evolución: Mejoría progresiva del cuadro clínico. Conclusiones: Se ajusta medicación y se dan recomendaciones',
            'Hallazgos: Disminución del dolor y la inflamación. Evolución: Favorable, con reducción significativa de síntomas. Conclusiones: Se mantiene tratamiento',
            'Hallazgos: Examen físico normal. Evolución: Cuadro clínico estable. Conclusiones: Se programan exámenes de control',
            'Hallazgos: Mejoría en signos y síntomas. Evolución: Respuesta positiva al tratamiento. Conclusiones: Ajustes menores en medicación',
            'Hallazgos: Parámetros dentro de rangos normales. Evolución: Según lo esperado. Conclusiones: Se refuerzan medidas preventivas'
        ];

        $instructionsOptions = [
            'Mantener reposo absoluto por 48 horas. Evitar esfuerzos físicos y seguir dieta blanda',
            'Tomar medicamentos con el estómago lleno. Evitar exposición prolongada al sol durante el tratamiento', 
            'Aplicar compresas frías en la zona afectada 3 veces al día. No suspender antibióticos aunque mejoren síntomas',
            'Realizar ejercicios de rehabilitación según lo indicado. Mantener vendaje limpio y seco',
            'Seguir dieta hiposódica estricta. Controlar presión arterial 2 veces al día y llevar registro',
            'Evitar alimentos irritantes y bebidas alcohólicas. Tomar abundante agua durante el día',
            'Mantener herida limpia y seca. Cambiar vendaje cada 24 horas siguiendo técnica aséptica',
            'No automedicarse. Ante cualquier reacción adversa suspender medicación y consultar',
            'Cumplir horarios de medicación establecidos. Evitar exposición a personas con cuadros gripales',
            'Mantener reposo vocal por 72 horas. Evitar bebidas frías o muy calientes'
        ];

        return [
            'summary' => $this->faker->randomElement($summaryOptions),
            'instructions' => $this->faker->randomElement($instructionsOptions),
            'next_appointment_date' => $this->faker->dateTimeBetween('+1 week', '+3 months')->format('Y-m-d'),
        ];
    }
}
