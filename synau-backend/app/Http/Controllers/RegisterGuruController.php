<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class RegisterGuruController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'                  => 'required|string|max:255',
            'nama_panggilan'        => 'nullable|string|max:100',
            'email'                 => 'required|email|unique:users,email',
            'password'              => ['required', Password::min(8)],
            'password_confirmation' => 'required|same:password',
            'tanggal_lahir'         => 'nullable|date',
            'no_hp'                 => 'nullable|string|max:20',
            'alamat_lengkap'        => 'nullable|string',
            'kelurahan'             => 'nullable|string|max:100',
            'kecamatan'             => 'nullable|string|max:100',
            'kota'                  => 'nullable|string|max:100',
            'provinsi'              => 'nullable|string|max:100',
            'cv'                    => 'required|file|mimes:pdf,doc,docx|max:5120',
            'ktp'                   => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'ijazah'                => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ], [
            'email.unique'              => 'Email sudah terdaftar.',
            'cv.required'               => 'CV wajib diupload.',
            'ktp.required'              => 'KTP wajib diupload.',
            'ijazah.required'           => 'Ijazah/Surat Aktif Kuliah wajib diupload.',
            'password_confirmation.same'=> 'Konfirmasi password tidak cocok.',
        ]);

        // Simpan file dokumen ke storage/app/public/dokumen-guru/
        $cvPath     = $request->file('cv')->store('dokumen-guru/cv', 'public');
        $ktpPath    = $request->file('ktp')->store('dokumen-guru/ktp', 'public');
        $ijazahPath = $request->file('ijazah')->store('dokumen-guru/ijazah', 'public');

        $user = User::create([
            'name'           => $request->name,
            'nama_panggilan' => $request->nama_panggilan,
            'email'          => $request->email,
            'password'       => Hash::make($request->password),
            'tanggal_lahir'  => $request->tanggal_lahir,
            'no_hp'          => $request->no_hp,
            'alamat_lengkap' => $request->alamat_lengkap,
            'kelurahan'      => $request->kelurahan,
            'kecamatan'      => $request->kecamatan,
            'kota'           => $request->kota,
            'provinsi'       => $request->provinsi,
            'role'           => 'guru',          // role otomatis guru
            // Simpan path dokumen — tambahkan kolom ini ke tabel users
            // atau buat tabel terpisah dokumen_guru kalau mau lebih rapi
            'cv_url'         => Storage::url($cvPath),
            'ktp_url'        => Storage::url($ktpPath),
            'ijazah_url'     => Storage::url($ijazahPath),
            'is_verified'    => false,           // menunggu verifikasi admin
        ]);

        return response()->json([
            'message' => 'Pendaftaran berhasil. Menunggu verifikasi admin.',
            'user_id' => $user->id,
        ], 201);
    }
}
