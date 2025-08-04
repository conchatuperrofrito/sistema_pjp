<?php

namespace App\Http\Requests;

class AddParticipantRequest extends BaseRequest
{
    protected bool $multiError = false;
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => 'bail|required|uuid|exists:events,id',
            'documentNumber' => 'bail|nullable|required_without:patientId|string|max:20',
            'patientId' => 'bail|nullable|required_without:documentNumber|uuid|exists:patients,id',
        ];
    }

    public function messages(): array
    {
        return [
            'id.required' => 'ID del evento requerido.',
            'id.uuid' => 'ID del evento inválido.',
            'id.exists' => 'Evento no encontrado.',
            'documentNumber.string' => 'Número de documento inválido.',
            'documentNumber.max' => 'Número de documento muy largo.',
            'patientId.uuid' => 'ID del paciente inválido.',
            'patientId.exists' => 'Paciente no encontrado.',
            'documentNumber.required_without' => 'Debe proporcionar el número de documento o el ID del paciente.',
            'patientId.required_without' => 'Debe proporcionar el número de documento o el ID del paciente.',
        ];
    }
} 