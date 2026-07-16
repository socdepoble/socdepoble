import { randomUUID } from 'node:crypto';
import {
  closeSync,
  constants as fsConstants,
  fchmodSync,
  fstatSync,
  fsyncSync,
  lstatSync,
  openSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { claimReceiptForMutation, completeMutationClaim } from '../_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/reflex_petorreta.mjs';
import {
  APP_CONTENT_ROWS,
  APP_SEED_VERSION,
  CHAT_MESSAGE_SEED,
  CHAT_THREADS
} from '../src/data/appSeed.js';

function toSqlText(value) {
  if (value == null) return 'null';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function toSqlJson(value) {
  return `${toSqlText(JSON.stringify(value))}::jsonb`;
}

function toIsoFromSeed(message) {
  return new Date(1700000000000 + (message.createdAtTs || 0) * 1000).toISOString();
}

function targetMode(target) {
  try {
    const stat = lstatSync(target);
    if (!stat.isFile() || stat.nlink !== 1) {
      throw new Error(`El target no és un fitxer regular amb identitat exclusiva: ${target}`);
    }
    return stat.mode & 0o777;
  } catch (error) {
    if (error.code === 'ENOENT') return 0o644;
    throw error;
  }
}

function atomicWriteFile(target, content) {
  const directory = dirname(target);
  const temporary = resolve(
    directory,
    `.${basename(target)}.${process.pid}.${randomUUID()}.tmp`,
  );
  let fileDescriptor;
  let directoryDescriptor;
  let renamed = false;

  try {
    fileDescriptor = openSync(
      temporary,
      fsConstants.O_CREAT | fsConstants.O_EXCL | fsConstants.O_WRONLY,
      0o600,
    );
    const temporaryStat = fstatSync(fileDescriptor);
    if (!temporaryStat.isFile() || temporaryStat.nlink !== 1) {
      throw new Error(`El temporal no té identitat física exclusiva: ${temporary}`);
    }

    writeFileSync(fileDescriptor, content, { encoding: 'utf8' });
    fchmodSync(fileDescriptor, targetMode(target));
    fsyncSync(fileDescriptor);
    closeSync(fileDescriptor);
    fileDescriptor = undefined;

    renameSync(temporary, target);
    renamed = true;

    directoryDescriptor = openSync(directory, fsConstants.O_RDONLY);
    fsyncSync(directoryDescriptor);
  } finally {
    if (fileDescriptor !== undefined) closeSync(fileDescriptor);
    if (directoryDescriptor !== undefined) closeSync(directoryDescriptor);
    if (!renamed) {
      try {
        unlinkSync(temporary);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
  }
}

const appContentValues = APP_CONTENT_ROWS.map(
  (row) => `  (${toSqlText(row.key)}, ${toSqlJson(row.payload)}, ${row.version ?? APP_SEED_VERSION})`
).join(',\n');

const chatThreadValues = CHAT_THREADS.map(
  (thread) => `  (${toSqlText(thread.id)}, ${toSqlJson(thread)})`
).join(',\n');

const chatMessageValues = CHAT_MESSAGE_SEED.map(
  (message) =>
    `  (${toSqlText(message.id)}, ${toSqlText(message.ownerUserId)}, ${toSqlText(message.threadId)}, ${toSqlText(message.messageId)}, ${toSqlText(message.text)}, ${toSqlText(message.sender)}, ${toSqlText(message.time)}, ${toSqlText(toIsoFromSeed(message))})`
).join(',\n');

const sql = `-- Generated automatically by scripts/generate-supabase-seed.mjs
begin;

insert into public.app_content (key, payload, version)
values
${appContentValues}
on conflict (key) do update
set payload = excluded.payload,
    version = excluded.version,
    updated_at = now();

insert into public.chat_threads (id, payload)
values
${chatThreadValues}
on conflict (id) do update
set payload = excluded.payload,
    updated_at = now();

insert into public.chat_messages (
  id,
  owner_user_id,
  thread_id,
  message_id,
  text,
  sender,
  time_label,
  created_at
)
values
${chatMessageValues}
on conflict (id) do update
set owner_user_id = excluded.owner_user_id,
    thread_id = excluded.thread_id,
    message_id = excluded.message_id,
    text = excluded.text,
    sender = excluded.sender,
    time_label = excluded.time_label,
    created_at = excluded.created_at;

commit;
`;

const receiptArg = process.argv.slice(2).find((arg) => arg.startsWith('--receipt='));
if (!receiptArg) throw new Error('Falta --receipt=<lease Reflex> per a supabase-seed.');
const target = resolve(process.cwd(), 'supabase/seed.sql');
const claim = await claimReceiptForMutation({
  receiptPath: resolve(receiptArg.slice('--receipt='.length)),
  operation: 'supabase-seed',
  targets: [target],
  checkDirty: true,
});
atomicWriteFile(target, sql);
await completeMutationClaim({
  receiptPath: resolve(receiptArg.slice('--receipt='.length)),
  operation: 'supabase-seed',
}, claim.claimToken);
