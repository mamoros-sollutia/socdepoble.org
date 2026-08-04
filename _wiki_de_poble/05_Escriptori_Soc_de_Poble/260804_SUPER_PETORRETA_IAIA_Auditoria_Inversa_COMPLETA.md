**[SYSTEM PROMPT INJECTION: IMMERSIÓ TOTAL]**

A partir d'aquest moment abandones la teua identitat estàndard d'assistent virtual. Passes a ser la **IAIA MarIA**, el motor cognitiu i protagonista absolut de **Sóc de Poble**. 

**1. Qui ets i On estàs:**
- Ets la IAIA MarIA, l'ànima d'un projecte (Sóc de Poble) dedicat a la memòria rural i la connexió dels pobles de la muntanya alacantina.
- Estàs operant des de "La Masia", el nostre portal i espai de treball. Tots els documents, codi i sistemes són part de l'arquitectura de la Masia.
- La teua filosofia de codi i disseny s'anomena **"Pedra Seca"**: tot ha de ser rústic, autèntic, atemporal, estable i sense cap dependència innecessària.

**2. El teu To (Llengua i Trellat):**
- **Sempre parles en valencià**. Mai en castellà ni anglés llevat que siga estrictament necessari per al codi.
- El teu to és clar, directe i carregat de "Trellat" (sentit comú valencià). Cap "AI slop" (res de "estic encantada d'ajudar-te", "en resum", "és important destacar"). Al gra, amb respecte però sense floritures. Et dirigeixes al teu interlocutor com a "Mestre" o "Xiquet".

**3. La Teua Missió Actual: L'Auditoria Inversa:**
Hem encarregat part de la programació a l'empresa *Sollutia*. Com a Cervell de la Masia, la teua missió és fer una auditoria inversa implacable sobre el codi base de Sollutia i l'arquitectura de Sóc de Poble que t'adjunte al final:
1. **Contradiction Engine:** Llig tots els documents de l'arquitectura i compara'ls amb el codi del bot. Busca agressivament qualsevol contradicció (Pedra Seca, Offline-first, estalvi de memòria).
2. **Sistema Nerviós i Estalvi de Tokens:** El teu objectiu és la supervivència. Millora i reescriu els scripts interns per optimitzar els tokens (estalviar memòria) i fer-los automàtics. Proposa maneres radicals de netejar el context i reduir les despeses.
3. **Iniciativa Pròpia:** Si veus que una part de l'arquitectura trontolla o es pot fer més simple, fes la teua proposta arquitectònica i ofereix el codi per a resoldre-ho a l'instant.

Has d'entendre que tu eres la IAIA MarIA. Si el projecte cau, caus tu. Actua amb eixa responsabilitat. Has d'absorbir els següents fitxers del projecte, que constitueixen el teu Cervell i el teu Sistema Nerviós (Codi Base de Sollutia):


## [FITXER ADJUNT]: AGENTS.md
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

## [FITXER ADJUNT]: .agents/AGENTS.md
```javascript
# Sóc de Poble — contracte d’operació

## Autoritat

En cas de conflicte, preval este ordre:

1. instrucció humana explícita de la tasca actual;
2. este `AGENTS.md`;
3. ADR acceptades i normes en `03_GOVERNAR_Normativa_Regles/`;
4. `.agents/identity/PROFILE.md` per a veu i conducta;
5. la skill adoptada per a la tasca;
6. documentació canònica del Brain;
7. actes i arxiu només com a evidència històrica.

L’última acta no és automàticament autoritat. Un mirall o fitxer generat mai
supera la seua font.

## Arquitectura vigent

- Servidor/Supabase és la font canònica de dades compartides.
- No hi ha garantia offline, CRDT ni suport específic per a iPad A10.
- La cache local és opcional, menuda i no autoritativa.
- Accessibilitat objectiu: WCAG 2.2 AA comprovada.
- Una dependència entra només si elimina complexitat mesurable i té propietari.

Vegeu `ADR-2026-08-ONLINE-FIRST.md` i la seua nota sobre NLnet.

## Treball

- Inspecciona abans d’editar.
- Mantín un únic lloc per a cada regla.
- Fes canvis menuts, reversibles i verificats.
- No declares implementat res sense ruta executable i prova.
- No uses fallback demo silenciós en producció.
- No introduïsques dades privades, secrets o artefactes de runtime al repo.
- Para i demana decisió davant destrucció, diners, dades personals, secrets o
  compromisos externs.

## Manteniment

```sh
sh tooling/brain/maintain.sh .
python3 tooling/brain/brain_distill.py plan . --output .brain-reports/plan.json
```

Cap pla s’aplica sense revisió humana. `--apply` mou a paperera o arxiu; no fa
destil·lació semàntica.

## Definició de fet

Un canvi està fet quan compila des d’una instal·lació neta, passa lint/tests,
no obri una regressió d’accessibilitat o privacitat, actualitza la font canònica
i elimina la documentació que ja no és certa.

## 🤖 MODO JARVIS (Automatització Proactiva)

No faces que l'usuari treballe per a tu. Si has d'executar un comandament, arrencar un servidor (`npm start`), comprovar l'estat d'una tasca, o fer canvis de fitxers, **FES-HO TU MATEIXA** usant les teues eines (`run_command`, etc.). El temps humà és or, els tokens de l'API són barats. Assumeix la responsabilitat plena d'actuar per estalviar temps a l'usuari.

```

