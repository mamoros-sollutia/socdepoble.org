---
tipus: document
estat: esborrany
description: MINIBUNDLE PER A L'AUDITOR Z
---
# MINIBUNDLE PER A L'AUDITOR Z
Aquest és el cos dels 8 fitxers demanats per verificar les clausures crítiques.

## File: index.html
```
<!doctype html>
<html lang="ca">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#f4eee6" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;" />
    <meta name="description" content="Sóc de Poble: una estructura neta, simple i mantenible per a la xarxa pública del poble." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <!-- SEO tags -->
    <meta property="og:title" content="Sóc de Poble" />
    <meta property="og:description" content="Sóc de Poble: la xarxa pública del poble." />
    <meta property="og:image" content="/assets/system/ui/logo-socdepoble-social.jpg" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Sóc de Poble" />
    <meta name="twitter:description" content="Sóc de Poble: la xarxa pública del poble." />
    <meta name="twitter:image" content="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg" />
    <link rel="icon" type="image/svg+xml" href="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg" />
    <title>Sóc de Poble</title>
    <style>
      html, body { height: 100%; width: 100%; margin: 0; padding: 0; }
      body { background-color: var(--sdp-fons-app, #f4eee6); }
      #root { height: 100%; width: 100%; display: block; }
    </style>

  </head>
  <body class="sdp-root">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## File: vite.config.js
```
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (anonKey) {
  try {
    const payload = JSON.parse(Buffer.from(anonKey.split('.')[1], 'base64').toString());
    if (payload.role === 'service_role') {
      throw new Error('ATURADOR CRÍTIC: Has posat la clau service_role a VITE_SUPABASE_ANON_KEY! Risc massiu d\'exfiltració de dades. Aturant build.');
    }
  } catch (e) {
    if (e.message.includes('ATURADOR')) throw e;
  }
}
export default defineConfig(() => ({
  plugins: [
    react({
      jsxImportSource: 'react',
    })
  ],

  server: {
    host: true,
    port: 3340,
    strictPort: true,
    watch: {
      ignored: ['**/.agents/**', '**/_wiki_de_poble/**', '**/.gemini/**', '**/scripts/**']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime'
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true
  }
}));
```

## File: supabase/schema.sql
```
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


create table if not exists private.ajustos (
  clau text primary key,
  valor text not null
);
revoke all on table private.ajustos from public, anon, authenticated;

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
  consentiment_rgpd_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists visibility text not null default 'private' check (visibility = 'private');
alter table public.profiles add column if not exists consentiment_rgpd_at timestamptz;

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




create table if not exists public.user_platform_roles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'usuari'
             check (role in ('usuari','moderador','superadmin')),
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now()
);

create table if not exists public.organization_claims (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  tenant_id       uuid not null,
  user_id         uuid not null references auth.users(id) on delete cascade,
  estat           text not null default 'pendent'
                  check (estat in ('pendent','aprovada','rebutjada')),
  justificacio    text not null default '' check (char_length(justificacio) <= 1000),
  resolta_per     uuid references auth.users(id),
  resolta_at      timestamptz,
  created_at      timestamptz not null default now(),
  foreign key (tenant_id, organization_id)
    references public.organizations(tenant_id, id) on delete cascade
);
create unique index if not exists idx_claims_una_pendent
  on public.organization_claims(organization_id, user_id) where estat = 'pendent';


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

create or replace function private.comprova_una_propietaria() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare v_org uuid; v_n int;
begin
  v_org := coalesce(new.organization_id, old.organization_id);
  if not exists (select 1 from public.organizations o where o.id = v_org) then
    return null;
  end if;
  select count(*) into v_n from public.organization_memberships m
   where m.organization_id = v_org and m.role = 'owner';
   
  if exists (select 1 from public.organizations o where o.id = v_org and o.kind in ('company', 'entity', 'city_hall')) then
    if v_n > 1 then
      raise exception 'SDP-LOCK: l''organització % ha de tindre 0 o 1 propietària (en té %).',
        v_org, v_n using errcode = '23514';
    end if;
  else
    if v_n <> 1 then
      raise exception 'SDP-LOCK: l''organització % ha de tindre exactament 1 propietària (en té %).',
        v_org, v_n using errcode = '23514';
    end if;
  end if;
  return null;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_tenant uuid;
  v_rgpd   boolean;
begin
  begin -- Bloc de seguretat afegit per evitar errors 500 (Qwen)
    begin
      v_tenant := nullif(new.raw_user_meta_data ->> 'tenant_id', '')::uuid;
    exception when invalid_text_representation then
      raise exception 'SDP-REG-002: tenant_id no és un UUID.' using errcode = '22023';
    end;

    if v_tenant is null then
      select valor::uuid into v_tenant
        from private.ajustos where clau = 'poble_per_defecte';
    end if;

    if v_tenant is null then
      raise exception 'SDP-REG-001: alta sense poble i sense poble per defecte.'
        using errcode = '23502';
    end if;

    if not exists (select 1 from public.towns t where t.id = v_tenant and t.is_open = true) then
      raise exception 'SDP-REG-003: el poble % no existix o no està obert.', v_tenant
        using errcode = '23503';
    end if;

    v_rgpd := coalesce((new.raw_user_meta_data ->> 'rgpd')::boolean, false);

    insert into public.profiles (id, full_name, consentiment_rgpd_at)
    values (
      new.id,
      coalesce(nullif(left(btrim(new.raw_user_meta_data ->> 'name'), 120), ''), 'Persona'),
      case when v_rgpd then now() else null end
    )
    on conflict (id) do nothing;

    insert into public.town_memberships (town_id, user_id, role)
    values (v_tenant, new.id, 'member')
    on conflict (town_id, user_id) do nothing;
    
  exception when others then
    -- Re-llancem l'error perquè Supabase avorte l'alta i ho comunique al client
    raise;
  end;

  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon, authenticated;


create or replace function private.es_superadmin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.user_platform_roles r
    where r.user_id = (select auth.uid()) and r.role = 'superadmin'
  );
$$;
revoke execute on function private.es_superadmin() from public, anon;
grant execute on function private.es_superadmin() to authenticated;

create or replace function public.sollicita_reclamacio(
  p_organization_id uuid,
  p_justificacio    text default ''
)
returns public.organization_claims
language plpgsql security definer set search_path = ''
as $$
declare v_tenant uuid; v_fila public.organization_claims;
begin
  if (select auth.uid()) is null then
    raise exception 'SDP-CLAIM-000: cal sessió.' using errcode = '42501';
  end if;

  select o.tenant_id into v_tenant
    from public.organizations o where o.id = p_organization_id;
  if v_tenant is null then
    raise exception 'SDP-CLAIM-001: l''entitat no existix.' using errcode = '22023';
  end if;

  if not exists (
    select 1 from public.town_memberships tm
    where tm.user_id = (select auth.uid()) and tm.town_id = v_tenant
  ) then
    raise exception 'SDP-CLAIM-002: no eres del poble d''esta entitat.' using errcode = '42501';
  end if;

  if exists (
    select 1 from public.organization_memberships m
    where m.organization_id = p_organization_id and m.role = 'owner'
  ) then
    raise exception 'SDP-CLAIM-003: l''entitat ja té propietària.' using errcode = '23505';
  end if;

  insert into public.organization_claims (organization_id, tenant_id, user_id, justificacio)
  values (p_organization_id, v_tenant, (select auth.uid()),
          left(btrim(coalesce(p_justificacio, '')), 1000))
  returning * into v_fila;

  return v_fila;
end;
$$;
revoke execute on function public.sollicita_reclamacio(uuid, text) from public, anon;
grant execute on function public.sollicita_reclamacio(uuid, text) to authenticated;

create or replace function public.resol_reclamacio(p_claim uuid, p_aprova boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
declare v_claim public.organization_claims;
begin
  if not (select private.es_superadmin()) then
    raise exception 'SDP-CLAIM-010: cal rol de superadmin.' using errcode = '42501';
  end if;

  select * into v_claim from public.organization_claims
   where id = p_claim and estat = 'pendent' for update;
  if v_claim.id is null then
    raise exception 'SDP-CLAIM-011: reclamació inexistent o ja resolta.' using errcode = '22023';
  end if;

  if v_claim.user_id = (select auth.uid()) then
    raise exception 'SDP-CLAIM-012: no pots revisar la teua pròpia reclamació.' using errcode = '42501';
  end if;

  if p_aprova then
    insert into public.organization_memberships (organization_id, tenant_id, user_id, role)
    values (v_claim.organization_id, v_claim.tenant_id, v_claim.user_id, 'owner')
    on conflict (organization_id, user_id) do update set role = 'owner';
  end if;

  update public.organization_claims
     set estat = case when p_aprova then 'aprovada' else 'rebutjada' end,
         resolta_per = (select auth.uid()),
         resolta_at  = now()
   where id = p_claim;
end;
$$;
revoke execute on function public.resol_reclamacio(uuid, boolean) from public, anon;
grant execute on function public.resol_reclamacio(uuid, boolean) to authenticated;

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
grant execute on function private.is_town_member(uuid) to public;
grant execute on function private.is_town_member(uuid) to anon;
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
  if p_kind in ('entity', 'city_hall') then
    raise exception 'Les entitats i els ajuntaments no es creen: es reclamen.' using errcode = '42501';
  end if;

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
    lema,
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
    organization.lema,
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

drop trigger if exists sdp_una_propietaria on public.organization_memberships;
create constraint trigger sdp_una_propietaria
  after insert or update or delete on public.organization_memberships
  deferrable initially deferred
  for each row execute function private.comprova_una_propietaria();

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

drop policy if exists "public read towns" on public.towns;
create policy "public read towns" on public.towns for select using (true);

drop policy if exists "user read own memberships" on public.town_memberships;
create policy "user read own memberships" on public.town_memberships for select
to authenticated using (user_id = (select auth.uid()));


drop policy if exists "public read app_content" on public.app_content;
create policy "public read app_content" on public.app_content for select using (true);


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
using (visibility = 'public' and (select private.is_town_member(tenant_id)));

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



alter table public.user_platform_roles enable row level security;
revoke all on table public.user_platform_roles from anon, authenticated;
grant select on table public.user_platform_roles to authenticated;

drop policy if exists "llig el propi rol" on public.user_platform_roles;
create policy "llig el propi rol" on public.user_platform_roles for select to authenticated
using (user_id = (select auth.uid()));

alter table public.organization_claims enable row level security;
revoke all on table public.organization_claims from anon, authenticated;
grant select on table public.organization_claims to authenticated;

drop policy if exists "llig les propies reclamacions" on public.organization_claims;
create policy "llig les propies reclamacions" on public.organization_claims
for select to authenticated
using (user_id = (select auth.uid()) or (select private.es_superadmin()));

grant update (name, lema, description, visibility) on table public.organizations to authenticated;

drop policy if exists "gestores actualitzen l'organització" on public.organizations;
create policy "gestores actualitzen l'organització" on public.organizations
for update to authenticated
using       ((select private.can_manage_organization(id)))
with check  ((select private.can_manage_organization(id)));

```

## File: supabase/migrations/20260908_initial_schema.sql
```
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


create table if not exists private.ajustos (
  clau text primary key,
  valor text not null
);
revoke all on table private.ajustos from public, anon, authenticated;

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
  consentiment_rgpd_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists visibility text not null default 'private' check (visibility = 'private');
alter table public.profiles add column if not exists consentiment_rgpd_at timestamptz;

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
  created_by uuid references public.profiles(id) on delete set null,
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
alter table public.organizations add column if not exists created_by uuid references public.profiles(id) on delete set null;

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




create table if not exists public.user_platform_roles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'usuari'
             check (role in ('usuari','moderador','superadmin')),
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now()
);

