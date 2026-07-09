import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
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

writeFileSync(resolve(process.cwd(), 'supabase/seed.sql'), sql);
