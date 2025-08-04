<?php

namespace App\Models;

use Laravel\Scout\Searchable;

class Cie10Category extends BaseModel
{
    use Searchable;

    protected $appends = ['classification'];
    
    public function scopeSearchByCode($query, $term)
    {
        $value = is_numeric($term) ? "%{$term}" : "{$term}%";
        return $query->where('code', 'LIKE', $value);
    }

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
        ];
    }

    public function diagnosisCodes()
    {
        return $this->morphMany(Cie10DiagnosticCode::class, 'classifiable');
    }

    public function getClassificationAttribute(): string
    {
        return 'category';
    }
}