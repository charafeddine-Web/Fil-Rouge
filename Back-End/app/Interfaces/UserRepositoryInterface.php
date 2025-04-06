<?php
namespace App\Interfaces;

use App\Models\User;
use Illuminate\Http\Request;

interface UserRepositoryInterface
{
    public function create(array $data);
    public function findByEmail(string $email);
    public function updateProfile($user, $request);

}
