---
doc_id: SDP-AUD-OUTBOX-001
doc_type: "[AUDITORIA_FORENSE]"
authoring_agent: "Claude — Seient Núm. 5, Senior Auditor"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
subdomain: architecture
locale: ca-valencia
hora_creacio: "15:20"
inputs: ["260827_0820_BUNDLE_IndexedDB.md"]
veredicte: "BLOQUEJAT"
nota_global: "3,5 / 10"
---

# AUDITORIA: OUTBOX I TRANSICIÓ A INDEXEDDB

## 0. Fet previ que condiciona tota la resta

El bundle **no conté cap pla d'Outbox ni cap línia d'IndexedDB**. Verificació mecànica sobre els 180 fitxers extrets:

| Patró cercat | Ocurrències a `src/` i `tooling/` |
|---|---|
| `outbox` | 0 |
| `openDB` / `from 'idb'` | 0 |
| `objectStore` / `.transaction(` | 0 |
| `indexedDB` (API) | 0 |
| `navigator.onLine` | 0 |
| `backoff` / `retry` / `reintent` | 0 |

L'única ocurrència de la paraula «IndexedDB» en tot el bundle és a `src/sections/text/pageContent.js`, dins de la fitxa pública **«IDB Guardian (Persistència W.A.L.)»**, que afirma literalment que el sistema «emmagatzema de manera xifrada» damunt de «SQLite i IndexedDB» i que «cap byte desapareix».

**Cap d'eixes tres afirmacions és certa.** La persistència real són 22 línies de `localStorage` síncron sense xifrat, sense WAL i sense cua. És la mateixa exposició legal que ja es va marcar amb la política de privacitat: publicitat de capacitat inexistent en una peça que es presenta com a infraestructura d'emergència civil.

**Acció immediata, abans que cap codi:** retirar o reescriure eixa fitxa a temps present-condicional.

## 1. Nota

**3,5 / 10** — i la nota **no és del pla** (no existix), és de **la preparació del codi per a rebre'l**.

| Dimensió | Nota | Motiu |
|---|---|---|
| Idempotència del servidor | 8/10 | L'upsert ja està ben fet |
| Identitat de missatge | 1/10 | `Date.now()` col·lidix |
| Resiliència offline del xat | 0/10 | Zero cua, zero reintents |
| Encapsulament de la persistència | 3/10 | 5 fugues de `localStorage` |
| Preparació sync→async | 1/10 | 27 de 35 crides es trencarien |
| Honestedat de la documentació | 0/10 | «IDB Guardian» és fals |

## 2. Resposta directa a la pregunta d'idempotència

> *«Hi ha perill de duplicació si l'usuari perd connexió just després del POST però abans de rebre el 200 OK?»*

**Per eixe camí concret, no.** `supabaseBackend.js:569` fa:

```
POST /rest/v1/chat_messages?on_conflict=id
Prefer: resolution=merge-duplicates
```

L'`id` el genera el client i la clau primària és estable, així que reenviar la mateixa fila és un no-op. Això està **ben dissenyat** i s'ha de conservar tal qual.

El perill real està en dos llocs on no el busques.

### 2.1 Col·lisió d'identificadors (pèrdua, no duplicació)

`AppDataContext.jsx:438-444` construïx l'id així:

```js
const nowTs = Date.now();
const messageId = `${nowTs}`;
id: `${rawData.ownerUserId}::${thread.id}::${messageId}-me`
```

Reproducció executada sobre còpia literal de `mergeChatMessages`:

```
CAS A — dos missatges diferents al mateix mil·lisegon
  id 1: u1::t1::1787837239471-me
  id 2: u1::t1::1787837239471-me
  mateix id? true
  missatges supervivents: 1 -> ["Porta el tractor"]
```

«Vine a les 8» desapareix. No hi ha error, no hi ha avís. `map.set()` el sobreescriu en local i l'upsert el sobreescriu al servidor. En un iPad A10 amb pantalla vella, un doble toc fantasma en el botó d'enviar produïx exactament això.

El projecte **ja té** `generateUUID()` a `supabaseBackend.js:13`. S'usa per a `section_submissions` i no per al xat.

### 2.2 Duplicació per reescriptura manual

`sendChatMessage` fa la xarxa **abans** de la pintada:

```js
await appendChatMessages([userMessage, replyMessage], stableExternalConfig);
setRawData((current) => ({ ... }));   // ← mai s'executa si l'anterior llança
```

