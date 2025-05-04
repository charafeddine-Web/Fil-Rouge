<?php

namespace App\Repositories;

use App\Models\Vehicule;
use App\Interfaces\VehiculeRepositoryInterface;

class VehiculeRepository implements VehiculeRepositoryInterface
{
        public function create(array $data)
    {
        return Vehicule::create($data);
    }
}
