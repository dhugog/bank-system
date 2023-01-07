<?php

namespace App\Domain\Transaction;

use App\Domain\Transaction\TransactionRepository;
use Illuminate\Contracts\Pagination\Paginator;

class TransactionService
{
    protected $repository;

    public function __construct(
        TransactionRepository $repository
    ) {
        $this->repository = $repository;
    }

    public function getPaginatedList(int $perPage, array $filters = [], array $sort = []): Paginator
    {
        return $this->repository->getPaginatedList($perPage, $filters, $sort);
    }

    public function getSummary(array $filters = []): array
    {
        return $this->repository->getSummary($filters);
    }
}
