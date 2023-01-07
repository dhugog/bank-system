<?php

namespace App\Providers;

use App\Domain\Check\CheckRepository;
use App\Domain\Purchase\PurchaseRepository;
use App\Domain\Transaction\TransactionRepository;
use App\Infrastructure\Eloquent\CheckRepositoryEloquent;
use App\Infrastructure\Eloquent\PurchaseRepositoryEloquent;
use App\Infrastructure\Eloquent\TransactionRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(CheckRepository::class, CheckRepositoryEloquent::class);
        $this->app->bind(TransactionRepository::class, TransactionRepositoryEloquent::class);
        $this->app->bind(PurchaseRepository::class, PurchaseRepositoryEloquent::class);
        $this->app->bind(TransactionRepository::class, TransactionRepositoryEloquent::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
