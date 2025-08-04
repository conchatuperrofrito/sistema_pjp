<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RegionalExam>
 */
class RegionalExamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'regional_exam' => $this->faker->randomElement([
                'Cabeza: normocéfalo, atraumático',
                'Cuello: sin adenopatías, sin ingurgitación yugular',
                'Tórax: simétrico, sin retracciones, murmullo vesicular conservado',
                'Abdomen: blando, depresible, no doloroso a la palpación',
                'Extremidades: sin edemas, pulsos presentes'
            ]),
            'skin' => $this->faker->randomElement([
                'Hidratada, sin lesiones',
                'Pálida, con signos de anemia',
                'Cianosis en labios y uñas',
                'Ictericia leve',
                'Eritema generalizado',
                'Urticaria en extremidades',
                'Heridas abiertas en proceso de cicatrización'
            ]),
            'eyes' => $this->faker->randomElement([
                'Normales, sin signos de ictericia',
                'Escleras amarillentas (ictericia)',
                'Conjuntivas pálidas (posible anemia)',
                'Inyección conjuntival (posible conjuntivitis)',
                'Midriasis bilateral',
                'Miosis pupilar con reflejos conservados',
                'Anisocoria presente'
            ]),
            'ears' => $this->faker->randomElement([
                'Sin alteraciones visibles',
                'Oído derecho con cerumen abundante',
                'Hipoacusia moderada',
                'Inflamación en conducto auditivo externo',
                'Otorragia presente',
                'Perforación timpánica'
            ]),
            'nose' => $this->faker->randomElement([
                'Sin obstrucción nasal',
                'Congestión nasal bilateral',
                'Epistaxis reciente',
                'Desviación septal moderada',
                'Secreción nasal purulenta'
            ]),
            'mouth' => $this->faker->randomElement([
                'Buena higiene oral, sin lesiones',
                'Aftas en mucosa oral',
                'Lengua seca y fisurada',
                'Encías inflamadas con gingivitis',
                'Placas blanquecinas (posible candidiasis)',
                'Halitosis intensa'
            ]),
            'throat' => $this->faker->randomElement([
                'Sin alteraciones',
                'Amígdalas hipertróficas con exudado',
                'Faringe eritematosa con dolor a la deglución',
                'Úlceras en orofaringe',
                'Sin signos inflamatorios'
            ]),
            'teeth' => $this->faker->randomElement([
                'Dentadura completa y sana',
                'Ausencia de varias piezas dentales',
                'Caries en premolares y molares',
                'Pérdida dental severa'
            ]),
            'neck' => $this->faker->randomElement([
                'Sin adenopatías palpables',
                'Ganglios inflamados bilateralmente',
                'Rigidez de cuello con limitación de movimientos',
                'Presencia de bocio'
            ]),
            'thorax' => $this->faker->randomElement([
                'Simétrico, sin deformidades',
                'Asimétrico, con escoliosis leve',
                'Costillas prominentes por delgadez extrema'
            ]),
            'lungs' => $this->faker->randomElement([
                'Buena entrada de aire bilateral',
                'Sibilancias inspiratorias',
                'Roncos dispersos',
                'Disminución del murmullo vesicular en base izquierda',
                'Crepitantes en ambos campos pulmonares'
            ]),
            'heart' => $this->faker->randomElement([
                'Ruidos cardíacos normales',
                'Soplo sistólico moderado',
                'Arritmia evidente en auscultación',
                'Latidos irregulares',
                'Frecuencia cardíaca acelerada'
            ]),
            'breasts' => $this->faker->randomElement([
                'Sin alteraciones palpables',
                'Nódulo palpable en cuadrante superior derecho',
                'Mastitis con secreción purulenta',
                'Ginecomastia leve en varón'
            ]),
            'abdomen' => $this->faker->randomElement([
                'Blando y depresible',
                'Distensión abdominal moderada',
                'Hipersensibilidad en fosa iliaca derecha',
                'Sonidos peristálticos ausentes',
                'Ascitis evidente'
            ]),
            'urinary' => $this->faker->randomElement([
                'Micción sin alteraciones',
                'Disuria y polaquiuria',
                'Retención urinaria',
                'Hematuria presente'
            ]),
            'lymphatic' => $this->faker->randomElement([
                'Ganglios no palpables',
                'Linfadenopatía cervical',
                'Ganglios inflamados en axila'
            ]),
            'vascular' => $this->faker->randomElement([
                'Pulsos periféricos conservados',
                'Débil pulso tibial posterior',
                'Edema en miembros inferiores',
                'Varices visibles'
            ]),
            'locomotor' => $this->faker->randomElement([
                'Movilidad completa',
                'Limitación en movimientos de cadera',
                'Dolor en articulaciones de extremidades superiores',
                'Hipotonía muscular'
            ]),
            'extremities' => $this->faker->randomElement([
                'Sin edemas',
                'Frialdad en extremidades',
                'Hematomas recientes',
                'Úlceras por presión en talón'
            ]),
            'obituaries' => $this->faker->randomElement([
                'Sin alteraciones',
                'Alteración en la marcha',
                'Dificultad para mantener el equilibrio'
            ]),
            'higher_functions' => $this->faker->randomElement([
                'Orientado en tiempo, espacio y persona',
                'Confusión leve',
                'Desorientación temporal',
                'Alteración en la memoria reciente'
            ]),
            'lower_functions' => $this->faker->randomElement([
                'Reflejos tendinosos conservados',
                'Reflejos patológicos presentes',
                'Pérdida de fuerza en extremidades inferiores',
                'Alteración en la coordinación'
            ]),
            'rectal' => $this->faker->randomElement([
                'Normal',
                'Hemorroides visibles',
                'Fisura anal presente'
            ]),
            'gynecological' => $this->faker->randomElement([
                'Sin alteraciones',
                'Sangrado anormal',
                'Masa en ovario izquierdo',
                'Secreción fétida'
            ])
        ];
    }
}
