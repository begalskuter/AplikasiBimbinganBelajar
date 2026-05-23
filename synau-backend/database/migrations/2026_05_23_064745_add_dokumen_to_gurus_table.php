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
        Schema::table('gurus', function (Blueprint $table) {
            $table->string('cv_path')->nullable();
            $table->string('ktp_path')->nullable();
            $table->string('ijazah_path')->nullable(); // ijazah S1 atau surat aktif kuliah
        });
    }

    public function down(): void
    {
        Schema::table('gurus', function (Blueprint $table) {
            $table->dropColumn(['cv_path', 'ktp_path', 'ijazah_path']);
        });
    }
};
