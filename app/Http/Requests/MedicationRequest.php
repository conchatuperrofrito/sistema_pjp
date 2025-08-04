<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MedicationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'genericName' => 'required|string|max:255',
            'dosageFormId' => 'required|uuid|exists:dosage_forms,id',
        ];

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['id'] = 'required|string';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'id.required' => 'El ID del medicamento es obligatorio',
            'genericName.required' => 'El nombre genérico es obligatorio',
            'genericName.string' => 'El nombre genérico debe ser una cadena de texto',
            'genericName.max' => 'El nombre genérico no puede tener más de 255 caracteres',
            'dosageFormId.required' => 'La forma de dosificación es obligatoria',
            'dosageFormId.uuid' => 'La forma de dosificación debe ser un UUID válido',
            'dosageFormId.exists' => 'La forma de dosificación no existe',
        ];
    }
} 