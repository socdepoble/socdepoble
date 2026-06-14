import { defineConfig } from "vite";
import tailwindStatic from "unplugin-tailwind-static/vite";

export default defineConfig({
  plugins: [
    tailwindStatic({
      outFile: "src/static.css",
      minify: true,
      extractUnused: true,
    }),
  ],
  build: {
    cssCodeSplit: false,
    cssTarget: "chrome61",
  },
});
