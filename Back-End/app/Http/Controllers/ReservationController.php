<?php

namespace App\Http\Controllers;

use App\Services\ReservationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Reservation;

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
        \Log::info('Updating reservation', ['reservation_id' => $id]);

        $reservation = $this->reservationService->getReservationById($id);

        if (!$reservation) {
            \Log::warning('Reservation not found', ['id' => $id]);
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        $user = auth()->user();

        if ($user->role === 'conducteur') {
            $conducteurId = $user->conducteur->id ?? null;

            if (!$conducteurId) {
                \Log::warning('User has conducteur role but no conducteur record', ['user_id' => $user->id]);
                return response()->json(['message' => 'Conducteur record not found'], 403);
            }

            $trajetConducteurId = $reservation->trajet->conducteur_id ?? null;

            if ($trajetConducteurId !== $conducteurId) {
                \Log::warning('Permission denied - conductor does not own this ride', [
                    'trajet_conducteur_id' => $trajetConducteurId,
                    'user_conducteur_id' => $conducteurId
                ]);
                return response()->json(['message' => 'You are not authorized to update this reservation'], 403);
            }
        }

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
            \Log::error('Reservation update failed', ['id' => $id]);
            return response()->json(['message' => 'Reservation update failed'], 500);
        }

        \Log::info('Reservation updated successfully', ['id' => $id]);
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

    public function cancel(int $id): JsonResponse
    {
        $reservation = $this->reservationService->getReservationById($id);

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        $trajet = $reservation->trajet;

        if (!$trajet) {
            return response()->json(['message' => 'Trajet not found for this reservation'], 404);
        }

        try {
            \DB::beginTransaction();

            $reservation->status = 'annulee';
            $reservation->updated_at = now();
            $reservation->save();

            $trajet->nombre_places += $reservation->places_reservees;
            $trajet->save();

            \DB::commit();

            return response()->json([
                'message' => 'Reservation canceled successfully',
                'reservation' => $reservation,
                'trajet' => $trajet
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Error canceling reservation: ' . $e->getMessage(), [
                'reservation_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json(['message' => 'Failed to cancel reservation: ' . $e->getMessage()], 500);
        }
    }

    public function getConducteurReservations()
    {
        $conducteurId = auth()->user()->conducteur->id;
        $reservations = Reservation::whereHas('trajet', function($query) use ($conducteurId) {
            $query->where('conducteur_id', $conducteurId);
        })
        ->with(['trajet', 'passager'])
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($reservations);
    }

    public function getPassageReservations($id)
    {
        $reservations = Reservation::whereHas('trajet', function($query) use ($id) {
            $query->where('passager_id', $id);
        })
            ->with(['trajet','trajet.conducteur','trajet.conducteur.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reservations);
    }

}
