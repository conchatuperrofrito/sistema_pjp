<?php

namespace App\Http\Requests;

class AccidentRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => 'bail|required|string',
            'hour' => 'bail|required|string',
            'eventType' => 'bail|required|string|max:50|in:Accidente,Enfermedad,Incidente,Otro',
            'patientId' => 'bail|required|uuid|exists:patients,id',
            'description' => 'bail|required|string',
            'probableCause' => 'bail|required|string',
            'consequences' => 'bail|required|string',
            'correctiveActions' => 'bail|required|string'
        ];
    }

    public function messages(): array
    {
        return [
            'date.required' => 'Fecha requerida.',
            'hour.required' => 'Hora requerida.',
            'eventType.required' => 'Tipo de evento requerido.',
            'eventType.string' => 'Tipo de evento inválido.',
            'eventType.max' => 'Tipo de evento muy largo.',
            'eventType.in' => 'Tipo de evento no válido.',
            'patientId.required' => 'Paciente requerido.',
            'patientId.uuid' => 'UUID inválido.',
            'patientId.exists' => 'Paciente no válido.',
            'description.required' => 'Descripción requerida.',
            'description.string' => 'Descripción inválida.',
            'probableCause.required' => 'Causa probable requerida.',
            'probableCause.string' => 'Causa probable inválida.',
            'consequences.required' => 'Consecuencias requeridas.',
            'consequences.string' => 'Consecuencias inválidas.',
            'correctiveActions.required' => 'Medidas correctivas requeridas.',
            'correctiveActions.string' => 'Medidas correctivas inválidas.',
        ];
    }
}