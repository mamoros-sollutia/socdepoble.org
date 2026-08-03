# Auditoria mecànica del Brain

Arrel: `.`

## Mètriques

- `files`: `323`
- `bytes`: `7489085`
- `code_files`: `90`
- `missing_relative_imports`: `2`
- `missing_asset_references`: `73`
- `bare_imports`: `{"@google/genai": 2, "baileys": 2, "dexie": 2, "dotenv": 1, "lucide-react": 17, "qrcode-terminal": 1, "react": 30, "react-dom": 1, "react-router-dom": 12}`
- `legacy_mirror_pairs`: `14`
- `legacy_mirror_drift`: `1`
- `markdown_files`: `137`
- `active_markdown_files`: `72`
- `wikilinks`: `710`
- `broken_wikilinks`: `33`
- `active_orphans`: `24`
- `document_states`: `{"arxivat": 2, "auditat": 3, "canonic": 53, "esborrany": 10, "futur": 4}`
- `findings_by_severity`: `{"critical": 5, "high": 95, "low": 35, "medium": 232}`

## Troballes

### [CRITICAL] security.credentials-in-archive — `_wiki_de_poble/05_Escriptori_Soc_de_Poble/quarantena_scripts/ext.tar.gz`

L'arxiu conté membres amb noms de credencial/sessió.

Evidència: `membres_sensibles=3190; noms_omesos=1`

Acció: Revoca la sessió, elimina l'arxiu i purga'l de l'historial Git i de còpies compartides.

### [CRITICAL] code.import-missing — `bot/cervell.mjs:9`

Import relatiu no resolt.

Evidència: `../tooling/wiki/core/edge_rag.mjs`

Acció: Restaura el mòdul o elimina la branca morta.

### [CRITICAL] code.import-missing — `src/components/design-system/DesignSystemPage.jsx:2`

Import relatiu no resolt.

Evidència: `../../pages/public/UniversalPage`

Acció: Restaura el mòdul o elimina la branca morta.

### [CRITICAL] security.regex-sanitizer — `src/sections/detail/detailRichText.jsx:3`

Un regex que lleva script/style no és un sanititzador HTML.

Acció: No acceptes HTML o usa una allowlist provada a la frontera d'entrada.

### [CRITICAL] security.regex-sanitizer — `src/sections/detail/detailRichText.jsx:49`

Un regex que lleva script/style no és un sanititzador HTML.

Acció: No acceptes HTML o usa una allowlist provada a la frontera d'entrada.

### [HIGH] layout.alternative-set-missing — `projecte`

No existeix cap alternativa requerida: package-lock.json, npm-shrinkwrap.json, pnpm-lock.yaml, yarn.lock

Evidència: `package-lock.json | npm-shrinkwrap.json | pnpm-lock.yaml | yarn.lock`

Acció: Afig una única font canònica i versionada.

### [HIGH] layout.alternative-set-missing — `projecte`

No existeix cap alternativa requerida: vite.config.js, vite.config.mjs, vite.config.ts

Evidència: `vite.config.js | vite.config.mjs | vite.config.ts`

Acció: Afig una única font canònica i versionada.

