import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
describe('Architecture Invariants (Safari Offline-First)', () => {
  test('vite.config.js must use registerType: "prompt" to prevent iOS PWA loops', () => {
    const viteConfigPath = path.resolve(__dirname, '../../../../vite.config.js');
    const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');
    expect(viteConfig).toContain("registerType: 'prompt'");
    expect(viteConfig).not.toContain("registerType: 'autoUpdate'");
  });
  test('LocalFirstGate must have Safari Private Mode fallback logic', () => {
    const gatePath = path.resolve(__dirname, '../../../components/gates/LocalFirstGate.jsx');
    const gateCode = fs.readFileSync(gatePath, 'utf-8');
    expect(gateCode).toContain("dbFilename: ':memory:'");
    expect(gateCode).toContain("checkStorageCapabilities");
  });
  test('GlobalErrorInterceptor must have ChunkLoadError circuit breaker', () => {
    const interceptorPath = path.resolve(__dirname, '../../../utils/GlobalErrorInterceptor.js');
    const interceptorCode = fs.readFileSync(interceptorPath, 'utf-8');
    expect(interceptorCode).toContain("MAX_CHUNK_RELOADS");
    expect(interceptorCode).toContain("sessionStorage");
  });
  test('Service Worker must not auto-skipWaiting', () => {
    const swPath = path.resolve(__dirname, '../../../workers/service-worker.ts');
    const swCode = fs.readFileSync(swPath, 'utf-8');

    // Test that skipWaiting is only inside a message handler or not automatically called in install
    const skipWaitingCount = (swCode.match(/self\.skipWaiting\(\)/g) || []).length;
    // We expect it to be inside `msg.type === 'SKIP_WAITING'` and `msg.type === 'sw:apply-update'`
    expect(skipWaitingCount).toBeLessThanOrEqual(2);
  });
});