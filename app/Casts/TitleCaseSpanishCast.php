<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Helpers\TextHelper;

/**
 * Custom cast for applying Spanish title case formatting to model attributes.
 * 
 * This cast automatically formats text input to proper Spanish title case
 * before storing it in the database, handling common Spanish words that
 * should remain lowercase in titles.
 */
class TitleCaseSpanishCast implements CastsAttributes
{
    /**
     * Cast the given value when retrieving from the database.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array<string, mixed>  $attributes
     * @return mixed
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return $value;
    }

    /**
     * Prepare the given value for storage by applying Spanish title case formatting.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array<string, mixed>  $attributes
     * @return mixed
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        if ($value === null) {
            return null;
        }
            
        $squished = Str::squish($value);
        
        return TextHelper::titleCaseSpanish($squished);
    }
}