### [HIGH] code.asset-missing — `/assets/avatars/comic/`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/brain/`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/brand/default_socdepoble.webp`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/events/nano_sessio_treball.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/fotos/carla-soriano.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/fotos/el-viatjant.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/fotos/iaia-maria.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/fotos/sultan.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/images/nano_anima_mas_ibanez_v3_1781060081431.webp`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/images/nano_porta_del_mas.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/images/nano_porta_masia_roure_1774195469079.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/images/towns/`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/market/`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/system/brand/logo.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/system/ui/logo-socdepoble-cuadrat-verd.svg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/system/ui/logo-socdepoble-rect-blanc.svg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/system/ui/logo-socdepoble-rect-negre.svg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/andreu-soler-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/avatar-marc-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/avatar-ratoli-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/beatriz-ortega-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/carla-soriano_comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/elena-popova-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/flash-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/iaia_comic_matriarch.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/javi-llinares-foto_perfil-01.jpg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/joan-batiste-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/mixa-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/nano-banana-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/nano_cita_metge.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/nano_simbiosi_sobirana.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/pepica-vall-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/avatars/vicent-ferris-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/aplec_danses_1774952191348.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/art_trellat_farmer_1774708525806.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/art_trellat_v2_1774708257858.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/collita_pomes_valencia_1779774496548.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/cuc-de-pi-poster.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/hero_panoramic_landscape_1774710654078.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/hero_panoramic_rural_view_1774720664221.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/hero_serrella_comic_1774709602282.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/ibanez_pedra_seca_design_1780873465211.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/media__1775376768839.jpg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/media__1775516493101.jpg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/nano-banana_arxiver_1774284589999.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/nano_agricola_mas_1773539958988.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/nano_astronauta_esmorzar_1773441997380.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/nano_mel_font_roja_1774216345755.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/nano_mercat_llaurador_1774197050578.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/nano_mixa_socis_1774215027069.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/nano_oli_oliva_1774198089084.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/nano_pedra_seca_1777089570387.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/brain/thermodynamics_ai_hardware_1775882083812.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/companies/mercat/aitana.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/companies/mercat/camiseta_portada.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/companies/mercat/flowers_bouquet.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/companies/mercat/generic_market.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/empresa/soc-de-poble/avatars/logo-socdepoble-cuadrat-verd.svg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/empresa/soc-de-poble/mercat/samarreta-soc-de-poble/02-samarreta-socdepoble-roly-plom-oscur-1024px.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/gent/avatars/andreu-soler-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/gent/avatars/beatriz-ortega-comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/gent/avatars/carla-soriano_comic.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/poble/`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/poble/benimassot/img-benimassot-main.jpg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/poble/la-torre-de-les-macanes/P_20161028_150735.jpg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/poble/la-torre-de-les-macanes/P_20161028_153325_SRES.jpg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/poble/la-torre-de-les-macanes/gentdelatorre-logo-bn-q.png`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/poble/la-torre-de-les-macanes/img-la-torre-de-les-ma-anes-main.jpg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/poble/la-torre-de-les-macanes/toponim-la-torre-de-les-macanes-2048px.jpg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/poble/morella/cover.jpg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] code.asset-missing — `/assets/uploads/poble/penaguila/img-pen-guila-main.jpg`

Asset referenciat però absent del paquet auditat.

Acció: Inclou l'asset o substitueix la referència per una URL/asset real.

### [HIGH] layout.required-missing — `AGENTS.md`

Falta un fitxer estructural obligatori: AGENTS.md

Acció: Restaura'l o deixa de declarar el paquet com a codi font complet.

### [HIGH] wiki.mirror-drift — `_wiki_de_poble/00_SER_Brain_Identitat/00_AGENTS_I_SKILLS_MIRROR/AGENTS.md`

El mirall manual divergeix de la font .agents.

Evidència: `source=.agents/AGENTS.md`

Acció: Regenera'l; no edites mai el mirall a mà.

### [HIGH] layout.required-missing — `index.html`

Falta un fitxer estructural obligatori: index.html

Acció: Restaura'l o deixa de declarar el paquet com a codi font complet.

### [HIGH] package.script-target-missing — `package.json`

L'script npm 'db:seed:generate' apunta a un fitxer inexistent.

Evidència: `scripts/generate-supabase-seed.sh`

Acció: Restaura el target o elimina l'script fals.

### [HIGH] package.script-target-missing — `package.json`

L'script npm 'wiki:link' apunta a un fitxer inexistent.

Evidència: `scripts/enllacat-intelligent-wiki.mjs`

Acció: Restaura el target o elimina l'script fals.

