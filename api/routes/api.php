<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user()->load(['roles.permissions']);
});

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::group(['prefix' => 'checks', 'middleware' => 'auth:sanctum'], function () {
    Route::get('/', [CheckController::class, 'index']);
    Route::post('/', [CheckController::class, 'store']);
    Route::get('/{check}', [CheckController::class, 'show']);
    Route::get('/{check}/image', [CheckController::class, 'getImage']);
    Route::post('/{check}/approve', [CheckController::class, 'approve']);
    Route::post('/{check}/reject', [CheckController::class, 'reject']);
});

Route::group(['prefix' => 'purchases', 'middleware' => 'auth:sanctum'], function () {
    Route::get('/', [PurchaseController::class, 'index']);
    Route::post('/', [PurchaseController::class, 'store']);
});

Route::group(['prefix' => 'transactions', 'middleware' => 'auth:sanctum'], function () {
    Route::get('/', [TransactionController::class, 'index']);
    Route::get('/summary', [TransactionController::class, 'summary']);
});
