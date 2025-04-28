<?php

namespace App\Repositories;

use App\Models\Trajet;
use App\Interfaces\TrajetRepositoryInterface;

class TrajetRepository implements TrajetRepositoryInterface
{
    public function all()
    {
//        return Trajet::with('conducteur', 'passagers')->get();
        return Trajet::with('conducteur.user')->get();
    }

    public function find(int $id)
    {
        return Trajet::with('conducteur', 'passagers')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Trajet::create($data);
    }

    public function update(int $id, array $data)
    {
        $trajet = Trajet::findOrFail($id);
        $trajet->update($data);
        return $trajet;
    }

    public function delete(int $id)
    {
        $trajet = Trajet::findOrFail($id);
        return $trajet->delete();
    }
}
