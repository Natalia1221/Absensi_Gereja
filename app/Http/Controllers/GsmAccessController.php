<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GsmAccessController extends Controller
{
    public function index(Request $request)
    {
        $hariIni = Carbon::now()->toDateString();
        $userId = $request->user()->id;

        // 1. Logika pengunci status absensi hari ini
        $canAbsent = Schedule::where('sunday_date', $hariIni)
            ->where(function($query) use ($userId) {
                $query->where('pujian_id', $userId)
                    ->orWhere('horong1_id', $userId)
                    ->orWhere('horong2_id', $userId)
                    ->orWhere('horong3_id', $userId)
                    ->orWhere('pemusik_id', $userId);
            })->exists();

        // 2. Tarik daftar semua jadwal untuk ditampilkan langsung di dashboard GSM
        $schedules = Schedule::with(['pujian', 'horong1', 'horong2', 'horong3', 'pemusik'])
            ->orderBy('sunday_date', 'desc')
            ->get();

        $attendances = \App\Models\Attendance::where('user_id', $userId)
        ->orderBy('created_at', 'desc')
        ->get();

        // Kirim kedua data tersebut ke React
        return Inertia::render('Dashboard', [
            'canAbsent' => $canAbsent,
            'schedules' => $schedules,
            'attendances' => $attendances //
        ]);
    }
    /**
     * Tampilkan halaman jadwal ibadah (Hanya Lihat)
     */
    public function viewSchedules(Request $request)
    {
        // Menarik data jadwal agar GSM bisa bersiap-siap melihat tugasnya
        $schedules = Schedule::with(['pujian', 'horong1', 'horong2', 'horong3', 'pemusik'])
            ->orderBy('sunday_date', 'desc')
            ->get();

        return Inertia::render('Gsm/ScheduleView', [
            'schedules' => $schedules
        ]);
    }

    /**
     * Tampilkan halaman portal absensi khusus milik GSM tersebut
     */
    public function viewAttendances(Request $request)
    {
        // [Drafting Placeholder] Nanti di sini tempat mengambil data dari tabel attendances
        // Berdasarkan ID GSM yang sedang login: $request->user()->id
        
        return Inertia::render('Gsm/AttendancePortal', [
            'myAttendances' => [] // Sementara kita siapkan array kosong dulu
        ]);
    }
}

