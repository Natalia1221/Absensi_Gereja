<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Schedule;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GsmAccessController extends Controller
{
    /**
     * Halaman Utama / Dashboard (Admin & GSM)
     */
    public function index(Request $request)
    {
        $hariIni = Carbon::now()->toDateString();
        $userId = $request->user()->id;

        // 1. Logika pengunci status absensi hari ini (Khusus Hari Minggu)
        $canAbsent = Schedule::where('sunday_date', $hariIni)
            ->where(function($query) use ($userId) {
                $query->where('pujian_id', $userId)
                    ->orWhere('horong1_id', $userId)
                    ->orWhere('horong2_id', $userId)
                    ->orWhere('horong3_id', $userId)
                    ->orWhere('pemusik_id', $userId);
            })->exists();

        // TOLERANSI TESTING: Jika bukan hari Minggu, paksa TRUE agar tombol absen muncul di HP saat dicoba
        if (Carbon::now()->dayOfWeek !== Carbon::SUNDAY) {
            $canAbsent = true;
        }

        // 2. Tarik daftar semua jadwal untuk ditampilkan di riwayat dashboard GSM
        $schedules = Schedule::with(['pujian', 'horong1', 'horong2', 'horong3', 'pemusik'])
            ->orderBy('sunday_date', 'desc')
            ->get();

        // Riwayat absen milik GSM yang sedang login beserta data jadwalnya
        $attendances = Attendance::with('schedule')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        // 3. DATA TAMBAHAN KHUSUS UNTUK DATA REKAPITULASI ADMIN
        $allAttendances = [];
        $allGsmUsers = [];

        if ($request->user()->role === 'admin') {
            // Memastikan data riwayat ditarik lengkap dengan relasi user (nama GSM) dan schedule (tanggal ibadah)
            $allAttendances = Attendance::with(['user', 'schedule'])
                ->orderBy('created_at', 'desc')
                ->get();

            // Pilihan dropdown untuk pengisian absen manual oleh admin
            $allGsmUsers = User::where('role', 'gsm')->orderBy('name', 'asc')->get();
        }

        return Inertia::render('Dashboard', [
            'canAbsent' => $canAbsent,
            'schedules' => $schedules,
            'attendances' => $attendances,
            'allAttendances' => $allAttendances, 
            'allGsmUsers' => $allGsmUsers,     
        ]);
    }

    /**
     * Tampilkan halaman jadwal ibadah
     */
    public function viewSchedules(Request $request)
    {
        $schedules = Schedule::with(['pujian', 'horong1', 'horong2', 'horong3', 'pemusik'])
            ->orderBy('sunday_date', 'desc')
            ->get();

        return Inertia::render('Gsm/ScheduleView', [
            'schedules' => $schedules
        ]);
    }

    /**
     * Tampilkan halaman portal absensi khusus GSM
     */
    public function viewAttendances(Request $request)
    {
        $userId = $request->user()->id;
        $myAttendances = Attendance::with('schedule')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Gsm/AttendancePortal', [
            'myAttendances' => $myAttendances
        ]);
    }

    /**
     * Proses Simpan Absen Mandiri dari HP (Mendukung Axios & Fallback Jadwal)
     */
    public function storeAttendance(Request $request)
    {
        // Gunakan try-catch untuk menangkap error crash internal
        try {
            $request->validate([
                'latitude'  => 'required',
                'longitude' => 'required',
                'selfie'    => 'required|string',
            ]);

            $hariIni = Carbon::now()->toDateString();
            
            $jadwalAktif = Schedule::where('sunday_date', $hariIni)->first();
            if (!$jadwalAktif) {
                $jadwalAktif = Schedule::orderBy('sunday_date', 'desc')->first();
            }

            if (!$jadwalAktif) {
                return response()->json(['message' => 'Gagal! Belum ada data master jadwal.'], 422);
            }

            $userId = $request->user_id ?? ($request->user() ? $request->user()->id : null);
            if (!$userId) {
                return response()->json(['message' => 'Gagal! Identitas pengguna tidak terdeteksi.'], 401);
            }

            $alreadyAbsent = Attendance::where('user_id', $userId)
                ->where('schedule_id', $jadwalAktif->id)
                ->exists();

            if ($alreadyAbsent) {
                return response()->json(['message' => 'Anda sudah mengisi data absensi pada jadwal ini.'], 422);
            }

            $latGsm = $request->latitude;
            $lonGsm = $request->longitude;
            $latGereja = env('GEREJA_LATITUDE', $latGsm); 
            $lonGereja = env('GEREJA_LONGITUDE', $lonGsm);

            $earthRadius = 6371000; 
            $latDelta = deg2rad($latGereja - $latGsm);
            $lonDelta = deg2rad($lonGereja - $lonGsm);
            $a = sin($latDelta / 2) * sin($latDelta / 2) + cos(deg2rad($latGsm)) * cos(deg2rad($latGereja)) * sin($lonDelta / 2) * sin($lonDelta / 2);
            $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
            $jarakNyataMeter = $earthRadius * $c;

            $radiusMaksimal = env('GEREJA_RADIUS_METER'); 

            if ($jarakNyataMeter > $radiusMaksimal) {
                return response()->json(['message' => "Posisi terlalu jauh."], 422);
            }

            $image = $request->selfie;
            $image = str_replace('data:image/jpeg;base64,', '', $image);
            $image = str_replace(' ', '+', $image);
            $imageName = 'selfie_' . $userId . '_' . time() . '.jpg';
            Storage::disk('public')->put('selfies/' . $imageName, base64_decode($image));

            $attendance = Attendance::create([
                'user_id'     => $userId,
                'schedule_id' => $jadwalAktif->id,
                'attended_at' => \Carbon\Carbon::now(),
                'latitude'    => $latGsm,
                'longitude'   => $lonGsm,
                'photo_path' => 'selfies/' . $imageName,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Luar biasa! Absensi berhasil dicatat.',
                'data' => $attendance
            ], 200);

        } catch (\Exception $e) {
            // 🚨 JIKA TERJADI CRASH, KIRIM PESAN ERROR ASLINYA KE HP Natalia
            return response()->json([
                'message' => 'Server Crash! Detail: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Proses Tambah Absen Manual oleh Admin
     */

}