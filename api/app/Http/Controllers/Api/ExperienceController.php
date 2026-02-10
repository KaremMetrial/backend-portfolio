<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExperienceResource;
use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $experiences = Experience::orderBy('created_at', 'desc')->get();
        return ExperienceResource::collection($experiences);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|string',
            'company' => 'required|string',
            'period' => 'required|string',
            'description' => 'required|array',
        ]);

        $experience = Experience::create($validated);
        return new ExperienceResource($experience);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $experience = Experience::findOrFail($id);
        return new ExperienceResource($experience);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $experience = Experience::findOrFail($id);

        $validated = $request->validate([
            'role' => 'sometimes|string',
            'company' => 'sometimes|string',
            'period' => 'sometimes|string',
            'description' => 'sometimes|array',
        ]);

        $experience->update($validated);
        return new ExperienceResource($experience);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $experience = Experience::findOrFail($id);
        $experience->delete();
        return response()->json(null, 204);
    }
}
