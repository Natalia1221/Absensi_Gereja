import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function AttendancePortal() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);

    // Siapkan wadah pengiriman data Inertia Form
    const { data, setData, post, processing, errors } = useForm({
        latitude: '',
        longitude: '',
        selfie: '',
    });

    // 1. Pemicu Otomatis Ambil Lokasi GPS & Aktifkan Kamera saat halaman dibuka
    useEffect(() => {
        getGPSLocation();
        startWebcam();
        return () => stopWebcam();
    }, []);

    const getGPSLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Browser laptop/HP Anda tidak mendukung pendeteksian lokasi GPS.');
            return;
        }
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setLocationLoading(false);
            },
            (err) => {
                setLocationError('Gagal mendeteksi lokasi. Pastikan izin lokasi/GPS di HP Anda sudah diaktifkan.');
                setLocationLoading(false);
            },
            { enableHighAccuracy: true } // Memaksa akurasi GPS paling tajam
        );
    };

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user', width: 640, height: 480 } 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            alert('Aplikasi gagal mengakses kamera. Mohon berikan izin kamera pada browser Anda.');
        }
    };

    const stopWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    // 2. Fungsi Pembekuan Gambar Kamera (Take Snapshot)
    const captureSelfie = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            // 🛠️ Paksa resolusi canvas ke ukuran rendah (640x480) agar hemat memori di HP
            canvas.width = 640;
            canvas.height = 480;
            
            // 🚨 PROSES TRANSLASI & SCALE UNTUK EFEK MIRROR PADA CANVAS
            context.translate(canvas.width, 0); // Geser titik poros ke kanan ujung canvas
            context.scale(-1, 1);              // Balikkan bidang gambar horizontal (X) sebesar -1

            // Gambar video ke dalam canvas yang posisinya sudah terbalik seperti cermin
            context.drawImage(videoRef.current, 0, 0, 640, 480);
            
            // 🚨 KEMBALIKAN TRANSFORMAST CANVAS KE NORMAL (Penting agar tidak mengacaukan rendering berikutnya)
            context.setTransform(1, 0, 0, 1, 0, 0);
            
            // 🛠️ Kompres kualitas gambar menjadi 0.5 (50%) agar string teks Base64 menjadi sangat pendek
            const base64Image = canvas.toDataURL('image/jpeg', 0.5);
            
            // Simpan hasil kompresi ke state form
            setData('selfie', base64Image);
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        alert("Tombol berhasil diklik! Mengirim data ke Laravel...");

        if (!data.latitude || !data.longitude) {
            alert('Koordinat GPS belum siap. Mohon tunggu proses pelacakan lokasi selesai.');
            return;
        }
        if (!data.selfie) {
            alert('Silakan ambil foto selfie pelayanan Anda terlebih dahulu.');
            return;
        }

        axios.post('/gsm/attendances', { // 👈 Sesuaikan dengan rute POST absensimu
            user_id: data.user_id, // jika ini dari sisi admin
            latitude: data.latitude,
            longitude: data.longitude,
            selfie: data.selfie
        })
        .then(response => {
            alert("✨ LUAR BIASA! Data Absensi Berhasil Masuk Database!");
            window.location.href = '/dashboard'; //  PAKSA HALAMAN HP PINDAH LANGSUNG KE DASHBOARD UTAMA
        })
        .catch(error => {
            // Menampilkan pesan error spesifik dari Laravel jika ada
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Gagal mengirim. Detail Error: " + error.message);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-slate-900 dark:text-slate-100">
                        Portal Kamera Absensi Mandiri
                    </h2>
                    <Link href={route('dashboard')} className="text-xs font-bold text-teal-600 hover:underline">
                        ← Batal & Kembali
                    </Link>
                </div>
            }
        >
            <Head title="Verifikasi Absen GSM" />

            <div className="py-12">
                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        
                        {/* KOTAK STATUS GPS */}
                        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-transparent">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-2">📡 Status Sensor Geolocation</h5>
                            {locationLoading && <p className="text-xs text-blue-600 font-medium animate-pulse">Sedang mengunci koordinat GPS perangkat Anda...</p>}
                            {locationError && <p className="text-xs text-rose-500 font-semibold">⚠️ {locationError}</p>}
                            {data.latitude && (
                                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-0.5">
                                    <p>Latitude  : <span className="text-emerald-600 font-bold">{data.latitude}</span></p>
                                    <p>Longitude : <span className="text-emerald-600 font-bold">{data.longitude}</span></p>
                                    <p className="text-slate-400 font-sans mt-1 text-[10px]">✓ Koordinat berhasil dikunci untuk pengetesan batas radius geofence.</p>
                                </div>
                            )}
                        </div>

                        {/* KOTAK KAMERA WEBCAM / HP */}
                        <div className="overflow-hidden rounded-2xl bg-white shadow-md border border-slate-100 dark:bg-slate-800 dark:border-transparent p-6 text-center">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-4 text-left">📸 Ambil Foto Bukti Pelayanan</h5>
                            
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-700">
                                {/* Video Stream Aktif */}
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    className={`h-full w-full object-cover ${data.selfie ? 'hidden' : 'block'} scale-x-[-1]`}
                                />
                                
                                {/* Gambar Hasil Jepretan */}
                                {data.selfie && (
                                    <img src={data.selfie} className="h-full w-full object-cover" alt="Preview Selfie" />
                                )}
                            </div>

                            {/* Canvas Tersembunyi untuk Pemrosesan Gambar */}
                            <canvas ref={canvasRef} width="640" height="480" className="hidden" />

                            <div className="mt-4 flex justify-center gap-3">
                                {!data.selfie ? (
                                    <button
                                        type="button"
                                        onClick={captureSelfie}
                                        disabled={!cameraActive}
                                        className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40"
                                    >
                                        📷 Ambil Gambar Selfie
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setData('selfie', '')}
                                        className="rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-100"
                                    >
                                        🔄 Foto Ulang
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* TOMBOL SUBMIT FINAL */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing || locationLoading || !data.selfie}
                            className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-4 text-center text-sm font-bold text-white shadow-lg shadow-teal-600/10 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 transition-all"
                        >
                            {processing ? 'Memproses Validasi Jarak...' : '✓ Kirim & Kirim Absensi'}
                        </button>

                        {/* 🔍 KODE PELACAK ERROR TERSEMBUNYI */}
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-4 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-800 dark:bg-red-950/40 dark:text-red-200">
                                ⚠️ Absensi Gagal Dikirim karena:
                                <ul className="list-disc list-inside mt-1 font-medium">
                                    {Object.keys(errors).map((key) => (
                                        <li key={key} className="capitalize">{key}: {errors[key]}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}