create table if not exists public.organization_claims (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  tenant_id       uuid not null,
  user_id         uuid not null references auth.users(id) on delete cascade,
  estat           text not null default 'pendent'
                  check (estat in ('pendent','aprovada','rebutjada')),
  justificacio    text not null default '' check (char_length(justificacio) <= 1000),
  resolta_per     uuid references auth.users(id),
  resolta_at      timestamptz,
  created_at      timestamptz not null default now(),
  foreign key (tenant_id, organization_id)
    references public.organizations(tenant_id, id) on delete cascade
);
create unique index if not exists idx_claims_una_pendent
  on public.organization_claims(organization_id, user_id) where estat = 'pendent';


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
  if TG_OP = 'UPDATE' then
    if new.tenant_id != old.tenant_id then
      raise exception 'SDP-SEC-001: tenant_id is immutable';
    end if;
    if new.section_id != old.section_id then
      raise exception 'SDP-SEC-002: section_id is immutable';
    end if;
  end if;

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

create or replace function private.comprova_una_propietaria() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare v_org uuid; v_n int;
begin
  v_org := coalesce(new.organization_id, old.organization_id);
  if not exists (select 1 from public.organizations o where o.id = v_org) then
    return null;
  end if;
  select count(*) into v_n from public.organization_memberships m
   where m.organization_id = v_org and m.role = 'owner';
   
  if exists (select 1 from public.organizations o where o.id = v_org and o.kind in ('company', 'entity', 'city_hall')) then
    if v_n > 1 then
      raise exception 'SDP-LOCK: l''organització % ha de tindre 0 o 1 propietària (en té %).',
        v_org, v_n using errcode = '23514';
    end if;
  else
    if v_n <> 1 then
      raise exception 'SDP-LOCK: l''organització % ha de tindre exactament 1 propietària (en té %).',
        v_org, v_n using errcode = '23514';
    end if;
  end if;
  return null;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_tenant uuid;
  v_rgpd   boolean;
begin
  begin -- Bloc de seguretat afegit per evitar errors 500 (Qwen)
    begin
      v_tenant := nullif(new.raw_user_meta_data ->> 'tenant_id', '')::uuid;
    exception when invalid_text_representation then
      raise exception 'SDP-REG-002: tenant_id no és un UUID.' using errcode = '22023';
    end;

    if v_tenant is null then
      select valor::uuid into v_tenant
        from private.ajustos where clau = 'poble_per_defecte';
    end if;

    if v_tenant is null then
      raise exception 'SDP-REG-001: alta sense poble i sense poble per defecte.'
        using errcode = '23502';
    end if;

    if not exists (select 1 from public.towns t where t.id = v_tenant and t.is_open = true) then
      raise exception 'SDP-REG-003: el poble % no existix o no està obert.', v_tenant
        using errcode = '23503';
    end if;

    v_rgpd := coalesce((new.raw_user_meta_data ->> 'rgpd')::boolean, false);

    insert into public.profiles (id, full_name, consentiment_rgpd_at)
    values (
      new.id,
      coalesce(nullif(left(btrim(new.raw_user_meta_data ->> 'name'), 120), ''), 'Persona'),
      case when v_rgpd then now() else null end
    )
    on conflict (id) do update set full_name = excluded.full_name, consentiment_rgpd_at = coalesce(excluded.consentiment_rgpd_at, public.profiles.consentiment_rgpd_at);

    insert into public.town_memberships (town_id, user_id, role)
    values (v_tenant, new.id, 'member')
    on conflict (town_id, user_id) do nothing;
    
  exception when others then
    -- Re-llancem l'error perquè Supabase avorte l'alta i ho comunique al client
    raise;
  end;

  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon, authenticated;


create or replace function private.es_superadmin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.user_platform_roles r
    where r.user_id = (select auth.uid()) and r.role = 'superadmin'
  );
$$;
revoke execute on function private.es_superadmin() from public, anon;
grant execute on function private.es_superadmin() to authenticated;

create or replace function public.sollicita_reclamacio(
  p_organization_id uuid,
  p_justificacio    text default ''
)
returns public.organization_claims
language plpgsql security definer set search_path = ''
as $$
declare v_tenant uuid; v_fila public.organization_claims;
begin
  if (select auth.uid()) is null then
    raise exception 'SDP-CLAIM-000: cal sessió.' using errcode = '42501';
  end if;

  select o.tenant_id into v_tenant
    from public.organizations o where o.id = p_organization_id;
  if v_tenant is null then
    raise exception 'SDP-CLAIM-001: l''entitat no existix.' using errcode = '22023';
  end if;

  if not exists (
    select 1 from public.town_memberships tm
    where tm.user_id = (select auth.uid()) and tm.town_id = v_tenant
  ) then
    raise exception 'SDP-CLAIM-002: no eres del poble d''esta entitat.' using errcode = '42501';
  end if;

  if exists (
    select 1 from public.organization_memberships m
    where m.organization_id = p_organization_id and m.role = 'owner'
  ) then
    raise exception 'SDP-CLAIM-003: l''entitat ja té propietària.' using errcode = '23505';
  end if;

  insert into public.organization_claims (organization_id, tenant_id, user_id, justificacio)
  values (p_organization_id, v_tenant, (select auth.uid()),
          left(btrim(coalesce(p_justificacio, '')), 1000))
  returning * into v_fila;

  return v_fila;
end;
$$;
revoke execute on function public.sollicita_reclamacio(uuid, text) from public, anon;
grant execute on function public.sollicita_reclamacio(uuid, text) to authenticated;

create or replace function public.resol_reclamacio(p_claim uuid, p_aprova boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
declare v_claim public.organization_claims;
begin
  if not (select private.es_superadmin()) then
    raise exception 'SDP-CLAIM-010: cal rol de superadmin.' using errcode = '42501';
  end if;

  select * into v_claim from public.organization_claims
   where id = p_claim and estat = 'pendent' for update;
  if v_claim.id is null then
    raise exception 'SDP-CLAIM-011: reclamació inexistent o ja resolta.' using errcode = '22023';
  end if;

  if v_claim.user_id = (select auth.uid()) then
    raise exception 'SDP-CLAIM-012: no pots revisar la teua pròpia reclamació.' using errcode = '42501';
  end if;

  if p_aprova then
    insert into public.organization_memberships (organization_id, tenant_id, user_id, role)
    values (v_claim.organization_id, v_claim.tenant_id, v_claim.user_id, 'owner')
    on conflict (organization_id, user_id) do update set role = 'owner';
  end if;

  update public.organization_claims
     set estat = case when p_aprova then 'aprovada' else 'rebutjada' end,
         resolta_per = (select auth.uid()),
         resolta_at  = now()
   where id = p_claim;
end;
$$;
revoke execute on function public.resol_reclamacio(uuid, boolean) from public, anon;
grant execute on function public.resol_reclamacio(uuid, boolean) to authenticated;

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
grant execute on function private.is_town_member(uuid) to public;
grant execute on function private.is_town_member(uuid) to anon;
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
  if p_kind in ('entity', 'city_hall') then
    raise exception 'Les entitats i els ajuntaments no es creen: es reclamen.' using errcode = '42501';
  end if;

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
  on conflict (id) do update set full_name = excluded.full_name, consentiment_rgpd_at = coalesce(excluded.consentiment_rgpd_at, public.profiles.consentiment_rgpd_at);

  
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
    lema,
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
    organization.lema,
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

drop trigger if exists sdp_una_propietaria on public.organization_memberships;
create constraint trigger sdp_una_propietaria
  after insert or update or delete on public.organization_memberships
  deferrable initially deferred
  for each row execute function private.comprova_una_propietaria();

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
create or replace view public.organization_directory with (security_invoker = true)
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

drop policy if exists "public read towns" on public.towns;
create policy "public read towns" on public.towns for select using (true);

drop policy if exists "user read own memberships" on public.town_memberships;
create policy "user read own memberships" on public.town_memberships for select
to authenticated using (user_id = (select auth.uid()));


drop policy if exists "public read app_content" on public.app_content;
create policy "public read app_content" on public.app_content for select using (true);


drop policy if exists "private read chat_threads" on public.chat_threads;
create policy "public read chat_threads" on public.chat_threads for select
using (true);

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


drop policy if exists "private read chat_messages" on public.chat_messages;
create policy "public read chat_messages" on public.chat_messages for select
using (true);

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
create policy "public read public organizations" on public.organizations for select
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



alter table public.user_platform_roles enable row level security;
revoke all on table public.user_platform_roles from anon, authenticated;
grant select on table public.user_platform_roles to authenticated;

drop policy if exists "llig el propi rol" on public.user_platform_roles;
create policy "llig el propi rol" on public.user_platform_roles for select to authenticated
using (user_id = (select auth.uid()));

alter table public.organization_claims enable row level security;
revoke all on table public.organization_claims from anon, authenticated;
grant select on table public.organization_claims to authenticated;

drop policy if exists "llig les propies reclamacions" on public.organization_claims;
create policy "llig les propies reclamacions" on public.organization_claims
for select to authenticated
using (user_id = (select auth.uid()) or (select private.es_superadmin()));

grant update (name, lema, description, visibility) on table public.organizations to authenticated;

drop policy if exists "gestores actualitzen l'organització" on public.organizations;
create policy "gestores actualitzen l'organització" on public.organizations
for update to authenticated
using       ((select private.can_manage_organization(id)))
with check  ((select private.can_manage_organization(id)));

```

## File: src/host.js
```
/**
 * host.js — LA PRESA DE CORRENT DE SÓC DE POBLE
 *
 * EL PROBLEMA QUE RESOL (auditoria 260830)
 * ────────────────────────────────────────
 * `backendPort.js` està ben fet: cap mòdul importa `supabaseBackend.js`
 * directament, tot passa pel port, i el pany s'arma. Però la Llei de
 * l'Enxufabilitat (AGENTS.md §8) era **inassolible a la pràctica**, per tres
 * barreres acumulades:
 *
 *   1 · `setBackendImplementation` no s'exposava a cap global. Zero
 *       assignacions `window.*` en tot `src/`.
 *   2 · El build standalone declara explícitament que NO és un mòdul ESM.
 *       Sense ESM i sense global, no hi ha cap superfície de crida.
 *   3 · Encara que n'hi haguera: `freezeImplementation()` es crida dins de
 *       `connectedCallback`, que dispara SÍNCRONAMENT durant
 *       `customElements.define()` quan l'etiqueta ja és al DOM — que és
 *       exactament el cas del plugin. La finestra d'injecció era de zero
 *       mil·lisegons.
 *
 * El port existia, era correcte, i estava soldat per dins.
 *
 * L'ARQUITECTURA NOVA: ARRENCADA EN DUES FASES
 * ────────────────────────────────────────────
 * El pany segueix sent innegociable — un backend injectable després del
 * muntatge seria un vector d'atac. El que canvia és QUAN es tanca:
 *
 *   Fase 1 · CONFIGURACIÓ   El host pot cridar `configura({ backend })`.
 *                           L'element encara no està definit.
 *   Fase 2 · SEGELLAT       `arrenca()` congela el backend i defineix
 *                           l'element. A partir d'ací, res es pot injectar.
 *
 * Per a entorns que necessiten arrencada sense configuració, `arrencaAuto()`
 * fa la fase 2 sola en el següent tick. Un `<script>` del host col·locat
 * després del bundle encara arriba a temps per a la fase 1, perquè el tick
 * no s'ha consumit.
 *
 * COM L'USA SOLLUTIA
 * ──────────────────
 * Si s'empra `type="module"`, el host carrega de forma diferida. Per evitar
 * curses, Sollutia ha d'esperar l'esdeveniment `socdepoble-ready` o
 * comprovar si ja està llest:
 *
 *   function bootSollutia() {
 *     window.SocDePoble.configura({ backend: { ... } });
 *     window.SocDePoble.arrenca();
 *   }
 *
 *   if (window.SocDePoble && window.SocDePoble.isReady) {
 *     bootSollutia();
 *   } else {
 *     window.addEventListener('socdepoble-ready', bootSollutia);
 *   }
 *
 * Per a substituir Supabase del tot (l'objectiu d'integració amb Sollutia), es passa el
 * contracte sencer i `supabaseBackend.js` deixa de tocar-se en temps d'execució.
 *
 * COM S'USA EN ENTORN ESTÀNDARD
 * ─────────────────────────────
 *   El build standalone acaba cridant `arrencaAuto()`. Si ningú ha configurat
 *   res, s'arrenca amb Supabase de forma autònoma.
 *
 * NOTA D'HONESTEDAT
 * ─────────────────
 * El cicle de vida dels Custom Elements no s'ha pogut provar en aquest entorn
 * (no hi ha navegador ni node_modules). L'estructura del mòdul i l'ordre de
 * crides sí que estan raonats contra el codi real de `PedraSecaEmbed.jsx`,
 * però la fase 2 s'ha de verificar en un navegador abans de donar-la per bona.
 * Vegeu `tooling/gates/tractor-enxufe.mjs` per a la comprovació estàtica.
 */

if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.error('[host] Error de xarxa en la càrrega diferida de mòduls Vite:', event);
    // El catch de l'arrenca pintarà això si passa durant l'arrencada, 
    // però això ens cobreix canvis de ruta asíncrons.
  });
}