I `appendChatMessages:588` relança tot el que no siga RLS — inclosos els talls de xarxa i el timeout de 12 s de l'`AbortController`. La captura de `XatSection.jsx:207-211` fa `setText(value)`: torna el text a la caixa.

Seqüència completa a la muntanya:

1. L'uelo escriu «Vine a les 8» i prem enviar.
2. En mode `hybrid` el missatge **sí** s'escriu a disc.
3. El `fetch` avorta als 12 s. L'excepció puja. `setRawData` no s'executa.
4. La pantalla no mostra res. El text reapareix a la caixa.
5. L'uelo el torna a enviar. Nou `Date.now()` → **nou id**.
6. Torna la cobertura. Pugen els dos.

```
CAS B — reenviament manual del mateix text 5 ms després
  files que pujaran a Supabase: 2 -> ["Vine a les 8","Vine a les 8"]
```

**El vector de duplicació no és la xarxa. És la interfície que amaga un missatge ja escrit a disc.**

## 3. El coll d'ampolla que has intuït: `setVal`/`getVal` a promesa

És el punt més greu del document. Mapa complet: **35 crides, 6 fitxers**. 8 amb `await`, **27 síncrones**. Amb `getVal` retornant una promesa:

```
buildHeaders() ABANS  : Bearer JWT_REAL_DE_LUSUARI
buildHeaders() DESPRÉS: Bearer [object Promise]

nivell IAIA ABANS  : 1
nivell IAIA DESPRÉS: NaN

DEFAULT_USER_ID DESPRÉS: [object Promise]
clau de fila Supabase  : [object Promise]::mur::123
```

Tres blocatges durs:

**B1 — `supabaseBackend.js:55-63`.** `buildHeaders` és una fletxa síncrona cridada dins de l'argument del `fetch`. Una promesa és sempre *truthy*, així que `jwt ? jwt : anonKey` **mai** cau al `anonKey`. Resultat: 401 en cada petició, també les anònimes. Mort total de l'aplicació, no degradació.

**B2 — `appSeed.js:33`.** `export const DEFAULT_USER_ID = getGuestSessionId();` s'avalua en temps d'importació. Passaria a ser un `Promise` exportat, i eixe valor va incrustat dins de les claus de fila i dins de `owner_user_id`. Corrompria el magatzem remot, no només la sessió.

**B3 — inicialitzadors mandrosos de `useState`.** `AppDataContext.jsx:114-125` (idioma), `:125` (tema) i `RealitatSection.jsx:11,15`. React no accepta un inicialitzador asíncron. Passar tema i idioma a IndexedDB garantix parpelleig blanc→fosc en cada arrencada, que en un A10 són centenars de mil·lisegons de pantalla equivocada.

**B4 — asimetria de tancament de sessió.** `logout()` (`:771-775`) usa `localStorage.removeItem` directe mentre `login` usa `setVal`. `storage.js` **no té funció d'esborrat**. Si les escriptures se'n van a IndexedDB i el `logout` continua netejant `localStorage`, **el JWT sobreviu al tancament de sessió**. És un forat de seguretat que naix el dia de la migració.

## 4. Conclusió arquitectònica: no migres `getVal`/`setVal`

La premissa del bundle és que `localStorage` és el problema. Sobre les dades reals, no ho és:

| Clau | Mida | Necessita IndexedDB? |
|---|---|---|
| `socdepoble-jwt` | ~1 kB | No — cal síncrona |
| `socdepoble-refresh-token` | ~1 kB | No — cal síncrona |
| `socdepoble-user` | <1 kB | No — cal síncrona |
| `socdepoble-guest-session-id` | 45 B | No — cal en temps d'import |
| `sdp-theme` | 5 B | No — primera pintada |
| idioma | 2 B | No — primera pintada |
| **snapshot complet** | **fins a MB** | **Sí** |
| **cua de missatges** | **creixent** | **Sí** |

Sis claus xicotetes que **exigixen** accés síncron, i dos objectes grossos que **exigixen** asincronia. Convertir-ho tot a promesa per arreglar els dos grossos és trencar els sis xicotets. Pedra Seca: **cada pedra al seu lloc**.

