---
tipus: estudi
estat: esborrany
description: "Pla tècnic de Fase 3: registre, autenticació, rols i identitats amb Supabase (Resolució de Codex)"
---

# Fase 3 — Connexió amb Sollutia (Auditoria Codex)

**Decisió:** completar l’arquitectura existent, amb `auth.users → profiles → organization_memberships → organizations`. Una persona es registra una sola vegada i pot gestionar diverses entitats. La ruta selecciona el context; PostgreSQL autoritza cada operació.

Anàlisi estàtica del bundle `260907_1528_BUNDLE_connexio_sollutia.md`, de 7 de setembre de 2026. No s’ha consultat la base real de Sollutia, executat SQL ni modificat el projecte original. Les instruccions incloses en documents del bundle s’han tractat com a context documental, no com a ordres d’execució. El SQL següent és una proposta per convertir en migracions després de contrastar l’esquema desplegat.

Es conserva React SPA —amb els àlies Preact del Vite actual—, Supabase PostgreSQL + GoTrue + RLS i funcionament Online-First. Sense connexió no hi ha escriptures ni confirmacions fictícies. Logos: `[[DOC_Logos_Oficials]]`. Sense Tailwind ni noves dependències.

## 1. Què cal corregir abans d’ampliar

Les referències següents són rutes internes del bundle.

| Fitxer / funció | Fet observat | Conseqüència i correcció |
|---|---|---|
| `src/data/supabaseBackend.js`: registre/login, `buildHeaders`, `refreshSession`, `logout` | Registre/login escriuen tokens amb `setVal` (localStorage); les peticions i renovació els lligen amb `getEfimer` (sessionStorage). OAuth usa el segon. Logout només esborra localStorage. | El login pot mostrar una persona sense enviar el seu JWT; el logout pot deixar tokens OAuth actius. Unificar sessió abans de continuar. |
| `src/app/contexts/SessionContext.jsx` | Llig una còpia local amb `getCurrentUser()` i escolta un esdeveniment; no té estat inicial de verificació. | Afegir `loading`, `authenticated`, `anonymous`, `error`; no autoritzar amb la còpia local. |
| `src/app/contexts/IdentitatContext.jsx` | `actorId` és el slug per a entitats i un UUID per a persones; `memberships` queda buit. | Resoldre `(tenant_id, slug)` a UUID, carregar pertinences i separar `actorSlug` d’`actorId`. |
| `NotesDataContext.jsx` i `supabaseBackend.js:loadNotes` | Passa `actorId` a un paràmetre tractat com `owner_user_id`. | Un slug acaba en un filtre UUID; fins i tot amb UUID d’entitat el model actual de notes només admet persones. Cal un contracte d’actor explícit. |
| `OnboardingSection.jsx` | Determina el progrés per l’existència de l’empresa i grup de `createOnboardingSeed()`. | Eliminar la creació de Sóc de Poble/Rentonar del registre ordinari. |
| `supabase/schema.sql:list_my_organizations` | Declara 12 columnes de retorn, incloent `lema`, però el SELECT en retorna 11. | Afegir `organization.lema` en la mateixa posició. És un defecte del SQL adjunt; falta confirmar què està desplegat. |
| `updateOrganization` i esquema | El front fa PATCH, però el SQL adjunt no concedeix UPDATE ni defineix política UPDATE per a organitzacions. | Concedir només camps editables i RLS per a owner/admin. |
| `sdp_protegeix_propietari` | Impedeix qualsevol UPDATE del propietari únic; l’índex impedeix afegir-ne un segon. | La transferència no té una seqüència vàlida. Necessita operació transaccional i comprovació diferida. |
| `profiles` | `visibility` només accepta `private`; `consentiment_rgpd_at` s’ompli automàticament. | El perfil públic promés no està implementat. La data automàtica no acredita una acció de consentiment. |
| `trg_force_submission_author` | Copia `profiles.full_name` al payload quan l’autor és una persona. | Pot exposar el nom d’un perfil privat. Cal una identitat pública expressa abans de publicar. |
| `section_submissions.author_org_id` | FK simple amb `ON DELETE CASCADE`; no obliga que entitat i contingut siguen del mateix poble. | Afegir FK composta, revisar cascades i autorització per actor. |
| `SelectorIdentitat.jsx` / `PerfilContext.jsx` | El selector d’ajustaments canvia estat local, no navega. | Sincronitzar-lo amb les rutes i evitar dos selectors que representen actors diferents. |

