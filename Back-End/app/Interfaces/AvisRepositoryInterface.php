<?php

namespace App\Interfaces;

use App\Models\Avis;

interface AvisRepositoryInterface
{
    public function getAll();
    public function getById($id);
    public function create(array $data): Avis;
    public function update($id, array $data): bool;
    public function delete($id): bool;
}