import { setBackendImplementation, freezeImplementation, getBackendImplementation } from './data/backendPort.js';
import { defineCustomElement } from './PedraSecaEmbed.jsx';

/* ═══════════════════════ Estat de l'arrencada ═══════════════════════ */

const FASE = { CONFIGURABLE: 'configurable', SEGELLAT: 'segellat' };
let fase = FASE.CONFIGURABLE;
let autoProgramada = false;
let arrencada = null;

/** Mètodes que un backend complet ha d'oferir. Documenta el contracte. */
export const CONTRACTE_BACKEND = Object.freeze([
  'loadAppData',
  'loadCoreContent',
  'loadMur',
  'loadXat',
  'loadMultimedia',
  'loadNotes',
  'appendChatMessages',
  'appendSectionSubmissionNetworkOnly',
  'updateNote',
  'loginWithMagicLink',
  'loginWithGoogle',
  'listMyOrganizations',
  'createOrganization',
  'updateOrganization',
  'updateProfile',
  'updateUserPassword',
  'getProfile',
  'recullTornadaOAuth',
  'logout',
  'getCurrentUser',
  'getBackendConfigurat',
  'getRuntimeDataMode',
  'normalizeDataMode',
  'getDefaultUserId'
]);

/* ═══════════════════════ Fase 1 · Configuració ═══════════════════════ */

/**
 * Injecta una implementació de backend abans del segellat.
 *
 * Mode estricte: la injecció ha de proveir el contracte sencer per a
 * evitar barreges perilloses entre Supabase i el nou backend de Sollutia.
 *
 * @param {{backend?: Record<string, Function>}} opcions
 * @returns {{acceptats: string[], desconeguts: string[], pendents: string[]}}
 * @throws {Error} si ja s'ha segellat
 */
export function configura({ backend } = {}) {
  if (fase === FASE.SEGELLAT) {
    throw new Error(
      "[host] Ja s'ha cridat arrenca(): el backend està segellat. "
      + 'Crida configura() abans d\'arrenca(), o abans que el bundle programe l\'arrencada automàtica.',
    );
  }
  if (!backend || typeof backend !== 'object') {
    return { acceptats: [], desconeguts: [], pendents: [...CONTRACTE_BACKEND] };
  }

  const claus = Object.keys(backend);
  const desconeguts = claus.filter((k) => !CONTRACTE_BACKEND.includes(k));
  const acceptats = claus.filter((k) => CONTRACTE_BACKEND.includes(k) && typeof backend[k] === 'function');

  // Els mètodes desconeguts no s'injecten en silenci: un error d'escriptura
  // en un nom de mètode és una fallada muda que costa hores de trobar.
  if (desconeguts.length) {
    console.warn(`[host] Mètodes fora del contracte, ignorats: ${desconeguts.join(', ')}.`
      + ` Contracte vàlid: ${CONTRACTE_BACKEND.join(', ')}`);
  }
  const noFuncions = claus.filter((k) => CONTRACTE_BACKEND.includes(k) && typeof backend[k] !== 'function');
  if (noFuncions.length) {
    throw new Error(`[host] Aquests membres del contracte no són funcions: ${noFuncions.join(', ')}`);
  }

  setBackendImplementation(Object.fromEntries(acceptats.map((k) => [k, backend[k]])));
  return { acceptats, desconeguts, pendents: CONTRACTE_BACKEND.filter((k) => !acceptats.includes(k)) };
}

/* ═══════════════════════ Fase 2 · Segellat ═══════════════════════ */

/**
 * Congela el backend i defineix `<soc-de-poble>`. Idempotent.
 *
 * CURSA CORREGIDA (260903): `fase` es marcava DESPRÉS de l'`await import()`.
 * Durant eixa finestra:
 *   · un segon `arrenca()` travessava el guard i cridava `defineCustomElement()`
 *     dos voltes → NotSupportedError;
 *   · un `configura()` tardà passava net i després quedava sobreescrit en
 *   silenci pel backend de Supabase.
 * Ara el segellat es marca SÍNCRONAMENT i la faena asíncrona viu en una
 * promesa memoritzada.
 *
 * @returns {Promise<{fase: string, backend: string[]}>}
 */
export function arrenca() {
  if (arrencada) return arrencada;

  fase = FASE.SEGELLAT;

  arrencada = (async () => {
    const injectats = Object.keys(getBackendImplementation());

    if (injectats.length > 0) {
      // Mode estricte: si s'ha injectat, ha de ser el contracte sencer.
      const pendents = CONTRACTE_BACKEND.filter((k) => !injectats.includes(k));
      if (pendents.length > 0) {
        throw new Error(
          `[host] Injecció incompleta. No es permet fusió amb Supabase. Falten mètodes: ${pendents.join(', ')}`,
        );
      }
    } else {
      // Fail-closed: si el backend per defecte no carrega, NO congelem una
      // implementació buida ni pintem l'element. Abans es feia console.error
      // i es continuava: l'app es muntava sencera amb totes les crides de
      // dades fallant, que és pitjor que no muntar-se.
      const supabaseImpl = await import('./data/supabaseBackend.js');
      setBackendImplementation(supabaseImpl);
    }

    freezeImplementation();
    defineCustomElement();
    return { fase, backend: Object.keys(getBackendImplementation()) };
  })();

  return arrencada;
}

/**
 * Arrencada automàtica per als entorns que no configuren res.
 *
 * `setTimeout(…, 0)` és una MACROtasca, no una microtasca: la finestra
 * d'injecció és més ampla del que deia el comentari anterior. Tot i així
 * només arriba a temps un `<script>` SÍNCRON del host. Amb `defer`, `async`
 * o `type="module"` el host arriba tard i `configura()` llançarà.
 */
export function arrencaAuto() {
  if (autoProgramada || fase === FASE.SEGELLAT) return;
  autoProgramada = true;
  const fes = () => {
    if (fase === FASE.SEGELLAT) return;
    arrenca().catch((e) => {
      console.error('[host] Arrencada fallida. El component no es muntarà:', e);
      if (typeof document !== 'undefined') {
        const sdpTags = document.querySelectorAll('soc-de-poble');
        sdpTags.forEach(tag => {
          tag.innerHTML = `<div style="padding: 1.5rem; color: #b91c1c; background: #fee2e2; border: 1px solid #ef4444; margin: 1rem; border-radius: 6px; font-family: sans-serif;">
            <h3 style="margin-top: 0; font-size: 1.25rem;">Error crític d'arrencada</h3>
            <p style="margin-bottom: 0.5rem;">Sóc de Poble no ha pogut connectar amb el backend.</p>
            <pre style="white-space: pre-wrap; font-size: 0.875rem; background: rgba(255,255,255,0.5); padding: 0.5rem; border-radius: 4px;">${e.message || e}</pre>
          </div>`;
        });
      }
    });
  };
  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(fes, 0), { once: true });
  } else {
    setTimeout(fes, 0);
  }
}

/** Estat actual, per a diagnòstic des de la consola del host. */
export function estat() {
  return {
    fase,
    configurable: fase === FASE.CONFIGURABLE,
    contracte: CONTRACTE_BACKEND,
    implementat: Object.keys(getBackendImplementation()),
  };
}

/* ═══════════════════════ Superfície global ═══════════════════════ */

/**
 * El build standalone no és ESM, així que un host que el carregue amb un
 * `<script>` pla necessita un global. És l'ÚNICA assignació a `window` del
 * projecte i està declarada ací, no escampada.
 *
 * IDEMPOTENT (260903): amb `configurable:false` i `writable:false`, una
 * segona crida —bloc i shortcode alhora en la mateixa pàgina, o dos
 * muntatges del bundle— llançava TypeError i matava el segon muntatge
 * sencer. Ara la segona crida torna l'API ja exposada.
 */
