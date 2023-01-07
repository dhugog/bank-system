<?php

namespace App\Http\Requests\Check;

use App\Domain\Check\Check;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class ShowCheckRequest extends FormRequest
{
    protected $check;

    public function authorize()
    {
        $this->check = Check::findOrFail($this->route('check'));

        return $this->user()->tokenCan('check:list-all') || $this->check->account->user_id === $this->user()->id;
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $this->merge(compact('check'));
        });
    }
}
