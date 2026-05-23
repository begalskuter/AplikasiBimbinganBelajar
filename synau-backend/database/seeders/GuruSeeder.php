<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Guru;
use Illuminate\Support\Facades\Hash;

class GuruSeeder extends Seeder
{
    public function run(): void
    {
        $gurus = [
            ['name' => 'Wulandari', 'email' => 'wulandari@synau.com', 'kota' => 'Yogyakarta', 'mapel' => ['Matematika SMP', 'Matematika SMA', 'Aljabar'], 'jadwal' => ['Senin', 'Rabu', 'Jumat', 'Sabtu'], 'harga_mingguan' => 150000, 'harga_bulanan' => 500000, 'rating' => 4.9, 'bio' => 'Guru matematika berpengalaman 5 tahun di tingkat SMP dan SMA.'],
            ['name' => 'Andi Prasetyo', 'email' => 'andi@synau.com', 'kota' => 'Yogyakarta', 'mapel' => ['Fisika SMA', 'Fisika Dasar', 'Mekanika'], 'jadwal' => ['Selasa', 'Kamis', 'Sabtu'], 'harga_mingguan' => 140000, 'harga_bulanan' => 480000, 'rating' => 4.8, 'bio' => 'Lulusan UGM, spesialisasi fisika SMA dan persiapan UTBK.'],
            ['name' => 'Sari Rahayu', 'email' => 'sari@synau.com', 'kota' => 'Sleman', 'mapel' => ['Bahasa Inggris', 'TOEFL Prep', 'English Conversation'], 'jadwal' => ['Senin', 'Rabu', 'Jumat'], 'harga_mingguan' => 130000, 'harga_bulanan' => 450000, 'rating' => 4.8, 'bio' => 'Native-like English speaker, pengalaman 4 tahun mengajar semua level.'],
            ['name' => 'Dewi Hartini', 'email' => 'dewi@synau.com', 'kota' => 'Bantul', 'mapel' => ['IPA SD', 'Biologi SMP', 'Biologi SMA'], 'jadwal' => ['Selasa', 'Kamis', 'Sabtu', 'Minggu'], 'harga_mingguan' => 120000, 'harga_bulanan' => 400000, 'rating' => 4.7, 'bio' => 'Guru IPA dan Biologi yang sabar untuk semua tingkatan.'],
            ['name' => 'Rudi Prasetyo', 'email' => 'rudi@synau.com', 'kota' => 'Yogyakarta', 'mapel' => ['Matematika SMA', 'Kalkulus', 'Statistika'], 'jadwal' => ['Senin', 'Rabu', 'Sabtu'], 'harga_mingguan' => 140000, 'harga_bulanan' => 470000, 'rating' => 4.7, 'bio' => 'Master matematika UGM, spesialisasi kalkulus dan statistika.'],
            ['name' => 'Nisa Aulia', 'email' => 'nisa@synau.com', 'kota' => 'Sleman', 'mapel' => ['Kimia SMA', 'Kimia Dasar', 'Kimia Organik'], 'jadwal' => ['Selasa', 'Jumat', 'Minggu'], 'harga_mingguan' => 130000, 'harga_bulanan' => 440000, 'rating' => 4.6, 'bio' => 'Pengajar kimia aktif dengan pendekatan eksperimen sederhana.'],
            ['name' => 'Fajar Hidayat', 'email' => 'fajar@synau.com', 'kota' => 'Bantul', 'mapel' => ['Fisika SMP', 'Fisika SMA'], 'jadwal' => ['Senin', 'Kamis', 'Sabtu'], 'harga_mingguan' => 120000, 'harga_bulanan' => 400000, 'rating' => 4.6, 'bio' => 'Fisika jadi mudah dengan analogi kehidupan sehari-hari.'],
            ['name' => 'Laila Munawaroh', 'email' => 'laila@synau.com', 'kota' => 'Yogyakarta', 'mapel' => ['Bahasa Indonesia', 'Menulis Kreatif', 'Sastra'], 'jadwal' => ['Rabu', 'Jumat', 'Minggu'], 'harga_mingguan' => 110000, 'harga_bulanan' => 380000, 'rating' => 4.5, 'bio' => 'Pecinta sastra yang mengajarkan bahasa Indonesia dengan cara yang menyenangkan.'],
        ];

        foreach ($gurus as $data) {
            $user = User::create([
                'name'          => $data['name'],
                'email'         => $data['email'],
                'password'      => Hash::make('password123'),
                'kota'          => $data['kota'],
                'role'          => 'guru',
                'nama_panggilan'=> explode(' ', $data['name'])[0],
            ]);

            Guru::create([
                'user_id'        => $user->id,
                'bio'            => $data['bio'],
                'mata_pelajaran' => $data['mapel'],
                'jadwal'         => $data['jadwal'],
                'slot_jam'       => ['08:00', '10:15', '12:30', '14:45', '17:00'],
                'harga_mingguan' => $data['harga_mingguan'],
                'harga_bulanan'  => $data['harga_bulanan'],
                'menit_per_sesi' => 90,
                'rating'         => $data['rating'],
                'total_siswa'    => rand(40, 130),
                'terverifikasi'  => true,
            ]);
        }
    }
}
