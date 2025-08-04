<?php

namespace App\Models;

class EnvironmentalMonitoring extends BaseModel
{
    protected $fillable = [
        'area',
        'agent_type',
        'agent_description',
        'measured_value',
        'unit',
        'permitted_limit',
        'measurement_date',
        'frequency',
        'responsible',
        'observations',
    ];

    protected $casts = [
        'measured_value' => 'decimal:2',
        'permitted_limit' => 'decimal:2',
        'measurement_date' => 'date:Y-m-d',
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
    ];

    public function getMeasurementDateAttribute($value)
    {
        return $value;
    }
}