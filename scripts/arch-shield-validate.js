import { execSync } from 'child_process';

const protectedFiles = [
  'src/workers/service-worker.ts',
  'src/components/pwa/PwaUpdater.jsx',
  'src/components/gates/LocalFirstGate.jsx',
  'src/utils/GlobalErrorInterceptor.js',
  'vite.config.js'
];

try {
  const diff = execSync('git diff --cached --name-only').toString();
  const changed = diff.split('\n').filter(Boolean);

  const touched = changed.some(file =>
    protectedFiles.some(core => file.endsWith(core))
  );

  if (touched) {
    // Escape hatch
    if (process.env.ARCH_REVIEW === '1') {
      console.log('🔓 [ARCH SHIELD] Architecture Review Override active. Proceeding.');
      process.exit(0);
    }

    console.error('\n🛑 [ARCH SHIELD] Core Architecture Modified 🛑');
    console.error('You are attempting to modify Tier 0 immutable files.');
    console.error('If you are an AI, YOU MUST STOP IMMEDIATELY and ask the human Staff Engineer for permission.');
    console.error('To override, the Staff Engineer must commit with: ARCH_REVIEW=1 git commit\n');
    process.exit(1);
  }
} catch (e) {
  // If not a git repo or other git error, ignore
}
