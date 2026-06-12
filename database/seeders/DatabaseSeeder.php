<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // SUNTIK AKUN ADMIN UTAMA KE DATABASE SQLITE
        User::create([
            'name' => 'Admin Natalia',
            'email' => 'admin@gereja.com',
            'role' => 'admin', 
            'password' => Hash::make('passwordadmin123'), 
            'phone_number' => '081262949483',
        ]);

        // BISA JUGA MENAMBAHKAN SATU AKUN GSM CONTOH UNTUK TESTING LOGIN
        User::create([
            'name' => 'Guru Sekolah Minggu 1',
            'email' => 'gsm@gereja.com',
            'role' => 'gsm',
            'password' => Hash::make('passwordgsm123'),
            'phone_number' => '089876543210',
        ]);
    }
}
