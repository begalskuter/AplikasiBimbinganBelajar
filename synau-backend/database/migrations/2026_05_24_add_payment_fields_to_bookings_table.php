<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Status pembayaran QRIS: unpaid → paid
            $table->enum('status_pembayaran', ['unpaid', 'paid'])
                  ->default('unpaid')
                  ->after('total_harga');

            // Mata pelajaran yang dipilih siswa saat booking
            $table->string('mata_pelajaran')->nullable()->after('paket');

            // Waktu pembayaran dilakukan
            $table->timestamp('paid_at')->nullable()->after('status_pembayaran');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['status_pembayaran', 'mata_pelajaran', 'paid_at']);
        });
    }
};
