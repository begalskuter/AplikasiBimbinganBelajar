<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Guru;
use Illuminate\Http\Request;

class VerifikasiGuruController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'guru');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%")
                  ->orWhere('kota', 'like', "%$search%");
            });
        }

        if ($request->status && $request->status !== 'all') {
            if ($request->status === 'pending') {
                $query->where('is_verified', false);
            } elseif ($request->status === 'approved') {
                $query->where('is_verified', true);
            } elseif ($request->status === 'rejected') {
                $query->where('is_verified', false)->whereNotNull('rejected_at');
            }
        }

        $gurus = $query->orderBy('created_at', 'desc')->get()->map(function ($u) {
            // Tentukan status
            $status = 'pending';
            if ($u->is_verified) $status = 'approved';
            elseif ($u->rejected_at) $status = 'rejected';

            return [
                'id'            => $u->id,
                'name'          => $u->name,
                'email'         => $u->email,
                'noHp'          => $u->no_hp ?? '-',
                'namaPanggilan' => $u->nama_panggilan ?? '',
                'kota'          => $u->kota ?? '-',
                'provinsi'      => $u->provinsi ?? '-',
                'alamat'        => $u->alamat_lengkap ?? '-',
                'tanggalDaftar' => $u->created_at?->format('Y-m-d'),
                'cv_url'        => $u->cv_url,
                'ktp_url'       => $u->ktp_url,
                'ijazah_url'    => $u->ijazah_url,
                'status'        => $status,
                'alasanTolak'   => $u->reject_reason ?? null,
            ];
        });

        $summary = [
            'pending'  => $gurus->where('status', 'pending')->count(),
            'approved' => $gurus->where('status', 'approved')->count(),
            'rejected' => $gurus->where('status', 'rejected')->count(),
        ];

        return response()->json(['data' => $gurus, 'summary' => $summary]);
    }

    public function approve($id)
    {
        $user = User::where('id', $id)->where('role', 'guru')->firstOrFail();
        $user->is_verified = true;
        $user->rejected_at = null;
        $user->reject_reason = null;
        $user->save();

        // Buat profil guru di tabel gurus kalau belum ada
        Guru::firstOrCreate(['user_id' => $user->id], [
            'user_id'       => $user->id,
            'bio'           => '',
            'mata_pelajaran'=> json_encode([]),
            'jadwal'        => json_encode([]),
            'slot_jam'      => json_encode([]),
            'harga_mingguan'=> 0,
            'harga_bulanan' => 0,
            'menit_per_sesi'=> 90,
            'rating'        => 0,
            'total_siswa'   => 0,
            'terverifikasi' => true,
            'cv_path'       => $user->cv_url ?? '',
            'ktp_path'      => $user->ktp_url ?? '',
            'ijazah_path'   => $user->ijazah_url ?? '',
        ]);

        return response()->json(['message' => 'Guru berhasil diverifikasi.']);
    }

    public function reject(Request $request, $id)
    {
        $user = User::where('id', $id)->where('role', 'guru')->firstOrFail();
        $user->is_verified = false;
        $user->rejected_at = now();
        $user->reject_reason = $request->alasan ?? null;
        $user->save();

        return response()->json(['message' => 'Pendaftaran guru ditolak.']);
    }
}
