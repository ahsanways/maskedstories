<?php

namespace App\Http\Traits;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

trait RenderErrors {

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(sendError($validator->errors()->all(), 200));
    }
}
