<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Diagnosis extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'clinicalCriteria',
        'description',
    ];

    public function diagnosisCodes()
    {
        return $this->hasMany(Cie10DiagnosticCode::class, 'diagnostic_id')->with('classifiable');

    }

    public function getDiagnosisCodesMergedAttribute()
    {
        return $this->diagnosisCodes
            ->loadMissing('classifiable:id,code,description,classification')
            ->map(function ($code) {
                return [
                    'id' => $code->classifiable->id,
                    'type' => $code->type,
                    'case' => $code->case,
                    'dischargeFlag' => $code->discharge_flag,
                    'classification' => $code->classifiable->classification,
                    'code' => $code->classifiable->code,
                    'description' => $code->classifiable->description,
                ];
            });
    }
}