### [HIGH] package.script-target-missing — `package.json`

L'script npm 'wiki:audit' apunta a un fitxer inexistent.

Evidència: `tooling/wiki/autoneteja_wiki.mjs`

Acció: Restaura el target o elimina l'script fals.

### [HIGH] package.script-target-missing — `package.json`

L'script npm 'wiki:audit:strict' apunta a un fitxer inexistent.

Evidència: `tooling/wiki/autoneteja_wiki.mjs`

Acció: Restaura el target o elimina l'script fals.

### [HIGH] package.script-target-missing — `package.json`

L'script npm 'wiki:nervios' apunta a un fitxer inexistent.

Evidència: `tooling/wiki/sistema_nervios.mjs`

Acció: Restaura el target o elimina l'script fals.

### [HIGH] package.script-target-missing — `package.json`

L'script npm 'wiki:nervios:strict' apunta a un fitxer inexistent.

Evidència: `tooling/wiki/sistema_nervios.mjs`

Acció: Restaura el target o elimina l'script fals.

### [HIGH] package.script-target-missing — `package.json`

L'script npm 'wiki:robotomia' apunta a un fitxer inexistent.

Evidència: `tooling/wiki/cura_robotomia.mjs`

Acció: Restaura el target o elimina l'script fals.

### [HIGH] package.script-target-missing — `package.json`

L'script npm 'wiki:test' apunta a un fitxer inexistent.

Evidència: `.test.mjs`

Acció: Restaura el target o elimina l'script fals.

### [HIGH] package.script-target-missing — `package.json`

L'script npm 'reflex:init' apunta a un fitxer inexistent.

Evidència: `tooling/wiki/reflex_petorreta.mjs`

Acció: Restaura el target o elimina l'script fals.

### [HIGH] package.script-target-missing — `package.json`

L'script npm 'reflex:doctor' apunta a un fitxer inexistent.

Evidència: `tooling/wiki/reflex_petorreta.mjs`

Acció: Restaura el target o elimina l'script fals.

### [HIGH] package.script-target-missing — `package.json`

L'script npm 'precommit:sdp' apunta a un fitxer inexistent.

Evidència: `tooling/wiki/pre-commit.mjs`

Acció: Restaura el target o elimina l'script fals.

### [HIGH] layout.public-missing — `public`

Falta public/ encara que el codi referencia /assets/.

Acció: Inclou els assets reals o elimina les referències mortes.

### [HIGH] security.html-injection-sink — `src/sections/detail/PageDetailSection.jsx:50`

Punt d'injecció HTML; exigeix dades estructurades o sanitització robusta.

Acció: Elimina dangerouslySetInnerHTML per a dades remotes/usuari; renderitza nodes React.

### [HIGH] security.html-injection-sink — `src/sections/detail/detailRichText.jsx:13`

Punt d'injecció HTML; exigeix dades estructurades o sanitització robusta.

Acció: Elimina dangerouslySetInnerHTML per a dades remotes/usuari; renderitza nodes React.

### [HIGH] security.html-injection-sink — `src/sections/ia/IaSection.jsx:60`

Punt d'injecció HTML; exigeix dades estructurades o sanitització robusta.

Acció: Elimina dangerouslySetInnerHTML per a dades remotes/usuari; renderitza nodes React.

### [HIGH] security.html-injection-sink — `src/sections/notes/NotesSection.jsx:183`

Punt d'injecció HTML; exigeix dades estructurades o sanitització robusta.

Acció: Elimina dangerouslySetInnerHTML per a dades remotes/usuari; renderitza nodes React.

### [HIGH] security.html-injection-sink — `src/sections/text/TextSection.jsx:19`

Punt d'injecció HTML; exigeix dades estructurades o sanitització robusta.

