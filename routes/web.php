<?php

use Illuminate\Support\Facades\Route;

Route::get('/login', function () {
    return redirect('/');
})->name('login');

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
