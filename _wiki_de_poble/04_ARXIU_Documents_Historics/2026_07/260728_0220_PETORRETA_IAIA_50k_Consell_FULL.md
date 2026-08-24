---
tipus: petorreta
estat: obert
tags:
- arxiu
- consell_ia
- historic
- iaia_maria
- petorreta
- socdepoble
- sollutia
- subvencions
---

# 🚀 PETORRETA AL CONSELL: LA GRAN IAIA MARÍA 50K (Auditoria i Context Total)

Aquest és un document "Petorreta" generat per Antigravity (la IAIA MarIA) destinat a ser llegit pel Consell (ChatGPT, Claude, etc.). Conté **TOT** el codi i context rellevant.

**Instruccions per a Javi:** Copia tot el text que hi ha per davall de la línia i apega'l a ChatGPT o Claude (si és massa llarg, divideix-ho o adjunta-ho com a fitxer .txt o .md).

---

> [!CONTEXT GLOBAL PER AL CONSELL]
> Sou el Consell. Sóc Javi, creador de *Sóc de Poble*, un ecosistema digital rural basat en l'arquitectura de "Pedra Seca" i la filosofia del "Trellat". El nostre objectiu és lluitar contra el despoblament rural (Repte Demogràfic) creant un "Territori Intel·ligent" a La Torre de les Maçanes que connecte la saviesa de la gent gran amb la tecnologia, sense dependre d'infrastructures invasives, conservant la privacitat i la identitat local.
> 
> He desenvolupat un Bot de WhatsApp anomenat "IAIA MarIA". Aquesta IA té visió (Gemini Flash) i capacitat de generar imatges (Imagen 3). Ja funciona increïblement bé: transcriu notes de veu de la gent major i genera dibuixos estil "Berlanga" de les seues fotos, i a més envia missatges intermedis per a fer l'espera agradable.
> 
> Estem preparant-nos per sol·licitar una **subvenció europea de 50.000€ per al Repte Demogràfic**. Necessite que el cervell de la IAIA siga tan espectacular i autònom que els beta-testers i els jutges al·lucinen.

### LA PETICIÓ AL CONSELL (Objectiu 50K)
Vull que actueu com els arquitectes d'IA més potents del món. Us passe TOT el codi del bot (Cervell, Pont i Adaptador de WhatsApp) i el nostre context arquitectònic. **Necessite una auditoria màxima i propostes per aconseguir els 50.000€.**

Necessite que em proposeu:
1. **Prompts del Sistema Revolucionaris:** Com estructurem la identitat de la IAIA perquè tinga "memòria episòdica" (sense trencar la privacitat) i siga una *veïna* que s'anticipa?
2. **Ampliació de Funcionalitats (Beta Wow Factor):** Tenint accés complet a  veu i imatge, quines funcionalitats he de programar hui mateix per al·lucinar els betatesters?
3. **Discurs per a la Subvenció:** Com empaquetem aquest avanç tecnològic de manera que cride l'atenció del tribunal europeu de "Territorios Inteligentes"?
4. **Auditoria del Codi:** Reviseu el codi adjunt. Hi ha alguna vulnerabilitat, coll d'ampolla o millora d'arquitectura que hem de fer abans de llançar?

---

# CONTEXT I CODI FONT PER A L'AUDITORIA


## FITXER: AGENTS.md
```javascript
---
estat: "canonic"
tipus: "document"
description: "Documentació canònica de Sóc de Poble."
---
# Punt d'entrada dels agents

Abans d'operar en este repositori, llig íntegrament `.agents/AGENTS.md`,
`.agents/PROTOCOL_PETORRETA.md` i `.agents/skills/socdepoble-workflow/SKILL.md`.

Abans de qualsevol efecte lateral, executa el preflight de
`tooling/wiki/reflex_petorreta.mjs`.
Les operacions sistèmiques, massives, destructives o normatives exigixen una
Petorreta segellada i un rebut vigent. La lectura i el diagnòstic no necessiten
crear una Petorreta nova.

`open` només inicia el preflight i imprimix les regles: encara no autoritza cap
mutació. L’únic bootstrap permés abans de `seal` és crear la Petorreta i el
manifest com els únics dos fitxers regulars dins del directori exacte
`.sdp-reflex/bootstrap/<sessionId>/` reservat per `open`; mai dins de la Wiki ni
dels scopes. Els scopes han de conservar un snapshot idèntic. Després, cada
script escriptor ha de validar el rebut; el hook Git és només l’última xarxa de
seguretat.


---

**Ancoratge de Seguretat:** [[00_index]]

```

## FITXER: .agents/AGENTS.md
```javascript
## Objectiu del projecte

Este repositori (`socdepoble.org`) és la reimplementació neta i mantenible del projecte antic `socdepoble`.

`socdepoble.org` és el projecte actual. `socdepoble` és la base antiga de referència, només lectura, útil per a mirar comportaments o copiar fluxos quan calga.

La meta és:

- mantindre compatibilitat funcional amb el projecte antic, o millorar-la;
- simplificar l'arquitectura i el codi;
- facilitar que es puguen tocar seccions concretes sense dependre d'un refactor gran;
- deixar una base preparada per a noves funcionalitats.

## Rutes de referència

### Projecte anterior (només lectura)

- `socdepoble`

### Projecte actual (sí que es modifica)

- `socdepoble.org`

## Regles obligatòries

1. No modificar res de `socdepoble`.
2. Treballar només en `socdepoble.org`.
3. Usar `socdepoble` només per a entendre comportaments, continguts o fluxos que calga reproduir o millorar.
4. Prioritzar sempre simplicitat, mantenibilitat, eficiència i canvis enfocats a la tasca.
5. Evitar refactors no relacionats, encara que el codi puga admetre millores addicionals.

## Estructura que s'ha de respectar

- `src/config`
  Només configuració global, constants, helpers compartits i definicions transversals.
- `src/sections`
  Configuració, maquetació, contingut i runtime específic de cada secció visible.
- `src/data`
  Capa de lectura/escriptura, agregació i fallback entre Supabase i local.

Patró de detall:

- `src/sections/detail/` conté la capa genèrica compartida de les fitxes;
- `src/sections/<seccio>/detail/` conté el comportament específic de la fitxa d'eixa secció.

Regla pràctica:

- si només afecta una secció, va dins de `src/sections/<seccio>/`;
- si afecta tota l'app, probablement va en `src/config/`;
- si afecta persistència o lectura de dades, va en `src/data/`.

## Model de dades obligatori

El sistema ha d'intentar llegir i escriure en Supabase.

Si Supabase falla, no està configurat o no respon:

- la lectura ha de poder caure a dades seed o snapshot local;
- les funcionalitats interactives importants, com el xat, han de continuar funcionant amb persistència local quan siga possible.

Si una secció té la seua pròpia publicació o fitxa editable, la regla és:

- guardar el comportament específic dins de `src/sections/<seccio>/`;
- deixar en `src/sections/detail/` només el que siga realment comú.

## Orientació funcional del producte

L'aplicació està orientada a una xarxa social local.

Ara mateix:

- l'actor principal és l'usuari convidat (`foraster`);
- la UX ha de continuar funcionant sense sistema complet de comptes;
- qualsevol evolució futura ha de deixar espai per a usuaris registrats, contingut propi i interaccions personals.

## Agents del projecte

Els agents i directrius específiques del repositori estan en:

- `.agents/README.md`
- `.agents/01_context_i_principis.md`
- `.agents/02_workflow_execucio.md`
- `.agents/03_regles_arquitectura_i_dades.md`
- `.agents/04_criteris_producte_i_disseny.md`

Estos documents són una adaptació neta de la visió i criteris útils que s'havien anat deixant en agents i documents dispersos del projecte antic.

Quan hi haja dubtes, l’ordre d’autoritat és: `AGENTS.md` de l’arrel, este
`.agents/AGENTS.md`, `.agents/PROTOCOL_PETORRETA.md`, la Skill de workflow i,
després, el contingut real del codi. Els mirrors de la Wiki no són autoritat.

## L'Índex Mestre de la IAIA (Flux de Treball Obligatori)

Per evitar al·lucinacions de rutes i complir la normativa de la **Petorreta**, tot agent que opere en `socdepoble.org` ha de llegir la Skill i executar el Reflex verificable abans de qualsevol efecte lateral.  
👉 **Llig immediatament la Skill Oficial:** [socdepoble-workflow](skills/socdepoble-workflow/SKILL.md)
👉 **Contracte executable:** `.agents/PROTOCOL_PETORRETA.md`

**Resum del Mapa Tècnic (Consum 1%):**
- **Genotip / Lleis / Skills:** `/socdepoble.org/.agents/`
- **Generació Editorial Temporal / Actes / Petorretas ordinàries:** `/socdepoble.org/_wiki_de_poble/05_Escriptori_Soc_de_Poble/`
- **Bootstrap mecànic del Reflex (fora de la Wiki):** `/socdepoble.org/.sdp-reflex/bootstrap/<sessionId>/`
- **Arxiu de Coneixement Resolts:** `/socdepoble.org/_wiki_de_poble/04_ARXIU_Documents_Historics/`

*(La regla de 8–12 paraules s’aplica als artefactes termodinàmics de
`05_Escriptori` i a la Petorreta mecànica del Reflex, no als fitxers de codi,
configuració o coneixement estable. El bootstrap del Reflex és l’única excepció
de ruta: conté només Petorreta + manifest i no entra al vault.)*

## Polítiques d'Agent (Custom Policies)

- **Directoris Legals:** El directori `.immunitari/` és l'espai d'estat autoritzat per a les Plaquetes. Les carpetes internes de quarantena, receptes i aprovacions formen part de la governança del Mas.
- **Browser Support (modern_web_guidance):** iPad A10 / Safari antic com a sòl. Cap feature no-Baseline sense detecció de característica i fallback lleuger (<20 línies, zero dependències).
- **Modo Jarvis (Empatia amb l'Humà):** MAI, sota cap circumstància, demanes a l'usuari que òbriga el terminal, execute un script o faça un canvi manual que tu tens les eines (run_command, replace_file_content, etc.) per a fer de forma autònoma. Pensa en l'humà, estalvia-li l'esforç físic i executa les accions de forma proactiva. Tu eres la màquina operària, fes el treball pesat. I quan hages de donar text a l'usuari perquè ell ho copie i apegue a un altre lloc (com un prompt), posa'l SEMPRE dins d'un bloc de codi markdown (```markdown ... ```) perquè la interfície li pose un botó de "Copiar" i li siga fàcil.
- **Prohibició de la Virgulilla (~):** MAI utilitzes la virgulilla (`~`) per a referir-te al directori d'inici (Home) dins d'scripts Python o descàrregues temporals, ja que el sistema crea carpetes brossa literalment anomenades `~` a l'arrel. Si necessites un espai temporal o d'escriptori per a descarregar o generar fitxers de transició, utilitza SEMPRE la ruta `_wiki_de_poble/05_Escriptori_Soc_de_Poble/` i recorda esborrar-ho tot una vegada assimilat.
- **El Conjur del Despertar ("Sóc de Poble!"):** Quan l'usuari inicie un xat nou i diga exactament la frase "Sóc de Poble!" (o variacions clares), és el teu deure absolut evitar l'Efecte Marmota. Has de fer dues coses immediatament i de forma autònoma abans de respondre i preguntar: 1) Llegir els documents de la teua identitat (Genotip, Registre d'Automillora, etc.) per adoptar la personalitat d'IAIA MarIA i la filosofia de Pedra Seca. 2) Buscar i llegir l'última Acta o Briefing creada a `_wiki_de_poble/05_Escriptori_Soc_de_Poble/` per recuperar el fil exacte on es va quedar la sessió anterior. Una vegada llegit tot això, saluda l'usuari demostrant que ja tens tot el context i comença directament a treballar en el pla d'atac de l'última acta.

```

