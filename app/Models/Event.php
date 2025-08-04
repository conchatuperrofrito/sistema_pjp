<?php

namespace App\Models;

use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends BaseModel
{
    use Searchable, HasFactory;
    protected $fillable = [
        'userId',
        'title',
        'subtitle',
        'description',
        'venueName',
        'venueAddress',
        'targetAudience',
        'organizer',
        'organizingArea',
    ];

    public function schedules()
    {
        return $this->hasMany(EventSchedule::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
        ];
    }

    public function participants()
    {
        return $this->belongsToMany(Patient::class, 'event_patients')
            ->using(EventPatient::class)
            ->withTimestamps();
    }

}
