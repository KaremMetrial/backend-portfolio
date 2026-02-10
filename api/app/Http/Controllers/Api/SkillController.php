<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $skills = Skill::orderBy('category')->orderBy('name')->get();
        return SkillResource::collection($skills);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'level' => 'nullable|integer',
            'icon' => 'nullable|string',
        ]);

        $skill = Skill::create($validated);
        return new SkillResource($skill);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $skill = Skill::findOrFail($id);
        return new SkillResource($skill);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $skill = Skill::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'category' => 'sometimes|string',
            'level' => 'nullable|integer',
            'icon' => 'nullable|string',
        ]);

        $skill->update($validated);
        return new SkillResource($skill);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $skill = Skill::findOrFail($id);
        $skill->delete();
        return response()->json(null, 204);
    }
}
