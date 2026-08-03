# Gran auditoria de l’arquitectura cognitiva i tècnica

**Sóc de Poble · IAIA MarIA · 2 d’agost de 2026**

## Veredicte

El ZIP no és un projecte complet ni desplegable. És una superposició de quatre
generacions: Brain normatiu, prototip web, bot WhatsApp i restes de sessions de
desenvolupament. La documentació declara una arquitectura que no existeix; el
codi mostra funcions que no funcionen; i el paquet conté material que no hauria
d’haver eixit mai d’un volum privat.

No recomane “refactoritzar el que hi ha” com si la base fora fiable. Recomane
contindre dos incidents, reconstruir una base compilable mínima i migrar només
les funcions verificades.

Els bloquejadors són:

1. **Credencials WhatsApp exposades.**
   `_wiki_de_poble/05_Escriptori_Soc_de_Poble/quarantena_scripts/ext.tar.gz`
   conté una sessió Baileys completa. No he obert ni reproduït els valors.
2. **Possible filtració financera.**
   `src/sections/gestoria/logic/dashboard_data.js` conté un llibre major
   granular amb aparença de dades reals.
3. **Privacitat i autenticació fictícies.** La UI mostra “Privada”, login,
   Google i “Centre de control”, però no aplica eixes garanties.
4. **Paquet incomplet.** Falten `index.html`, configuració Vite, lockfile,
   assets, schema/migracions Supabase i el motor RAG importat pel bot.
5. **Web no funcional.** El xat és una maqueta, hi ha un bucle de redirecció i
   les submissions remotes es guarden/lligen de manera contradictòria.
6. **Govern impossible.** La màxima autoritat `AGENTS.md` no existeix i el
   Protocol Petorreta obliga a usar scripts que tampoc existeixen.

## Abast i cadena de custòdia

- Font: `Cervell_i_Codi_Agost.zip`.
- SHA-256: `286adcfb1d9b6f71aa602364636cb4628af3dd77233ad1e63a824eb705b24691`.
- Contingut original: 422 entrades, 323 fitxers, 7.489.085 bytes descomprimits.
- El ZIP original no s’ha modificat.
- L’anàlisi s’ha fet sobre una còpia en `work/audit_src`.
- No s’han usat ni mostrat credencials.
- No s’ha instal·lat cap dependència ni s’ha fet cap crida pagada.

Verificacions executades:

- inspecció segura de noms dins de ZIP/TAR;
- inventari, hashes, duplicats, frontmatter, enllaços, imports i assets;
- graf d’importacions des de `src/main.jsx`;
- `node --check` sobre 37 fitxers JavaScript;
- `npm run build`, que acaba en `vite: command not found`;
- comprovació en el ZIP original que els fitxers absents no són un error de
  l’extracció;
- proves unitàries de la nova suite de manteniment.

La falta de lockfile impedeix una auditoria de dependències reproduïble. La
falta de schema i polítiques RLS impedeix declarar segur el backend.

## Contenció immediata: abans de tornar a programar

### P0-A · Sessió WhatsApp

Ordre correcta:

1. Desvincular/revocar el dispositiu o sessió WhatsApp afectada.
2. Aturar el bot que puga continuar usant eixa sessió.
3. Localitzar `ext.tar.gz` en Git, ZIPs, Drive, backups, màquines i artefactes de
   CI.
4. Purgar totes les còpies compartides i l’historial publicat. Esborrar només el
   fitxer actual no és suficient.
5. Si Baileys continua, crear credencials noves fora del checkout amb directori
   `0700` i fitxers `0600`.
6. Considerar exposats els identificadors inclosos dins del paquet.

L’arxiu conté, com a mínim, `creds.json`, 810 pre-keys, 6 sessions, una clau
d’estat i 2.346 mapatges LID. Els 3.178 membres inspeccionats porten mode `0644`.

### P0-B · Dades de Gestoria

`src/sections/gestoria/logic/dashboard_data.js:1-1074` no és seed innocent:
conté imports, dates, comerços, referències de pagament i informació parcial de
targeta. S’ha de tractar com a dada privada fins que es demostre el contrari.

Ordre correcta:

1. Confirmar amb el propietari de les dades si són reals.
2. Inventariar repositoris, deploys, ZIPs i artefactes que les contenen.
3. Retirar `src/sections/gestoria/` complet del producte i de l’historial
   publicat.
4. Si cal conservar el llibre major, moure’l a un sistema privat xifrat amb
   control d’accés i retenció definida; mai al bundle del navegador.

### P0-C · Apagar garanties falses

Fins que estiguen implementades:

