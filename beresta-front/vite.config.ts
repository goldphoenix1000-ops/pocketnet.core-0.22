import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// [Server_Immunity_Specs] + [Ecosystem_Onboarding_Governor_Core]
// Конфигурация Vite с принудительным esbuild-контуром для обхода кэш-ошибок OXC
export default defineConfig({
  plugins: [react()],
  // Жестко принуждаем Vite использовать стандартный esbuild вместо капризного oxc
  esbuild: {
    target: 'es2022',
    include: /\.(ts|tsx|js|jsx)$/,
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        dead_code: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-core';
            return 'vendor-ext';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: false
    },
    allowedHosts: [
      'catty-crusader-armed.ngrok-free.dev'
    ],
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  }
});