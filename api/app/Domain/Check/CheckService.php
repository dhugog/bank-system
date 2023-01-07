<?php

namespace App\Domain\Check;

use App\Domain\Check\CheckRepository;
use App\Domain\Transaction\TransactionRepository;
use App\Enums\CheckStatus;
use App\Models\User;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class CheckService
{
    protected $repository;
    protected $transactionRepository;

    public function __construct(
        CheckRepository $repository,
        TransactionRepository $transactionRepository
    ) {
        $this->repository = $repository;
        $this->transactionRepository = $transactionRepository;
    }

    public function getPaginatedList(int $perPage, array $filters = [], array $sort = []): Paginator
    {
        return $this->repository->getPaginatedList($perPage, $filters, $sort);
    }

    public function create($attributes): Check
    {
        return $this->repository->create($attributes);
    }

    public function approve(Check $check, User $user): void
    {
        if ($check->status !== CheckStatus::PENDING) {
            throw new BadRequestHttpException('Check is already approved or rejected');
        }

        DB::transaction(function () use ($check, $user) {
            $this->repository->update($check, [
                'status' => CheckStatus::APPROVED,
                'reviewed_by' => $user->id,
                'reviewed_at' => now(),
            ]);

            $this->transactionRepository->create($check->account, [
                'transactionable_type' => $check->getMorphClass(),
                'transactionable_id' => $check->id,
                'amount' => $check->amount,
                'description' => $check->description,
            ]);
        });
    }

    public function reject(Check $check, $user): void
    {
        if ($check->status !== CheckStatus::PENDING) {
            throw new BadRequestHttpException('Check is already approved or rejected');
        }

        $this->repository->update($check, [
            'status' => CheckStatus::REJECTED,
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
        ]);
    }
}