> **Regla proposada:** `localStorage` per a identitat i preferències (síncron, ≤10 kB). IndexedDB **només** per a l'Outbox i l'snapshot. `getVal`/`setVal` es queden síncrones per sempre, i això passa a ser un contracte amb porta mecànica.

## 5. Pedaços

### PEDAÇ 1 — `src/config/storage.js` (tanca B4)

```js
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

/**
 * CONTRACTE: estes tres funcions són SÍNCRONES per sempre.
 * Només identitat i preferències. Res que puga créixer.
 * Imposat per tooling/gates/tractor-persistencia.mjs (L1, L2).
 */
export const getVal = (key, fallback = null) => {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

export const setVal = (key, value) => {
  if (!isBrowser) return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

// NOU: sense això, el logout ha de saltar-se la capa.
export const delVal = (key) => {
  if (!isBrowser) return;
  try { window.localStorage.removeItem(key); } catch {}
};
```

I a `supabaseBackend.js:771-775`:

```js
export function logout() {
  delVal('socdepoble-jwt');
  delVal('socdepoble-refresh-token');
  delVal('socdepoble-user');
}
```

`theme.js:24,41` passa a usar `getVal`/`setVal` amb la clau `sdp-theme`. Nota: `theme.js:2` declara `LEGACY_KEYS` i no s'usa enlloc — codi mort, fora.

### PEDAÇ 2 — `src/data/outbox.js` (nou, IndexedDB natiu, zero dependències)

```js
/**
 * outbox.js — Cua durable d'eixida damunt d'IndexedDB natiu.
 * Sense 'idb'. Sense promeses damunt de localStorage.
 */
const DB = 'sdp-outbox';
const MAGATZEM = 'pendents';
const ARRENDAMENT_MS = 60_000;   // reclamació de registres encallats
const RETARDS = [1000, 4000, 15000, 60000, 300000];

let dbPromesa = null;

function obri() {
  if (dbPromesa) return dbPromesa;
  dbPromesa = new Promise((resol, rebutja) => {
    const p = indexedDB.open(DB, 1);
    p.onupgradeneeded = () => {
      const magatzem = p.result.createObjectStore(MAGATZEM, { keyPath: 'id' });
      magatzem.createIndex('estat', 'estat');
    };
    p.onsuccess = () => resol(p.result);
    p.onerror = () => rebutja(p.error);
  });
  return dbPromesa;
}

const tx = async (mode, fn) => {
  const db = await obri();
  return new Promise((resol, rebutja) => {
    const t = db.transaction(MAGATZEM, mode);
    const r = fn(t.objectStore(MAGATZEM));
    t.oncomplete = () => resol(r?.result ?? r);
    t.onerror = () => rebutja(t.error);
    t.onabort = () => rebutja(t.error);
  });
};

export const uuid = () =>
  (crypto.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`);

/** Encua. L'id ve del cridador i NO es regenera mai en cap reintent. */
export const encua = (registre) =>
  tx('readwrite', (m) => m.put({
    ...registre,
    estat: 'pendent',
    intents: 0,
    seguentIntentTs: 0,
    arrendamentTs: 0,
    creatTs: Date.now()
  }));

export const confirma = (id) => tx('readwrite', (m) => m.delete(id));

export const pendents = () => tx('readonly', (m) => m.getAll());

/**
 * Reclama un lot dins d'UNA transacció readwrite.
 * IndexedDB serialitza les transaccions readwrite damunt del mateix magatzem,
 * així que dues pestanyes no poden reclamar el mateix registre.
 */
export async function reclama(limit = 20) {
  const ara = Date.now();
  const db = await obri();
  return new Promise((resol, rebutja) => {
    const t = db.transaction(MAGATZEM, 'readwrite');
    const m = t.objectStore(MAGATZEM);
    const lot = [];
    m.openCursor().onsuccess = (e) => {
      const c = e.target.result;
      if (!c || lot.length >= limit) return;
      const r = c.value;
      const arrendamentCaducat = r.estat === 'enviant' && ara - r.arrendamentTs > ARRENDAMENT_MS;
      const toca = r.estat === 'pendent' && ara >= r.seguentIntentTs;
      if (toca || arrendamentCaducat) {
        const reclamat = { ...r, estat: 'enviant', arrendamentTs: ara };
        c.update(reclamat);
        lot.push(reclamat);
      }
      c.continue();
    };
    t.oncomplete = () => resol(lot);
    t.onerror = () => rebutja(t.error);
  });
}

