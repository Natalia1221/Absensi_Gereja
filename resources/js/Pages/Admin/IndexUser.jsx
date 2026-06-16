import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function IndexUser({ users }) {
    const { flash } = usePage().props;
    const { delete: destroy } = useForm();

    // Fungsi Pengaman: Memunculkan kotak peringatan sebelum menghapus data
    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus akun resmi pelayanan atas nama "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
            destroy(route('admin.users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-slate-800 dark:text-slate-800">
                        Pusat Kendali Admin ➔ Daftar Pelayan GSM
                    </h2>
                    <Link
                        href={route('admin.users.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-500/10 hover:bg-teal-500 transition-all"
                    >
                        + Tambah Pelayan Baru
                    </Link>
                </div>
            }
        >
            <Head title="Daftar Akun Pelayan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Notifikasi Flash Sukses Update/Hapus Data */}
                    {flash?.message && (
                        <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800 shadow-xs dark:bg-green-950/40 dark:text-green-200">
                            ✨ {flash.message}
                        </div>
                    )}

                    <div className="overflow-hidden rounded-2xl bg-white shadow-md border border-slate-100 dark:bg-slate-800 dark:border-transparent">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Data Akun Terdaftar</h3>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">Berikut adalah daftar seluruh akun resmi pelayan jemaat saat ini.</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-xs font-extrabold uppercase tracking-wider text-slate-700 border-b border-slate-100 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-700">
                                        <th className="px-6 py-4">No</th>
                                        <th className="px-6 py-4">Nama Lengkap</th>
                                        <th className="px-6 py-4">Alamat Email</th>
                                        <th className="px-6 py-4">Nomor WhatsApp</th>
                                        <th className="px-6 py-4 text-center">Role</th>
                                        <th className="px-6 py-4 text-center">Tindakan</th> {/* 👈 Kolom Baru */}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-800 dark:divide-slate-700 dark:text-slate-200">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-slate-500">Belum ada data.</td>
                                        </tr>
                                    ) : (
                                        users.map((user, index) => (
                                            <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/30 transition-colors">
                                                <td className="px-6 py-4 text-slate-500 font-normal">{index + 1}</td>
                                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{user.name}</td>
                                                <td className="px-6 py-4 font-normal text-slate-600 dark:text-slate-400">{user.email}</td>
                                                <td className="px-6 py-4 text-slate-900 dark:text-white">{user.phone_number || <span className="text-xs italic text-slate-400">Tidak ada</span>}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-block uppercase text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-md ${
                                                        user.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' : 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                {/* TOMBOL AKSI EDIT & HAPUS */}
                                                <td className="px-6 py-4 text-center">
                                                    <div className="inline-flex items-center gap-3">
                                                        {/* Tombol Edit */}
                                                        <Link
                                                            href={route('admin.users.edit', user.id)}
                                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                                        >
                                                            Ubah
                                                        </Link>
                                                        
                                                        <span className="text-slate-300 dark:text-slate-600">|</span>

                                                        {/* Tombol Hapus */}
                                                        <button
                                                            onClick={() => handleDelete(user.id, user.name)}
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

                </div>
            </div>
        </AuthenticatedLayout>
    );
}