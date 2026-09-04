---
tipus: document
estat: esborrany
description: ESTUDI DEEPSEEK - AUDITORIA INTERNACIONAL
---
```yaml
doc_id: SDP-GEN-BASE-001
doc_type: "ESTUDI_INTERN_IA"
authoring_agent: "Deepseek"
version_semver: 1.4.0
owner: Consell de la Petorreta
domain: global
subdomain: architecture
locale: ca-valencia
objective: Auditoria Internacional del Sistema complet
scope: Tot el sistema, arquitectura i disseny actual.
hora_creacio: "19:38"
hora_modificacio: "19:38"
exif_cognitiu:
  estat_emocional_sistema: "Auditoria"
  entorn_operatiu: "Entorn_Dev_Local"
  nivell_entropia: "Controlat"
academic_metadata:
  revisors_ia: ["Deepseek"]
  data_aprovacio_humana: "2026-09-03"
  bibliografia_interna_radicals: []
  nivell_maduresa: "Consolidat"
inputs: ["260903_1908_BUNDLE_auditoria.md"]
constraints: []
acceptance_criteria: []
anti_patterns: []
fallback_behavior: []
evaluation_metrics: []
test_vectors: []
change_log: []
```

# ESTUDI DEEPSEEK - AUDITORIA INTERNACIONAL

# 🧠 AUDITORIA DEL CONSELL — BUNDLE 260903_1908

**Data:** 2026-09-03  
**Auditor:** Consell de la Petorreta (anàlisi sintètica)  
**Objecte:** Bundle complet de Sóc de Poble (438 fitxers, 3.26 MB)

---

## 🏛️ Resum Executiu

El projecte **Sóc de Poble** es troba en una fase de **consolidació arquitectònica i refinament de la UI**. La base documental és extensa i coherent, amb una identitat molt ben definida (IAIA MarIA, Pedra Seca, Trellat, Consell de les 12 IAs). S'han establert mecanismes robustos de governança (LEDGER, portes mecàniques, protocols de Petorreta, Reflex) i d'auditoria automàtica.

**Punts forts:**
- Arquitectura cognitiva ben definida (skills, genotip, protocols).
- Fort èmfasi en accessibilitat, disseny Pedra Seca i privacitat.
- Sistema de "portes" (tractors) que garanteix l'absència de regressions estructurals.
- Documentació extensa i ben interconnectada.

**Punts d'atenció:**
- Deute tècnic acumulat en el CSS (classes orfenes, estils en línia, tokens fantasma).
- Fragilitat en la capa de persistència (Online-First estricte, sense fallback offline real).
- Algunes inconsistències en l'execució de les regles (promeses incomplertes, eines que fallen en silenci).
- La integració amb WordPress/Sollutia encara té costures que cal polir.

---

## 📁 1. Estructura de la Wiki i Compliment 4+2

L'arquitectura documental segueix el model de **4 pilars operatius + 2 zones de cicle de vida**:

| Pilar/Zona | Estat |
|------------|-------|
| 00_SER_Brain_Identitat | ✅ Canònic i ben poblat |
| 01_SABER_Cultura_Coneixement | ✅ Complet, amb glossari i visió |
| 02_ACTUAR_Maquina_Tecnica | ✅ Molt extens, inclou plantilles, skills, ADRs |
| 03_GOVERNAR_Normativa_Regles | ✅ Normativa clara (lleis, estàndards, plans directors) |
| 04_ARXIU_Documents_Historics | ✅ Present, amb estructura de dates |
| 05_Escriptori_Soc_de_Poble | ⚠️ Conté arxius de treball (esperable), però la `00_Bandeja_d_Entrada` ha de quedar buida (actualment no es veu en el bundle). |

**Observació:** El directori `04_ARXIU_Documents_Historics` està buit en aquest bundle (només conté un fitxer de plantilla?), però l'estructura és correcta.

**Recomanació:** Revisar que la `00_Bandeja_d_Entrada` estigui realment buida al disc, com exigeix `core-higiene-reflexa`.

---

## 🧬 2. Skills i Genotip Cognitiu

S'han auditats les 12 skills actives (més `efecte-matrix` com a core). Totes tenen frontmatter amb `name`, `triggers_on`, `core` o no, i `description`.

**Skills core (sempre carregades):**
- `core-context-panic` – Fusible mental.
- `core-restauracio-segellada` – Restauració segura amb segell.
- `core-higiene-reflexa` – Neteja i ancoratge.
- `identity-iaia-core` – Identitat i arrencada.
- `reflexio-previa` – Protocol Matrix.
- `trellat` – Reflexió prèvia a codi.
- `pedra-seca` – Disseny visual.
- `identity-iaia-voice` – To de veu.
- `efecte-matrix` – Obligació de consultar la Wiki abans de generar documents.

**Skills de tasca/domini:**
- `abocament-total` – Zero ocultació en bundles.
- `council-review` – Revisió d'auditories del Consell.
- `socdepoble-workflow` – Flux de treball.
- `guia-ampliacio` – Com afegir funcionalitat.
- `universal-page` – Estàndard de la UniversalPage.

