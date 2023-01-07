<?php

namespace Tests\Unit\Infrastructure;

use App\Domain\Check\Check;
use App\Infrastructure\Eloquent\CheckRepositoryEloquent;
use Illuminate\Contracts\Pagination\Paginator;
use Mockery;
use Tests\TestCase;

class CheckRepositoryEloquentTest extends TestCase
{
    protected $repository;
    protected $check;

    protected function setUp(): void
    {
        parent::setUp();

        $this->check = Mockery::mock(Check::class);

        $this->repository = new CheckRepositoryEloquent($this->check);
    }

    protected function tearDown(): void
    {
        Mockery::close();
    }

    public function testGetPaginatedList()
    {
        $this->check->shouldReceive('when')->andReturnSelf()
            ->shouldReceive('where')->andReturnSelf()
            ->shouldReceive('with')->andReturnSelf()
            ->shouldReceive('orderBy')->andReturnSelf()
            ->shouldReceive('simplePaginate')->andReturn(Mockery::mock(Paginator::class));

        $result = $this->repository->getPaginatedList(10, ['account_id' => 1, 'status' => 'active', 'from' => '2022-01-01', 'to' => '2022-12-31'], []);

        $this->assertInstanceOf(Paginator::class, $result);
    }

    public function testCreate()
    {
        $this->check->shouldReceive('create')->andReturn($this->check);

        $result = $this->repository->create([
            'account_id' => 1,
            'amount' => 100,
            'description' => 'test',
        ]);

        $this->assertInstanceOf(Check::class, $result);
    }

    public function testUpdate()
    {
        $this->check->shouldReceive('fill')->with([
            'account_id' => 1,
            'amount' => 100,
            'description' => 'test',
        ])->once();
        $this->check->shouldReceive('save')->once();

        $this->assertNull(
            $this->repository->update($this->check, [
                'account_id' => 1,
                'amount' => 100,
                'description' => 'test',
            ])
        );
    }
}
