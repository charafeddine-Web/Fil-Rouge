<?php

namespace App\Services;

use App\Interfaces\ReservationInterface;
use App\Models\Reservation;
use App\Models\Trajet;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ReservationService
{
    protected ReservationInterface $reservationRepository;

    public function __construct(ReservationInterface $reservationRepository)
    {
        $this->reservationRepository = $reservationRepository;
    }

    public function getAllReservations(): Collection
    {
        return $this->reservationRepository->all();
    }

    public function getReservationById(int $id): ?Reservation
    {
        return $this->reservationRepository->findById($id);
    }

    public function createReservation(array $data): Reservation
    {
        // Start a database transaction to ensure data consistency
        return DB::transaction(function () use ($data) {
            $trajet = Trajet::findOrFail($data['trajet_id']);

            $remainingSeats = $trajet->nombre_places - $data['places_reservees'];

            // Check if enough seats are available
            if ($remainingSeats < 0) {
                throw new \Exception("Pas assez de places disponibles");
            }

            // Update trajet's available seats
            $trajet->nombre_places = $remainingSeats;
            $trajet->save();

            // Create the reservation
            return $this->reservationRepository->create($data);
        });
    }

    public function updateReservation(int $id, array $data): bool
    {
        return $this->reservationRepository->update($id, $data);
    }

    public function deleteReservation(int $id): bool
    {
        return $this->reservationRepository->delete($id);
    }
    public function getReservationsByDriverId(int $driverId)
    {
        return $this->reservationRepository->getReservationsByUserId($driverId);
    }

}
