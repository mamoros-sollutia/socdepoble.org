---
tipus: estudi
estat: esborrany
description: "DISSENY TÈCNIC: FASE 3 (CONNEXIÓ SOLLUTIA) per Gemini"
---

# 🛡️ DISSENY TÈCNIC: FASE 3 (CONNEXIÓ SOLLUTIA)

**OBJECTIU:** Consolidar l'arquitectura d'Identitats (Usuari vs Entitat), el flux de registre amb Supabase Auth (GoTrue), els rols globals i el mecanisme de reclamació d'entitats preexistents (Ajuntaments, Associacions).

---

## 1. Esquema SQL (Evolució del Model de Dades)

L'esquema actual a `supabase/schema.sql` ja defineix `profiles`, `organizations` i `organization_memberships`. Per suportar la Fase 3 completament (Rols Globals i Reclamació de Propietat), cal aplicar el següent *delta* a la base de dades:

```sql
-- 1.1 Rols Globals a la Taula Profiles
-- Permet diferenciar un usuari normal del Mestre/Sollutia (Superadmin)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS system_role text NOT NULL DEFAULT 'user' 
CHECK (system_role IN ('user', 'moderator', 'superadmin'));

-- 1.2 Taula de Reclamació d'Entitats (Claiming)
-- Permet a un usuari sol·licitar ser l'administrador d'un Ajuntament o Associació existent
CREATE TABLE IF NOT EXISTS public.entity_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.towns(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  proof_text text NOT NULL, -- Explicació o verificació del sol·licitant
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- 1.3 RLS per a Reclamacions
ALTER TABLE public.entity_claims ENABLE ROW LEVEL SECURITY;

-- Els usuaris poden llegir i crear les seues pròpies reclamacions
CREATE POLICY "Users can read own claims" ON public.entity_claims 
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own claims" ON public.entity_claims 
  FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

-- Només els superadmins poden aprovar (update) reclamacions
CREATE POLICY "Superadmins can manage claims" ON public.entity_claims 
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND system_role = 'superadmin')
  );

```

---

## 2. Flux d'Autenticació i Identitat (Frontend ↔ Supabase)

El sistema ha de respectar la dualitat d'escriptoris (`/jo` vs `/e/:slug`).

1. **Gènesi de l'Usuari (GoTrue):**
* L'usuari es registra via `registerWithEmail` o `loginWithGoogle`.
* El *Trigger* `on_auth_user_created` ja existent a Supabase crea automàticament la fila a `public.profiles` amb la visibilitat a `private`.


2. **Resolució de Context (`IdentitatContext.jsx`):**
* A l'arrancada de l'App (després del login), `IdentitatContext` invoca `listMyOrganizations`.
* Si la ruta és `/jo`, el `actorType` és `persona` i les accions s'atenen amb l'`owner_user_id`.
* Si la ruta és `/e/:slug`, el context verifica si l'usuari té un rol (`owner`, `admin`) a `organization_memberships` per a eixe `slug`. Si és així, l'`actorType` passa a ser `entitat` i el backend utilitza el `organization_id` (`author_org_id` en publicacions).


3. **Pany de Seguretat (RLS):** L'RLS de `section_submissions` i `notes` ja contempla que l'usuari pot escriure si és ell mateix, o si és membre de l'organització `author_org_id`.

---

## 3. Adaptació de `OnboardingSection.jsx`

Actualment, l'Onboarding permet crear una Empresa o un Grup des de zero. Per a la Fase 3, introduïm el concepte de **"Reclamació" (Claiming)** per a entitats institucionals (ex: Ajuntament), ja que no es poden crear duplicats.

**Canvis requerits al flux UI:**

1. **Pas 1 (Personal):** Es manté igual (Registre / Login / Google). L'usuari ja existeix.
2. **Pas 2 (Selector de Camí):** Nova decisió a la interfície. L'usuari ha de triar:
* *A) Crear una nova Empresa / Grup (Comerços, penyes noves).* -> Flux actual.
* *B) Reclamar una Entitat Existent (Ajuntaments, Associacions donades d'alta pel sistema).* -> Nou Flux.


3. **Nou Component `ClaimEntityStep.jsx` (Dins de l'Onboarding):**
* **Cerca:** Un *UniversalSearch* que llista les `organizations` on `kind IN ('city_hall', 'entity')` del poble actual.
* **Formulari de Reclamació:** L'usuari escriu el `proof_text` (Ex: "Sóc l'alcalde / Tècnic de cultura").
* **Enviament:** Es fa un `INSERT` a la taula `entity_claims`.
* **Resultat:** Es mostra un estat "Pendent de validació manual per part de l'equip de Sóc de Poble". L'usuari entra al portal exclusivament com a `/jo` (Persona) mentrestant.



---

## 4. Gestió de Superadministració (Tauler de Control)

Com que depenem d'un backend centralitzat a Sollutia, necessitem governança sobre el contingut:

* A `ControlSection.jsx`, habilitarem la visualització de l'apartat de "Centre de Comandament" llegint el `system_role` de `profiles`.
* **Eines de Superadmin:**
1. Validació de `entity_claims` (Aprovar traspassa l'entitat creant un registre a `organization_memberships` amb `role = 'owner'`).
2. Moderació global (esborrat per força major d'acord amb la Llei 05 de Privacitat).



---

## Tancament Obligatori

* No yapping. Document limitat a especificacions arquitectòniques directes.
* El disseny de la interfície de reclamació utilitzarà exclusivament els `UniversalComponents` (sense Tailwind en línia i usant classes semàntiques Pedra Seca `sdp-`).
* RLS implementat per defecte. Cap dada personal addicional queda exposada.
