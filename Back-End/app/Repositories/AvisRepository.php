<?php

namespace App\Repositories;

use App\Models\Avis;
use App\Interfaces\AvisRepositoryInterface;

class AvisRepository implements AvisRepositoryInterface
{
    public function getAll()
    {
        return Avis::all();
    }

    public function getById($id)
    {
        return Avis::findOrFail($id);
    }

    public function create(array $data): Avis
    {
        return Avis::create($data);
    }

    public function update($id, array $data): bool
    {
        $avis = Avis::findOrFail($id);
        return $avis->update($data);
    }

    public function delete($id): bool
    {
        $avis = Avis::findOrFail($id);
        return $avis->delete();
    }
}
