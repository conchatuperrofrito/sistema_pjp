<?php

namespace App\Models;

use App\Models\BaseModel;

class DosageForm extends BaseModel
{
    protected $fillable = [
        'code',
        'description'
    ];
}