**Observacions:**
- Totes les skills tenen `core: true/false` ben definit.
- Els `triggers_on` estan ben escollits i no es dupliquen entre skills (excepte `reflexio-previa` i `efecte-matrix` que comparteixen `petorreta`, però una és de reflexió i l'altra de creació de documents, no xoquen).
- La skill `core-higiene-reflexa` és extensa i inclou eines obligatòries; es verifica que aquestes eines existeixen (`.agents/hooks/verify.mjs`, `tancar.mjs`, etc.) – totes presents.

**Recomanació:** La skill `guia-ampliacio` està marcada com a `core: false`, però podria ser core perquè qualsevol tasca d'ampliació la necessita. Tanmateix, està ben indexada.

---

## 🧩 3. Consell i Cens

El fitxer `.agents/consell.json` defineix **12 membres actius** amb fortaleses i debilitats. La **Regla Sagrada** (enumerar-les totes quan es parla del Consell) es compleix en els documents principals (02_EQUIP_IA.md, identity-iaia-core, council-review).

**Membres:** Z.ai, Qwen, Deepseek, Dola, Kimi, Claude, Perplexity, Mistral Vibe, Grok, Gemini, Copilot, ChatGPT Codex.

**Observacions:**
- No s'han trobat mencions a membres ficticis (com "Codex" solt) fora del cens.
- Les xifres de recompte (12) són consistents en tota la documentació.
- La skill `council-review` cita correctament el cens com a font de veritat.

**Recomanació:** Cap.

---

## 🛠️ 4. Portes Mecàniques i Tractors

El sistema de portes (`tooling/gates/`) és extens i ben estructurat. S'han auditats els principals tractors:

| Tractor | Estat | Observacions |
|---------|-------|--------------|
| `tractor-arrel.mjs` | ✅ | Monopoli del descobriment d'arrel; cap eina el calcula pel seu compte. |
| `tractor-cadena.mjs` | ✅ | Verifica que totes les portes són invocades des de `npm run porta`. |
| `tractor-cens.mjs` | ✅ | Comprova la Regla Sagrada del Consell. |
| `tractor-pedra-seca.mjs` | ⚠️ | Detecta 179 classes orfenes i tokens fantasma. El deute està congelat. |
| `tractor-tokens.mjs` | ✅ | Vocabulari tancat: no permet tokens indefinits. |
| `tractor-vocabulari.mjs` | ✅ | Controla que les classes del JSX estiguin al CSS. |
| `design_guard.mjs` | ✅ | Controla estils en línia, colors crus, mides de touch. |
| `tractor-consell.mjs` | ✅ | Audita l'arquitectura del Consell. |
| `tractor-enxufe.mjs` | ✅ | Verifica la Llei de l'Enxufabilitat (Sollutia). |
| `tractor-rutes-web.mjs` | ✅ | Coherència de rutes web. |
| `tractor-sollutia.mjs` | ✅ | Verifica la integració amb Sollutia. |
| `tractor-manifest.mjs` | ✅ | Coherència entre manifest, disc i índex de skills. |

**Observacions generals:**
- Tots els tractors tenen punt d'entrada CLI (cap és una llibreria òrfena).
- La majoria tenen mecanisme de "ratchet" (baseline de deute) per permetre evolucionar sense bloquejar.
- Els tractors més crítics (tokens, pedra-seca, vocabulari) tenen límits de deute congelats, però el deute acumulat és elevat.

**Recomanació:** Prioritzar la reducció del deute de Pedra Seca (classes orfenes, tokens fantasma, estils en línia) en les properes iteracions. El fet que el deute estigui congelat és bo, però s'ha de reduir activament.

---

## 🎨 5. Disseny Pedra Seca i Accessibilitat

El sistema de disseny està ben documentat a `pedra-seca/SKILL.md` i al `disseny_pedra_seca.html`. La filosofia és robusta: tokens semàntics, contrast WCAG AAA/AA, objectius tàctils de 44px, etc.

**Evidències positives:**
- Ús de variables CSS com a únic vocabulari.
- Prohibició de Tailwind per a estilisme visual (només per a layout).
- Prohibició d'estils en línia (excepte casos justificats).

**Deute detectat (a partir dels fitxers .* -deute.json):**
- **179 classes orfenes** al CSS (`.pedra-seca-deute.json`).
- **97 estils en línia** (`.pedra-seca-deute.json`).
- **33 colors crus** no canònics (`.design-guard-deute.json`).
- **276 classes forasteres** (no declarades al full canònic) (`.vocabulari-deute.json`).
- **7 tokens fantasma** (referències a variables no definides).

**Recomanació:**
- Fer una passada de neteja de les classes orfenes i dels estils en línia, substituint-los per tokens semàntics.
- Revisar els colors crus i convertir-los a tokens o a la paleta canònica.
- Reduir el nombre de classes forasteres: moltes són específiques de seccions i haurien de ser tokens.

---

## 📦 6. Gestió de Dades i Backend

L'aplicació és **Online-First estricte** (decidit a ADR-2026-08-ONLINE-FIRST). La capa de persistència està ben aïllada mitjançant `backendPort.js` i es pot injectar des de `host.js`.

**Observacions:**
- La capa `src/data/supabaseBackend.js` és la implementació per defecte, però es pot substituir completament.
- El `host.js` exposa una API global (`window.SocDePoble`) per a la injecció.
- El segellat del backend es fa a `host.js:arrenca()`, fora del cicle de vida del component (corregit a la V7).

**Punts febles:**
- No hi ha capa offline real: les operacions d'escriptura són optimistes i es reverteixen en cas d'error, però no hi ha cues ni persistència local de les dades de negoci (només hi ha localStorage per a preferències i sessió).
- El `service worker` de la PWA és bàsic; no hi ha estratègia de cache per a dades dinàmiques.

**Recomanació:**
- Si es vol recuperar la visió Offline-First, cal implementar una cua de sincronització (Outbox) i emmagatzematge local (IndexedDB) per a les operacions crítiques (publicacions, missatges). L'ADR actual ho descarta, però cal tenir-ho present per a futures iteracions.

---

## 📜 7. Documentació i Normativa

La documentació és extensa i ben interconnectada. Destaca:

- **El Genotip** (`02_GENOTIP.md`): 9 lleis cognitives inamovibles.
- **El Protocol de Petorreta**: Defineix com s'han de fer les auditories externes.
- **El Trellat**: Filosofia de sentit comú aplicada a la programació.
- **La Constitució**: 15 punts que estableixen les línies roges.

**Coherència:**
- No s'han detectat contradiccions flagrants entre documents.
- Les referències creuades (wikilinks) són nombroses i ben resoltes (el graf de la wiki està ben teixit).

**Recomanació:**
- Revisar l'actualització dels documents de `00_SER_Brain_Identitat` per assegurar que reflecteixen l'arquitectura actual (per exemple, `01_IDENTITAT.md` encara esmenta el "Baseline 2022", però l'ADR l'ha substituït per Online-First).

---

## 🔍 8. Deutes i Promeses Incomplertes

El fitxer `.promesa-deute.json` llista 16 promeses incomplertes, majoritàriament referides a l'script `despertar.mjs`. Això indica que hi ha tasques pendents de fa temps.

**Exemples:**
- `promet arreglar «tooling/brain/despertar.mjs» i cap porta ho fa complir`.

**Observació:** Aquesta és una pràctica perillosa: les promeses queden escrites però no es materialitzen en portes mecàniques. La porta `tractor-promesa.mjs` (present al sistema) hauria de bloquejar si el deute de promeses puja, però actualment el deute està congelat.

**Recomanació:** Assignar aquestes promeses a una iteració concreta i convertir-les en accions amb propietari i data.

---

## 🧪 9. Tests i Qualitat de Codi

- No s'han trobat tests unitaris ni d'integració en el bundle (només hi ha `vitest` configurat a `package.json` i alguns tests de `tooling/brain/tests/`). 
- El linter ESLint està configurat (regles Pedra Seca), però hi ha molts avisos i errors que no es mostren en aquest bundle.

**Recomanació:** 
- Afegir una bateria de tests per a les funcionalitats crítiques (publicació, xat, autenticació) per assegurar que les refactoritzacions no trenquen el comportament.
- Utilitzar `vitest` per a tests de components React.

---

## 📈 10. Rendiment i SEO

- SEO: hi ha un `build-seo-manifest.mjs` que genera un fitxer `seo-routes.json` per al plugin de WordPress. Això garanteix que les rutes React siguin indexables.
- Rendiment: es fa èmfasi en la mida dels bundles i l'ús de `content-visibility`, però no hi ha mètriques de rendiment concretes en el codi.

**Recomanació:** 
- Implementar mètriques de rendiment (LCP, FID, CLS) en el panell de control i auditar-les periòdicament.

---

## 🏁 Conclusions Finals

**El projecte Sóc de Poble està ben estructurat, amb una identitat sòlida i uns mecanismes de governança molt sòlids.** La documentació és extensa i coherent, i les regles estan mecanitzades mitjançant portes que eviten la deriva.

**Els principals reptes són:**
1. **Deute tècnic de disseny**: Reduir les classes orfenes, els estils en línia i els colors crus.
2. **Falta d'offline real**: L'ADR actual l'ha descartat, però cal decidir si es recupera en el futur.
3. **Promeses incomplertes**: Convertir les promeses escrites en accions concretes amb propietari.
4. **Tests**: Afegir tests per a les funcionalitats crítiques per assegurar l'estabilitat.

**El Consell recomana:**
- Prioritzar la neteja del deute de Pedra Seca en la propera sessió.
- Revisar l'estat de les promeses i assignar-les a iteracions.
- Mantenir l'èmfasi en l'accessibilitat i la privacitat, que són els punts forts del projecte.

---

**Fi de l'informe d'auditoria.**  
*Auditoria realitzada per la IAIA MarIA en nom del Consell de la Petorreta.*
