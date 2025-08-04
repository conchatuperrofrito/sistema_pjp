<?php

namespace App\Models;

class Accident extends BaseModel
{
    protected $appends = [
        'formatted_date',
        'formatted_time',
        'patient_full_name',
        'user_full_name'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
        'date' => 'date:Y-m-d',
        'time' => 'datetime:H:i',
    ];

    public function getDateAttribute($value)
    {
        return $value;
    }

    public function getHourAttribute($value)
    {
        return date('h:i A', strtotime($value));
    }

    public function getPatientFullNameAttribute(): string
    {
        return $this->patient ? $this->patient->fullName : '';
    }

    public function getUserFullNameAttribute(): string
    {
        return $this->user ? $this->user->fullName : '';
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
} 