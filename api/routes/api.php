<?php

use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SiteConfigController;
use App\Http\Controllers\Api\SkillController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public API routes for portfolio data
Route::apiResource('skills', SkillController::class);
Route::apiResource('projects', ProjectController::class);
Route::apiResource('experiences', ExperienceController::class);

// Public API routes for dynamic content
Route::get('hero', [HeroController::class, 'index']);
Route::get('about', [AboutController::class, 'index']);
Route::get('contact', [ContactController::class, 'index']);
Route::get('site-config', [SiteConfigController::class, 'index']);

// Image upload routes
Route::post('upload-image', [ImageController::class, 'upload']);
Route::delete('delete-image', [ImageController::class, 'delete']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
