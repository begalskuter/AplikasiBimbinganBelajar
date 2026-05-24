<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class PembayaranController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['siswa', 'guru.user'])
            ->where('status_pembayaran', 'paid')
            ->orderBy('paid_at', 'desc');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('siswa', fn($u) => $u->where('name', 'like', "%$search%"))
                  ->orWhereHas('guru.user', fn($u) => $u->where('name', 'like', "%$search%"));
            });
        }

        $bookings = $query->get()->map(function ($b) {
            return [
                'id'             => $b->id,
                'siswa'          => $b->siswa->name,
                'guru'           => $b->guru->user->name,
                'paket'          => ucfirst($b->paket),
                'mata_pelajaran' => $b->mata_pelajaran,
                'nominal'        => $b->total_harga,
                'tanggal'        => $b->paid_at ? $b->paid_at->format('Y-m-d') : null,
            ];
        });

        $first = $bookings->first();

        $summary = [
            'total_pendaftar' => $bookings->count(),
            'total_pemasukan' => $bookings->sum('nominal'),
            'terakhir_daftar' => $first ? $first['tanggal'] : null,
        ];

        return response()->json([
            'data'    => $bookings,
            'summary' => $summary,
        ]);
    }
}
