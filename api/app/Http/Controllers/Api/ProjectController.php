<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::orderBy('created_at', 'desc')->get();
        return ProjectResource::collection($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'long_description' => 'nullable|string',
            'tech_stack' => 'required|array',
            'features' => 'nullable|array',
            'architecture' => 'nullable|string',
            'github_url' => 'nullable|string|url',
            'live_url' => 'nullable|string|url',
            'image' => 'required|string',
            'is_featured' => 'nullable|boolean',
        ]);

        // Allow null values for URLs
        if (empty($validated['github_url'])) {
            $validated['github_url'] = null;
        }
        if (empty($validated['live_url'])) {
            $validated['live_url'] = null;
        }

        $project = Project::create($validated);
        return new ProjectResource($project);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::findOrFail($id);
        return new ProjectResource($project);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'long_description' => 'sometimes|string',
            'tech_stack' => 'sometimes|array',
            'features' => 'sometimes|array',
            'architecture' => 'sometimes|string',
            'github_url' => 'nullable|string|url',
            'live_url' => 'nullable|string|url',
            'image' => 'sometimes|string',
            'is_featured' => 'sometimes|boolean',
        ]);

        // Allow null values for URLs
        if (isset($validated['github_url']) && empty($validated['github_url'])) {
            $validated['github_url'] = null;
        }
        if (isset($validated['live_url']) && empty($validated['live_url'])) {
            $validated['live_url'] = null;
        }

        $project->update($validated);
        return new ProjectResource($project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(null, 204);
    }


}
