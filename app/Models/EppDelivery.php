<?php

namespace App\Models;

class EppDelivery extends BaseModel
{
    protected $appends = [
        'patient_full_name',
        'patient_document',
        'patient_position',
        'patient_dependence',
        'patient_age',
        'patient_sex',
        'patient_address',
        'patient_contact_number',
        'patient_email',
        'patient_birthdate',
        'patient_place_of_birth'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
        'date' => 'date:Y-m-d',
    ];
    public function getDateAttribute($value)
    {
        return $value;
    }
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
} 