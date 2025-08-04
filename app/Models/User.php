<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;
use Laravel\Scout\Searchable;

class User extends BaseAuthentication
{
    use HasFactory, Notifiable, Searchable;

    protected $fillable = [
        'first_name',
        'last_name',
        'document_type',
        'document_number',
        'password',
    ];

    protected $hidden = [
        'password'
    ];

    protected $appends = [
        'full_name'
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'date:Y-m-d',
            'updated_at' => 'date:Y-m-d',
        ];
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->firstName} {$this->lastName}";
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function doctor(): HasOne
    {
        return $this->hasOne(Doctor::class);
    }

    public function getAbreviatedFullNameAttribute(): string
    {
        $firstNames = preg_split('/\s+/', trim($this->first_name));
        $lastNames = preg_split('/\s+/', trim($this->last_name));

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

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'document_number' => $this->document_number,
        ];
    }

    public function hasRole(string $role): bool
    {
        return $this->role->id === $role;
    }
}
