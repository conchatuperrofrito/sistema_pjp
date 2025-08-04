<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DependenceRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255|unique:dependences,name,' . ($this->id ?? ''),
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'El nombre de la dependencia es obligatorio',
            'name.string' => 'El nombre de la dependencia debe ser una cadena de texto',
            'name.max' => 'El nombre de la dependencia no puede tener más de 255 caracteres',
            'name.unique' => 'Ya existe una dependencia con ese nombre',
        ];
    }
} 