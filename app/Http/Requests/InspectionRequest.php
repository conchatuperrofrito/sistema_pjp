<?php

namespace App\Http\Requests;

class InspectionRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => 'bail|required|string',
            'area' => 'bail|required|string|max:255',
            'inspector' => 'bail|required|string|max:255',
            'findings' => 'bail|required|string',
            'severity' => 'bail|required|string|in:Baja,Moderada,Alta',
            'recommendations' => 'bail|required|string',
            'correctionDeadline' => 'bail|nullable|string',
            'correctionResponsible' => 'bail|required|string|max:255'
        ];
    }

    public function messages(): array
    {
        return [
            'date.required' => 'Fecha requerida.',
            'area.required' => 'Área requerida.',
            'area.string' => 'Área inválida.',
            'area.max' => 'Área muy larga.',
            'inspector.required' => 'Inspector requerido.',
            'inspector.string' => 'Inspector inválido.',
            'inspector.max' => 'Inspector muy largo.',
            'findings.required' => 'Hallazgos requeridos.',
            'findings.string' => 'Hallazgos inválidos.',
            'severity.required' => 'Severidad requerida.',
            'severity.string' => 'Severidad inválida.',
            'severity.in' => 'Severidad no válida.',
            'recommendations.required' => 'Recomendaciones requeridas.',
            'recommendations.string' => 'Recomendaciones inválidas.',
            'correctionDeadline.date' => 'Fecha de corrección inválida.',
            'correctionResponsible.required' => 'Responsable de corrección requerido.',
            'correctionResponsible.string' => 'Responsable de corrección inválido.',
            'correctionResponsible.max' => 'Responsable de corrección muy largo.',
        ];
    }
} 