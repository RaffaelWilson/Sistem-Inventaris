<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Menampilkan halaman utama (SPA)
     */
    public function showLoginForm()
    {
        // Menggunakan Inertia untuk render komponen React
        return Inertia::render('Login', [
            'title' => 'Login',
            'description' => 'Masuk ke akun Anda untuk melanjutkan.',
        ]);
    }

    /**
     * Memproses login user dengan plaintext password
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if ($user && $request->password === $user->password) {
            Auth::login($user);
            $request->session()->regenerate();

            // Redirect to /dashboard after successful login
            if ($user->role === 'admin') {
                return Inertia::location('/admin/dashboard');
            } else {
                return Inertia::location('/user/products');
            }
        }

        return response()->json([
            'status' => 'error',
            'errors' => ['email' => ['Kredensial yang diberikan tidak cocok dengan data kami.']]
        ], 401);
    }

    /**
     * Memproses registrasi user baru
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            if ($request->wantsJson()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            return back()->withErrors($validator);
        }

        // Simpan password sebagai plaintext
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // Simpan sebagai plaintext
            'role' => 'user', // Role default
            'isSpeaker' => false, // Default bukan speaker
        ]);

        // Login otomatis setelah registrasi
        Auth::login($user);

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'redirect' => '/dashboard'
            ]);
        }

        return redirect('/dashboard');
    }

    /**
     * Proses logout user
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success']);
        }

        return redirect('/');
    }

    /**
     * Check status otentikasi pengguna
     */
    public function check()
    {
        if (Auth::check()) {
            $user = Auth::user();
            return response()->json([
                'authenticated' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'isSpeaker' => $user->isSpeaker,
                ]
            ]);
        }

        return response()->json(['authenticated' => false]);
    }
}
