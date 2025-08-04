<?php

namespace App\Models;

use Laravel\Scout\Searchable;
use App\Casts\Uppercase;

class Position extends BaseModel
{
    use Searchable;
    protected $fillable = ['name'];

    protected $casts = [
        'name' => Uppercase::class,
    ];

    public function scopeSearchName($query, $term)
    {
        if (empty($term)) {
            return $query;
        }

        return $query->where('name', 'like', "%{$term}%");
    }

    public function patients()
    {
        return $this->hasMany(Patient::class);
    }

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