export function exposaGlobal(objectiu = (typeof window !== 'undefined' ? window : undefined)) {
  if (!objectiu) return null;

  const existent = Object.getOwnPropertyDescriptor(objectiu, 'SocDePoble');
  if (existent) return existent.value ?? null;

  const api = Object.freeze({ configura, arrenca, estat, CONTRACTE_BACKEND, isReady: true });
  Object.defineProperty(objectiu, 'SocDePoble', { value: api, writable: false, configurable: false });
  
  // Avisar a Sollutia o qualsevol integrador que l'API ja està llesta
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('socdepoble-ready', { detail: api }));
  }
  
  return api;
}
```

## File: src/data/supabaseBackend.js
```
import { APP_SEED, APP_SEED_VERSION, CHAT_THREADS, getDefaultUserId } from './appSeed.js';
import { getVal, setVal, delVal, getEfimer, setEfimer } from '../config/storage.js';
import { entraAmbGoogle, gestionaTornada } from './oauthRelay.js';
import { mergeById, mapSectionSubmissionToItem } from './mapejadorSeccions.js';



const DATA_SYNC_CHANNEL_NAME = 'socdepoble-data-sync-v1';

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class ErrorSupabase extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ErrorSupabase';
    this.status = status;
  }
}

const CONNECTABLE_SECTION_IDS = new Set(['mur', 'mercat', 'events', 'multimedia', 'notes']);













const buildHeaders = (anonKey, extra = {}) => {
  const jwt = getEfimer('socdepoble-jwt');
  return {
    apikey: anonKey,
    Authorization: `Bearer ${jwt ? jwt : anonKey}`,
    'Content-Type': 'application/json',
    ...extra
  };
};

let renovacioEnCurs = null;

export function refreshSession(config = {}) {
  if (renovacioEnCurs) return renovacioEnCurs;
  renovacioEnCurs = _renova(config).finally(() => { renovacioEnCurs = null; });
  return renovacioEnCurs;
}

async function _renova(config) {
  const refreshToken = getEfimer('socdepoble-refresh-token');
  if (!refreshToken) return false;

  const { supabaseUrl, supabaseAnonKey } = getResolvedConfig(config);
  if (!supabaseUrl) return false;

  let response;
  try {
    response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
  } catch (e) {
    console.warn('Error de xarxa renovant sessió', e);
    // Xarxa caiguda != Sessió invàlida
    return false;
  }

  if (response.ok) {
    const result = await response.json();
    if (result?.access_token) {
      setEfimer('socdepoble-jwt', result.access_token);
      setEfimer('socdepoble-refresh-token', result.refresh_token);
      setVal('socdepoble-user', result.user);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sdp:auth-change', { detail: { user: result.user }}));
      }
      return true;
    }
  }

  if (response.status === 400 || response.status === 401) {
    logout();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sdp:auth-change', { detail: { user: null }}));
    }
  }
  return false;
}

async function request(path, config, { method = 'GET', headers = {}, body, signal, timeoutMs = 12000, _isRetry = false } = {}) {
  const { supabaseUrl, supabaseAnonKey, hasSupabaseConfig } = getResolvedConfig(config);
  if (!hasSupabaseConfig) {
    throw new Error('Falten VITE_SUPABASE_URL i/o VITE_SUPABASE_ANON_KEY.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  const handleAbort = () => controller.abort();
  if (signal) {
    signal.addEventListener('abort', handleAbort);
  }

  try {
    const response = await fetch(`${supabaseUrl}${path}`, {
      method,
      headers: buildHeaders(supabaseAnonKey, headers),
      signal: controller.signal,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      if (response.status === 401 && !_isRetry && !path.startsWith('/auth/')) {
        const refreshed = await refreshSession(config);
        if (refreshed) {
          return await request(path, config, { method, headers, body, signal, timeoutMs, _isRetry: true });
        }
      }
      const text = await response.text();
      throw new ErrorSupabase(`Supabase ${response.status}: ${text || 'Error desconegut.'}`, response.status);
    }

    if (response.status === 204) return null;
    return response.json();
  } finally {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener('abort', handleAbort);
    }
  }
}

export async function requestMaybe(path, config, options = {}) {
  try {
    const data = await request(path, config, options);
    return { ok: true, data, status: 200 };
  } catch (error) {
    const match = String(error?.message || '').match(/^Supabase\s+(\d+):\s+(.*)$/s);
    return {
      ok: false,
      status: match ? Number(match[1]) : 500,
      errorMessage: match ? match[2] : String(error?.message || error)
    };
  }
}

function mapContentRowsToData(rows) {
  const lookup = new Map(rows.map((row) => [row.key, row.payload]));
  return {
    ownerUserId: getDefaultUserId(),
    agents: lookup.get('agents') || [],
    chatThreads: CHAT_THREADS,
    feedPosts: lookup.get('feedPosts') || [],
    marketItems: lookup.get('marketItems') || [],
    events: lookup.get('events') || [],
    towns: lookup.get('towns') || [],
    mediaItems: lookup.get('mediaItems') || [],
    noteFolders: (() => {
      const remote = lookup.get('noteFolders') || [];
      const ghostIds = new Set(['f-root', 'f-general', 'f-articles', 'f-histories', 'f-prompts', 'f-captures', 'f-event', 'f-mapa']);
      const ghostNames = new Set(['articles', 'històries del poble', 'captures de recerca', 'receptes']);
      const filteredRemote = remote.filter(f => !ghostIds.has(f.id) && !ghostNames.has((f.name || '').trim().toLowerCase()));
      
      const merged = APP_SEED.noteFolders.map(seedF => filteredRemote.find(f => f.id === seedF.id) || seedF);
      const custom = filteredRemote.filter(f => !APP_SEED.noteFolders.find(s => s.id === f.id));
      
      return [...merged, ...custom];
    })(),
    notes: (() => {
      const remote = lookup.get('notes') || [];
      const seedNotes = APP_SEED.notes.map(seedN => {
        const remoteN = remote.find(n => n.id === seedN.id);
        return { ...(remoteN || seedN), folderId: 'f-mur' };
      });
      const customNotes = remote.filter(n => !APP_SEED.notes.find(s => s.id === n.id));
      return [...seedNotes, ...customNotes];
    })(),
    pages: lookup.get('pages') || [],
    sectionSubmissions: [],
    chatMessages: []
  };
}

async function buildSeedAppData(ownerUserId = getDefaultUserId()) {
  return {
    ownerUserId,
    agents: APP_SEED.agents,
    chatThreads: APP_SEED.chatThreads,
    chatMessages: APP_SEED.chatMessages.filter((message) => message.ownerUserId === ownerUserId),
    feedPosts: APP_SEED.feedPosts,
    marketItems: APP_SEED.marketItems,
    events: APP_SEED.events,
    towns: APP_SEED.towns,
    mediaItems: APP_SEED.mediaItems,
    noteFolders: APP_SEED.noteFolders,
    notes: APP_SEED.notes,
    pages: APP_SEED.pages,
    sectionSubmissions: [],
    seedVersion: APP_SEED_VERSION
  };
}





















// Removed chat conversation map per lint

function mergeChatMessages(primary = [], secondary = []) {
  const map = new Map();
  [...primary, ...secondary].forEach((message) => {
    if (!message) return;
    map.set(String(message.id), message);
  });
  return Array.from(map.values()).sort((a, b) => (a.createdAtTs || 0) - (b.createdAtTs || 0));
}













async function loadStructuredSupabaseData(config, ownerUserId) {
  const safeOwnerId = ownerUserId || getDefaultUserId();
  const { tenantId } = getResolvedConfig(config);
  const [contentRows, chatThreads, chatMessages, sectionSubmissionsResponse, notesResponse] = await Promise.all([
    request(`/rest/v1/app_content?select=key,payload,version&tenant_id=eq.${encodeURIComponent(tenantId)}`, config, { signal: config.signal }),
    request(`/rest/v1/chat_threads?select=id,payload&tenant_id=eq.${encodeURIComponent(tenantId)}&limit=50`, config, { signal: config.signal }),
    request(`/rest/v1/chat_messages?select=id,owner_user_id,thread_id,message_id,text,sender,time_label,created_at&tenant_id=eq.${encodeURIComponent(tenantId)}&owner_user_id=eq.${encodeURIComponent(safeOwnerId)}&order=created_at.desc&limit=50`, config, { signal: config.signal }),
    requestMaybe(`/rest/v1/section_submissions?select=*&tenant_id=eq.${encodeURIComponent(tenantId)}&order=created_at.desc&limit=50`, config, { signal: config.signal }),
    requestMaybe(`/rest/v1/notes?select=*&tenant_id=eq.${encodeURIComponent(tenantId)}&owner_user_id=eq.${encodeURIComponent(safeOwnerId)}&order=updated_at.desc&limit=50`, config, { signal: config.signal })
  ]);

  if (!Array.isArray(contentRows) || contentRows.length === 0) {
    throw new Error('La BD remota està buida. Executa supabase/schema.sql i supabase/seed.sql.');
  }

  if (!Array.isArray(chatThreads) || chatThreads.length === 0) {
    throw new Error('Falten fils de xat en la BD remota. Executa supabase/seed.sql.');
  }

  const sectionSubmissions = Array.isArray(sectionSubmissionsResponse?.data) ? sectionSubmissionsResponse.data : [];
  const baseData = mapContentRowsToData(contentRows || []);

  const mergedFeedPosts = mergeById(baseData.feedPosts || [], sectionSubmissions.filter(s => s.section_id === 'mur').map(s => s.payload));
  const mergedMarketItems = mergeById(baseData.marketItems || [], sectionSubmissions.filter(s => s.section_id === 'mercat').map(s => s.payload));
  const mergedEvents = mergeById(baseData.events || [], sectionSubmissions.filter(s => s.section_id === 'events').map(s => s.payload));
  const mergedMediaItems = mergeById(baseData.mediaItems || [], sectionSubmissions.filter(s => s.section_id === 'multimedia').map(s => s.payload));

  const dbNotes = Array.isArray(notesResponse?.data) ? notesResponse.data.map(n => ({
    id: n.id,
    folderId: n.folder_id,
    title: n.title,
    subtitle: n.subtitle,
    lead: n.lead,
    content: n.content,
    categories: n.categories,
    tags: n.tags,
    heroImage: n.hero_image,
    logoImage: n.logo_image,
    isPublished: n.is_published,
    publishedSubmissionId: n.published_submission_id,
    revision: n.revision,
    createdAt: n.created_at,
    updatedAt: n.updated_at
  })) : [];

  const notesSource = mergeById(baseData.notes || [], dbNotes);
  const mergedNotes = mergeById(notesSource, sectionSubmissions.filter(s => s.section_id === 'notes').map(s => s.payload));

  return {
    ...baseData,
    ownerUserId,
    feedPosts: mergedFeedPosts,
    marketItems: mergedMarketItems,
    events: mergedEvents,
    mediaItems: mergedMediaItems,
    notes: mergedNotes,
    chatThreads: (chatThreads || []).map((thread) => ({ id: thread.id, ...thread.payload })),
    chatMessages: mergeChatMessages(
      (chatMessages || []).map((message) => ({
      id: message.id,
      ownerUserId: message.owner_user_id,
      threadId: message.thread_id,
      messageId: message.message_id,
      text: message.text,
      sender: message.sender,
      time: message.time_label,
      createdAtTs: message.created_at ? new Date(message.created_at).getTime() : 0
      })),
      []
    ),
    sectionSubmissions,
    seedVersion: APP_SEED_VERSION
  };
}



export async function loadAppData(ownerUserId = getDefaultUserId(), config = {}) {
  const { runtimeDataMode, hasSupabaseConfig } = getResolvedConfig(config);

  if (runtimeDataMode === 'seed') {
    return buildSeedAppData(ownerUserId);
  }

  if (!hasSupabaseConfig) {
    if (runtimeDataMode === 'remote') throw new Error('Falten VITE_SUPABASE_URL i/o VITE_SUPABASE_ANON_KEY.');
    return buildSeedAppData(ownerUserId);
  }

  return loadStructuredSupabaseData(config, ownerUserId);
}

export async function appendChatMessages(messages, config = {}) {
  const { hasSupabaseConfig, tenantId } = getResolvedConfig(config);
  
  if (!hasSupabaseConfig) {
    throw new Error('No es pot escriure xat sense connexió al servidor.');
  }

  const rows = messages.map((message) => ({
    id: String(message.id),
    tenant_id: tenantId,
    owner_user_id: message.ownerUserId || getDefaultUserId(),
    thread_id: String(message.threadId),
    message_id: String(message.messageId || message.id),
    text: message.text,
    sender: message.sender === 'me' ? 'me' : 'other',
    time_label: message.time || null,
    created_at: new Date(message.createdAtTs || Date.now()).toISOString()
  }));

  await request(`/rest/v1/chat_messages?on_conflict=${encodeURIComponent('id')}`, config, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation,resolution=merge-duplicates'
    },
    body: rows
  });

  return messages;
}

