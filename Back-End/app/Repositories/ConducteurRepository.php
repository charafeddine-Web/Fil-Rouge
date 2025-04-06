<?php

namespace App\Repositories;

use App\Models\Conducteur;
use App\Interfaces\ConducteurRepositoryInterface;

class ConducteurRepository implements ConducteurRepositoryInterface
{
    public function create(array $data)
    {
        return Conducteur::create($data);
    }
}
