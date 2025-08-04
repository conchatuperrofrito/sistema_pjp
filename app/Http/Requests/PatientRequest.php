<?php

namespace App\Http\Requests;

class PatientRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'departmentId' => 'bail|nullable|uuid|exists:departments,id',
            'provinceId' => 'bail|nullable|uuid|exists:provinces,id',
            'districtId' => 'bail|nullable|uuid|exists:districts,id',
            'firstName' => 'bail|required|string|max:255',
            'lastName' => 'bail|required|string|max:255',
            'documentType' => 'bail|required|string|max:50|in:DNI,Pasaporte,Carnet de extranjería',
            'documentNumber' => [
                'bail',
                'required',
                'string',
                'max:50',
                function ($attribute, $value, $fail) {
                    $type = $this->input('documentType');
                    if ($type === 'DNI') {
                        if (!preg_match('/^[0-9]{8}$/', $value)) {
                            $fail('El DNI debe tener 8 dígitos numéricos.');
                        }
                    } elseif ($type === 'Pasaporte' || $type === 'Carnet de extranjería') {
                        if (!preg_match('/^[A-Z0-9]{9,12}$/i', $value)) {
                            $fail('Debe tener 9-12 caracteres alfanuméricos.');
                        }
                    }
                },
                'unique:patients,document_number,' . $this->id
            ],
            'birthdate' => 'bail|nullable|date|before_or_equal:today',
            'sex' => 'bail|required|string|in:Masculino,Femenino',
            'contactNumber' => 'bail|nullable|string|max:50|regex:/^\+?[0-9\s\-]{7,15}$/',
            'address' => 'bail|nullable|string|max:255',
            'email' => 'bail|nullable|email|max:255|unique:patients,email,' . $this->id,
            'positionId' => 'bail|nullable|uuid|exists:positions,id',
            'dependenceId' => 'bail|nullable|uuid|exists:dependences,id'
        ];
    }


    public function messages(): array
    {
        return [
            'departmentId.uuid' => 'UUID inválido.',
            'departmentId.exists' => 'Departamento no válido.',
            'provinceId.uuid' => 'UUID inválido.',
            'provinceId.exists' => 'Provincia no válida.',
            'districtId.uuid' => 'UUID inválido.',
            'districtId.exists' => 'Distrito no válido.',
            'firstName.required' => 'Nombre requerido.',
            'firstName.string' => 'Nombre inválido.',
            'firstName.max' => 'Nombre muy largo.',
            'lastName.required' => 'Apellido requerido.',
            'lastName.string' => 'Apellido inválido.',
            'lastName.max' => 'Apellido muy largo.',
            'documentType.required' => 'Tipo de documento requerido.',
            'documentType.string' => 'Tipo de documento inválido.',
            'documentType.max' => 'Tipo de documento muy largo.',
            'documentType.in' => 'Tipo de documento no válido.',
            'documentNumber.required' => 'Número de documento requerido.',
            'documentNumber.string' => 'Número de documento inválido.',
            'documentNumber.max' => 'Número de documento muy largo.',
            'documentNumber.unique' => 'Documento ya registrado.',
            'birthdate.nullable' => 'Fecha inválida.',
            'birthdate.date' => 'Fecha inválida.',
            'birthdate.before_or_equal' => 'Fecha no válida.',
            'sex.required' => 'Sexo requerido.',
            'sex.string' => 'Sexo inválido.',
            'sex.in' => 'Sexo no válido.',
            'contactNumber.nullable' => 'Número inválido.',
            'contactNumber.string' => 'Número inválido.',
            'contactNumber.max' => 'Número muy largo.',
            'contactNumber.regex' => 'Número no válido.',
            'address.nullable' => 'Dirección inválida.',
            'address.string' => 'Dirección inválida.',
            'address.max' => 'Dirección muy larga.',
            'email.nullable' => 'Email inválido.',
            'email.email' => 'Email no válido.',
            'email.max' => 'Email muy largo.',
            'email.unique' => 'Email ya registrado.',
            'positionId.uuid' => 'UUID inválido.',
            'positionId.exists' => 'Posición no válida.',
            'dependenceId.uuid' => 'UUID inválido.',
            'dependenceId.exists' => 'Dependencia no válida.',
        ];
    }
}
