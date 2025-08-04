<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClinicalExam extends BaseModel
{
    use HasFactory;

    public function physicalExam()
    {
        return $this->belongsTo(PhysicalExam::class);
    }

    public function regionalExam()
    {
        return $this->belongsTo(RegionalExam::class);
    }
}
