<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Mengatur agar perintah reminder dijalankan secara otomatis setiap hari Sabtu pukul 08:00 Pagi
Schedule::command('reminder:whatsapp')->saturdays()->at('08:00');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
