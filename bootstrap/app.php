<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Throwable;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(
            \App\Http\Middleware\AuthSignature::class
        );

        $middleware->encryptCookies(except: [
            'sess_sig',
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);

        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->reportable(function (Throwable $e) {
            $status = $e instanceof HttpExceptionInterface
                ? $e->getStatusCode()
                : 500;

            if ($status >= 500) {
                $errorId = Str::uuid()->toString();
                Log::error("[$errorId] Excepción interna: {$e->getMessage()}", [
                    'errorId' => $errorId,
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'code' => $e->getCode(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        });

        $exceptions->renderable(function (Throwable $e, Request $request) {
            if (!$request->expectsJson()) {
                return;
            }

            $status = $e instanceof HttpExceptionInterface
                ? $e->getStatusCode()
                : 500;

            if ($status >= 500) {
                return response()->json([
                    'message' => 'Ocurrió un error interno al procesar la solicitud.'
                ], 500);
            }
        });
    })->create();
