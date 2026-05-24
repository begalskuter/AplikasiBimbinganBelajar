<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GuruDashboardController extends Controller
{
    private function decodeJson($value, $default = [])
    {
        if (is_array($value)) return $value;
        $decoded = json_decode($value, true);
        if (is_string($decoded)) $decoded = json_decode($decoded, true);
        return $decoded ?? $default;
    }

    // GET /api/guru/me
    public function me()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $guru = Guru::where('user_id', $user->id)->first();

        if (!$guru) {
            return response()->json(['message' => 'Profil guru tidak ditemukan.'], 404);
        }

        return response()->json([
            'id'                => $guru->id,
            'nama'              => $user->name,
            'nama_panggilan'    => $user->nama_panggilan,
            'email'             => $user->email,
            'no_hp'             => $user->no_hp,
            'kota'              => $user->kota,
            'foto_profil'       => $user->foto_url,
            'terverifikasi'     => (bool) $guru->terverifikasi,
            'total_siswa'       => $guru->total_siswa ?? 0,
            'rating'            => $guru->rating ?? 0,
            'bio'               => $guru->bio,
            'mata_pelajaran'    => $this->decodeJson($guru->getRawOriginal('mata_pelajaran')),
            'jadwal'            => $this->decodeJson($guru->getRawOriginal('jadwal')),
            'slot_jam_per_hari' => $this->decodeJson($guru->getRawOriginal('slot_jam'), []),
            'harga'             => [
                'mingguan'    => $guru->harga_mingguan,
                'bulanan'     => $guru->harga_bulanan,
                'menitPerSesi'=> $guru->menit_per_sesi,
            ],
        ]);
    }

    // GET /api/guru/bookings
    public function bookings()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $guru = Guru::where('user_id', $user->id)->first();

        if (!$guru) {
            return response()->json([]);
        }

        $bookings = Booking::with('siswa')
        ->where('guru_id', $guru->id)
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($b) {
            return [
                'id'            => $b->id,
                'siswa'         => [
                    'name'  => $b->siswa->name ?? '-',
                    'no_hp' => $b->siswa->no_hp ?? '-',
                ],
                'matpel'        => $b->mata_pelajaran,
                'paket'         => $b->paket,
                'hari_dipilih'  => is_array($b->hari_dipilih)
                    ? $b->hari_dipilih
                    : json_decode($b->hari_dipilih ?? '[]', true),
                'waktu_mulai'   => is_array($b->waktu_mulai)
                    ? $b->waktu_mulai
                    : json_decode($b->waktu_mulai ?? '{}', true),
                'tanggal_mulai' => $b->tanggal_mulai,
                'status'        => $b->status,
                'total_harga'   => $b->total_harga,
                'catatan'       => $b->catatan,
            ];
        });

        return response()->json($bookings);
    }

    // PUT /api/guru/jadwal
    public function updateJadwal(Request $request)
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
            'jadwal'            => 'nullable|array',
            'jadwal.*'          => 'string',
            'slot_jam_per_hari' => 'nullable|array',
        ]);

        $guru->jadwal   = $request->jadwal ?? [];
        $guru->slot_jam = $request->slot_jam_per_hari ?? [];
        $guru->save();

        return response()->json(['message' => 'Jadwal berhasil diperbarui']);
    }

    // PUT /api/guru/bookings/{id}/status
    public function updateBookingStatus(Request $request, $id)
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
            'status' => 'required|in:confirmed,cancelled',
        ]);

        $booking = Booking::where('id', $id)
            ->where('guru_id', $guru->id)
            ->firstOrFail();

        $booking->status = $request->status;
        $booking->save();

        return response()->json(['message' => 'Status booking diperbarui']);
    }
}