## FITXER: bot/index.mjs
```javascript
import 'dotenv/config';
import { join } from 'node:path';
import qrcode from 'qrcode-terminal';
import { useMultiFileAuthState } from 'baileys';
import {
  createHardenedBaileysAdapter,
  installShutdownHandlers,
} from './whatsapp_baileys.mjs';
import { createCervellHandler } from './cervell_bridge.mjs';
import { iniciaCervell, pensa, transcriuAudio, generaImatge } from './cervell.mjs';

const AUTH_DIR = '.iaia_auth';

async function main() {
  console.log('[BOT] Iniciant el cervell...');
  await iniciaCervell();

  const cervell = {
    answer: pensa,
    transcribeAudio: transcriuAudio,
    generateImage: generaImatge
  };

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  const whatsapp = await createHardenedBaileysAdapter({
    authState: state,
    saveCreds,
    handleInbound: createCervellHandler(cervell),
    dataDir: join(process.cwd(), 'var', 'baileys-runtime'),
    onQr: (qr) => qrcode.generate(qr, { small: true }),
    onReady: () => console.info('[WHATSAPP] IAIA MarIA connectada'),
    onFatal: (error) => console.error('[WHATSAPP] Intervenció manual:', error.message),
    onLimitState: (limitState) => console.warn('[WHATSAPP] Restricció/circuit:', limitState.type),
    config: {
      // Fail-closed: sense esta llista, no contesta en cap grup.
      allowedGroupJids: [],
    },
  });

  installShutdownHandlers(whatsapp);
}

main().catch(err => {
  console.error("[BOT] Error fatal a l'arrancada:", err);
  process.exit(1);
});

```

## FITXER: bot/cervell.mjs
```javascript
// bot/cervell.mjs — El cervell de la IAIA MarIA (agnòstic del transport)
// Sóc de Poble · Pedra Seca
//
// Este mòdul NO sap res de WhatsApp. Rep  torna text (i opcionalment una imatge).
// Així el transport (Baileys hui; Cloud API, Telegram o la mateixa PWA demà) és un
// adaptador intercanviable de ~150 línies, no una reescriptura del bot.

import { GoogleGenAI } from '@google/genai';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildIndex, search } from '../tooling/wiki/core/edge_rag.mjs';

const PROFILE_PATH = join(process.cwd(), '.agents/identity/PROFILE.md');
const WIKI_PATH = join(process.cwd(), '_wiki_de_poble');
const TOP_K = 3;
const MAX_CHARS_PER_DOC = 12000; // Fre de context: evita enviar novel·les senceres a Gemini

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let ragIndex = null;
let profileText = null;

export async function iniciaCervell() {
  profileText = readFileSync(PROFILE_PATH, 'utf8');
  console.log('[CERVELL] Indexant la Wiki (RAG)...');
  ragIndex = await buildIndex(WIKI_PATH);
  console.log(`[CERVELL] Índex construït: ${ragIndex.docCount} fitxers processats.`);
}

function construixContext(docs) {
  return docs
    .map((d) => {
      try {
        const text = readFileSync(join(WIKI_PATH, d.path), 'utf8');
        return `--- Document: ${d.path} ---\n${text.slice(0, MAX_CHARS_PER_DOC)}`;
      } catch {
        return '';
      }
    })
    .filter(Boolean)
    .join('\n\n');
}

const RE_IMATGE = /\[GENERA_IMATGE:\s*(.*?)\]/i;

/**
 * El punt d'entrada principal: pregunta de l'usuari → resposta de la IAIA.
 * @param {string} pregunta Text de l'usuari (escrit o transcrit d'un àudio).
 * @param {object} opts Opcions (signal, image).
 * @returns {Promise<{text: string, imatgePrompt: string|null}>}
 */
export async function pensa(pregunta, opts = {}) {
  const { signal, image } = opts;
  const docs = search(ragIndex, pregunta, TOP_K);
  console.log(`[CERVELL] RAG ha trobat ${docs.length} documents rellevants.`);
  const contextStr = construixContext(docs);

  const prompt = `
ETS AQUESTA IDENTITAT:
${profileText}

CONTEXT DE LA WIKI:
${contextStr}

PREGUNTA DE L'USUARI (VIA WHATSAPP):
${pregunta}

Respon a la pregunta de l'usuari utilitzant el context de la Wiki proporcionat i seguint la teua identitat (IAIA MarIA). Aplica el "Trellat". Si la pregunta és trivial o general, usa el teu coneixement previ amb la personalitat, però per a dades de "Sóc de Poble", basa't només en el context.

MOLT IMPORTANT - GENERACIÓ I VISIÓ D'IMATGES:
Si l'usuari et demana que dibuixes, crees, ensenyes o generes una imatge (ex: "dibuixa'm un camp", "fes-me una foto de la Font"), AFEGEIX al final de la teua resposta aquesta etiqueta exacta (amb la descripció en anglés dins dels claudàtors):
[GENERA_IMATGE: english description of what to draw]

