<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Anamnesis extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'diseaseDuration',
        'onsetType',
        'course',
        'symptomsSigns',
        'clinicalStory',
        'appetite',
        'thirst',
        'urine',
        'stool',
        'weight',
        'sleep',
    ];

}
