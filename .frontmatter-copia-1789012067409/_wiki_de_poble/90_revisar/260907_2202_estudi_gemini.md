# Auditoria Gemini: Transició Fase 3 (B1, B2 i rols globals)

**Data:** 07/09/2026
**Veredicte General:** 9/10 - L'auditoria dóna per vàlids tots els punts (B1, B2, Fase 3).
**Estimació de temps:** 2 Dies (1 sessió de refactor pur + 1 de QA).

## Text íntegre de la resposta:

Mestre, he analitzat profundament l'estat de la base de dades i l'arquitectura proposada als estudis del Consell (Codex, Z, Claude) presents al bundle, contrastant-ho amb el codi real de `supabase/schema.sql` i `src/app/contexts/IdentitatContext.jsx`. Ací tens el veredicte forense, aplicant pur Trellat.

## 1. Validació B1 (Reparar `list_my_organizations`)

**Estat:** ✅ **VALIDAT I ROBUST**

* **Problema històric:** L'auditoria de Codex (260907_1941) va advertir que la funció declarava 12 columnes de retorn (incloent `lema`) però el `SELECT` només en tornava 11.
* **Resolució actual:** Revisant `schema.sql` (línies ~330), el `SELECT` ara projecta exactament les 12 columnes: `id, tenant_id, slug, name, kind, parent_organization_id, lema, description, visibility, role, created_at, updated_at`.
* **Seguretat:** Configurat amb `security invoker` i `set search_path = ''`. Perfecte. L'usuari només llig el que l'RLS i les seues `organization_memberships` li permeten.

## 2. Validació B2 (`private.ajustos` i `handle_new_user`)

**Estat:** ✅ **VALIDAT AMB PRECAUCIÓ**

* **Estructura:** S'ha creat correctament la taula `private.ajustos` i s'utilitza al trigger `handle_new_user()` per rescatar el `tenant_id` si l'usuari no el passa per metadades durant el registre.
* **Avaluació de Risc (Fail-Closed):** El codi del trigger està blindat. Si no troba el poble per defecte a la taula privada, o l'UUID no és vàlid, llança les excepcions `SDP-REG-001`, `002` o `003` i avorta l'operació.
* **Llavor (Seed):** A `supabase/seed.sql` ja s'inclou l'`INSERT` correcte per a `poble_per_defecte`. Açò evita "hardcodejar" IDs al codi SQL.

## 3. Validació Fase 3 (Rols globals i claims)

**Estat:** ✅ **VALIDAT (Zero Zustand, 100% URL-Driven)**

* **BBDD (Rols i Claims):** La implementació de `public.user_platform_roles` i `public.organization_claims` (línies 112-132 a `schema.sql`) és neta. L'ús d'una clau forana composta `(tenant_id, organization_id)` cap a `organizations` bloqueja que es reclamen entitats de pobles equivocats.
* **RPCs de Gestió:** Les funcions `sollicita_reclamacio` i `resol_reclamacio` estan dissenyades amb transaccions atòmiques i exigeixen que l'actor que aprova siga validat via `private.es_superadmin()`.
* **React Context (Online-First):** Tota l'arquitectura d'estat complex de la UI ha esquivat llibreries supèrflues com Zustand. En lloc de guardar la "identitat activa" en una variable d'estat global tòxica, `IdentitatContext.jsx` llig directament de l'URL (`/jo/*` vs `/e/:slug/*`). Açò provoca que React desmunte i netege la memòria automàticament en canviar de context, eliminant tota fuita de dades privades entre pestanyes. Impecable.

---

## 4. NOTA I ESTIMACIÓ DE TEMPS (SCORE)

**Nota Arquitectònica (SCORE): 9 / 10**
La màquina bategarà forta. Els fonaments són robustos, no hi ha codi inflat, i l'escut RLS és hermètic. Penalitze un punt (1) només per la necessitat de tindre molt de compte amb la neteja de perfils zombis en entorns de producció (cal executar l'SQL de neteja des del Studio manualment amb el rol `postgres` com van apuntar Claude/Codex, degut a la falta d'un `ON DELETE CASCADE` natiu des d'`auth.users`).

**Estimació de temps de transició:**

* **Temps estimat:** **2 Dies (1 sessió de refactor pur + 1 de QA).**
* **Raonament:** El gruix del codi (`schema.sql`, contexts, i components UI principals com l'`OnboardingSection` o el `SelectorIdentitat`) ja incorpora la lògica i els esquemes de dades. Només cal aplicar el SQL a Supabase, testejar el *login/reclamació* de principi a fi, i assegurar que el routing no fa crides en fals. No es tracta de setmanes, ja que la part conceptual està totalment assentada.

---

> **[SDP-LOCK] Mestre:** Tot i que l'auditoria està verda, l'aplicació d'estos canvis en producció (especialment l'alteració de polítiques RLS existents a `notes` i `section_submissions`) requereix tallar accessos temporals. Aplica aquests `CREATE OR REPLACE` en una transacció controlada, mai en calent mentre els usuaris editen. Tanca la porta abans de passar l'escombra.
