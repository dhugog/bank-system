<?php

namespace App\Http\Requests\Purchase;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseRequest extends FormRequest
{
    public function rules()
    {
        return [
            'amount' => 'required|numeric|gt:0',
            'description' => 'required|string',
            'date' => 'required|date',
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $account = $this->user()->accounts()->first();

            if (!$account) {
                $validator->errors()->add('account', 'You do not have an account.');
            }

            $this->merge(compact('account'));
        });
    }
}
