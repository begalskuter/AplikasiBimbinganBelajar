<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class GuruAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('guru')->where('role', 'guru')->where('is_verified', true);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%")
                  ->orWhere('kota', 'like', "%$search%");
            });
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'aktif');
        }

        $gurus = $query->orderBy('created_at', 'desc')->get()->map(function ($u) {
            $guru = $u->guru;
            return [
                'id'              => $u->id,
                'name'            => $u->name,
                'email'           => $u->email,
                'kota'            => $u->kota ?? '-',
                'isVerified'      => (bool) $u->is_verified,
                'status'          => $u->is_active ? 'aktif' : 'nonaktif',
                'tanggalBergabung'=> $u->created_at?->format('Y-m-d'),
                'mataPelajaran'   => is_array($guru?->mata_pelajaran) ? $guru->mata_pelajaran : json_decode($guru?->mata_pelajaran ?? '[]', true),
                'rating'          => $guru ? (float) $guru->rating : 0,
                'totalSiswa'      => $guru?->total_siswa ?? 0,
            ];
        });

        $withRating = $gurus->where('rating', '>', 0);
        $avgRating = $withRating->count() > 0
            ? round($withRating->avg('rating'), 1)
            : 0;

        $summary = [
            'total'     => $gurus->count(),
            'aktif'     => $gurus->where('status', 'aktif')->count(),
            'nonaktif'  => $gurus->where('status', 'nonaktif')->count(),
            'avgRating' => $avgRating,
        ];

        return response()->json(['data' => $gurus, 'summary' => $summary]);
    }

    public function toggleStatus($id)
    {
        $user = User::where('id', $id)->where('role', 'guru')->firstOrFail();
        $user->is_active = !$user->is_active;
        $user->save();

        // Hapus semua token aktif kalau dinonaktifkan
        if (!$user->is_active) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message'  => 'Status guru berhasil diubah',
            'status'   => $user->is_active ? 'aktif' : 'nonaktif',
        ]);
    }
}
