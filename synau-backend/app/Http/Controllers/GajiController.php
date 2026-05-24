<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Booking;
use App\Models\User;
use Carbon\Carbon;

class GajiController extends Controller
{
    /**
     * GET /api/admin/gaji
     * Query params: bulan (1-12), tahun (YYYY)
     * Mengembalikan rekap gaji semua guru berdasarkan booking paid bulan tsb.
     */
    public function index(Request $request)
    {
        $bulan = (int) ($request->query('bulan', now()->month));
        $tahun = (int) ($request->query('tahun', now()->year));

        // Ambil semua booking paid pada bulan & tahun yang diminta
        $bookings = Booking::with(['guru.user'])
            ->where('status_pembayaran', 'paid')
            ->whereMonth('paid_at', $bulan)
            ->whereYear('paid_at', $tahun)
            ->get();

        // Group per guru_id, hitung total sesi & pendapatan
        $grouped = $bookings->groupBy('guru_id');

        $result = $grouped->map(function ($items, $guruId) use ($bulan, $tahun) {
            $guru      = $items->first()->guru;
            $namaGuru  = $guru?->user?->name ?? 'Guru #' . $guruId;

            // Hitung total sesi: paket mingguan = 4 sesi, bulanan = 16 sesi
            $totalSesi = $items->sum(function ($b) {
                return $b->paket === 'bulanan' ? 16 : 4;
            });

            $gajiKotor   = $items->sum('total_harga');
            $potongan    = (int) round($gajiKotor * 0.10);
            $gajiBersih  = $gajiKotor - $potongan;

            // Cek apakah gaji bulan ini sudah ditransfer
            $gajiRecord = DB::table('gaji_guru')
                ->where('guru_id', $guruId)
                ->where('bulan', $bulan)
                ->where('tahun', $tahun)
                ->first();

            return [
                'guru_id'    => $guruId,
                'guru'       => $namaGuru,
                'periode'    => Carbon::createFromDate($tahun, $bulan, 1)
                                    ->locale('id')->isoFormat('MMMM YYYY'),
                'sesi'       => $totalSesi,
                'kotor'      => $gajiKotor,
                'potongan'   => $potongan,
                'bersih'     => $gajiBersih,
                'status'     => $gajiRecord?->status ?? 'belum',   // belum / sudah
                'dibayar_at' => $gajiRecord?->dibayar_at ?? null,
            ];
        })->values();

        // Summary totals
        $summary = [
            'total_sesi'       => $result->sum('sesi'),
            'total_kotor'      => $result->sum('kotor'),
            'total_potongan'   => $result->sum('potongan'),
            'total_bersih'     => $result->sum('bersih'),
            'total_belum'      => $result->where('status', 'belum')->sum('bersih'),
        ];

        return response()->json([
            'data'    => $result,
            'summary' => $summary,
            'periode' => compact('bulan', 'tahun'),
        ]);
    }

    /**
     * POST /api/admin/gaji/bayar
     * Body: { guru_id, bulan, tahun }
     * Tandai gaji guru sebagai sudah dibayar.
     */
    public function bayar(Request $request)
    {
        $request->validate([
            'guru_id' => 'required|integer',
            'bulan'   => 'required|integer|min:1|max:12',
            'tahun'   => 'required|integer|min:2020',
        ]);

        DB::table('gaji_guru')->updateOrInsert(
            [
                'guru_id' => $request->guru_id,
                'bulan'   => $request->bulan,
                'tahun'   => $request->tahun,
            ],
            [
                'status'     => 'sudah',
                'dibayar_at' => now(),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        return response()->json(['message' => 'Gaji berhasil ditandai sudah dibayar.']);
    }
}
