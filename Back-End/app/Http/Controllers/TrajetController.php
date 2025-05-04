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
            'nombre_places' => 'required|integer|min:1|max:10',
            'prix_par_place' => 'required|numeric|min:0',
            'bagages_autorises' => 'boolean',
            'fumeur_autorise' => 'boolean',
            'date_arrivee_prevue' => 'required|date'
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
            'date_depart' => 'sometimes|date|after_or_equal:now',
            'nombre_places' => 'sometimes|integer|min:1|max:10',
            'prix_par_place' => 'sometimes|numeric|min:0',
            'statut' => 'sometimes|in:planifié,en_cours,terminé,annulé',
            'bagages_autorises' => 'boolean',
            'fumeur_autorise' => 'boolean',
        ]);

        $updated = $this->trajetService->update($trajet, $validated);

        return response()->json($updated);
    }

    public function destroy($trajet)
    {
        $this->trajetService->delete($trajet);
        return response()->json(['message' => 'Trajet supprimé avec succès.']);
    }
    public function cancel($id)
    {
        $trajet = $this->trajetService->getById($id);

        if (!$trajet) {
            return response()->json(['message' => 'Route not found.'], 404);
        }

        $updated = $this->trajetService->update($id, ['statut' => 'annulé']);

        return response()->json(['message' => 'Trip successfully canceled.', 'trajet' => $updated]);
    }
    public function en_cours($id)
    {
        $trajet = $this->trajetService->getById($id);

        if (!$trajet) {
            return response()->json(['message' => 'Route not found.'], 404);
        }

        $updated = $this->trajetService->update($id, ['statut' => 'en_cours']);

        return response()->json(['message' => 'Trip in progress', 'trajet' => $updated]);
    }
    public function termine($id)
    {
        $trajet = $this->trajetService->getById($id);

        if (!$trajet) {
            return response()->json(['message' => 'Route not found.'], 404);
        }

        $updated = $this->trajetService->update($id, ['statut' => 'terminé']);

        return response()->json(['message' => 'Trip successfully completed.', 'trajet' => $updated]);
    }


    public function search(Request $request)
    {
        $validated = $request->validate([
            'lieu_depart' => 'nullable|string',
            'lieu_arrivee' => 'nullable|string',
            'nombre_places' => 'nullable|integer|min:1|max:10',
            'date_depart' => 'nullable|date|after_or_equal:today',
            'fumeur_autorise' => 'nullable|boolean',
            'bagages_autorises' => 'nullable|boolean',
            'min_prix' => 'nullable|numeric|min:0',
            'max_prix' => 'nullable|numeric|min:0',
        ]);

        $result = $this->trajetService->searchAndFilter($validated);

        return response()->json($result);
    }


    public function getTrajetsByConducteur($conducteurId)
    {
        $trajets=$this->trajetService->getTrajetByConducteur($conducteurId);
        return response()->json($trajets);
    }







//    public function search(Request $request)
//    {
//        $request->validate([
//            'lieu_depart' => 'required|string',
//            'lieu_arrivee' => 'required|string',
//            'nombre_places'=> 'required|integer|min:1|max:10',
//        ]);
//
//        $lieu_depart = $request->input('lieu_depart');
//        $lieu_arrivee = $request->input('lieu_arrivee');
//        $nombre_places = $request->input('nombre_places');
//
//
//        $trajets = $this->trajetService->searchByLieux($lieu_depart, $lieu_arrivee,$nombre_places);
//
//        return response()->json($trajets);
//    }


}

