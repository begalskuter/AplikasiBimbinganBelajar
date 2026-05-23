<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorit', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade');
            $table->timestamps();

            // Satu user tidak bisa favorit guru yang sama 2x
            $table->unique(['user_id', 'guru_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorit');
    }
};