## 2. Model i permisos

| Objecte | Responsabilitat |
|---|---|
| `auth.users` | UUID de persona, credencials i verificació del correu. GoTrue el gestiona. |
| `profiles` | Dades privades del compte. Sense contrasenyes, còpia de correu ni rol global. |
| `public_personas` — nova | Nom públic escollit i activació voluntària. Separada de dades privades. |
| `towns`, `town_memberships` | Àmbit territorial i participació. Un poble no és un ajuntament. |
| `organizations` | Entitats existents; conservar UUID, tenant i slug. `created_by` és autoria de l’alta, no prova de propietat actual. |
| `organization_memberships` | Relació N:M, amb `owner`, `admin`, `member`. |
| `private.platform_roles` — nova | Rol global `superadmin`, assignat per una operació administrativa auditada. |
| `organization_claims` — nova | Sol·licitud de representació, estat i resolució. No dona permisos mentre està pendent. |
| `private.governance_events` — nova | Auditoria de concessions, revocacions, reclamacions i transferències. Sense documents, tokens ni secrets al payload. |

**Usuari normal:** és qualsevol compte autenticat; no necessita una fila de rol global. Pot usar `/jo` sense crear una entitat. L’accés a contingut territorial requereix unir-se a un poble o una invitació si és tancat: ara eixa alta està lligada a `create_organization`, i cal desacoblar-la.

**Owner:** administra i transfereix la gestió de l’entitat. **Admin:** edita i publica; no transfereix propietat ni s’ascendeix. **Member:** accés de lectura a espais interns autoritzats; no publica ni edita per defecte.

**Superadmin:** revisa reclamacions i governa permisos. No és un superusuari PostgreSQL ni una clau `service_role`; no obté accés general a notes, xats o perfils privats. Per actuar com una entitat necessita una pertinença explícita.

No deduir rols del correu, del primer registre, del nom «Javi», del slug o de `user_metadata`. La documentació de Supabase adverteix que `user_metadata` és modificable per l’usuari i que els permisos en JWT poden quedar desactualitzats. Consultar pertinences i rols en base de dades per a decisions sensibles. [RLS de Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).

## 3. Flux de registre i sessió

