<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Schedule;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class SendWhatsappReminder extends Command
{
    // 👇 Ini adalah nama perintah yang akan dipanggil oleh server nanti
    protected $signature = 'reminder:whatsapp';
    protected $description = 'Mengirimkan pesan pengingat otomatis H-1 kepada GSM yang bertugas besok';

    public function handle()
    {
        // 1. Cari tanggal untuk BESOK (Hari Minggu)
        $tomorrow = \Carbon\Carbon::now()->next(\Carbon\Carbon::SUNDAY)->toDateString();

        // 2. Tarik data jadwal besok dari laci SQLite beserta profile lengkap GSM
        $schedule = Schedule::with(['pujian', 'horong1', 'horong2', 'horong3', 'pemusik'])
            ->where('sunday_date', $tomorrow)
            ->first();

        // Jika besok tidak ada jadwal ibadah terdaftar, hentikan operasi seketika
        if (!$schedule) {
            $this->info('Tidak ada jadwal pelayanan untuk tanggal: ' . $tomorrow);
            return Command::SUCCESS;
        }

        // 3. Petakan daftar petugas ke dalam array ringkas untuk di-looping
        $roles = [
            'Pemimpin Pujian'        => $schedule->pujian,
            'Guru Sekolah Minggu H1' => $schedule->horong1,
            'Guru Sekolah Minggu H2' => $schedule->horong2,
            'Guru Sekolah Minggu H3' => $schedule->horong3,
            'Pemusik / Diaken'       => $schedule->pemusik,
        ];

        // Format tanggal Indonesia yang cantik untuk di dalam isi pesan WA
        $tanggalIbadah = Carbon::parse($schedule->sunday_date)->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('l, d F Y');

        // 4. Lakukan looping untuk mengirim pesan ke masing-masing petugas
        foreach ($roles as $tugas => $gsm) {
            if ($gsm && $gsm->phone_number) {
                
                // Susun draf pesan teks sekadar mengingatkan dengan takzim
                $pesanTeks = "Shalom, *{$gsm->name}*.\n\n"
                           . "Mengingatkan dengan kasih bahwa besok pada Hari *{$tanggalIbadah}*, Anda terdaftar resmi dalam pelayanan ibadah Sekolah Minggu sebagai:\n"
                           . "➔ *{$tugas}*\n\n"
                           . "Mari persiapkan hati, materi pengajaran, dan hadir 15 menit lebih awal di lokasi pelayanan. Jika mendadak berhalangan, harap segera berkoordinasi dengan Admin Natalia atau Koordinator Horong.\n\n"
                           . "Selamat mempersiapkan diri, Tuhan Yesus memberkati pelayanan Anda. ✨\n\n"
                           . "_-- Aplikasi Otomatis Absensi GSM --_";

                // 5. EMBED INTEGRASI API GATEWAY (Contoh standard payload menggunakan provider Fonnte)
                // Kamu cukup mengganti URL dan Token sesuai vendor WA Gateway pilihanmu nanti
                $response = Http::withHeaders([
                    'Authorization' => env('FONNTE_TOKEN'), // Masukkan token API dari provider
                ])->post('https://api.fonnte.com/send', [
                    'target' => $gsm->phone_number, // Menggunakan nomor format 628... hasil validasi ketat kemarin
                    'message' => $pesanTeks,
                    'countryCode' => '62',
                ]);

                if ($response->successful()) {
                    $this->info("Pesan berhasil terkirim ke {$gsm->name} ({$tugas})");
                } else {
                    $this->error("Gagal mengirim pesan ke {$gsm->name}. Error: " . $response->body());
                }
            }
        }

        return Command::SUCCESS;
    }
}