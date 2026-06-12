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
            
            // 1. Menghubungkan absensi dengan data USER (Siapa GSM yang absen)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // 2. Menghubungkan absensi dengan JADWAL pelayanan ibadah
            $table->foreignId('schedule_id')->constrained()->onDelete('cascade');
            
            // 3. Mencatat waktu presisi saat tombol absen diklik (Jam & Menit)
            $table->timestamp('attended_at');
            
            // 4. Menyimpan koordinat GPS dari sensor HP Android GSM
            $table->double('latitude');  // Garis Lintang
            $table->double('longitude'); // Garis Bujur
            
            // 5. Menyimpan jalur/path lokasi file foto selfie di server storage
            $table->string('photo_path');
            
            // 6. Status Verifikasi Absen oleh Admin Gereja
            // Kita beri default 'pending' (menunggu diperiksa admin)
            // Nilai lainnya nanti: 'valid' (disetujui) atau 'invalid' (ditolak)
            $table->string('status')->default('pending');
            
            $table->timestamps();
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
