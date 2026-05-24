<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('onboarding_completed')->default(false)->after('is_verified');
        });

        Schema::table('gurus', function (Blueprint $table) {
            $table->boolean('onboarding_completed')->default(false)->after('user_id');
            // slot_jam dihapus — sudah ada
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('onboarding_completed');
        });

        Schema::table('gurus', function (Blueprint $table) {
            $table->dropColumn('onboarding_completed');
            // slot_jam jangan di-drop
        });
    }
};
