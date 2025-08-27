<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('api')->group(function () {
    // Loan routes
    Route::apiResource('loans', LoanController::class);
    
    // Payment routes (nested under loans)
    Route::get('loans/{loan}/payments', [PaymentController::class, 'index']);
    Route::post('loans/{loan}/payments', [PaymentController::class, 'store']);
    Route::get('loans/{loan}/payments/{payment}', [PaymentController::class, 'show']);
    Route::put('loans/{loan}/payments/{payment}', [PaymentController::class, 'update']);
    Route::delete('loans/{loan}/payments/{payment}', [PaymentController::class, 'destroy']);
    
    // Health check
    Route::get('health', function () {
        return response()->json([
            'status' => 'OK',
            'timestamp' => now(),
            'version' => '1.0.0'
        ]);
    });
});
