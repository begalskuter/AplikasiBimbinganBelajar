<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('cv_url')->nullable()->after('foto_url');
            $table->string('ktp_url')->nullable()->after('cv_url');
            $table->string('ijazah_url')->nullable()->after('ktp_url');
            $table->boolean('is_verified')->default(false)->after('ijazah_url');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['cv_url', 'ktp_url', 'ijazah_url', 'is_verified']);
        });
    }
};
