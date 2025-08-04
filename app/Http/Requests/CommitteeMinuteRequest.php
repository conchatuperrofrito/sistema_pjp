<?php

namespace App\Http\Requests;

class CommitteeMinuteRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => 'bail|required|date',
            'topics' => 'bail|required|string',
            'agreements' => 'bail|required|string',
            'followupResponsible' => 'bail|required|string|max:255',
            'nextMeetingDate' => 'bail|required|date',
        ];
    }

    public function messages(): array
    {
        return [
            'date.required' => 'Fecha requerida.',
            'topics.required' => 'Temas requeridos.',
            'agreements.required' => 'Acuerdos requeridos.',
            'followupResponsible.required' => 'Responsable de seguimiento requerido.',
            'nextMeetingDate.required' => 'Fecha de próxima reunión requerida.',
        ];
    }
} 