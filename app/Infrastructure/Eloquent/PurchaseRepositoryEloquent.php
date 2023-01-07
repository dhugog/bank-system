<?php

namespace App\Infrastructure\Eloquent;

use App\Domain\Purchase\Purchase;
use App\Domain\Purchase\PurchaseRepository;
use Illuminate\Contracts\Pagination\Paginator;

class PurchaseRepositoryEloquent implements PurchaseRepository
{
    public function getPaginatedList(int $perPage, array $filters = [], array $sort = []): Paginator
    {
        return Purchase::when(isset($filters['account_id']), function ($query) use ($filters) {
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

    public function create($attributes): Purchase
    {
        return Purchase::create($attributes);
    }
}