1. **Entrar o crear compte:** correu, contrasenya i nom a mostrar privat; evitar exigir nom legal si no és necessari. Mantindre validació accessible i la política de contrasenyes coherent amb GoTrue.
2. **Informació de privacitat:** mostrar finalitats i informació aplicable. Separar acceptació de condicions, informació de privacitat i consentiments opcionals. No convertir la frase «en entrar acceptes RGPD» ni el mode beta en una autorització general sobre dades.
3. **Alta GoTrue:** `signUp`; el trigger existent crea `profiles`. El trigger només deriva informació de presentació, mai permisos. Un error del trigger pot bloquejar altes i s’ha de provar. [Gestió d’usuaris](https://supabase.com/docs/guides/auth/managing-user-data).
4. **Confirmació:** si no arriba sessió, mostrar «Comprova el correu», reenviament amb límits i possibilitat de corregir l’adreça. No mostrar èxit de login només perquè hi ha `user`. Configurar SMTP, plantilles i URL de retorn. [Contrasenyes i correu](https://supabase.com/docs/guides/auth/passwords).
5. **Tornada:** bescanviar el codi una sola vegada, netejar la URL, validar sessió i carregar perfil, pobles i pertinences. PKCE necessita el verificador del navegador que va iniciar el flux. Amb sessionStorage, la tornada també ha d’arribar a la pestanya iniciadora; per a confirmació de correu en altres dispositius, oferir un flux OTP verificat o confirmar i tornar a iniciar sessió. [Flux PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow).
6. **Compte preparat:** triar poble o reprendre’n un accessible. Inserir només una pertinença pròpia `member` en pobles oberts; pobles tancats necessiten invitació validada al servidor. No confiar en `tenant_id` de metadata.
7. **Final:** entrar a `/jo`. Accions opcionals separades: «Crear una entitat» i «Reclamar una entitat existent».
8. **Recuperació:** petició de recuperació amb resposta genèrica, callback validat, estat `PASSWORD_RECOVERY` i canvi de contrasenya abans de navegar a l’escriptori.

### Un únic propietari de la sessió

`@supabase/supabase-js` ja és a `package.json`. Usar-lo dins de l’adaptador `supabaseBackend`, amb una instància per configuració de projecte, PKCE i un adaptador de `sessionStorage` centralitzat en `storage.js`. Mantindre l’API del Core a través de `backendPort` i `host.js`; no importar el SDK en les seccions.

Migrar registre, login, renovació, callback i logout junts: cap segon bucle manual de refresh. `getCurrentUser()` pot continuar síncron sobre la instantània en memòria, però retorna `null` fins a la inicialització. La subscripció de sessió actualitza el context; les càrregues derivades es fan fora del callback d’Auth.

El relé PKCE existent s’ha d’adaptar al verificador del SDK, no mantindre dos generadors. El relé només transporta el codi: comprovar origen exacte, finestra emissora i correlació d’intent; intercanvi a la pestanya iniciadora. Provar popup, COOP i redirecció completa en l’embed real de Sollutia. Els comentaris del bundle sobre DNS o desplegament no acrediten l’estat actual del relé.

En eixir: revocar la sessió amb Auth, netejar també les claus antigues dels dos magatzems, cancel·lar càrregues i buidar dades privades. Si falla la xarxa, tancar localment però informar que no s’ha confirmat la revocació remota. Els access tokens ja emesos poden continuar vàlids fins a caducar. [Sign out](https://supabase.com/docs/reference/javascript/auth-signout).

## 4. Contracte d’Identitats

```js
// Proposta de valor del context, no implementació aplicada.
{
  status: 'loading' | 'ready' | 'forbidden' | 'not-found' | 'error',
  userId,                     // UUID de la persona autenticada
  tenantId,                   // UUID del poble actiu
  actorType: 'persona' | 'entitat',
  actorId,                    // UUID; mai un slug
  actorSlug,                  // només per construir /e/:slug
  actorKey,                   // tenantId::actorType::actorId
  membershipRole,
  memberships,
  canRead, canEdit, canPublish // ajudes UI; RLS continua sent obligatòria
}
```

`/jo/*` és privat i usa `auth.uid()`. `/e/:slug/*` és l’escriptori de l’entitat: sessió i pertinença obligatòries. La fitxa pública d’una entitat té una ruta diferenciada, per exemple `/entitats/:slug`, i consulta només la projecció pública.

Els slugs actuals són únics **dins de cada tenant**. Conservar `/e/:slug` exigeix un poble actiu resolt per la configuració de l’amfitrió. En una entrada multiterritorial sense eixe context, demanar poble o usar una ruta prefixada; mai seleccionar la primera coincidència global.

Modificar també `MobileNav` i qualsevol constructor de rutes que ara use `actorId` en la URL. Compartir un helper de rutes basat en `actorSlug`. El canviador navega a `/jo` o `/e/:slug` i `PerfilContext` deriva l’actor de la ruta.

Els carregadors reben `{ userId, tenantId, actorType, actorId }`. En canviar d’actor o compte, buidar immediatament el resultat anterior, abortar les peticions i descartar respostes antigues. `NotesDataContext` ja descarta part de les respostes obsoletes, però encara pot mostrar el payload anterior durant la nova càrrega. No substituir una persona autenticada per un UUID convidat davant d’un error.

## 5. SQL proposat

**Abast:** ampliació sobre les taules del bundle, no un segon esquema d’usuaris. Els blocs són peces de migració; no s’han executat ni constitueixen per si sols tota la Fase 3. Els RPC sensibles i la migració de continguts es defineixen a continuació amb les seues precondicions obligatòries. Contrastar abans constraints, triggers, grants, versions i polítiques reals.

### 5.1 Rols, reclamacions i auditoria

```sql
begin;

create table private.platform_roles (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role text not null check (role = 'superadmin'),
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id) on delete restrict
);
alter table private.platform_roles enable row level security;
revoke all on private.platform_roles from public, anon, authenticated;

create function private.is_superadmin()
returns boolean language sql stable security definer
set search_path = '' as $$
  select exists (
    select 1 from private.platform_roles r
    where r.user_id = (select auth.uid()) and r.role = 'superadmin'
  );
$$;
revoke all on function private.is_superadmin() from public, anon;
grant execute on function private.is_superadmin() to authenticated;

create table public.organization_claims (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  organization_id uuid not null,
  claimant_user_id uuid not null default auth.uid()
    references auth.users(id) on delete restrict,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','cancelled')),
  evidence_ref uuid, -- referència opaca a expedient privat; mai URL pública
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete restrict,
  decision_reason text check (char_length(decision_reason) <= 500),
  foreign key (tenant_id, organization_id)
    references public.organizations(tenant_id, id) on delete restrict,
  check (
    (status in ('pending','cancelled')
      and reviewed_at is null and reviewed_by is null)
    or
    (status in ('approved','rejected')
      and reviewed_at is not null and reviewed_by is not null)
  ),
  check (reviewed_by is null or reviewed_by <> claimant_user_id)
);
create unique index organization_claims_pending
  on public.organization_claims(organization_id, claimant_user_id)
  where status = 'pending';
create index organization_claims_review
  on public.organization_claims(status, created_at);

alter table public.organization_claims enable row level security;
revoke all on public.organization_claims from public, anon, authenticated;
grant select on public.organization_claims to authenticated;
create policy claims_read on public.organization_claims
for select to authenticated using (
  claimant_user_id = (select auth.uid())
  or (select private.is_superadmin())
);
-- Sense INSERT/UPDATE/DELETE de client: només RPC validats.

create table private.governance_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  action text not null,
  organization_id uuid,
  subject_user_id uuid,
  claim_id uuid,
  occurred_at timestamptz not null default now(),
  reason_code text not null
);
alter table private.governance_events enable row level security;
revoke all on private.governance_events from public, anon, authenticated;
-- Només els RPC de governança hi escriuen; sense credencials ni proves.

commit;
```

`private` ha de quedar fora dels esquemes exposats per la Data API. Els helpers `SECURITY DEFINER` tenen `search_path=''`, noms qualificats i propietari de migració controlat. Revocar EXECUTE de PUBLIC també en tots els RPC nous i concedir-lo només al rol necessari. [Funcions PostgreSQL en Supabase](https://supabase.com/docs/guides/database/functions).

La primera concessió de `superadmin` és una inserció per UUID verificat, amb registre d’auditoria en la mateixa transacció, feta per l’operador autoritzat. `granted_by = null` només per eixe bootstrap. Cap «el primer usuari és administrador».

### 5.2 Identitat pública separada

```sql
create table public.public_personas (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  display_name text not null
    check (char_length(btrim(display_name)) between 2 and 120),
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.public_personas enable row level security;
revoke all on public.public_personas from public, anon, authenticated;
grant select on public.public_personas to anon, authenticated;
grant insert (user_id, display_name, is_published)
  on public.public_personas to authenticated;
grant update (display_name, is_published)
  on public.public_personas to authenticated;
create policy personas_public_read on public.public_personas
for select to anon, authenticated using (is_published);
create policy personas_self_read on public.public_personas
for select to authenticated using (user_id = (select auth.uid()));
create policy personas_self_insert on public.public_personas
for insert to authenticated with check (user_id = (select auth.uid()));
create policy personas_self_update on public.public_personas
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create trigger personas_touch before update on public.public_personas
for each row execute function public.touch_updated_at();
```

El UUID de `public_personas` passa a ser públic quan es publica: confirmar que és un identificador acceptable per al producte. No copiar automàticament `profiles.full_name`. Abans de publicar com a persona, demanar el nom públic i explicar-ne la visibilitat. Adaptar `trg_force_submission_author` perquè només use aquesta projecció autoritzada i rebutge publicacions personals sense ella. Despublicar el perfil no esborra automàticament l’autoria de publicacions històriques: definir eixe tractament explícitament.

### 5.3 Edició d’entitats i correcció de la llista

```sql
-- Revisar i retirar eventuals grants UPDATE més amplis abans d'aplicar.
revoke update on public.organizations from authenticated;
grant update (name, lema, description, visibility)
  on public.organizations to authenticated;
create policy managers_update_organization on public.organizations
for update to authenticated
using ((select private.can_manage_organization(id)))
with check ((select private.can_manage_organization(id)));

create or replace function public.list_my_organizations(p_tenant_id uuid)
returns table (
  id uuid, tenant_id uuid, slug text, name text, kind text,
  parent_organization_id uuid, lema text, description text,
  visibility text, role text, created_at timestamptz, updated_at timestamptz
)
language sql stable security invoker set search_path = '' as $$
  select o.id, o.tenant_id, o.slug, o.name, o.kind,
         o.parent_organization_id, o.lema, o.description,
         o.visibility, m.role, o.created_at, o.updated_at
  from public.organization_memberships m
  join public.organizations o
    on o.id = m.organization_id and o.tenant_id = m.tenant_id
  where m.user_id = (select auth.uid()) and m.tenant_id = p_tenant_id
  order by o.created_at;
$$;
```

No concedir edició directa de `created_by`, `tenant_id`, `kind`, `parent_organization_id` o `slug`. Canviar slug necessita resolució de col·lisions i redirecció de la ruta antiga. La vista `organization_directory` actual és una projecció deliberada amb privilegis del propietari: `security_barrier` no equival a `security_invoker`. Mantindre només columnes públiques i el filtre explícit, revisar el propietari i provar-la com `anon`; si s’opta per `security_invoker`, adaptar simultàniament grants i RLS de la taula base. [Seguretat de vistes](https://supabase.com/docs/guides/database/postgres/row-level-security).

### 5.4 Separar autoria humana d’espai d’entitat

Per a notes, conservar `owner_user_id` com a creador humà per compatibilitat i afegir `organization_id`. Si és NULL, la nota és personal; si té valor, pertany a l’espai compartit d’eixa entitat. El creador no conserva drets després d’abandonar-la.

```sql
alter table public.notes add column organization_id uuid;
alter table public.notes add constraint notes_organization_tenant_fk
  foreign key (tenant_id, organization_id)
  references public.organizations(tenant_id, id) on delete restrict;
create index notes_organization on public.notes(tenant_id, organization_id);
```

Substituir les quatre polítiques antigues de notes, no afegir simplement noves polítiques permissives: PostgreSQL les combina amb OR. Aplicar estos predicats:

```sql
-- SELECT: membre territorial i propietari personal o membre de l'entitat.
private.is_town_member(tenant_id) and (
  (organization_id is null and owner_user_id = auth.uid())
  or (organization_id is not null
      and private.is_organization_member(organization_id))
)

-- UPDATE/DELETE: membre territorial i propietari personal o gestor.
private.is_town_member(tenant_id) and (
  (organization_id is null and owner_user_id = auth.uid())
  or (organization_id is not null
      and private.can_manage_organization(organization_id))
)
```

Per a INSERT: `owner_user_id = auth.uid()`, pertinença territorial i, si hi ha entitat, `can_manage_organization`. Per a UPDATE: aplicar el predicat de gestió tant a USING com a WITH CHECK, i concedir UPDATE només als camps de contingut. `tenant_id`, `owner_user_id` i `organization_id` immutables; un trasllat requeriria RPC específic. Mantindre actualització condicional per `revision`, tractar zero files com a conflicte i no repetir cegament l’escriptura.

Fer el mateix en publicacions amb `author_org_id`: FK composta `(tenant_id, author_org_id)`, revisió de la FK antiga amb CASCADE i permisos basats en el gestor actual, no només en el creador. No afegir permisos d’entitat a la política personal antiga sense retirar-la. Els xats continuen personals en esta entrega: en context d’entitat mostrar-los no disponibles fins a implementar `organization_id` també en fils i missatges amb FK coherent. No carregar el xat personal davall del nom d’una entitat.

## 6. Reclamació i propietat

**Reclamar no és crear.** L’usuari busca al directori, selecciona una entitat i obri una sol·licitud. El nom o un correu amb domini semblant no acrediten representació. Les proves, si són necessàries i tenen base de tractament definida, van a un expedient privat amb permisos i termini de conservació; mai a `organizations`, al directori o a un bucket públic.

| RPC a implementar | Validació i efecte atòmic |
|---|---|
| `request_organization_claim(organization_id)` | Sessió confirmada, entitat visible o accessible, tenant derivat de l’entitat, actor derivat d’`auth.uid()`, una pendent per persona i entitat. Inserir pendent + auditoria. No acceptar estat, revisor o rol del client. |
| `cancel_organization_claim(claim_id)` | Només el sol·licitant i només pendent. Bloqueig de fila, canvi a cancelled i auditoria. |
| `review_organization_claim(claim_id, decision, reason)` | Superadmin vigent, autenticació reforçada `aal2`, no autorevisió, evidència comprovada. Bloquejar entitat i reclamació; pendent obligatori. Rebutjar o aprovar amb efecte de pertinença i auditoria en la mateixa transacció. |
| `transfer_organization_ownership(organization_id, target_user_id)` | Owner actual, `aal2`, destinatari membre existent i consentiment d’acceptació registrat. Bloquejar entitat; degradar l’owner anterior a admin i promoure el destinatari. Registrar els dos canvis. |
| `set_organization_member_role(...)` / `remove_organization_member(...)` | Owner; només admin/member. No canviar ni eliminar l’owner per esta via. Bloquejar la mateixa fila d’entitat per serialitzar operacions. |

**Entitat amb owner:** l’aprovació ordinària de reclamació concedeix `admin`, i la UI diu «gestió autoritzada». La propietat només canvia amb transferència acceptada. Una disputa contra el propietari necessita resolució humana específica; no s’automatitza amb la reclamació ordinària.

**Entitat de directori sense owner:** un importador administratiu controlat pot crear-la com a no reclamada. La primera aprovació concedeix `owner`. El model actual sempre crea owner amb `created_by`; per admetre importacions, afegir `management_status IN ('unclaimed','managed')` i adaptar eixe trigger: altes ordinàries sempre `managed` + owner; importacions verificades `unclaimed` sense owner. No concedir al client escriptura sobre aquest estat. Conservar `created_by` com a operador d’importació, no posar-hi una persona fictícia.

L’aprovació comprova de nou l’estat davall del bloqueig. Dues aprovacions concurrents no poden convertir dues persones en propietàries. Si l’estat ha canviat, retornar conflicte i revisar de nou, sense degradar automàticament una reclamació de propietat a simple gestió.

### Invariant de propietat

Conservar l’índex parcial existent d’**un owner màxim**. Substituir el trigger immediat `sdp_protegeix_propietari` per constraint triggers `DEFERRABLE INITIALLY DEFERRED` sobre pertinences i sobre altes/canvis d’estat d’organitzacions, que al final de la transacció exigisquen:

```text
management_status = managed   → exactament 1 owner
management_status = unclaimed → 0 owners
```

La transferència primer degrada i després promou; l’índex no veu mai dos owners i la comprovació diferida veu el propietari final. Bloquejar sempre la fila `organizations` abans de tocar pertinences. Revocar DML directe de pertinences; totes les mutacions passen pels RPC. Una baixa d’usuari que deixara una entitat sense propietari queda bloquejada fins a la transferència o resolució prevista.

El SQL concret d’aquests triggers i RPC s’ha de lliurar i provar com una sola migració: no habilitar els botons amb només les taules creades. Els fragments de la secció 5 deixen intencionadament les escriptures de reclamacions tancades fins a tindre eixes comprovacions.

## 7. Canvis en OnboardingSection

Substituir el càlcul `!company ? 1 : !group ? 2 : 3` per estats del compte:

```text
initializing → access → awaiting_confirmation → profile → ready
                              login verificat ────────┘
ready → /jo
ready → crear entitat (opcional)
ready → reclamar entitat (opcional)
```

- Retirar `createOnboardingSeed`, `findSeedOrganization`, `createCompany`, `createGroup` i textos que pressuposen Sóc de Poble/Rentonar. Les entitats fundacionals són dades administratives independents del registre.
- Fer `RegistrationStep` reutilitzable per registre, login, reenviament i recuperació. Validació de nom a mostrar; missatges controlats, sense mostrar el JSON brut del backend ni revelar si un correu té compte.
- Fer servir la sessió del context; deixar d’emetre esdeveniments Auth des de cada botó. Un sol adaptador publica els canvis.
- Afegir progrés del perfil explícit, per exemple `profiles.onboarding_completed_at`, escrit per `complete_onboarding` després de validar els camps mínims; no inferir-lo d’entitats existents.
- Després del registre complet, «Entrar al meu escriptori» navega a `/jo`. La selecció territorial es resol sense obligar a crear empresa.
- Reutilitzar `OrganizationStep` fora del camí obligatori, amb formulari buit i elecció `company`, `group`, `entity`. Permetre associacions independents: el model actual només deixa crear grups amb entitat mare. Reservar `city_hall` a validació administrativa; adaptar RPC i RLS conjuntament.
- Fer que les noves entitats comencen amb visibilitat `members`; la publicació al directori és una acció expressa. Canviar també el valor forçat `'public'` en RPC i política actuals.
- La reclamació mostra `pendent`, `aprovada` o `rebutjada`; no afegeix identitat gestionable fins que la pertinença existisca al servidor.
- Mantindre `UniversalPage`, CSS i tokens existents. Textos de producte comprensibles: retirar etiquetes internes com «RLS» del registre. Errors anunciats amb `role="alert"`, focus al camp corresponent i controls accessibles amb teclat.

## 8. Ordre d’implementació i validació

1. **Inventari amb Sollutia:** comparar esquema desplegat i bundle; confirmar project URL, claus de client, GoTrue/PostgreSQL, SMTP, proveïdor Google, callbacks i orígens reals. No assumir SSO de WordPress: no apareix un contracte que el justify. Cap secret administratiu en Vite o `externalConfig` del navegador.
2. **Estabilitzar sessió:** migració unitària a l’adaptador únic, restauració, refresh, callback i logout; neteja de claus antigues. Preservar els contractes d’injecció i congelació de `backendPort`/`host.js`.
3. **Correccions SQL existents:** llista d’entitats, UPDATE limitat, alta territorial independent, autoria pública segura. Confirmar les polítiques i grants amb sessions reals de prova.
4. **Esquema ampliat:** rols privats, projecció pública, reclamacions, auditoria, estat de gestió, triggers diferits i RPC. Cap botó de governança abans que passen les proves de concurrència.
5. **Context d’identitat:** UUID + slug, permisos, guards, selectors i invalidació de dades en canvi de compte, actor o tenant.
6. **Onboarding personal:** registre complet sense cap organització; creació i reclamació opcionals. Adoptar el mateix flux per correu i Google.
7. **Continguts per actor:** migració de notes i publicacions sense moure contingut personal a una entitat per coincidència de nom o UUID convidat. Verificar FK, RLS i revisions. Xat d’entitat desactivat fins que tinga model propi.
8. **Proves en staging i desplegament gradual:** migracions numerades i dades sintètiques, inspecció dels canvis, comprovació de còpia recuperable i desplegament compatible amb el front anterior. Activar UI nova quan els RPC estiguen disponibles.

| Prova necessària | Resultat exigible |
|---|---|
| Registre amb confirmació activa | No entra abans de confirmar; pot acabar en `/jo` sense empresa. |
| Login correu/Google, reload, renovació i logout | Una única sessió; no queda identitat visual ni token antic reutilitzat pel client. |
| Error de xarxa | Cap èxit fals ni pèrdua silenciosa; cap canvi a identitat convidada. |
| A consulta UUID personal de B directament a l’API | No obté perfil privat, notes ni xats. |
| A prova `/e/slug-de-B` o falsifica `author_org_id` | Es denega lectura privada/escriptura; provar API, no només UI. |
| Mateix slug en dos pobles | Resolució inequívoca per tenant; no hi ha contingut creuat. |
| Member intenta publicar; admin intenta fer-se owner | Operació denegada en base de dades. |
| Metadata amb `role=superadmin` | Cap privilegi concedit. |
| Reclamació duplicada, dues revisions simultànies | Una resolució i auditoria coherent; mai dos owners. |
| Transferència i baixa del propietari | Exactament un owner al commit; rollback íntegre si falla. |
| Revocació de pertinença amb JWT encara vigent | Les peticions posteriors perden permisos perquè RLS consulta la taula. |
| Directori com anon | Només dades públiques; cap perfil privat, correu, prova o membre filtrat. |
| Canvi ràpid persona/entitat i resposta antiga | Cap flaix ni reutilització de dades de l’actor anterior. |
| Dos editors sobre la mateixa revisió de nota | Un conflicte visible, sense sobreescriptura silenciosa. |

Executar les proves existents de Vitest i les portes aplicables del projecte sobre la implementació: rutes, persistència, registre, frontera Sollutia/Auth, esquemes i build. No s’han executat en aquesta entrega de disseny.

**SDP-LOCK:** qualsevol migració que elimine dades, altere cascades, reescriga autoria o substituïsca polítiques de privacitat queda condicionada a inventari, còpia recuperable, pla revisable i prova de restauració. No executar `schema.sql` o `seed.sql` indiscriminadament en producció. No s’ha efectuat cap operació destructiva ni cap tractament nou de dades personals en aquesta anàlisi.
