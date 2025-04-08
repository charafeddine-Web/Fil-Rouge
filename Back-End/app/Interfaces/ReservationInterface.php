<?php

namespace App\Interfaces;

use App\Models\Reservation;
use Illuminate\Database\Eloquent\Collection;

interface ReservationInterface
{
    public function all();
    public function findById(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
}
