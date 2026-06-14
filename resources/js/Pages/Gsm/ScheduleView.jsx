import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ScheduleView({ schedules }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-slate-900 dark:text-slate-100">
                        Agenda Penugasan Pelayanan GSM
                    </h2>
                    <Link href={route('dashboard')} className="text-xs font-bold text-teal-600 hover:underline">
                        ← Kembali ke Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Jadwal Pelayanan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    <div className="overflow-hidden rounded-2xl bg-white shadow-md border border-slate-100 dark:bg-slate-800 dark:border-transparent">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Kalender Ploting Petugas</h3>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">Silakan periksa nama Anda pada daftar pembagian horong mengajar di bawah ini.</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-xs font-extrabold uppercase text-slate-700 border-b border-slate-100 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-700">
                                        <th className="px-6 py-4">Tanggal Minggu</th>
                                        <th className="px-6 py-4">Pemimpin Pujian</th>
                                        <th className="px-6 py-4">Horong 1 (Kecil)</th>
                                        <th className="px-6 py-4">Horong 2 (Sedang)</th>
                                        <th className="px-6 py-4">Horong 3 (Besar)</th>
                                        <th className="px-6 py-4">Pemusik</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-800 dark:divide-slate-700 dark:text-slate-200">
                                    {schedules.length === 0 ? (
                                        <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">Belum ada jadwal pelayanan terbit.</td></tr>
                                    ) : (
                                        schedules.map(sch => (
                                            <tr key={sch.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                                                <td className="px-6 py-4 font-bold text-teal-600 dark:text-teal-400">
                                                    {new Date(sch.sunday_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4">{sch.pujian?.name || '-'}</td>
                                                <td className="px-6 py-4">{sch.horong1?.name || '-'}</td>
                                                <td className="px-6 py-4">{sch.horong2?.name || '-'}</td>
                                                <td className="px-6 py-4">{sch.horong3?.name || '-'}</td>
                                                <td className="px-6 py-4">{sch.pemusik?.name || '-'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}