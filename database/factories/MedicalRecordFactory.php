<?php

namespace Database\Factories;

use App\Models\DentalEvolution;
use App\Models\Doctor;
use App\Models\ClinicalExam;
use App\Models\Anamnesis;
use App\Models\Diagnosis;
use App\Models\TherapeuticPlan;
use App\Models\ConsultationClosure;
use App\Models\Prescription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MedicalRecord>
 */
class MedicalRecordFactory extends Factory
{
    public function definition(): array
    {
        return [
            "clinical_exam_id" => ClinicalExam::factory()->create()->id,
            "doctor_id" => Doctor::inRandomOrder()->first()->id,
        ];
    }

    public function attachedState(bool $status, string $specialty): self
    {
        $doctor = Doctor::where("specialty_id", $specialty)->inRandomOrder()->first();

        $anamnesisId = null;
        $diagnosisId = null;
        $therapeuticPlanId = null;
        $prescriptionId = null;
        $consultationClosureId = null;

        $dentalEvolutionId = null;

        if ($status && $doctor) {
            if ($doctor->specialty_id !== env("DENTISTRY_SPECIALTY_ID")) {
                $anamnesisId = Anamnesis::factory()->create()->id;
                $diagnosisId = Diagnosis::factory()->create()->id;
                $therapeuticPlanId = TherapeuticPlan::factory()->create()->id;
                $consultationClosureId = ConsultationClosure::factory()->create()->id;
                $prescriptionId = fake()->boolean(60) ?
                    Prescription::factory()->create()->id : null;
            } else {
                $dentalEvolutionId = DentalEvolution::factory()->create()->id;
            }
        }

        return $this->state(function (array $attributes) use (
            $doctor,
            $dentalEvolutionId,
            $anamnesisId,
            $diagnosisId,
            $therapeuticPlanId,
            $consultationClosureId,
            $prescriptionId
        ) {
            return [
                "doctor_id" => $doctor->id,
                "dental_evolution_id" => $dentalEvolutionId,
                "anamnesis_id" => $anamnesisId,
                "diagnosis_id" => $diagnosisId,
                "therapeutic_plan_id" => $therapeuticPlanId,
                "consultation_closure_id" => $consultationClosureId,
                "prescription_id" => $prescriptionId,
            ];
        });
    }
}
