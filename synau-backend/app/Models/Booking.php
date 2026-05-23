<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'siswa_id', 'guru_id', 'paket', 'hari_dipilih',
        'waktu_mulai', 'tanggal_mulai', 'catatan', 'status', 'total_harga',
    ];

    protected $casts = [
        'hari_dipilih' => 'array',
        'waktu_mulai'  => 'array',
        'tanggal_mulai' => 'date',
    ];

    public function siswa()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }
}
