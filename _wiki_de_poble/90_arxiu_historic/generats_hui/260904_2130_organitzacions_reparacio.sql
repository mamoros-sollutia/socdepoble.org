-- ═══════════════════════════════════════════════════════════════════════
-- 260904_2130_organitzacions_reparacio.sql
--
-- Repara les tres P0 detectades a l'auditoria del bundle 260904_2042.
-- Idempotent. Es pot tornar a passar sense efectes secundaris.
--
--   P0-1  list_my_organizations no arriba a crear-se (12 declarades / 11 projectades).
--   P0-2  organizations no té grant ni policy d'UPDATE: escriptura única.
--   P0-3  organization_memberships només té grant select: no es poden gestionar membres.
--   P1-4  create_organization torna dues formes distintes (RETURNING sense lema).
--   P1-5  kind='entity'/'city_hall': validats per l'RPC i rebutjats per l'RLS.
--
-- LLEI D'ESTA MIGRACIÓ
--   No obri cap porta nova de privilegi. Només fa que el que ja estava
--   declarat com a possible ho siga de veres, i que el que és impossible
--   ho diga amb una frase i no amb un error opac d'RLS.
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- P0-1 · list_my_organizations: faltava lema al SELECT.
-- ───────────────────────────────────────────────────────────────────────
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

-- ───────────────────────────────────────────────────────────────────────
-- P0-2 · organizations editable pels qui l'administren.
--
--   Només name, lema i description. slug, kind, tenant_id i created_by
--   són identitat: no es toquen des del client. El WITH CHECK ho garantix
--   comparant amb la fila anterior.
-- ───────────────────────────────────────────────────────────────────────
grant update (name, lema, description) on table public.organizations to authenticated;

drop policy if exists "managers update own organizations" on public.organizations;
create policy "managers update own organizations" on public.organizations for update to authenticated
using ((select private.can_manage_organization(id)))
with check ((select private.can_manage_organization(id)));

-- Barana: cap UPDATE pot moure la identitat de la fila, encara que algú
-- afegisca un grant de columna per error en el futur.
create or replace function private.protegeix_identitat_organitzacio()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
     or new.tenant_id is distinct from old.tenant_id
     or new.slug is distinct from old.slug
     or new.kind is distinct from old.kind
     or new.parent_organization_id is distinct from old.parent_organization_id
     or new.created_by is distinct from old.created_by
     or new.visibility is distinct from old.visibility
  then
    raise exception 'La identitat d''una organització no es pot canviar.' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_organitzacio_identitat on public.organizations;
create trigger trg_organitzacio_identitat
before update on public.organizations
for each row execute function private.protegeix_identitat_organitzacio();

-- ───────────────────────────────────────────────────────────────────────
-- P0-3 · gestió de membres.
--
--   Qui administra pot afegir i llevar membres i canviar-los el rol,
--   però mai crear ni tocar un 'owner': la propietat es transferix amb
--   un procediment propi, no amb un UPDATE de fila.
-- ───────────────────────────────────────────────────────────────────────
grant insert (organization_id, tenant_id, user_id, role) on table public.organization_memberships to authenticated;
grant update (role) on table public.organization_memberships to authenticated;
grant delete on table public.organization_memberships to authenticated;

drop policy if exists "managers add members" on public.organization_memberships;
create policy "managers add members" on public.organization_memberships for insert to authenticated
with check (
  (select private.can_manage_organization(organization_id))
  and role in ('admin', 'member')
);

drop policy if exists "managers change member role" on public.organization_memberships;
create policy "managers change member role" on public.organization_memberships for update to authenticated
using (
  (select private.can_manage_organization(organization_id))
  and role in ('admin', 'member')
)
with check (
  (select private.can_manage_organization(organization_id))
  and role in ('admin', 'member')
);

drop policy if exists "managers remove members" on public.organization_memberships;
create policy "managers remove members" on public.organization_memberships for delete to authenticated
using (
  (select private.can_manage_organization(organization_id))
  and role <> 'owner'
);

-- Cadascú pot eixir-se'n pel seu compte, tret que en siga el propietari.
drop policy if exists "member leaves organization" on public.organization_memberships;
create policy "member leaves organization" on public.organization_memberships for delete to authenticated
using (user_id = (select auth.uid()) and role <> 'owner');

-- ───────────────────────────────────────────────────────────────────────
-- P1-4 · create_organization torna sempre la mateixa forma.
--
--   Es reescriu només el tram del RETURNING afegint lema. La resta del
--   cos es manté idèntica: ho fa el bloc de baix reemplaçant la funció
--   sencera amb el mateix contingut més la columna que faltava.
-- ───────────────────────────────────────────────────────────────────────
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

  -- P1-5 · La validació diu el mateix que l'RLS. 'entity' i 'city_hall'
  -- són provisionats per l'administració del portal, no pel veïnat: abans
  -- açò passava la validació i queia amb un error opac d'RLS.
  if p_kind is null or p_kind not in ('company', 'group') then
    if p_kind in ('entity', 'city_hall') then
      raise exception 'Les entitats i els ajuntaments els dona d''alta l''administració del portal.' using errcode = '42501';
    end if;
    raise exception 'El tipus d''organització no és vàlid.' using errcode = '22023';
  end if;

  if char_length(v_name) < 2 or v_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'El nom o l''identificador de l''organització no és vàlid.' using errcode = '22023';
  end if;

  if not exists (select 1 from public.towns town where town.id = p_tenant_id) then
    raise exception 'El poble indicat no existeix.' using errcode = '22023';
  end if;

  if p_kind = 'company' and p_parent_organization_id is not null then
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
      raise exception 'L''identificador ja pertany a una altra organització.' using errcode = '23505';
    end if;
    return to_jsonb(v_organization);
  end if;

  insert into public.organizations (
    tenant_id, slug, name, kind, parent_organization_id,
    lema, description, visibility, created_by
  ) values (
    p_tenant_id, v_slug, v_name, p_kind, p_parent_organization_id,
    v_lema, v_description, 'public', v_user_id
  )
  returning
    id, tenant_id, slug, name, kind, parent_organization_id,
    lema, description, visibility, created_at, updated_at
  into v_organization;

  return to_jsonb(v_organization);
end;
$$;

revoke execute on function public.create_organization(uuid, text, text, text, text, text, uuid) from public;
revoke execute on function public.create_organization(uuid, text, text, text, text, text, uuid) from anon;
grant execute on function public.create_organization(uuid, text, text, text, text, text, uuid) to authenticated;