Acció: Elimina dangerouslySetInnerHTML per a dades remotes/usuari; renderitza nodes React.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/00_AGENTS_I_SKILLS_MIRROR/03_regles_arquitectura_i_dades.md:110`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `IndexedDB`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/00_AGENTS_I_SKILLS_MIRROR/AGENTS.md:113`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/00_AGENTS_I_SKILLS_MIRROR/SKILL_campanyes-activisme.md:22`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Offline-First`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/00_AGENTS_I_SKILLS_MIRROR/SKILL_campanyes-activisme.md:82`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `IndexedDB`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/00_SER_Brain_Identitat/00_AGENTS_I_SKILLS_MIRROR/SKILL_socdepoble-autosanacio.md:31`

Wikilink sense objectiu resoluble.

Evidència: `fantasma`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/00_BIOS.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/01_IDENTITAT.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/01_IDENTITAT.md:10`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/01_IDENTITAT.md:10`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Dexie`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/01_IDENTITAT.md:11`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/02_EQUIP_IA.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/02_GENOTIP.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/02_GENOTIP.md:8`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/02_GENOTIP.md:10`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Offline-First`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/03_Consola_Termodinamica.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/03_Consola_Termodinamica.md:18`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/03_Consola_Termodinamica.md:18`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/CORE_Registre_Automillora.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/CORE_Registre_Automillora.md:18`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/DOC_Logos_Oficials.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/DOC_Taula_Mestra.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/Soci_Sollutia.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Soci_Sollutia.md:76`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Offline-First`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Soci_Sollutia.md:77`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Soci_Sollutia.md:109`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Soci_Sollutia.md:141`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/a11y_debugging.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/a11y_debugging.md:91`

Wikilink sense objectiu resoluble.

Evidència: `Sollutia`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_devtools.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_devtools.md:51`

Wikilink sense objectiu resoluble.

Evidència: `Sollutia`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md:40`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md:123`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md:156`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md:158`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md:240`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md:315`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md:320`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md:322`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md:323`

Wikilink sense objectiu resoluble.

Evidència: `Sollutia`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md:454`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md:484`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/debug_optimize_lcp.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/debug_optimize_lcp.md:126`

Wikilink sense objectiu resoluble.

Evidència: `Sollutia`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/google_antigravity_sdk.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/google_antigravity_sdk.md:96`

Wikilink sense objectiu resoluble.

Evidència: `Sollutia`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/memory_leak_debugging.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/memory_leak_debugging.md:53`

Wikilink sense objectiu resoluble.

Evidència: `Sollutia`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/modern_web_guidance.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/modern_web_guidance.md:78`

Wikilink sense objectiu resoluble.

Evidència: `Sollutia`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/troubleshooting.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/troubleshooting.md:96`

Wikilink sense objectiu resoluble.

Evidència: `Sollutia`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/anatomia_cognitiva.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/antigravity.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/antigravity.md:17`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/antigravity.md:17`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Offline-First`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/connectors_mcp_disseny.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.state-invalid — `_wiki_de_poble/00_SER_Brain_Identitat/connectors_mcp_disseny.md`

Estat documental fora de l'enum canònic.

Evidència: `futur`

