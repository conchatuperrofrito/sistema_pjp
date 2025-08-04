<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalRecord extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'prescriptionId'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function clinicalExam()
    {
        return $this->belongsTo(ClinicalExam::class);
    }

    public function dentalEvolution()
    {
        return $this->belongsTo(DentalEvolution::class);
    }

    public function appointment()
    {
        return $this->hasOne(Appointment::class);
    }

    public function anamnesis()
    {
        return $this->belongsTo(Anamnesis::class);
    }

    public function diagnosis()
    {
        return $this->belongsTo(Diagnosis::class);
    }

    public function therapeuticPlan()
    {
        return $this->belongsTo(TherapeuticPlan::class);
    }

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    public function consultationClosure()
    {
        return $this->belongsTo(ConsultationClosure::class);
    }
}
