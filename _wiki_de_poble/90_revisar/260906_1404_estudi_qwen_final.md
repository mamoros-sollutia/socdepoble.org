---
tipus: estudi
estat: actiu
font: Qwen (Auditoria Final)
data: "2026-09-06T14:04:00+02:00"
---

# Auditoria Qwen (Final)

## 1. Model de Dades i Integritat
* **Claus Foranes i Índexs:** Insisteix en la gravetat de no tenir claus foranes correctes (fent eco del que va trobar Dola a `town_memberships`). Avisa de l'Error 23503 si hi ha insercions desordenades. Demana indexar totes les FK per rendiment.
* **Perfils i Triggers:** Avisa que si no hi ha un *trigger* segur a `auth.users` per crear files a `public.profiles`, hi haurà usuaris orfes i duplicats.

## 2. Seguretat RLS i RPC
* **RLS:** Torna a recordar que amagar botons a React no serveix de res. Demana auditar si el multi-tenant està fet amb un perillós `tenant_id = auth.uid()` o si està ben validat.
* **RPC (Remote Procedure Calls):** Alerta de perill extrem d'Injecció SQL si s'usen RPCs a Supabase sense parametritzar bé les entrades o sense tindre el `search_path=public` definit.

## 3. Sessió i Tokens
* **Rotació de Tokens:** Avisa que el token de refresc pot caducar per inactivitat (fent que la gent haja de tornar a fer login sovint en entorns rurals). Parla del risc de no tindre rotació de tokens de refresc implementada.

---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
