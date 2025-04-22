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
    public function searchByLieux(string $lieu_depart, string $lieu_arrivee,$nombre_places)
    {
        return Trajet::where('lieu_depart', 'LIKE', "%{$lieu_depart}%")
            ->where('lieu_arrivee', 'LIKE', "%{$lieu_arrivee}%")
            ->where('nombre_places', 'LIKE', "%{$nombre_places}%")
            ->get();
    }


}
