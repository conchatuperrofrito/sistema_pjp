<?php

namespace Database\Factories;

use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    public function definition(): array
    {
        $status = $this->faker->boolean(80);

        $reasonsMedicinal = [
            'Consulta de control médico general',
            'Evaluación de estado de salud general',
            'Chequeo preventivo de salud',
            'Asesoramiento sobre nutrición y hábitos de vida',
            'Dolor abdominal persistente',
            'Fiebre inexplicable de larga duración',
            'Diagnóstico y tratamiento de hipertensión',
            'Consulta para manejo de enfermedades respiratorias',
            'Evaluación de diabetes tipo 2',
            'Tratamiento para resfriados y gripe',
            'Control y manejo de enfermedades cardiovasculares',
            'Dolores articulares y musculares',
            'Consulta para síndrome de fatiga crónica',
            'Tratamiento para dolores de cabeza y migrañas',
            'Revisión postquirúrgica',
            'Tratamiento de enfermedades infecciosas',
            'Evaluación de colesterol y triglicéridos elevados',
            'Asesoría para dejar de fumar',
            'Diagnóstico y tratamiento de infecciones urinarias',
            'Consulta para trastornos digestivos',
            'Control de enfermedades autoinmunes',
            'Tratamiento de alergias y rinitis',
            'Control de problemas endocrinos como el hipotiroidismo',
            'Exámenes preventivos de cáncer (mamografía, próstata, etc.)',
            'Chequeo post-vacunación',
            'Manejo de problemas de salud mental como estrés',
            'Tratamiento para afecciones de la piel',
            'Evaluación de salud mental para estudiantes universitarios'
        ];

        $reasonsOdontologia = [
            'Revisión dental general',
            'Extracción de muela del juicio',
            'Tratamiento de conductos radiculares',
            'Implantes dentales',
            'Blanqueamiento dental',
            'Limpieza dental profunda',
            'Revisión de prótesis dentales',
            'Consulta para dolor de muelas',
            'Revisión de encías inflamadas',
            'Ortodoncia: evaluación de brackets y alineadores',
            'Tratamiento para malformaciones dentales',
            'Extracción de dientes con infección',
            'Evaluación de caries dentales',
            'Tratamiento de halitosis (mal aliento)',
            'Ortodoncia infantil',
            'Reparación de dientes fracturados',
            'Diagnóstico y tratamiento de dientes sensibles',
            'Asesoría para mantener una buena higiene bucal',
            'Prevención y tratamiento de enfermedades periodontales',
            'Tratamiento para bruxismo',
            'Revisión de implantes dentales',
            'Odontología estética: carillas y coronas',
            'Evaluación de problemas en la mordida',
            'Control de dolor relacionado con infecciones dentales',
            'Revisión de encías para detectar gingivitis',
            'Reparación de puentes dentales',
            'Tratamiento para mal aliento crónico',
            'Revisión de posibles abscesos dentales'
        ];

        $reasonsPsicologia = [
            'Consulta para manejo de ansiedad',
            'Terapia para trastornos del sueño',
            'Evaluación de estrés postraumático',
            'Asesoramiento para problemas de pareja',
            'Tratamiento para depresión',
            'Intervención psicológica por crisis personal',
            'Evaluación de trastornos del comportamiento',
            'Psicoterapia infantil',
            'Manejo de problemas emocionales en el trabajo',
            'Terapia cognitivo-conductual para manejo de fobias',
            'Terapia para trastornos obsesivo-compulsivos (TOC)',
            'Intervención en trastornos alimenticios',
            'Psicoterapia para duelo y pérdidas',
            'Tratamiento de la baja autoestima',
            'Manejo de trastornos de la conducta en jóvenes',
            'Terapia de grupo para problemas emocionales',
            'Manejo de problemas emocionales derivados de la universidad',
            'Consultas de orientación vocacional',
            'Psicoterapia para estudiantes universitarios con estrés académico',
            'Intervención psicológica en situaciones de acoso',
            'Apoyo en la adaptación a cambios de vida',
            'Evaluación y tratamiento de problemas de agresividad',
            'Terapia para trastornos bipolares',
            'Atención psicológica en casos de dependencia emocional',
            'Manejo de trastornos de la personalidad',
            'Tratamiento psicológico para el manejo de conflictos familiares',
            'Terapia para jóvenes con dificultades de adaptación social',
            'Manejo de trastornos psicóticos',
            'Psicoterapia para trastornos de pánico',
            'Tratamiento para adicciones (alcohol, drogas, etc.)',
            'Manejo de la fatiga emocional',
            'Psicoterapia para niños y adolescentes con dificultades conductuales'
        ];

        $reasonsTopico = [
            'Evaluación de dermatitis atópica',
            'Tratamiento tópico de psoriasis',
            'Aplicación de pomada antibiótica en heridas',
            'Control de eccema y prurito',
            'Valoración de quemaduras superficiales',
            'Aplicación de cremas antiinflamatorias',
            'Terapia de parche de alérgenos',
            'Monitoreo de reacciones cutáneas',
            'Tratamiento con corticoides tópicos',
            'Evaluación de lesiones verrugosas',
            'Prueba de contacto para alergias cutáneas',
            'Aplicación de loción antipruriginosa',
            'Tratamiento de acné con geles tópicos',
            'Control de dermatitis de contacto',
            'Evaluación de úlceras por presión',
            'Terapia tópica de hongos en uñas',
            'Valoración de irritaciones por productos químicos',
            'Tratamiento de escaras con apósitos tópicos',
            'Evaluación de cicatrices con siliconas tópicas',
            'Aplicación de gel anestésico local',
            'Control de quemaduras de primer grado',
            'Tratamiento de herpes labial con crema antiviral',
            'Valoración de manchas hiperpigmentadas',
            'Aplicación de retinoides tópicos para renovación celular',
            'Tratamiento de liquen plano con emulsiones tópicas',
            'Evaluación de reacción a tatuajes',
            'Terapia de gel de aloe vera',
            'Aplicación de bloqueadores solares prescritos',
            'Tratamiento de eccema numular',
            'Valoración de lesiones por radiación'
        ];

        $specialty = Specialty::where('id', '!=', env('DENTISTRY_SPECIALTY_ID'))
            ->inRandomOrder()->first()->id;

        $reason = match ($specialty) {
            env('GENERAL_MEDICINE_SPECIALTY_ID') => $reasonsMedicinal[array_rand($reasonsMedicinal)],
            env('DENTISTRY_SPECIALTY_ID') => $reasonsOdontologia[array_rand($reasonsOdontologia)],
            env('PSYCHOLOGY_SPECIALTY_ID') => $reasonsPsicologia[array_rand($reasonsPsicologia)],
            env('TOPIC_SPECIALTY_ID') => $reasonsTopico[array_rand($reasonsTopico)],
            default => $this->faker->words(3, true),
        };

        return [
            "date" => $this->faker->dateTimeThisYear()->format('Y-m-d'),
            "hour" => $this->faker->time('H:i'),
            "reason" => $reason,
            "patient_id" => Patient::inRandomOrder()->first()->id,
            "user_id" => User::whereHas('doctor', function ($query) use ($specialty) {
                $query->where('specialty_id', $specialty);
            })->inRandomOrder()->first()->id,
            "medical_record_id" => MedicalRecord::factory()->attachedState($status, $specialty)->create()->id,
            "status" => $status ? "Realizada" : "Pendiente",
        ];
    }

    public function withCurrentDate(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'date' => now()->format('Y-m-d'),
            ];
        });
    }
}
