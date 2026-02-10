<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ImageController extends Controller
{
    /**
     * Upload an image for use in the portfolio
     */
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif,webp',
                'max:2048', // 2MB max
            ],
            'type' => [
                'required',
                Rule::in(['hero', 'profile', 'project', 'experience']),
            ],
        ]);

        \Log::info('Image upload request:', [
            'type' => $request->input('type'),
            'has_file' => $request->hasFile('image'),
            'file_name' => $request->file('image')?->getClientOriginalName(),
            'mime' => $request->file('image')?->getClientMimeType(),
        ]);

        if ($validator->fails()) {
            \Log::warning('Image upload validation failed:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $image = $request->file('image');
            $type = $request->input('type');

            // Generate unique filename
            $filename = $type . '_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

            // Store image in public disk (storage/app/public/images)
            $path = $image->storeAs('images', $filename, 'public');

            // Generate URL
            $url = Storage::url($path);

            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'data' => [
                    'filename' => $filename,
                    'url' => $url,
                    'path' => $path,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an uploaded image
     */
    public function delete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filename' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid request',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $filename = $request->input('filename');
            $path = 'images/' . $filename;

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
                return response()->json([
                    'success' => true,
                    'message' => 'Image deleted successfully',
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Image not found',
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
