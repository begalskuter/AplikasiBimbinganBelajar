<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guru;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminOverviewController extends Controller
{
    public function index(Request $request)
    {
        // Total Guru (terverifikasi)
        $totalGuru = Guru::where('terverifikasi', true)->count();

        // Total Siswa
        $totalSiswa = User::where('role', 'siswa')->count();

        // Kelas Aktif = booking confirmed dan masih dalam periode bimbingan (belum lewat durasi)
        $kelasAktif = Booking::where('status', 'confirmed')
            ->where('tanggal_mulai', '<=', Carbon::now())
            ->where(function ($q) {
                $q->where(function ($sub) {
                    $sub->where('paket', 'mingguan')
                        ->where('tanggal_mulai', '>=', Carbon::now()->subDays(7));
                })->orWhere(function ($sub) {
                    $sub->where('paket', 'bulanan')
                        ->where('tanggal_mulai', '>=', Carbon::now()->subDays(30));
                });
            })->count();

        // Bayar Pending = booking yang status_pembayaran = 'unpaid' dan status booking = 'pending' (belum dikonfirmasi)
        $pendingBayar = Booking::where('status_pembayaran', 'unpaid')
            ->where('status', 'pending')
            ->count();

        // Pendapatan Bersih Sistem (biaya admin 10% dari total_harga yang paid)
        $totalPendapatanKotor = Booking::where('status_pembayaran', 'paid')->sum('total_harga');
        $biayaAdminPersen = 0.10; // 10%
        $pendapatanBersih = $totalPendapatanKotor * $biayaAdminPersen;

        // Menunggu Verifikasi Guru (user guru yang is_verified = false)
        $menungguVerifikasi = User::where('role', 'guru')
            ->where('is_verified', false)
            ->count();

        // Data tren untuk chart (6 bulan terakhir jumlah siswa baru)
        $siswaPerBulan = collect();
        for ($i = 5; $i >= 0; $i--) {
            $bulan = Carbon::now()->subMonths($i);
            $start = $bulan->copy()->startOfMonth();
            $end = $bulan->copy()->endOfMonth();

            $jumlah = User::where('role', 'siswa')
                ->whereBetween('created_at', [$start, $end])
                ->count();

            $siswaPerBulan->push([
                'month' => $bulan->translatedFormat('M'),
                'siswa' => $jumlah,
            ]);
        }

        // Aktivitas terbaru (contoh dari berbagai event)
        // Bisa diambil dari log atau tabel activities, untuk sementara hardcoded contoh
        $recentActivities = $this->getRecentActivities();

        return response()->json([
            'totalGuru'          => $totalGuru,
            'totalSiswa'         => $totalSiswa,
            'kelasAktif'         => $kelasAktif,
            'pendingBayar'       => $pendingBayar,
            'pendapatanBersih'   => $pendapatanBersih,
            'menungguVerifikasi' => $menungguVerifikasi,
            'siswaPerBulan'      => $siswaPerBulan,
            'recentActivities'   => $recentActivities,
        ]);
    }

    private function getRecentActivities()
    {
        // Contoh aktivitas dinamis (bisa dari tabel activities nanti)
        // Untuk sementara contoh statis
        return [
            ['icon' => 'ti-user-check', 'text' => 'Dewi Puspitasari telah diverifikasi sebagai guru', 'time' => '5 menit lalu', 'color' => '#16a34a'],
            ['icon' => 'ti-credit-card', 'text' => 'Pembayaran Rp 500.000 dari Budi Santoso (Konfirmasi)', 'time' => '12 menit lalu', 'color' => '#185FA5'],
            ['icon' => 'ti-user-plus', 'text' => 'Ahmad Ridwan mendaftar sebagai guru baru', 'time' => '25 menit lalu', 'color' => '#d97706'],
            ['icon' => 'ti-calendar-check', 'text' => 'Jadwal baru disetujui untuk Siti Nurhaliza', 'time' => '1 jam lalu', 'color' => '#7c3aed'],
            ['icon' => 'ti-coin', 'text' => 'Gaji guru bulan Mei telah dihitung (32 guru)', 'time' => '2 jam lalu', 'color' => '#ea580c'],
            ['icon' => 'ti-school', 'text' => 'Rina Putri mendaftar sebagai siswa baru', 'time' => '3 jam lalu', 'color' => '#0891b2'],
        ];
    }
}
