<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
            Schema::table('users', function (Blueprint $table) {
                $table->string('nama_panggilan')->nullable();
                $table->date('tanggal_lahir')->nullable();
                $table->string('no_hp')->nullable();
                $table->text('alamat_lengkap')->nullable();
                $table->string('kelurahan')->nullable();
                $table->string('kecamatan')->nullable();
                $table->string('kota')->nullable();
                $table->string('provinsi')->nullable();
                $table->enum('role', ['siswa', 'guru', 'admin'])->default('siswa');
            });
        }

        public function down(): void
        {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn(['nama_panggilan', 'tanggal_lahir', 'no_hp', 'alamat_lengkap', 'kelurahan', 'kecamatan', 'kota', 'provinsi', 'role']);
            });
        }
};
