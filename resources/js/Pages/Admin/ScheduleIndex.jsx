import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ScheduleIndex({ schedules, gsmUsers, chartData }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        sunday_date: '',
        pujian_id: '',
        horong1_id: '',
        horong2_id: '',
        horong3_id: '',
        pemusik_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.schedules.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            }
        });
    };

    // Mencari nilai tertinggi pelayanan untuk skala grafik
    const maxPelayanan = Math.max(...chartData.map(d => d.total_pelayanan), 1);
    const { delete: destroySchedule } = useForm();

    const handleDeleteSchedule = (id, date) => {
        if (confirm(`Apakah Anda yakin ingin membatalkan & menghapus seluruh jadwal pelayanan tanggal ${id}?`)) {
            destroySchedule(route('admin.schedules.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-slate-800 dark:text-slate-800">
                        Pusat Kendali Admin ➔ Penjadwalan Pelayanan
                    </h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-500 transition-all"
                    >
                        {showForm ? 'Tutup Formulir' : '+ Susun Jadwal Baru'}
                    </button>
                </div>
            }
        >
            <Head title="Susun Jadwal Pelayanan" />

            <div className="py-12 space-y-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {flash?.message && (
                        <div className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800 dark:bg-green-950/40 dark:text-green-200">
                            ✨ {flash.message}
                        </div>
                    )}

                    {/* 📋 POP-UP FORMULIR TAMBAH JADWAL */}
                    {showForm && (
                        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-transparent transition-all animate-fadeIn">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Ploting Petugas Hari Minggu</h3>
                            <form onSubmit={submit} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <InputLabel value="Pilih Tanggal Hari Minggu" />
                                    <input 
                                        type="date" 
                                        value={data.sunday_date}
                                        onChange={e => setData('sunday_date', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-300 bg-white px-3 py-2 text-slate-900 dark:bg-slate-900 dark:text-white"
                                        required
                                    />
                                    {errors.sunday_date && <p className="text-xs text-rose-500 mt-1">{errors.sunday_date}</p>}
                                </div>

                                {[['pujian_id', 'Pemimpin Pujian'], ['horong1_id', 'Guru Horong 1 (Kecil)'], ['horong2_id', 'Guru Horong 2 (Sedang)'], ['horong3_id', 'Guru Horong 3 (Besar)'], ['pemusik_id', 'Pemusik / Diaken']].map(([key, label]) => (
                                    <div key={key}>
                                        <InputLabel value={label} />
                                        <select
                                            value={data[key]}
                                            onChange={e => setData(key, e.target.value)}
                                            className="mt-1 block w-full rounded-xl border-slate-300 bg-white px-3 py-2 text-slate-900 dark:bg-slate-900 dark:text-white"
                                            required
                                        >
                                            <option value="">-- Pilih GSM Tugas --</option>
                                            {gsmUsers.map(gsm => (
                                                <option key={gsm.id} value={gsm.id}>{gsm.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}

                                <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <PrimaryButton className="rounded-xl bg-teal-600 hover:bg-teal-50" disabled={processing}>
                                        Simpan & Terbitkan Jadwal
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* 📅 TABEL DATA JADWAL */}
                    <div className="overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-100 dark:bg-slate-800 dark:border-transparent">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Log Agenda Penugasan</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-xs font-extrabold uppercase text-slate-700 border-b border-slate-100 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-700">
                                        <th className="px-6 py-4">Tanggal Ibadah</th>
                                        <th className="px-6 py-4">Pujian</th>
                                        <th className="px-6 py-4">Horong 1</th>
                                        <th className="px-6 py-4">Horong 2</th>
                                        <th className="px-6 py-4">Horong 3</th>
                                        <th className="px-6 py-4">Pemusik</th>
                                        <th className="px-6 py-4 text-center">Tindakan</th> {/* 👈 TAMBAHKAN INI */}
                                    </tr>
                                </thead>
                                
                                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-800 dark:divide-slate-700 dark:text-slate-200">
                                    {schedules.length === 0 ? (
                                        <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">Belum ada agenda penugasan disusun.</td></tr>
                                    ) : (
                                        schedules.map(sch => (
                                            <tr key={sch.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                                                <td className="px-6 py-4 font-bold text-teal-600 dark:text-teal-400">{new Date(sch.sunday_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                <td className="px-6 py-4">{sch.pujian?.name}</td>
                                                <td className="px-6 py-4">{sch.horong1?.name}</td>
                                                <td className="px-6 py-4">{sch.horong2?.name}</td>
                                                <td className="px-6 py-4">{sch.horong3?.name}</td>
                                                <td className="px-6 py-4">{sch.pemusik?.name}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="inline-flex items-center gap-3">
                                                        <Link
                                                            href={route('admin.schedules.edit', sch.id)}
                                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                                        >
                                                            Ubah
                                                        </Link>
                                                        <span className="text-slate-300 dark:text-slate-600">|</span>
                                                        <button
                                                            onClick={() => handleDeleteSchedule(sch.id, sch.sunday_date)}
                                                            className="text-xs font-bold text-rose-600 hover:text-rose-500 dark:text-rose-400"
                                                        >
                                                            Hapus
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

                    {/* ========================================================= */}
                    {/* 📊 GRAFIK LAPORAN AKUMULASI PELAYANAN GSM                 */}
                    {/* ========================================================= */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-transparent">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Grafik Tingkat Keaktifan Pelayanan GSM</h3>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">Akumulasi total penugasan miring pelayan (Pujian, Horong 1-3, Pemusik) dihitung otomatis dari database.</p>
                        </div>

                        {/* Rangkaian Grafik Batang Vertikal */}
                        <div className="mt-8 space-y-5">
                            {chartData.map((data, idx) => {
                                // Menghitung persentase lebar bar berdasarkan performa tugas tertinggi
                                const percentage = (data.total_pelayanan / maxPelayanan) * 100;
                                
                                return (
                                    <div key={idx} className="flex items-center gap-4">
                                        {/* Nama Guru (Lebar Tetap) */}
                                        <div className="w-32 sm:w-44 shrink-0 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                                            {data.name}
                                        </div>
                                        
                                        {/* Batang Grafik (Bar) */}
                                        <div className="grow bg-slate-100 dark:bg-slate-900 h-7 rounded-lg overflow-hidden flex items-center">
                                            <div 
                                                style={{ width: `${percentage}%` }}
                                                className="bg-gradient-to-r from-teal-500 to-teal-600 h-full rounded-lg transition-all duration-500 flex items-center justify-end px-3 min-w-[35px]"
                                            >
                                                {/* Angka Total Tepat di dalam Bar */}
                                                <span className="text-xs font-extrabold text-white">
                                                    {data.total_pelayanan}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Keterangan Satuan */}
                                        <div className="text-xs font-bold text-slate-400 shrink-0">
                                            Tugas
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}