<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Doctor extends BaseModel
{
    use HasFactory;

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
    ];

    protected $appends = [
        'full_name',
        'abreviated_full_name',
    ];

    public function getFullNameAttribute()
    {
        return "{$this->user->first_name} {$this->user->last_name}";
    }

    public function getAbreviatedFullNameAttribute()
    {
        return $this->user->abreviatedFullName;
    }

    public function specialty()
    {
        return $this->belongsTo(Specialty::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
