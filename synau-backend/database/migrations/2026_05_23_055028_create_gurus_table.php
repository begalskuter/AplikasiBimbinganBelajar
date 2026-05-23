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
        Schema::create('gurus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('bio')->nullable();
            $table->json('mata_pelajaran'); // ["Matematika SMP", "Matematika SMA"]
            $table->json('jadwal');         // ["Senin", "Rabu", "Jumat"]
            $table->json('slot_jam');       // ["08:00", "10:15", "12:30"]
            $table->integer('harga_mingguan')->default(0);
            $table->integer('harga_bulanan')->default(0);
            $table->integer('menit_per_sesi')->default(90);
            $table->decimal('rating', 3, 1)->default(0);
            $table->integer('total_siswa')->default(0);
            $table->boolean('terverifikasi')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gurus');
    }
};
