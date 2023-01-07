<?php

namespace App\Domain\Purchase;

use Illuminate\Contracts\Pagination\Paginator;

interface PurchaseRepository
{
    public function getPaginatedList(int $perPage, array $filters = [], array $sort = []): Paginator;
    public function create($attributes);
}
