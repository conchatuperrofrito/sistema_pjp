<?php

namespace App\Models;

class CommitteeMinute extends BaseModel
{
    protected $fillable = [
        'date',
        'topics',
        'agreements',
        'followup_responsible',
        'next_meeting_date',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'next_meeting_date' => 'date:Y-m-d',
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
    ];

    public function getDateAttribute($value)
    {
        return $value;
    }

    public function getNextMeetingDateAttribute($value)
    {
        return $value;
    }
} 