create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

-- 1. TABLES
create table if not exists public.towns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.towns add column if not exists is_open boolean not null default true;

create table if not exists public.town_memberships (
  town_id uuid not null references public.towns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (town_id, user_id)
);

create index if not exists idx_town_memberships_user_id
  on public.town_memberships(user_id);

create table if not exists public.app_content (
  tenant_id uuid not null references public.towns(id) on delete cascade,
  key text not null,
  payload jsonb not null default '[]'::jsonb,
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, key)
);

create table if not exists public.chat_threads (
  id text not null,
  tenant_id uuid not null references public.towns(id) on delete cascade,
  owner_user_id uuid not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, id)
);

create table if not exists public.chat_messages (
  id text not null,
  tenant_id uuid not null references public.towns(id) on delete cascade,
  owner_user_id uuid not null,
  thread_id text not null,
  message_id text not null,
  text text not null,
  sender text not null,
  time_label text,
  created_at timestamptz not null default now(),
  primary key (tenant_id, id),
  foreign key (tenant_id, thread_id) references public.chat_threads(tenant_id, id) on delete cascade
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

create index if not exists idx_app_content_tenant on public.app_content(tenant_id, key);
create index if not exists idx_chat_threads_tenant on public.chat_threads(tenant_id, owner_user_id);
create index if not exists idx_chat_messages_tenant on public.chat_messages(tenant_id, thread_id);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 1 and 120),
  visibility text not null default 'private' check (visibility = 'private'),
  consentiment_rgpd_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists visibility text not null default 'private' check (visibility = 'private');
alter table public.profiles add column if not exists consentiment_rgpd_at timestamptz not null default now();

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.towns(id) on delete restrict,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  kind text not null check (kind in ('company', 'group', 'entity', 'city_hall')),
  parent_organization_id uuid,
  lema text not null default '' check (char_length(lema) <= 120),
  description text not null default '' check (char_length(description) <= 500),
  visibility text not null default 'public' check (visibility in ('public', 'members')),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug),
  unique (tenant_id, id),
  foreign key (tenant_id, parent_organization_id)
    references public.organizations(tenant_id, id) on delete restrict,
  check (
    kind = 'group' or parent_organization_id is null
  )
);
alter table public.organizations add column if not exists parent_organization_id uuid references public.organizations(id) on delete restrict;
alter table public.organizations add column if not exists lema text not null default '' check (char_length(lema) <= 120);
alter table public.organizations add column if not exists visibility text not null default 'public' check (visibility in ('public', 'members'));
alter table public.organizations add column if not exists created_by uuid references public.profiles(id) on delete restrict;

alter table public.section_submissions add column if not exists author_org_id uuid references public.organizations(id) on delete cascade;

create table if not exists public.organization_memberships (
  organization_id uuid not null,
  tenant_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id),
  foreign key (tenant_id, organization_id)
    references public.organizations(tenant_id, id) on delete cascade
);

create unique index if not exists idx_organization_memberships_one_owner
  on public.organization_memberships(organization_id)
  where role = 'owner';

create index if not exists idx_organizations_tenant_kind
  on public.organizations(tenant_id, kind, created_at desc);

create index if not exists idx_organization_memberships_user
  on public.organization_memberships(user_id, tenant_id, organization_id);

create index if not exists idx_organizations_created_by
  on public.organizations(created_by);

create index if not exists idx_organizations_parent
  on public.organizations(parent_organization_id);

create index if not exists idx_section_submissions_author_org
  on public.section_submissions(author_org_id);

-- 2. FUNCTIONS
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.trg_force_submission_author() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_author_name text;
begin
  if new.author_org_id is not null then
    select name into v_author_name from public.organizations where id = new.author_org_id;
  else
    select full_name into v_author_name from public.profiles where id = new.owner_user_id;
  end if;
  
  if v_author_name is not null then
    new.payload = jsonb_set(new.payload, '{author_name}', to_jsonb(v_author_name));
  end if;
  
  return new;
end;
$$;

create or replace function public.sdp_protegeix_propietari() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if old.role = 'owner' and not exists (
    select 1 from public.organization_memberships m
    where m.organization_id = old.organization_id and m.role = 'owner' and m.user_id <> old.user_id
  ) then
    raise exception 'SDP-LOCK: última propietària. Transfereix la propietat abans d''eixir o eliminar.' using errcode = '23503';
  end if;
  if tg_op = 'UPDATE' then return new; end if;
  return old;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      nullif(left(btrim(new.raw_user_meta_data ->> 'name'), 120), ''),
      'Persona'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon, authenticated;

create or replace function private.is_organization_member(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = p_organization_id
      and membership.user_id = (select auth.uid())
  );
$$;

create or replace function private.can_manage_organization(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = p_organization_id
      and membership.user_id = (select auth.uid())
      and membership.role in ('owner', 'admin')
  );
