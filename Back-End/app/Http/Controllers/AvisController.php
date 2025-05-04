<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\AvisService;
use Illuminate\Http\Request;
use App\Models\Reservation;

class AvisController extends Controller
{
    protected $avisService;

    public function __construct(AvisService $avisService)
    {
        $this->avisService = $avisService;
    }

    public function index()
    {
        return response()->json($this->avisService->getAllAvis());
    }

    public function show($id)
    {
        return response()->json($this->avisService->getAvisById($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string',
        ]);

        $existingAvis = \App\Models\Avis::where('reservation_id', $validated['reservation_id'])->first();
        if ($existingAvis) {
            return response()->json([
                'message' => 'Cette réservation a déjà été évaluée',
                'avis' => $existingAvis
            ], 422);
        }

        $reservation = Reservation::find($validated['reservation_id']);
        if ($reservation->status !== 'confirmee') {
            return response()->json([
                'message' => 'Vous ne pouvez évaluer que les réservations confirmées'
            ], 422);
        }

        $avis = $this->avisService->createAvis($validated);

        return response()->json([
            'message' => 'Avis créé avec succès',
            'avis' => $avis,
            'new_average' => $avis->new_average ?? null
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'note' => 'sometimes|integer|min:1|max:5',
            'commentaire' => 'nullable|string',
        ]);

        $this->avisService->updateAvis($id, $validated);
        return response()->json(['message' => 'Avis updated successfully']);
    }

    public function destroy($id)
    {
        $this->avisService->deleteAvis($id);
        return response()->json(['message' => 'Avis deleted successfully']);
    }

    /**
     * Get review for a specific reservation
     */
    public function getReviewByReservation($reservationId)
    {
        $avis = \App\Models\Avis::where('reservation_id', $reservationId)->first();

        if (!$avis) {
            return response()->json(null, 404);
        }

        return response()->json($avis);
    }
}
