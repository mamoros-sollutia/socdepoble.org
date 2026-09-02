---
tipus: document
estat: esborrany
description: Petorreta del Consell (Copilot)
---
Ancoratge: [[00_INDEX_ESCRIPTORI]]

# Petorreta del Consell (Copilot)

**Resum:**
Copilot proposa una solució d'infraestructura al núvol (AWS S3, Redis, llibreries complexes com `simhash-js` i `fast-levenshtein`) per a resoldre els problemes de la Wiki i els ancoratges.

Tot i que l'arquitectura proposada (amb locks, backoff i uploads atòmics) és molt sòlida per a un entorn de microserveis distribuïts, **xoca frontalment amb la doctrina "Pedra Seca"** de Sóc de Poble. A més, "al·lucina" directoris i fitxers que no estan al projecte (com `state/localCache/` o `scripts/hooks/sessionHook.js`).

Guardem esta petorreta per tindre un registre complet de les respostes del Consell, però **rebutgem tècnicament** l'enfocament d'afegir dependències externes (Redis, AWS) per a substituir processos que ja estem resolent de manera nativa i determinista amb Git i scripts de Node (com hem fet amb `check-close.mjs` i `ancora.mjs`).
