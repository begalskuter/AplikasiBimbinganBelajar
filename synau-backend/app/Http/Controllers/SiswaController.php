<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'siswa');

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

        $siswaList = $query->orderBy('created_at', 'desc')->get()->map(function ($s) {
            $totalBooking = $s->bookings()->count();
            $totalBayar   = $s->bookings()->where('status_pembayaran', 'paid')->sum('total_harga');
            $guruFavorit  = DB::table("favorit")->where("user_id", $s->id)->count();

            return [
                'id'            => $s->id,
                'name'          => $s->name,
                'email'         => $s->email,
                'kota'          => $s->kota ?? '-',
                'tanggalDaftar' => $s->created_at?->format('Y-m-d'),
                'totalBooking'  => $totalBooking,
                'totalBayar'    => $totalBayar,
                'guruFavorit'   => $guruFavorit,
                'status'        => $s->is_active ? 'aktif' : 'nonaktif',
            ];
        });

        $summary = [
            'total'       => $siswaList->count(),
            'aktif'       => $siswaList->where('status', 'aktif')->count(),
            'totalBooking'=> $siswaList->sum('totalBooking'),
            'totalBayar'  => $siswaList->sum('totalBayar'),
        ];

        return response()->json(['data' => $siswaList, 'summary' => $summary]);
    }

    public function toggleStatus($id)
    {
        $siswa = User::where('id', $id)->where('role', 'siswa')->firstOrFail();
        $siswa->is_active = !$siswa->is_active;
        $siswa->save();

        return response()->json([
            'message'   => 'Status siswa berhasil diubah',
            'is_active' => $siswa->is_active,
            'status'    => $siswa->is_active ? 'aktif' : 'nonaktif',
        ]);
    }
}
