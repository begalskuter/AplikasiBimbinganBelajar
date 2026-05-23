<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guru;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'guru_id'       => 'required|exists:gurus,id',
            'paket'         => 'required|in:mingguan,bulanan',
            'hari_dipilih'  => 'required|array|min:1',
            'waktu_mulai'   => 'required|array',
            'tanggal_mulai' => 'required|date',
            'catatan'       => 'nullable|string',
        ]);

        $guru = Guru::findOrFail($request->guru_id);
        $harga = $request->paket === 'mingguan'
            ? $guru->harga_mingguan
            : $guru->harga_bulanan;

        $booking = Booking::create([
            'siswa_id'      => $request->user()->id,
            'guru_id'       => $request->guru_id,
            'paket'         => $request->paket,
            'hari_dipilih'  => $request->hari_dipilih,
            'waktu_mulai'   => $request->waktu_mulai,
            'tanggal_mulai' => $request->tanggal_mulai,
            'catatan'       => $request->catatan,
            'status'        => 'pending',
            'total_harga'   => $harga,
        ]);

        return response()->json([
            'message' => 'Booking berhasil',
            'booking' => $booking,
        ], 201);
    }

    public function index(Request $request)
    {
        $bookings = Booking::with('guru.user')
            ->where('siswa_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }
}
