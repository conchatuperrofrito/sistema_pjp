<?php

namespace App\Models;

class Inspection extends BaseModel
{
    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
        'date' => 'date:Y-m-d',
        'correction_deadline' => 'date:Y-m-d',
    ];

    public function getDateAttribute($value): string
    {
        return $value;
    }

    public function getCorrectionDeadlineAttribute($value): string
    {
        return $value ?? "";
    }
} 