<?php

namespace App\Http\Requests\Check;

use App\Enums\CheckStatus;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class IndexCheckRequest extends FormRequest
{
    public function rules()
    {
        $checkStatus = implode(',', [CheckStatus::PENDING, CheckStatus::APPROVED, CheckStatus::REJECTED]);

        return [
            'page' => 'integer|min:1',
            'per_page' => 'integer|min:1|max:100',
            'sort' => 'string|filled|in:id,amount,description,status,created_at,updated_at',
            'order' => 'string|filled|in:asc,desc',
            'from' => 'date|filled',
            'to' => 'date|filled',
            'status' => 'string|filled|in:' . $checkStatus,
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            if (!$this->user()->tokenCan('check:list-all')) {
                $account = $this->user()->accounts()->first();

                if (!$account) {
                    $validator->errors()->add('account', 'You do not have an account.');
                }

                $this->merge([
                    'account_id' => $account->id,
                ]);
            }
        });
    }
}