export const ajorna = (registre) => {
  const intents = registre.intents + 1;
  const base = RETARDS[Math.min(intents - 1, RETARDS.length - 1)];
  const jitter = Math.floor(Math.random() * base * 0.3);
  return tx('readwrite', (m) => m.put({
    ...registre,
    estat: 'pendent',
    intents,
    arrendamentTs: 0,
    seguentIntentTs: Date.now() + base + jitter
  }));
};
```

**Sobre el tall entre el POST i el 200 OK:** el registre queda en `enviant` amb `arrendamentTs`. En arrencar, `reclama()` recupera qualsevol arrendament de més de 60 s i el reenvia. És segur perquè l'upsert per `id` ja és idempotent i **l'id no es regenera**. Això és el que fa que la cadena siga correcta d'extrem a extrem; sense la fixesa de l'id, tot el mecanisme d'ací dalt seria un generador de duplicats.

### PEDAÇ 3 — `sincronitzador.js`

```js
import { reclama, confirma, ajorna, pendents } from './outbox.js';
import { appendChatMessages } from './supabaseBackend.js';

let corrent = false;

export async function buida(config) {
  if (corrent || !navigator.onLine) return;
  corrent = true;
  try {
    let lot;
    while ((lot = await reclama()).length > 0) {
      for (const r of lot) {
        try {
          await appendChatMessages([r.carrega], config);
          await confirma(r.id);
        } catch {
          await ajorna(r);
        }
      }
      if (!navigator.onLine) break;
    }
  } finally { corrent = false; }
}

export function arrancaSincronitzador(config) {
  const disparador = () => buida(config);
  window.addEventListener('online', disparador);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') disparador();
  });
  const rellotge = setInterval(disparador, 30_000);
  disparador();
  return () => {
    window.removeEventListener('online', disparador);
    clearInterval(rellotge);
  };
}

export const compta = async () =>
  (await pendents()).filter((r) => r.estat !== 'confirmat').length;
```

### PEDAÇ 4 — `sendChatMessage` (inversió d'ordre; tanca 2.1 i 2.2)

```js
const sendChatMessage = async (thread, text) => {
  const nowTs = Date.now();
  const messageId = uuid();                       // ← UUID, no Date.now()
  const userMessage = {
    id: `${rawData.ownerUserId}::${thread.id}::${messageId}`,
    ownerUserId: rawData.ownerUserId,
    threadId: thread.id,
    messageId,
    createdAtTs: nowTs,
    text,
    sender: 'me',
    estatEnviament: 'pendent',                    // ← per a la marca visual
    time: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  };

  // 1r la pantalla. Sempre. Passe el que passe amb la xarxa.
  setRawData((current) => ({
    ...current,
    chatMessages: [...current.chatMessages, userMessage]
  }));

  // 2n el disc, amb el seu propi tallafocs.
  try {
    await encua({ id: userMessage.id, tipus: 'chat', carrega: userMessage });
  } catch (e) {
    console.error('[OUTBOX] escriptura fallida', e);
  }

  // 3r la xarxa, que ja no pot bloquejar res.
  buida(stableExternalConfig);

  return [userMessage];
};
```

Tres notes:

- **La resposta sintètica desapareix.** `makeChatReply` (`chatRuntime.js:58-131`) fabrica respostes aleatòries amb `randomPick` i les marca `synthetic: true`, i `sendChatMessage` les escriu a `chat_messages` de Supabase com si foren reals. Un Outbox que encua converses fabricades és un Outbox que sincronitza mentides. Fora abans de connectar la cua.
- `estatEnviament: 'pendent'` necessita marca visual. Complint la Llei del Quadrat i els 44 px: rellotge xicotet al costat de l'hora, no opacitat (a 1.38:1 de contrast un uelo amb cataractes no la veu).
- El comptador de `compta()` va a la capçalera: «3 missatges esperant cobertura». L'uelo ha de saber que la seua faena no s'ha perdut.

### PEDAÇ 5 — la porta mecànica

`tooling/gates/tractor-persistencia.mjs`, adjunt i **ja executat contra el codi real del bundle**:

```
L1 · getVal/setVal síncrones     ❌ 8 infraccions
L2 · localStorage encapsulat     ❌ 5 infraccions
L3 · UUID de missatge            ❌ 1 infracció
L4 · pintada abans que xarxa     ❌ 1 infracció

