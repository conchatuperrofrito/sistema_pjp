<?php

namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class BaseRequest extends FormRequest
{
    protected bool $multiError = true;
    public function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        if ($this->multiError) {
            $errors = $validator->errors();
            $firstErrors = [];
            foreach ($errors->keys() as $key) {
                $firstErrors[$key] = $errors->first($key);
            }

            $errors = $firstErrors;


            throw new HttpResponseException(response([
                'type' => 'validation_error',
                'errors' => $errors
            ], 422));
        } else {
            throw new HttpResponseException(response([
                'type' => 'validation_error',
                'error' => $errors->first()
            ], 422));
        }

    }
}