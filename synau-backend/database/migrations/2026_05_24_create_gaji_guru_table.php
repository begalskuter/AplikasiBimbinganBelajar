<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gaji_guru', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade');
            $table->unsignedTinyInteger('bulan');   // 1–12
            $table->unsignedSmallInteger('tahun');
            $table->enum('status', ['belum', 'sudah'])->default('belum');
            $table->timestamp('dibayar_at')->nullable();
            $table->timestamps();

            // Satu record per guru per bulan
            $table->unique(['guru_id', 'bulan', 'tahun']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gaji_guru');
    }
};
