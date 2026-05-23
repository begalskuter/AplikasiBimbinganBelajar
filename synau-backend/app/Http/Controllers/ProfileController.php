<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    /**
     * Ambil instance User (Eloquent) dari user yang sedang login.
     * Auth::user() kadang mengembalikan Authenticatable biasa,
     * User::find() memastikan kita dapat Eloquent model penuh.
     */
    private function getUser(): User
    {
        return User::findOrFail(Auth::id());
    }

    /**
     * GET /api/profile
     */
    public function show()
    {
        return response()->json([
            'user' => $this->getUser(),
        ]);
    }

    /**
     * PUT /api/profile
     * Update info pribadi.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'nama_panggilan' => 'nullable|string|max:255',
            'no_hp'          => 'nullable|string|max:20',
            'tanggal_lahir'  => 'nullable|date',
            'alamat_lengkap' => 'nullable|string',
            'kelurahan'      => 'nullable|string|max:255',
            'kecamatan'      => 'nullable|string|max:255',
            'kota'           => 'nullable|string|max:255',
            'provinsi'       => 'nullable|string|max:255',
        ]);

        $user = $this->getUser();
        $user->fill($validated);
        $user->save();

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'user'    => $user,
        ]);
    }

    /**
     * PUT /api/profile/password
     * Ganti password.
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'password_lama' => 'required|string',
            'password_baru' => 'required|string|min:8',
        ]);

        $user = $this->getUser();

        if (!Hash::check($request->password_lama, $user->password)) {
            throw ValidationException::withMessages([
                'password_lama' => ['Password lama tidak sesuai.'],
            ]);
        }

        $user->password = Hash::make($request->password_baru);
        $user->save();

        return response()->json([
            'message' => 'Password berhasil diperbarui.',
        ]);
    }

    /**
     * POST /api/profile/foto
     * Upload foto profil.
     * Pastikan sudah jalankan: php artisan storage:link
     */
    public function uploadFoto(Request $request)
    {
        $request->validate([
            'foto' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user = $this->getUser();

        // Hapus foto lama jika ada
        if ($user->foto_url) {
            $oldPath = str_replace('/storage/', 'public/', parse_url($user->foto_url, PHP_URL_PATH));
            Storage::delete($oldPath);
        }

        // Simpan foto baru
        $path = $request->file('foto')->store('public/foto-profil');
        $url  = Storage::url($path);

        $user->foto_url = $url;
        $user->save();

        return response()->json([
            'message'  => 'Foto berhasil diunggah.',
            'foto_url' => $url,
        ]);
    }
}
