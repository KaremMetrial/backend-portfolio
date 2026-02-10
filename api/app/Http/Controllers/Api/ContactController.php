<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contact = Contact::first();
        if (!$contact) {
            return response()->json(['message' => 'Contact info not found'], 404);
        }
        return new ContactResource($contact);
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
        $contact = Contact::firstOrFail();

        $validated = $request->validate([
            'email' => 'sometimes|email',
            'phone' => 'sometimes|string',
            'location' => 'sometimes|string',
            'social_links' => 'sometimes|array',
            'availability' => 'sometimes|string',
        ]);

        $contact->update($validated);
        return new ContactResource($contact);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