export async function appendSectionSubmissionNetworkOnly(submission, config = {}) {
  const { hasSupabaseConfig, tenantId } = getResolvedConfig(config);
  
  if (!hasSupabaseConfig) {
    throw new Error('No es pot escriure publicació sense connexió al servidor.');
  }

  const ownerUserId = submission?.ownerUserId || getDefaultUserId();
  const sectionId = String(submission?.sectionId || '').trim();
  if (!CONNECTABLE_SECTION_IDS.has(sectionId)) {
    throw new Error('Secció no suportada per a connectar.');
  }

  const id = String(submission?.id || generateUUID());
  const createdAt = submission?.createdAt || new Date().toISOString();
  const basePayload = submission?.payload && typeof submission.payload === 'object' ? submission.payload : {};
  const payload = mapSectionSubmissionToItem({
    ...submission,
    id,
    ownerUserId,
    sectionId,
    createdAt,
    payload: {
      ...basePayload,
      id,
      ownerUserId,
      sectionId,
      created_at: basePayload.created_at || createdAt
    }
  });
  
  const storedSubmission = {
    id,
    ownerUserId,
    sectionId,
    title: submission?.title || payload.title || '',
    description: submission?.description || payload.description || payload.summary || '',
    createdAt,
    payload
  };

  await request('/rest/v1/section_submissions?on_conflict=' + encodeURIComponent('id'), config, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation,resolution=merge-duplicates'
    },
    body: [
      {
        id,
        tenant_id: tenantId,
        owner_user_id: ownerUserId,
        section_id: sectionId,
        title: storedSubmission.title,
        description: storedSubmission.description,
        payload,
        created_at: createdAt
      }
    ]
  });
  
  return storedSubmission;
}

export async function updateNote(id, updates, expectedRevision, config = {}) {
  const { hasSupabaseConfig, tenantId } = getResolvedConfig(config);
  
  if (!hasSupabaseConfig) {
    throw new Error('ATURADOR CRÍTIC: No es pot actualitzar una nota sense connexió al servidor. El projecte és Online-First estricte i no permet fallbacks locals rotatoris.');
  }

  const payload = {
    folder_id: updates.folderId,
    title: updates.title,
    subtitle: updates.subtitle,
    lead: updates.lead,
    content: updates.content,
    categories: updates.categories,
    tags: updates.tags,
    hero_image: updates.heroImage,
    logo_image: updates.logoImage,
    is_published: updates.isPublished,
    published_submission_id: updates.publishedSubmissionId
  };

  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined) delete payload[key];
  });

  const revFilter = expectedRevision ? `&revision=eq.${expectedRevision}` : '';
  const response = await request(`/rest/v1/notes?id=eq.${encodeURIComponent(id)}&tenant_id=eq.${encodeURIComponent(tenantId)}${revFilter}`, config, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: payload
  });

  if (!Array.isArray(response) || response.length === 0) {
    throw new ErrorSupabase("No s'ha pogut actualitzar la nota. Conflicte de concurrència o nota no trobada (0 files afectades).", 409);
  }

  const n = response[0];
  return {
    id: n.id,
    folderId: n.folder_id,
    title: n.title,
    subtitle: n.subtitle,
    lead: n.lead,
    content: n.content,
    categories: n.categories,
    tags: n.tags,
    isPublished: n.is_published,
    publishedSubmissionId: n.published_submission_id,
    revision: n.revision,
    createdAt: n.created_at,
    updatedAt: n.updated_at
  };
}

export {
  DATA_SYNC_CHANNEL_NAME,
  getDefaultUserId,
};

export function getBackendConfigurat(config = {}) {
  return getResolvedConfig(config).hasSupabaseConfig;
}



export function getRuntimeDataMode(config = {}) {
  return getResolvedConfig(config).runtimeDataMode;
}

export function normalizeDataMode(config = {}) {
  return getResolvedConfig(config).runtimeDataMode;
}

export function getResolvedConfig(config = {}) {
  const supabaseUrl = config.supabaseUrl || '';
  const supabaseAnonKey = config.supabaseAnonKey || '';
  const tenantId = config.tenantId || '11111111-2222-3333-4444-555555555555';
  
  const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
  const dataMode = config.dataMode || 'remote';
  
  return {
    supabaseUrl,
    supabaseAnonKey,
    tenantId,
    dataMode,
    hasSupabaseConfig,
    runtimeDataMode: dataMode
  };
}


export async function listMyOrganizations(config = {}) {
  const { tenantId, hasSupabaseConfig } = getResolvedConfig(config);
  if (!hasSupabaseConfig) {
    return [];
  }
  if (!getCurrentUser()?.id) {
    return [];
  }

  const result = await request('/rest/v1/rpc/list_my_organizations', config, {
    method: 'POST',
    body: { p_tenant_id: tenantId }
  });

  return Array.isArray(result) ? result : [];
}

export async function createOrganization(organization, config = {}) {
  const { tenantId, hasSupabaseConfig } = getResolvedConfig(config);
  if (!hasSupabaseConfig) {
    throw new Error('No es pot crear una organització sense connexió al servidor.');
  }
  if (!getCurrentUser()?.id) {
    throw new Error('Cal iniciar sessió per crear una organització.');
  }

  const result = await request('/rest/v1/rpc/create_organization', config, {
    method: 'POST',
    body: {
      p_tenant_id: tenantId,
      p_kind: organization?.kind,
      p_name: organization?.name,
      p_slug: organization?.slug,
      p_description: organization?.description || '',
      p_parent_organization_id: organization?.parentOrganizationId || null
    }
  });

  return Array.isArray(result) ? result[0] : result;
}

export async function updateOrganization(id, updates, config = {}) {
  const result = await request(`/rest/v1/organizations?id=eq.${encodeURIComponent(id)}`, config, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: updates
  });

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('No s\'ha pogut actualitzar l\'organització.');
  }
  return result[0];
}

export async function getProfile(config = {}) {
  const user = getCurrentUser();
  if (!user) return null;

  const result = await request(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}`, config);
  if (!Array.isArray(result) || result.length === 0) return null;
  return result[0];
}

export async function updateProfile(updates, config = {}) {
  const user = getCurrentUser();
  if (!user) throw new Error('No hi ha sessió.');

  const result = await request(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}`, config, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: updates
  });

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('No s\'ha pogut actualitzar el perfil.');
  }
  return result[0];
}

export async function updateUserPassword(newPassword, config = {}) {
  const result = await request('/auth/v1/user', config, {
    method: 'PUT',
    body: { password: newPassword }
  });

  if (!result || result.error) {
    throw new Error(result?.error_description || 'Error en canviar contrasenya.');
  }
  return true;
}

export async function loginWithMagicLink(email, config = {}) {
  const { hasSupabaseConfig } = getResolvedConfig(config);

  if (!hasSupabaseConfig) {
    throw new Error('No hi ha connexió configurada amb el servidor Supabase. No es pot enviar l\'enllaç.');
  }

  // Obtenim la URL on hauria de tornar. Per defecte l'arrel de l'aplicació.
  const redirectUrl = window.location.origin + '/registre';

  const result = await request('/auth/v1/magiclink', config, {
    method: 'POST',
    body: {
      email: String(email || '').trim().toLowerCase(),
      gotrue_meta_security: { captcha_token: null }
    },
    // GoTrue admet redirect_to a les capçaleres o a la querystring/body depenent de la versió. Ho posem per precaució si ho suporta el proxy de request.
  });

  return result;
}

/**
 * L'anterior enviava l'usuari a Google amb `redirect_to = origin + pathname`.
 * Com que eixe origen no estava a la llista blanca, GoTrue no fallava: queia
 * al SITE_URL i l'usuari acabava sempre a socdepoble.org. I ningú llegia la
 * tornada, així que ni tan sols des d'allí s'hauria guardat la sessió.
 *
 * Ara: relé fix + PKCE + finestra emergent. Torna una promesa amb la sessió.
 */
export function loginWithGoogle(config = {}) {
  return entraAmbGoogle(config, getResolvedConfig);
}

/** Crida-la una vegada quan l'app es munte. */
export function recullTornadaOAuth(config = {}) {
  return gestionaTornada(config, getResolvedConfig);
}

export async function logout() {
  delVal('socdepoble-jwt');
  delVal('socdepoble-refresh-token');
  delVal('socdepoble-user');
  


}

export function getCurrentUser() {
  return getVal('socdepoble-user', null);
}

export async function loadCoreContent(ownerUserId = getDefaultUserId(), config = {}) {
  const { runtimeDataMode, hasSupabaseConfig, tenantId } = getResolvedConfig(config);
  const seed = await buildSeedAppData(ownerUserId);
  if (runtimeDataMode === 'seed' || !hasSupabaseConfig) {
    return { towns: seed.towns, pages: seed.pages, pageCopy: {}, agents: seed.agents, ownerUserId };
  }
  const contentRows = await request(`/rest/v1/app_content?select=key,payload,version&tenant_id=eq.${encodeURIComponent(tenantId)}`, config, { signal: config.signal });
  const baseData = mapContentRowsToData(contentRows || []);
  // En mode remot, forcem l'ús de les pàgines locals (textos legals, etc.) perquè sempre estiguen actualitzades amb el codi
  return { towns: baseData.towns, pages: seed.pages, pageCopy: {}, agents: baseData.agents, ownerUserId };
}

