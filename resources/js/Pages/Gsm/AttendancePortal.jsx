import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AttendancePortal({ myAttendances }) {
    
    const handleDoAttendance = () => {
        // [Drafting Placeholder] Fungsi pemicu simpan absensi ke database
        alert('Fitur melakukan absensi kehadiran mengajar berhasil dipicu!');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-slate-900 dark:text-slate-100">
                        Portal Absensi Mandiri GSM
                    </h2>
                    {/* Tombol Eksekusi Absen Kehadiran */}
                    <button
                        onClick={handleDoAttendance}
                        className="rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-500 shadow-md transition-all"
                    >
                        ✓ Isi Absen Hari Ini
                    </button>
                </div>
            }
        >
            <Head title="Portal Absensi" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    <div className="overflow-hidden rounded-2xl bg-white shadow-md border border-slate-100 dark:bg-slate-800 dark:border-transparent">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Log Riwayat Kehadiran Anda</h3>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">Berikut adalah rekam jejak data absensi mengajar yang pernah Anda lakukan di dalam sistem.</p>
                        </div>

                        <div className="p-6 text-center text-sm font-medium text-slate-500">
                            {/* Tempat render log absensi dari laci SQLite */}
                            Belum ada riwayat absensi terdaftar untuk akun Anda.
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}