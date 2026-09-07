---
tipus: estudi
estat: esborrany
description: "Pla tècnic Fase 3 per Perplexity"
---

# 🛡️ Pla tècnic — Fase 3: Sollutia (Auditoria Perplexity)

## Veredicte
El front-end ja té una base sòlida per a la Fase 3:
- Autenticació per correu i Google.
- Persistència de tokens amb claus efímeres.
- Model d’identitats separat entre perfil personal i organitzacions.
- Rutes conceptuals compatibles amb `/jo` i `/e/:slug`.
- Capa d’accés abstracta mitjançant `backendPort.js`.
- Esquema Supabase amb `profiles`, `organizations`, `organization_memberships`, `towns` i RLS.

No cal redissenyar l’arquitectura. Cal consolidar-la, corregir alguns riscos de seguretat i completar el flux de propietat d’entitats.
El bundle confirma que l’aplicació és estrictament Online-First: el front-end actua com a terminal de Supabase, no com a sistema Local-First ni Offline-First. La persistència de negoci no s’ha de fer en localStorage, IndexedDB ni cues locals.

## 1. Arquitectura proposada

| Identitat | Ruta | Persistència | Visibilitat |
| :--- | :--- | :--- | :--- |
| Persona | `/jo` | `profiles` + `auth.users` | Privada |
| Empresa | `/e/:slug` | `organizations` | Pública o restringida |
| Entitat | `/e/:slug` | `organizations` | Pública o restringida |
| Ajuntament | `/e/:slug` | `organizations` | Alta controlada |
| Grup | `/e/:slug` | `organizations` amb pare | Vinculat a una organització |

La identitat personal no ha de convertir-se en una organització. Una persona pot administrar diverses organitzacions i una organització pot tindre diversos membres.

**Principis**
- `auth.users` és propietat de Supabase Auth.
- `profiles.id` coincideix amb `auth.users.id`.
- Cap rol privilegiat es desa en el client.
- La propietat es determina mitjançant `organization_memberships`.
- Els permisos reals els imposa RLS i les funcions PostgreSQL.
- El client només utilitza les dades de sessió per a pintar UI.
- Els tokens d’autenticació poden persistir segons l’estratègia actual, però mai les dades de negoci.
- El bundle ja aplica aquesta separació: els components React passen per `backendPort.js` i no importen directament l’adaptador Supabase.

## 2. Esquema SQL recomanat
L’esquema existent és aprofitable. Aquesta és la forma canònica que ha de quedar documentada.

**Perfil personal**
```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  fullname text not null check (char_length(btrim(fullname)) between 1 and 120),
  visibility text not null default 'private' check (visibility = 'private'),
  consentiment_rgpd_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
```
El perfil ha de crear-se automàticament quan naix un usuari de Supabase Auth.

**Organitzacions**
```sql
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.towns(id) on delete restrict,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  kind text not null check (kind in ('company', 'group', 'entity', 'cityhall')),
  parent_organization_id uuid,
  lema text not null default '' check (char_length(lema) <= 120),
  description text not null default '' check (char_length(description) <= 500),
  visibility text not null default 'public' check (visibility in ('public', 'members')),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug),
  foreign key ( tenant_id, parent_organization_id ) references public.organizations(tenant_id, id) on delete restrict,
  check ( kind = 'group' or parent_organization_id is null )
);
```

**Membres i rols**
```sql
create table if not exists public.organization_memberships (
  organization_id uuid not null,
  tenant_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id),
  foreign key (tenant_id, organization_id) references public.organizations(tenant_id, id) on delete cascade
);
```

**Superadministrador**
No recomane guardar superadmin en profiles ni confiar en user_metadata.
Esquema recomanat:
```sql
create table if not exists private.global_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('superadmin', 'moderator')),
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now()
);
alter table private.global_roles enable row level security;
revoke all on private.global_roles from anon, authenticated;
```

Funció de consulta:
```sql
create or replace function private.is_superadmin()
returns boolean language sql stable security definer set search_path = private as $$
  select exists (
    select 1 from private.global_roles
    where user_id = auth.uid() and role = 'superadmin'
  );
$$;
```

L’alta del primer superadministrador s’ha de fer amb migració controlada o amb la Service Role Key. Mai des del formulari públic.

## 4. RLS obligatori

**Protecció del propietari**
El bundle ja inclou una protecció contra l’eliminació de l’últim propietari i l’anomena SDP-LOCK. Aquesta protecció s’ha de conservar i ampliar per impedir:
- Eliminar l’únic propietari.
- Canviar el rol de l’únic propietari sense nomenar-ne un altre.
- Esborrar una organització amb contingut dependent.
- Fer una transferència parcial.

## 5. Flux complet d’autenticació

**Registre amb correu**
L’usuari obri `/connectar` o l’àrea d’onboarding.
Introdueix nom, correu i contrasenya. Accepta explícitament el consentiment.
`registerWithEmail()` envia a Supabase Auth.
Si Supabase exigeix confirmació, no es crea cap organització encara. Es mostra la pantalla “Confirma el teu compte”.
Després de confirmar, l’usuari inicia sessió.
Es carrega el seu perfil i les seues organitzacions.

## 6. Canvis en OnboardingSection

Pas 0 — Persona
Mantindre: Nom públic, Correu, Contrasenya, Consentiment RGPD, Confirmació de correu, Perfil privat per defecte.
Canvi recomanat: no enviar `tenant_id` com a dada d’autorització. El `tenant_id` pot viatjar com a context, però el backend ha de validar-lo.

**Botó “Continuar com a persona”**
Aquest botó ha d’anar a `/jo`, no directament a `/xat`.
El perfil personal és la identitat base.

## 7. Relació amb `/jo` i `/e/:slug`

Resolució de l’escriptori privat
En iniciar sessió: `GET perfil propi` i `GET RPC list_my_organizations(tenant_id)`.

`/jo` Ha de mostrar:
Nom del perfil. Configuració personal. Activitat pròpia. Organitzacions administrades o on participa.

`/e/:slug` El carregador ha de:
Normalitzar el slug. Consultar l’organització. Comprovar que és pública o que l’usuari és membre. Carregar el rol efectiu.

## 10. Pla d’execució

Fase 3.1 — Base de dades
- Aplicar esquema i verificar que les migracions són idempotents.
- Confirmar triggers i RLS.

Fase 3.2 — Auth
- Provar registre amb correu, confirmació, login, refresh, logout, i Google OAuth.

Fase 3.3 — Identitats
- Connectar `listMyOrganizations` i `createOrganization`.
- Completar `/jo` i `/e/:slug`.

Fase 3.4 — Onboarding
- Registre personal exclusiu. Creació idempotent posterior. Reanudació després d’errors.

Fase 3.5 — SDP-LOCK i proves destructives
- Activar SDP-LOCK abans de provar eliminacions i transferències de propietat.
