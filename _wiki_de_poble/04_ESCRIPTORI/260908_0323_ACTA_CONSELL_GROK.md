# 🛡️ ACTA DEL CONSELL: VEREDICTE GROK

**Data:** 8 de setembre de 2026
**Estat:** GO PER A PRODUCCIÓ
**Font:** Grok (via Mestre Javi)

---

## 1. Auditoria dels pedaços SQL / RLS (Fase 1 i 2)

**Veredicte:** Els pedaços són sòlids i verificables. No hi ha evidència de bypass OAuth, de service_role exposat ni de RLS obert.
*   **OAuth:** Validació estricta de `window.location.origin` confirmada.
*   **RLS + Immutabilitat:** Triggers d'immutabilitat confirmats en la font canònica (`20260908_initial_schema.sql`).
*   **Online-first:** ADR respectat.
*   **Aturador service_role:** Confirmatiu de que `vite.config.js` rebenta el build si la key és de `service_role`.

## 2. Trellat d’haver posposat els monolits

**Decisió correcta.**
La regla del Trellat s'ha aplicat correctament: "no tocar el que funciona i que no és vector d'atac mentre el nucli ja està tancat".
Instrucció explícita: **NO trossejar abans de producció.** Planificar en iteració separada amb baseline visual i portes de regressió.

## 3. Pregunta Wiki: `03_Actuar`?

**Recomanació: NO crear `03_Actuar` dins de la Wiki.**
La Wiki és "Saber" (identitat, doctrina). Els scripts viuen a `tooling/` i `.agents/skills/`. Barrejar scripts contaminaria la indexació (RAG) i generaria falsos positius. Una alternativa segura seria només un únic document mapa d'eines (com `00_INDEX_Maquina.md`).

## 4. Checklist pre-deploy (El Pas a Producció)

**GO = SÍ**, amb checklist mínima pre-deploy:
1. Confirmar `.agents/deute/.frontmatter-deute.json` i baselines.
2. Executar cadena de portes (`npm run porta`).
3. Verificar `VITE_SUPABASE_ANON_KEY`.
4. Desplegar schema `20260908_initial_schema.sql` a Supabase.
5. Smoke test manual (Login OAuth).

SDP-LOCK no necessari. Llestos per avançar.
