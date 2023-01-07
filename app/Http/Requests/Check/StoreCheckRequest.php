<?php

namespace App\Http\Requests\Check;

use Illuminate\Foundation\Http\FormRequest;

class StoreCheckRequest extends FormRequest
{
    public function rules()
    {
        return [
            'amount' => 'required|numeric|gt:0',
            'description' => 'required|string',
            'image' => 'required|image',
        ];
    }
}
