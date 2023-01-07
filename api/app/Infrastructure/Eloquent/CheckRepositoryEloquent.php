<?php

namespace App\Infrastructure\Eloquent;

use App\Domain\Check\Check;
use App\Domain\Check\CheckRepository;
use Illuminate\Contracts\Pagination\Paginator;

class CheckRepositoryEloquent implements CheckRepository
{
    private $model;

    public function __construct(Check $check)
    {
        $this->model = $check;
    }

    public function getPaginatedList(int $perPage, array $filters = [], array $sort = []): Paginator
    {
        return $this->model->when(isset($filters['account_id']), function ($query) use ($filters) {
            return $query->where('account_id', $filters['account_id']);
        })
            ->when(isset($filters['status']), function ($query) use ($filters) {
                return $query->where('status', $filters['status']);
            })
            ->when(isset($filters['from']), function ($query) use ($filters) {
                return $query->where('created_at', '>=', $filters['from']);
            })
            ->when(isset($filters['to']), function ($query) use ($filters) {
                return $query->where('created_at', '<=', $filters['to']);
            })
            ->with(['account.user'])
            ->orderBy($sort['sort'] ?? 'id', $sort['order'] ?? 'asc')
            ->simplePaginate($perPage ?? 10);
    }

    public function create($attributes): Check
    {
        return $this->model->create($attributes);
    }

    public function update(Check $check, $attributes): void
    {
        $check->fill($attributes);
        $check->save();
    }
}
