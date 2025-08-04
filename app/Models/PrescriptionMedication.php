<?php

namespace App\Models;

class PrescriptionMedication extends BasePivot
{
    protected $fillable = [
        'medication_id',
        'prescription_id',
        'duration',
        'frequency',
        'instructions',
        'quantity',
    ];
}