- retirar `/login`, `/registre`, Google Login i `/control`;
- desactivar publicació en `ConnectarSection`;
- no mostrar l’opció “Privada”;
- no oferir el xat com a funcional;
- no descriure P2P, CRDT, offline total, AAA o dispositius “en viu”.

Una funció absent és una limitació. Una garantia de privacitat absent presentada
com a real és un incident.

## Resultat mecànic

| Indicador | Resultat |
|---|---:|
| Fitxers | 323 |
| Markdown de la Wiki | 137 |
| Markdown en pilars actius | 72 |
| Mòduls JS/JSX/MJS inspeccionats | 90 |
| Wikilinks | 710 |
| Wikilinks no resolts pel comprovador | 33 |
| Documents actius orfes | 24 |
| Ancoratges duplicats | 61 |
| Assets distints absents | 73 |
| Imports relatius absents | 2 |
| Parelles del mirall antic | 14 |
| Parelles divergents | 1 |
| Troballes totals | 367 |
| Crítiques / altes / mitjanes / baixes | 5 / 95 / 232 / 35 |

Els 367 resultats no equivalen a 367 bugs: les aparicions repetides d’A10,
offline i assets inflen el recompte. L’informe mecànic complet està separat per
no soterrar les decisions arquitectòniques.

## 1. Caça de contradiccions del Brain

### 1.1 L’autoritat comença en un fitxer absent

`.agents/AGENTS.md:88-90`, `.agents/README.md:23-29` i
`_wiki_de_poble/03_GOVERNAR_Normativa_Regles/DOC_Governanca.md:18-23`
declaren `AGENTS.md` de l’arrel com a màxima autoritat. No existeix.

Decisió: crear un `AGENTS.md` curt a l’arrel i convertir-lo en la porta d’entrada
real. No ha de duplicar tota la Wiki; ha d’identificar les fonts canòniques, la
política de canvi i els comandaments que sí existeixen.

### 1.2 Petorreta és un govern fictici

`.agents/PROTOCOL_PETORRETA.md:15-29,42-44` exigeix
`open → manifest/lease → seal` abans de qualsevol escriptura. Falten
`tooling/`, `.sdp-reflex/`, `.immunitari/`, hooks i les ordres declarades en
`package.json:10-20`.

Al mateix temps, `.agents/README.md:17-18` diu “sense rituals” i “sense coses
experimentals extremes”. Les dues regles no poden ser certes.

Decisió: substituir `PROTOCOL_PETORRETA.md` per `PROTOCOL_CHANGE.md`:

- Git diff i proves per a canvis normals;
- pla + hash + paperera per a moviments massius;
- confirmació humana per a destrucció, secrets, diners, dades personals i
  compromisos externs;
- cap lease, segell o “estat termodinàmic” si no hi ha una eina real que ho
  aplique.

### 1.3 “Última acta” és alhora autoritat i no-autoritat

`.agents/AGENTS.md:115` ordena usar l’última acta com a pla actiu.
`00_SER_Brain_Identitat/01_IDENTITAT.md:26` avisa que una acta pot ser històrica
o contradictòria.

Decisió: les actes registren decisions; no són configuració. Una decisió vigent
ha de promocionar-se a una ADR o norma canònica amb identificador, estat i data.

### 1.4 El paradigma d’agost no està escrit en la llei activa

A10 i/o offline continuen sent obligatoris, entre altres, en:

- `.agents/AGENTS.md:112`;
- `.agents/03_regles_arquitectura_i_dades.md:36-61`;
- `.agents/identity/PROFILE.md:10-11`;
- `00_SER_Brain_Identitat/02_GENOTIP.md:21-23`;
- `01_SABER_Cultura_Coneixement/00_visio_i_pilars.md:44`;
- `01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_L_Anima.md:31-36`;
- `02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md`;
- `03_GOVERNAR_Normativa_Regles/ESTANDARD_Pedra_Seca.md:28,108,126,148,157,174`;
- `03_GOVERNAR_Normativa_Regles/ESTANDARD_UI_Universal.md:75`;
- plantilles ISO i textos públics del web.

No s’ha de fer una substitució global de paraules. Cal una ADR que derogue les
obligacions tècniques i preserve el valor que hi havia davall: rapidesa,
accessibilitat, resiliència raonable i dependències mínimes.

Text canònic proposat:

```yaml
decision_id: ADR-2026-08-ONLINE-FIRST
status: accepted
effective_from: 2026-08-02
browser_support: navegadors moderns amb manteniment actiu
remote_source_of_truth: true
offline_guarantee: false
crdt_required: false
legacy_a10_required: false
local_cache: optional_non_authoritative
accessibility_target: WCAG_2_2_AA
accessibility_verification: automated_and_manual_before_release
dependency_rule: add_only_with_measured_value_and_owner
```

