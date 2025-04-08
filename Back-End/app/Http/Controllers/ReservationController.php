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

    public function index(): JsonResponse
    {
        $reservations = $this->reservationService->getAllReservations();
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
            'statut' => 'required|string',
            'date_reservation' => 'required|date',
            'user_id' => 'required|exists:users,id',
            'trajet_id' => 'required|exists:trajets,id',
        ]);

        $reservation = $this->reservationService->createReservation($validated);

        return response()->json($reservation, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'statut' => 'sometimes|string',
            'date_reservation' => 'sometimes|date',
            'user_id' => 'sometimes|exists:users,id',
            'trajet_id' => 'sometimes|exists:trajets,id',
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
