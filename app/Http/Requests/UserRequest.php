<?php

namespace App\Http\Requests;

class UserRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        $rules = [
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
                        if (!preg_match('/^[A-Z0-9]{9,12}$/', $value)) {
                            if ($type === 'Pasaporte') {
                                $fail('El pasporte debe de tener de 9 a 12 caracteres alfanuméricos.');
                            } else {
                                $fail('El carnet de extrangería debe de tener de 9 a 12 caracteres alfanuméricos.');
                            }
                        }
                    }
                },
                'unique:users,document_number,' . $this->id
            ],
            'roleId' => 'bail|required|uuid|exists:roles,id',
        ];

        if ($this->input('roleId') === env('DOCTOR_ROLE_ID')) {
            $rules['specialtyId'] = 'bail|required|uuid|exists:specialties,id';
            $rules['registrationNumber'] = 'bail|required|string|max:50|unique:doctors,registration_number,' . $this->doctorId;
        }

        return $rules;
    }

    public function prepareForValidation()
    {
        if ($this->input('roleId') !== env('DOCTOR_ROLE_ID')) {
            $this->merge([
                'specialtyId' => null,
                'registrationNumber' => null,
            ]);
        }
    }

    public function messages(): array
    {
        return [
            'firstName.required' => 'El nombre es requerido.',
            'firstName.string' => 'El nombre debe ser una cadena de texto.',
            'firstName.max' => 'El nombre no debe exceder los 255 caracteres.',
            'lastName.required' => 'El apellido es requerido.',
            'lastName.string' => 'El apellido debe ser una cadena de texto.',
            'lastName.max' => 'El apellido no debe exceder los 255 caracteres.',
            'documentType.required' => 'El tipo de documento es requerido.',
            'documentType.string' => 'El tipo de documento debe ser una cadena de texto.',
            'documentType.max' => 'El tipo de documento no debe exceder los 50 caracteres.',
            'documentType.in' => 'El tipo de documento debe ser DNI, Pasaporte o Carnet de extranjería.',
            'documentNumber.required' => 'El número de documento es requerido.',
            'documentNumber.string' => 'El número de documento debe ser una cadena de texto.',
            'documentNumber.max' => 'El número de documento no debe exceder los 50 caracteres.',
            'documentNumber.unique' => 'El número de documento ya está en uso.',
            'roleId.required' => 'El rol es requerido.',
            'roleId.uuid' => 'El rol debe ser un UUID.',
            'roleId.exists' => 'El rol no existe.',
            'specialtyId.required' => 'La especialidad es requerida.',
            'specialtyId.uuid' => 'La especialidad debe ser un UUID.',
            'specialtyId.exists' => 'La especialidad no existe.',
            'registrationNumber.required' => 'El número de registro es requerido.',
            'registrationNumber.string' => 'El número de registro debe ser una cadena de texto.',
            'registrationNumber.max' => 'El número de registro no debe exceder los 50 caracteres.',
            'registrationNumber.unique' => 'El número de registro ya está en uso.',
        ];
    }


}
