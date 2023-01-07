<?php

namespace App\Domain\Transaction;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'account_id',
        'transactionable_type',
        'transactionable_id',
        'amount',
        'currency',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'integer',
    ];

    public function transactionable()
    {
        return $this->morphTo();
    }
}
