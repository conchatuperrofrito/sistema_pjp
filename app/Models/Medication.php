<?php

namespace App\Models;

use Laravel\Scout\Searchable;

class Medication extends BaseModel
{
    use Searchable;

    protected $fillable = [
        'genericName',
        'concentration',
        'presentation',
        'dosageFormId',
        'isCustom',
    ];

    public function scopeSearchName($query, $term)
    {
        if (empty($term)) {
            return $query;
        }

        return $query->where('generic_name', 'like', "%{$term}%");
    }

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'generic_name' => $this->generic_name,
        ];
    }

    public function dosageForm()
    {
        return $this->belongsTo(DosageForm::class);
    }
}
