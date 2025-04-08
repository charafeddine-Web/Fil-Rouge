<?php
namespace App\Http\Controllers;

use App\Models\Trajet;
use Illuminate\Http\Request;
use App\Services\TrajetService;

class TrajetController extends Controller
{
    protected $trajetService;

    public function __construct(TrajetService $trajetService)
    {
        $this->trajetService = $trajetService;
    }

    public function index()
    {
        return response()->json($this->trajetService->getAll());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'conducteur_id' => 'required|exists:conducteurs,id',
            'lieu_depart' => 'required|string|max:255',
            'lieu_arrivee' => 'required|string|max:255',
            'date_depart' => 'required|date',
            'nombre_places' => 'required|integer|min:1',
        ]);

        $trajet = $this->trajetService->create($validated);

        return response()->json($trajet, 201);
    }

    public function show($id)
    {
        return response()->json($this->trajetService->getById($id));
    }

    public function update(Request $request, $trajet)
    {
        $validated = $request->validate([
            'lieu_depart' => 'sometimes|string|max:255',
            'lieu_arrivee' => 'sometimes|string|max:255',
            'date_depart' => 'sometimes|date',
            'nombre_places' => 'sometimes|integer|min:1',
        ]);

        $updated = $this->trajetService->update($trajet, $validated);

        return response()->json($updated);
    }

    public function destroy($trajet)
    {
        $this->trajetService->delete($trajet);
        return response()->json(['message' => 'Trajet supprimé avec succès.']);
    }
}

