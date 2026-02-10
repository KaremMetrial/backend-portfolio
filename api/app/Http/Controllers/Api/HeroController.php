<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HeroResource;
use App\Models\Hero;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hero = Hero::first();
        if (!$hero) {
            return response()->json(['message' => 'Hero section not found'], 404);
        }
        return new HeroResource($hero);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // Since it's a singleton, we might ignore $id or ensure it matches the first record
        $hero = Hero::firstOrFail(); // Simplified for singleton pattern

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'title' => 'sometimes|string',
            'subtitle' => 'sometimes|string',
            'description' => 'sometimes|string',
            'hero_image' => 'nullable|string',
            'background_images' => 'nullable|array',
            'stats' => 'sometimes|array',
            'cta_buttons' => 'sometimes|array',
        ]);

        $hero->update($validated);
        return new HeroResource($hero);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
