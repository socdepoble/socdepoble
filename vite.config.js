import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { comlink } from "vite-plugin-comlink";
import { VitePWA } from "vite-plugin-pwa";
import wasm from "vite-plugin-wasm";

import { mediaApiPlugin } from "./scripts/vite-media-api.js";

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

function versionContractPlugin() {
  const versionData = JSON.stringify({
    version: process.env.VITE_APP_HASH || Date.now().toString(36),
    hash: process.env.VITE_APP_HASH || Date.now().toString(36),
    timestamp: new Date().toISOString()
  });

  return {
    name: 'version-contract',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/version.json')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(versionData);
        } else {
          next();
        }
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: versionData
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    versionContractPlugin(),
    mediaApiPlugin(),
    wasm(),
    staticAssetsReload(),
    comlink(),
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'prompt',
      injectRegister: false,
      devOptions: { enabled: false, type: 'module' },
      injectManifest: {
        rollupFormat: 'es',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,mp3}'],
        globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js', '**/*.worker*.js', '**/*.wasm', '**/*.map', '**/.*', 'llibres/**', 'skills/**', 'assets/books/**', 'assets/uploads/**', '**/*.onnx'],
        navigateFallback: '/index.html',
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /.*\.(?:worker-.*\.js|wasm)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'wasm-worker-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          }
        ]
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
    watch: {
      ignored: ['**/public/**']
    },
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
    target: 'esnext',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["lucide-react"],
          data: ["@supabase/supabase-js", "idb-keyval"],
          utils: ["i18next", "react-i18next", "zod"],
          calendar: ["@fullcalendar/core", "@fullcalendar/react", "@fullcalendar/daygrid", "@fullcalendar/timegrid", "@fullcalendar/list", "@fullcalendar/interaction"],
          editor: ["@tiptap/react", "@tiptap/starter-kit", "@tiptap/extension-color", "@tiptap/extension-text-style", "@tiptap/extension-link", "@tiptap/extension-image", "@tiptap/extension-text-align", "@tiptap/extension-underline", "@tiptap/extension-list-item"],
          maps: ["react-leaflet", "leaflet"],
          auth: ["@react-oauth/google"]
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