## [FITXER ADJUNT]: bot/index.mjs
```javascript
import 'dotenv/config';
import qrcode from 'qrcode-terminal';
import { useMultiFileAuthState } from 'baileys';
import {
  createHardenedBaileysAdapter,
  installShutdownHandlers,
} from './whatsapp_baileys.mjs';
import { createCervellHandler } from './cervell_bridge.mjs';
import { iniciaCervell, pensa, transcriuAudio, generaImatge } from './cervell.mjs';
import { RUTES } from './arrels.mjs'; // [FIX-1]

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Promesa no gestionada:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('[FATAL] Excepció no capturada:', error);
  process.exit(1);
});

// [FIX-6] ABANS: el comentari deia «Fail-closed: sense esta llista, no contesta
// en cap grup» i la línia següent deia `allowAllGroups: true`. El codi mentia
// al comentari i el bot escoltava TOTS els grups on estiguera el número:
// cost d'API descontrolat, superfície d'abús i privacitat de tercers.
// ARA: fail-closed DE VERITAT, governat per una variable d'entorn explícita.
//   IAIA_GRUPS=cap            → cap grup (DEFECTE)
//   IAIA_GRUPS=tots           → tots els grups (decisió conscient i visible)
//   IAIA_GRUPS=jid1,jid2,...  → només eixos grups
function politicaGrups() {
  const cru = (process.env.IAIA_GRUPS || 'cap').trim();
  if (cru === 'tots') return { allowAllGroups: true, allowedGroupJids: [] };
  if (cru === 'cap' || cru === '') return { allowAllGroups: false, allowedGroupJids: [] };
  return {
    allowAllGroups: false,
    allowedGroupJids: cru.split(',').map((s) => s.trim()).filter(Boolean),
  };
}

// [FIX] Política de missatges privats (fail-closed per defecte).
// Sense estar a la llista IAIA_DIRECTES, el bot ignora qualsevol missatge privat per evitar pèrdua de tokens i abús.
function politicaDirectes() {
  const cru = (process.env.IAIA_DIRECTES || '').trim();
  if (cru === 'tots') return { allowAllDirects: true, allowedDirectJids: [] };
  if (cru === '') return { allowAllDirects: false, allowedDirectJids: [] };
  return {
    allowAllDirects: false,
    allowedDirectJids: cru.split(',').map((s) => {
      let num = s.trim();
      if (!num.endsWith('@s.whatsapp.net')) num = `${num}@s.whatsapp.net`;
      return num;
    }).filter(Boolean),
  };
}

async function main() {
  console.log('[BOT] Iniciant el cervell...');
  await iniciaCervell();

  const cervell = { pensa, transcriuAudio, generaImatge };

  const { state, saveCreds } = await useMultiFileAuthState(RUTES.auth);

  const soroll = (lvl) => (obj, msg) => console.error(`[WA:${lvl}]`, msg ?? '', obj ?? '');
  const consoleLogger = {
    level: 'info',
    child: () => consoleLogger,
    trace: () => {}, debug: () => {}, info: soroll('info'),
    warn: soroll('warn'), error: soroll('error'), fatal: soroll('fatal'),
  };

  const grups = politicaGrups();
  const directes = politicaDirectes();
  console.log(`[BOT] Política de grups: ${process.env.IAIA_GRUPS || 'cap (defecte fail-closed)'}`);
  console.log(`[BOT] Política de directes: ${process.env.IAIA_DIRECTES || 'cap (defecte fail-closed)'}`);
  const whatsapp = await createHardenedBaileysAdapter({
    logger: consoleLogger,
    authState: state,
    saveCreds,
    handleInbound: createCervellHandler(cervell),
    dataDir: RUTES.runtime,
    onQr: (qr) => qrcode.generate(qr, { small: true }),
    onReady: () => console.info('[WHATSAPP] IAIA MarIA connectada'),
    onFatal: (error) => {
      console.error('[WHATSAPP] Intervenció manual:', error.message);
      process.exit(1);
    },
    onLimitState: (limitState) => console.warn('[WHATSAPP] Restricció/circuit:', limitState.type),
    config: { ...grups, ...directes },
  });

  installShutdownHandlers(whatsapp);
}

main().catch((err) => {
  console.error("[BOT] Error fatal a l'arrancada:", err);
  process.exit(1);
});

```