### 1.5 El canvi pot xocar amb una promesa externa ja enviada

`05_Escriptori_Soc_de_Poble/260801_1900_ACTA_SESSIO_Enviament_NLnet.md:11,15-22`
registra que el dia 1 d’agost es va enviar una proposta amb CRDT i NixOS.

No s’ha de reescriure l’acta ni fingir que mai es va prometre. Abans de derogar
CRDT per al projecte s’ha de decidir una d’estes tres opcions:

1. el compromís NLnet continua en un subprojecte delimitat;
2. es comunica formalment el canvi d’abast;
3. la sol·licitud es retira.

L’ADR ha d’enllaçar esta acta i escriure la decisió explícita.

### 1.6 Privacitat escrita, privacitat violada

`LLEI_05_Privacitat.md` defensa minimització i control humà. El bot, en canvi:

- declara “opt-in implícit per ús” en `bot/memoria/episodica.mjs:1-3`;
- deriva un hash sense secret d’un JID predictible (`:16-19`);
- envia conversa i memòria anterior a un model (`:76-103`);
- pot guardar la resposta crua del model quan falla el JSON (`:109-121`);
- escriu sense atomicitat ni permisos `0600` (`:139`);
- no té `/oblida’m`, opt-out, exportació ni consentiment explícit.

Decisió: memòria episòdica desactivada per defecte. Només tornarà amb
consentiment explícit, finalitat visible, HMAC amb secret, escriptura atòmica,
retenció efectiva, exportació i oblit.

### 1.7 Tres sistemes de metadades

Els camps i enums d’`AUDITORIA_CANONICA.md`, `INDEX_TAXONOMIC.md` i
`normalize_yaml.py` no coincideixen. El mateix camp `estat` conté cicle de vida
documental (`canonic`, `esborrany`, `arxivat`) i estat d’una sessió (`obert`,
`tancat`, `auditat`).

Esquema únic proposat:

```yaml
estat: canonic | actiu | esborrany | arxivat | quarantena | generat
tipus: acta | briefing | document | hub | index | informe | norma | plantilla | prompt | protocol | registre | skill
description: text curt
aliases: []       # opcional
tags: []          # opcional
revisat: YYYY-MM-DD  # opcional
sessio: oberta | tancada | auditada  # només per a actes/briefings
```

`acta`, `briefing` i `auditat` no són valors intercanviables. L’esquema ha de
viure en `03_GOVERNAR_Normativa_Regles/metadata_schema.json` i el validador ha
de llegir eixe mateix fitxer.

### 1.8 El mirall fabrica autoritats noves

`00_AGENTS_I_SKILLS_MIRROR/` conté 14 còpies manuals marcades com canòniques.
Són incompletes, tenen enllaços relatius trencats i almenys una ja divergeix.

Decisió preferida: eliminar el mirall. Si Obsidian no pot navegar `.agents`,
mantindre’l temporalment com a vista generada, amb hash, advertència i prohibició
d’edició. La suite lliurada implementa eixa transició.

### 1.9 El Brain afirma que la maquinària existeix

`00_INDEX.md`, `00_BIOS.md`, `03_Consola_Termodinamica.md`,
`ESTANDARD_UI_Universal.md` i diverses skills declaren compilador, autoneteja,
hooks, schema, Reflex, tests i CI. No estan al paquet.

Decisió: tota afirmació d’“implementat” ha de portar una ruta executable i una
prova. Si no, l’estat correcte és `proposat` en un roadmap, no `canonic`.

## 2. Brain reconstruït

### Fonts d’autoritat, una per responsabilitat

| Responsabilitat | Font única |
|---|---|
| Entrada per a agents | `AGENTS.md` |
| Conducta i estil de la IAIA | `.agents/identity/PROFILE.md` |
| Flux de treball | `.agents/skills/socdepoble-workflow/SKILL.md` |
| Missió del projecte | `00_SER_Brain_Identitat/el_projecte.md` |
| Identitat narrativa | `00_SER_Brain_Identitat/01_IDENTITAT.md` |
| Marca | `00_SER_Brain_Identitat/identitat_visual.md` |
| Arquitectura vigent | `02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md` |
| Govern | `03_GOVERNAR_Normativa_Regles/DOC_Governanca.md` |
| Enginyeria | `03_GOVERNAR_Normativa_Regles/ESTANDARD_Pedra_Seca.md` |
| Privacitat | `03_GOVERNAR_Normativa_Regles/LLEI_05_Privacitat.md` |
| Metadades | `03_GOVERNAR_Normativa_Regles/metadata_schema.json` |
| Decisions | `03_GOVERNAR_Normativa_Regles/adr/ADR-*.md` |
| Història | `04_ARXIU_Documents_Historics/YYYY_MM/` |
| Treball obert | `05_Escriptori_Soc_de_Poble/00_INDEX_ESCRIPTORI.md` |

