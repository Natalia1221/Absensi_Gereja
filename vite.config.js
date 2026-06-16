import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // atau @vitejs/plugin-react

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
            // Jika ada konfigurasi ssr, biarkan saja
        }),
        react(),
    ],
    // 🛠️ TAMBAHKAN BLOK SERVER INI:
    server: {
        host: '0.0.0.0',
        hmr: {
            host: '192.168.1.11', // 👈 Isi dengan IP lokal laptop Anda
        },
    },
});