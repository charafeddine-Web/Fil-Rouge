<?php

namespace App\Http\Controllers;

use App\Services\ReservationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReservationController extends Controller
{
    protected ReservationService $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    public function index(Request $request): JsonResponse
    {
        $driverId = $request->query('conducteur_id');

        if ($driverId) {
            $reservations = $this->reservationService->getReservationsByDriverId($driverId);
        } else {
            $reservations = $this->reservationService->getAllReservations();
        }

        return response()->json($reservations);
    }

    public function show(int $id): JsonResponse
    {
        $reservation = $this->reservationService->getReservationById($id);

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        return response()->json($reservation);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:en_attente,confirmee,annulee',
            'date_reservation' => 'required|date',
            'passager_id' => 'required|exists:users,id',
            'trajet_id' => 'required|exists:trajets,id',
            'places_reservees' => 'required|integer|min:1',
            'prix_total' => 'nullable|numeric|min:0'
        ]);

        $reservation = $this->reservationService->createReservation($validated);
        return response()->json($reservation, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:en_attente,confirmee,annulee',
            'date_reservation' => 'sometimes|date',
            'passager_id' => 'sometimes|exists:users,id',
            'trajet_id' => 'sometimes|exists:trajets,id',
            'places_reservees' => 'sometimes|integer|min:1',
            'prix_total' => 'sometimes|numeric|min:0'
        ]);
        $updated = $this->reservationService->updateReservation($id, $validated);
        if (!$updated) {
            return response()->json(['message' => 'Reservation not found or update failed'], 404);
        }
        return response()->json(['message' => 'Reservation updated successfully']);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->reservationService->deleteReservation($id);
        if (!$deleted) {
            return response()->json(['message' => 'Reservation not found or delete failed'], 404);
        }
        return response()->json(['message' => 'Reservation deleted successfully']);
    }
}
