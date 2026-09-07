import re

with open('supabase/schema.sql', 'r') as f:
    content = f.read()

# 1. Modify public.profiles (remove default now() for consentiment_rgpd_at)
content = content.replace(
    "consentiment_rgpd_at timestamptz not null default now(),",
    "consentiment_rgpd_at timestamptz,"
)
content = content.replace(
    "alter table public.profiles add column if not exists consentiment_rgpd_at timestamptz not null default now();",
    "alter table public.profiles add column if not exists consentiment_rgpd_at timestamptz;"
)

# 2. Add private.ajustos
ajustos_table = """
create table if not exists private.ajustos (
  clau text primary key,
  valor text not null
);
"""
if 'private.ajustos' not in content:
    content = content.replace(
        "create table if not exists public.town_memberships",
        ajustos_table + "\ncreate table if not exists public.town_memberships"
    )

# 3. Add public.user_platform_roles and public.organization_claims
new_tables = """
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

"""
if 'public.user_platform_roles' not in content:
    content = content.replace(
        "create index if not exists idx_organizations_tenant_kind",
        new_tables + "\ncreate index if not exists idx_organizations_tenant_kind"
    )

# 4. Remove idx_organization_memberships_one_owner
content = re.sub(r"create unique index if not exists idx_organization_memberships_one_owner[\s\S]*?role = 'owner';", "", content)

# 5. Replace sdp_protegeix_propietari
old_protegeix = """create or replace function public.sdp_protegeix_propietari() returns trigger
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
$$;"""

new_protegeix = """create or replace function private.comprova_una_propietaria() returns trigger
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
  if v_n <> 1 then
    raise exception 'SDP-LOCK: l''organització % ha de tindre exactament 1 propietària (en té %).',
      v_org, v_n using errcode = '23514';
  end if;
  return null;
end;
$$;"""
content = content.replace(old_protegeix, new_protegeix)

content = content.replace("drop trigger if exists sdp_protegeix_propietari on public.organization_memberships;", "drop trigger if exists sdp_una_propietaria on public.organization_memberships;")
content = content.replace(
"""create trigger sdp_protegeix_propietari
  before delete or update on public.organization_memberships
  for each row execute function public.sdp_protegeix_propietari();""",
"""create constraint trigger sdp_una_propietaria
  after insert or update or delete on public.organization_memberships
  deferrable initially deferred
  for each row execute function private.comprova_una_propietaria();"""
)

# 6. Replace handle_new_user
old_handle = """create or replace function public.handle_new_user()
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
$$;"""

new_handle = """create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_tenant uuid;
  v_rgpd   boolean;
begin
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

  if not exists (select 1 from public.towns t where t.id = v_tenant) then
    raise exception 'SDP-REG-003: el poble % no existix.', v_tenant
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

  return new;
end;
$$;"""
content = content.replace(old_handle, new_handle)

# 7. Add es_superadmin and claims functions
new_functions = """
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
"""
if 'private.es_superadmin()' not in content:
    content = content.replace(
        "create or replace function private.is_organization_member(p_organization_id uuid)",
        new_functions + "\ncreate or replace function private.is_organization_member(p_organization_id uuid)"
    )

# 8. Modify create_organization
content = content.replace(
    "begin\n  if v_user_id is null then",
    "begin\n  if p_kind in ('entity', 'city_hall') then\n    raise exception 'Les entitats i els ajuntaments no es creen: es reclamen.' using errcode = '42501';\n  end if;\n\n  if v_user_id is null then"
)
content = re.sub(r"insert into public\.town_memberships[\s\S]*?do nothing;\n", "", content)

# 9. Fix list_my_organizations and create_organization return lema
content = content.replace(
    "parent_organization_id,\n    description,",
    "parent_organization_id,\n    lema,\n    description,"
)
content = content.replace(
    "parent_organization_id uuid,\n  description text,",
    "parent_organization_id uuid,\n  lema text,\n  description text,"
)

# 10. Fix Grants and policies
content = re.sub(r"grant insert \(town_id, user_id, role\) on table public.town_memberships to authenticated;\n", "", content)
content = re.sub(r"drop policy if exists \"user insert own membership\"[\s\S]*?\);\n", "", content)

new_grants_policies = """
alter table public.user_platform_roles enable row level security;
revoke all on table public.user_platform_roles from anon, authenticated;
grant select on table public.user_platform_roles to authenticated;

create policy "llig el propi rol" on public.user_platform_roles for select to authenticated
using (user_id = (select auth.uid()));

alter table public.organization_claims enable row level security;
revoke all on table public.organization_claims from anon, authenticated;
grant select on table public.organization_claims to authenticated;

create policy "llig les propies reclamacions" on public.organization_claims
for select to authenticated
using (user_id = (select auth.uid()) or (select private.es_superadmin()));

grant update (name, lema, description, visibility) on table public.organizations to authenticated;

create policy "gestores actualitzen l'organització" on public.organizations
for update to authenticated
using       ((select private.can_manage_organization(id)))
with check  ((select private.can_manage_organization(id)));

"""
content = content + "\n" + new_grants_policies

# Drop guest chat policies
content = re.sub(r"drop policy if exists \"public read guest chat_threads\"[\s\S]*?'00000000-0000-0000-0000-000000000000'\);\n", "", content)
content = re.sub(r"drop policy if exists \"public read guest chat_messages\"[\s\S]*?'00000000-0000-0000-0000-000000000000'\);\n", "", content)

with open('supabase/schema.sql', 'w') as f:
    f.write(content)
