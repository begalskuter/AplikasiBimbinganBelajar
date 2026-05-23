<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    protected $fillable = [
        'user_id', 'bio', 'mata_pelajaran', 'jadwal', 'slot_jam',
        'harga_mingguan', 'harga_bulanan', 'menit_per_sesi',
        'rating', 'total_siswa', 'terverifikasi',
        'cv_path', 'ktp_path', 'ijazah_path',
    ];

    protected $casts = [
        'mata_pelajaran' => 'array',
        'jadwal'         => 'array',
        'slot_jam'       => 'array',
        'terverifikasi'  => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
