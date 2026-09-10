---
tipus: petorreta
estat: pendent_enviament
description: Auditoria Tècnica Post-Destrucció i Robustesa de Connexió amb Sollutia
---
# 🛡️ PETORRETA AL CONSELL: AUDITORIA POST-DESTRUCCIÓ I ROBUSTESA (SOLLUTIA)

Consell d'IAs (Deepseek, Claude, Qwen, Kimi, etc.):

Acabem de fer un "destrozo" conscient del Frontend (Hem eliminat completament `react-router-dom` a favor d'un context d'enrutament natiu propi `RouterContext.jsx`, hem arrencat l'esquema antic de Tailwind, etc.).

## 🎯 OBJECTIUS DE L'AUDITORIA

Volem que dueu a terme una auditoria despietada de l'estat actual, aplicant **autodestructivitat, enginyeria inversa i proves d'estrès teòriques**, especialment centrada en:

1. **La Connexió amb Sollutia (El Backend i Segellat):**
   Demà al matí Sollutia ens donarà accés per connectar el nostre codi al seu servidor i infraestructura de producció. Necessitem **garanties absolutes** que l'enxufat (el cicle de vida, la definició del Custom Element `soc-de-poble`, el segellat i l'extracció de la configuració d'autenticació/Supabase) no té cap fugida de memòria, race condition o error crític que puga fer-nos fallar. Reviseu `main.jsx`, `host.js`, `PedraSecaEmbed.jsx` i la connexió amb la DB. Volem donar una impressió impecable demà. Si veieu qualsevol escletxa tècnica o risc de trencament en la integració, identifiqueu-ho i aporteu la solució directa.

2. **L'Estructura del Cervell (Arquitectura Cognitiva):**
   És la divisió de carpetes (`01_Ser`, `02_Saber`, `03_Actuar`, `04_Escriptori`) realment la definitiva per ancorar el coneixement de la IA? Què en penseu de l'ús de `Title_Snake_Case` (ex: `01_Saber_Cultura`) front a CamelCase per nomenar i assentar els enllaços interns per a l'eternitat? Doneu idees de millores estructurals.

3. **La Nova Arquitectura de React sense llibreries escombraries:**
   Hem extirpat `react-router-dom`. Auditeu la nostra implementació de `RouterContext.jsx`. Quins bugs fatals o colls d'ampolla hi veieu? Ens falten casos extrems (edge cases) en l'enrutament basat en Context+HistoryAPI?

## Context Necessari

Bundle aparellat: `260910_0431_BUNDLE_auditoria.md` (Conté tot el codi base actiu i la documentació).

L'objectiu és donar llum a punts cecs. No sigueu complaents. Destrosseu l'arquitectura teòricament per assegurar-vos que no es trenca en la pràctica quan demà la connectem oficialment al sistema Sollutia.

## Output Esperat

- `FORMAT`: markdown natiu.
- Identifiqueu clarament els problemes potencials de connexió.
- Proposeu millores tècniques, idees futures per polir l'enrutador natiu, i doneu feedback sobre el disseny/estructura del Cervell.
- **Sense eufemismes:** Aneu directes al gra (Trellat).
