<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Scout\Searchable;
use App\Casts\Uppercase;

class Patient extends BaseAuthentication
{
    use HasFactory, Searchable, Notifiable;

    protected $appends = [
        'full_name',
        'abreviated_full_name',
        'age',
        'place_of_birth'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
        'first_name' => Uppercase::class,
        'last_name' => Uppercase::class,
    ];

    public function getFullNameAttribute(): string
    {
        return "{$this->firstName} {$this->lastName}";
    }

    public function getDocumentTypeAbreviatedAttribute(): string
    {
        return $this->documentType === 'DNI' ? 'DNI' : ($this->documentType === 'Pasaporte' ? 'PAS' : 'CE');
    }

    public function getAbreviatedFullNameAttribute(): string
    {
        $firstNames = preg_split('/\s+/', trim($this->firstName));
        $lastNames = preg_split('/\s+/', trim($this->lastName));

        $firstName = $firstNames[0] ?? '';
        $secondNameInitial = isset($firstNames[1]) ? mb_substr($firstNames[1], 0, 1) . '.' : '';

        $firstLastName = $lastNames[0] ?? '';
        $secondLastNameInitial = isset($lastNames[1]) ? mb_substr($lastNames[1], 0, 1) . '.' : '';

        $abbreviated = $firstName;
        if ($secondNameInitial) {
            $abbreviated .= " {$secondNameInitial}";
        }
        if ($firstLastName) {
            $abbreviated .= " {$firstLastName}";
        }
        if ($secondLastNameInitial) {
            $abbreviated .= " {$secondLastNameInitial}";
        }

        return trim($abbreviated);
    }

    public function getAgeAttribute(): int
    {
        return \Carbon\Carbon::parse($this->attributes['birthdate'])->age;
    }

    public function getPlaceOfBirthAttribute(): string
    {
        $departmentName = $this->district?->province?->department?->name;
        $provinceName = $this->district?->province?->name;
        $districtName = $this->district?->name;

        return implode(', ', array_filter([
            $departmentName,
            $provinceName,
            $districtName
        ]));
    }

    public function scopeSearchDocumentOrName($query, $term)
    {
        if (empty($term)) {
            return $query;
        }

        if (preg_match('/^[0-9]{1,8}$/', $term)) {
            return $query->where('document_number', 'like', "{$term}%");
        } elseif (preg_match('/^[A-Z][0-9]{1,8}$/', $term)) {
            return $query->where('document_number', 'like', "{$term}%");
        } elseif (preg_match('/^[A-Z]{1,2}[0-9]{1,6}$/', $term)) {
            return $query->where('document_number', 'like', "{$term}%");
        }

        return $query->whereRaw("MATCH(full_name) AGAINST (? IN NATURAL LANGUAGE MODE)", [$term]);
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'document_number' => $this->document_number,
        ];
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function dependence()
    {
        return $this->belongsTo(Dependence::class);
    }
}