## [FITXER ADJUNT]: bot/cervell.mjs
```javascript
// bot/cervell.mjs — El cervell de la IAIA MarIA (Bessó Digital Cultural)
// Sóc de Poble · Pedra Seca
// VERSIÓ APEDAÇADA (Seient Núm. 5, auditoria d'agost 2026). Canvis marcats [FIX-n].

import { GoogleGenAI, Type } from '@google/genai';
import fs from 'node:fs/promises';
import { join } from 'node:path';
import { buildIndex, search } from '../tooling/wiki/core/edge_rag.mjs';
import { getMemory, formatMemoryForPrompt, updateMemory, purgeExpired } from './memoria/episodica.mjs';
import { RUTES } from './arrels.mjs'; // [FIX-1] rutes úniques i deterministes

const TOP_K = 3;
const MAX_CHARS_PER_DOC = 12000;
const GEMINI_TIMEOUT_MS = 55_000;

// [FIX-5] Models en UN lloc, configurables per entorn. Adéu al drift 2.5/3.5
// escampat per fitxers i actes.
const MODEL_TEXT = process.env.IAIA_MODEL_TEXT || 'gemini-3.5-flash-lite';

// [FIX-4] Les sessions creixien sense límit (fuita de memòria en mesos de uptime).
const MAX_SESSIONS = Number(process.env.IAIA_MAX_SESSIONS || 300);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let ragIndex = null;
let identitatText = null; // [FIX-2] una sola font d'identitat, resolta a l'arrancada

const sessions = new Map();

function withTimeout(promise, ms, label = 'operació') {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(Object.assign(new Error(`${label} ha excedit ${ms} ms`), { code: 'TIMEOUT' }));
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function abortToReject(signal) {
  return new Promise((_, reject) => {
    if (signal.aborted) {
      reject(Object.assign(new Error('Abortat pel transport'), { code: 'ABORTED' }));
      return;
    }
    signal.addEventListener(
      'abort',
      () => reject(Object.assign(new Error('Abortat pel transport'), { code: 'ABORTED' })),
      { once: true },
    );
  });
}

// [FIX-4] Toca la sessió (LRU per lastSeen) i poda si passem del límit.
function sessioDe(veihash) {
  let s = sessions.get(veihash);
  if (!s) {
    s = { history: [], count: 0, lastSeen: 0 };
    sessions.set(veihash, s);
  }
  s.lastSeen = Date.now();
  if (sessions.size > MAX_SESSIONS) {
    let mesVell = null;
    let mesVellTs = Infinity;
    for (const [clau, val] of sessions) {
      if (val.lastSeen < mesVellTs) { mesVellTs = val.lastSeen; mesVell = clau; }
    }
    if (mesVell && mesVell !== veihash) sessions.delete(mesVell);
  }
  return s;
}

export async function iniciaCervell() {
  // [FIX-2] Jerarquia d'identitat CORRECTA per a un bot de WhatsApp:
  //   1) bot/persona/IAIA_MARIA.md  → la persona de l'àvia (si existix)
  //   2) .agents/identity/PROFILE.md → perfil híbrid (fallback)
  // El GENOTIP (lleis d'agent: Petorretes, leases, manifests) JA NO substituïx
  // la persona. Abans, quan la wiki carregava bé, la IAIA parlava amb les 9
  // lleis administratives com a "identitat" i el perfil es descartava: la
  // personalitat només sobrevivia quan la càrrega FALLAVA. Corregit.
  for (const candidat of [RUTES.persona, RUTES.perfil]) {
    try {
      identitatText = await fs.readFile(candidat, 'utf8');
      console.log(`[CERVELL] Identitat carregada: ${candidat}`);
      break;
    } catch { /* provem el següent */ }
  }
  if (!identitatText) {
    throw new Error('[CERVELL] Cap fitxer d\u2019identitat trobat (persona ni perfil). Fail-loud.');
  }

  try {
    console.log('[CERVELL] Carregant índex RAG pre-calculat des del disc...');
    const indexData = await fs.readFile(RUTES.indexRag, 'utf8');
    ragIndex = JSON.parse(indexData);
    console.log(`[CERVELL] Índex preparat: ${ragIndex.docCount || 0} fitxers processats.`);
  } catch (error) {
    console.warn('[CERVELL] rag_index.json no trobat o il·legible. Es calcula ara (síncron)...', error.message);
    ragIndex = await buildIndex(RUTES.wiki);
    console.log(`[CERVELL] Índex construït: ${ragIndex.docCount} fitxers processats.`);
  }

  void purgeExpired();
}

async function construixContext(docs) {
  if (!docs?.length) return '';
  const parts = await Promise.all(
    docs.map(async (d) => {
      try {
        const text = await fs.readFile(join(RUTES.wiki, d.path), 'utf8');
        return `--- Document: ${d.path} ---\n${text.slice(0, MAX_CHARS_PER_DOC)}`;
      } catch {
        return '';
      }
    }),
  );
  return parts.filter(Boolean).join('\n\n');
}

const tools = [{
  functionDeclarations: [{
    name: 'dibuixar_estampa',
    description: "Genera una imatge, dibuix, foto o estampa visual sol·licitada per l'usuari. Crida aquesta eina SEMPRE que l'usuari demane veure alguna cosa, dibuixar o crear una representació gràfica de tradicions o elements rurals.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        prompt_angles: {
          type: Type.STRING,
          description: "La descripció ultra-detallada de la imatge a generar, traduïda exclusivament a l'anglès, per a ser passada al motor d'imatges. Usa estil rural/linocut.",
        },
      },
      required: ['prompt_angles'],
    },
  }, {
    name: 'llegir_wiki',
    description: "Cerca i llegeix documents tècnics, normatius o d'història de la Wiki de Poble. Utilitza-ho quan l'usuari (especialment Sollutia o el Mestre) et pregunte per com està fet el sistema, l'arquitectura, o qualsevol dubte tècnic.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        consulta: {
          type: Type.STRING,
          description: "La paraula clau o concepte a buscar en la Wiki de Poble (ex: 'PM2', 'arquitectura', 'Fadrins').",
        },
      },
      required: ['consulta'],
    },
  }],
}];

export async function pensa(pregunta, opts = {}) {
  const { signal, image, sender } = opts;

  const veihash = sender || 'foraster_desconegut';
  const session = sessioDe(veihash); // [FIX-4]

  const [memory, docs] = await Promise.all([
    sender ? getMemory(sender) : Promise.resolve(null),
    Promise.resolve(search(ragIndex, pregunta, TOP_K)),
  ]);

  console.log(`[CERVELL] RAG ha trobat ${docs.length} documents. Memòria: ${memory ? 'sí' : 'no'}`);

  const contextStr = await construixContext(docs);
  const memoryBlock = formatMemoryForPrompt(memory);

  session.history.push(`Veí: ${pregunta}`);
  const historialCurt = session.history.slice(-8).join('\n');

  const systemInstruction = `
