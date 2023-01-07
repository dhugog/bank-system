<?php

namespace App\Domain\Check;

use Illuminate\Contracts\Pagination\Paginator;

interface CheckRepository
{
    public function getPaginatedList(int $perPage, array $filters = [], array $sort = []): Paginator;
    public function create($attributes);
    public function update(Check $check, $attributes);
}
