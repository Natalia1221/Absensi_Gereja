import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth, flash } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800 dark:text-slate-800">
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
                            
                            {/* Grid Menu Kerja Admin */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                                {/* A. Menu Menyusun Jadwal */}
                                <Link href={route('admin.schedules.index')} className="group rounded-2xl bg-white p-6 shadow-xs border border-slate-100 hover:border-teal-500/30 transition-all dark:bg-slate-800 dark:border-transparent">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all dark:bg-teal-950/40">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                        </svg>
                                    </div>
                                    <h5 className="mt-4 font-bold text-slate-400">Menyusun Jadwal</h5>
                                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">Atur ploting guru pelayan per-ibadah minggu secara terstruktur.</p>
                                </Link>

                                {/* B. Menu Rekap Absen */}
                                <Link 
                                    href={route('admin.users.index')}
                                    className="group rounded-2xl bg-white p-6 shadow-xs border border-slate-100 hover:border-teal-500/30 transition-all dark:bg-slate-800 dark:border-transparent"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all dark:bg-teal-950/40">
                                        <svg xmlns="http://www.w3.org/2000/xl" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                        </svg>
                                    </div>
                                    <h5 className="mt-4 font-bold text-slate-900 dark:text-white">Melihat Daftar Akun</h5>
                                    <p className="mt-1 text-xs text-slate-600 font-medium leading-relaxed dark:text-slate-400">Pantau seluruh akun terdaftar, nomor WhatsApp, beserta tingkatan hak aksesnya.</p>
                                </Link>

                            </div>
                        </div>
                    )}


                    {/* ========================================================= */}
                    {/* 🧑‍🏫 TAMPILAN 2: DASHBOARD KHUSUS USER / GSM               */}
                    {/* ========================================================= */}
                    {auth.user.role === 'gsm' && (
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Menu Kerja Guru Sekolah Minggu
                            </h4>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                
                                {/* A. TOMBOL ABSEN UTAMA (Besar & Dominan) */}
                                <div className="md:col-span-2 rounded-2xl bg-white p-6 shadow-xs border border-slate-100 dark:bg-slate-800 dark:border-transparent flex flex-col justify-between">
                                    <div>
                                        <h5 className="text-lg font-bold text-slate-900 dark:text-white">Presensi Kehadiran</h5>
                                        <p className="text-xs text-slate-400 mt-1">Tekan tombol di bawah untuk mendeteksi koordinat GPS tempat Anda berdiri dan mengambil foto selfie pelayanan.</p>
                                    </div>
                                    
                                    {/* Tombol Aksi Absen Simulasi */}
                                    <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-teal-500/10 hover:bg-teal-500 active:bg-teal-700 transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5 animate-pulse">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                        Catat Absen Geolocation Sekarang
                                    </button>
                                </div>

                                {/* B. PANEL JADWAL KECIL GSM */}
                                <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 dark:bg-slate-800 dark:border-transparent">
                                    <h5 className="font-bold text-slate-900 dark:text-white">Jadwal Anda Minggu Ini</h5>
                                    
                                    {/* Simulasi Kotak Informasi Jadwal */}
                                    <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-700">
                                        <p className="text-xs font-bold text-teal-600 dark:text-teal-400">Minggu Depan</p>
                                        <h6 className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">Kelas Kecil (Horong 1)</h6>
                                        <p className="text-xs text-slate-400 mt-2">🕒 Pukul 08:00 WIB</p>
                                        <p className="text-xs text-slate-400">📍 Ruang Konsistori Belakang</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}