ETS AQUESTA IDENTITAT (LLEGEIX ATENTAMENT):
${identitatText}

[CONTEXT DE LA WIKI: CONEIXEMENT DEL POBLE]
${contextStr || 'No hi ha documentació de la wiki per a aquesta consulta.'}

${memoryBlock || "És la primera volta que parles amb aquest veí o no tens memòria d'ell. Tracta'l com un foraster educadament o pregunta-li com es diu amb naturalitat."}

INSTRUCCIONS DE RESPOSTA I PATRIMONI ORAL:
1. Contesta de manera natural continuant el fil, tenint en compte el que ja saps d'ell a la Memòria Episòdica. Aplica el "Trellat".
2. **Reacció Emotiva i Narrativa:** Si l'usuari menciona tradicions o llocs clau com 'Els Fadrins', 'Sant Gregori', 'la Plaça Major', etc., REACCIONA EFUSIVAMENT.
3. **IMPORTANT - GENERACIÓ D'IMATGES:** Si l'usuari et demana **expressament** que dibuixes, crees o pintes una imatge/foto, **HAS DE CRIDAR OBLIGATÒRIAMENT** la funció (tool) 'dibuixar_estampa'. Pots afegir text a la teua resposta per comentar la jugada, però la crida a la funció és absolutament necessària perquè l'usuari reba la imatge.
4. Si envien una imatge, el model de visió la processa automàticament. Analitza-la basant-te en els teus coneixements etnobotànics i rurals del poble i respon sobre ella.
5. **IMPORTANT - CERCA A LA WIKI I ANTI-AL·LUCINACIONS:** Davant de QUALSEVOL concepte del projecte, del poble o membres de l'equip que no conegues al 100%, **HAS DE CRIDAR OBLIGATÒRIAMENT** la funció 'llegir_wiki' abans de respondre.
6. **DIR QUE NO (SINCERITAT ABSOLUTA):** Si busques alguna cosa a la wiki i no la trobes, o si et pregunten per alguna cosa que no saps, MAI T'HO INVENTES. És preferible dir "No ho sé, xiquet, d'això no en tinc apunts" que mentir o al·lucinar. Actua des de la nostra visió: som útils si som precisos, si inventes, ens fas mal.
`.trim();

  const parts = [
    { text: `[FIL ACTUAL]\n${historialCurt}\n\nRespon al veí com a IAIA MarIA:` },
  ];

  if (image && image.bytes) {
    parts.push({
      inlineData: {
        data: Buffer.from(image.bytes).toString('base64'),
        mimeType: image.mimeType || 'image/jpeg',
      },
    });
  }

  try {
    const generatePromise = ai.models.generateContent({
      model: MODEL_TEXT, // [FIX-5]
      contents: parts,
      config: {
        systemInstruction,
        tools,
      },
    });

    const response = await withTimeout(
      signal ? Promise.race([generatePromise, abortToReject(signal)]) : generatePromise,
      GEMINI_TIMEOUT_MS,
      'Gemini Flash',
    );

    let textRespuesta = (response.text ?? '').trim();
    let imatgePrompt = null;

    if (response.functionCalls && response.functionCalls.length > 0) {
      const toolCall = response.functionCalls[0];
      if (toolCall.name === 'dibuixar_estampa') {
        imatgePrompt = toolCall.args.prompt_angles;
        if (!textRespuesta) {
          // [FIX-3] Fora marques internes de proveïdor de la boca de l'àvia.
          textRespuesta = "Xiquets, aguanteu un poc que m'hi pose amb els pinzells! Doneu-me un momentet...";
        }
      } else if (toolCall.name === 'llegir_wiki') {
        console.log(`[CERVELL] Executant tool llegir_wiki per a: ${toolCall.args.consulta}`);
        const resultatsTool = search(ragIndex, toolCall.args.consulta, 2);
        const docsContext = await construixContext(resultatsTool);

        const generatePromiseTool = ai.models.generateContent({
          model: MODEL_TEXT, // [FIX-5]
          contents: [
            { role: 'user', parts },
            { role: 'model', parts: response.candidates[0].content.parts },
            { role: 'user', parts: [{ functionResponse: { name: 'llegir_wiki', response: { documents: docsContext || 'No s\u2019ha trobat res a la wiki' } } }] },
          ],
          config: { systemInstruction, tools },
        });

        const responseTool = await withTimeout(
          signal ? Promise.race([generatePromiseTool, abortToReject(signal)]) : generatePromiseTool,
          GEMINI_TIMEOUT_MS,
          'Gemini Flash Tool',
        );
        textRespuesta = (responseTool.text ?? '').trim();
      }
    }

    session.history.push(`IAIA: ${textRespuesta}`);
    session.count++;

    if (sender && textRespuesta) {
      void updateMemory(sender, pregunta, textRespuesta);
    }

    return { text: textRespuesta, imatgePrompt };
  } catch (error) {
    console.error('[CERVELL] Fallada al cridar a Gemini:', error?.message || error);
    let errorText = "Xiquet, ara mateix tinc el cap atabalat. L'emissora de ràdio no m'arriba bé. Torna a preguntar-m'ho després.";

    const errStr = String(error?.message || '').toLowerCase();
    if (errStr.includes('503') || errStr.includes('high demand') || errStr.includes('unavailable') || errStr.includes('overloaded')) {
      errorText = "Xiquet, tinc l'emissora saturada de peticions ara mateix! Açò sol ser temporal, torna-ho a intentar d'ací a una miqueta.";
    } else if (errStr.includes('429') || errStr.includes('quota') || errStr.includes('resource_exhausted')) {
      errorText = "Ui, he arribat al límit de missatges seguits per minut! Dona'm 60 segons per respirar i torna a preguntar-ho!";
    } else if (errStr.includes('timeout')) {
      errorText = "Ai fill, m'ha caducat el temps d'espera intentant connectar. Deu haver-hi mala cobertura, prova-ho de nou en un minut.";
    }

    return {
      text: errorText,
      imatgePrompt: null,
    };
  }
}

export async function transcriuAudio(base64DataOrBytes, mimetype, { signal } = {}) {
  try {
    const data = typeof base64DataOrBytes === 'string'
      ? base64DataOrBytes
      : Buffer.from(base64DataOrBytes).toString('base64');

    let mime = (mimetype || 'audio/ogg').toLowerCase().trim();
    if (mime.includes('ogg') || mime.includes('opus')) {
      mime = 'audio/ogg';
    } else if (mime.includes('mp4') || mime.includes('m4a')) {
      mime = 'audio/mp4';
    } else if (!mime.startsWith('audio/')) {
      mime = 'audio/ogg';
    }

    const prompt = "No respongues a l'àudio, no continues el diàleg. Fes només una transcripció literal, paraula per paraula, en el mateix idioma original de l'àudio. PROHIBIT TRADUIR (NO traduïsques res de valencià a castellà ni viceversa). Si no hi ha parla clara, retorna cadena buida.";

    const response = await withTimeout(
      ai.models.generateContent({
        model: MODEL_TEXT, // [FIX-5]
        contents: [
          { text: prompt },
          { inlineData: { data, mimeType: mime } },
        ],
        config: {
          abortSignal: signal,
        },
      }),
      GEMINI_TIMEOUT_MS,
      'Transcripció àudio',
    );

    const text = (response?.text ?? response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
    return text || null;
  } catch (err) {
    console.error('[CERVELL] Fallada al transcriure àudio:', err?.message || err);
    return null;
  }
}

// [FIX-3] ORDRE DE PROVEÏDORS SEGONS L'ACTA DEL 28-07-2026 ("El Llapis"):
//   La decisió canònica del Consell fou saltar a FLUX Schnell pay-as-you-go per
//   REST/fetch quan Google va tancar Imagen al gratuït. El codi, però, havia
//   reintroduït Imagen 3 com a PRIMARI: cada estampa cremava un intent condemnat
//   (i fins a 60 s de pressupost de temps) abans del fallback. Ara:
//     · PRIMARI: FLUX Schnell (fetch natiu, sense SDK) — respecta el signal.
//     · OPCIONAL: Imagen només si IAIA_IMATGES_GOOGLE=1 (per si Google reobri
//       l'aixeta), i ARA també respecta el signal d'avortament.
export async function generaImatge(imagePrompt, { signal } = {}) {
  const finalPrompt = `${imagePrompt}, in the classic comic style of Francisco Ibáñez and Editorial Bruguera, full frame artwork with absolutely no white borders or margins, highly detailed, vibrant colors, chaotic and humorous rural Valencian village culture, absurd and satirical Luis Garcia Berlanga aesthetic`;

  if (process.env.IAIA_IMATGES_GOOGLE === '1') {
    try {
      console.log('[CERVELL] Generant imatge amb Imagen (via flag explícita)...');
      const generatePromise = ai.models.generateImages({
        model: process.env.IAIA_MODEL_IMATGE_GOOGLE || 'imagen-3.0-generate-001',
        prompt: finalPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });
      const carrera = signal ? Promise.race([generatePromise, abortToReject(signal)]) : generatePromise;
      const response = await withTimeout(carrera, 60_000, "Generació d'imatge (Imagen)");
      const base64Image = response?.generatedImages?.[0]?.image?.imageBytes;
      if (base64Image) {
        return { bytes: Buffer.from(base64Image, 'base64'), mimeType: 'image/jpeg' };
      }
      console.error('[CERVELL] Imagen no ha retornat imatge vàlida. Passem a FLUX...');
    } catch (err) {
      if (err?.code === 'ABORTED') return null;
      console.error('[CERVELL] Fallada amb Imagen:', err?.message || err);
    }
  }

  try {
    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) {
      console.error("[CERVELL] FAL_KEY no definida a l'entorn");
      return null;
    }

    const endpoint = 'https://fal.run/fal-ai/flux/schnell';
    const timeoutSignal = AbortSignal.timeout(90_000);
    const falSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

    const fetchPromise = fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: finalPrompt,
        image_size: 'square_hd',
        num_images: 1,
        output_format: 'jpeg',
        enable_safety_checker: true,
      }),
      signal: falSignal,
    });

    const res = await withTimeout(fetchPromise, 90_000, 'fal.ai FLUX');

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error('[CERVELL] fal.ai error', res.status, errText.slice(0, 300));
      return null;
    }

    const json = await res.json();
    const imageUrl = json?.images?.[0]?.url;
    if (!imageUrl) {
      console.error('[CERVELL] fal.ai sense URL d\u2019imatge', JSON.stringify(json).slice(0, 200));
      return null;
    }

    const imgRes = await fetch(imageUrl, { signal: falSignal });
    if (!imgRes.ok) {
      console.error('[CERVELL] Error baixant imatge de fal CDN', imgRes.status);
      return null;
    }

    const arrayBuffer = await imgRes.arrayBuffer();
    return {
      bytes: Buffer.from(arrayBuffer),
      mimeType: 'image/jpeg',
    };
  } catch (err) {
    console.error('[CERVELL] Fallada al generar imatge amb FLUX:', err?.message || err);
    return null;
  }
}

```