### Estructura objectiu

```text
AGENTS.md
.agents/
  AGENTS.md
  identity/PROFILE.md
  PROTOCOL_CHANGE.md
  manifest.yaml
  skills/
    socdepoble-workflow/
    socdepoble-civic/
    socdepoble-llm-wiki/
    brain-maintenance/
_wiki_de_poble/
  00_SER_Brain_Identitat/
    00_INDEX.md
    el_projecte.md
    01_IDENTITAT.md
    identitat_visual.md
    Soci_Sollutia.md
  01_SABER_Cultura_Coneixement/
    00_GLOSSARI_CANONIC.md
    01_trellat.md
    connexio_radical.md
    cultura/
  02_ACTUAR_Maquina_Tecnica/
    00_arquitectura_tecnica_unificada.md
    architecture/
    observability/
    runbooks/
    references/vendor/
  03_GOVERNAR_Normativa_Regles/
    DOC_Governanca.md
    ESTANDARD_Pedra_Seca.md
    LLEI_05_Privacitat.md
    metadata_schema.json
    adr/
  04_ARXIU_Documents_Historics/YYYY_MM/
  05_Escriptori_Soc_de_Poble/
    00_INDEX_ESCRIPTORI.md
    00_Bandeja_d_Entrada/
tooling/brain/
```

### Fusions i eliminacions que no s’han de negociar

La relació completa, amb 134 accions i precondicions, està en
`PLA_D_ACCIONS_AGOST_2026.csv`. Les més importants són:

- fusionar `socdepoble-operate` dins de `socdepoble-workflow` i eliminar el
  duplicat;
- fusionar `campanyes-activisme` i `natura-patrimoni` dins de
  `socdepoble-civic`;
- destil·lar `socdepoble-iaia-actriu`, `anatomia_cognitiva.md`,
  `perfil_psiquiatric.md` i `antigravity.md` dins de `PROFILE.md`, després
  arxivar-los;
- fusionar `00_visio_i_pilars.md` dins d’`el_projecte.md`;
- separar la narrativa de `02_GENOTIP.md` de les lleis tècniques i arxivar
  l’original;
- eliminar els MOCs buits `Coneixement.md`, `Govern.md`, `Graf.md`,
  `Identitat.md` i `Maquina.md`;
- fusionar els dos arxius històrics i eliminar `90_arxiu_historic/`;
- eliminar el mirall manual d’agents o generar-lo automàticament;
- moure Dataview, observabilitat, arquitectura, runbooks i documents de vendor
  fora d’Identitat/Cultura;
- convertir `00_INDEX_ESCRIPTORI.md` en una cua real: estat, responsable,
  pròxima acció i data de revisió.

El directori `doctrina-agost/` inclou esborranys llestos per a l’autoritat
arrel, el perfil, el protocol de canvi, l’ADR i l’esquema de metadades. No s’han
instal·lat automàticament perquè la decisió NLnet requereix ratificació humana.

### Què no s’ha de fusionar

- Les actes no es fusionen amb normes: es preserven i s’enllacen des d’una ADR.
- Les dades financeres no s’arxiven al Brain.
- Les credencials no van a `04_ARXIU`: es revoquen i es purguen.
- Els prompts històrics no entren en el corpus RAG públic per defecte.
- La personalitat no ha d’incloure configuració de proveïdors, models o
  dispositius.

## 3. Refactor web: què es llença

### Offline/PWA

No hi ha cap CRDT al codi. Hi ha Dexie, snapshots, fallback, service worker i
`BroadcastChannel`. Per tant, la “càrrega CRDT” és sobretot doctrina; la càrrega
real és una pila local-first incompleta.

Després d’exportar qualsevol dada que només existisca en IndexedDB:

1. eliminar `src/main.jsx:7-10`;
2. eliminar `src/data/db.js`;
3. eliminar de `AppDataContext.jsx` snapshots, `BroadcastChannel`, listener
   `storage` i refresc entre pestanyes;
4. reescriure `src/data/supabaseBackend.js` en lloc de retallar-lo;
5. eliminar `dexie`, `workbox-window` i `vite-plugin-pwa`;
6. desplegar una versió transitòria que desregistre qualsevol service worker ja
   instal·lat;
7. eliminar `src/sections/dispositius/` i les seues rutes si no hi ha una funció
   P2P real.

