import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ canAbsent = false, schedules = [], attendances = [] }) {
    const { auth, flash } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800 dark:text-slate-100">
                    {auth.user.role === 'admin' ? 'Pusat Kendali Admin' : 'Portal Pelayanan GSM'}
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* 1. NOTIFIKASI SUKSES (Bisa muncul di Admin maupun GSM) */}
                    {flash?.message && (
                        <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800 shadow-xs dark:bg-green-950/40 dark:text-green-200">
                            ✨ {flash.message}
                        </div>
                    )}

                    {/* 2. BANNER SELAMAT DATANG DINAMIS */}
                    <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800 mb-8 border border-slate-100 dark:border-slate-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Shalom, {auth.user.name}!
                                </h3>
                                <p className="text-sm text-slate-700 font-medium mt-0.5 dark:text-slate-300">
                                    {auth.user.role === 'admin' 
                                        ? 'Siap mengelola jadwal pelayanan dan memantau absensi rekan-rekan GSM hari ini.' 
                                        : 'Selamat melayani! Jangan lupa untuk melakukan absensi saat tiba di lokasi sekolah minggu.'
                                    }
                                </p>
                            </div>
                            <div>
                                <span className={`inline-block uppercase text-xs font-bold tracking-wider px-3 py-1 rounded-full ${
                                    auth.user.role === 'admin' 
                                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' 
                                        : 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                                }`}>
                                    Role: {auth.user.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* 🏛️ TAMPILAN 1: DASHBOARD KHUSUS ADMINISTRATOR             */}
                    {/* ========================================================= */}
                    {auth.user.role === 'admin' && (
                        <div className="space-y-6">
                            <h4 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider dark:text-slate-400">
                                Menu Utama Administrator
                            </h4>
                            
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {/* A. Menu Menyusun Jadwal */}
                                <Link href={route('admin.schedules.index')} className="group rounded-2xl bg-white p-6 shadow-xs border border-slate-100 hover:border-teal-500/30 transition-all dark:bg-slate-800 dark:border-transparent">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all dark:bg-teal-950/40">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                        </svg>
                                    </div>
                                    <h5 className="mt-4 font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Menyusun Jadwal</h5>
                                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">Atur ploting guru pelayan per-ibadah minggu secara terstruktur.</p>
                                </Link>

                                {/* B. Menu Rekap Akun */}
                                <Link href={route('admin.users.index')} className="group rounded-2xl bg-white p-6 shadow-xs border border-slate-100 hover:border-teal-500/30 transition-all dark:bg-slate-800 dark:border-transparent">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all dark:bg-teal-950/40">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                        </svg>
                                    </div>
                                    <h5 className="mt-4 font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Melihat Daftar Akun</h5>
                                    <p className="mt-1 text-xs text-slate-600 font-medium leading-relaxed dark:text-slate-400">Pantau seluruh akun terdaftar, nomor WhatsApp, beserta tingkatan hak aksesnya.</p>
                                </Link>
                            </div>
                        </div>
                    )}


                    {/* ========================================================= */}
                    {/* 🧑‍🏫 TAMPILAN 2: DASHBOARD KHUSUS USER / GSM (3 BAGIAN)    */}
                    {/* ========================================================= */}
                    {auth.user.role === 'gsm' && (
                        <div className="space-y-8">
                            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                                Ruang Kerja Guru Sekolah Minggu
                            </h4>

                            {/* 🟩 BAGIAN 1: TOMBOL ABSENSI UTAMA */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                <div className="max-w-2xl">
                                    <h5 className="text-lg font-bold text-slate-900 dark:text-white">Presensi Kehadiran</h5>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                                        Masuk ke dalam portal mandiri untuk mendeteksi koordinat GPS tempat Anda berdiri, melakukan absensi mengajar, serta melihat rekam log kehadiran pelayanan Anda.
                                    </p>
                                </div>
                                
                                <div className="mt-6 max-w-md">
                                    {canAbsent ? (
                                        <Link 
                                            href={route('gsm.attendances.index')} 
                                            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-center text-sm font-bold text-white shadow-lg shadow-teal-600/20 hover:from-teal-500 hover:to-emerald-500 active:scale-[0.99] transition-all group"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5 animate-pulse group-hover:scale-110 transition-transform">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                            </svg>
                                            Catat Absen Sekarang
                                        </Link>
                                    ) : (
                                        <div className="rounded-xl bg-amber-50/70 p-4 border border-dashed border-amber-200 text-xs font-semibold text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-400 flex items-start gap-2.5 leading-relaxed">
                                            <span className="text-base mt-0.5">🔒</span>
                                            <div>
                                                <p className="font-bold text-amber-900 dark:text-amber-300">Tombol Absensi Belum Dibuka</p>
                                                <p className="mt-0.5 font-medium text-slate-500 dark:text-slate-400 text-[11px]">Anda hanya bisa melakukan absensi pada hari Minggu saat nama Anda terdaftar resmi dalam jadwal penugasan pelayanan jemaat.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 🟩 BAGIAN 2: LIVE LOG KEHADIRAN GSM */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/10">
                                    <h5 className="text-base font-bold text-slate-900 dark:text-white">Log Riwayat Kehadiran Anda</h5>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Berikut adalah rekam jejak riwayat absensi mandiri yang berhasil Anda lakukan di dalam aplikasi.</p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-600 border-b border-slate-100 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-700 tracking-wider">
                                                <th className="px-6 py-4">Waktu Absen</th>
                                                <th className="px-6 py-4">Status Kehadiran</th>
                                                <th className="px-6 py-4">Metode Absen</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700 dark:divide-slate-700 dark:text-slate-300">
                                            {attendances.length === 0 ? (
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-10 text-center text-slate-400 font-medium dark:text-slate-500 text-xs">
                                                        📭 Anda belum pernah tercatat melakukan absensi mengajar di dalam sistem.
                                                    </td>
                                                </tr>
                                            ) : (
                                                attendances.map((abs) => (
                                                    <tr key={abs.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                                            {new Date(abs.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} 
                                                            <span className="text-xs font-medium text-slate-400 ml-2">
                                                                ({new Date(abs.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB)
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300">
                                                                Hadir Pelayanan
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                            📍 GPS Geolocation Verified
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 🟩 BAGIAN 3: TABEL JADWAL PELAYANAN UTAMA */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/10">
                                    <h5 className="text-base font-bold text-slate-900 dark:text-white">Agenda Jadwal Pelayanan GSM</h5>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Silakan periksa ploting pembagian tugas mengajar kelas (Horong) dan petugas liturgi jemaat minggu ini.</p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-600 border-b border-slate-100 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-700 tracking-wider">
                                                <th className="px-6 py-4">Tanggal Minggu</th>
                                                <th className="px-6 py-4">Pemimpin Pujian</th>
                                                <th className="px-6 py-4">Horong 1 (Kecil)</th>
                                                <th className="px-6 py-4">Horong 2 (Sedang)</th>
                                                <th className="px-6 py-4">Horong 3 (Besar)</th>
                                                <th className="px-6 py-4">Pemusik / Diaken</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700 dark:divide-slate-700 dark:text-slate-300">
                                            {schedules.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium dark:text-slate-500">
                                                        📭 Belum ada susunan jadwal pelayanan yang diterbitkan oleh Admin.
                                                    </td>
                                                </tr>
                                            ) : (
                                                schedules.map((sch) => (
                                                    <tr key={sch.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-teal-600 dark:text-teal-400 whitespace-nowrap">
                                                            {new Date(sch.sunday_date).toLocaleDateString('id-ID', { 
                                                                weekday: 'long', 
                                                                day: 'numeric', 
                                                                month: 'long', 
                                                                year: 'numeric' 
                                                            })}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{sch.pujian?.name || '-'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{sch.horong1?.name || '-'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{sch.horong2?.name || '-'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{sch.horong3?.name || '-'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{sch.pemusik?.name || '-'}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}