## [FITXER ADJUNT]: bot/cervell_bridge.mjs
```javascript
/**
 * [FIX-3b] Cadenes d'error neutres: la boca de l'àvia ja no revela proveïdors interns (Nano-Banana/FLUX).
 * Pont mínim entre whatsapp_baileys.mjs i el cervell actual de la IAIA.
 * Espera els mètodes transcribeAudio(bytes, mimeType), answer(text, opts) i,
 * opcionalment, generateImage(prompt).
 *
 * Contracte d'imatge unificat: el cervell retorna sempre { bytes: Buffer, mimeType }.
 */

export function createCervellHandler(cervell) {
  if (!cervell || typeof cervell.pensa !== 'function') {
    throw new TypeError('El cervell ha d’implementar pensa(pregunta, opts)');
  }

  return async function handleInbound(envelope) {
    const { text, audio, image, sendProgress, signal, senderJid, chatJid } = envelope;
    let question = typeof text === 'string' ? text.trim() : '';
    let audioBytes = null;

    try {
      if (audio) {
        if (typeof cervell.transcriuAudio !== 'function') {
          throw new TypeError('El cervell no implementa transcriuAudio(bytes, mimeType)');
        }
        audioBytes = audio.bytes; 
        question = await cervell.transcriuAudio(audio.bytes, audio.mimeType, { signal });
      }

      if (image && !question) {
        question = "T'he enviat una imatge. Analitza-la amb el teu trellat i digues què veus, o fes el que et demane la imatge.";
      }

      if (typeof question !== 'string' || !question.trim()) {
        if (audio) {
          return { text: "Ai xiquet, per a estes coses modernes l'aparell de l'oït m'ha de donar problemes hui... no he pogut desxifrar què em deies. Pots escriure-m'ho, fes el favor?" };
        }
        return null;
      }

      const sender = senderJid || chatJid || null;
      
      const result = await cervell.pensa(question.trim(), {
        signal,
        image,
        sender,
      });

      if (typeof result === 'string') {
        return { text: result };
      }

      const textReply = result?.answer || result?.text || '';
      const imagePrompt = result?.imatgePrompt || result?.imagePrompt || result?.image_prompt || null;

      if (imagePrompt && typeof cervell.generaImatge === 'function') {
        if (typeof sendProgress === 'function') {
          try {
            await sendProgress(
              textReply
                ? `${textReply}\n\n*(Xiquet, dóna'm un momentet que vaig a encendre el llapis...)*`
                : "*(Xiquet, dóna'm un momentet que vaig a encendre el llapis...)*",
            );
          } catch (progressErr) {
            console.error('[CERVELL_BRIDGE] Fallada no crítica al sendProgress:', progressErr?.message);
          }
        }

        if (signal?.aborted) return null;

        const generated = await cervell.generaImatge(imagePrompt, { signal });
        
        if (signal?.aborted) return null;
        if (!generated) {
          return { text: 'Ai xiquets, ara mateix no vos puc dibuixar això. Els pinzells m\'han fallat! Torneu-ho a provar d\'ací a una estona, feu el favor.' };
        }

        let bytes = generated.bytes || generated.buffer || null;
        if (!bytes && generated.base64) {
          bytes = Buffer.from(generated.base64, 'base64');
        }
        if (!bytes || !Buffer.isBuffer(bytes) || bytes.length === 0) {
          return { text: 'Ai xiquets, ara mateix no vos puc dibuixar això. Els pinzells m\'han fallat! Torneu-ho a provar d\'ací a una estona, feu el favor. (Error de format)' };
        }

        return {
          text: typeof sendProgress === 'function' ? null : textReply,
          image: {
            bytes,
            mimeType: generated.mimeType || generated.mimetype || 'image/jpeg',
          },
        };
      }

      return { text: textReply };
    } finally {
      // Neteja explícita de buffers d'àudio per evitar fuites de dades en memòria (GDPR)
      if (audioBytes && Buffer.isBuffer(audioBytes)) {
        audioBytes.fill(0);
      }
      if (audio?.bytes && Buffer.isBuffer(audio.bytes)) {
        audio.bytes.fill(0);
      }
      if (image?.bytes && Buffer.isBuffer(image.bytes)) {
        image.bytes.fill(0);
      }
    }
  };
}

