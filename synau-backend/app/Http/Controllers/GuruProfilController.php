<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class GuruProfilController extends Controller
{
    // GET /guru/profil
    public function show()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($user->role !== 'guru') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $guru = Guru::where('user_id', $user->id)->first();
        if (!$guru) {
            $guru = Guru::create([
                'user_id'       => $user->id,
                'bio'           => '',
                'mata_pelajaran'=> [],
                'jadwal'        => [],
                'slot_jam'      => [],
                'harga_mingguan'=> 0,
                'harga_bulanan' => 0,
                'menit_per_sesi'=> 90,
                'rating'        => 0,
                'total_siswa'   => 0,
                'terverifikasi' => false,
            ]);
        }

        return response()->json([
            'id'             => $guru->id,
            'bio'            => $guru->bio,
            'mata_pelajaran' => $guru->mata_pelajaran ?? [],
            'harga'          => [
                'mingguan'    => $guru->harga_mingguan,
                'bulanan'     => $guru->harga_bulanan,
                'menitPerSesi'=> $guru->menit_per_sesi,
            ],
            'nama'           => $user->name,
            'email'          => $user->email,
            'kota'           => $user->kota,
            'terverifikasi'  => $guru->terverifikasi,
            'foto_profil'    => $user->foto_url ? asset($user->foto_url) : null,
        ]);
    }

    // PUT /guru/profil
    public function update(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $guru = Guru::firstOrCreate(
            ['user_id' => $user->id],
            [
                'bio'           => '',
                'mata_pelajaran'=> [],
                'jadwal'        => [],
                'slot_jam'      => [],
                'harga_mingguan'=> 0,
                'harga_bulanan' => 0,
                'menit_per_sesi'=> 90,
                'rating'        => 0,
                'total_siswa'   => 0,
                'terverifikasi' => false,
            ]
        );

        $request->validate([
            'bio'              => 'nullable|string',
            'mata_pelajaran'   => 'nullable|array',
            'mata_pelajaran.*' => 'string',
            'harga_mingguan'   => 'nullable|integer|min:0',
            'harga_bulanan'    => 'nullable|integer|min:0',
            'menit_per_sesi'   => 'nullable|integer|min:30|max:180',
        ]);

        $guru->bio = $request->bio ?? $guru->bio;
        if ($request->has('mata_pelajaran')) $guru->mata_pelajaran = $request->mata_pelajaran;
        if ($request->has('harga_mingguan')) $guru->harga_mingguan = $request->harga_mingguan;
        if ($request->has('harga_bulanan'))  $guru->harga_bulanan  = $request->harga_bulanan;
        if ($request->has('menit_per_sesi')) $guru->menit_per_sesi = $request->menit_per_sesi;
        $guru->save();

        return response()->json(['message' => 'Profil berhasil diperbarui']);
    }

    // POST /guru/profil/foto
    public function uploadFoto(Request $request)
    {
        $request->validate([
            'foto' => 'required|image|max:2048',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $path = $request->file('foto')->store('foto-profil', 'public');
        $url  = Storage::url($path);

        if ($user->foto_url) {
            $oldPath = str_replace('/storage/', '', $user->foto_url);
            Storage::disk('public')->delete($oldPath);
        }

        $user->foto_url = $url;
        $user->save();

        return response()->json(['foto_url' => $url, 'message' => 'Foto berhasil diunggah']);
    }
}
