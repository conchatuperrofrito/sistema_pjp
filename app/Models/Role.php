<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Role extends BaseModel
{
    use HasFactory;

    public function  getNameAttribute($value): string
    {
        return $value === 'admin' ? 'Administrador' : 'Doctor';
    }
}
