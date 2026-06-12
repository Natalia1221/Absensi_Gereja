<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        // 1. Ambil semua jadwal beserta nama GSM yang bertugas
        $schedules = Schedule::with(['pujian', 'horong1', 'horong2', 'horong3', 'pemusik'])
            ->orderBy('sunday_date', 'desc')
            ->get();

        // 2. Ambil hanya user yang memiliki role 'gsm' untuk isi Dropdown Form
        $gsmUsers = User::where('role', 'gsm')->orderBy('name', 'asc')->get();

        // 3. HITUNG STATISTIK UNTUK GRAFIK LAPORAN
        // Kita hitung berapa kali setiap GSM bertugas di semua kategori
        $chartData = [];
        foreach ($gsmUsers as $gsm) {
            $count = Schedule::where('pujian_id', $gsm->id)
                ->orWhere('horong1_id', $gsm->id)
                ->orWhere('horong2_id', $gsm->id)
                ->orWhere('horong3_id', $gsm->id)
                ->orWhere('pemusik_id', $gsm->id)
                ->count();

            $chartData[] = [
                'name' => $gsm->name,
                'total_pelayanan' => $count
            ];
        }

        return Inertia::render('Admin/ScheduleIndex', [
            'schedules' => $schedules,
            'gsmUsers' => $gsmUsers,
            'chartData' => $chartData
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sunday_date' => 'required|date|unique:schedules,sunday_date',
            'pujian_id' => 'required|exists:users,id',
            'horong1_id' => 'required|exists:users,id',
            'horong2_id' => 'required|exists:users,id',
            'horong3_id' => 'required|exists:users,id',
            'pemusik_id' => 'required|exists:users,id',
        ]);

        Schedule::create($request->all());

        return redirect()->back()->with('message', 'Jadwal pelayanan minggu baru berhasil disusun!');
    }

    public function edit(Request $request, Schedule $schedule)
    {
        if ($request->user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        // Ambil semua GSM untuk pilihan dropdown di form edit
        $gsmUsers = User::where('role', 'gsm')->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/ScheduleEdit', [
            'schedule' => $schedule,
            'gsmUsers' => $gsmUsers
        ]);
    }

    public function update(Request $request, Schedule $schedule)
    {
        if ($request->user()->role !== 'admin') {
            return abort(403);
        }

        $request->validate([
            'sunday_date' => 'required|date|unique:schedules,sunday_date,' . $schedule->id,
            'pujian_id' => 'required|exists:users,id',
            'horong1_id' => 'required|exists:users,id',
            'horong2_id' => 'required|exists:users,id',
            'horong3_id' => 'required|exists:users,id',
            'pemusik_id' => 'required|exists:users,id',
        ]);

        $schedule->update($request->all());

        return redirect()->route('admin.schedules.index')->with('message', 'Jadwal pelayanan berhasil diperbarui!');
    }

    public function destroy(Request $request, Schedule $schedule)
    {
        if ($request->user()->role !== 'admin') {
            return abort(403);
        }

        $schedule->delete();

        return redirect()->route('admin.schedules.index')->with('message', 'Jadwal pelayanan resmi dibatalkan/dihapus!');
    }
}