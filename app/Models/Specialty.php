<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Specialty extends BaseModel
{
    use HasFactory;

    public function doctors()
    {
        return $this->hasMany(Doctor::class);
    }
}
