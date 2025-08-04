<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {

        $credentials = [
            'document_number' => $request->input('documentNumber'),
            'password' => $request->input('password')
        ];

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $request->session()->addSignatureCookie();

            $user = Auth::user();

            return response([
                'user' => [
                    'fullName' => $user->abreviatedFullName,
                    'role' => [
                        'id' => $user->role->id,
                        'name' => $user->role->name,
                    ],
                    "doctorId" => $user->doctor ? $user->doctor->id : null,
                    "specialty" => $user->doctor ? [
                        'id' => $user->doctor->specialty->id,
                        'name' => $user->doctor->specialty->name,
                    ] : null
                ]
            ]);

        }

        return response()->json([
            'type' => 'error_login',
            'message' => 'Credenciales inválidas.',
        ], 401);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
        $request->session()->forgetSignatureCookie();

        return response([
            'type' => 'success_logout',
            'message' => 'Cierre de sesión exitoso'
        ], 200);
    }

    public function me(Request $request)
    {
        $user = Auth::user();

        return response([
            'user' => [
                'fullName' => $user->abreviatedFullName,
                'role' => [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ],
                "doctorId" => $user->doctor ? $user->doctor->id : null,
                "specialty" => $user->doctor ? [
                    'id' => $user->doctor->specialty->id,
                    'name' => $user->doctor->specialty->name,
                ] : null
            ]
        ]);
    }
}
