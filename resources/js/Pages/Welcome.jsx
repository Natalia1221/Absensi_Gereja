import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            {/* Mengatur Judul pada Tab Browser */}
            <Head title="Selamat Datang - Absensi GSM" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">
                
                {/* Kartu Utama (Main Card) */}
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50 transition-all dark:bg-slate-800 dark:shadow-none">
                    
                    {/* Bagian Logo / Ikon Salib & Hati */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </div>

                    {/* Judul Aplikasi */}
                    <div className="mt-6 text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Absensi GSM
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Sistem Informasi Penjadwalan Pelayanan & Presisi Absensi Guru Sekolah Minggu
                        </p>
                    </div>

                    {/* Pembatas Visual */}
                    <div className="my-6 border-t border-slate-100 dark:border-slate-700"></div>

                    {/* Tombol Aksi Dinamis */}
                    <div className="space-y-3">
                        {auth.user ? (
                            // Jika pengguna SUDAH login, tampilkan tombol ke Dashboard
                            <Link
                                href={route('dashboard')}
                                className="block w-full rounded-xl bg-teal-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-teal-500/20 hover:bg-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 active:bg-teal-700"
                            >
                                Masuk ke Dashboard ({auth.user.name})
                            </Link>
                        ) : (
                            // Jika pengguna BELUM login, tampilkan tombol menuju halaman Log In
                            <>
                                <Link
                                    href={route('login')}
                                    className="block w-full rounded-xl bg-teal-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-teal-500/20 hover:bg-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 active:bg-teal-700"
                                >
                                    Masuk ke Akun Saya
                                </Link>
                                
                                <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                                    Pendaftaran akun hanya dapat dilakukan oleh Admin Gereja.
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Bagian Kaki Halaman (Footer) */}
                <footer className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    &copy; {new Date().getFullYear()} Absensi GSM Gereja. All rights reserved.
                </footer>
            </div>
        </>
    );
}