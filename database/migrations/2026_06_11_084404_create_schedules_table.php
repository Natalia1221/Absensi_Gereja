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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->date('sunday_date'); // Tanggal Hari Minggu Pelayanan
            
            // Hubungkan tiap kategori langsung ke ID di tabel users (Hanya GSM yang diizinkan)
            $table->foreignId('pujian_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('horong1_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('horong2_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('horong3_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('pemusik_id')->constrained('users')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
