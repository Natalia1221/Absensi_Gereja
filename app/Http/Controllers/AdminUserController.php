<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class AdminUserController extends Controller
{
    /**
     * Tampilkan halaman formulir tambah akun GSM
     */
    public function create(Request $request)
    {
        // Keamanan berlapis: Jika yang mengakses bukan admin, tendang kembali ke dashboard biasa
        if ($request->user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Admin/CreateUser');
    }

    /**
     * Proses penyimpanan akun baru ke database SQLite
     */
    public function store(Request $request)
    {
        // 1. Validasi Keamanan Hak Akses
        if ($request->user()->role !== 'admin') {
            return abort(403, 'Anda tidak memiliki hak akses untuk tindakan ini.');
        }

        // 2. Validasi Teks Inputan Form
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone_number' => [
                'required',
                'string',
                'regex:/^628[1-9][0-9]{7,11}$/', // Wajib diawali 628, diikuti angka valid, panjang total 10-14 digit
            ],
            'role' => 'required|string|in:gsm,pimpinan,admin',
            'password' => ['required', Rules\Password::defaults()],
        ]);

        // 3. Masukkan Data ke Database SQLite
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'role' => $request->role,
            'password' => Hash::make($request->password), // Amankan password dengan enkripsi
        ]);

        // 4. Kembalikan Admin ke halaman dashboard dengan pesan sukses
        return redirect()->route('dashboard')->with('message', 'Akun Pelayan baru berhasil didaftarkan secara resmi!');
    }

    public function index(Request $request)
    {
        // Keamanan ketat: Jika bukan admin, tendang kembali ke dashboard
        if ($request->user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        // Mengambil seluruh data user dari SQLite, diurutkan dari yang paling baru didaftarkan
        $users = User::latest()->get();

        // Kirim data $users ke halaman React bernama Admin/IndexUser
        return Inertia::render('Admin/IndexUser', [
            'users' => $users
        ]);
    }

        /**
     * Tampilkan halaman formulir edit akun pelayan
     */
    public function edit(Request $request, User $user)
    {
        if ($request->user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Admin/EditUser', [
            'user' => $user
        ]);
    }

    /**
     * Proses menyimpan perubahan data akun ke database SQLite
     */
    public function update(Request $request, User $user)
    {
        if ($request->user()->role !== 'admin') {
            return abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,
            'phone_number' => 'required|string|max:15',
            'role' => 'required|string|in:gsm,pimpinan,admin',
        ]);

        // Update data teks dasar
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'role' => $request->role,
        ]);

        // Kondisi Khusus: Jika password diisi, maka ganti password baru. Jika kosong, biarkan password lama.
        if ($request->filled('password')) {
            $request->validate([
                'password' => ['required', \Illuminate\Validation\Rules\Password::defaults()],
            ]);
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        return redirect()->route('admin.users.index')->with('message', 'Data Pelayan berhasil diperbarui!');
    }

    /**
     * Proses menghapus akun dari database SQLite
     */
    public function destroy(Request $request, User $user)
    {
        if ($request->user()->role !== 'admin') {
            return abort(403);
        }

        // Mencegah Admin menghapus akun dirinya sendiri secara tidak sengaja
        if ($request->user()->id === $user->id) {
            return redirect()->route('admin.users.index')->with('message', 'Gagal! Anda tidak bisa menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('message', 'Akun pelayan resmi dihapus dari sistem!');
    }

    public function storeManualAttendance(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $hariIni = Carbon::now()->toDateString();
        $jadwalAktif = Schedule::where('sunday_date', $hariIni)->first();
        if (!$jadwalAktif) {
            $jadwalAktif = Schedule::orderBy('sunday_date', 'desc')->first();
        }

        if (!$jadwalAktif) {
            return redirect()->back()->with('message', 'Gagal! Buat data jadwal master terlebih dahulu.');
        }

        $alreadyAbsent = Attendance::where('user_id', $request->user_id)
            ->where('schedule_id', $jadwalAktif->id)
            ->exists();

        if ($alreadyAbsent) {
            return redirect()->back()->with('message', 'Gagal! GSM yang bersangkutan sudah mengisi absensi.');
        }

        Attendance::create([
            'user_id'     => $request->user_id,
            'schedule_id' => $jadwalAktif->id,
            'attended_at' => Carbon::now(),
            'latitude'    => 'Manual-Admin',
            'longitude'   => 'Manual-Admin',
            'photo_path' => 'Manual-Admin',
        ]);

        return redirect()->back()->with('message', 'Berhasil menambahkan absensi kehadiran GSM secara manual.');
    }

    public function destroyAttendance(Attendance $attendance)
    {
        try {
            // 1. Hapus berkas fisik foto jika ada di folder storage
            if ($attendance->photo_path && Storage::disk('public')->exists($attendance->photo_path)) {
                Storage::disk('public')->delete($attendance->photo_path);
            }

            // 2. Hapus data dari database SQLite
            $attendance->delete();

            return redirect()->back()->with('message', 'Data absensi salah berhasil dihapus dari sistem.');

        } catch (\Exception $e) {
            return redirect()->back()->with('message', 'Gagal menghapus absensi. Error: ' . $e->getMessage());
        }
    }
}