<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;

class KelasJadwalController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::with(['siswa', 'guru.user'])
            ->where('status', 'confirmed') // hanya confirmed
            ->get();

        $now = Carbon::now();

        $data = $bookings->map(function ($b) use ($now) {
            // Hitung tanggal selesai berdasarkan paket
            $tanggalMulai = Carbon::parse($b->tanggal_mulai);
            $durasiHari = $b->paket === 'mingguan' ? 7 : 30; // bulanan = 30 hari
            $tanggalSelesai = $tanggalMulai->copy()->addDays($durasiHari);

            // Tentukan status aktif/selesai
            $isAktif = $now->lessThanOrEqualTo($tanggalSelesai);
            $status = $isAktif ? 'aktif' : 'selesai';

            // Hari & waktu
            $hari = is_array($b->hari_dipilih) ? $b->hari_dipilih : json_decode($b->hari_dipilih ?? '[]', true);
            $waktuMulai = is_array($b->waktu_mulai) ? ($b->waktu_mulai[0] ?? null) : $b->waktu_mulai;

            return [
                'id'             => $b->id,
                'guru'           => $b->guru->user->name ?? 'Guru tidak ditemukan',
                'siswa'          => $b->siswa->name ?? 'Siswa tidak ditemukan',
                'mataPelajaran'  => $b->mata_pelajaran ?? '-',
                'hari'           => $hari,
                'waktu'          => $waktuMulai ? date('H:i', strtotime($waktuMulai)) : '-',
                'paket'          => ucfirst($b->paket ?? ''),
                'status'         => $status,
            ];
        });

        return response()->json($data);
    }
}
