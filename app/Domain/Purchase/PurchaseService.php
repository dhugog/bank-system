<?php

namespace App\Domain\Purchase;

use App\Domain\Purchase\Purchase;
use App\Domain\Transaction\TransactionRepository;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class PurchaseService
{
    protected $repository;
    protected $transactionRepository;

    public function __construct(
        PurchaseRepository $repository,
        TransactionRepository $transactionRepository
    ) {
        $this->repository = $repository;
        $this->transactionRepository = $transactionRepository;
    }

    public function getPaginatedList(int $perPage, array $filters = [], array $sort = []): Paginator
    {
        return $this->repository->getPaginatedList($perPage, $filters, $sort);
    }

    public function create($attributes): Purchase
    {
        return DB::transaction(function () use ($attributes) {
            $account = $attributes['account'];

            if ($account->balance < $attributes['amount']) {
                throw new BadRequestHttpException('Insufficient funds');
            }

            $purchase = $this->repository->create([
                ...$attributes,
                'account_id' => $account->id,
            ]);

            $this->transactionRepository->create($account, [
                'transactionable_type' => $purchase->getMorphClass(),
                'transactionable_id' => $purchase->id,
                'amount' => $purchase->amount * -1,
                'description' => $purchase->description,
            ]);

            return $purchase;
        });
    }
}
