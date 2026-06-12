import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ScheduleEdit({ schedule, gsmUsers }) {
    const { data, setData, put, processing, errors } = useForm({
        sunday_date: schedule.sunday_date,
        pujian_id: schedule.pujian_id,
        horong1_id: schedule.horong1_id,
        horong2_id: schedule.horong2_id,
        horong3_id: schedule.horong3_id,
        pemusik_id: schedule.pemusik_id,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.schedules.update', schedule.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-900 dark:text-slate-100">
                    Pusat Kendali Admin ➔ Sesuaikan Ploting Jadwal
                </h2>
            }
        >
            <Head title="Edit Jadwal Pelayanan" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-md dark:bg-slate-800">
                        
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ubah Susunan Petugas</h3>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Silakan sesuaikan kembali penugasan pelayan GSM untuk hari minggu yang dipilih.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
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

                            {[
                                ['pujian_id', 'Pemimpin Pujian'],
                                ['horong1_id', 'Guru Horong 1 (Kecil)'],
                                ['horong2_id', 'Guru Horong 2 (Sedang)'],
                                ['horong3_id', 'Guru Horong 3 (Besar)'],
                                ['pemusik_id', 'Pemusik / Diaken']
                            ].map(([key, label]) => (
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

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <Link
                                    href={route('admin.schedules.index')}
                                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400"
                                >
                                    Batal
                                </Link>
                                <PrimaryButton className="rounded-xl bg-teal-600 hover:bg-teal-500" disabled={processing}>
                                    Simpan Perubahan Jadwal
                                </PrimaryButton>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}