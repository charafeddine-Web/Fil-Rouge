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

    public function getReservationsByDriverId(int $driverId)
    {
        return Reservation::with('trajet')
        ->whereHas('trajet', function ($query) use ($driverId) {
            $query->where('conducteur_id', $driverId);
        })->get();
    }
}
