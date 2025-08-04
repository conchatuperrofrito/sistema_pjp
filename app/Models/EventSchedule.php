<?php

namespace App\Models;

use Illuminate\Support\Carbon;

class EventSchedule extends BaseModel
{
    protected $fillable = [
        'eventId',
        'date',
        'startTime',
        'endTime',
    ];


    protected function getDateAttribute($value)
    {
        return Carbon::parse($value)->format('d-m-Y');
    }

    protected function getStartTimeAttribute($value)
    {
        return Carbon::parse($value)->format('h:i A');
    }

    protected function getEndTimeAttribute($value)
    {
        return Carbon::parse($value)->format('h:i A');
    }
}
