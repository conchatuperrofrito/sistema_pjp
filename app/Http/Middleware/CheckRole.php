<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!in_array($request->user()->role->id, $roles)) {
            return response()->json([
                'type' => 'error_role',
                'message' => 'No tienes permisos para acceder a esta ruta.'
            ], 403);
        }

        return $next($request);
    }
}
