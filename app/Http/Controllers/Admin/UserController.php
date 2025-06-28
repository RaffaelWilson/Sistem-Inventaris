<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
{
    $users = User::select('id','name','email','role')->get();

    if ($request->wantsJson()) {
        return response()->json($users);          // ←  JSON
    }

    return Inertia::render('Admin/UserManagement', [
        'initialUsers' => $users,                 // ←  nama prop diganti
    ]);
}

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:100',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:6',
        'role' => 'required|in:admin,user',
    ]);

    User::create([
        ...$validated,
        'password' => $validated['password']
    ]);

    return response()->json(['message' => 'User created']); // ←  JSON
}

public function update(Request $request, User $user)
{
    $validated = $request->validate([
        'name' => 'required|string|max:100',
        'email' => 'required|email|unique:users,email,'.$user->id,
        'role'  => 'required|in:admin,user',
        'password' => 'nullable|min:6',
    ]);

    $user->update([
        ...$validated,
        'password' => $validated['password']
            ? Hash::make($validated['password'])
            : $user->password,
    ]);

    return response()->json(['message' => 'User updated']);
}

public function destroy(User $user)
{
    $user->delete();
    return response()->json(['message' => 'User deleted']);
}
}
