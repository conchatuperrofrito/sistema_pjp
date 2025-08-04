<?php

namespace App\Models;

use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\Builder;

class Cie10Subcategory extends BaseModel
{
    use Searchable;

    protected $appends = ['classification'];

    public function scopeSearchByCode(Builder $query, string $term): Builder
    {
        $value = is_numeric($term) ? "%{$term}" : "{$term}%";
        return $query->where('code', 'LIKE', $value);
    }

    public function toSearchableArray(): array
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
        return 'subcategory';
    }
}