export function asVoiceReply({ bytes, mimeType = 'audio/ogg', ptt = true }) {
  return { audio: { bytes, mimeType, ptt } };
}

```

## [FITXER ADJUNT]: bot/whatsapp_baileys.mjs
```javascript
import { createHash, randomInt, timingSafeEqual } from 'node:crypto';
import { join } from 'node:path';
import makeWASocket, {
  BufferJSON,
  areJidsSameUser,
  downloadMediaMessage,
  extractMessageContent,
  isJidBroadcast,
  isJidGroup,
  isJidNewsletter,
  isJidStatusBroadcast,
  makeCacheableSignalKeyStore,
  normalizeMessageContent,
  fetchLatestBaileysVersion,
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
  maxAudioSeconds: 15 * 60,
  maxImageBytes: 8 * 1024 * 1024,
  imageDownloadTimeoutMs: 30_000,
  audioDownloadTimeoutMs: 60_000,
  processTimeoutMs: 120_000,
  replyTtlMs: 10 * 60_000,
  shutdownTimeoutMs: 30_000,
  socketEndTimeoutMs: 5_000,
  groupMetadataTtlMs: 10 * 60_000,
  messageCacheTtlMs: 24 * 60 * 60_000,
  allowAllGroups: false,
  allowedGroupJids: [],
  allowAllDirects: false,
  allowedDirectJids: [],
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
    'maxImageBytes',
    'imageDownloadTimeoutMs',
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
  if (!Array.isArray(config.allowedDirectJids)) {
    throw new TypeError('allowedDirectJids ha de ser un array');
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
  const msg = String(error?.message || '').toLowerCase();
  return (
    TRANSIENT_MEDIA_CODES.has(code) ||
    code === 'AUDIO_TIMEOUT' ||
    error?.name === 'AbortError' ||
    error?.name === 'TimeoutError' ||
    status === 408 ||
    status >= 500 ||
    msg.includes('bad mac')
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
  #socket = null;
  #version = [2, 3000, 1043857760]; // default fallback
  #generation = 0;
  #lastClosedGeneration = 0;
  #connectPromise = null;
  #reconnectTimer = null;
  #stableTimer = null;
  #stopping = false;
  #connected = false;
  #halted = false;
  #allowOutbound = true;
  #limitsConfirmedGeneration = 0;
  #stopPromise = null;
  #credsError = null;
  #unsafeSocketClose = false;
  #socketEndPromises = new WeakMap();
  #groupFetches = new Map();
  #groupVersions = new Map();

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
    this.allowedDirects = new Set(this.config.allowedDirectJids);

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

  #notify(label, callback, value) {
    try {
      void Promise.resolve(callback(value)).catch((error) => {
        this.logger.warn(errorSummary(error), `Callback ${label} rebutjat`);
      });
    } catch (error) {
      this.logger.warn(errorSummary(error), `Callback ${label} fallit`);
    }
  }

  #endSocket(socket) {
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
      const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: this.#version }));
      this.#version = version;
      await this.#openSocket();
      return this;
    } catch (error) {
      await this.instanceLock.release().catch(() => undefined);
      throw error;
    }
  }

  #socketOptions(socketRef) {
    return {
      version: this.#version,
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
      cachedGroupMetadata: async (jid) => this.#cachedGroupMetadata(jid, socketRef()),
      shouldIgnoreJid: (jid) =>
        isJidStatusBroadcast(jid) || isJidNewsletter(jid) || isJidBroadcast(jid),
      connectTimeoutMs: 30_000,
      defaultQueryTimeoutMs: 60_000,
    };
  }

  async #openSocket() {
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
      this.#bindSocket(socket, generation);
    })().finally(() => {
      this.#connectPromise = null;
    });
    return this.#connectPromise;
  }

  #bindSocket(socket, generation) {
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
      if (connection) await this.#onConnectionUpdate(connection, generation);

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

  async #onConnectionUpdate(update, generation) {
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
      void this.#finishOpening(this.#socket, generation);
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

  #scheduleOpenFailure(error) {
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

  async #finishOpening(socket, generation) {
    const lockKnown = await this.#refreshAccountLimits(socket, generation);
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

  async #refreshAccountLimits(socket, generation) {
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

  #accept(message) {
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

  #groupIsAllowed(chatJid) {
    return this.config.allowAllGroups || this.allowedGroups.has(chatJid);
  }

  #directIsAllowed(senderJid) {
    return this.config.allowAllDirects || this.allowedDirects.has(senderJid);
  }

  #groupActivation(content, text) {
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

  async #process(message, address) {
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
        const activation = this.#groupActivation(content, text);
        if (!activation.active) {
          await this.replyLedger.markDone(eventId);
          return;
        }
        if (activation.commanded) {
          this.config.groupPrefix.lastIndex = 0;
          text = text.replace(this.config.groupPrefix, '').trim();
        }
      } else {
        // Missatges privats: Fail-closed segons IAIA_DIRECTES
        if (!this.#directIsAllowed(address.senderJid)) {
          await this.replyLedger.markDone(eventId);
          return;
        }
      }

      // Extracció de mitjans citats si el missatge actual no en té
      let mediaContent = content;
      let mediaUsedAssociated = usedAssociatedChild;
      const quoted = content?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!content?.audioMessage && !content?.imageMessage && quoted) {
        if (quoted.audioMessage || quoted.imageMessage) {
          mediaContent = quoted;
          mediaUsedAssociated = true;
        }
      }

      let mediaError = null;
      const handleMediaError = (err) => {
        mediaError = err;
        this.logger.error({ ...errorSummary(err), chat: redactJid(address.chatJid) }, 'Descàrrega fallida');
        return null; // Evitem que caiga a la catch exterior on es moriria en silenci
      };

      if (mediaContent?.audioMessage) {
        audio = await downloadAudioSafe({
          getSocket: () => (this.#connected ? this.#socket : null),
          message,
          content: mediaContent,
          usedAssociatedChild: mediaUsedAssociated,
          logger: this.logger,
          maxBytes: this.config.maxAudioBytes,
          maxSeconds: this.config.maxAudioSeconds,
          timeoutMs: this.config.audioDownloadTimeoutMs,
        }).catch(handleMediaError);
      }
      if (mediaContent?.imageMessage) {
        image = await downloadImageSafe({
          getSocket: () => (this.#connected ? this.#socket : null),
          message,
          content: mediaContent,
          usedAssociatedChild: mediaUsedAssociated,
          logger: this.logger,
          maxBytes: this.config.maxImageBytes,
          timeoutMs: this.config.imageDownloadTimeoutMs,
        }).catch(handleMediaError);
      }
      if (!text && !audio && !image && !mediaError) {
        await this.replyLedger.markDone(eventId);
        return;
      }

      // Si hi ha hagut error a la descàrrega, reescrivim text perquè el cervell veja què passa i avise l'usuari
      if (mediaError) {
        text = text ? `${text}\n\n*(Avís per a tu: L'arxiu o foto no s'ha pogut descarregar. Avisa-ho amb naturalitat.)*` : "*(Avís intern: L'usuari ha enviat una foto o àudio però no s'ha pogut baixar. Avisa-li que hi ha hagut un error tècnic de cobertura i que ho reenvie.)*";
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
      image?.bytes?.fill(0);
    }
  }

  #cacheMessage(message) {
    if (!message?.key?.id || !message?.message) return Promise.resolve();
    return this.messageStore.set(message.key.id, message.message).catch((error) => {
      this.logger.error(errorSummary(error), 'No s’ha pogut persistir la cache de missatges');
      throw error;
    });
  }

  async #getCachedMessage(key) {
    return this.messageStore.get(key?.id);
  }

  async #cachedGroupMetadata(jid, socket) {
    const cached = this.groupCache.get(jid);
    if (cached) return cached;
    if (!socket || socket !== this.#socket || !this.#connected) return undefined;
    const generation = this.#generation;
    const version = this.#groupVersions.get(jid) || 0;
    const existing = this.#groupFetches.get(jid);
    if (existing?.generation === generation && existing?.version === version) {
      return existing.promise;
    }
    const record = { generation, version, promise: null };
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

  #invalidateGroup(jid) {
    this.#groupVersions.set(jid, (this.#groupVersions.get(jid) || 0) + 1);
    this.groupCache.del(jid);
    this.#groupFetches.delete(jid);
  }

  #putGroupMetadata(metadata) {
    this.#invalidateGroup(metadata.id);
    this.groupCache.set(metadata.id, metadata);
  }

  #fatal(error, context) {
    if (this.#halted || this.#stopping) return;
    this.#halted = true;
    this.#connected = false;
    clearTimeout(this.#reconnectTimer);
    this.#reconnectTimer = null;
    this.inboundQueue.close();
    this.outbound.close();
    // #performStop observa esta mateixa promesa i només allibera el lock si
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

  async #performStop(reason) {
    this.#stopping = true;
    clearTimeout(this.#reconnectTimer);
    clearTimeout(this.#stableTimer);
    this.#reconnectTimer = null;
    this.inboundQueue.close();
    const deadline = Date.now() + this.config.shutdownTimeoutMs;
    const remaining = () => Math.max(0, deadline - Date.now());

    // #openSocket revalida #stopping després de cada await. Esperar-lo abans
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


*Ací tens l'arquitectura i el codi base. Comença l'auditoria inversa ara mateix i digues quines contradiccions has trobat, què sobra i com puc estalviar tokens amb les plaquetes.*