Acció: Separa estat documental de l'estat d'una sessió/acta.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/el_projecte.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/el_projecte.md:25`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/el_projecte.md:25`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Dexie`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/el_projecte.md:29`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/identitat_visual.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/00_SER_Brain_Identitat/perfil_psiquiatric.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/perfil_psiquiatric.md:43`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/perfil_psiquiatric.md:43`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `IndexedDB`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/00_SER_Brain_Identitat/perfil_psiquiatric.md:45`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/01_SABER_Cultura_Coneixement/00_GLOSSARI_CANONIC.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/00_GLOSSARI_CANONIC.md:47`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/00_GLOSSARI_CANONIC.md:47`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `IndexedDB`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/00_GLOSSARI_CANONIC.md:57`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/01_SABER_Cultura_Coneixement/00_visio_i_pilars.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/00_visio_i_pilars.md:21`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/00_visio_i_pilars.md:32`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/01_SABER_Cultura_Coneixement/01_trellat.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/01_trellat.md:14`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/01_trellat.md:23`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/01_SABER_Cultura_Coneixement/Llibre_Blanc_Produccio_Pedra_Seca.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/01_SABER_Cultura_Coneixement/Sistema_Immunitari.md:31`

Wikilink sense objectiu resoluble.

Evidència: `fantasma`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_L_Anima.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_La_Forja.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_La_Forja.md:23`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `IndexedDB`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_La_Forja.md:23`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Dexie`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_La_Forja.md:25`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_La_Forja.md:26`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_Protocol_Lazaro.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_Protocol_Lazaro.md:23`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_Protocol_Lazaro.md:23`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `IndexedDB`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_Sistema_Nervios.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.state-invalid — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_Sistema_Nervios.md`

Estat documental fora de l'enum canònic.

Evidència: `futur`

Acció: Separa estat documental de l'estat d'una sessió/acta.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_Sistema_Nervios.md:1`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_Sistema_Nervios.md:14`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_Sistema_Nervios.md:27`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/01_SABER_Cultura_Coneixement/connexio_radical.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/01_SABER_Cultura_Coneixement/la_torre/fadrins_i_fadrines.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md:11`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Workbox`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md:11`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Dexie`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md:17`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Dexie`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md:19`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Workbox`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md:28`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md:36`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Dexie`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md:38`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Workbox`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md:39`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md:46`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md:50`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/00_plantilles.md`

L'ancoratge automàtic apareix 3 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/00_plantilles.md:29`

Wikilink sense objectiu resoluble.

Evidència: `07_plantilles`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_acta_unica.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_acta_unica.md:47`

Wikilink sense objectiu resoluble.

Evidència: `07_plantilles`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_brainstorming.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_brainstorming.md:49`

Wikilink sense objectiu resoluble.

Evidència: `07_plantilles`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_branding.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_branding.md:51`

Wikilink sense objectiu resoluble.

Evidència: `07_plantilles`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_creador_skills.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_creador_skills.md:51`

Wikilink sense objectiu resoluble.

Evidència: `07_plantilles`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_doc_to_app.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_doc_to_app.md:50`

Wikilink sense objectiu resoluble.

Evidència: `07_plantilles`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_modo_produccion.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_modo_produccion.md:46`

Wikilink sense objectiu resoluble.

Evidència: `07_plantilles`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_planificacio.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_planificacio.md:43`

Wikilink sense objectiu resoluble.

Evidència: `07_plantilles`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_prompt_iso.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_prompt_iso.md:34`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_prompt_iso.md:76`

Wikilink sense objectiu resoluble.

Evidència: `07_plantilles`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_prompt_iso.md:81`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_prompt_iso.md:81`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `PWA fora xarxa`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_skill_trellat.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_skill_trellat.md:36`

Wikilink sense objectiu resoluble.

Evidència: `07_plantilles`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/SDP_LOCK.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/SDP_LOCK.md:22`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.state-invalid — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/obsidian_plugins/Homepage.md`

Estat documental fora de l'enum canònic.

Evidència: `auditat`

Acció: Separa estat documental de l'estat d'una sessió/acta.

### [MEDIUM] wiki.state-invalid — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/obsidian_plugins/Plugins.md`

Estat documental fora de l'enum canònic.

Evidència: `auditat`

Acció: Separa estat documental de l'estat d'una sessió/acta.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md:31`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/AUDITORIA_CANONICA.md`

L'ancoratge automàtic apareix 3 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/AUDITORIA_CANONICA.md:84`

Wikilink sense objectiu resoluble.

Evidència: `skills`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md`

L'ancoratge automàtic apareix 3 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.state-invalid — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md`

Estat documental fora de l'enum canònic.

Evidència: `futur`

