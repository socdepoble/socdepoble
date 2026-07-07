#!/usr/bin/env node
/**
 * backup.mjs
 * Impuls Nerviós associat a la Skill 'backup_recovery.md'.
 * Executa una còpia de seguretat termodinàmica (zip) dels Pilars Vigents.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { PILARS_VIGENTS } from './audit_estructura.mjs';
import { getTimestamp } from './lib/termodinamic.mjs';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WIKI_DIR = path.resolve(__dirname, '../../');
const BACKUP_DIR = path.join(WIKI_DIR, '04_ARXIU_Documents_Historics', 'backups');

export async function createBackup() {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const timestamp = getTimestamp();
  const backupName = `${timestamp}_ASSET_Backup_Complet.tar.gz`;
  const backupPath = path.join(BACKUP_DIR, backupName);

  // Només fem backup dels Pilars
  const pathsToBackup = PILARS_VIGENTS.join(' ');

  console.log(`[BACKUP] Iniciant compressió de: ${pathsToBackup}`);
  try {
    await execAsync(`tar -czf "${backupPath}" ${pathsToBackup}`, { cwd: WIKI_DIR });
    console.log(`✅ [BACKUP] Còpia completada: ${backupPath}`);
  } catch (error) {
    console.error(`❌ [BACKUP] Error creant còpia de seguretat:`, error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createBackup();
}
