<?php

use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContactMessageController;
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
*/

// Auth Routes
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Public Data Routes (Read Only)
Route::get('skills', [SkillController::class, 'index']);
Route::get('projects', [ProjectController::class, 'index']);
Route::get('projects/{id}', [ProjectController::class, 'show']);
Route::get('experiences', [ExperienceController::class, 'index']);
Route::get('hero', [HeroController::class, 'index']);
Route::get('about', [AboutController::class, 'index']);
Route::get('contact', [ContactController::class, 'index']);
Route::get('site-config', [SiteConfigController::class, 'index']);

// Contact Form Submission (Public)
Route::post('contact-message', [ContactMessageController::class, 'store']);

// Protected Admin Routes (Write Operations)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Skills
    Route::post('skills', [SkillController::class, 'store']);
    Route::put('skills/{id}', [SkillController::class, 'update']);
    Route::delete('skills/{id}', [SkillController::class, 'destroy']);

    // Projects
    Route::post('projects', [ProjectController::class, 'store']);
    Route::put('projects/{id}', [ProjectController::class, 'update']);
    Route::delete('projects/{id}', [ProjectController::class, 'destroy']);

    // Experiences
    Route::post('experiences', [ExperienceController::class, 'store']);
    Route::put('experiences/{id}', [ExperienceController::class, 'update']);
    Route::delete('experiences/{id}', [ExperienceController::class, 'destroy']);

    // Singletons
    Route::put('hero', [HeroController::class, 'update']);
    Route::put('about', [AboutController::class, 'update']);
    Route::put('contact', [ContactController::class, 'update']);
    Route::put('site-config', [SiteConfigController::class, 'update']);

    // Images
    Route::post('upload-image', [ImageController::class, 'upload']);
    Route::delete('delete-image', [ImageController::class, 'delete']);

    // Contact Messages (Admin)
    Route::get('contact-messages', [ContactMessageController::class, 'index']);
    Route::patch('contact-messages/{id}/read', [ContactMessageController::class, 'markAsRead']);
    Route::delete('contact-messages/{id}', [ContactMessageController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
