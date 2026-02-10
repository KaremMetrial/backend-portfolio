<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AboutResource;
use App\Models\About;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $about = About::first();
        if (!$about) {
            $about = About::create([
                'title' => 'About Me',
                'description' => 'I\'m a Backend Engineer with a passion for creating robust, scalable systems.',
                'image' => 'https://picsum.photos/seed/profile/400/400',
                'stats' => json_encode([
                    ['label' => 'Location', 'value' => 'San Francisco, CA'],
                    ['label' => 'Email', 'value' => 'alex.rivera@example.com'],
                    ['label' => 'Phone', 'value' => '+1 (555) 123-4567'],
                    ['label' => 'Experience', 'value' => '5+ Years']
                ]),
            ]);
        }
        return new AboutResource($about);
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
        $about = About::firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'image' => 'sometimes|string',
            'stats' => 'sometimes|array',
        ]);

        $about->update($validated);
        return new AboutResource($about);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