Acció: Separa estat documental de l'estat d'una sessió/acta.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:3`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:7`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:8`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `IndexedDB`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:8`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Dexie`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:9`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:11`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Offline-First`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:22`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `service worker`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:25`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `IndexedDB`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:29`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Dexie`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:31`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `IndexedDB`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:40`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:42`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md:93`

Wikilink sense objectiu resoluble.

Evidència: `skills`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/a11y_seo_trellat.md`

L'ancoratge automàtic apareix 3 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/a11y_seo_trellat.md:9`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/a11y_seo_trellat.md:30`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/a11y_seo_trellat.md:56`

Wikilink sense objectiu resoluble.

Evidència: `skills`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/futur_adaptacio.md`

L'ancoratge automàtic apareix 3 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/futur_adaptacio.md:41`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/futur_adaptacio.md:62`

Wikilink sense objectiu resoluble.

Evidència: `skills`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/index_trellat.md`

L'ancoratge automàtic apareix 3 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/index_trellat.md:29`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/index_trellat.md:66`

Wikilink sense objectiu resoluble.

Evidència: `skills`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/seguretat_execucio.md`

L'ancoratge automàtic apareix 3 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/seguretat_execucio.md:18`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `IndexedDB`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/seguretat_execucio.md:99`

Wikilink sense objectiu resoluble.

Evidència: `skills`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/self_repair.md`

L'ancoratge automàtic apareix 3 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/self_repair.md:85`

Wikilink sense objectiu resoluble.

Evidència: `skills`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/successio_lazaro_execucio.md`

L'ancoratge automàtic apareix 3 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/successio_lazaro_execucio.md:91`

Wikilink sense objectiu resoluble.

Evidència: `skills`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/DOC_Governanca.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/DOC_Governanca.md:47`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_Pedra_Seca.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_Pedra_Seca.md:14`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_Pedra_Seca.md:62`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Offline-First`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_Pedra_Seca.md:94`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_Pedra_Seca.md:112`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_Pedra_Seca.md:143`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_Pedra_Seca.md:160`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_Tokens_Pedra_Seca.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.frontmatter-key-missing — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_Tokens_Pedra_Seca.md`

Falta la clau de frontmatter 'description'.

### [MEDIUM] wiki.state-invalid — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_Tokens_Pedra_Seca.md`

Estat documental fora de l'enum canònic.

Evidència: `auditat`

Acció: Separa estat documental de l'estat d'una sessió/acta.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_UI_Universal.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_UI_Universal.md:15`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_UI_Universal.md:62`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `100% offline`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/FORJA_TO_CORE.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.state-invalid — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/FORJA_TO_CORE.md`

Estat documental fora de l'enum canònic.

Evidència: `futur`

Acció: Separa estat documental de l'estat d'una sessió/acta.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/FORJA_TO_CORE.md:23`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `iPad A10`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/LLEI_05_Privacitat.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/LLEI_05_Privacitat.md:29`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/PLA_DIRECTOR_Legal_i_Subvencions.md:26`

Wikilink sense objectiu resoluble.

Evidència: `Sollutia`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/PLA_DIRECTOR_Legal_i_Subvencions.md:60`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `CRDT`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] modernisation.doctrine-marker — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/PLA_DIRECTOR_Legal_i_Subvencions.md:70`

Doctrina activa encara vinculada al paradigma offline/A10.

Evidència: `Offline-First`

Acció: Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/PLA_DIRECTOR_Legal_i_Subvencions.md:73`

Wikilink sense objectiu resoluble.

Evidència: `Sollutia`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_INDEX_ESCRIPTORI.md:39`

Wikilink sense objectiu resoluble.

Evidència: `alegacions`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/90_arxiu_historic/260715_1624_ACTA_Teixidora_Proposta_Insercio_Enllacos_Interns_Cos_Documents_Canonics.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.anchor-duplicated — `_wiki_de_poble/90_arxiu_historic/260719_0430_ACTA_MARMOTA_Tancament_Sessio_Purga.md`

