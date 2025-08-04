<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TherapeuticPlan extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'treatment',
        'lifeStyleInstructions',
    ]; 

}
