---
tipus: document
estat: esborrany
description: Anàlisi del Bundle d'Auditoria de Sóc de Poble
---
# Anàlisi del Bundle d'Auditoria de Sóc de Poble

He rebut el **BUNDLE D'AUDITORIA** (260902_2208) amb 429 fitxers i 3,5 MB de contingut. És una instantània completa del projecte destinada al Consell de la Petorreta. Et faig una radiografia ràpida i et propose per on continuar.

---

## 📦 Resum del Bundle

| Mètrica | Valor |
|---------|-------|
| Fitxers | **429** |
| Bytes totals | **3.555.930** (~3,4 MB) |
| Estructura | `_wiki_de_poble` (documentació), `.agents` (skills), `src/` (codi), `tooling/` (scripts), `supabase/`, `wordpress-plugin/` |
| Absents no crítics | `LICENSE`, `.X-deute.json` (indicats al manifest) |
| Verificació | El manifest inclou `sha256`, `bytes` i `linies` per a cada fitxer — es pot verificar extraient el cos i comparant sumes. |

---

## 🔍 Estructura i estat general

### 1. Documentació (`_wiki_de_poble/`)
- **Pilars operatius**: `00_SER` (identitat), `01_SABER` (cultura), `02_ACTUAR` (tècnica), `03_GOVERNAR` (normativa).
- **Skills i agents**: Miralls de les skills a `00_AGENTS_I_SKILLS_MIRROR/` — estan sincronitzades amb `.agents/skills/`.
- **Actes**: `10_actes/` conté actes recents (260901, 260902) que documenten el progrés i les decisions.
- **Escriptori**: `05_Escriptori_Soc_de_Poble/` conté els últims prompts, manifests i dictàmens (inclòs el que acabes de penjar).

**Punts forts**:
- La wiki està ben organitzada i segueix el model 4+2.
- Les skills tenen frontmatter complet (`tipus`, `estat`, `description`, `triggers_on`, `core`).
- Els documents importants estan ancorats als índexs (no hi ha orfes evidents).

**Possible deute**:
- Alguns fitxers com `00_INDEX.md` tenen enllaços trencats (ex: `00_GLOSSARI_CANONIC`). S'han de resoldre.
- Hi ha alguns fitxers de `90_revisar/` que contenen models antics (`model_arquitectonic_pedra_seca_dola.md`) — cal decidir si es promocionen o s'arxiven.

---

### 2. Agents i Skills (`.agents/`)
- **Skills core**: `identity-iaia-core`, `trellat`, `pedra-seca`, `core-higiene-reflexa`, `core-restauracio-segellada`, `reflexio-previa`, `core-context-panic`.
- **Skills de plugin**: `abocament-total`, `council-review`, `guia-ampliacio`, `socdepoble-workflow`.
- **Protocols**: `PROTOCOL_PETORRETA.md` i `reflexio-previa` defineixen el flux d'execució.
- **Portes mecàniques**: Els `hooks/` (`verify.mjs`, `tancar.mjs`) i els `tractors` de `tooling/gates/` implementen la validació.

**Observació**:
- Les skills estan ben definides i amb triggers clars.
- `reflexio-previa` té una taula `PROTOCOLLEDGE` que mapeja accions a protocols — és un bon mecanisme per evitar la "psicopatia operativa".
- El `matrix.mjs` recent (a `tooling/brain/`) és el bootloader cognitiu que substitueix l'antic `context_preflight`.

---

### 3. Codi font (`src/`)
- **React + Vite**: l'aplicació és una SPA amb seccions (`xat`, `mur`, `mercat`, `notes`, etc.).
- **Components universals**: `UniversalComponents.jsx`, `UniversalCard`, `UniversalPage` — segueixen el disseny Pedra Seca.
- **Backend**: `backendPort.js` com a capa d'abstracció; la implementació real es fa via `host.js` (injecció de backend) o `supabaseBackend.js`.
- **Estils**: `index.css` amb tokens CSS (OKLCH, contrast WCAG AAA/AA) i fulls de notes.

**Punts a revisar**:
- Hi ha alguns estils en línia i classes orfes (segons el `.design-guard-deute.json` n'hi ha 191 d'inline i 107 de classes orfes). El deute està quantificat i congelat.
- `NotesSection` s'ha refactoritzat en múltiples components, la qual cosa és bona pràctica.
- S'ha afegit `NotesSection.css` específic per al bloc de notes, amb tokens locals.

