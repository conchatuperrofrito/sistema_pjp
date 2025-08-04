<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Scout\Searchable;

class Appointment extends BaseModel
{
    use HasFactory, Searchable;

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
    ];

    public function getDateAttribute($value)
    {
        return $value;
    }

    public function getHourAttribute($value)
    {
        return date('h:i A', strtotime($value));
    }

    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'patient' => $this->patient->fullName,
            'doctor' => $this->medicalRecord->doctor->user->fullName,
        ];
    }

}
