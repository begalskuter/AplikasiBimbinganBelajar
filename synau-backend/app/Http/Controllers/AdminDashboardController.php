<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guru;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        // Total guru (role = 'guru' dan is_verified = true) sesuai card 'Total Guru'
        $totalGuru = User::where('role', 'guru')
            ->where('is_verified', true)
            ->count();

        // Total siswa (role = 'siswa')
        $totalSiswa = User::where('role', 'siswa')->count();

        // Kelas aktif: booking dengan status 'confirmed' DAN belum melewati masa bimbingan
        // Hitung berdasarkan paket mingguan (7 hari) atau bulanan (30 hari)
        $now = Carbon::now();
        $kelasAktif = Booking::where('status', 'confirmed')
            ->get()
            ->filter(function ($booking) use ($now) {
                $tanggalMulai = Carbon::parse($booking->tanggal_mulai);
                $durasi = $booking->paket === 'mingguan' ? 7 : 30;
                $tanggalSelesai = $tanggalMulai->copy()->addDays($durasi);
                return $now->lessThanOrEqualTo($tanggalSelesai);
            })->count();

        // Pembayaran pending: booking dengan status_pembayaran = 'unpaid' atau 'pending' (sesuai enum)
        $pendingPembayaran = Booking::whereIn('status_pembayaran', ['unpaid', 'pending'])->count();

        // Total tunggakan: jumlah total_harga dari booking yang status_pembayaran belum 'paid'
        $totalTunggakan = Booking::whereIn('status_pembayaran', ['unpaid', 'pending'])
            ->sum('total_harga');

        // Menunggu verifikasi guru: user role guru dengan is_verified = false
        $menungguVerifikasi = User::where('role', 'guru')
            ->where('is_verified', false)
            ->count();

        // Aktivitas terbaru: ambil dari berbagai model (Booking, User) yang di-create_at terbaru
        // Karena tidak ada tabel activity log, kita gabungkan beberapa sumber dengan union.
        // Alternatif: ambil 5-6 data dari booking dan user terbaru.
        $recentGuruRegistrations = User::where('role', 'guru')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($user) {
                return [
                    'icon'  => 'ti-user-plus',
                    'text'  => "{$user->name} mendaftar sebagai guru baru",
                    'time'  => $user->created_at->diffForHumans(),
                    'color' => '#d97706',
                ];
            });

        $recentPayments = Booking::where('status_pembayaran', 'paid')
            ->with('siswa')
            ->orderBy('paid_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($booking) {
                $siswaName = $booking->siswa->name ?? 'Siswa';
                return [
                    'icon'  => 'ti-credit-card',
                    'text'  => "Pembayaran Rp " . number_format($booking->total_harga, 0, ',', '.') . " dari {$siswaName} (Lunas)",
                    'time'  => $booking->paid_at ? Carbon::parse($booking->paid_at)->diffForHumans() : 'baru saja',
                    'color' => '#16a34a',
                ];
            });

        $recentVerifications = User::where('role', 'guru')
            ->whereNotNull('is_verified')
            ->orderBy('updated_at', 'desc')
            ->take(2)
            ->get()
            ->map(function ($user) {
                return [
                    'icon'  => 'ti-user-check',
                    'text'  => "{$user->name} telah diverifikasi sebagai guru",
                    'time'  => $user->updated_at->diffForHumans(),
                    'color' => '#185FA5',
                ];
            });

        // Gabungkan dan urutkan berdasarkan waktu (desc) lalu ambil 6 teratas
        $recentActivities = collect()
            ->concat($recentGuruRegistrations)
            ->concat($recentPayments)
            ->concat($recentVerifications)
            ->sortByDesc(function ($item) {
                // parsing time string untuk sort (sederhana: pakai timestamp asli atau kita simpan timestamp)
                // Lebih mudah: tambahkan field 'timestamp' saat membuat data
                return 0; // untuk demo, urutkan berdasarkan index saja
            })
            ->take(6)
            ->values();

        // Untuk sementara, karena diffForHumans tidak bisa di-sort tanpa timestamp, kita bisa kirim data apa adanya.
        // Atau buat manual array seperti sebelumnya. Agar lebih rapi, kita urutkan berdasarkan created_at yang kita simpan.
        // Karena kita tidak menyimpan timestamp, kita beri urutan manual: gabungkan lalu ambil 6.
        // Tapi kita bisa juga buat data activity log dari berbagai sumber dengan orderBy created_at secara union di SQL.
        // Solusi simpel: gunakan aktivitas statis dulu? Tidak, kita buat dinamis dengan menambahkan field 'created_at'.

        // Re-build dengan menambahkan created_at
        $recentGuruRegistrations = User::where('role', 'guru')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($user) {
                return [
                    'icon'       => 'ti-user-plus',
                    'text'       => "{$user->name} mendaftar sebagai guru baru",
                    'time'       => $user->created_at->diffForHumans(),
                    'color'      => '#d97706',
                    'created_at' => $user->created_at,
                ];
            });

        $recentPayments = Booking::where('status_pembayaran', 'paid')
            ->with('siswa')
            ->orderBy('paid_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($booking) {
                $siswaName = $booking->siswa->name ?? 'Siswa';
                $paidAt = $booking->paid_at ? Carbon::parse($booking->paid_at) : now();
                return [
                    'icon'       => 'ti-credit-card',
                    'text'       => "Pembayaran Rp " . number_format($booking->total_harga, 0, ',', '.') . " dari {$siswaName} (Lunas)",
                    'time'       => $paidAt->diffForHumans(),
                    'color'      => '#16a34a',
                    'created_at' => $paidAt,
                ];
            });

        $recentVerifications = User::where('role', 'guru')
            ->where('is_verified', true)
            ->orderBy('updated_at', 'desc')
            ->take(2)
            ->get()
            ->map(function ($user) {
                return [
                    'icon'       => 'ti-user-check',
                    'text'       => "{$user->name} telah diverifikasi sebagai guru",
                    'time'       => $user->updated_at->diffForHumans(),
                    'color'      => '#185FA5',
                    'created_at' => $user->updated_at,
                ];
            });

        $recentActivities = collect()
            ->concat($recentGuruRegistrations)
            ->concat($recentPayments)
            ->concat($recentVerifications)
            ->sortByDesc('created_at')
            ->take(6)
            ->map(function ($item) {
                return [
                    'icon' => $item['icon'],
                    'text' => $item['text'],
                    'time' => $item['time'],
                    'color' => $item['color'],
                ];
            })
            ->values();

        // Data untuk grafik tren pendaftaran siswa per bulan (6 bulan terakhir)
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $months->push(Carbon::now()->subMonths($i));
        }

        $monthlyData = $months->map(function ($month) {
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();

            $siswaBaru = User::where('role', 'siswa')
                ->whereBetween('created_at', [$start, $end])
                ->count();

            // Data untuk guru dan pendapatan tidak ditampilkan di chart ini, tapi bisa disertakan jika perlu
            return [
                'month' => $month->translatedFormat('M'),
                'siswa' => $siswaBaru,
                // 'guru' => ... , 'pendapatan' => ... (opsional)
            ];
        });

        return response()->json([
            'summaryCards' => [
                [
                    'icon'   => 'ti-chalkboard',
                    'label'  => 'Total Guru',
                    'value'  => $totalGuru,
                    'change' => '+5', // bisa dihitung dari bulan lalu, dummy
                    'accent' => '#185FA5',
                ],
                [
                    'icon'   => 'ti-school',
                    'label'  => 'Total Siswa',
                    'value'  => $totalSiswa,
                    'change' => '+23',
                    'accent' => '#7c3aed',
                ],
                [
                    'icon'   => 'ti-book',
                    'label'  => 'Kelas Aktif',
                    'value'  => $kelasAktif,
                    'change' => '+12',
                    'accent' => '#16a34a',
                ],
                [
                    'icon'   => 'ti-clock-pause',
                    'label'  => 'Bayar Pending',
                    'value'  => $pendingPembayaran,
                    'change' => '-3',
                    'accent' => '#ea580c',
                ],
            ],
            'extraCards' => [
                [
                    'icon'   => 'ti-alert-triangle',
                    'label'  => 'Total Tunggakan',
                    'value'  => 'Rp ' . number_format($totalTunggakan, 0, ',', '.'),
                    'accent' => '#dc2626',
                ],
                [
                    'icon'   => 'ti-user-plus',
                    'label'  => 'Menunggu Verifikasi',
                    'value'  => $menungguVerifikasi,
                    'accent' => '#d97706',
                ],
            ],
            'monthlyData' => $monthlyData, // untuk chart
            'recentActivities' => $recentActivities,
            // Untuk quick actions, kita tidak perlu data dari backend (hardcoded di frontend)
        ]);
    }
}
