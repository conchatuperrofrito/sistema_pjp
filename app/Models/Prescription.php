<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Prescription extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'notes',
    ];

    public function medications()
    {
        return $this->belongsToMany(Medication::class, 'prescription_medications')
                ->using(PrescriptionMedication::class)
                ->withPivot('duration', 'frequency', 'quantity', 'instructions')
                ->withTimestamps();
    }


    public function getMedicationsMergedAttribute()
    {
            return $this->medications
            ->loadMissing('pivot:duration,frequency,quantity,instructions')
            ->map(function ($medication) {
                return [
                    'id' => $medication->id,
                    'genericName' => $medication->genericName,
                    'concentration' => $medication->concentration,
                    'presentation' => $medication->presentation,
                    'dosageForm' => $medication->dosageForm->code   ,
                    'dosageDescription' => $medication->dosageForm->description,
                    'duration' => $medication->pivot->duration,
                    'frequency' => $medication->pivot->frequency,
                    'quantity' => $medication->pivot->quantity,
                    'instructions' => $medication->pivot->instructions,
                ];
            });
    }

}
