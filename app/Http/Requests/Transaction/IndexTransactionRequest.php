<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class IndexTransactionRequest extends FormRequest
{
    public function rules()
    {
        return [
            'page' => 'integer|min:1',
            'per_page' => 'integer|min:1|max:100',
            'sort' => 'string|filled|in:id,amount,description,created_at,updated_at',
            'order' => 'string|filled|in:asc,desc',
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
