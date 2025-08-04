<?php

namespace App\Http\Requests;

class LoginRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'documentNumber' => 'required',
            'password' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'documentNumber.required' => 'El campo número de documento es obligatorio.',
            'password.required' => 'El campo contraseña es obligatorio.',
        ];
    }
}
