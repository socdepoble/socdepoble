import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { comlink } from "vite-plugin-comlink";
import { VitePWA } from "vite-plugin-pwa";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

function staticAssetsReload() {
  return {
    name: 'static-assets-reload',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.html') || file.endsWith('.md')) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(),
    staticAssetsReload(),
    comlink(),
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      devOptions: { enabled: false, type: 'module' },
      injectManifest: {
        maximumFileSizeToCacheInBytes: 100 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm,onnx}'],
        globIgnores: ['llibre-sencer.html', 'skills/**', 'assets/books/**']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Sóc de Poble',
        short_name: 'Sóc de Poble',
        description: 'La xarxa social rural sobirana. Connectant pobles, preservant memòria, bategant en comunitat.',
        theme_color: '#f97316',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      util: 'util/util.js'
    }
  },
  define: {
    '__APP_HASH__': JSON.stringify(process.env.VITE_APP_HASH || Date.now().toString(36))
  },
  optimizeDeps: {
    // Exclude PowerSync and its WebAssembly SQLite engine from Vite's pre-bundling optimizer
    // to prevent the internal `WASQLiteDB.worker.js` from throwing a 404 and timing out OPFS.
    exclude: [
      "@sqlite.org/sqlite-wasm",
      "onnxruntime-web",
      "@journeyapps/wa-sqlite",
      "@powersync/web",
      "@dashlane/pqc-kem-kyber768-wasm"
    ],
    // Explicit runtime dependencies to speed up HMR
    include: ["react-router-dom", "lucide-react", "axios"]
  },
  server: {
    host: true,
    port: 3333,
    strictPort: true,
    headers: {
      "Cache-Control":
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless",
    },
  },
  worker: {
    format: "es",
  },
  assetsInclude: ['**/*.wasm'],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["lucide-react"],
          data: ["@supabase/supabase-js"],
          utils: ["i18next", "react-i18next", "zod"],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.js"],
  },
});