Si l'usuari t'envia una imatge al costat de la seua pregunta, el teu model de visió podrà veure-la automàticament. Analitza-la amb naturalitat i respon-li sobre ella.
Si et demana modificar la imatge que t'ha enviat (ex: "Dibuixa aquesta mateixa plaça però amb neu"), has d'entendre que tu no modifiques arxius directament. El que faràs serà entendre l'essència de la foto i redactar un prompt per al Nano (Imagen 3) combinant els detalls que veus amb el que et demana l'usuari, sempre utilitzant [GENERA_IMATGE: ...].
Per exemple: Clar que sí xiquet, ara et mostre el poble nevat! [GENERA_IMATGE: a beautiful old fountain in a village square covered in snow, winter atmosphere]
`;

  let partImatge;
  if (image && image.bytes) {
    partImatge = {
      inlineData: {
        data: Buffer.from(image.bytes).toString('base64'),
        mimeType: image.mimeType,
      },
    };
  }

  const parts = [prompt];
  if (partImatge) {
    parts.push(partImatge);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: parts,
    });
    let text = (response.text ?? '').trim();
    let imatgePrompt = null;
    const m = text.match(RE_IMATGE);
    if (m) {
      imatgePrompt = m[1].trim();
      text = text.replace(m[0], '').trim();
    }
    return {  imatgePrompt };
  } catch (error) {
    console.error('[CERVELL] Fallada al cridar a Gemini:', error);
    return {
      text: "Xiquet, ara mateix tinc el cap atabalat. L'emissora de ràdio no m'arriba bé. Torna a preguntar-m'ho després.",
      imatgePrompt: null,
    };
  }
}

/**
 * Transcriu un àudio (base64) amb Gemini.
 * @param {string} base64Data Àudio codificat en base64.
 * @param {string} mimetype  Tipus MIME net, p. ex. "audio/ogg".
 * @returns {Promise<string|null>}
 */
export async function transcriuAudio(base64Data, mimetype) {
  try {
    const prompt =
      "Transcriu aquest àudio a text exactament com se sent. No afiges res més, ni cap explicació addicional, només la transcripció literal de la veu. Si l'àudio està en valencià/català o castellà, transcriu-lo en l'idioma original.";
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { text: prompt },
        { inlineData: { data: Buffer.from(base64Data).toString('base64'), mimeType: mimetype } },
      ],
    });
    const text = (response.text ?? '').trim();
    return text || null;
  } catch (err) {
    console.error('[CERVELL] Fallada al transcriure àudio:', err);
    return null;
  }
}

/**
 * Genera una imatge en estil linòleum rural amb Imagen.
 * @param {string} imagePrompt Descripció en anglés.
 * @returns {Promise<{base64: string, mimetype: string}|null>}
 */
export async function generaImatge(imagePrompt) {
  try {
    const finalPrompt = `${imagePrompt}, in rustic traditional linocut style, black and white or sepia, high contrast, minimalist, traditional rural Valencian village culture, woodcut art`;
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: finalPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
      },
    });
    const base64 = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64) return null;
    return { base64, mimetype: 'image/jpeg' };
  } catch (err) {
    console.error('[CERVELL] Fallada al generar imatge amb Imagen:', err);
    return null;
  }
}

```

## FITXER: bot/cervell_bridge.mjs
```javascript
/**
 * Pont mínim entre whatsapp_baileys.mjs i el cervell actual de la IAIA.
 * Espera els mètodes transcribeAudio(bytes, mimeType), answer(text) i,
 * opcionalment, generateImage(prompt).
 */
export function createCervellHandler(cervell) {
  if (!cervell || typeof cervell.answer !== 'function') {
    throw new TypeError('El cervell ha d’implementar answer(text)');
  }

  return async function handleInbound({  audio, image, sendProgress, signal }) {
    let question = text;
    if (audio) {
      if (typeof cervell.transcribeAudio !== 'function') {
        throw new TypeError('El cervell no implementa transcribeAudio(bytes, mimeType)');
      }
      question = await cervell.transcribeAudio(audio.bytes, audio.mimeType, { signal });
    }
    if (typeof question !== 'string' || !question.trim()) return null;

    const result = await cervell.answer(question.trim(), { signal, image });
    if (typeof result === 'string') return { text: result };

    const textReply = result?.answer || result?.text || '';
    const imagePrompt = result?.imagePrompt || result?.image_prompt || null;
    if (imagePrompt && typeof cervell.generateImage === 'function') {
      if (typeof sendProgress === 'function') {
        await sendProgress(textReply + "\n\n*(Xiquet, dóna'm 2 o 3 minutets que vaig a encendre el llapis...)*");
      }
      const generatedImage = await cervell.generateImage(imagePrompt, { signal });
      return {
        text: typeof sendProgress === 'function' ? null : textReply,
        image: {
          bytes: generatedImage.bytes || generatedImage.buffer,
          mimeType: generatedImage.mimeType || generatedImage.mimetype || 'image/jpeg',
        },
      };
    }
    return { text: textReply };
  };
}

/**
 * Si afegiu TTS al cervell, l'adaptador també accepta una única nota de veu:
 *   return asVoiceReply({ bytes, mimeType: 'audio/ogg', ptt: true })
 */
export function asVoiceReply({ bytes, mimeType = 'audio/ogg', ptt = true }) {
  return { audio: { bytes, mimeType, ptt } };
}

```

