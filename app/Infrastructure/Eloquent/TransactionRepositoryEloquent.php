<?php

namespace App\Infrastructure\Eloquent;

use App\Domain\Account\Account;
use App\Domain\Check\Check;
use App\Domain\Purchase\Purchase;
use App\Domain\Transaction\Transaction;
use App\Domain\Transaction\TransactionRepository;
use Illuminate\Contracts\Pagination\Paginator;

class TransactionRepositoryEloquent implements TransactionRepository
{
    public function getPaginatedList(int $perPage, array $filters = [], array $sort = []): Paginator
    {
        return Transaction::when(isset($filters['account_id']), function ($query) use ($filters) {
            return $query->where('account_id', $filters['account_id']);
        })
            ->when(isset($filters['from']), function ($query) use ($filters) {
                return $query->where('created_at', '>=', $filters['from']);
            })
            ->when(isset($filters['to']), function ($query) use ($filters) {
                return $query->where('created_at', '<=', $filters['to']);
            })
            ->orderBy($filters['sort'] ?? 'id', $filters['order'] ?? 'asc')
            ->simplePaginate($perPage ?? 10);
    }

    public function getSummary(array $filters = []): array
    {
        $transactions = Transaction::when(isset($filters['account_id']), function ($query) use ($filters) {
            return $query->where('account_id', $filters['account_id']);
        })
            ->when(isset($filters['from']), function ($query) use ($filters) {
                return $query->where('created_at', '>=', $filters['from']);
            })
            ->when(isset($filters['to']), function ($query) use ($filters) {
                return $query->where('created_at', '<=', $filters['to']);
            });

        $income = (int) (clone $transactions)->where('transactionable_type', (new Check)->getMorphClass())->sum('amount');
        $expense = abs((clone $transactions)->where('transactionable_type', (new Purchase)->getMorphClass())->sum('amount'));

        return [
            'balance' => $income - $expense,
            'income' => $income,
            'expense' => $expense,
        ];
    }

    public function create(Account $account, $attributes): Transaction
    {
        $transaction = $account->transactions()->create($attributes);

        $account->balance += $transaction->amount;
        $account->save();

        return $transaction;
    }
}