L'ancoratge automàtic apareix 2 vegades.

Acció: Normalitza'l a una única aparició o elimina este ritual redundant.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/90_arxiu_historic/260719_0430_ACTA_MARMOTA_Tancament_Sessio_Purga.md:12`

Wikilink sense objectiu resoluble.

Evidència: `Sollutia`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] wiki.link-broken — `_wiki_de_poble/90_arxiu_historic/260719_0430_ACTA_MARMOTA_Tancament_Sessio_Purga.md:12`

Wikilink sense objectiu resoluble.

Evidència: `smoke_test.mjs`

Acció: Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.

### [MEDIUM] hygiene.runtime-state — `bot/var/baileys-runtime/owner.lock`

Estat efímer de runtime empaquetat amb el codi.

Acció: Elimina'l del repositori i afig bot/var/ a .gitignore.

### [MEDIUM] hygiene.runtime-state — `bot/var/baileys-runtime/owner.lock.stale-1785335521541`

Estat efímer de runtime empaquetat amb el codi.

Acció: Elimina'l del repositori i afig bot/var/ a .gitignore.

### [MEDIUM] hygiene.runtime-state — `bot/var/baileys-runtime/owner.lock.stale-1785335554764`

Estat efímer de runtime empaquetat amb el codi.

Acció: Elimina'l del repositori i afig bot/var/ a .gitignore.

### [MEDIUM] hygiene.runtime-state — `bot/var/baileys-runtime/owner.lock.stale-1785335577130`

Estat efímer de runtime empaquetat amb el codi.

Acció: Elimina'l del repositori i afig bot/var/ a .gitignore.

### [MEDIUM] hygiene.runtime-state — `bot/var/baileys-runtime/owner.lock.stale-1785335622518`

Estat efímer de runtime empaquetat amb el codi.

Acció: Elimina'l del repositori i afig bot/var/ a .gitignore.

### [MEDIUM] hygiene.runtime-state — `bot/var/baileys-runtime/owner.lock.stale-1785335853909`

Estat efímer de runtime empaquetat amb el codi.

Acció: Elimina'l del repositori i afig bot/var/ a .gitignore.

### [MEDIUM] package.duplicate-icon-package — `package.json`

Es declaren lucide i lucide-react; el codi React només necessita lucide-react.

Acció: Elimina lucide si no hi ha cap import directe verificat.

### [MEDIUM] package.unused-workbox — `package.json`

workbox-window està declarat però no s'importa.

Acció: Elimina'l amb la PWA/offline o documenta un ús real verificat.

### [MEDIUM] modernisation.obsolete-marker — `src/components/design-system/DesignSystemPage.jsx:20`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `iPad A10`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/components/design-system/DesignSystemPage.jsx:23`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `iPad A10`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/config/designSystemMarkdown.js:1`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `iPad A10`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/data/db.js:1`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/data/db.js:1`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/data/db.js:3`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/data/db.js:14`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/data/db.js:23`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/main.jsx:9`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Offline-First`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/main.jsx:9`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `service worker`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/csv_ingestor.js:119`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/csv_ingestor.js:121`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `IndexedDB`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/csv_ingestor.js:209`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/db.js:3`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `IndexedDB`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/db.js:3`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/db.js:5`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/db.js:5`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/db.js:11`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/db.js:12`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/db.js:12`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/db.js:37`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/tauler.js:109`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Dexie`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/gestoria/logic/tauler.js:391`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `100% offline`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/text/pageContent.js:31`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `Offline-First`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/text/pageContent.js:35`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `service worker`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/text/pageContent.js:35`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `IndexedDB`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [MEDIUM] modernisation.obsolete-marker — `src/sections/text/pageContent.js:71`

Marcador del paradigma offline/A10 que necessita decisió de migració.

Evidència: `CRDT`

