<?php

namespace App\Http\Requests;

class EppDeliveryRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => 'bail|required|string',
            'patientId' => 'bail|required|uuid|exists:patients,id',
            'eppItem' => 'bail|required|string|max:255',
            'quantity' => 'bail|required|integer|min:1',
            'condition' => 'bail|required|string|in:Nuevo,Usado,Dañado',
            'observations' => 'bail|nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'date.required' => 'Fecha requerida.',
            'patientId.required' => 'Paciente requerido.',
            'patientId.uuid' => 'UUID inválido.',
            'patientId.exists' => 'Paciente no válido.',
            'eppItem.required' => 'EPP requerido.',
            'eppItem.string' => 'EPP inválido.',
            'eppItem.max' => 'EPP muy largo.',
            'quantity.required' => 'Cantidad requerida.',
            'quantity.integer' => 'Cantidad inválida.',
            'quantity.min' => 'Cantidad debe ser al menos 1.',
            'condition.required' => 'Condición requerida.',
            'condition.string' => 'Condición inválida.',
            'condition.in' => 'Condición no válida.',
            'observations.string' => 'Observaciones inválidas.',
        ];
    }
} 