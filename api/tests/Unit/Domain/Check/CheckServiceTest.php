<?php

namespace Tests\Unit\Domain\Check;

use App\Domain\Account\Account;
use App\Domain\Check\Check;
use App\Domain\Check\CheckRepository;
use App\Domain\Check\CheckService;
use App\Domain\Transaction\TransactionRepository;
use App\Enums\CheckStatus;
use App\Models\User;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Tests\TestCase;

class CheckServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $service;
    protected $checkRepository;
    protected $transactionRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->checkRepository = Mockery::mock(CheckRepository::class);
        $this->transactionRepository = Mockery::mock(TransactionRepository::class);

        $this->service = new CheckService(
            $this->checkRepository,
            $this->transactionRepository
        );
    }

    protected function tearDown(): void
    {
        Mockery::close();
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

        $this->assertEquals($paginator, $this->service->getPaginatedList($perPage, $filters, $sort));
    }

    public function testCreate(): void
    {
        $attributes = ['account_id' => 1, 'amount' => 100, 'description' => 'test'];
        $check = Mockery::mock(Check::class);
        $check->shouldReceive('setAttribute');
        $check->shouldReceive('getAttribute');

        $this->checkRepository
            ->shouldReceive('create')
            ->with($attributes)
            ->andReturn($check);

        $this->assertEquals($check, $this->service->create($attributes));
    }

    public function testApproveWithSuccess()
    {
        $check = new Check([
            'id' => 1,
            'account_id' => 1,
            'amount' => 100,
            'description' => 'test',
            'status' => CheckStatus::PENDING,
        ]);
        $check->id = 1;
        $check->account = Mockery::mock(Account::class);

        $user = new User();
        $user->id = 1;

        $this->checkRepository->shouldReceive('update')
            ->with($check, Mockery::subset([
                'status' => CheckStatus::APPROVED,
                'reviewed_by' => $user->id,
            ]));

        $this->transactionRepository->shouldReceive('create')
            ->with($check->account, Mockery::subset([
                'transactionable_type' => $check->getMorphClass(),
                'transactionable_id' => $check->id,
                'amount' => $check->amount,
                'description' => $check->description,
            ]));

        $this->assertNull($this->service->approve($check, $user));
    }

    public function testApproveThrowsExceptionIfCheckIsNotPending()
    {
        $check = new Check([
            'account_id' => 1,
            'amount' => 100,
            'description' => 'test',
            'status' => CheckStatus::APPROVED,
        ]);

        $user = Mockery::mock(User::class);

        $this->expectException(BadRequestHttpException::class);

        $this->service->approve($check, $user);
    }

    public function testRejectWithSuccess()
    {
        $check = new Check([
            'id' => 1,
            'account_id' => 1,
            'amount' => 100,
            'description' => 'test',
            'status' => CheckStatus::PENDING,
        ]);
        $check->id = 1;
        $check->account = Mockery::mock(Account::class);

        $user = new User();
        $user->id = 1;

        $this->checkRepository->shouldReceive('update')
            ->with($check, Mockery::subset([
                'status' => CheckStatus::REJECTED,
                'reviewed_by' => $user->id,
            ]));

        $this->assertNull($this->service->reject($check, $user));

        $this->transactionRepository->shouldNotHaveReceived('create');
    }

    public function testRejectThrowsExceptionIfCheckIsNotPending()
    {
        $check = new Check([
            'account_id' => 1,
            'amount' => 100,
            'description' => 'test',
            'status' => CheckStatus::REJECTED,
        ]);

        $user = Mockery::mock(User::class);

        $this->expectException(BadRequestHttpException::class);

        $this->service->reject($check, $user);
    }
}