$$;

create or replace function private.is_town_member(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from public.town_memberships membership
    where membership.town_id = p_tenant_id
      and membership.user_id = (select auth.uid())
  );
$$;

create or replace function private.can_create_group(
  p_parent_organization_id uuid,
  p_tenant_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and (
    p_parent_organization_id is null or exists (
      select 1
      from public.organizations parent
      join public.organization_memberships membership
        on membership.organization_id = parent.id
       and membership.tenant_id = parent.tenant_id
      where parent.id = p_parent_organization_id
        and parent.tenant_id = p_tenant_id
        and parent.kind in ('company', 'entity', 'city_hall')
        and membership.user_id = (select auth.uid())
        and membership.role in ('owner', 'admin')
    )
  );
$$;

revoke execute on function private.is_organization_member(uuid) from public;
revoke execute on function private.is_organization_member(uuid) from anon;
revoke execute on function private.can_manage_organization(uuid) from public;
revoke execute on function private.can_manage_organization(uuid) from anon;
revoke execute on function private.is_town_member(uuid) from public;
revoke execute on function private.is_town_member(uuid) from anon;
revoke execute on function private.can_create_group(uuid, uuid) from public;
revoke execute on function private.can_create_group(uuid, uuid) from anon;
grant execute on function private.is_organization_member(uuid) to authenticated;
grant execute on function private.can_manage_organization(uuid) to authenticated;
grant execute on function private.is_town_member(uuid) to authenticated;
grant execute on function private.can_create_group(uuid, uuid) to authenticated;

create or replace function private.add_organization_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.organization_memberships (
    organization_id,
    tenant_id,
    user_id,
    role
  ) values (
    new.id,
    new.tenant_id,
    new.created_by,
    'owner'
  );
  return new;
end;
$$;

revoke execute on function private.add_organization_owner() from public;
revoke execute on function private.add_organization_owner() from anon, authenticated;

create or replace function public.create_organization(
  p_tenant_id uuid,
  p_kind text,
  p_name text,
  p_slug text,
  p_lema text default '',
  p_description text default '',
  p_parent_organization_id uuid default null
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_name text := left(btrim(coalesce(p_name, '')), 120);
  v_slug text := lower(btrim(coalesce(p_slug, '')));
  v_lema text := left(btrim(coalesce(p_lema, '')), 120);
  v_description text := left(btrim(coalesce(p_description, '')), 500);
  v_organization record;
begin
  if v_user_id is null then
    raise exception 'Cal iniciar sessió per crear una organització.' using errcode = '42501';
  end if;

  if p_kind is null or p_kind not in ('company', 'group', 'entity', 'city_hall') then
    raise exception 'El tipus d’organització no és vàlid.' using errcode = '22023';
  end if;

  if char_length(v_name) < 2 or v_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'El nom o l’identificador de l’organització no és vàlid.' using errcode = '22023';
  end if;

  if not exists (select 1 from public.towns town where town.id = p_tenant_id) then
    raise exception 'El poble indicat no existeix.' using errcode = '22023';
  end if;

  if p_kind in ('company', 'entity', 'city_hall') and p_parent_organization_id is not null then
    raise exception 'Aquesta organització no pot tindre una organització mare.' using errcode = '22023';
  end if;

  if p_kind = 'group'
    and not (select private.can_create_group(p_parent_organization_id, p_tenant_id))
  then
    raise exception 'El grup necessita una empresa mare que pugues administrar.' using errcode = '42501';
  end if;

  insert into public.profiles (id, full_name, visibility)
  values (
    v_user_id,
    coalesce(
      nullif(left(btrim((select auth.jwt()) -> 'user_metadata' ->> 'name'), 120), ''),
      'Persona'
    ),
    'private'
  )
  on conflict (id) do nothing;

  insert into public.town_memberships (town_id, user_id, role)
  values (p_tenant_id, v_user_id, 'member')
  on conflict (town_id, user_id) do nothing;

  select
    organization.id,
    organization.tenant_id,
    organization.slug,
    organization.name,
    organization.kind,
    organization.parent_organization_id,
    organization.lema,
    organization.description,
    organization.visibility,
    organization.created_at,
    organization.updated_at
  into v_organization
  from public.organizations organization
  where organization.tenant_id = p_tenant_id
    and organization.slug = v_slug;

  if found then
    if v_organization.kind <> p_kind
      or v_organization.parent_organization_id is distinct from p_parent_organization_id
      or not (select private.can_manage_organization(v_organization.id))
    then
      raise exception 'L’identificador ja pertany a una altra organització.' using errcode = '23505';
    end if;
    return to_jsonb(v_organization);
  end if;

  insert into public.organizations (
    tenant_id,
    slug,
    name,
    kind,
    parent_organization_id,
    lema,
    description,
    visibility,
    created_by
  ) values (
    p_tenant_id,
    v_slug,
    v_name,
    p_kind,
    p_parent_organization_id,
    v_lema,
    v_description,
    'public',
    v_user_id
  )
  returning
    id,
    tenant_id,
    slug,
    name,
    kind,
    parent_organization_id,
    description,
    visibility,
    created_at,
    updated_at
  into v_organization;

  return to_jsonb(v_organization);
end;
$$;

revoke execute on function public.create_organization(uuid, text, text, text, text, text, uuid) from public;
revoke execute on function public.create_organization(uuid, text, text, text, text, text, uuid) from anon;
grant execute on function public.create_organization(uuid, text, text, text, text, text, uuid) to authenticated;

create or replace function public.list_my_organizations(p_tenant_id uuid)
returns table (
  id uuid,
  tenant_id uuid,
  slug text,
  name text,
  kind text,
  parent_organization_id uuid,
  lema text,
  description text,
  visibility text,
  role text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    organization.id,
    organization.tenant_id,
    organization.slug,
    organization.name,
    organization.kind,
    organization.parent_organization_id,
    organization.description,
    organization.visibility,
    membership.role,
    organization.created_at,
    organization.updated_at
  from public.organization_memberships membership
  join public.organizations organization
    on organization.id = membership.organization_id
   and organization.tenant_id = membership.tenant_id
  where membership.user_id = (select auth.uid())
    and membership.tenant_id = p_tenant_id
  order by organization.created_at asc;
$$;

revoke execute on function public.list_my_organizations(uuid) from public;
revoke execute on function public.list_my_organizations(uuid) from anon;
grant execute on function public.list_my_organizations(uuid) to authenticated;

-- 3. TRIGGERS
drop trigger if exists trg_app_content_touch on public.app_content;
create trigger trg_app_content_touch
before update on public.app_content
for each row execute function public.touch_updated_at();

drop trigger if exists trg_chat_threads_touch on public.chat_threads;
create trigger trg_chat_threads_touch
before update on public.chat_threads
for each row execute function public.touch_updated_at();

drop trigger if exists sdp_force_author on public.section_submissions;
create trigger sdp_force_author
  before insert or update on public.section_submissions
  for each row execute function public.trg_force_submission_author();

drop trigger if exists sdp_protegeix_propietari on public.organization_memberships;
create trigger sdp_protegeix_propietari
  before delete or update on public.organization_memberships
  for each row execute function public.sdp_protegeix_propietari();

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists trg_organizations_touch on public.organizations;
create trigger trg_organizations_touch
before update on public.organizations
for each row execute function public.touch_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists trg_organization_add_owner on public.organizations;
create trigger trg_organization_add_owner
after insert on public.organizations
for each row execute function private.add_organization_owner();

-- 4. VIEWS
create or replace view public.organization_directory
with (security_barrier = true)
as
select
  id,
  tenant_id,
  slug,
  name,
  kind,
  parent_organization_id,
  lema,
  description,
  created_at,
  updated_at
from public.organizations
where visibility = 'public';

revoke all on table public.organization_directory from public, anon, authenticated;
grant select on table public.organization_directory to anon, authenticated;


-- 5. RLS POLICIES
alter table public.towns enable row level security;
alter table public.town_memberships enable row level security;
alter table public.app_content enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.section_submissions enable row level security;
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.organizations from anon, authenticated;
revoke all on table public.organization_memberships from anon, authenticated;
revoke all on table public.town_memberships from anon, authenticated;

grant select on table public.profiles to authenticated;
grant insert (id, full_name, visibility) on table public.profiles to authenticated;
grant update (full_name) on table public.profiles to authenticated;
grant select (
  id, tenant_id, slug, name, kind, parent_organization_id,
  lema, description, visibility, created_at, updated_at
) on table public.organizations to authenticated;
grant insert (
  tenant_id, slug, name, kind, parent_organization_id,
  lema, description, visibility, created_by
) on table public.organizations to authenticated;
grant select on table public.organization_memberships to authenticated;
grant select on table public.town_memberships to authenticated;
grant insert (town_id, user_id, role) on table public.town_memberships to authenticated;

drop policy if exists "public read towns" on public.towns;
create policy "public read towns" on public.towns for select using (true);

drop policy if exists "user read own memberships" on public.town_memberships;
create policy "user read own memberships" on public.town_memberships for select
to authenticated using (user_id = (select auth.uid()));

drop policy if exists "user insert own membership" on public.town_memberships;
create policy "user insert own membership" on public.town_memberships for insert
to authenticated with check (
  user_id = (select auth.uid()) 
  and role = 'member'
  and exists (select 1 from public.towns where id = town_id and is_open = true)
);

drop policy if exists "public read app_content" on public.app_content;
create policy "public read app_content" on public.app_content for select using (true);

drop policy if exists "public read guest chat_threads" on public.chat_threads;
create policy "public read guest chat_threads" on public.chat_threads for select
using (owner_user_id = '00000000-0000-0000-0000-000000000000');

drop policy if exists "private read chat_threads" on public.chat_threads;
create policy "private read chat_threads" on public.chat_threads for select to authenticated
using (owner_user_id = (select auth.uid()) and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = (select auth.uid())));

drop policy if exists "private write chat_threads" on public.chat_threads;
create policy "private write chat_threads" on public.chat_threads for insert to authenticated
with check (owner_user_id = (select auth.uid()) and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = (select auth.uid())));

drop policy if exists "private update chat_threads" on public.chat_threads;
create policy "private update chat_threads" on public.chat_threads for update to authenticated
using (owner_user_id = (select auth.uid()) and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = (select auth.uid())))
with check (owner_user_id = (select auth.uid()) and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = (select auth.uid())));

