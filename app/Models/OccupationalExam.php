<?php

namespace App\Models;

class OccupationalExam extends BaseModel
{

    protected $appends = [
        'patient_full_name'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
        'date' => 'date:Y-m-d',
    ];
    public function getPatientFullNameAttribute(): string
    {
        return $this->patient ? $this->patient->fullName : '';
    }

    public function getDateAttribute($value)
    {
        return $value;
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
} 