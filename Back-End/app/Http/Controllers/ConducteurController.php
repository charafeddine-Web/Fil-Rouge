<?php

namespace App\Http\Controllers;

use App\Models\Conducteur;
use Illuminate\Http\Request;

class ConducteurController extends Controller
{
    public function getByUserId($id)
    {
        $conducteur = Conducteur::with('user')
        ->where('user_id', $id)->first();

        if (!$conducteur) {
            return response()->json(['message' => 'Conducteur not found'], 404);
        }
        return response()->json($conducteur);
    }

}