drop policy if exists "private delete chat_threads" on public.chat_threads;
create policy "private delete chat_threads" on public.chat_threads for delete to authenticated
using (owner_user_id = (select auth.uid()) and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = (select auth.uid())));

drop policy if exists "public read guest chat_messages" on public.chat_messages;
create policy "public read guest chat_messages" on public.chat_messages for select 
using (owner_user_id = '00000000-0000-0000-0000-000000000000');

drop policy if exists "private read chat_messages" on public.chat_messages;
create policy "private read chat_messages" on public.chat_messages for select to authenticated
using (owner_user_id = (select auth.uid()) and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = (select auth.uid())));

drop policy if exists "private write chat_messages" on public.chat_messages;
create policy "private write chat_messages" on public.chat_messages for insert to authenticated
with check (
  owner_user_id = (select auth.uid())
  and thread_id is not null 
  and text is not null 
  and text <> '' 
  and sender in ('me', 'other')
  and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = (select auth.uid()))
);

drop policy if exists "public read section_submissions" on public.section_submissions;
create policy "public read section_submissions" on public.section_submissions for select
using (
  (section_id != 'notes' or owner_user_id = (select auth.uid()))
  and (select private.is_town_member(tenant_id))
);

drop policy if exists "private write section_submissions" on public.section_submissions;
create policy "private write section_submissions" on public.section_submissions for insert to authenticated
with check (
  owner_user_id = (select auth.uid())
  and section_id in ('mur', 'mercat', 'events', 'multimedia', 'notes') 
  and payload is not null
  and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = (select auth.uid()))
  and (author_org_id is null or (select private.can_manage_organization(author_org_id)))
);

