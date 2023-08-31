<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Enums\UserRoleEnum;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(User::all(['id', 'name', 'surname', 'email', 'role']), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
      $request->validate([
        'email' => 'required|string|email|max:255|unique:users|regex:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/',
        'password' => 'required|string|min:8|max:255',
        'name' => 'required|string|max:50',
        'surname' => 'required|string|max:50',
        'role' => 'required|string|in:'.implode(',', array_column(UserRoleEnum::cases(), 'value')),
      ]);

      $user = User::create($request->all());

      return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $request->input('email') === $user->email ?: $request->validate([
          'email' => 'required|string|email|max:255|unique:users|regex:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/',
        ]);

        $request->validate([
          'name' => 'required|string|max:50',
          'surname' => 'required|string|max:50',
          'role' => 'required|string|in:'.implode(',', array_column(UserRoleEnum::cases(), 'value')),
        ]);

        $user->update($request->all());

        return response()->json($user, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): JsonResponse
    {
        $user = User::findOrFail($user->id);

        $user->delete();

        return response()->json(null, 204);
    }
}
