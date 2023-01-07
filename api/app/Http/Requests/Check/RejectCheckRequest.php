<?php

namespace App\Http\Requests\Check;

use App\Domain\Check\Check;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class RejectCheckRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->tokenCan('check:reject');
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $check = Check::findOrFail($this->route('check'));

            $this->merge(compact('check'));
        });
    }
}
