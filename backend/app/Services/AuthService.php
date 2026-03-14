<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Exception;

class AuthService
{
    /**
     * Register a new user.
     */
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('AuthToken')->accessToken;

        return [
            'user' => $user,
            'access_token' => $token,
        ];
    }

    /**
     * Login a user.
     */
    public function login(array $credentials): array
    {
        if (!Auth::attempt($credentials)) {
            throw new Exception('Invalid credentials', 401);
        }

        $user = Auth::user();
        $token = $user->createToken('AuthToken')->accessToken;

        return [
            'user' => $user,
            'access_token' => $token,
        ];
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(): void
    {
        $user = Auth::user();
        $user->token()->revoke();
    }
}
