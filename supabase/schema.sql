create extension if not exists pgcrypto;

create table if not exists public.app_content (
  key text primary key,
  payload jsonb not null default '[]'::jsonb,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_threads (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id text primary key,
  owner_user_id text not null,
  thread_id text not null references public.chat_threads(id) on delete cascade,
  message_id text not null,
  text text not null,
  sender text not null,
  time_label text,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_chat_messages_owner_thread_message
  on public.chat_messages(owner_user_id, thread_id, message_id);

create index if not exists idx_chat_messages_owner_thread
  on public.chat_messages(owner_user_id, thread_id, created_at);

create table if not exists public.section_submissions (
  id uuid primary key default gen_random_uuid(),
  owner_user_id text not null,
  section_id text not null,
  title text not null,
  description text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_section_submissions_owner_section_created
  on public.section_submissions(owner_user_id, section_id, created_at desc);

create index if not exists idx_section_submissions_section_created
  on public.section_submissions(section_id, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_app_content_touch on public.app_content;
create trigger trg_app_content_touch
before update on public.app_content
for each row execute function public.touch_updated_at();

drop trigger if exists trg_chat_threads_touch on public.chat_threads;
create trigger trg_chat_threads_touch
before update on public.chat_threads
for each row execute function public.touch_updated_at();

alter table public.app_content enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.section_submissions enable row level security;

drop policy if exists "public read app_content" on public.app_content;
create policy "public read app_content"
on public.app_content
for select
to anon, authenticated
using (true);

drop policy if exists "public write app_content" on public.app_content;
drop policy if exists "public update app_content" on public.app_content;

drop policy if exists "public read chat_threads" on public.chat_threads;
create policy "public read chat_threads"
on public.chat_threads
for select
to anon, authenticated
using (true);

drop policy if exists "public write chat_threads" on public.chat_threads;
drop policy if exists "public update chat_threads" on public.chat_threads;

drop policy if exists "public read chat_messages" on public.chat_messages;
create policy "public read chat_messages"
on public.chat_messages
for select
to anon, authenticated
using (true);

drop policy if exists "public write chat_messages" on public.chat_messages;
create policy "public write chat_messages"
on public.chat_messages
for insert
to anon, authenticated
with check (
  owner_user_id is not null
  and owner_user_id <> ''
  and thread_id is not null
  and text is not null
  and text <> ''
  and sender in ('me', 'other')
);

drop policy if exists "public update chat_messages" on public.chat_messages;
drop policy if exists "public delete chat_messages" on public.chat_messages;

drop policy if exists "public read section_submissions" on public.section_submissions;
create policy "public read section_submissions"
on public.section_submissions
for select
to anon, authenticated
using (true);

drop policy if exists "public write section_submissions" on public.section_submissions;
create policy "public write section_submissions"
on public.section_submissions
for insert
to anon, authenticated
with check (
  owner_user_id is not null
  and owner_user_id <> ''
  and section_id in ('mur', 'mercat', 'events')
  and title is not null
  and title <> ''
  and payload is not null
);
