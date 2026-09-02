---
tipus: document
estat: esborrany
description: Petorreta del Consell (Codex)
---
Ancoratge: [[00_INDEX_ESCRIPTORI]]

# Petorreta del Consell (Codex)

**Resum:**
Codex presenta l'auditoria més estricta de totes, marcant que el projecte **no està llest** per al pas a Sollutia a causa de 5 errors P0 (crítics). Proposa el patró d'arquitectura de "les 4 peces" (Invariant, Sensor, Actuador, Rebut) per al tancament. En la Wiki, alerta que l'actual definició d'"orfe" és dèbil perquè permet "illes" de documents que s'enllacen entre si però no estan connectades a l'índex canònic, proposant algoritmes d'accessibilitat dirigida (reachability/Tarjan). Per a Sollutia, exigeix un "boot handshake explícit", revisar si React s'empaqueta o no, i resoldre les dues fonts de veritat dels tokens CSS (`--sp-*` vs `--sdp-*`).

## P0 Detectats
1. **Dues fonts de disseny:** `build-tokens.mjs` genera `--sp-*`, `index.css` genera `--sdp-*`.
2. **Build standalone contradictori:** El plugin PHP afirma empaquetar React, però Vite l'externalitza a `wp.element`.
3. **Congelació del host:** `host.js:arrenca()` captura l'error i munta una app zombi si falla l'import.
4. **Hook de tancament irreal:** `.agents/hooks.json` depén de l'entorn de la IA; els git hooks durs (`.husky`/`.githooks`) no estan al bundle.
5. **Errors ofegats al build:** `build-tokens.mjs` falla amb `exit 0` (`catch(console.error)`).

## Mecanització Universal (Missió 1)
- Patró en 4 capes: Invariant (sobre el repo, no la memòria), Sensor (retorna codi d'eixida), Actuador i Rebut (caduca si canvia el hash).
- L'índex no s'ha de comprovar amb un simple `includes()`, sinó per **accessibilitat (reachability)** en un graf dirigit des de l'arrel.
- Proposa un `check-close.mjs` que siga cridat en 3 capes: comandament local, git pre-commit, i CI.

## Sanador i Wiki (Missió 2)
- Rebutja la definició actual d'orfe. Proposa **Reachability Dirigida** (un node ha de ser accessible des dels índexs canònics).
- Alerta d'illes (Cicles Aïllats) i arxipèlags. 

## Preparació per a Sollutia (Missió 3)
- Contracte Backend v2 tipat i validat (JSON Schema en runtime).
- `SocDePoble.boot()` amb validació prèvia de tenants abans de muntar l'etiqueta Shadow DOM.
- Resolució del misteri del React externalitzat (dependència `wp.element` a WordPress vs Standalone).
- Fix de `build-tokens.mjs` perquè faça `process.exitCode = 2` en cas d'error.
