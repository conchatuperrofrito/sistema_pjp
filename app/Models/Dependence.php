<?php

namespace App\Models;

use App\Casts\Uppercase;
use Laravel\Scout\Searchable;

class Dependence extends BaseModel
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
