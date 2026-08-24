create extension if not exists pgcrypto;

create table if not exists public.towns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.town_memberships (
  town_id uuid not null references public.towns(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (town_id, user_id)
);

create table if not exists public.app_content (
  tenant_id uuid not null references public.towns(id) on delete cascade,
  key text not null,
  payload jsonb not null default '[]'::jsonb,
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, key)
);

create table if not exists public.chat_threads (
  id text primary key,
  tenant_id uuid not null references public.towns(id) on delete cascade,
  owner_user_id uuid not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id text primary key,
  tenant_id uuid not null references public.towns(id) on delete cascade,
  owner_user_id uuid not null,
  thread_id text not null references public.chat_threads(id) on delete cascade,
  message_id text not null,
  text text not null,
  sender text not null,
  time_label text,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_chat_messages_owner_thread_message
  on public.chat_messages(tenant_id, owner_user_id, thread_id, message_id);

create index if not exists idx_chat_messages_owner_thread
  on public.chat_messages(tenant_id, owner_user_id, thread_id, created_at);

create table if not exists public.section_submissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.towns(id) on delete cascade,
  owner_user_id uuid not null,
  section_id text not null,
  title text not null,
  description text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_section_submissions_tenant_section_created
  on public.section_submissions(tenant_id, section_id, created_at desc);

-- Extra indexes recommended by Grok for tenant isolation performance
create index if not exists idx_app_content_tenant on public.app_content(tenant_id, key);
create index if not exists idx_chat_threads_tenant on public.chat_threads(tenant_id, owner_user_id);
create index if not exists idx_chat_messages_tenant on public.chat_messages(tenant_id, thread_id);

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

alter table public.towns enable row level security;
alter table public.town_memberships enable row level security;
alter table public.app_content enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.section_submissions enable row level security;

-- Policies for towns
drop policy if exists "public read towns" on public.towns;
create policy "public read towns" on public.towns for select using (true);

-- Policies for town_memberships
drop policy if exists "user read own memberships" on public.town_memberships;
create policy "user read own memberships" on public.town_memberships for select
to authenticated using (user_id = auth.uid());

drop policy if exists "user insert own membership" on public.town_memberships;
create policy "user insert own membership" on public.town_memberships for insert
to authenticated with check (user_id = auth.uid());

-- Policies for app_content
drop policy if exists "public read app_content" on public.app_content;
create policy "public read app_content" on public.app_content for select using (true);

-- Policies for chat_threads
drop policy if exists "private read chat_threads" on public.chat_threads;
create policy "private read chat_threads" on public.chat_threads for select to authenticated
using (owner_user_id = auth.uid() and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = auth.uid()));

drop policy if exists "private write chat_threads" on public.chat_threads;
create policy "private write chat_threads" on public.chat_threads for insert to authenticated
with check (owner_user_id = auth.uid() and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = auth.uid()));

drop policy if exists "private update chat_threads" on public.chat_threads;
create policy "private update chat_threads" on public.chat_threads for update to authenticated
using (owner_user_id = auth.uid() and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = auth.uid()))
with check (owner_user_id = auth.uid() and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = auth.uid()));

drop policy if exists "private delete chat_threads" on public.chat_threads;
create policy "private delete chat_threads" on public.chat_threads for delete to authenticated
using (owner_user_id = auth.uid() and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = auth.uid()));

-- Policies for chat_messages
drop policy if exists "private read chat_messages" on public.chat_messages;
create policy "private read chat_messages" on public.chat_messages for select to authenticated
using (owner_user_id = auth.uid() and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = auth.uid()));

drop policy if exists "private write chat_messages" on public.chat_messages;
create policy "private write chat_messages" on public.chat_messages for insert to authenticated
with check (
  owner_user_id = auth.uid() 
  and thread_id is not null 
  and text is not null 
  and text <> '' 
  and sender in ('me', 'other')
  and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = auth.uid())
);

-- Policies for section_submissions
drop policy if exists "public read section_submissions" on public.section_submissions;
create policy "public read section_submissions" on public.section_submissions for select using (true);

drop policy if exists "private write section_submissions" on public.section_submissions;
create policy "private write section_submissions" on public.section_submissions for insert to authenticated
with check (
  owner_user_id = auth.uid() 
  and section_id in ('mur', 'mercat', 'events') 
  and title is not null 
  and title <> '' 
  and payload is not null
  and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = auth.uid())
);

drop policy if exists "private update section_submissions" on public.section_submissions;
create policy "private update section_submissions" on public.section_submissions for update to authenticated
using (owner_user_id = auth.uid() and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = auth.uid()))
with check (owner_user_id = auth.uid() and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = auth.uid()));

drop policy if exists "private delete section_submissions" on public.section_submissions;
create policy "private delete section_submissions" on public.section_submissions for delete to authenticated
using (owner_user_id = auth.uid() and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = auth.uid()));
