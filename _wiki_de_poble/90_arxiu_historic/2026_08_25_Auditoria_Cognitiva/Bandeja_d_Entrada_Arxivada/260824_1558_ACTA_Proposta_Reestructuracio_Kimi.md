---
estat: "registre_proposta"
tipus: "acta"
---

# ACTA: PROPOSTA DE REESTRUCTURACIÓ DEL CERVELL (KIMI)

**Data:** 24 d'agost de 2026 (15:58)

Kimi aporta la sisena proposta, destacant per ser la més estructurada a nivell documental i processal. Proposa reduir les skills de 61 a 28 (creant 14 "Super-Skills" en valencià i reubicant 14 en anglés).

## 1. El Mapa Arquitectònic Proposat (Numerat)
Kimi aposta per una taxonomia on les carpetes van numerades i en majúscules, per forçar un ordre lògic al sistema d'arxius:
- **`00_MANIFEST/`**: Conté únicament l'índex i l'estat del cervell.
- **`01_COGNICIO/`**: Veritat, raonament i prompting.
- **`02_SEGURETAT/`**: Auditoria i fronteres.
- **`03_ARQUITECTURA/`**: Codi i termodinàmica.
- **`04_MUTACIO/`**: Protocols per fer canvis (La Tanca, patch planning).
- **`05_MEMORIA/`**: Context i compressió semàntica.
- **`06_IDENTITAT/`**: Actriu, empatia rural i revelació progressiva.
- **`07_DOMINI/`**: Cosetes específiques de Sóc de Poble (offline, WhatsApp, wiki).
- **`08_EINES/`**: Parsers, Obsidian, Canvas, Defuddle.

## 2. Fusió de Skills
Kimi és molt agressiu fusionant els solapaments detectats:
- Tota la cadena de pensament i raonament passa a `cog-raonament`.
- Tota l'enginyeria de prompts passa a `eng-prompts`.
- Tota la verificació i anti-al·lucinació passa a `cog-veritas`.
Les skills en anglés es queden separades i intocables. Kimi inclús proposa afegir `factory: true` i `frozen: true` al seu *frontmatter* per protegir-les automàticament.

## 3. La "Time Machine" del Cervell (Node.js + Estela)
Kimi proposa aprofitar el script `estela.sh` (que ja fa commits invisibles en `refs/sdp/estela`) i embolicar-lo en una eina ESM pura: `tooling/cervell-time-machine.mjs`. Aquesta eina controlaria les comandes `--snapshot`, `--rollback <id>` i `--bloqueja`. També proposa afegir una regla a `tractor-consell.mjs` que bloquegi les escriptures a fitxers congelats.

---
*Amb Kimi tenim una arquitectura extremadament ordenada i un pla d'integració que reaprofita el que ja tenim (l'script estela) potenciant-lo amb Node.js per evitar dependre purament de bash. És una visió molt pragmàtica i organitzada.*
