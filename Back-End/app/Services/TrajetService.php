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
        return Trajet::with(['conducteur.user', 'conducteur.vehicule'])->get();
    }

    public function getById($id)
    {
        return Trajet::with(['conducteur.user', 'conducteur.vehicule'])->find($id);
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
    public function searchAndFilter(array $filters)
    {
        $query = Trajet::query();

        if (!empty($filters['lieu_depart'])) {
            $query->where('lieu_depart', 'like', '%' . $filters['lieu_depart'] . '%');
        }

        if (!empty($filters['lieu_arrivee'])) {
            $query->where('lieu_arrivee', 'like', '%' . $filters['lieu_arrivee'] . '%');
        }

        if (!empty($filters['nombre_places'])) {
            $query->where('nombre_places', '>=', $filters['nombre_places']);
        }

        if (!empty($filters['date_depart'])) {
            $query->whereDate('date_depart', $filters['date_depart']);
        }

        if (isset($filters['fumeur_autorise'])) {
            $query->where('fumeur_autorise', $filters['fumeur_autorise']);
        }

        if (isset($filters['bagages_autorises'])) {
            $query->where('bagages_autorises', $filters['bagages_autorises']);
        }

        if (!empty($filters['min_prix'])) {
            $query->where('prix_par_place', '>=', $filters['min_prix']);
        }

        if (!empty($filters['max_prix'])) {
            $query->where('prix_par_place', '<=', $filters['max_prix']);
        }

        return $query->get();
    }

    public function getTrajetByConducteur($conducteurId)
    {
        $trajets = Trajet::where('conducteur_id', $conducteurId)->get();
        return $trajets;
    }


//    public function searchByLieux(string $lieu_depart, string $lieu_arrivee,$nombre_places)
//    {
//        return Trajet::where('lieu_depart', 'LIKE', "%{$lieu_depart}%")
//            ->where('lieu_arrivee', 'LIKE', "%{$lieu_arrivee}%")
//            ->where('nombre_places', 'LIKE', "%{$nombre_places}%")
//            ->get();
//    }


}
