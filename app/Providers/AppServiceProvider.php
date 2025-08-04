<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Pagination\CustomPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Pagination\LengthAwarePaginator as LengthAwarePaginatorContract;

use App\Models\Sanctum\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Cache;
use App\Models\Appointment;
use Illuminate\Session\Store;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->alias(CustomPaginator::class, LengthAwarePaginator::class); // Eloquent uses the class instead of the contract 🤔
        $this->app->alias(CustomPaginator::class, LengthAwarePaginatorContract::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        Store::macro('addSignatureCookie', function () {
            if ($user = auth()->user()) {
                Cookie::queue(
                    'sess_sig',
                    $user->role->id,
                    120,
                    '/',
                    config('session.domain'),
                    config('session.secure'),
                    false,
                    false,
                    config('session.same_site')
                );
            }
            return $this;
        });

        Store::macro('forgetSignatureCookie', function () {
            Cookie::queue(Cookie::forget('sess_sig'));
            return $this;
        });

        $cacheKey = 'appointments_canceled_' . now()->toDateString();

        if (!Cache::has($cacheKey)) {
            Appointment::where('date', '<', now()->toDateString())
                ->where('status', 'Pendiente')
                ->update(['status' => 'Cancelada']);

            Cache::put($cacheKey, true, now()->addDay());
        }

    }
}
