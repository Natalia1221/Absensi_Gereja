import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateUser() {
    // Menggunakan helper form dari Inertia untuk mengontrol inputan
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone_number: '',
        role: 'gsm', // Nilai bawaan default awal
        password: '',
    });
    
    const handlePhoneChange = (e) => {
        // 1. Ambil inputan dan bersihkan dari karakter selain angka (menghapus spasi, strip, atau tanda +)
        let input = e.target.value.replace(/\D/g, '');

        // 2. Jika Admin mengetik awalan '08', otomatis ubah string-nya menjadi '628'
        if (input.startsWith('08')) {
            input = '62' + input.substring(1);
        }

        // 3. Masukkan hasil pembersihan ke dalam state data form
        setData('phone_number', input);
    };
    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => reset(), // Jika sukses, kosongkan kembali isi formulir
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800 dark:text-slate-800">
                    Manajemen Akun ➔ Tambah Pelayan Baru
                </h2>
            }
        >
            <Head title="Tambah Akun Pelayan" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-md dark:bg-slate-800">
                        
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Formulir Registrasi Internal</h3>
                            <p className="text-xs text-slate-500">Daftarkan akun resmi untuk Guru Sekolah Minggu (GSM) atau Pimpinan Jemaat.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Input Nama Lengkap */}
                            <div>
                                <InputLabel htmlFor="name" value="Nama Lengkap Pelayan" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full rounded-xl border-slate-200 dark:bg-slate-900"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Input Email Resmi */}
                            <div>
                                <InputLabel htmlFor="email" value="Alamat Email (Untuk Login)" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-xl border-slate-200 dark:bg-slate-900"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Input Nomor WhatsApp */}
                            <div>
                                <InputLabel htmlFor="phone_number" value="Nomor WhatsApp Aktif (Format WA)" />
                                <TextInput
                                    id="phone_number"
                                    type="text"
                                    name="phone_number"
                                    value={data.phone_number}
                                    className="mt-1 block w-full rounded-xl border-slate-200 dark:bg-slate-900"
                                    placeholder="Contoh: 081234567890 (Otomatis dikonversi ke 628...)" // 💡 Ubah placeholder agar informatif
                                    onChange={handlePhoneChange} // 👈 GANTI INI untuk memanggil fungsi handlePhoneChange
                                    required
                                />
                                {/* Menampilkan pesan error jika melanggar aturan aturan Regex backend */}
                                {errors.phone_number ? (
                                    <p className="text-xs text-rose-500 mt-1.5 font-semibold">⚠️ Nomor WA harus valid, contoh: 6281234567xxx (10-14 digit)</p>
                                ) : (
                                    <p className="text-[11px] text-slate-500 mt-1 font-medium">Sistem otomatis mengunci nomor ke format internasional untuk kebutuhan integrasi Blast WA Pengingat H-1.</p>
                                )}
                            </div>

                            {/* Pilihan Dropdown Tingkatan Hak Akses (Role) */}
                            <div>
                                <InputLabel htmlFor="role" value="Hak Akses Sistem (Role)" />
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    className="mt-1 block w-full rounded-xl border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    onChange={(e) => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="gsm">Guru Sekolah Minggu (GSM)</option>
                                    <option value="pimpinan">Pimpinan Horong / Gereja</option>
                                    <option value="admin">Administrator Sistem</option>
                                </select>
                                <InputError message={errors.role} className="mt-1" />
                            </div>

                            {/* Input Password Sementara */}
                            <div>
                                <InputLabel htmlFor="password" value="Kata Sandi Sementara" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-xl border-slate-200 dark:bg-slate-900"
                                    placeholder="Minimal 8 karakter"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* Tombol Eksekusi */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Batal
                                </Link>
                                <PrimaryButton className="rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Daftarkan Akun'}
                                </PrimaryButton>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}