<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guru;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        // Total pendapatan kotor (dari booking yang sudah paid)
        $totalPendapatan = Booking::where('status_pembayaran', 'paid')
            ->sum('total_harga');

        // Pendapatan sistem = 10% dari total kotor
        $pendapatanSistem = round($totalPendapatan * 0.10);

        // Pendaftaran guru (total guru yang terverifikasi)
        $totalGuru = User::where('role', 'guru')
            ->where('is_verified', true)
            ->count();

        // Siswa baru (total siswa)
        $totalSiswa = User::where('role', 'siswa')->count();

        // Tingkat churn: persentase siswa yang tidak booking dalam 30 hari terakhir
        $siswaAktif = User::where('role', 'siswa')
            ->whereHas('bookings', function ($q) {
                $q->where('created_at', '>=', Carbon::now()->subDays(30));
            })->count();

        $churnRate = $totalSiswa > 0
            ? round((1 - ($siswaAktif / $totalSiswa)) * 100, 1)
            : 0;

        // Grafik pendapatan per bulan (5 bulan terakhir, termasuk bulan ini)
        $months = collect();
        for ($i = 4; $i >= 0; $i--) {
            $months->push(Carbon::now()->subMonths($i));
        }

        $monthlyData = $months->map(function ($month) {
            $start = $month->copy()->startOfMonth();
            $end   = $month->copy()->endOfMonth();

            $pendapatan = Booking::where('status_pembayaran', 'paid')
                ->whereBetween('paid_at', [$start, $end])
                ->sum('total_harga') / 1000000; // dalam juta rupiah

            return [
                'month'      => $month->translatedFormat('M'),
                'pendapatan' => round($pendapatan, 1),
            ];
        });

        // Top 3 guru berdasarkan rating dan jumlah siswa
        $topGurus = Guru::with('user')
            ->where('terverifikasi', true)
            ->orderBy('rating', 'desc')
            ->orderBy('total_siswa', 'desc')
            ->take(3)
            ->get()
            ->map(function ($guru, $index) {
                return [
                    'rank'   => $index + 1,
                    'name'   => $guru->user->name ?? 'Guru',
                    'rating' => $guru->rating ?? 0,
                    'siswa'  => $guru->total_siswa ?? 0,
                    'mapel'  => is_array($guru->mata_pelajaran)
                        ? implode(', ', $guru->mata_pelajaran)
                        : json_decode($guru->mata_pelajaran ?? '[]', true)[0] ?? '-',
                ];
            });

        $summaryStats = [
            [
                'label'      => 'Pendapatan Sistem (10%)',  // ← bukan total kotor
                'value'      => 'Rp ' . number_format($pendapatanSistem, 0, ',', '.'),
                'growth'     => '+12%',
                'isPositive' => true,
            ],
            [
                'label'      => 'Pendaftaran Guru',
                'value'      => (string) $totalGuru,
                'growth'     => '+8%',
                'isPositive' => true,
            ],
            [
                'label'      => 'Siswa Baru',
                'value'      => (string) $totalSiswa,
                'growth'     => '+15%',
                'isPositive' => true,
            ],
            [
                'label'      => 'Tingkat Churn',
                'value'      => $churnRate . '%',
                'growth'     => '-0.5%',
                'isPositive' => true,
            ],
        ];

        return response()->json([
            'summaryStats' => $summaryStats,
            'monthlyData'  => $monthlyData,
            'topGurus'     => $topGurus,
        ]);
    }
}
