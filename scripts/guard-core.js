import fs from 'fs';

const protectedFiles = [
  { path: 'src/workers/service-worker.ts', minSize: 1000 },
  { path: 'vite.config.js', minSize: 1500 },
  { path: 'src/utils/GlobalErrorInterceptor.js', minSize: 300 }
];

let failed = false;

for (const file of protectedFiles) {
  try {
    const stats = fs.statSync(file.path);
    if (stats.size < file.minSize) {
      console.error(`🛑 [ARCH SHIELD] Logic Density Alert: ${file.path} is too small (${stats.size} bytes). Minimum is ${file.minSize}. An AI may have hollowed it out.`);
      failed = true;
    }
  } catch (e) {
    console.error(`🛑 [ARCH SHIELD] Missing Core File: ${file.path}`);
    failed = true;
  }
}

if (failed) {
  console.error('\nArchitecture check failed. Build aborted.');
  process.exit(1);
} else {
  console.log('✅ [ARCH SHIELD] Core files logic density validated.');
}