75 fonts revisades · 15 infraccions · eixida 1
```

Cablejar a `pre-commit.mjs` i a la porta d'arrel. Sense això, els pedaços 1-4 tornen en la ronda que ve, com el shim de `jsx-runtime`.

## 6. Deute detectat de camí

**`supabaseBackend.js:679-682`** — el comentari diu:

> «S'ha eliminat el bloqueig remot permanent a localStorage seguint la directiva de Claude perquè en cas de fallada de xarxa temporal, no deixe l'iPad sense capacitat d'escriure per sempre.»

La línia immediatament posterior és:

```js
setVal(getSectionRemoteWriteDisabledKey(config), true);
```

**El comentari certifica una correcció que no s'ha fet.** És el patró «Saber ≠ Fer» en la seua forma més pura: una directiva del Consell documentada com a aplicada, amb el codi intacte. I compon amb B1: si `getVal` es fa asíncrona, cada petició torna 401, `isRemoteUnavailable` inclou `'401'`, i este interruptor **desactiva l'escriptura remota de manera permanent** en el primer segon de vida de la migració.

## 7. Missió secundària: per què no arrenca el context

### 7.1 `despertar.mjs` no llig cap skill

Els 70 línies de `tooling/brain/despertar.mjs` imprimixen estat de Git, deute de Pedra Seca, **noms** de fitxers de l'Escriptori i el contingut de `00_EN_CURS.md`. **Zero referències a `.agents/skills`.** I acaba així:

```js
console.log('\n🤖 IAIA, ja tens el context inicial carregat. Recorda llegir els fitxers de l\'escriptori si és necessari...');
```

Un certificat que cap codi calcula, més una delegació explícita al criteri de l'agent. **El criteri és l'amnèsia.** Un arrencador determinista no pot acabar amb «recorda llegir si és necessari».

### 7.2 El preflight cognitiu continua sent fals

`tooling/wiki/lib/context_preflight.mjs` executat en sandbox amb la teua tasca real:

```
entrada: { tasca: 'Audita el patró Outbox i el disseny Pedra Seca del xat' }
eixida : { ready: true, skills: [], missingSources: [], omissions: [],
           indexDigest: "fresh_sha256_placeholder",
           fitxersRealmentLlegits: ["00_BIOS_COGNITIU.md"] }
