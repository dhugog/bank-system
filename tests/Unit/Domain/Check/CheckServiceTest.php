<?php

namespace Tests\Unit\Domain\Check;

use App\Domain\Check\Check;
use App\Domain\Check\CheckRepository;
use App\Domain\Check\CheckService;
use App\Domain\Transaction\TransactionRepository;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class CheckServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $checkService;
    protected $checkRepository;
    protected $transactionRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->checkRepository = Mockery::mock(CheckRepository::class);
        $this->transactionRepository = Mockery::mock(TransactionRepository::class);

        $this->checkService = new CheckService(
            $this->checkRepository,
            $this->transactionRepository
        );
    }

    public function testGetPaginatedList(): void
    {
        $perPage = 10;
        $filters = ['account_id' => 1];
        $sort = ['sort' => 'id', 'order' => 'asc'];
        $paginator = Mockery::mock(Paginator::class);

        $this->checkRepository
            ->shouldReceive('getPaginatedList')
            ->with($perPage, $filters, $sort)
            ->andReturn($paginator);

        $this->assertEquals($paginator, $this->checkService->getPaginatedList($perPage, $filters, $sort));
    }

    public function testCreate(): void
    {
        $attributes = ['account_id' => 1, 'amount' => 100, 'description' => 'test'];
        $check = Mockery::mock(Check::class);

        $this->checkRepository
            ->shouldReceive('create')
            ->with($attributes)
            ->andReturn($check);

        $this->assertEquals($check, $this->checkService->create($attributes));
    }
}
