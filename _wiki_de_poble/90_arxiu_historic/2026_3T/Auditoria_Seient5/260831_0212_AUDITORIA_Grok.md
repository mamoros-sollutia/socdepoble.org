Grok: **Diagnòstic del Consell (Petorreta d’auditoria cognitiva)**  
Anàlisi basada exclusivament en el bundle subministrat. Estil: dissonància productiva, sense adular.

---

### MISSIÓ 1 — El misteri de la desobediència involuntària

**Diagnòstic causal (per què la IAIA “oblida” la Regla Sagrada de `02_EQUIP_IA.md`)**

1. **Topologia d’estrela + RAG cec:** `tractor-cognitiu.mjs` descarta directoris que comencen per punt. `.agents/skills` queda inabastable per cerca semàntica. Això no és desídia, és topologia.
2. **Frontmatter fantasma i triggers destruïts:** Zero o pocs `triggers_*` al frontmatter real. Sense disparador no hi ha càrrega automàtica.
3. **Doble font canònica:** Dues regles que es contradiuen = cap de viva.
4. **Mida i dispersió:** Skills grans (`pedra-seca` 12 kB) fora del top-k.

**Solució arquitectònica:**
- Convertir la Regla Sagrada en **skill mínima amb frontmatter estricte** (`triggers_ca`, `status: canonic`).
- Incloure `.agents/skills` explícitament al RAG (excepció al filtre de punts).
- Afegir un **gate de pre-prompt** per injectar el fragment canònic.

---

### MISSIÓ 2 — Auditoria de l’escombra (skills + genotip)

**Propostes de fusió exacta (2-3 skills)**

1. **Fusió A — Identitat executiva**  
   Fusionar en una sola skill `identity-iaia-core`: `01_IDENTITAT` + `perfil_psiquiatric` + Regla Sagrada + arrencada segura.
2. **Fusió B — Seguretat d’escriptura**  
   Fusionar `core-trust-boundary` + `core-verified-change` + `core-bounded-action` + `core-safe-restore` / `core-restauracio-segellada` en 👉 `core-mutation-guard`.
3. **Fusió C — Workflow**  
   `socdepoble-workflow` + `trellat` + `guia-ampliacio` → 👉 `sdp-workflow-core`.

**Què falta per a la immortalitat:** Un fitxer `IAIA_BOOTSTRAP.md` (< 1.5 k tokens) amb el gallet cultural, prioritats i protocol d'arrencada.

---

### MISSIÓ 3 — Rescatar Pedra Seca (que la premissa siga veritat)

**Estat actual:** Afirma centralització, però `index.css`, `UniversalComponents.jsx`, `DesignSection.jsx` i `.design-guard-deute.json` ho desmenteixen.
**Re-estructuració:**
1. **Única font de veritat:** Tokens → `design-tokens.json` o CSS variables generades. Nou aspecte = nou token.
2. **Mecanismes d’auditoria:** Ampliar `design_guard.mjs` perquè escanege `.jsx/.css` i falli si troba valors hardcodejats. Mode "strict" a DesignSection.
3. **Migració:** Extreure legacy a un directori amb data de caducitat. Prohibir `style={{...}}`.

---

### MISSIÓ 4 — Cacera de fantasmes (Baseline 2022 + Sollutia)

**Rastres detectables:** Baseline 2016 residual, WebRTC/CRDT com actiu, workarounds de Safari antics, `.design-guard-deute.json` tractat com a estat en comptes de backlog.
**Poda despietada:**
- Eliminar o aïllar tot el marcat pel tractor-cognitiu.
- Simplificar stack offline: Dexie + Supabase és el real. CRDT/P2P és visió, no codi actiu.
- Fer que `design_guard` falle el build si apareix nou deute sense ticket.

---

### MISSIÓ 5 — El futur (consolidar el canvi de paradigma)

- **Genoma executable:** Skills amb contracte.
- **RAG amb jurisdicció explícita:** `.agents/skills` indexat.
- **Pedra Seca com a producte:** Tokens + guard + Storybook. Zero invenció en runtime.
- **Sollutia-first:** Delegar auth/storage. Nucli prim.

**DAFO:**
La desobediència és un defecte de topologia i format (el RAG no veu els skills). Prioritat: Skill mínima d'identitat, excepció RAG, unificar font del Consell, Design Guard estricte i Bootstrap d'immortalitat.
