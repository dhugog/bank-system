<?php

namespace App\Domain\Transaction;

use App\Domain\Account\Account;
use Illuminate\Contracts\Pagination\Paginator;

interface TransactionRepository
{
    public function getPaginatedList(int $perPage, array $filters = [], array $sort = []): Paginator;
    public function getSummary(array $filters = []): array;
    public function create(Account $account, $attributes): Transaction;
}