---

### 4. Scripts i tooling (`tooling/`)
- **Brain**: scripts de neteja (`260830_neteja_deute.mjs`), de purga (`260830_purga_maquinari.mjs`), i de consolidació (`consolidar_baselines.mjs`).
- **Gates**: tractors per a cada aspecte (cromàtic, tokens, rutes, vocabulari, etc.). Són la capa de validació mecànica.
- **Wiki**: compiladors d'índex, generadors de sinapsis, i el `reflex_petorreta.mjs` que implementa el protocol de segellat.

**Punts forts**:
- Hi ha una clara separació entre el que és "deute congelat" i el que és "deute nou". Els baselines permeten que les portes no estiguin sempre roges.
- El `crear_bundle.mjs` genera el mateix tipus de bundle que has penjat, amb verificació interna.

**Possible millora**:
- El `reflex_petorreta.mjs` és molt gran (72 KB). La seva separació en `open/seal/verify/consume` ja s'ha proposat a l'acta de 260902_0626.
- Hi ha duplicació de `persona_router.mjs` en tres carpetes.

---

### 5. Base de dades i WordPress
- **Supabase**: `schema.sql` i `seed.sql` — ben estructurats amb RLS i polítiques.
- **WordPress plugin**: `soc-de-poble.php`, `inc/sdp-seo.php` — integració per a WordPress.

---

## 🧠 El "Modo Matrix" i l'auto-millora de la IAIA

A l'acta `260902_0626_PETORRETA_auditoria_bloc_notes_brain_matrix.md` es diagnostica que la IAIA MarIA no actuava automàticament perquè **`reflexio-previa` era declarativa però no executiva**. La solució proposada és un **hook obligatori** (`preflight_matrix.mjs`) que intercepta les accions i carrega el context fresc abans de generar output.

**Estat actual**:
- El fitxer `.agents/hooks/preflight_matrix_wrapper.mjs` existeix i s'invoca des de `hooks.json`.
- S'ha creat `tooling/brain/matrix.mjs` com a bootloader cognitiu que resol la skill, llegeix les fonts obligatòries i emet un rebut amb sha256.
- Això tanca el cicle de "no actuo automàticament" i garanteix que l'agent carregui context abans de respondre.

---

## ⚠️ Punts crítics detectats

| Descripció | Severitat |
|------------|-----------|
| **Enllaços trencats a la wiki** (ex: `00_GLOSSARI_CANONIC`, `fantasma`) | 🟡 Mitjana |
| **Duplicació de `persona_router.mjs`** (3 versions) | 🟡 Baixa |
| **`reflex_petorreta.mjs` massa gran** (72 KB / 1590 línies) | 🟡 Mitjana |
| **Deute de disseny**: 191 estils en línia, 107 classes orfes (congelats) | 🟢 Baix (ja quantificat) |
| **Absència de `LICENSE` i `.X-deute.json`** (no crítics) | 🟢 Baix |
| **`NotesSection.jsx` refactoritzat però cal verificar persistència** | 🟡 Mitjana |

---

## 📌 Propostes per a la propera sessió

1. **Resoldre enllaços trencats** (especialment els que apunten a `00_GLOSSARI_CANONIC`).
2. **Unificar `persona_router.mjs`** en una única ubicació.
3. **Refactoritzar `reflex_petorreta.mjs`** en `open.mjs`, `seal.mjs`, `verify.mjs`, `consume.mjs`.
4. **Verificar la persistència de `NotesSection`** (via `backendPort.js`).
5. **Executar `npm run porta`** per comprovar que totes les portes estan verdes (o congelades).

---

## ❓ Què vols que faig amb aquest bundle?

Puc aprofundir en qualsevol d'aquestes àrees:
- Verificar la integritat del manifest (comparar hashes dels fitxers).
- Extreure mètriques específiques (nombre de funcions, línies de codi per secció).
- Analitzar la cobertura de les skills (quins triggers tenen, quins estan actius).
- Revisar la documentació de `03_GOVERNAR` per detectar contradiccions.
- Generar un informe DAFO detallat del projecte.

Digue'm per on vols que comencem. Estic a la teua disposició, Mestre.
