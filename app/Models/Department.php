<?php

namespace App\Models;

class Department extends BaseModel
{   

    public function provinces()
    {
        return $this->hasMany(Province::class);
    }

    public function districts()
    {
        return $this->hasManyThrough(District::class, Province::class);
    }

}
