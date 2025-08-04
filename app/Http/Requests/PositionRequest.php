<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PositionRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255|unique:positions,name,' . ($this->id ?? ''),
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'El nombre del cargo es obligatorio',
            'name.string' => 'El nombre del cargo debe ser una cadena de texto',
            'name.max' => 'El nombre del cargo no puede tener más de 255 caracteres',
            'name.unique' => 'Ya existe un cargo con ese nombre',
        ];
    }
} 