drop policy if exists "private update section_submissions" on public.section_submissions;
create policy "private update section_submissions" on public.section_submissions for update to authenticated
using (owner_user_id = (select auth.uid()) and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = (select auth.uid())))
with check (
  owner_user_id = (select auth.uid()) 
  and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = (select auth.uid()))
  and (author_org_id is null or (select private.can_manage_organization(author_org_id)))
);

drop policy if exists "private delete section_submissions" on public.section_submissions;
create policy "private delete section_submissions" on public.section_submissions for delete to authenticated
using (owner_user_id = (select auth.uid()) and exists (select 1 from public.town_memberships where town_id = tenant_id and user_id = (select auth.uid())));


drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles for select to authenticated
using ((select auth.uid()) is not null and id = (select auth.uid()));

drop policy if exists "profiles insert own private" on public.profiles;
create policy "profiles insert own private" on public.profiles for insert to authenticated
with check (
  (select auth.uid()) is not null
  and id = (select auth.uid())
  and visibility = 'private'
);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update to authenticated
using ((select auth.uid()) is not null and id = (select auth.uid()))
with check ((select auth.uid()) is not null and id = (select auth.uid()) and visibility = 'private');

drop policy if exists "authenticated read public organizations" on public.organizations;
create policy "authenticated read public organizations" on public.organizations for select to authenticated
using (visibility = 'public');

drop policy if exists "members read own organizations" on public.organizations;
create policy "members read own organizations" on public.organizations for select to authenticated
using ((select private.is_organization_member(id)));

drop policy if exists "members create organizations" on public.organizations;
create policy "members create organizations" on public.organizations for insert to authenticated
with check (
  (select auth.uid()) is not null
  and created_by = (select auth.uid())
  and visibility = 'public'
  and (select private.is_town_member(tenant_id))
  and (
    (kind = 'company' and parent_organization_id is null)
    or (
      kind = 'group'
      and parent_organization_id is not null
      and (select private.can_create_group(parent_organization_id, tenant_id))
    )
  )
);

drop policy if exists "members read own memberships" on public.organization_memberships;
create policy "members read own memberships" on public.organization_memberships for select to authenticated
using (
  user_id = (select auth.uid())
  or (select private.can_manage_organization(organization_id))
);