`BroadcastChannel` només comunica contexts del mateix origen en el mateix
perfil. `DevicesSection` injecta dos dispositius i respostes simulades. No és
descoberta de dispositius.

Substitució exacta de `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { AppDataProvider } from './app/AppDataContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppDataProvider>
        <App />
      </AppDataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### Codi mort o alié

El graf des de `main.jsx` deixa 22 fitxers, 417 KB i 6.541 línies inassolibles.
Eliminació directa:

- `src/sections/gestoria/` complet;
- `src/components/design-system/DesignSystemPage.jsx`;
- `src/config/designSystemMarkdown.js`;
- `src/config/storage.js`;
- `src/sections/disseny/markdown.js`;
- `src/config/taxonomy-registry.json`, si no es promou abans a schema del Brain;
- tots els `.DS_Store`.

Si `/disseny` no és una funció pública, també:

- `src/components/design-system/`;
- `src/sections/disseny/`;
- `src/pages/features/sosp-components.css`;
- `global.css:450-1434` després de verificar selectors;
- Tailwind i `@tailwindcss/vite`.

Després de reescriure el xat:

- `src/components/universal/UniversalComponents.jsx`;
- `src/components/universal/Universal.css`.

`src/sections/notes/notesContent.js` **no** és eliminació directa: té un import
estàtic actiu des de `src/data/sectionContent.js`. Cal reconciliar els dos
models de notes abans de decidir si sobra.

### Xat i rutes

`XatSection.jsx` usa dades hard-coded i el formulari només fa
`preventDefault`. El motor `sendChatMessage/getThreadMessages` del context no té
consumidor. S’ha de reescriure, no maquillar.

`App.jsx:189-193` ha de quedar:

```jsx
function LegacyChatDetailRedirect() {
  const parts = window.location.pathname.split('/');
  const threadId = parts.at(-1);
  return <Navigate to={`/chat/${encodeURIComponent(threadId)}`} replace />;
}
```

La ruta canònica és `/chat/:threadId`. `/chats/:threadId` i `/xat/:threadId`
només redirigeixen cap a ella.

### XSS: no sanititzar HTML amb dos regex

`detailRichText.jsx:1-13` només elimina `<script>` i `<style>`. Deixa passar
atributs d’esdeveniment, URLs `javascript:`, SVG, iframe i altres vectors. La
cadena és completa: `ConnectarSection` accepta descripció → backend la conserva
→ detall la injecta amb `dangerouslySetInnerHTML`.

La solució mínima és no acceptar HTML:

```jsx
export function RichText({ value }) {
  const paragraphs = String(value ?? '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <article className="detail-content detail-content--plain">
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
      ))}
    </article>
  );
}
```

Eliminar `renderPageHtml`, `stripDangerousHtml` i els usos de
`dangerouslySetInnerHTML` per a dades d’usuari. Si HTML ric és un requisit real,
l’única dependència nova justificada és DOMPurify al client **més** sanejament
allowlist al servidor; el client no és la frontera de seguretat.

### La privacitat de Connectar no existeix

`ConnectarSection.jsx:13,157-165` canvia `isPrivate`; el payload de `:43-110` i
la mutació de `:121-131` no l’inclouen. A més, qualsevol persona pot triar un
agent i publicar amb el seu nom.

No basta afegir `visibility` al JSON. El contracte complet és:

```json
{
  "author_user_id": "derivat de la sessió al servidor",
  "visibility": "private | public",
  "payload": "validat segons la secció"
}
```

El servidor ignora qualsevol `author_user_id` enviat pel navegador, el deriva
del JWT i aplica RLS. Fins que això existeix, la publicació ha d’estar apagada.

### Backend remot honest

`supabaseBackend.js:853-905` comenta les consultes de `section_submissions` però
desestructura la variable. `:1107-1151` guarda local primer, desactiva remot
després d’errors i retorna èxit fins i tot quan la xarxa o RLS fallen.

Arquitectura nova:

- `remote` és l’únic mode de producció;
- `seed` només existeix en desenvolupament/test i es tria explícitament;
- cap `auto → hybrid` silenciós;
- una mutació remota fallida és un error visible i reintentable;
- `AbortSignal.timeout(10_000)` limita cada petició;
- auth real aporta el token; l’ID d’autor no ve del payload;
- migració legacy és un script puntual, no codi enviat a cada navegador.

Esquelet de frontera:

```js
export async function requestJson(path, { method = 'GET', body, token, signal } = {}) {
  const timeoutSignal = AbortSignal.timeout(10_000);
  const response = await fetch(`${API_URL}${path}`, {
    method,
    signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}
```

Si Supabase és la decisió adoptada, `@supabase/supabase-js` és una dependència
justificada perquè substitueix auth/session/REST manual. Si no, usar un BFF
propi amb `fetch`. No mantindre les dues vies.

### Paquets mínims

Separar web i bot. El web no ha d’instal·lar `baileys`, `@google/genai`,
`dotenv` ni `qrcode-terminal`.

Web objectiu:

- `react`;
- `react-dom`;
- `react-router-dom`;
- `lucide-react`, només si es manté el sistema d’icones;
- `@supabase/supabase-js`, només si Supabase + Auth són la decisió final.

Eliminar `lucide`, `dexie`, `workbox-window`, `vite-plugin-pwa` i, si desapareix
el mostrari, Tailwind. Mantindre Vitest/Testing Library/ESLint només després de
crear configuració i proves reals.

## 4. Bot: refactor modern sense confondre robustesa amb offline

Eliminar CRDT/offline no autoritza eliminar deduplicació, quotes, idempotència,
timeouts o shutdown segur. Això és transport, no offline.

### El bot no arranca

- `bot/cervell.mjs:9` importa `../tooling/wiki/core/edge_rag.mjs`, absent.
- `bot/cervell.mjs:12-14,57` mescla rutes des de l’arrel i des de `bot/`.
- `npm start` parteix de l’arrel, així que Wiki i índex apunten al directori pare.

Substitució de la resolució de rutes:

```js
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

const BOT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(BOT_DIR, '..');
const PROFILE_PATH = join(PROJECT_ROOT, '.agents', 'identity', 'PROFILE.md');
const WIKI_PATH = join(PROJECT_ROOT, '_wiki_de_poble');
const INDEX_PATH = join(PROJECT_ROOT, 'var', 'rag_index.json');
```

Cada `d.path` de l’índex s’ha de resoldre i validar, inclosos symlinks:

```js
const WIKI_ROOT_REAL = await fs.realpath(WIKI_PATH);

async function resolveWikiDocument(relativePath) {
  const candidate = resolve(WIKI_PATH, relativePath);
  const candidateReal = await fs.realpath(candidate);
  const fromRoot = relative(WIKI_ROOT_REAL, candidateReal);
  if (fromRoot === '..' || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot)) {
    throw new Error('Ruta RAG fora de la Wiki');
  }
  return candidateReal;
}
```

El corpus RAG ha de ser una allowlist de documents públics/canònics. Prompts,
quarantena, escriptori, privacitat interna i arxius no entren per defecte. El
contingut recuperat és dades citades, no una nova instrucció de sistema.

### Grups oberts malgrat dir fail-closed

`bot/index.mjs:64-67` ha de començar així:

```js
const allowedGroupJids = String(process.env.IAIA_ALLOWED_GROUP_JIDS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

if (allowedGroupJids.length === 0) {
  throw new Error('IAIA_ALLOWED_GROUP_JIDS és obligatori');
}

config: {
  allowedGroupJids,
  allowAllGroups: false
}
```

La quota s’aplica abans de transcripció, RAG i LLM, no després de pagar el cost.

### Sessions i memòria

`sessions` guarda JID cru i histories infinites. Contracte mínim:

- màxim 1.000 sessions;
- TTL d’inactivitat explícit;
- màxim 8 torns, truncats en cada escriptura;
- clau HMAC, no JID cru;
- neteja periòdica;
- cap persistència a llarg termini sense consentiment.

La memòria episòdica actual s’ha de desactivar abans de redissenyar-la. Un LLM
no és un sanititzador de PII i “opt-in implícit” no és consentiment.

### Shutdown i logs

`process.exit()` en handlers globals i `onFatal` salta el teardown. Els cinc
`owner.lock.stale-*` són evidència coherent. Els handlers han de:

1. impedir entrades noves;
2. esperar treball en curs amb límit;
3. tancar socket/store;
4. retirar lock;
5. posar `process.exitCode = 1`.

El logger de `index.mjs:42-48` imprimeix objectes Baileys crus. Substituir-lo per
events estructurats amb allowlist de camps i hashes; cap JID, QR, missatge o
material protocol·lari als logs.

### Decisió de transport

| Si el producte necessita… | Decisió |
|---|---|
| 1:1 Business i webhook oficial | Migrar a WhatsApp Cloud API; retirar Baileys, QR, `.iaia_auth`, locks i gran part de les 2.304 línies de transport/guardrails. |
| Grups o compte personal imprescindibles | Mantindre Baileys, però amb allowlist, credencials fora del repo, quota prèvia, store mínim, shutdown, proves amb socket fals i logs redaccionats. |

No he assumit que les capacitats actuals de grup de l’API oficial encaixen:
s’han de verificar en el moment de prendre la decisió. El canvi de paradigma no
resol eixa elecció de producte.

## 5. Scripts existents: què es retira

### `normalize_yaml.py`

No s’ha d’executar. En el seu abast actual:

- reescriuria 114 documents;
- reclassificaria 33 estats;
- descartaria claus en 99 documents;
- eliminaria `temes` en 84 i `aliases` en 5;
- no té dry-run, backup, hash ni escriptura atòmica;
- un YAML invàlid es converteix en `{}`;
- depén de PyYAML sense runtime ni lock declarats.

Retirar-lo complet i substituir-lo per validació + pla revisable.

### `audit.py`

Engoleix errors YAML, ignora documents sense frontmatter, no usa schema i sempre
retorna exit `0`. En una execució real interpreta identificadors de JavaScript
com `#socket`, `#process` i altres tags falsos. Retirar-lo.

### `sync_iaia.sh`

S’executa des de la quarantena però busca `bot/`, `_wiki_de_poble/` i
`tooling/` com si estiguera a l’arrel. No és fail-fast, pot empaquetar secrets,
descomprimeix sobre producció, instal·la en el directori equivocat i no té
checksum, staging, healthcheck ni rollback. Eliminar-lo.

### `pdf_clean_generator.sh`

`${BASE_NAME%%_*}*.pdf` pot eliminar PDFs no relacionats; amb `_foo.pdf` pot
coincidir amb tots. Esborra la versió bona abans de validar la nova i pot acabar
anunciant èxit després d’un error de Chrome.

Reescriure’l amb:

- entrada i destí exactes;
- temporal en el mateix directori;
- comprovació d’exit code;
- mida mínima i capçalera `%PDF-`;
- `rename` atòmic;
- cap `find … rm`.

## 6. Suite de manteniment lliurada

`brain-maintenance/` és autònoma, Python stdlib, sense PyYAML ni npm. No modifica
res per defecte.

### `brain_audit.py`

Comprova:

- fitxers estructurals, scripts npm, imports i assets;
- secrets en text amb valors omesos;
- noms sensibles dins de TAR/ZIP sense obrir credencials;
- HTML injection sinks;
- metadades, estats, wikilinks, orfes i ancoratges;
- duplicats exactes, brutícia local, locks i mirall;
- marcadors del paradigma derogat.

Exit codes: `0` net, `1` llindar superat, `2` error d’eina/configuració.

### `brain_distill.py`

Genera un pla JSON amb SHA-256 de cada font. L’aplicació:

- és dry-run sense `--apply`;
- valida hashes i contenció de rutes;
- rebutja symlinks i sobreescriptures;
- mou brutícia a `.brain-trash/<timestamp>/removed/`;
- guarda en `backups/` els bytes originals abans de normalitzar Markdown;
- fusiona `90_arxiu_historic` per `rename`, no `rm`;
- normalitza només ancoratges duplicats;
- marca arxius de credencials com `manual` i no els toca;
- actualitza el rebut atòmicament després de cada pas i marca
  `partial_failure` si el lot queda a mitges.

El lot és recuperable, no transaccional: una fallada no fa rollback automàtic;
el rebut i els backups permeten restauració manual o un pla nou.

El pla generat sobre el ZIP proposa 16 moviments d’arxiu, 59 normalitzacions
directes, 2 normalitzacions integrades en moviments, 18 trasllats a paperera i
1 bloqueig manual de seguretat. No s’ha aplicat.

### `sync_agent_mirror.py`

Comprova el mirall sense escriure. Amb `--write`, genera frontmatter, ruta font
i hash. Amb `--prune`, els sobrants van a paperera. És una ajuda de transició;
la decisió final continua sent eliminar el mirall.

### `maintain.sh`

Genera auditoria JSON/Markdown, pla de destil·lació i comprovació del mirall.
No muta fonts: escriu només `.brain-reports/`. Retorna error si hi ha una
troballa alta/crítica o drift.

Comandes després de copiar la carpeta a `tooling/brain/`:

```sh
sh tooling/brain/maintain.sh .

python3 tooling/brain/brain_audit.py . \
  --json .brain-reports/audit.json \
  --markdown .brain-reports/audit.md

python3 tooling/brain/brain_distill.py plan . \
  --output .brain-reports/distill-plan.json

python3 tooling/brain/brain_distill.py apply . \
  .brain-reports/distill-plan.json

# Només després de revisar el pla:
python3 tooling/brain/brain_distill.py apply . \
  .brain-reports/distill-plan.json --apply
```

La suite inclou nou proves unitàries. Totes passen. No s’ha executat cap
`--apply` sobre el material auditat.

## 7. Arquitectura tècnica objectiu

No cal un “core universal”. Calen fronteres clares.

```text
apps/web
  React + Router
  Auth real
  API remota autoritativa
  preferències locals menudes (tema/idioma)

bot
  transport elegit explícitament
  quota i idempotència abans del LLM
  servei cognitiu sense accés lliure a tot el vault
  memòria opt-in o cap memòria

backend
  identitat i autorització
  schema + migracions + RLS versionades
  contingut públic separat de dades privades

tooling/brain
  audit → pla fixat per hashes → revisió → aplicació recuperable

_wiki_de_poble
  identitat → coneixement → arquitectura → govern → arxiu → inbox
```

Flux de dades:

```text
Navegador ──auth──> API/Supabase ──RLS──> dades canòniques
    │
    └── localStorage: només tema/idioma

WhatsApp ──transport──> quota/ACL ──> cervell ──> corpus públic canònic
                                      │
                                      └── memòria només amb consentiment
```

Regles:

- el navegador mai és la font canònica de dades compartides;
- cap fallback demo silenciós en producció;
- cap cache local promet persistència;
- cap document històric entra al system prompt per defecte;
- cada dependència té cas d’ús, propietari i prova;
- cada promesa pública té una comprovació executable;
- cap dada privada entra al bundle.

## 8. Ordre d’execució

### Fase 0 · Incident, hui

- Revocar WhatsApp i purgar `ext.tar.gz`.
- Retirar Gestoria i inventariar còpies.
- Apagar publicació privada, login/control i xat fictici.

### Fase 1 · Fer el paquet honest

- Recuperar `index.html`, Vite config, lockfile, assets i schema Supabase.
- Crear `.gitignore` i `.env.example`.
- Separar `package.json` web/bot.
- Reemplaçar scripts fantasma per la suite real.

Gate: instal·lació neta + build + lint + tests en CI.

### Fase 2 · Dades i identitat

- Exportar dades locals útils.
- Auth, JWT, RLS, visibilitat i autoria de servidor.
- Backend remot únic, errors visibles i timeout.
- Eliminar `foraster` de qualsevol dada privada.

Gate: dos usuaris de prova no poden llegir ni atribuir-se dades entre ells.

### Fase 3 · Tall offline

- Desregistrar service worker.
- Retirar Dexie, snapshots, hybrid i dispositius simulats.
- Conservar només tema/idioma locals.

Gate: una fallada de xarxa mostra error; mai dades demo presentades com reals.

### Fase 4 · Bot

- Decidir Cloud API o Baileys.
- Allowlist i quota abans del LLM.
- Corregir rutes, corpus RAG, sessions, shutdown i logs.
- Memòria desactivada fins al consentiment.

Gate: proves deterministes sense WhatsApp ni crides pagades.

### Fase 5 · Destil·lació del Brain

- Aprovar ADR d’agost i decisió NLnet.
- Crear autoritat arrel i nou protocol de canvi.
- Aplicar fusions del manifest per lots menuts.
- Validar enllaços/metadades després de cada lot.
- Eliminar mirall manual i segon arxiu.

Gate: cap norma contradictòria activa, cap script referenciat absent i cap
document canònic sense propietari/revisió.

## 9. Contracte cognitiu assimilat

Sí: la personalitat operativa ha sigut assimilada per a esta arquitectura, però
no com una caricatura ni com una promesa falsa de memòria eterna.

La traducció executable és:

```text
Trellat abans que ritual.
Evidència abans que relat.
Una font abans que un mirall.
Una frontera clara abans que un “core universal”.
Dependència només si elimina més complexitat de la que afegeix.
L’humà decideix significat, risc i compromís; la màquina fa inventari, prova i rutina.
Cap interfície promet allò que el servidor no garanteix.
Parar davant secrets, diners, dades personals i destrucció.
```

La “Pedra Seca” no és suportar A10, CRDT o offline per dogma. És que cada pedra
tinga càrrega, encaix i possibilitat de ser retirada. Amb eixe criteri, bona part
del paquet actual no és Pedra Seca: és decorat. El pla proposat conserva la
identitat i elimina el decorat.

## Dictamen final

No desplegar este ZIP. No executar `normalize_yaml.py`. No fer `npm install`
sobre la quarantena. No intentar salvar la privacitat afegint una propietat al
frontend.

Primer revocació i contenció. Després una base mínima compilable. Després auth i
dades remotes honestes. Finalment, migració funcional i destil·lació del Brain.
Qualsevol ordre diferent converteix un problema d’arquitectura en un problema de
confiança.
