<?php

namespace App\Services;

use App\Interfaces\AvisRepositoryInterface;

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
        return $this->avisRepository->create($data);
    }

    public function updateAvis($id, array $data)
    {
        return $this->avisRepository->update($id, $data);
    }

    public function deleteAvis($id)
    {
        return $this->avisRepository->delete($id);
    }
}