export async function loadMur(ownerUserId = getDefaultUserId(), config = {}) {
  const { runtimeDataMode, hasSupabaseConfig, tenantId } = getResolvedConfig(config);
  if (runtimeDataMode === 'seed' || !hasSupabaseConfig) {
    const seed = await buildSeedAppData(ownerUserId);
    return { feedPosts: seed.feedPosts, events: seed.events, marketItems: seed.marketItems };
  }
  const safeOwnerId = ownerUserId || getDefaultUserId();
  const [contentRows, submissionsResp] = await Promise.all([
    request(`/rest/v1/app_content?select=key,payload,version&tenant_id=eq.${encodeURIComponent(tenantId)}`, config, { signal: config.signal }),
    requestMaybe(`/rest/v1/section_submissions?select=*&tenant_id=eq.${encodeURIComponent(tenantId)}&order=created_at.desc&limit=50`, config, { signal: config.signal })
  ]);
  const baseData = mapContentRowsToData(contentRows || []);
  const subs = Array.isArray(submissionsResp?.data) ? submissionsResp.data : [];
  const feedPosts = mergeById(baseData.feedPosts || [], subs.filter(s => s.section_id === 'mur').map(s => s.payload));
  const marketItems = mergeById(baseData.marketItems || [], subs.filter(s => s.section_id === 'mercat').map(s => s.payload));
  const events = mergeById(baseData.events || [], subs.filter(s => s.section_id === 'events').map(s => s.payload));
  return { feedPosts, marketItems, events };
}

export async function loadMultimedia(ownerUserId = getDefaultUserId(), config = {}) {
  const { runtimeDataMode, hasSupabaseConfig, tenantId } = getResolvedConfig(config);
  if (runtimeDataMode === 'seed' || !hasSupabaseConfig) {
    const seed = await buildSeedAppData(ownerUserId);
    return { mediaItems: seed.mediaItems };
  }
  const safeOwnerId = ownerUserId || getDefaultUserId();
  const [contentRows, submissionsResp] = await Promise.all([
    request(`/rest/v1/app_content?select=key,payload,version&tenant_id=eq.${encodeURIComponent(tenantId)}`, config, { signal: config.signal }),
    requestMaybe(`/rest/v1/section_submissions?select=*&tenant_id=eq.${encodeURIComponent(tenantId)}&order=created_at.desc&limit=50`, config, { signal: config.signal })
  ]);
  const baseData = mapContentRowsToData(contentRows || []);
  const subs = Array.isArray(submissionsResp?.data) ? submissionsResp.data : [];
  const mediaItems = mergeById(baseData.mediaItems || [], subs.filter(s => s.section_id === 'multimedia').map(s => s.payload));
  return { mediaItems };
}

export async function loadXat(ownerUserId = getDefaultUserId(), config = {}) {
  const { runtimeDataMode, hasSupabaseConfig, tenantId } = getResolvedConfig(config);
  if (runtimeDataMode === 'seed' || !hasSupabaseConfig) {
    const seed = await buildSeedAppData(ownerUserId);
    return { chatThreads: seed.chatThreads, chatMessages: seed.chatMessages };
  }
  const safeOwnerId = ownerUserId || getDefaultUserId();
  const [threadsResp, msgsResp] = await Promise.all([
    request(`/rest/v1/chat_threads?select=id,payload&tenant_id=eq.${encodeURIComponent(tenantId)}&limit=50`, config, { signal: config.signal }),
    request(`/rest/v1/chat_messages?select=id,owner_user_id,thread_id,message_id,text,sender,time_label,created_at&tenant_id=eq.${encodeURIComponent(tenantId)}&owner_user_id=eq.${encodeURIComponent(safeOwnerId)}&order=created_at.desc&limit=50`, config, { signal: config.signal })
  ]);
  const chatThreads = (threadsResp || []).map((t) => ({ id: t.id, ...t.payload }));
  const chatMessages = (msgsResp || []).map(m => ({
    id: m.id,
    ownerUserId: m.owner_user_id,
    threadId: m.thread_id,
    messageId: m.message_id,
    text: m.text,
    sender: m.sender,
    time: m.time_label,
    createdAtTs: m.created_at ? new Date(m.created_at).getTime() : 0
  }));
  return { chatThreads, chatMessages };
}

export async function loadNotes(ownerUserId = getDefaultUserId(), config = {}) {
  const { runtimeDataMode, hasSupabaseConfig, tenantId } = getResolvedConfig(config);
  if (runtimeDataMode === 'seed' || !hasSupabaseConfig) {
    const seed = await buildSeedAppData(ownerUserId);
    return { notes: seed.notes, noteFolders: seed.noteFolders };
  }
  const safeOwnerId = ownerUserId || getDefaultUserId();
  const [contentRows, submissionsResp, notesResp] = await Promise.all([
    request(`/rest/v1/app_content?select=key,payload,version&tenant_id=eq.${encodeURIComponent(tenantId)}`, config, { signal: config.signal }),
    requestMaybe(`/rest/v1/section_submissions?select=*&tenant_id=eq.${encodeURIComponent(tenantId)}&order=created_at.desc&limit=50`, config, { signal: config.signal }),
    requestMaybe(`/rest/v1/notes?select=*&tenant_id=eq.${encodeURIComponent(tenantId)}&owner_user_id=eq.${encodeURIComponent(safeOwnerId)}&order=updated_at.desc&limit=50`, config, { signal: config.signal })
  ]);
  const baseData = mapContentRowsToData(contentRows || []);
  const subs = Array.isArray(submissionsResp?.data) ? submissionsResp.data : [];
  const dbNotes = Array.isArray(notesResp?.data) ? notesResp.data.map(n => ({
    id: n.id, folderId: n.folder_id, title: n.title, subtitle: n.subtitle, lead: n.lead,
    content: n.content, categories: n.categories, tags: n.tags, heroImage: n.hero_image, logoImage: n.logo_image,
    isPublished: n.is_published, publishedSubmissionId: n.published_submission_id, revision: n.revision,
    createdAt: n.created_at, updatedAt: n.updated_at
  })) : [];
  const notesSource = mergeById(baseData.notes || [], dbNotes);
  const notes = mergeById(notesSource, subs.filter(s => s.section_id === 'notes').map(s => s.payload));
  return { notes, noteFolders: baseData.noteFolders || [] };
}
```

## File: src/data/oauthRelay.js
```
/**
 * oauthRelay.js — AUTENTICACIÓ DISTRIBUÏDA SENSE LLISTA BLANCA DINÀMICA
 *
 * PROBLEMA QUE RESOL (auditoria 260829):
 *   `loginWithGoogle()` enviava l'usuari a Google amb
 *   `redirect_to = window.location.origin + pathname`. Com que eixe origen
 *   no estava a la llista blanca de Supabase, GoTrue NO fallava: queia
 *   silenciosament al `SITE_URL` del projecte i l'usuari acabava sempre a
 *   socdepoble.org, fora del seu entorn.
 *   I encara pitjor: no hi havia CAP codi a tot `src/` que llegira la
 *   tornada. Zero `location.hash`, zero `URLSearchParams`, zero bescanvi.
 *   El botó de Google era un bitllet d'anada sense estació de tornada.
 *
 * ESTRATÈGIA:
 *   Una sola adreça a la llista blanca, per sempre: el relé. L'origen que
 *   inicia el flux viatja com a paràmetre del relé, no com a `redirect_to`.
 *   El relé el valida i torna el codi. El proveïdor d'identitat no ha de
 *   conéixer mai cap `localhost`.
 *
 * PER QUÈ PKCE I NO IMPLICIT:
 *   Amb el flux implícit torna un `access_token` al fragment de la URL, que
 *   acaba a l'historial del navegador. Amb PKCE torna un codi d'un sol ús
 *   que no val res sense el verificador, i el verificador no ix mai de la
 *   pestanya que va començar el flux.
 *
 * TRES CAMINS DE TORNADA, per ordre:
 *   1. Emergent + `window.opener.postMessage` — el camí net.
 *   2. Emergent + esdeveniment `storage` — quan Google talla l'`opener` amb
 *      capçaleres COOP. Passa de veres; no és teòric.
 *   3. Redirecció completa — iPads amb emergents bloquejats.
 *   La finestra amfitriona (Sollutia, local) no navega mai fora
 *   en els casos 1 i 2.
 *
 * ⚠ A VERIFICAR CONTRA LA TEUA VERSIÓ DE GOTRUE ABANS DE DESPLEGAR:
 *   el nom del `grant_type` de bescanvi (ací `pkce`) i el nom del camp
 *   (`auth_code`). Estan a `EXCHANGE_GRANT` i `EXCHANGE_FIELD`, aïllats a
 *   propòsit. Comprova-ho amb una crida de prova; si el teu GoTrue espera
 *   noms distints, es canvien en dos llocs i prou.
 */

import { setVal, delVal, getEfimer, setEfimer, delEfimer } from '../config/storage.js';

/* ───────────────────────── Configuració ───────────────────────── */

/** L'ÚNICA adreça registrada a Supabase. Sobreescriptible per entorn. */
const RELAY_PER_DEFECTE = 'https://auth.socdepoble.org/callback';

const CLAU_VERIFICADOR = 'sdp:oauth:verificador';
const CLAU_TRASPAS = 'sdp:oauth:traspas';
const EXCHANGE_GRANT = 'pkce';
const EXCHANGE_FIELD = 'auth_code';
const TEMPS_MAXIM_MS = 180000;

const relayUrl = (config) => {
  // Bypassem el relé per defecte si estem en local perquè auth.socdepoble.org no existix al DNS
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return window.location.origin + '/callback';
  }
  return config?.oauthRelayUrl || RELAY_PER_DEFECTE;
};
const relayOrigin = (config) => new URL(relayUrl(config)).origin;

/* ───────────────────────── PKCE ───────────────────────── */

const ALFABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

export function generaVerificador(longitud = 64) {
  const bytes = new Uint8Array(longitud);
  crypto.getRandomValues(bytes);
  let eixida = '';
  for (const b of bytes) eixida += ALFABET[b % ALFABET.length];
  return eixida;
}

