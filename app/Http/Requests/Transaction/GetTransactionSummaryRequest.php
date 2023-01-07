<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class GetTransactionSummaryRequest extends FormRequest
{
    public function rules()
    {
        return [
            'from' => 'date|filled',
            'to' => 'date|filled',
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $account = $this->user()->accounts()->first();

            if (!$account) {
                $validator->errors()->add('account', 'You do not have an account.');
            }

            $this->merge([
                'account_id' => $account->id,
            ]);
        });
    }
}
