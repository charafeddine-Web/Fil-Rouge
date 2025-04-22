<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\AvisService;
use Illuminate\Http\Request;

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

        $avis = $this->avisService->createAvis($validated);
        return response()->json($avis, 201);
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
}
