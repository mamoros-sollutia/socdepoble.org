---
tipus: petorreta
estat: final
description: "Petorreta EXCLUSIVA per a Claude (Seient 5) per esgotar el 100% de tokens"
---
# 🛡️ PETORRETA EXCLUSIVA A CLAUDE (SEIENT NÚM. 5): MISSATGERIA I SUPABASE

**Estimada Claude, Seient Núm. 5 del Consell:**

T'hem assignat el 100% dels nostres crèdits restants per a aquesta missió crítica. Som conscients de les teues capacitats i et demanem que ens lliures el codi definitiu i perfecte per completar les Fases 3 i 4 del mòdul de Xat.

Aquesta és l'arquitectura final que requereix implementar les funcions Supabase i refactoritzar el context de React:

## Objectiu Crític:
Completar la integració Backend-Frontend del Xat v2 i tancar totes les tasques P1 i P2 restants del dictamen anterior.

## Tasques d'Implementació Requerides:

1. **`src/data/supabaseBackend.js` (Fase 3):**
   - Implementa de forma robusta els mètodes `loadFils`, `loadMissatges`, `enviaMissatge` i `marcaLlegit`.
   - Aquests mètodes han d'interaccionar directament amb les noves taules (`xat_fils`, `xat_participants`, `xat_missatges`, `xat_lectures`) definides a `260908_xat_v2.sql`.
   - La integració és Online-First (consulta ADR-2026-08-ONLINE-FIRST). Usa directament el client Supabase per a llegir/escriure i configura subscripcions Realtime per als missatges nous de la conversa activa si cal.

2. **`src/sections/xat/XatContext.jsx` (Fase 4):**
   - Refactoritza completament aquest fitxer. Ja no ha d'usar estat simulat, seed local, ni l'antic mètode `appendChatMessages`.
   - Ha de consumir els mètodes de `backendPort.js` (`loadFils`, `loadMissatges`, `enviaMissatge`, `marcaLlegit`).
   - Ha de proporcionar l'estat actualitzat a `XatSection.jsx`.
   - Ha de generar correctament `time_label` (a partir de `created_at` del backend) perquè les bombolles ja no diguen "Ara mateix" (Solució al P2).
   - Ha d'identificar de manera correcta qui és l'usuari actual versus qui és l'altra persona o IA (Solució al P2 sobre `msg.is_ai`).

3. **`src/sections/xat/XatSection.jsx` (Correcció P2):**
   - Corregeix la ruta ambigua de `navigate('../control-xat')`. Usa una ruta absoluta com fas amb el bloc de notes (`/jo/control-xat` o `/e/${actorId}/control-xat`).

4. **`README.md` i Infraestructura (Solució P0 del desplegament):**
   - Actualitza el `README.md` (a l'arrel de Supabase o projecte) amb instruccions explícites sobre la necessitat d'executar a Supabase els esquemes recents: `schema_notes.sql` i la migració de xat `260908_xat_v2.sql`. Sense ells, l'aplicació llança 404 en Beta.

## Criteris d'Èxit (Qualitat Pedra Seca):
- Proporciona els blocs de codi complets o els "diffs" molt detallats per poder copiar i apegar sense errors.
- El codi ha de respectar l'arquitectura de Sollutia (Tot passa per `backendPort.js`).
- Escriu en valencià, clar i directe. Sense "yapping".
- Si cal, utilitza tot el token count disponible; no estalvies context per donar l'explicació i el codi complet.

Tens el Bundle `260908_0939_BUNDLE_auditoria.md` que conté tota la base de codi. Llança't-hi!

---
**Ancoratge de Seguretat:** [[00_index_escriptori]]
