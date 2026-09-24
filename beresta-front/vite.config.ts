import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// [UI_Living_Weather_Core] Конфигурация графического движка Ступени 1 и 2
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Включаем авто-сборку частиц Tailwind v4
  ],
})