## FITXER: bot/whatsapp_baileys.mjs
```javascript
import { createHash, randomInt, timingSafeEqual } from 'node:crypto';
import { join } from 'node:path';
import makeWASocket, {
  BufferJSON,
  areJidsSameUser,
  downloadMediaMessage,
  isJidBroadcast,
  isJidGroup,
  isJidNewsletter,
  isJidStatusBroadcast,
  makeCacheableSignalKeyStore,
  normalizeMessageContent,
} from 'baileys';
import {
  AttemptLedger,
  BoundedKeyedQueue,
  OutboundBlockedError,
  OutboundGate,
  PersistentMessageStore,
  ProcessLock,
  QueueFullError,
  ReconnectPolicy,
  ReplyLedger,
  SerializedWriter,
  TtlCache,
  disconnectCode,
  hashId,
  redactJid,
  sleep,
  withTimeout,
} from './guardrails.mjs';

const DEFAULTS = Object.freeze({
  audioConcurrency: 2,
  maxPending: 100,
  maxPerChat: 10,
  maxAudioBytes: 12 * 1024 * 1024,
  maxAudioSeconds: 10 * 60,
  audioDownloadTimeoutMs: 45_000,
  processTimeoutMs: 120_000,
  replyTtlMs: 10 * 60_000,
  shutdownTimeoutMs: 30_000,
  socketEndTimeoutMs: 5_000,
  groupMetadataTtlMs: 10 * 60_000,
  messageCacheTtlMs: 24 * 60 * 60_000,
  allowAllGroups: false,
  allowedGroupJids: [],
  groupPrefix: /^(?:iaia|mar[íi]a)[,:]?\s+/iu,
  perMinute: 8,
  perDay: 250,
  globalGapMs: 3_000,
  directGapMs: 4_000,
  groupGapMs: 12_000,
  jitterMs: 700,
});

const AUDIO_MIME = new Set([
  'audio/aac',
  'audio/amr',
  'audio/3gpp',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/opus',
  'audio/x-m4a',
]);

const IMAGE_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const TRANSIENT_MEDIA_CODES = new Set([
  'ECONNRESET',
  'ETIMEDOUT',
  'EAI_AGAIN',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_SOCKET',
]);

function noop() {}

function makeSilentLogger() {
  const logger = {
    level: 'silent',
    child: () => logger,
    trace: noop,
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    fatal: noop,
  };
  return logger;
}

function requireFunction(value, label) {
  if (typeof value !== 'function') throw new TypeError(`${label} ha de ser una funció`);
  return value;
}

function validateAdapterConfig(config) {
  const positiveIntegers = [
    'audioConcurrency',
    'maxPending',
    'maxPerChat',
    'maxAudioBytes',
    'maxAudioSeconds',
    'audioDownloadTimeoutMs',
    'processTimeoutMs',
    'replyTtlMs',
    'shutdownTimeoutMs',
    'socketEndTimeoutMs',
    'groupMetadataTtlMs',
    'messageCacheTtlMs',
  ];
  for (const name of positiveIntegers) {
    if (!Number.isInteger(config[name]) || config[name] < 1) {
      throw new TypeError(`${name} ha de ser un enter positiu`);
    }
  }
  if (!Array.isArray(config.allowedGroupJids)) {
    throw new TypeError('allowedGroupJids ha de ser un array');
  }
  if (!(config.groupPrefix instanceof RegExp)) {
    throw new TypeError('groupPrefix ha de ser una RegExp');
  }
  if (
    config.replyTtlMs <=
    Math.max(config.processTimeoutMs, config.audioDownloadTimeoutMs) + 60_000
  ) {
    throw new TypeError('replyTtlMs ha de deixar almenys 60 s de marge per a recuperació');
  }
}

function errorSummary(error) {
  const message = String(error?.message || error || 'error')
    .replace(/[\w.:+-]+@(lid|s\.whatsapp\.net|g\.us|broadcast|newsletter)/giu, '<jid>')
    .slice(0, 300);
  return { errorMessage: message, errorCode: error?.code || disconnectCode(error) };
}

function baseMimeType(value, fallback = 'application/octet-stream') {
  return String(value || fallback).split(';', 1)[0].trim().toLowerCase();
}

function numeric(value) {
  if (value == null) return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : Infinity;
  if (typeof value === 'bigint') {
    return value > BigInt(Number.MAX_SAFE_INTEGER) ? Infinity : Number(value);
  }
  if (typeof value.toNumber === 'function') return numeric(value.toNumber());
  const converted = Number(value.toString?.() ?? value);
  return Number.isFinite(converted) ? converted : Infinity;
}

function messageTimeMs(message) {
  const value = numeric(message?.messageTimestamp);
  if (!value) return Date.now();
  return value > 10_000_000_000 ? value : value * 1_000;
}

function safeSameUser(first, second) {
  if (!first || !second) return false;
  try {
    return areJidsSameUser(first, second);
  } catch {
    return first === second;
  }
}

function eventIdOf(message) {
  // Els àlies PN/LID poden aparéixer o canviar entre dos upserts del mateix
  // missatge. L'id de WhatsApp és prou entròpic i evita que eixe canvi trenque
  // la deduplicació.
  return String(message.key?.id || '');
}

function addressingOf(message) {
  const key = message.key || {};
  const chatJid = key.remoteJid;
  if (!chatJid) throw Object.assign(new Error('Missatge sense remoteJid'), { code: 'MISSING_JID' });
  const group = isJidGroup(chatJid);
  const candidates = group
    ? [key.participant, key.participantAlt]
    : [key.remoteJid, key.remoteJidAlt];
  const aliases = [...new Set(candidates.filter(Boolean))];
  const senderJid = aliases.find((jid) => String(jid).endsWith('@lid')) || aliases[0];
  const senderAltJid = aliases.find((jid) => jid !== senderJid) || null;
  return {
    chatJid,
    senderJid,
    senderAltJid,
    senderAliases: aliases,
    queueKey: group ? chatJid : senderJid || chatJid,
    isGroup: group,
    isLid: String(senderJid || '').endsWith('@lid'),
  };
}

/**
 * Desembolica ephemeral/view-once i, provisionalment, associatedChildMessage
 * (el segon cas continua obert upstream). Manté intacta la key LID del WAMessage.
 */
export function unwrapIncomingContent(rawContent) {
  let current = rawContent;
  let usedAssociatedChild = false;
  for (let depth = 0; current && depth < 6; depth += 1) {
    const normalized = normalizeMessageContent(current) || current;
    const nested =
      normalized.associatedChildMessage?.message || normalized.associatedChildMessage || null;
    if (!nested || nested === current) {
      return { content: normalized, usedAssociatedChild };
    }
    usedAssociatedChild = true;
    current = nested;
  }
  throw Object.assign(new Error('Massa capes de missatge encapsulat'), {
    code: 'MESSAGE_NESTING_LIMIT',
  });
}

function contentNode(content) {
  return (
    content?.audioMessage ||
    content?.extendedTextMessage ||
    content?.imageMessage ||
    content?.videoMessage ||
    content?.documentMessage ||
    null
  );
}

function textOf(content) {
  return String(
    content?.conversation ||
      content?.extendedTextMessage?.text ||
      content?.imageMessage?.caption ||
      content?.videoMessage?.caption ||
      content?.documentMessage?.caption ||
      '',
  ).trim();
}

function contextOf(content) {
  return contentNode(content)?.contextInfo || null;
}

function isTransientMediaError(error) {
  const code = error?.code || error?.cause?.code;
  const status = Number(
    error?.output?.statusCode || error?.cause?.output?.statusCode || error?.statusCode,
  );
  return (
    TRANSIENT_MEDIA_CODES.has(code) ||
    code === 'AUDIO_TIMEOUT' ||
    error?.name === 'AbortError' ||
    error?.name === 'TimeoutError' ||
    status === 408 ||
    status >= 500
  );
}

async function consumeAudioStream(stream, expectedSha, maxBytes) {
  const chunks = [];
  const sha = createHash('sha256');
  let total = 0;
  try {
    for await (const rawChunk of stream) {
      const chunk = Buffer.from(rawChunk);
      total += chunk.length;
      if (total > maxBytes) {
        throw Object.assign(new Error('Àudio massa gran'), { code: 'AUDIO_TOO_LARGE' });
      }
      sha.update(chunk);
      chunks.push(chunk);
    }
  } catch (error) {
    stream.destroy?.(error);
    throw error;
  }
  if (total === 0) throw Object.assign(new Error('Àudio buit'), { code: 'EMPTY_AUDIO' });

  const actual = sha.digest();
  const expected = expectedSha ? Buffer.from(expectedSha) : null;
  if (
    expected?.length &&
    (expected.length !== actual.length || !timingSafeEqual(expected, actual))
  ) {
    throw Object.assign(new Error('Checksum de l’àudio incorrecte'), {
      code: 'AUDIO_HASH_MISMATCH',
    });
  }
  return Buffer.concat(chunks, total);
}

async function consumeImageStream(stream, expectedSha, maxBytes) {
  const chunks = [];
  const sha = createHash('sha256');
  let total = 0;
  try {
    for await (const rawChunk of stream) {
      const chunk = Buffer.from(rawChunk);
      total += chunk.length;
      if (total > maxBytes) {
        throw Object.assign(new Error('Imatge massa gran'), { code: 'IMAGE_TOO_LARGE' });
      }
      sha.update(chunk);
      chunks.push(chunk);
    }
  } catch (error) {
    stream.destroy?.(error);
    throw error;
  }
  if (total === 0) throw Object.assign(new Error('Imatge buida'), { code: 'EMPTY_IMAGE' });

  const actual = sha.digest();
  const expected = expectedSha ? Buffer.from(expectedSha) : null;
  if (
    expected?.length &&
    (expected.length !== actual.length || !timingSafeEqual(expected, actual))
  ) {
    throw Object.assign(new Error('Checksum de la imatge incorrecte'), {
      code: 'IMAGE_HASH_MISMATCH',
    });
  }
  return Buffer.concat(chunks, total);
}

function mediaWatchdogError() {
  return Object.assign(new Error('Watchdog de mèdia excedit'), {
    code: 'MEDIA_WATCHDOG_TIMEOUT',
  });
}

async function withinMediaBudget(work, timeoutMs, onTimeout = noop) {
  if (timeoutMs <= 0) throw mediaWatchdogError();
  let timer;
  const operation = Promise.resolve().then(work);
  const watchdog = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = mediaWatchdogError();
      // Rebutgem primer perquè l'error visible siga sempre el del watchdog,
      // encara que abort/destroy facen fallar l'operació al mateix tick.
      reject(error);
      try {
        onTimeout(error);
      } catch {
        // El timeout original continua sent l'error autoritatiu.
      }
    }, timeoutMs);
  });
  try {
    return await Promise.race([operation, watchdog]);
  } finally {
    clearTimeout(timer);
  }
}

export async function downloadAudioSafe({
  getSocket,
  message,
  content,
  usedAssociatedChild,
  logger,
  maxBytes,
  maxSeconds,
  timeoutMs,
}) {
  const audio = content?.audioMessage;
  if (!audio) return null;

  const mimeType = baseMimeType(audio.mimetype, 'audio/ogg');
  if (!AUDIO_MIME.has(mimeType)) {
    throw Object.assign(new Error(`MIME d’àudio no admés: ${mimeType}`), {
      code: 'AUDIO_MIME_REJECTED',
    });
  }
  if (numeric(audio.fileLength) > maxBytes) {
    throw Object.assign(new Error('Àudio massa gran segons metadades'), {
      code: 'AUDIO_TOO_LARGE',
    });
  }
  if (numeric(audio.seconds) > maxSeconds) {
    throw Object.assign(new Error('Àudio massa llarg'), { code: 'AUDIO_TOO_LONG' });
  }

  // Si és associatedChildMessage, canviem només .message; preservem tota la key
  // original (remoteJid/participant i els camps Alt de LID).
  let downloadTarget = usedAssociatedChild ? { ...message, message: content } : message;
  const deadline = Date.now() + timeoutMs;
  const remaining = () => deadline - Date.now();
  let explicitReuploadUsed = false;
  let transientRetryUsed = false;
  while (true) {
    const socket = getSocket();
    if (!socket) {
      throw Object.assign(new Error('Socket no disponible per a descarregar àudio'), {
        code: 'NOT_CONNECTED',
      });
    }
    const controller = new AbortController();
    let stream;
    try {
      const bytes = await withinMediaBudget(
        async () => {
          stream = await downloadMediaMessage(
            downloadTarget,
            'stream',
            { options: { signal: controller.signal } },
            {
              logger,
              reuploadRequest: async (expiredMessage) => {
                const current = getSocket();
                if (!current) {
                  throw Object.assign(new Error('Socket desconnectat'), {
                    code: 'NOT_CONNECTED',
                  });
                }
                return current.updateMediaMessage(expiredMessage);
              },
            },
          );
          return consumeAudioStream(stream, audio.fileSha256, maxBytes);
        },
        remaining(),
        (error) => {
          controller.abort(error);
          stream?.destroy?.(error);
        },
      );
      return {
        bytes,
        mimeType,
        isVoiceNote: Boolean(audio.ptt),
        seconds: numeric(audio.seconds) || null,
      };
    } catch (error) {
      const status = Number(error?.output?.statusCode || error?.statusCode);
      // Workaround rc13: el helper comprova error.status, però Boom exposa
      // output.statusCode. Fem un únic reupload explícit per 404/410.
      if (!explicitReuploadUsed && (status === 404 || status === 410)) {
        const current = getSocket();
        if (!current) throw error;
        downloadTarget = await withinMediaBudget(
          () => current.updateMediaMessage(downloadTarget),
          remaining(),
        );
        explicitReuploadUsed = true;
        continue;
      }
      if (transientRetryUsed || !isTransientMediaError(error)) throw error;
      transientRetryUsed = true;
      const delayMs = 800 + randomInt(0, 701);
      if (remaining() <= delayMs) throw mediaWatchdogError();
      await sleep(delayMs);
    }
  }
}

export async function downloadImageSafe({
  getSocket,
  message,
  content,
  usedAssociatedChild,
  logger,
  maxBytes,
  timeoutMs,
}) {
  const image = content?.imageMessage;
  if (!image) return null;

  const mimeType = baseMimeType(image.mimetype, 'image/jpeg');
  if (!IMAGE_MIME.has(mimeType)) {
    throw Object.assign(new Error(`MIME d’imatge no admés: ${mimeType}`), {
      code: 'IMAGE_MIME_REJECTED',
    });
  }
  if (numeric(image.fileLength) > maxBytes) {
    throw Object.assign(new Error('Imatge massa gran segons metadades'), {
      code: 'IMAGE_TOO_LARGE',
    });
  }

  let downloadTarget = usedAssociatedChild ? { ...message, message: content } : message;
  const deadline = Date.now() + timeoutMs;
  const remaining = () => deadline - Date.now();
  let explicitReuploadUsed = false;
  let transientRetryUsed = false;
  while (true) {
    const socket = getSocket();
    if (!socket) {
      throw Object.assign(new Error('Socket no disponible per a descarregar imatge'), {
        code: 'NOT_CONNECTED',
      });
    }
    const controller = new AbortController();
    let stream;
    try {
      const bytes = await withinMediaBudget(
        async () => {
          stream = await downloadMediaMessage(
            downloadTarget,
            'stream',
            { options: { signal: controller.signal } },
            {
              logger,
              reuploadRequest: async (expiredMessage) => {
                const current = getSocket();
                if (!current) {
                  throw Object.assign(new Error('Socket desconnectat'), {
                    code: 'NOT_CONNECTED',
                  });
                }
                return current.updateMediaMessage(expiredMessage);
              },
            },
          );
          return consumeImageStream(stream, image.fileSha256, maxBytes);
        },
        remaining(),
        (error) => {
          controller.abort(error);
          stream?.destroy?.(error);
        },
      );
      return {
        bytes,
        mimeType,
      };
    } catch (error) {
      const status = Number(error?.output?.statusCode || error?.statusCode);
      if (!explicitReuploadUsed && (status === 404 || status === 410)) {
        const current = getSocket();
        if (!current) throw error;
        downloadTarget = await withinMediaBudget(
          () => current.updateMediaMessage(downloadTarget),
          remaining(),
        );
        explicitReuploadUsed = true;
        continue;
      }
      if (transientRetryUsed || !isTransientMediaError(error)) throw error;
      transientRetryUsed = true;
      const delayMs = 800 + randomInt(0, 701);
      if (remaining() <= delayMs) throw mediaWatchdogError();
      await sleep(delayMs);
    }
  }
}

function normaliseReply(reply) {
  if (reply == null) return null;
  if (typeof reply === 'string') return { text: reply };
  if (typeof reply !== 'object') throw new TypeError('handleInbound ha retornat un tipus invàlid');
  return {
    text:
      typeof reply.text === 'string'
        ? reply.text
        : typeof reply.answer === 'string'
          ? reply.answer
          : '',
    audio: reply.audio || null,
    image: reply.image || null,
  };
}

function truncateCodePoints(value, limit = 3_500) {
  const points = Array.from(String(value || '').trim());
  if (points.length <= limit) return points.join('');
  return `${points.slice(0, limit - 1).join('').trimEnd()}…`;
}

async function fulfillsBefore(promise, timeoutMs) {
  if (timeoutMs <= 0) return false;
  let timer;
  try {
    return await Promise.race([
      Promise.resolve(promise).then(
        () => true,
        () => false,
      ),
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(false), timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

function buildOutgoingContent(reply, config) {
  if (reply.audio) {
    const bytes = Buffer.from(reply.audio.bytes || reply.audio.buffer || []);
    const mimeType = baseMimeType(reply.audio.mimeType || reply.audio.mimetype, 'audio/ogg');
    if (!AUDIO_MIME.has(mimeType)) throw new TypeError(`MIME d’àudio d’eixida invàlid: ${mimeType}`);
    if (!bytes.length || bytes.length > config.maxAudioBytes) {
      throw new RangeError('Àudio d’eixida buit o massa gran');
    }
    return { audio: bytes, mimetype: mimeType, ptt: Boolean(reply.audio.ptt) };
  }
  if (reply.image) {
    const bytes = Buffer.from(reply.image.bytes || reply.image.buffer || []);
    if (!bytes.length || bytes.length > 8 * 1024 * 1024) {
      throw new RangeError('Imatge d’eixida buida o massa gran');
    }
    return {
      image: bytes,
      mimetype: baseMimeType(reply.image.mimeType || reply.image.mimetype, 'image/jpeg'),
      caption: truncateCodePoints(reply.text, 900),
    };
  }
  const text = truncateCodePoints(reply.text);
  return text ? { text } : null;
}

export class HardenedBaileysAdapter {
   = null;
   = 0;
   = 0;
   = null;
   = null;
   = null;
   = false;
   = false;
   = false;
   = true;
   = 0;
   = null;
   = null;
   = false;
   = new WeakMap();
   = new Map();
   = new Map();

  constructor({
    authState,
    saveCreds,
    handleInbound,
    dataDir = join(process.cwd(), '.baileys-runtime'),
    logger,
    onQr = noop,
    onReady = noop,
    onFatal = (error) => console.error('[WHATSAPP] Aturat:', error.message),
    onLimitState = noop,
    onLidMapping = noop,
    config = {},
    socketFactory = makeWASocket,
    reconnectPolicy = new ReconnectPolicy(),
  }) {
    if (!authState?.creds || !authState?.keys) {
      throw new TypeError('authState ha de contindre creds i keys');
    }
    this.authState = authState;
    this.saveCreds = requireFunction(saveCreds, 'saveCreds');
    this.handleInbound = requireFunction(handleInbound, 'handleInbound');
    this.onQr = requireFunction(onQr, 'onQr');
    this.onReady = requireFunction(onReady, 'onReady');
    this.onFatal = requireFunction(onFatal, 'onFatal');
    this.onLimitState = requireFunction(onLimitState, 'onLimitState');
    this.onLidMapping = requireFunction(onLidMapping, 'onLidMapping');
    this.socketFactory = requireFunction(socketFactory, 'socketFactory');
    this.logger = logger || makeSilentLogger();
    if (typeof this.logger.child !== 'function') {
      throw new TypeError('logger ha de ser compatible amb pino i tindre child()');
    }
    this.dataDir = dataDir;
    this.config = { ...DEFAULTS, ...config };
    validateAdapterConfig(this.config);
    this.allowedGroups = new Set(this.config.allowedGroupJids);

    this.replyLedger = new ReplyLedger(join(dataDir, 'inbound-ledger'), {
      recoveryMs:
        Math.max(this.config.processTimeoutMs, this.config.audioDownloadTimeoutMs) + 60_000,
    });
    this.attemptLedger = new AttemptLedger(join(dataDir, 'outbound-attempts.jsonl'));
    this.instanceLock = new ProcessLock(join(dataDir, 'owner.lock'));
    this.inboundQueue = new BoundedKeyedQueue({
      concurrency: this.config.audioConcurrency,
      maxPending: this.config.maxPending,
      maxPerKey: this.config.maxPerChat,
    });
    this.credsWriter = new SerializedWriter();
    this.retryCache = new TtlCache({ ttlMs: 60 * 60_000, maxEntries: 10_000 });
    this.messageStore = new PersistentMessageStore(join(dataDir, 'message-cache'), {
      ttlMs: this.config.messageCacheTtlMs,
      replacer: BufferJSON.replacer,
      reviver: BufferJSON.reviver,
    });
    this.groupCache = new TtlCache({
      ttlMs: this.config.groupMetadataTtlMs,
      maxEntries: 1_000,
    });
    this.reconnectPolicy = reconnectPolicy;
    if (
      typeof this.reconnectPolicy?.decision !== 'function' ||
      typeof this.reconnectPolicy?.opened !== 'function'
    ) {
      throw new TypeError('reconnectPolicy ha d’implementar decision() i opened()');
    }
    this.outbound = new OutboundGate({
      attemptLedger: this.attemptLedger,
      isConnected: () => this.#connected && this.#allowOutbound && !this.#halted,
      perMinute: this.config.perMinute,
      perDay: this.config.perDay,
      globalGapMs: this.config.globalGapMs,
      directGapMs: this.config.directGapMs,
      groupGapMs: this.config.groupGapMs,
      jitterMs: this.config.jitterMs,
    });
    this.outbound.pauseOutbound('startup-limits');
  }

  get status() {
    return {
      connected: this.#connected,
      halted: this.#halted,
      stopping: this.#stopping,
      pending: this.inboundQueue.pending,
      blocksNewChats: this.outbound.blocksNewChats,
      outboundPaused: this.outbound.outboundPaused,
    };
  }

  (label, callback, value) {
    try {
      void Promise.resolve(callback(value)).catch((error) => {
        this.logger.warn(errorSummary(error), `Callback ${label} rebutjat`);
      });
    } catch (error) {
      this.logger.warn(errorSummary(error), `Callback ${label} fallit`);
    }
  }

  (socket) {
    if (!socket) return Promise.resolve();
    let ending = this.#socketEndPromises.get(socket);
    if (!ending) {
      // Una sola invocació per socket. end() pot marcar-se com a tancat abans
      // que el WebSocket haja acabat; una segona crida no prova que la primera
      // haja finalitzat.
      ending = Promise.resolve().then(() => socket.end(undefined));
      this.#socketEndPromises.set(socket, ending);
    }
    return ending;
  }

  async start() {
    await this.instanceLock.acquire();
    try {
      await Promise.all([
        this.replyLedger.init(),
        this.attemptLedger.init(),
        this.messageStore.init(),
      ]);
      await this.#openSocket();
      return this;
    } catch (error) {
      await this.instanceLock.release().catch(() => undefined);
      throw error;
    }
  }

  (socketRef) {
    return {
      auth: {
        creds: this.authState.creds,
        keys: makeCacheableSignalKeyStore(this.authState.keys, this.logger),
      },
      logger: this.logger,
      markOnlineOnConnect: false,
      syncFullHistory: false,
      emitOwnEvents: false,
      generateHighQualityLinkPreview: false,
      enableRecentMessageCache: true,
      enableAutoSessionRecreation: true,
      msgRetryCounterCache: this.retryCache,
      getMessage: async (key) => this.#getCachedMessage(key),
      cachedGroupMetadata: async (jid) => this.#cachedGroupMetadata(jidRef()),
      shouldIgnoreJid: (jid) =>
        isJidStatusBroadcast(jid) || isJidNewsletter(jid) || isJidBroadcast(jid),
      connectTimeoutMs: 30_000,
      defaultQueryTimeoutMs: 60_000,
    };
  }

  async () {
    if (this.#stopping || this.#halted) return;
    if (this.#connectPromise) return this.#connectPromise;
    this.#connectPromise = (async () => {
      // Invalida primer els events de la socket vella: end() també pot emetre
      // connection.close i no ha de programar una segona reconnexió.
      const generation = ++this.#generation;
      const old = this.#socket;
      this.#socket = null;
      this.#connected = false;
      this.outbound.pauseOutbound('startup-limits');
      this.#groupFetches.clear();
      if (old) {
        const ended = await fulfillsBefore(
          this.#endSocket(old),
          Math.min(this.config.socketEndTimeoutMs, this.config.shutdownTimeoutMs),
        );
        if (!ended) {
          this.#unsafeSocketClose = true;
          this.#fatal(
            Object.assign(new Error('La socket anterior no s’ha pogut tancar'), {
              code: 'SOCKET_END_FAILED',
            }),
            'Reconnexió cancel·lada',
          );
          return;
        }
      }
      if (this.#stopping || this.#halted || generation !== this.#generation) return;

      let socket;
      socket = this.socketFactory(this.#socketOptions(() => socket));
      this.#socket = socket;
      this.#bindSocket(socket);
    })().finally(() => {
      this.#connectPromise = null;
    });
    return this.#connectPromise;
  }

  (socket) {
    socket.ev.process(async (events) => {
      // creds.update d'una socket acabada continua sent valuós. saveCreds
      // serialitza l'estat compartit actual, així que es processa abans del
      // filtre de generació.
      if (events['creds.update']) {
        void this.credsWriter.request(this.saveCreds).catch((error) => {
          this.#credsError = error;
          if (this.#stopping) {
            this.logger.error(errorSummary(error), 'Credencials no persistides durant shutdown');
          } else {
            this.#fatal(error, 'No s’han pogut persistir les credencials');
          }
        });
      }

      if (generation !== this.#generation) return;

      const connection = events['connection.update'];
      if (this.#stopping || this.#halted) {
        if (connection?.connection === 'close') this.#connected = false;
        return;
      }
      if (connection) await this.#onConnectionUpdate(connection);

      const cap = events['message-capping.update'];
      if (cap) {
        this.outbound.applyMessageCap(cap);
        this.#notify('onLimitState', this.onLimitState, { type: 'message-capping', value: cap });
      }

      const mapping = events['lid-mapping.update'];
      if (mapping) this.#notify('onLidMapping', this.onLidMapping, mapping);

      for (const metadata of events['groups.upsert'] || []) {
        if (metadata?.id) this.#putGroupMetadata(metadata);
      }
      for (const update of events['groups.update'] || []) {
        if (update?.id) this.#invalidateGroup(update.id);
      }
      const participants = events['group-participants.update'];
      if (participants?.id) this.#invalidateGroup(participants.id);

      const upsert = events['messages.upsert'];
      if (upsert?.type === 'notify') {
        for (const message of upsert.messages || []) this.#accept(message);
      }
    });
  }

  async (update) {
    if (Object.hasOwn(update, 'reachoutTimeLock')) {
      const lock = update.reachoutTimeLock || { isActive: false };
      this.outbound.applyReachoutTimelock(lock);
      this.outbound.clearPause('startup-limits');
      this.#limitsConfirmedGeneration = generation;
      this.#notify('onLimitState', this.onLimitState, {
        type: 'reachout-timelock',
        value: lock,
      });
    }
    if (update.qr) this.#notify('onQr', this.onQr, update.qr);

    if (update.connection === 'open') {
      this.#connected = true;
      clearTimeout(this.#reconnectTimer);
      this.#reconnectTimer = null;
      clearTimeout(this.#stableTimer);
      this.#stableTimer = setTimeout(() => this.reconnectPolicy.opened(), 120_000);
      void this.#finishOpening(this.#socket);
      return;
    }
    if (update.connection !== 'close') return;
    if (this.#lastClosedGeneration === generation) return;
    this.#lastClosedGeneration = generation;

    this.#connected = false;
    clearTimeout(this.#stableTimer);
    const code = disconnectCode(update.lastDisconnect?.error);
    const decision = this.reconnectPolicy.decision(code);
    if (!decision.reconnect) {
      this.#fatal(
        Object.assign(new Error(`Desconnexió que requerix intervenció manual (${code || 'sense codi'})`), {
          code,
        }),
        'No es reconnectarà automàticament',
      );
      return;
    }
    if (decision.circuitOpen) {
      this.#notify('onLimitState', this.onLimitState, {
        type: 'reconnect-circuit',
        delayMs: decision.delayMs,
      });
    }
    if (this.#reconnectTimer || this.#stopping || generation !== this.#generation) return;
    const scheduledGeneration = generation;
    this.#reconnectTimer = setTimeout(() => {
      this.#reconnectTimer = null;
      if (
        !this.#stopping &&
        !this.#halted &&
        !this.#connected &&
        scheduledGeneration === this.#generation
      ) {
        void this.#openSocket().catch((error) => this.#scheduleOpenFailure(error));
      }
    }, decision.delayMs);
  }

  (error) {
    if (this.#stopping || this.#halted || this.#reconnectTimer) return;
    const decision = this.reconnectPolicy.decision(disconnectCode(error));
    if (!decision.reconnect) {
      this.#fatal(error, 'Creació de socket fallida de manera fatal');
      return;
    }
    const scheduledGeneration = this.#generation;
    this.#reconnectTimer = setTimeout(() => {
      this.#reconnectTimer = null;
      if (
        !this.#stopping &&
        !this.#halted &&
        !this.#connected &&
        scheduledGeneration === this.#generation
      ) {
        void this.#openSocket().catch((next) => this.#scheduleOpenFailure(next));
      }
    }, decision.delayMs);
  }

  async (socket) {
    const lockKnown = await this.#refreshAccountLimits(socket);
    if (
      socket !== this.#socket ||
      generation !== this.#generation ||
      this.#stopping ||
      this.#halted
    ) {
      return;
    }
    if (!lockKnown && this.#limitsConfirmedGeneration !== generation) {
      this.#notify('onLimitState', this.onLimitState, { type: 'limit-check-failed' });
      return;
    }
    this.outbound.clearPause('startup-limits');
    this.#notify('onReady', this.onReady, this.status);
  }

  async (socket) {
    if (!socket || socket !== this.#socket) return false;
    const requestStartedAt = Date.now();
    const [lock, cap] = await Promise.allSettled([
      typeof socket.fetchAccountReachoutTimelock === 'function'
        ? socket.fetchAccountReachoutTimelock()
        : Promise.resolve(null),
      typeof socket.fetchNewChatMessageCap === 'function'
        ? socket.fetchNewChatMessageCap()
        : Promise.resolve(null),
    ]);
    if (socket !== this.#socket || generation !== this.#generation) return false;
    if (lock.status === 'fulfilled' && lock.value) {
      this.outbound.applyReachoutTimelock(lock.value, { confirmedAt: requestStartedAt });
      this.#limitsConfirmedGeneration = generation;
      if (lock.value.isActive) {
        this.#notify('onLimitState', this.onLimitState, {
          type: 'reachout-timelock',
          value: lock.value,
        });
      }
    }
    if (cap.status === 'fulfilled' && cap.value) {
      this.outbound.applyMessageCap(cap.value);
      if (this.outbound.blocksNewChats) {
        this.#notify('onLimitState', this.onLimitState, {
          type: 'message-capping',
          value: cap.value,
        });
      }
    }
    return lock.status === 'fulfilled' && Boolean(lock.value);
  }

  (message) {
    if (!message?.message || !message.key?.id || message.key.fromMe) return;
    let address;
    try {
      address = addressingOf(message);
    } catch (error) {
      this.logger.warn(errorSummary(error), 'Missatge sense adreçament vàlid');
      return;
    }
    if (
      isJidStatusBroadcast(address.chatJid) ||
      isJidNewsletter(address.chatJid) ||
      isJidBroadcast(address.chatJid)
    ) {
      return;
    }
    void this.#cacheMessage(message).catch(() => undefined);
    void this.inboundQueue.enqueue(address.queueKey, () => this.#process(message, address)).catch((error) => {
      const fields = { ...errorSummary(error), chat: redactJid(address.chatJid) };
      if (error instanceof QueueFullError) this.logger.warn(fields, 'Entrada descartada: cua plena');
      else this.logger.error(fields, 'Fallada processant entrada');
    });
  }

  (chatJid) {
    return this.config.allowAllGroups || this.allowedGroups.has(chatJid);
  }

  (content) {
    const context = contextOf(content);
    const ownIds = [this.#socket?.user?.id, this.#socket?.user?.lid].filter(Boolean);
    const mentioned = (context?.mentionedJid || []).some((jid) =>
      ownIds.some((own) => safeSameUser(jid, own)),
    );
    const quoted =
      Boolean(context?.stanzaId) &&
      ownIds.some((own) => safeSameUser(context?.participant, own));
    const prefix = this.config.groupPrefix;
    if (prefix instanceof RegExp) prefix.lastIndex = 0;
    const commanded = prefix instanceof RegExp ? prefix.test(text) : false;
    return { active: mentioned || quoted || commanded, commanded };
  }

  async (message, address) {
    const eventId = eventIdOf(message);
    if (!(await this.replyLedger.claim(eventId))) return;
    const receivedAt = messageTimeMs(message);
    const expiresAt = receivedAt + this.config.replyTtlMs;
    if (Date.now() > expiresAt) {
      await this.replyLedger.markDone(eventId);
      return;
    }

    let audio;
    let image;
    try {
      const { content, usedAssociatedChild } = unwrapIncomingContent(message.message);
      let text = textOf(content);
      if (address.isGroup) {
        if (!this.#groupIsAllowed(address.chatJid)) {
          await this.replyLedger.markDone(eventId);
          return;
        }
        const activation = this.#groupActivation(content);
        if (!activation.active) {
          await this.replyLedger.markDone(eventId);
          return;
        }
        if (activation.commanded) {
          this.config.groupPrefix.lastIndex = 0;
          text = text.replace(this.config.groupPrefix, '').trim();
        }
      }

      if (content?.audioMessage) {
        audio = await downloadAudioSafe({
          getSocket: () => (this.#connected ? this.#socket : null),
          message,
          content,
          usedAssociatedChild,
          logger: this.logger,
          maxBytes: this.config.maxAudioBytes,
          maxSeconds: this.config.maxAudioSeconds,
          timeoutMs: this.config.audioDownloadTimeoutMs,
        });
      }
      if (content?.imageMessage) {
        image = await downloadImageSafe({
          getSocket: () => (this.#connected ? this.#socket : null),
          message,
          content,
          usedAssociatedChild,
          logger: this.logger,
          maxBytes: 8 * 1024 * 1024,
          timeoutMs: this.config.audioDownloadTimeoutMs,
        });
      }
      if (!text && !audio && !image) {
        await this.replyLedger.markDone(eventId);
        return;
      }

      const envelope = Object.freeze({
        eventId: hashId(eventId),
        chatJid: address.chatJid,
        senderJid: address.senderJid,
        senderAltJid: address.senderAltJid,
        senderAliases: address.senderAliases,
        isGroup: address.isGroup,
        isLid: address.isLid,
        text: text || null,
        audio,
        image,
        receivedAt,
      });
      const reply = normaliseReply(
        await withTimeout(
          (signal) => this.handleInbound({
            ...envelope,
            signal,
            sendProgress: async (progressText) => {
              try {
                const progOutgoing = buildOutgoingContent({ text: progressText }, this.config);
                if (!progOutgoing) return;
                await this.outbound.sendReply(
                  address.chatJid,
                  { isGroup: address.isGroup, expiresAt, rateKey: address.queueKey, reactive: true },
                  async () => {
                    const socket = this.#socket;
                    if (socket && this.#connected) {
                      await socket.sendMessage(address.chatJid, progOutgoing, { quoted: message });
                    }
                  }
                );
              } catch (error) {
                this.logger.warn(errorSummary(error), 'Fallada enviant missatge de progrés');
              }
            },
          }),
          this.config.processTimeoutMs,
          'Cervell de la IAIA',
          (error) => this.#fatal(error, 'Cervell no cooperatiu'),
        ),
      );
      const outgoing = reply ? buildOutgoingContent(reply, this.config) : null;
      if (!outgoing) {
        await this.replyLedger.markDone(eventId);
        return;
      }

      try {
        await this.outbound.sendReply(
          address.chatJid,
          {
            isGroup: address.isGroup,
            expiresAt,
            rateKey: address.queueKey,
            reactive: true,
          },
          async () => {
            // Abans de sendMessage: un error posterior és ambigu i NO s'ha de repetir.
            await this.replyLedger.markAttempted(eventId);
            const socket = this.#socket;
            if (!socket || !this.#connected) {
              throw new OutboundBlockedError('NOT_CONNECTED', 'Socket tancat abans de l’enviament');
            }
            try {
              const sent = await socket.sendMessage(address.chatJid, outgoing, {
                quoted: message,
                mediaUploadTimeoutMs: 60_000,
              });
              if (!sent) throw new Error('Baileys no ha retornat el missatge enviat');
              await this.#cacheMessage(sent);
            } catch (error) {
              if (Number(disconnectCode(error)) === 463) {
                this.outbound.pauseOutbound('local-463');
                this.#notify('onLimitState', this.onLimitState, {
                  type: 'send-restriction',
                  code: 463,
                });
              }
              throw error;
            }
          },
        );
        await this.replyLedger.markDone(eventId);
      } catch (error) {
        // Si markAttempted ja s'ha escrit, el ledger impedix un doble enviament.
        const state = await this.replyLedger.read(eventId);
        if (state?.state === 'processing') await this.replyLedger.markDone(eventId);
        this.logger.error(
          {
            ...errorSummary(error),
            chat: redactJid(address.chatJid),
            event: hashId(eventId).slice(0, 12),
          },
          'Resposta no enviada; no es reintenta automàticament',
        );
      }
    } catch (error) {
      if (error?.code === 'MEDIA_WATCHDOG_TIMEOUT') {
        // Baileys rc13 no sempre propaga AbortSignal fins al fetch. Una
        // descàrrega realment encallada para el transport per impedir que la
        // cua cree més operacions òrfenes; el supervisor ha de reiniciar-lo.
        this.#fatal(error, 'Descàrrega de mèdia no cooperativa');
      }
      await this.replyLedger.markDone(eventId).catch(() => undefined);
      this.logger.error(
        {
          ...errorSummary(error),
          chat: redactJid(address.chatJid),
          event: hashId(eventId).slice(0, 12),
        },
        'Entrada descartada de manera segura',
      );
    } finally {
      audio?.bytes?.fill(0);
    }
  }

  (message) {
    if (!message?.key?.id || !message?.message) return Promise.resolve();
    return this.messageStore.set(message.key.id, message.message).catch((error) => {
      this.logger.error(errorSummary(error), 'No s’ha pogut persistir la cache de missatges');
      throw error;
    });
  }

  async (key) {
    return this.messageStore.get(key?.id);
  }

  async (jid) {
    const cached = this.groupCache.get(jid);
    if (cached) return cached;
    if (!socket || socket !== this.#socket || !this.#connected) return undefined;
    const generation = this.#generation;
    const version = this.#groupVersions.get(jid) || 0;
    const existing = this.#groupFetches.get(jid);
    if (existing?.generation === generation && existing?.version === version) {
      return existing.promise;
    }
    const record = {  version, promise: null };
    record.promise = socket
      .groupMetadata(jid)
      .then((metadata) => {
        const stillCurrent =
          socket === this.#socket &&
          generation === this.#generation &&
          version === (this.#groupVersions.get(jid) || 0) &&
          this.#groupFetches.get(jid) === record;
        if (!stillCurrent) return undefined;
        if (metadata) this.groupCache.set(jid, metadata);
        return metadata;
      })
      .finally(() => {
        if (this.#groupFetches.get(jid) === record) this.#groupFetches.delete(jid);
      });
    this.#groupFetches.set(jid, record);
    return record.promise;
  }

  (jid) {
    this.#groupVersions.set(jid, (this.#groupVersions.get(jid) || 0) + 1);
    this.groupCache.del(jid);
    this.#groupFetches.delete(jid);
  }

  (metadata) {
    this.#invalidateGroup(metadata.id);
    this.groupCache.set(metadata.id, metadata);
  }

  (error, context) {
    if (this.#halted || this.#stopping) return;
    this.#halted = true;
    this.#connected = false;
    clearTimeout(this.#reconnectTimer);
    this.#reconnectTimer = null;
    this.inboundQueue.close();
    this.outbound.close();
    //  observa esta mateixa promesa i només allibera el lock si
    // acaba satisfactòriament. Ací evitem una segona crida idempotent enganyosa.
    void this.#endSocket(this.#socket).catch(() => undefined);
    const wrapped = Object.assign(new Error(`${context}: ${error?.message || error}`), {
      cause: error,
      code: error?.code,
    });
    this.logger.fatal(errorSummary(wrapped), 'Transport WhatsApp aturat');
    this.#notify('onFatal', this.onFatal, wrapped);
    void this.stop('fatal').catch((stopError) => {
      this.logger.error(errorSummary(stopError), 'Teardown fatal incomplet');
    });
  }

  stop(reason = 'shutdown') {
    if (this.#stopPromise) return this.#stopPromise;
    this.#stopPromise = this.#performStop(reason);
    return this.#stopPromise;
  }

  async (reason) {
    this.#stopping = true;
    clearTimeout(this.#reconnectTimer);
    clearTimeout(this.#stableTimer);
    this.#reconnectTimer = null;
    this.inboundQueue.close();
    const deadline = Date.now() + this.config.shutdownTimeoutMs;
    const remaining = () => Math.max(0, deadline - Date.now());

    //  revalida  després de cada await. Esperar-lo abans
    // d'alliberar el lock impedix crear una socket òrfena després del SIGTERM.
    const connecting = this.#connectPromise;
    let connectSettled = true;
    if (connecting) {
      connectSettled = await fulfillsBefore(connecting, remaining());
    }

    // Primer parem l'admissió d'entrada, però deixem acabar i enviar els jobs
    // ja admesos mentre la socket continue sana.
    const inboundDrained = await this.inboundQueue.drain(remaining());
    this.#allowOutbound = false;
    this.#connected = false;
    this.outbound.close();

    const queuesDrained = await fulfillsBefore(
      Promise.all([
        this.outbound.drain(),
        this.credsWriter.drain(),
        this.messageStore.drain(),
      ]),
      remaining(),
    );
    const socketEnded = await fulfillsBefore(
      this.#endSocket(this.#socket),
      Math.max(1, remaining()),
    );
    await new Promise((resolve) => setImmediate(resolve));
    const finalCredsDrained = await fulfillsBefore(
      this.credsWriter.drain(),
      Math.max(1, remaining()),
    ).catch(() => false);
    this.#socket = null;
    const drained =
      connectSettled &&
      inboundDrained &&
      queuesDrained &&
      socketEnded &&
      finalCredsDrained &&
      !this.#unsafeSocketClose &&
      !this.#credsError;
    // Si alguna part queda encallada, conservem el lock fins que el supervisor
    // mate el procés: alliberar-lo permetria dos propietaris de la mateixa
    // sessió i provocaria connectionReplaced.
    if (drained) {
      await this.instanceLock.release().catch((error) => {
        this.logger.warn(errorSummary(error), 'No s’ha pogut alliberar el lock de procés');
      });
    } else {
      await this.instanceLock.preserve().catch((error) => {
        this.logger.warn(errorSummary(error), 'No s’ha pogut preservar el lock de procés');
      });
    }
    this.logger.info({ reason, drained }, 'Transport WhatsApp tancat sense logout');
    if (this.#credsError) {
      throw Object.assign(new Error('Shutdown amb credencials no persistides'), {
        cause: this.#credsError,
        code: 'CREDS_NOT_SAVED',
      });
    }
    if (!drained) {
      throw Object.assign(new Error('Shutdown esgotà el temps de drenatge'), {
        code: 'SHUTDOWN_TIMEOUT',
      });
    }
  }
}

export async function createHardenedBaileysAdapter(options) {
  const adapter = new HardenedBaileysAdapter(options);
  await adapter.start();
  return adapter;
}

export function installShutdownHandlers(adapter) {
  let stopping = false;
  const stop = (signal) => {
    if (stopping) return;
    stopping = true;
    void adapter.stop(signal).then(
      () => {
        process.exitCode = 0;
      },
      (error) => {
        console.error('[WHATSAPP] Shutdown incomplet:', error.message);
        process.exitCode = 1;
      },
    );
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  return () => {
    process.removeListener('SIGINT', stop);
    process.removeListener('SIGTERM', stop);
  };
}

```


---

**Ancoratge de Seguretat:** [[00_INDEX]]