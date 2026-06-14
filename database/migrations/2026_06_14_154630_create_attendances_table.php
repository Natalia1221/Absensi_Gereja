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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            // Menghubungkan absen dengan akun GSM yang login
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Menyimpan data lokasi GPS & Foto Selfie Kehadiran
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('selfie_path')->nullable(); // Tempat simpan nama file foto
            
            $table->timestamps(); // Otomatis mencatat 'created_at' (Waktu Absen)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
