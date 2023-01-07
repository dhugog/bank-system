<?php

namespace App\Http\Controllers;

use App\Enums\Currencies;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
        ]);

        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $user->accounts()->create([
                'number' => rand(100000000000, 999999999999),
                'balance' => 0,
                'currency' => Currencies::USD,
            ]);

            $userRole = Role::where('slug', 'user')->first();

            $user->roles()->attach($userRole);

            return $user;
        });

        $permissions = $user->roles
            ->flatMap(function ($role) {
                return $role->permissions;
            })
            ->pluck('slug')
            ->toArray();

        return response()->json([
            'token' => $user->createToken('authToken', $permissions)->plainTextToken,
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only(['email', 'password']))) {
            return response()->json([
                'message' => 'Email & Password does not match with our record.',
            ], 401);
        }

        $user = User::where('email', $request->email)->first();

        $permissions = $user->roles
            ->flatMap(function ($role) {
                return $role->permissions;
            })
            ->pluck('slug')
            ->toArray();

        return response()->json([
            'token' => $user->createToken('authToken', $permissions)->plainTextToken,
        ]);
    }
}
