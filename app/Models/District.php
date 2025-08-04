<?php

namespace App\Models;

class District extends BaseModel
{
    public function province()
    {
        return $this->belongsTo(Province::class);
    }
}
