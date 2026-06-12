import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Masuk Akun - Absensi GSM" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">
                
                {/* Tombol Kembali ke Halaman Utama */}
                <div className="absolute top-6 left-6">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Kembali
                    </Link>
                </div>

                {/* Kotak Utama Formulir Login */}
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none">
                    
                    {/* Header Login Tema Gereja */}
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                            {/* Ikon Alkitab / Salib Simpel */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.003 9.003 0 0 1 8.716 2.253M12 3a9.003 9.003 0 0 0-8.716 2.253M12 12h.008v.008H12V12Z" />
                            </svg>
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                            Portal Masuk GSM
                        </h2>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Silakan masukkan akun resmi pelayanan yang telah didaftarkan oleh Admin.
                        </p>
                    </div>

                    {status && (
                        <div className="mt-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
                            {status}
                        </div>
                    )}

                    {/* Form Input */}
                    <form onSubmit={submit} className="mt-6 space-y-5">
                        
                        {/* Input Email */}
                        <div>
                            <InputLabel htmlFor="email" value="Alamat Email Resmi" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full rounded-xl border-slate-200 shadow-xs focus:border-teal-500 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1.5" />
                        </div>

                        {/* Input Password */}
                        <div>
                            <div className="flex items-center justify-between">
                                <InputLabel htmlFor="password" value="Kata Sandi" />
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full rounded-xl border-slate-200 shadow-xs focus:border-teal-500 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-1.5" />
                        </div>

                        {/* Ingat Saya (Remember Me) */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center select-none">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded-sm border-slate-300 text-teal-600 shadow-xs focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900"
                                />
                                <span className="ms-2 text-xs text-slate-500 dark:text-slate-400">
                                    Ingat akun saya di HP ini
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
                                >
                                    Lupa sandi?
                                </Link>
                            )}
                        </div>

                        {/* Tombol Submit */}
                        <div className="pt-2">
                            <PrimaryButton 
                                className="flex w-full justify-center rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-md shadow-teal-500/10 hover:bg-teal-500 focus:bg-teal-500 active:bg-teal-700" 
                                disabled={processing}
                            >
                                {processing ? 'Memproses Masuk...' : 'Masuk Log Pelayanan'}
                            </PrimaryButton>
                        </div>
                    </form>

                    {/* Pesan Bantuan Istimewa */}
                    <div className="mt-6 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-400 dark:bg-slate-900/40 dark:text-slate-500">
                        Mengalami kendala login? Hubungi Sekretariat atau Admin Database Horong Gereja.
                    </div>
                </div>
            </div>
        </>
    );
}