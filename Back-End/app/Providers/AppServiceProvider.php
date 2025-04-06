<?php

namespace App\Providers;

use App\Interfaces\ConducteurRepositoryInterface;
use App\Interfaces\UserRepositoryInterface;
use App\Interfaces\VehiculeRepositoryInterface;
use App\Repositories\ConducteurRepository;
use App\Repositories\UserRepository;
use App\Repositories\VehiculeRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(ConducteurRepositoryInterface::class, ConducteurRepository::class);
        $this->app->bind(VehiculeRepositoryInterface::class, VehiculeRepository::class);    }

    /**
     * Bootstrap any app&lication services.
     */
    public function boot(): void
    {
        //
    }
}
