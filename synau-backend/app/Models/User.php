<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password',
        'nama_panggilan', 'tanggal_lahir', 'no_hp',
        'alamat_lengkap', 'kelurahan', 'kecamatan',
        'kota', 'provinsi', 'role', 'foto_url',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function guru()
    {
        return $this->hasOne(Guru::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'siswa_id');
    }
}
