import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({ registerType: 'autoUpdate' })
  ],
  server: {
    host: true,
    port: 3340,
    strictPort: true,
    watch: {
      ignored: ['**/.agents/**', '**/_wiki_de_poble/**', '**/.gemini/**', '**/scripts/**']
    }
  },
  build: {
    target: 'es2020'
  }
});
