---
estat: "registre_proposta"
tipus: "acta"
---

# ACTA: PROPOSTA DE REESTRUCTURACIÓ DEL CERVELL (CODEX)

**Data:** 24 d'agost de 2026 (16:04)

Codex aporta una visió completament pragmàtica i d'enginyeria de sistemes a la proposta. El seu descobriment més important és **un problema crític amb la taxonomia de subcarpetes** (com `01_cog/`) que havíem proposat prèviament.

## 1. El Problema de les Subcarpetes
Codex adverteix que crear subcarpetes com `cog/` o `01_cog/` trencaria l'script `sync_agent_mirror.py`, ja que aquest només descobreix els fitxers seguint el patró `skills/*/SKILL.md` (un sol nivell de profunditat).
**Solució de Codex:** Mantenir una estructura completament plana físicament, però semànticament jeràrquica utilitzant prefixos: `arc-`, `cog-`, `ops-`, `prm-`, `sec-`, `ux-`, `tool-`.

## 2. El Resultat de la Fusió (39 Skills en Total)
De 64 skills, Codex proposa reduir-les a 39 carpetes finals:
- 24 skills de fàbrica intactes (per byte).
- 15 skills canòniques (que absorbeixen les altres 40).
A més, proposa la creació d'un `skill-registry.json` per governar les dependències i prioritats d'activació.

## 3. L'enfocament del Time Machine
Codex refina el Time Machine de Z, advertint que les opcions de `tar` i `rsync` són perilloses en restauracions. Proposa un `time-machine.mjs` ubicat a `tooling/brain/` amb un sistema d'intercanvi atòmic de directoris en restauracions i un magatzem fora del repositori. Tot i això, la base de Z de tres anells continua sent compatible i és un punt de partida fantàstic.

---
*L'aportació de Codex és vital perquè ens salva de trencar l'script de sincronització `sync_agent_mirror.py` gràcies al seu consell de mantenir un arbre de directoris pla basat en prefixos.*
