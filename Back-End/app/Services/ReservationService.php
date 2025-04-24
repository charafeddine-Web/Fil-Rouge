<?php

namespace App\Services;

use App\Interfaces\ReservationInterface;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Collection;

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
        return $this->reservationRepository->create($data);
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
        return $this->reservationRepository->getReservationsByDriverId($driverId);
//        return Reservation::whereHas('trajet', function ($query) use ($driverId) {
//            $query->where('conducteur_id', $driverId);
//        })->get();
    }

}
