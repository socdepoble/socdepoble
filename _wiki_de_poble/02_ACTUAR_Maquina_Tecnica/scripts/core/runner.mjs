import { appendNdjson, SdpSafetyError } from './safety.mjs';
import { join, resolve } from 'node:path';

function serialiseError(err) {
  return {
    name: err?.name || 'Error',
    code: err?.code || 'ERROR',
    message: err?.message || String(err),
    data: err?.data || {},
    stack: process.env.SDP_DEBUG_STACK === '1' ? err?.stack : undefined
  };
}

export async function runCommand(command, options, handler) {
  const root = resolve(options.root || '.');
  const started = Date.now();

  try {
    const result = await handler({ ...options, root });
    const ok = result?.ok !== false;
    return {
      ok,
      summary: result?.summary || (ok ? `${command}: OK` : `${command}: FALLIT`),
      data: result?.data || {},
      errors: result?.errors || [],
      elapsedMs: Date.now() - started
    };
  } catch (err) {
    const error = serialiseError(err);
    await appendNdjson(join(root, '04_ARXIU_Documents_Historics/01_logs_termodinamics/errors.ndjson'), {
      event: 'command_error',
      command,
      error
    }).catch(() => {});

    return {
      ok: false,
      summary: err instanceof SdpSafetyError
        ? `[SDP-LOCK:${err.code}] ${err.message}`
        : `[FATAL] ${command}: ${err.message}`,
      data: {},
      errors: [error],
      elapsedMs: Date.now() - started
    };
  }
}
