<?php

namespace App\Services;

use App\Interfaces\AvisRepositoryInterface;
use App\Models\Reservation;
use App\Models\Conducteur;
use App\Models\Trajet;
use App\Models\Avis;
use Illuminate\Support\Facades\DB;

class AvisService
{
    protected $avisRepository;

    public function __construct(AvisRepositoryInterface $avisRepository)
    {
        $this->avisRepository = $avisRepository;
    }

    public function getAllAvis()
    {
        return $this->avisRepository->getAll();
    }

    public function getAvisById($id)
    {
        return $this->avisRepository->getById($id);
    }

    public function createAvis(array $data)
    {
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // First, create the review
            $avis = $this->avisRepository->create($data);
            
            // Get the reservation to find the driver
            $reservation = Reservation::with('trajet.conducteur')->findOrFail($data['reservation_id']);
            
            // If we have a valid reservation with a driver
            if ($reservation && $reservation->trajet && $reservation->trajet->conducteur) {
                // Get the driver
                $conducteur = $reservation->trajet->conducteur;
                
                // Calculate the new average rating for this driver
                $newAverage = $this->calculateAverageRating($conducteur->id);
                
                // Update the driver's average rating
                $conducteur->note_moyenne = $newAverage;
                $conducteur->save();
                
                // Add the new average to the return data
                $avis->new_average = $newAverage;
            }
            
            // Commit the transaction
            DB::commit();
            
            return $avis;
        } catch (\Exception $e) {
            // If there was an error, rollback the transaction
            DB::rollBack();
            throw $e;
        }
    }

    public function updateAvis($id, array $data)
    {
        DB::beginTransaction();
        
        try {
            // Update the review
            $result = $this->avisRepository->update($id, $data);
            
            // If rating was changed, recalculate driver's average
            if (isset($data['note'])) {
                $avis = Avis::with('reservation.trajet.conducteur')->findOrFail($id);
                
                if ($avis->reservation && $avis->reservation->trajet && $avis->reservation->trajet->conducteur) {
                    $conducteur = $avis->reservation->trajet->conducteur;
                    $newAverage = $this->calculateAverageRating($conducteur->id);
                    
                    $conducteur->note_moyenne = $newAverage;
                    $conducteur->save();
                }
            }
            
            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteAvis($id)
    {
        DB::beginTransaction();
        
        try {
            // Get the review before deleting to find the driver
            $avis = Avis::with('reservation.trajet.conducteur')->findOrFail($id);
            $conducteur = null;
            
            if ($avis->reservation && $avis->reservation->trajet && $avis->reservation->trajet->conducteur) {
                $conducteur = $avis->reservation->trajet->conducteur;
            }
            
            // Delete the review
            $result = $this->avisRepository->delete($id);
            
            // If we have a driver, recalculate their average
            if ($conducteur) {
                $newAverage = $this->calculateAverageRating($conducteur->id);
                $conducteur->note_moyenne = $newAverage;
                $conducteur->save();
            }
            
            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    /**
     * Calculate the average rating for a driver
     * 
     * @param int $conducteurId The driver ID
     * @return float The calculated average rating
     */
    public function calculateAverageRating($conducteurId)
    {
        // Get all trajets for this driver
        $trajets = Trajet::where('conducteur_id', $conducteurId)->pluck('id')->toArray();
        
        if (empty($trajets)) {
            return 0; // No trips found for this driver
        }
        
        // Get all reservations for these trips
        $reservations = Reservation::whereIn('trajet_id', $trajets)->pluck('id')->toArray();
        
        if (empty($reservations)) {
            return 0; // No reservations found for these trips
        }
        
        // Calculate the average of all reviews for these reservations
        $averageRating = Avis::whereIn('reservation_id', $reservations)
            ->avg('note');
        
        // If no reviews found, return 0
        return $averageRating ?: 0;
    }
}
