<?php

use App\Http\Controllers\Api\AnomalyController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SaleController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Anomaly Injection Routes
Route::get('/anomaly/status', [AnomalyController::class, 'getStatus']);
Route::post('/anomaly/toggle', [AnomalyController::class, 'toggle']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    Route::apiResource('products', ProductController::class);
    
    Route::get('/sales', [SaleController::class, 'index']);
    Route::post('/sales', [SaleController::class, 'store']);
    Route::get('/sales/{id}', [SaleController::class, 'show']);

    Route::get('/anomaly', function() {
        \App\Services\AnomalyService::simulateSlowRequest(3);
        return response()->json(['message' => 'Anomaly injected successfully']);
    });
});
