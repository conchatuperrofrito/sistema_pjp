<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ConsultationClosure extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'instructions',
        'summary',
        'nextAppointmentDate',
    ];

}
