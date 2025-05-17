<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ApiKey;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ApiKeyController extends Controller
{
    /**
     * Generate a new API key for the authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function generate(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $apiKey = ApiKey::generate($validated['name']);

            return response()->json([
                'success' => true,
                'message' => 'API key generated successfully',
                'data' => [
                    'name' => $apiKey->name,
                    'key' => $apiKey->key,
                ],
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate API key',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List all API keys for the authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $apiKeys = ApiKey::all(['id', 'name', 'created_at']);

            return response()->json([
                'success' => true,
                'data' => $apiKeys,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve API keys',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an API key.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $apiKey = ApiKey::findOrFail($id);
            $apiKey->delete();

            return response()->json([
                'success' => true,
                'message' => 'API key deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete API key',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
