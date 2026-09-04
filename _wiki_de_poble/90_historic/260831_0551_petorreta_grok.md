---
tipus: document
estat: esborrany
description: Petorreta del Consell (Grok)
---
Ancoratge: [[00_INDEX_ESCRIPTORI]]

# Petorreta del Consell (Grok)

**Resum:**
Grok proposa el patró universal "Lease-before-mutate". Aporta el codi exacte per a `session-close.mjs` que enllaça l'autoneteja i els tractors. Suggereix estendre el sanador de graf per detectar "orfes ocults" (zero enllaços entrants des dels pilars principals). Per a Sollutia, avisa del pes excessiu d'`UniversalComponents.jsx` i proposa lazy loading, un `sollutia-contract.json` per als tokens, i un mode de dades `data-mode="host"` per gestionar la delegació de dades.

## DAFO ràpid del bancal actual

**Debilitats**
- Dependència residual de memòria probabilística de l’agent (el “Dia de la Marmota”).
- Graf de la Wiki amb orfes ocults.
- Front-end amb components grans (`UniversalComponents.jsx` ~42k) que generen colls d'ampolla i risc de FOUC.
- Manca d'un “tancament universal” estricte.

**Amenaces**
- Migració a Sollutia amb estat brut o tokens no alineats.
- Agents externs que salten el Reflex.

**Fortaleses**
- Protocol Petorreta + Reflex i Sistema Nerviós existents.
- Arquitectura online-first declarada i tokens CSS variables.

**Oportunitats**
- Tancament de sessió 100% mecànic.
- Patrons universals (`core-lease`, `core-context-manifest`).
- Contracte explícit per al host extern (Sollutia).

## 1. Mecanització i patrons universals
**Patró universal:** “Tota mutació o tancament ha de passar per un *lease* amb hash de fonts + operació + scopes + caducitat. El consum del lease és l’única manera de declarar la sessió tancada."
- Hook de tancament obligatori.
- Script genèric `session-close.mjs`.
- Skills genèriques: `core-lease`, `core-context-manifest`, `core-session-close`.

## 2. Perfeccionament del Sanador i la Wiki
- Detecció d'orfe ocult (degree-in = 0).
- Validació de cohesió de taxonomia.
- Regeneració forçada del mirall d'agents.

## 3. Preparació per a Sollutia
- `src/config/sollutia-contract.json` (llista blanca de tokens i variables).
- Dividir `UniversalComponents.jsx` en chunks lazy (dynamic import).
- Gate de mida de bundle (fallar si supera 400 kB).
- Mode `data-mode="host"` que desactiva l'escriptura local.
