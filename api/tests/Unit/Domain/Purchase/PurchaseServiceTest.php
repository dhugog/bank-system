<?php

namespace Tests\Unit\Domain\Purchase;

use App\Domain\Account\Account;
use App\Domain\Purchase\Purchase;
use App\Domain\Purchase\PurchaseRepository;
use App\Domain\Purchase\PurchaseService;
use App\Domain\Transaction\TransactionRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Tests\TestCase;

class PurchaseServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $service;
    protected $purchaseRepository;
    protected $transactionRepository;

    protected $account;
    protected $purchase;
    protected $transaction;

    public function setUp(): void
    {
        parent::setUp();

        $this->purchaseRepository = Mockery::mock(PurchaseRepository::class);
        $this->transactionRepository = Mockery::mock(TransactionRepository::class);

        $this->service = new PurchaseService(
            $this->purchaseRepository,
            $this->transactionRepository
        );
    }

    protected function tearDown(): void
    {
        Mockery::close();
    }

    public function testCreateWithInsufficientFunds()
    {
        $account = new Account([
            'balance' => 0,
        ]);

        $this->expectException(BadRequestHttpException::class);

        $this->service->create([
            'account' => $account,
            'amount' => 1,
        ]);
    }

    public function testCreateWithSuccess()
    {
        $account = new Account([
            'balance' => 10,
        ]);

        $account->id = 1;

        $purchase = new Purchase([
            'account_id' => $account->id,
            'amount' => 5,
            'description' => 'Test',
            'date' => '2023-01-01 00:00:00',
        ]);

        $purchase->id = 1;

        $this->purchaseRepository->shouldReceive('create')
            ->with(
                Mockery::subset([
                    'account_id' => $account->id,
                    'amount' => 5,
                    'description' => 'Test',
                    'date' => '2023-01-01 00:00:00',
                ])
            )
            ->andReturn($purchase);

        $this->transactionRepository->shouldReceive('create')
            ->with(
                $account,
                Mockery::subset([
                    'transactionable_type' => $purchase->getMorphClass(),
                    'transactionable_id' => $purchase->id,
                    'amount' => $purchase->amount * -1,
                    'description' => $purchase->description,
                ])
            );

        $this->assertEquals($purchase, $this->service->create([
            'account' => $account,
            'amount' => 5,
            'description' => 'Test',
            'date' => '2023-01-01 00:00:00',
        ]));
    }
}
