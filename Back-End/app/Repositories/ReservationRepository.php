<?php

namespace App\Repositories;

use App\Models\Reservation;
use App\Interfaces\ReservationInterface;
use Illuminate\Database\Eloquent\Collection;

class ReservationRepository implements ReservationInterface
{
    public function all()
    {
        return Reservation::all();
    }

    public function findById(int $id)
    {
        return Reservation::find($id);
    }

    public function create(array $data)
    {
        return Reservation::create($data);
    }

    public function update(int $id, array $data)
    {
        $reservation = $this->findById($id);
        if (!$reservation) {
            return false;
        }
        return $reservation->update($data);
    }

    public function delete(int $id)
    {
        $reservation = $this->findById($id);
        if (!$reservation) {
            return false;
        }
        return $reservation->delete();
    }

//    public function getReservationsByUserId(int $userId)
//    {
//        return Reservation::with('trajet')
//            ->where(function ($query) use ($userId) {
//                $query->where('user_id', $userId)
//                ->orWhereHas('trajet', function ($subQuery) use ($userId) {
//                    $subQuery->where('conducteur_id', $userId);
//                });
//            })
//            ->get();
//    }
    public function getReservationsByUserId(int $userId)
    {
        return Reservation::with('trajet')
            ->where('user_id', $userId) // passager
            ->orWhereHas('trajet', function ($query) use ($userId) {
                $query->where('conducteur_id', $userId); // conducteur
            })
            ->get();
    }


}
