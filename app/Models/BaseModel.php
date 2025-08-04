<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class BaseModel extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid();
            }
        });
    }

    public function getAttribute($key)
    {
        if (method_exists($this, $key)) {
            return $this->getRelationValue($key);
        }

        return parent::getAttribute(Str::snake($key));
    }

    public function setAttribute($key, $value)
    {
        if (is_string($value)) {
            $value = trim($value);
        }

        $snakeKey = Str::snake($key);
        return parent::setAttribute($snakeKey, $value);
    }

    public function toArray()
    {
        $attributes = parent::toArray();
        $camelAttributes = [];

        foreach ($attributes as $key => $value) {
            $camelKey = Str::camel($key);
            $camelAttributes[$camelKey] = $value;
        }

        return $camelAttributes;
    }
}