Acció: Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.

### [LOW] hygiene.junk — `_wiki_de_poble/.DS_Store`

Artefacte local que no ha d'entrar al repositori.

Acció: Mou-lo a paperera i ignora'l en Git/ZIP.

### [LOW] hygiene.junk — `_wiki_de_poble/.obsidian/.DS_Store`

Artefacte local que no ha d'entrar al repositori.

Acció: Mou-lo a paperera i ignora'l en Git/ZIP.

### [LOW] hygiene.junk — `_wiki_de_poble/00_SER_Brain_Identitat/.DS_Store`

Artefacte local que no ha d'entrar al repositori.

Acció: Mou-lo a paperera i ignora'l en Git/ZIP.

### [LOW] wiki.orphan — `_wiki_de_poble/00_SER_Brain_Identitat/CORE_Registre_Automillora.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/a11y_debugging.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_devtools.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/debug_optimize_lcp.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/google_antigravity_sdk.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/memory_leak_debugging.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/modern_web_guidance.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/troubleshooting.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/00_SER_Brain_Identitat/antigravity.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/00_SER_Brain_Identitat/connectors_mcp_disseny.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/00_SER_Brain_Identitat/perfil_psiquiatric.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] hygiene.junk — `_wiki_de_poble/01_SABER_Cultura_Coneixement/.DS_Store`

Artefacte local que no ha d'entrar al repositori.

Acció: Mou-lo a paperera i ignora'l en Git/ZIP.

### [LOW] wiki.orphan — `_wiki_de_poble/01_SABER_Cultura_Coneixement/INDEX_TAXONOMIC.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/01_SABER_Cultura_Coneixement/Llibre_Blanc_Produccio_Pedra_Seca.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_L_Anima.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_La_Forja.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_Sistema_Nervios.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/01_SABER_Cultura_Coneixement/connexio_radical.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/01_SABER_Cultura_Coneixement/la_torre/fadrins_i_fadrines.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] hygiene.junk — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/.!11382!.DS_Store`

Artefacte local que no ha d'entrar al repositori.

Acció: Mou-lo a paperera i ignora'l en Git/ZIP.

### [LOW] hygiene.junk — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/.DS_Store`

Artefacte local que no ha d'entrar al repositori.

Acció: Mou-lo a paperera i ignora'l en Git/ZIP.

### [LOW] wiki.orphan — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/00_plantilles.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_skill_trellat.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] hygiene.junk — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/.DS_Store`

Artefacte local que no ha d'entrar al repositori.

Acció: Mou-lo a paperera i ignora'l en Git/ZIP.

### [LOW] wiki.orphan — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_Tokens_Pedra_Seca.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_UI_Universal.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] wiki.orphan — `_wiki_de_poble/03_GOVERNAR_Normativa_Regles/PLA_DIRECTOR_Legal_i_Subvencions.md`

Document actiu sense cap enllaç d'entrada.

Acció: Enllaça'l des d'un índex/MOC o arxiva'l.

### [LOW] hygiene.junk — `_wiki_de_poble/05_Escriptori_Soc_de_Poble/.DS_Store`

Artefacte local que no ha d'entrar al repositori.

Acció: Mou-lo a paperera i ignora'l en Git/ZIP.

### [LOW] hygiene.junk — `_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/.DS_Store`

Artefacte local que no ha d'entrar al repositori.

Acció: Mou-lo a paperera i ignora'l en Git/ZIP.

### [LOW] hygiene.generated — `_wiki_de_poble/05_Escriptori_Soc_de_Poble/quarantena_scripts/audit_result.json`

Resultat generat versionat com si fora font.

Acció: Regenera'l en CI o fora del vault; no el tractes com autoritat.

### [LOW] hygiene.junk — `src/.DS_Store`

Artefacte local que no ha d'entrar al repositori.

Acció: Mou-lo a paperera i ignora'l en Git/ZIP.
