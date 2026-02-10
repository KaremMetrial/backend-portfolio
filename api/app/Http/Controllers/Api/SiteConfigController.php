<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteConfigResource;
use App\Models\SiteConfig;
use Illuminate\Http\Request;

class SiteConfigController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $siteConfig = SiteConfig::first();
        if (!$siteConfig) {
            return response()->json(['message' => 'Site config not found'], 404);
        }
        return new SiteConfigResource($siteConfig);
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
        $siteConfig = SiteConfig::firstOrFail();

        $validated = $request->validate([
            'site_title' => 'sometimes|string',
            'meta_description' => 'nullable|string',
            'theme_colors' => 'sometimes|array',
            'footer_content' => 'sometimes|string',
            'navbar_items' => 'sometimes|array',
        ]);

        $siteConfig->update($validated);
        return new SiteConfigResource($siteConfig);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
