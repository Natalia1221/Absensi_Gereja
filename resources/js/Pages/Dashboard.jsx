import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ canAbsent = false, schedules = [], attendances = [], allAttendances = [], allGsmUsers = [] }) {
    const { auth, flash } = usePage().props;
    const [activeSelfie, setActiveSelfie] = useState(null); // State untuk modal foto

    // Form penanganan absen manual Admin
    const { data, setData, post, processing, reset } = useForm({
        user_id: '',
    });

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (!data.user_id) {
            alert('Silakan pilih nama Guru (GSM) terlebih dahulu.');
            return;
        }
        post(route('admin.attendances.manual'), {
            onSuccess: () => reset('user_id'),
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data absensi milik ${name}? Berkas foto juga akan dihapus permanen.`)) {
            router.delete(route('admin.attendances.destroy', id), {
                preserveScroll: true,
                onSuccess: () => alert('Absensi berhasil dihapus!'),
            });
        }
    };
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
                    
                    {/* NOTIFIKASI ALERTA */}
                    {flash?.message && (
                        <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800 shadow-xs dark:bg-green-950/40 dark:text-green-200">
                            ✨ {flash.message}
                        </div>
                    )}

                    {/* BANNER SELAMAT DATANG */}
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
                    {/* TAMPILAN 1: DASHBOARD KHUSUS ADMINISTRATOR             */}
                    {/* ========================================================= */}
                    {auth.user.role === 'admin' && (
                        <div className="space-y-8">
                            
                            {/* KONTROL INPUT ABSEN MANUAL BY ADMIN */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">🛠️ Klaim Kehadiran Manual (Titip Absen)</h4>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">Gunakan fitur ini jika ada rekan GSM yang hadir bertugas namun terkendala HP atau kelupaan menekan tombol presensi.</p>
                                
                                <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                                    <select 
                                        value={data.user_id}
                                        onChange={e => setData('user_id', e.target.value)}
                                        className="rounded-xl border-slate-200 text-sm focus:border-teal-500 focus:ring-teal-500 w-full dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                    >
                                        <option value="">-- Pilih Guru Sekolah Minggu --</option>
                                        {allGsmUsers.map(user => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl whitespace-nowrap transition-all disabled:opacity-50"
                                    >
                                        + Setir Hadir
                                    </button>
                                </form>
                            </div>

                            {/* TABEL MONITORING DAFTAR HADIR GSM SELURUHNYA */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/10">
                                    <h5 className="text-base font-bold text-slate-900 dark:text-white">Live Monitor Kehadiran Guru Pelayan</h5>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Pantau ketepatan waktu, titik koordinat GPS, serta verifikasi foto wajah asli para pengajar di lapangan.</p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-600 border-b border-slate-100 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-700 tracking-wider">
                                                <th className="px-6 py-4">Nama Guru</th>
                                                <th className="px-6 py-4">Waktu Presensi</th>
                                                <th className="px-6 py-4">Status / Geofence</th>
                                                <th className="px-6 py-4 text-center" colspan="2">Aksi Verifikasi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700 dark:divide-slate-700 dark:text-slate-300">
                                            {allAttendances.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400 dark:text-slate-500 text-xs">
                                                        📭 Hari ini belum ada data kehadiran pelayan yang masuk ke sistem.
                                                    </td>
                                                </tr>
                                            ) : (
                                                allAttendances.map((abs) => (
                                                    <tr key={abs.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                            {abs.user?.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {new Date(abs.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                            <span className="text-xs text-slate-400 font-normal ml-1">
                                                                ({new Date(abs.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB)
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {abs.latitude === 'Manual-Admin' ? (
                                                                <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2.5 py-0.5 rounded-full dark:bg-amber-950/30 dark:text-amber-300">
                                                                    ✍️ Input Manual Admin
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full dark:bg-emerald-950/30 dark:text-emerald-300">
                                                                    📍 Terverifikasi GPS
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {abs.photo_path ? (
                                                                <button
                                                                    onClick={() => setActiveSelfie(`/storage/${abs.photo_path}`)}
                                                                    className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors dark:bg-teal-950/30 dark:text-teal-400"
                                                                >
                                                                    🔍 Lihat Foto
                                                                </button>
                                                            ) : (
                                                                <span className="text-xs font-medium text-slate-400 italic">Tanpa Foto</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                                                {/* TOMBOL LIHAT FOTO */}
                                                                {abs.photo_path ? (
                                                                    <button
                                                                        onClick={() => setActiveSelfie(`/storage/${abs.photo_path}`)}
                                                                        className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors dark:bg-teal-950/30 dark:text-teal-400"
                                                                    >
                                                                        🔍 Lihat Foto
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-xs font-medium text-slate-400 italic">Tanpa Foto</span>
                                                                )}

                                                                {/* TOMBOL AKSI HAPUS (BARU) */}
                                                                <button
                                                                    onClick={() => handleDelete(abs.id, abs.user?.name)}
                                                                    className="text-xs font-bold bg-red-50 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors dark:bg-red-950/30 dark:text-red-400"
                                                                >
                                                                    🗑️ Hapus
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* MENU HUBUNGAN LINK INDEX */}
                            <div className="h-px bg-slate-200 dark:bg-slate-700 my-4"></div>
                            <h4 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider dark:text-slate-400 mt-4">
                                Manajemen Data Master
                            </h4>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                <Link href={route('admin.schedules.index')} className="group rounded-2xl bg-white p-6 shadow-xs border border-slate-100 hover:border-teal-500/30 transition-all dark:bg-slate-800 dark:border-transparent">
                                    <h5 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">Menyusun Jadwal Pelayanan</h5>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Atur ploting guru pelayan per-ibadah minggu secara terstruktur.</p>
                                </Link>
                                <Link href={route('admin.users.index')} className="group rounded-2xl bg-white p-6 shadow-xs border border-slate-100 hover:border-teal-500/30 transition-all dark:bg-slate-800 dark:border-transparent">
                                    <h5 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">Melihat Daftar Akun</h5>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Pantau seluruh akun terdaftar beserta tingkatan hak aksesnya.</p>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAMPILAN 2: DASHBOARD KHUSUS USER / GSM               */}
                    {/* ========================================================= */}
                    {auth.user.role === 'gsm' && (
                        <div className="space-y-8">
                            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                <h5 className="text-lg font-bold text-slate-900 dark:text-white">Presensi Kehadiran</h5>
                                <div className="mt-4 max-w-md">
                                    {canAbsent ? (
                                        <Link href={route('gsm.attendances.index')} className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-center text-sm font-bold text-white shadow-lg transition-all">
                                            🚀 Catat Absen Sekarang
                                        </Link>
                                    ) : (
                                        <div className="rounded-xl bg-amber-50/70 p-4 border border-amber-200 text-xs font-semibold text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
                                            🔒 Tombol Absensi Belum Dibuka.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* LOG ABSEN GSM */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/40">
                                    <h5 className="text-base font-bold text-slate-900 dark:text-white">Log Riwayat Kehadiran Anda</h5>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-600 border-b border-slate-100">
                                                <th className="px-6 py-4">Waktu Absen</th>
                                                <th className="px-6 py-4">Status Kehadiran</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {attendances.length === 0 ? (
                                                <tr><td colSpan="2" className="px-6 py-8 text-center text-slate-400 text-xs">Belum ada riwayat absen.</td></tr>
                                            ) : (
                                                attendances.map(abs => (
                                                    <tr key={abs.id}>
                                                        <td className="px-6 py-4 font-bold">{new Date(abs.created_at).toLocaleDateString('id-ID')}</td>
                                                        <td className="px-6 py-4"><span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700">Hadir</span></td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* JADWAL PELAYANAN UTAMA */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/40">
                                    <h5 className="text-base font-bold text-slate-900 dark:text-white">Agenda Jadwal Pelayanan GSM</h5>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-600 border-b border-slate-100">
                                                <th className="px-6 py-4">Tanggal Minggu</th>
                                                <th className="px-6 py-4">Pemimpin Pujian</th>
                                                <th className="px-6 py-4">Horong 1</th>
                                                <th className="px-6 py-4">Horong 2</th>
                                                <th className="px-6 py-4">Horong 3</th>
                                                <th className="px-6 py-4">Pemusik</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedules.map(sch => (
                                                <tr key={sch.id} className="text-sm">
                                                    <td className="px-6 py-4 font-bold text-teal-600">{sch.sunday_date}</td>
                                                    <td className="px-6 py-4">{sch.pujian?.name || '-'}</td>
                                                    <td className="px-6 py-4">{sch.horong1?.name || '-'}</td>
                                                    <td className="px-6 py-4">{sch.horong2?.name || '-'}</td>
                                                    <td className="px-6 py-4">{sch.horong3?.name || '-'}</td>
                                                    <td className="px-6 py-4">{sch.pemusik?.name || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ========================================================= */}
            {/* MODAL POP-UP UNTUK MELIHAT FOTO REALTIME GSM             */}
            {/* ========================================================= */}
            {activeSelfie && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="relative max-w-md w-full rounded-2xl bg-white p-4 shadow-2xl dark:bg-slate-800">
                        <div className="flex items-center justify-between mb-3">
                            <h6 className="text-sm font-bold text-slate-900 dark:text-white">Bukti Foto Kehadiran Lapangan</h6>
                            <button 
                                onClick={() => setActiveSelfie(null)}
                                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                Tutup ✕
                            </button>
                        </div>
                        <img 
                            src={activeSelfie} 
                            alt="Bukti Selfie GSM" 
                            className="w-full aspect-video object-cover rounded-xl border border-slate-100 dark:border-slate-700" 
                        />
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}