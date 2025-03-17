import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  server: {
    host: '0.0.0.0', // Wymusza nasłuchiwanie na wszystkich interfejsach
    port: 5173, // Port, który wystawiasz
    strictPort: true
  },
  plugins: [
    tailwindcss(),
  ],
})