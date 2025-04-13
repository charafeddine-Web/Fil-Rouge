<?php

namespace App\Providers;

use App\Interfaces\ConducteurRepositoryInterface;
use App\Interfaces\ReservationInterface;
use App\Interfaces\TrajetRepositoryInterface;
use App\Interfaces\UserRepositoryInterface;
use App\Interfaces\VehiculeRepositoryInterface;
use App\Repositories\AvisRepository;
use App\Repositories\ConducteurRepository;
use App\Interfaces\AvisRepositoryInterface;
use App\Repositories\ReservationRepository;
use App\Repositories\TrajetRepository;
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
        $this->app->bind(VehiculeRepositoryInterface::class, VehiculeRepository::class);
        $this->app->bind(ReservationInterface::class, ReservationRepository::class);
        $this->app->bind(TrajetRepositoryInterface::class, TrajetRepository::class);
        $this->app->bind(AvisRepositoryInterface::class, AvisRepository::class);

    }
    /**
     * Bootstrap any app&lication services.
     */
    public function boot(): void
    {
        //
    }
}
