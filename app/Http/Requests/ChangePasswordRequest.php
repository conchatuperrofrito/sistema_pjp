<?php

namespace App\Http\Requests;

class ChangePasswordRequest extends BaseRequest
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
            'currentPassword' => [
                'bail',
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!\Hash::check($value, auth()->user()->password)) {
                        $fail('La contraseña actual es incorrecta.');
                    }
                },
            ],
            'newPassword' => [
                'bail',
                'required',
                'string',
                'min:8',
                'max:32',
                function ($attribute, $value, $fail) {
                    if (\Hash::check($value, auth()->user()->password)) {
                        $fail('La nueva contraseña no puede ser igual a la actual.');
                    }
                },
            ],
            'confirmNewPassword' => 'bail|required|string|same:newPassword',
        ];
    }

    public function messages(): array
    {
        return [
            'currentPassword.required' => 'La contraseña actual es requerida',
            'currentPassword.string' => 'La contraseña actual debe ser una cadena de texto',
            'newPassword.required' => 'La nueva contraseña es requerida',
            'newPassword.string' => 'La nueva contraseña debe ser una cadena de texto',
            'newPassword.min' => 'La nueva contraseña debe tener al menos 8 caracteres',
            'newPassword.max' => 'La nueva contraseña no puede tener más de 32 caracteres',
            'confirmNewPassword.required' => 'La confirmación de la nueva contraseña es requerida',
            'confirmNewPassword.string' => 'La confirmación de la nueva contraseña debe ser una cadena de texto',
            'confirmNewPassword.same' => 'La confirmación de la nueva contraseña no coincide con la nueva contraseña',
        ];
    }

}
