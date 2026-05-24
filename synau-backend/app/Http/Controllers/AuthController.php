<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:users',
            'password'       => 'required|min:8',
            'nama_panggilan' => 'nullable|string',
            'tanggal_lahir'  => 'nullable|date',
            'no_hp'          => 'nullable|string',
            'alamat_lengkap' => 'nullable|string',
            'kelurahan'      => 'nullable|string',
            'kecamatan'      => 'nullable|string',
            'kota'           => 'nullable|string',
            'provinsi'       => 'nullable|string',
        ]);

        $user = User::create([
            'name'           => $request->name,
            'email'          => $request->email,
            'password'       => Hash::make($request->password),
            'nama_panggilan' => $request->nama_panggilan,
            'tanggal_lahir'  => $request->tanggal_lahir,
            'no_hp'          => $request->no_hp,
            'alamat_lengkap' => $request->alamat_lengkap,
            'kelurahan'      => $request->kelurahan,
            'kecamatan'      => $request->kecamatan,
            'kota'           => $request->kota,
            'provinsi'       => $request->provinsi,
            'role'           => 'siswa',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Register berhasil',
            'token'   => $token,
            'user'    => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 401);
        }

        // ← Tambahkan ini
        if (in_array($user->role, ['guru']) && !$user->is_verified) {
            return response()->json([
                'message' => 'Akun kamu belum diverifikasi admin. Silakan tunggu 1-3 hari kerja.',
                'status'  => 'pending',
            ], 403);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Akun kamu telah dinonaktifkan. Hubungi admin untuk informasi lebih lanjut.',
                'status'  => 'inactive',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout berhasil']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
