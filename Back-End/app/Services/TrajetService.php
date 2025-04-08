<?php

namespace App\Services;

use App\Models\Trajet;
use App\Repositories\TrajetRepository;

class TrajetService
{
    protected $trajetRepository;

    public function __construct(TrajetRepository $trajetRepository)
    {
        $this->trajetRepository = $trajetRepository;
    }

    public function getAll()
    {
        return $this->trajetRepository->all();
    }

    public function getById($id)
    {
        return $this->trajetRepository->find($id);
    }

    public function create(array $data)
    {
        return $this->trajetRepository->create($data);
    }

    public function update($trajet, array $data)
    {
        return $this->trajetRepository->update($trajet, $data);
    }

    public function delete($trajet)
    {
        return $this->trajetRepository->delete($trajet);
    }
}
