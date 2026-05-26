<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Services\GcsFileService;
use Illuminate\Http\Request;

class GuruController extends Controller
{
    public function index(Request $request)
    {
        $query = Guru::with('user');

        if ($request->kota) {
            $query->whereHas('user', fn($q) => $q->where('kota', $request->kota));
        }
        if ($request->mapel) {
            $query->where('mata_pelajaran', 'like', '%' . $request->mapel . '%');
        }
        if ($request->search) {
            $query->whereHas('user', fn($q) => $q->where('name', 'like', '%' . $request->search . '%'));
        }

        $sort = $request->sort ?? 'rating';
        if ($sort === 'rating') $query->orderBy('rating', 'desc');
        if ($sort === 'nama') $query->whereHas('user', fn($q) => $q->orderBy('name'));

        $gurus = $query->get()->map(fn($g) => $this->format($g));

        return response()->json($gurus);
    }

    public function show($id)
    {
        $guru = Guru::with('user')->findOrFail($id);
        $data = $this->format($guru, detail: true);

        $data['ulasan'] = [
            [
                'id'       => 1,
                'nama'     => 'Siswa Synau',
                'waktu'    => '1 bulan lalu',
                'bintang'  => 5,
                'komentar' => 'Guru yang sangat sabar dan mudah dipahami!',
            ],
        ];
        $data['total_ulasan'] = 1;

        return response()->json($data);
    }

    public function bookedSlots(Request $request, $id)
    {
        $guru = Guru::findOrFail($id);
        $hari = $request->hari;

        $booked = $guru->bookings()
            ->where('status', '!=', 'cancelled')
            ->get()
            ->filter(fn($b) => in_array($hari, $b->hari_dipilih))
            ->map(fn($b) => $b->waktu_mulai[$hari] ?? null)
            ->filter()
            ->values();

        return response()->json(['booked_slots' => $booked]);
    }

    private function decodeJson($value, $default = [])
    {
        if (is_array($value)) return $value;
        $decoded = json_decode($value, true);
        if (is_string($decoded)) $decoded = json_decode($decoded, true);
        return $decoded ?? $default;
    }

    private function format(Guru $g, bool $detail = false): array
    {
        $data = [
            'id'             => $g->id,
            'nama'           => $g->user->name,
            'email'          => $g->user->email,
            'kota'           => $g->user->kota,
            'mapel'          => $g->mata_pelajaran[0] ?? '',
            'mata_pelajaran' => $this->decodeJson($g->getRawOriginal('mata_pelajaran')),
            'jadwal'         => $this->decodeJson($g->getRawOriginal('jadwal')),
            'rating'         => $g->rating,
            'terverifikasi'  => $g->terverifikasi,
            'harga'          => [
                'mingguan'      => $g->harga_mingguan,
                'bulanan'       => $g->harga_bulanan,
                'sesiPerMinggu' => 2,
                'menitPerSesi'  => $g->menit_per_sesi,
            ],
        ];

        if ($detail) {
            $data['bio']               = $g->bio;
            $data['total_siswa']       = $g->total_siswa;
            $data['kepuasan']          = 95;
            $data['slot_jam_per_hari'] = $this->decodeJson($g->getRawOriginal('slot_jam'));
        }

        return $data;
    }

    public function uploadDokumen(Request $request, $id, GcsFileService $gcs)
    {
        $request->validate([
            'cv'     => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'ktp'    => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'ijazah' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $guru = Guru::findOrFail($id);

        if ($request->hasFile('cv')) {
            $guru->cv_path = $gcs->upload($request->file('cv'), 'dokumen-guru/cv');
        }

        if ($request->hasFile('ktp')) {
            $guru->ktp_path = $gcs->upload($request->file('ktp'), 'dokumen-guru/ktp');
        }

        if ($request->hasFile('ijazah')) {
            $guru->ijazah_path = $gcs->upload($request->file('ijazah'), 'dokumen-guru/ijazah');
        }

        $guru->save();

        return response()->json([
            'message' => 'Dokumen berhasil diupload ke Cloud Storage',
            'guru' => $guru,
        ]);
    }
}