```

La tasca conté «Pedra Seca», que és un `triggers_on` literal de la skill `pedra-seca`. L'encaminador torna `[]`. Motiu, línies 56-114: `parseTaskContract` és un «Mock parser», `loadCanonicalRegistry` diu al comentari que carrega `00_INDEX_SKILLS.md` i retorna `{}`, `routeSkills` retorna `[]`, `requireFreshCorpusDigest` retorna la cadena literal `"fresh_sha256_placeholder"`.

`ready: true` és un literal a la línia 52. `missingSources: []` i `omissions: []` també. **El bootloader determinista carrega zero skills, sempre, i certifica que està llest.**

### 7.3 El compilador de GENOMA esborra els disparadors

`compile-wiki-to-system-prompt.mjs:54`:

```js
const compressedContent = content.replace(/^---\n[\s\S]*?\n---\n/, '')
```

Amb el comentari: *«llevant el YAML frontmatter innecessari per la IA»*. És exactament al revés: el frontmatter és **l'única part llegible per màquina**. Executat contra les skills reals:

| Skill | Conserva `triggers_on`? | `status`? | `description`? |
|---|---|---|---|
| `pedra-seca` | **no** | no | no |
| `socdepoble-workflow` | **no** | no | no |
| `core-trust-boundary` | **no** | no | no |

GENOMA.md conté els cossos de les skills amb tota la metadada d'encaminament amputada. Es carrega prosa i es tira l'índex.

### 7.4 Contradiccions al cànon

**a) «Sempre» contra «per disparador».** `00_INDEX_SKILLS.md` declara els tres controls transversals com a *«s'apliquen sempre per validar l'entorn abans d'executar tasques de domini»*. El frontmatter dels tres els posa `triggers_on: [confiança, permisos, frontera…]` i `use_when: []`. Una skill que s'aplica sempre no pot estar tancada darrere d'un disparador. Com que tot està tancat per disparador i a l'inici de sessió encara no hi ha text d'usuari, **a l'arrencada no es carrega res**.

**b) La paradoxa d'arrencada.** `socdepoble-workflow` té com a pas 1 *«Lectura i Ancoratge (Aterratge): Carregar el context abans de generar propostes»*. Els seus disparadors són `[workflow, flux, procés, passos, guia]`. Tu obris sessió dient «audita això» i adjuntant una Petorreta. Cap d'eixes cinc paraules apareix. **La skill que ordena carregar el context només es carrega si ja mencionaves la paraula «workflow».** És l'arrel formal de l'amnèsia.

**c) Dependència penjada.** `cog-deliberation` declara `requires: [core-evidence-calibration]`. Eixa skill no existix: només n'hi ha 8 i no és cap d'elles.

**d) Descripcions buides.** 6 de 8 skills tenen `description: "Skill for <nom> operations."` — plantilla autogenerada. La descripció és precisament allò contra el que encaixa qualsevol encaminador semàntic. Només `pedra-seca` en té una de real.

**e) El gate existix i no està cablejat.** `tractor-cognitiu.mjs` **ja detecta** tot això. Les seues línies 246, 255 i 265 diuen textualment que `.agents/skills` queda fora de l'arrel del RAG i que «cap skill és recuperable per cerca». Referències en tot el repositori fora del propi fitxer: **una**, dins d'una cadena de text a `wiki_integritat.mjs:86`. `pre-commit.mjs` no l'invoca. **El diagnòstic està escrit i no s'executa mai.**

**f) Auto-contradicció.** `core-verified-change` exigix «proves proporcionals al risc» i té `tests: null` al seu propi frontmatter.

### 7.5 Pla d'arrencada determinista

Per ordre d'execució, cada punt amb comprovació mecànica:

1. **Partir el cànon en dos.** Afegir `authority_level: always` als tres `core-*` i **llevar-los `triggers_on`**. Carrega incondicional. La resta es queden amb disparadors.
2. **`socdepoble-workflow` passa a `always`.** Una skill d'ancoratge amb disparadors és una contradicció de termes.
3. **Conservar el frontmatter a GENOMA.** Substituir el `replace` per una reescriptura que retinga `name`, `description`, `status`, `authority_level` i `triggers_on`, i que tire només `freshness` i `owner`.
4. **Escriure 8 descripcions reals**, d'una línia, dient *quan* s'usa la skill i no *què és*.
5. **Resoldre `core-evidence-calibration`:** crear-la o llevar-la del `requires`. Un `requires` penjat ha de fer fallar la compilació.
6. **`context_preflight.mjs`: implementar-lo o esborrar-lo hui.** Un fitxer que retorna `ready: true` amb funcions simulades és pitjor que no tindre'n cap, perquè produïx un rebut fals. Si no s'implementa esta setmana, `git rm`.
7. **Reescriure el final de `despertar.mjs`:** que llija els fitxers `always`, n'imprimisca el sha256 i els bytes, i que si en falta un **isca amb codi 1**. Que el darrer `console.log` no siga mai una afirmació que el codi no ha calculat.
8. **Cablejar `tractor-cognitiu.mjs` a `pre-commit.mjs`.**

## 8. Veredicte

**BLOQUEJAT.** Sense llum verda.

No és pel pla d'Outbox: el pla no ha arribat, i el protocol d'amnèsia em prohibix inventar-lo. **Envia'm el document del pla d'IndexedDB complet i el torne a avaluar amb nota real.**

El bloqueig és perquè, tal com està el codi hui, executar la migració a promesa produiria `Bearer [object Promise]` en cada petició, `[object Promise]` incrustat dins de les claus de fila de Supabase, i l'activació immediata i permanent de l'interruptor d'escriptura remota. No és una degradació: és mort de l'aplicació el primer segon.

Ordre de treball:

1. Retirar la fitxa pública «IDB Guardian» (exposició legal, minuts de faena).
2. Pedaç 1 + `delVal` + `theme.js` a la capa.
3. Pedaç 5 cablejat, en roig. És la línia de base.
4. Llevar `makeChatReply` del camí de persistència.
5. Pedaços 2, 3 i 4.
6. Tractor de persistència en verd. Ara sí, llum verda per a la fase següent.

I una cosa que sí que està bé i que convé no tocar: **l'upsert `on_conflict=id` amb `merge-duplicates`**. És l'única peça del transport actual que està correctament dissenyada. Tot el pedaç de l'Outbox descansa damunt d'ella.
