<?php

namespace App\Models;

class Cie10DiagnosticCode extends BaseModel
{

    protected $fillable = [
        'classifiable_id',
        'classifiable_type',
        'type',
        'case',
        'discharge_flag',
    ];

    public function diagnosis()
    {
        return $this->belongsTo(Diagnosis::class, 'diagnostic_id');
    }

    public function classifiable()
    {
        return $this->morphTo();
    }

    protected function getDischargeFlagAttribute($value)
    {
        return $value ? "Sí" : "No";
    }
}