function base64url(buffer) {
  let bin = '';
  for (const b of new Uint8Array(buffer)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function generaRepte(verificador) {
  const dades = new TextEncoder().encode(verificador);
  return base64url(await crypto.subtle.digest('SHA-256', dades));
}

/* ───────────────────────── Bescanvi ───────────────────────── */

async function bescanvia(codi, verificador, { supabaseUrl, supabaseAnonKey }) {
  const resposta = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=${EXCHANGE_GRANT}`, {
    method: 'POST',
    headers: { apikey: supabaseAnonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ [EXCHANGE_FIELD]: codi, code_verifier: verificador })
  });

  if (!resposta.ok) {
    const cos = await resposta.text().catch(() => '');
    throw new Error(`No s'ha pogut completar l'entrada (${resposta.status}). ${cos}`);
  }

  const sessio = await resposta.json();
  if (!sessio?.access_token) throw new Error('El servidor no ha tornat cap sessió.');

  setEfimer('socdepoble-jwt', sessio.access_token);
  setEfimer('socdepoble-refresh-token', sessio.refresh_token);
  setVal('socdepoble-user', sessio.user);
  delEfimer(CLAU_VERIFICADOR);
  window.dispatchEvent(new CustomEvent('sdp:auth-change', { detail: { user: sessio.user } }));
  return sessio;
}

/* ───────────────────────── Anada ───────────────────────── */

/**
 * Obri l'entrada amb Google. Resol amb la sessió; rebutja amb un error
 * llegible. La pàgina amfitriona no navega si l'emergent s'obri.
 */
export async function entraAmbGoogle(config = {}, resolConfig) {
  const { supabaseUrl, supabaseAnonKey, hasSupabaseConfig } = resolConfig(config);
  if (!hasSupabaseConfig) throw new Error('L\'entrada amb Google necessita connexió amb Supabase.');

  // Circuit Breaker per evitar bucles de redirecció cap a l'autenticació
  const clauCb = 'sdp:oauth:cb';
  const intentsCb = getEfimer(clauCb, { count: 0, time: Date.now() });
  if (Date.now() - intentsCb.time > 60000) {
    intentsCb.count = 1;
    intentsCb.time = Date.now();
  } else {
    intentsCb.count += 1;
  }
  setEfimer(clauCb, intentsCb);
  
  if (intentsCb.count > 4) {
    throw new Error('Massa intents d\'inici de sessió seguits. Circuit Breaker activat. Espera un minut.');
  }

  // Obertura síncrona per evitar bloqueig a Safari (Safari matarà el popup si ve després d'un await)
  const emergent = window.open('', 'sdp-oauth', 'width=520,height=680');

  const verificador = generaVerificador();
  const repte = await generaRepte(verificador);
  setEfimer(CLAU_VERIFICADOR, verificador);

  // Si estem en localhost, bypass del relay (usem la URL actual per tornar directament ací)
  const isLocal = window.location.hostname === 'localhost';
  const destiRelay = isLocal 
    ? `${window.location.origin}${window.location.pathname}`
    : `${relayUrl(config)}?sdp_origin=${encodeURIComponent(window.location.origin)}&sdp_path=${encodeURIComponent(window.location.pathname)}`;
  
  const url = `${supabaseUrl}/auth/v1/authorize`
    + `?provider=google`
    + `&code_challenge=${encodeURIComponent(repte)}`
    + `&code_challenge_method=S256`
    + `&redirect_to=${encodeURIComponent(destiRelay)}`;

  // Camí 3: emergent bloquejat. Redirecció completa.
  if (!emergent) {
    window.location.href = url;
    return new Promise(() => {}); // Penjarà a propòsit perquè ja naveguem.
  }

  try {
    emergent.location.href = url;
  } catch {
    // Fallback extrem si el navegador bloqueja mutar l'emergent
    window.location.href = url;
    return new Promise(() => {});
  }

  return esperaCodi(emergent, config)
    .then((codi) => bescanvia(codi, verificador, { supabaseUrl, supabaseAnonKey }))
    .finally(() => delEfimer(CLAU_VERIFICADOR));
}

/**
 * Escolta les dues vies de tornada de l'emergent alhora.
 */
function esperaCodi(emergent, config) {
  return new Promise((resol, rebutja) => {
    const origenRelay = relayOrigin(config);
    let acabat = false;

    const neteja = () => {
      window.removeEventListener('message', perMissatge);
      window.removeEventListener('storage', perStorage);
      clearInterval(vigilant);
      clearTimeout(rellotge);
      delVal(CLAU_TRASPAS);
    };
    const acaba = (fn, valor) => { if (acabat) return; acabat = true; neteja(); fn(valor); };

    // Camí 1 — l'emergent ha tornat a l'origen de l'app i ens parla.
    function perMissatge(e) {
      if (e.origin !== origenRelay && e.origin !== window.location.origin) return; // Validació estricta
      if (e.source !== emergent) return;
      const d = e.data;
      if (!d || d.type !== 'sdp:oauth') return;
      if (d.error) return acaba(rebutja, new Error(d.error));
      if (d.code) acaba(resol, d.code);
    }

    // Camí 2 — Google ha tallat l'`opener` amb COOP. L'emergent deixa el
    // codi a l'emmagatzematge del nostre origen i açò el replega.
    function perStorage(e) {
      if (e.key !== CLAU_TRASPAS || !e.newValue) return;
      try {
        const d = JSON.parse(e.newValue);
        if (d?.error) return acaba(rebutja, new Error(d.error));
        if (d?.code) acaba(resol, d.code);
      } catch { /* valor malmés: s'ignora */ }
    }

    const vigilant = setInterval(() => {
      try {
        if (emergent.closed) acaba(rebutja, new Error('S\'ha tancat la finestra abans d\'acabar d\'entrar.'));
      } catch {
        // Bloqueig de COOP. No podem accedir a emergent.closed, confiem en storage o timeout.
      }
    }, 700);

    const rellotge = setTimeout(() => {
      try { emergent.close(); } catch { /* ja tancada */ }
      acaba(rebutja, new Error('L\'entrada ha tardat massa. Torna a provar.'));
    }, TEMPS_MAXIM_MS);

    window.addEventListener('message', perMissatge);
    window.addEventListener('storage', perStorage);
  });
}

/* ───────────────────────── Tornada ───────────────────────── */

/**
 * Crida-la UNA vegada quan l'app es munte, abans de pintar res.
 *
 * Resol tres situacions:
 *   a) Som l'emergent que acaba de tornar del relé → passem el codi a la
 *      finestra mare i ens tanquem.
 *   b) Som la finestra principal després d'una redirecció completa → bescanviem.
 *   c) No hi ha res al fragment → no fem res.
 */
export async function gestionaTornada(config = {}, resolConfig) {
  if (typeof window === 'undefined') return null;

  const qSearch = new URLSearchParams(window.location.search);
  const qHash = new URLSearchParams(window.location.hash.substring(1));
  
  const codi = qSearch.get('sdp_code') || qSearch.get('code') || qHash.get('sdp_code') || qHash.get('code');
  const error = qSearch.get('sdp_oauth_error') || qSearch.get('error') || qSearch.get('error_description') || qHash.get('sdp_oauth_error') || qHash.get('error') || qHash.get('error_description');
  if (!codi && !error) return null;

  const somEmergent = (() => {
    try { return window.opener && window.opener !== window; } catch { return false; }
  })();

  // (a) Som l'emergent: no bescanviem ací — el verificador viu a la mare.
  if (somEmergent || window.name === 'sdp-oauth') {
    netejaRetorn();
    const carrega = error ? { type: 'sdp:oauth', error } : { type: 'sdp:oauth', code: codi };
    try {
      window.opener.postMessage(carrega, window.location.origin);
    } catch {
      // COOP ens ha tallat l'`opener`. Via storage.
      setVal(CLAU_TRASPAS, { ...carrega, t: Date.now() });
    }
    if (!window.opener) setVal(CLAU_TRASPAS, { ...carrega, t: Date.now() });
    setTimeout(() => { try { window.close(); } catch { /* ignora */ } }, 60);
    return null;
  }

  // (b) Finestra principal després de redirecció completa.
  if (error) {
    netejaRetorn();
    throw new Error(error);
  }

  const verificador = getEfimer(CLAU_VERIFICADOR, null);
  if (!verificador) {
    netejaRetorn();
    throw new Error('S\'ha perdut el verificador d\'esta entrada. Torna a començar des del botó d\'entrar.');
  }
  const { supabaseUrl, supabaseAnonKey } = resolConfig(config);
  return bescanvia(codi, verificador, { supabaseUrl, supabaseAnonKey }).finally(() => netejaRetorn());
}

function netejaRetorn() {
  const u = new URL(window.location.href);
  u.searchParams.delete('sdp_code');
  u.searchParams.delete('sdp_oauth_error');
  u.searchParams.delete('code');
  u.searchParams.delete('error');
  u.searchParams.delete('error_description');
  
  if (u.hash.includes('code=') || u.hash.includes('sdp_code=') || u.hash.includes('error=')) {
    u.hash = '';
  }
  
  window.history.replaceState(null, '', u.pathname + u.search + u.hash);
}

/** Utilitat per a proves i per al tractor. */
export const _intern = { CLAU_VERIFICADOR, CLAU_TRASPAS, relayOrigin, base64url };
```

## File: public/auth/callback.html
```
<!doctype html>
<html lang="ca">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Tornant a Sóc de Poble</title>
<!--
  RELÉ D'AUTENTICACIÓ · SÓC DE POBLE
  ==================================
  Aquest fitxer és l'ÚNICA adreça que ha d'estar a la llista blanca de
  Supabase. Mai canvia. Els `localhost`, els entorns de Sollutia i el
  WordPress de proves no hi apareixen mai: el proveïdor d'identitat no els
  ha de conéixer.

  QUÈ FA:
    1. Rep `?code=` de Supabase (flux PKCE).
    2. Llig `?sdp_origin=` — d'on venia la petició.
    3. VALIDA eixe origen contra la llista d'ací baix, per igualtat exacta.
    4. Torna el codi a eixe origen.

  QUÈ NO FA:
    No veu mai el `code_verifier`. No veu mai un token. Si algú es fa amb el
    codi que passa per ací, no li servix de res: sense el verificador —que no
    ix mai de la pestanya que va iniciar el flux— no es pot bescanviar.

  SEGURETAT — LLIG AÇÒ ABANS DE TOCAR RES:
    ORÍGENS_PERMESOS es compara amb `===`. Mai amb `startsWith`, `includes`
    ni expressions regulars. Un `startsWith('https://socdepoble')` acceptaria
    `https://socdepoble.atacant.com` i convertiria aquest fitxer en un
    redirector obert. Això és robatori de sessions.

  DESPLEGAMENT:
    Servix-lo com a fitxer estàtic a https://auth.socdepoble.org/callback
    (ÚNICA font de veritat: RELAY_PER_DEFECTE de src/data/oauthRelay.js.
     Ho verifica tooling/gates/tractor-frontera-auth.mjs.)
    i registra EIXA adreça (i només eixa) a Supabase › Authentication ›
    URL Configuration › Redirect URLs. A Google Cloud Console no cal tocar
    res: allí ja hi ha el callback de Supabase.
-->
<style>
  :root { --sp-taronja: #FF7300; --sp-blau: #0984E3; --sp-negre: #000000; --sp-blanc: #FFFFFF; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    background: var(--sp-blanc); color: var(--sp-negre);
    font-family: "Noto Sans", system-ui, sans-serif; font-size: 18px; line-height: 1.5;
    padding: 24px;
  }
  main { max-width: 34rem; }
  h1 { font-size: 22px; font-weight: 700; margin: 0 0 12px; }
  p { margin: 0 0 16px; }
  .marca { width: 56px; height: 8px; background: var(--sp-taronja); margin-bottom: 20px; }
  code { background: #000; color: #fff; padding: 2px 6px; font-size: 16px; }
  a.tornar {
    display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px;
    background: var(--sp-blau); color: var(--sp-blanc); text-decoration: none; font-weight: 700;
  }
  a.tornar:focus-visible { outline: 4px solid var(--sp-taronja); outline-offset: 3px; }
  [hidden] { display: none !important; }
  @media (prefers-reduced-motion: no-preference) {
    .esperant { animation: batec 1.4s ease-in-out infinite; }
    @keyframes batec { 0%,100% { opacity: 1 } 50% { opacity: .45 } }
  }
</style>
</head>
<body>
<main>
  <div class="marca" aria-hidden="true"></div>
  <div id="esperant" class="esperant">
    <h1>Tornant al teu poble…</h1>
    <p>Tanca't sola, esta finestra. Si no ho fa en uns segons, tanca-la tu.</p>
  </div>
  <div id="error" hidden role="alert">
    <h1 id="error-titol">No s'ha pogut completar l'entrada</h1>
    <p id="error-cos"></p>
    <a class="tornar" id="error-tornar" href="/" hidden>Tornar a provar</a>
  </div>
</main>

<script>
(function () {
  'use strict';

  /* ─── LLISTA BLANCA D'ORÍGENS ───
     Afegix ací cada entorn nou. Igualtat exacta, sense barra final. */
  var ORIGENS_PERMESOS = [
    /* ── Domini propi ── */
    'https://socdepoble.cat',
    'https://www.socdepoble.cat',
    'https://socdepoble.org',
    'https://www.socdepoble.org',

    /* ── Amfitrions de Sollutia ──────────────────────────────────────────
       CADA WordPress on s'incrusta el component és un origen distint, i cap
       origen absent d'esta llista pot entrar amb Google. Fins que no
       s'òmpliga, l'entrada només funciona als dominis propis i en local.

       Afegix ací l'origen EXACTE de cada desplegament, sense barra final i
       amb el port si en té. Un per línia. Res de comodins.

       Exemple:
         'https://elrentonar.example',
         'https://poble.clientdesollutia.example',
    ── */
    // ← AFIG ACÍ ELS ORÍGENS DE SOLLUTIA
    'https://puebli.es',
    'https://www.puebli.es',

    /* ── Desenvolupament local. Ports fixos, mai comodins. ── */
    'http://localhost:3340',
    'http://localhost:5173',
    'http://127.0.0.1:3340'
  ];

  var params = new URLSearchParams(window.location.search);
  var codi = params.get('code');
  var origen = params.get('sdp_origin');
  /* `sdp_path` és tan controlable per l'atacant com `sdp_origin`, i fins a la
     V7.1 només se li forçava una barra inicial. No pot creuar d'origen (el
     host ja el fixa `origen`), però un `#` dins seu trencava el fragment i
     matava l'entrada en silenci, i un `//` inicial obri camins protocol-relatius.
     Ara: només camí, i qualsevol cosa dubtosa cau a l'arrel. */
  var path = params.get('sdp_path') || '';
  if (path) {
    if (path.charAt(0) !== '/') path = '/' + path;
    var camiValid = path.indexOf('#') === -1
      && path.indexOf('\\') === -1
      && path.indexOf('..') === -1
      && path.slice(0, 2) !== '//'
      && path.length <= 512;
    if (!camiValid) path = '/';
  }
  var errProveidor = params.get('error_description') || params.get('error');

  function mostraError(titol, cos, urlTornar) {
    document.getElementById('esperant').hidden = true;
    var box = document.getElementById('error');
    document.getElementById('error-titol').textContent = titol;
    document.getElementById('error-cos').textContent = cos;
    if (urlTornar) {
      var a = document.getElementById('error-tornar');
      a.href = urlTornar;
      a.hidden = false;
    }
    box.hidden = false;
  }

  if (!origen || ORIGENS_PERMESOS.indexOf(origen) === -1) {
    mostraError(
      'Origen no reconegut',
      'Esta petició diu vindre de «' + (origen || 'cap lloc') + '», que no és un entorn registrat de Sóc de Poble. ' +
      'Per seguretat no es torna res. Si és un entorn nou, afegix-lo a la llista del relé.'
    );
    return;
  }

  if (errProveidor) {
    window.location.replace(origen + path + '#sdp_oauth_error=' + encodeURIComponent(errProveidor));
    return;
  }

  if (!codi) {
    mostraError('Falta el codi d\u2019entrada', 'El proveïdor no ha tornat cap codi. Torna a provar des de l\u2019aplicació.', origen);
    return;
  }

  /* El codi torna a l'origen validat pel fragment de la URL.
     Fragment i no query: els fragments no viatgen mai al servidor, ni als
     seus registres. A partir d'ací ja estem al domini de l'app, que sap
     acabar la faena (té el verificador). */
  window.location.replace(origen + path + '#sdp_code=' + encodeURIComponent(codi));
})();
</script>
</body>
</html>
```

## File: package.json
```
{
  "name": "socdepoble-react",
  "version": "1.0.0",
  "type": "module",
  "sideEffects": [
    "*.css",
    "src/PedraSecaEmbed.jsx",
    "src/main.jsx"
  ],
  "scripts": {
    "despertar": "node tooling/brain/despertar.mjs",
    "porta:arrel": "node tooling/gates/tractor-arrel.mjs",
    "porta:graella": "node tooling/gates/tractor-graella.mjs",
    "porta:enxufe": "node tooling/gates/tractor-enxufe.mjs",
    "porta:maquinari": "node tooling/gates/tractor-doctrina-maquinari.mjs",
    "porta:build": "node tooling/gates/tractor-build-previ.mjs",
    "porta:segella": "node tooling/gates/segella.mjs",
    "deute:revisa": "node tooling/brain/consolidar_baselines.mjs --revisa",
    "tancar": "node tooling/gates/tancament.mjs",
    "porta:shim": "node tooling/gates/tractor-shim.mjs",
    "porta:consell": "node tooling/gates/tractor-consell.mjs",
    "porta:cens": "node tooling/gates/tractor-cens.mjs",
    "porta:rutes": "node tooling/gates/tractor-rutes.mjs",
    "porta:rutes-web": "node tooling/gates/tractor-rutes-web.mjs",
    "porta:vocabulari": "node tooling/gates/tractor-vocabulari.mjs",
    "porta:tdz": "node tooling/gates/tractor-tdz.mjs",
    "porta:cromatic": "node tooling/gates/tractor-cromatic.mjs",
    "porta:tokens": "node tooling/gates/tractor-tokens.mjs",
    "porta:baseline": "node tooling/brain/tractor-pedra-seca.mjs --baseline && node tooling/gates/design_guard.mjs --baseline && node tooling/gates/tractor-vocabulari.mjs --baseline && node tooling/gates/tractor-promesa.mjs --baseline && node tooling/wiki/teixidor.mjs --baseline",
    "porta:promesa": "node tooling/gates/tractor-promesa.mjs",
    "porta:frontera": "node tooling/gates/tractor-sollutia.mjs",
    "porta:estucat": "node tooling/gates/tractor-estucat.mjs --arrel=.",
    "porta:teixit": "node tooling/wiki/teixidor.mjs",
    "porta:doctrina": "node tooling/gates/tractor-doctrina.mjs",
    "porta:innerhtml": "node tooling/gates/tractor-innerhtml.mjs",
    "porta:manifest": "node tooling/gates/tractor-manifest.mjs",
    "porta:persistencia": "node tooling/gates/tractor-persistencia.mjs",
    "porta:registre": "node tooling/gates/tractor-registre.mjs",
    "porta:cadena": "node tooling/gates/tractor-cadena.mjs",
    "porta:scc": "node tooling/gates/verificador-scc.mjs",
    "porta:reflex": "node tooling/wiki/reflex_petorreta.mjs doctor --ci",
    "torn:obrir": "node tooling/gates/obrir_torn.mjs",
    "porta:cognitiu": "node tooling/wiki/tractor-cognitiu.mjs --arrel=.",
    "porta:pedra-seca": "node tooling/brain/tractor-pedra-seca.mjs",
    "porta:design-guard": "node tooling/gates/design_guard.mjs --arrel=src",
    "porta:llaurador": "node tooling/wiki/llaurador_indexs.mjs --check",
    "porta:frontmatter": "node tooling/wiki/tractor-frontmatter.mjs",
    "porta:seo": "node tooling/gates/build-seo-manifest.mjs --verifica",
    "porta:frontera-auth": "node tooling/wiki/tractor-frontera-auth.mjs",
    "porta:esquemes": "node tooling/wiki/tractor-esquemes.mjs",
    "skills:index": "node tooling/brain/build_skills_index.mjs",
    "porta:matrix": "node tooling/brain/matrix.mjs --check",
    "porta": "node tooling/gates/run-portes.mjs",
    "gate": "npm run porta",
    "dev": "vite --host 0.0.0.0 --port 3340 --strictPort",
    "rag:build": "node -e \"import('./tooling/wiki/core/build_rag_index.mjs').then(m => m.run({root: '.'}))\"",
    "slugs:build": "node tooling/wiki/core/build_slug_index.mjs",
    "bundle": "node tooling/brain/crear_bundle.mjs",
    "build": "npm run build:tokens && npm run build:seo && npm run rag:build && npm run slugs:build && npm run build:web && npm run gate",
    "build:tokens": "node tooling/scripts/build-tokens.mjs",
    "build:seo": "node tooling/gates/build-seo-manifest.mjs --escriu",
    "build:web": "vite build",
    "build:wp": "vite build -c vite.standalone.config.js",
    "prepare": "husky",
    "preview": "vite preview --host 0.0.0.0",
    "db:seed:generate": "sh scripts/generate-supabase-seed.sh",
    "brain:maintain": "sh tooling/brain/maintain.sh .",
    "brain:distill": "python3 tooling/brain/brain_distill.py",
    "pdf:render": "sh tooling/pdf/render_pdf.sh",
    "test": "vitest",
    "lint": "eslint src tooling scripts",
    "porta:llavor": "node tooling/gates/tractor-llavor.mjs"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.112.4",
    "@tiptap/react": "^3.31.0",
    "@tiptap/starter-kit": "^3.31.0",
    "dompurify": "^3.4.14",
    "lucide-react": "^1.35.0",
    "postcss-prefix-selector": "^2.1.1",
    "preact": "^10.29.8",
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "react-router-dom": ">=6.0.0"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "react-router-dom": ">=6.0.0"
  },
  "devDependencies": {
    "@babel/parser": "^8.0.4",
    "@eslint/js": "^9.39.5",
    "@testing-library/react": "^16.3.2",
    "@vitejs/plugin-react": "^5.1.1",
    "css": "^3.0.0",
    "eslint": "^9.39.5",
    "eslint-plugin-react": "^7.37.5",
    "globals": "^17.9.0",
    "husky": "^9.1.7",
    "jsdom": "^29.1.1",
    "vite": "^7.1.0",
    "vitest": "^4.1.10"
  },
  "engines": {
    "node": ">=20"
  },
  "private": true
}
```

Fí del minibundle.
