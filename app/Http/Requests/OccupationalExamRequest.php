<?php

namespace App\Http\Requests;

class OccupationalExamRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patientId' => 'bail|required|uuid|exists:patients,id',
            'examType' => 'bail|required|string|in:Ingreso,Periódico,Retiro',
            'date' => 'bail|required|string',
            'result' => 'bail|required|string|in:Apto,No Apto,Apto con reservas',
            'medicalObservations' => 'bail|nullable|string',
            'doctor' => 'bail|required|string|max:255'
        ];
    }

    public function messages(): array
    {
        return [
            'patientId.required' => 'Paciente requerido.',
            'patientId.uuid' => 'UUID inválido.',
            'patientId.exists' => 'Paciente no válido.',
            'examType.required' => 'Tipo de examen requerido.',
            'examType.string' => 'Tipo de examen inválido.',
            'examType.in' => 'Tipo de examen no válido.',
            'date.required' => 'Fecha requerida.',
            'date.string' => 'Fecha inválida.',
            'result.required' => 'Resultado requerido.',
            'result.string' => 'Resultado inválido.',
            'result.in' => 'Resultado no válido.',
            'medicalObservations.string' => 'Observaciones médicas inválidas.',
            'doctor.required' => 'Doctor requerido.',
            'doctor.string' => 'Doctor inválido.',
            'doctor.max' => 'Doctor muy largo.',
        ];
    }
} 