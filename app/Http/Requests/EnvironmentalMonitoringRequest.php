<?php

namespace App\Http\Requests;

class EnvironmentalMonitoringRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'area' => 'bail|required|string|max:255',
            'agentType' => 'bail|required|string|max:255',
            'agentDescription' => 'bail|nullable|string|max:100',
            'measuredValue' => 'bail|required|numeric',
            'unit' => 'bail|required|string|max:20',
            'permittedLimit' => 'bail|nullable|numeric',
            'measurementDate' => 'bail|required|date',
            'frequency' => 'bail|required|string|max:255',
            'responsible' => 'bail|required|string|max:255',
            'observations' => 'bail|nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'area.required' => 'Área requerida.',
            'agentType.required' => 'Tipo de agente requerido.',
            'measuredValue.required' => 'Valor medido requerido.',
            'unit.required' => 'Unidad requerida.',
            'measurementDate.required' => 'Fecha de medición requerida.',
            'frequency.required' => 'Frecuencia requerida.',
            'responsible.required' => 'Responsable requerido.',
        ];
    }
} 