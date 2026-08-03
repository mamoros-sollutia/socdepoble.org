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
---

# 🚀 PETORRETA AL CONSELL: AUDITORIA DESTRUCTIVA, TOOLS I DESPLEGAMENT 24/7

Mestre, ací tens la Petorreta completa amb tot el codi de l'ecosistema, tal i com demanaves. Amb açò, el Consell té la visió global per a recomanar un bon desplegament 24/7 i no només un arreglet. Fes clic a "Copy to clipboard" en el requadre de sota i passa-ho al Consell.

```markdown
ACTUA COM A CONSELL D'ARQUITECTURA (SÈNIOR STAFF ENGINEER)

Context:
Sóc Javi, creador de "Sóc de Poble", un ecosistema digital rural. He desenvolupat un Bot de WhatsApp autònom anomenat "IAIA MarIA" basat en Node.js, Baileys i l'API de Gemini 2.5 Flash. T'adjunte l'ecosistema complet de 4 fitxers: el cervell, el pont de connexió, el punt d'entrada (index) i el package.json.

Tinc tres grans objectius per a tu avui. Necessite una auditoria inversa destructiva: destrossa els meus errors i dona'm les solucions.

### OBJECTIU 1: ARRANJAR EL FUNCTION CALLING (IMATGES)
Hem actualitzat el codi per utilitzar el nou SDK `@google/genai`. Hem ficat `systemInstruction` i `tools` dins de l'objecte `config` en cridar a `generateContent()`. El problema és que el bot **no executa l'eina (tool)**. Quan l'usuari li demana per WhatsApp "dibuixa'm", la IA contesta amb text ("Ara t'ho dibuixe!") però no executa el *Function Calling* i no retorna la imatge. 
Busca l'error en `cervell.mjs` o en el flux de `cervell_bridge.mjs`. (Per exemple, estic enviant correctament les funcions mapejades?).

### OBJECTIU 2: DESPLEGAMENT 24/7 (SENSE TERMINAL LOCAL)
Fins ara, el bot corre en el meu Mac local amb la terminal oberta. Vull que la IAIA MarIA estiga operativa 24/7 sense dependre del meu ordinador. Disposem de pressupost (paguem uns 100€/mes en l'entorn Google Cloud/Workspace). Quina és la millor estratègia per desplegar aquest bot (Node.js + Baileys que necessita escriure/llegir autenticacions en `var/baileys-runtime` i `.iaia_auth`) de forma contínua, segura i econòmica en l'ecosistema de Google (Cloud Run, Compute Engine, etc.) o similar? Revisa el meu `index.mjs` i `package.json` i fes-me una proposta arquitectònica de desplegament.

### OBJECTIU 3: AUDITORIA GENERAL DE L'ARQUITECTURA
Revisa el codi adjunt per detectar qualsevol coll d'ampolla, mala pràctica de memòria, o vulnerabilitat.

---
### CODI ACTUAL PER A REVISAR:

#### 1. bot/index.mjs
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

#### 2. bot/cervell.mjs
```javascript
import { GoogleGenAI, Type } from '@google/genai';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildIndex, search } from '../tooling/wiki/core/edge_rag.mjs';

const PROFILE_PATH = join(process.cwd(), '.agents/identity/PROFILE.md');
const WIKI_PATH = join(process.cwd(), '_wiki_de_poble');
const TOP_K = 3;
const MAX_CHARS_PER_DOC = 12000;
const GEMINI_TIMEOUT_MS = 25000;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let ragIndex = null;
let profileText = null;

export async function iniciaCervell() {
  profileText = readFileSync(PROFILE_PATH, 'utf8');
  ragIndex = await buildIndex(WIKI_PATH);
}

function construixContext(docs) {
  return docs.map((d) => {
    try {
      const text = readFileSync(join(WIKI_PATH, d.path), 'utf8');
      return `--- Document: ${d.path} ---\n${text.slice(0, MAX_CHARS_PER_DOC)}`;
    } catch { return ''; }
  }).filter(Boolean).join('\n\n');
}

const withTimeout = (promise, ms, label = 'Operació') => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Timeout: ${label} ha superat els ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

export async function transcriuAudio() { /* Placeholder - Funciona OK */ return "Text transcrit"; }
export async function generaImatge() { /* Placeholder - Funciona OK */ return { bytes: [] }; }

export async function pensa(pregunta, opts = {}) {
  const { signal, image, sender } = opts;
  const docs = search(ragIndex, pregunta, TOP_K);
  const contextStr = construixContext(docs);

  const systemInstruction = `
ETS AQUESTA IDENTITAT:
${profileText}

CONTEXT DE LA WIKI:
${contextStr}

INSTRUCCIONS DE RESPOSTA:
1. Contesta de manera natural continuant el fil.
2. **IMPORTANT:** Si l'usuari et demana que dibuixes, HAS DE CRIDAR OBLIGATÒRIAMENT la funció 'dibuixar_estampa'.
  `;

  const parts = [{ text: `[FIL ACTUAL]\nUSUARI: ${pregunta}\n\nRespon al veí com a IAIA MarIA:` }];

  if (image && image.bytes) {
    parts.push({
      inlineData: {
        data: Buffer.from(image.bytes).toString('base64'),
        mimeType: image.mimeType || 'image/jpeg',
      },
    });
  }

  const tools = [{
    functionDeclarations: [{
      name: 'dibuixar_estampa',
      description: 'Genera una imatge basada en la petició de l\'usuari.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          prompt_angles: { type: Type.STRING, description: 'Descripció detallada en ANGLÉS.' }
        },
        required: ['prompt_angles']
      }
    }]
  }];

  try {
    const generatePromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: parts,
      config: {
        systemInstruction: systemInstruction,
        tools: tools
      }
    });

    const response = await withTimeout(generatePromise, GEMINI_TIMEOUT_MS, 'Gemini Flash');

    let text = '';
    let imatgePrompt = null;

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls.find(c => c.name === 'dibuixar_estampa');
      if (call && call.args && call.args.prompt_angles) {
        imatgePrompt = call.args.prompt_angles;
        text = "Ai, xiquet! Dóna'm un momentet que m'hi pose amb els pinzells...";
      }
    } else {
      text = (response.text ?? '').trim();
    }

    return { text, imatgePrompt };
  } catch (error) {
    return { text: "Xiquet, ara mateix tinc el cap atabalat. Torna a provar després.", imatgePrompt: null };
  }
}
```

#### 3. bot/cervell_bridge.mjs
```javascript
export function createCervellHandler(cervell) {
  return async function handleInbound({ text, audio, image, sendProgress, signal, envelope }) {
    let question = text;
    if (audio) question = await cervell.transcribeAudio(audio.bytes, audio.mimeType, { signal });
    if (typeof question !== 'string' || !question.trim()) return null;

    const sender = envelope?.senderJid || envelope?.chatJid || 'foraster';
    const result = await cervell.answer(question.trim(), { signal, image, sender });
    
    if (typeof result === 'string') return { text: result };

    const textReply = result?.answer || result?.text || '';
    const imagePrompt = result?.imatgePrompt || result?.imagePrompt || null;
    
    if (imagePrompt && typeof cervell.generateImage === 'function') {
      if (typeof sendProgress === 'function') {
        await sendProgress(textReply + "\n\n*(Xiquet, dóna'm 2 o 3 minutets que vaig a encendre els llapis...)*");
      }
      const generatedImage = await cervell.generateImage(imagePrompt, { signal });
      if (generatedImage) {
        return {
          text: typeof sendProgress === 'function' ? null : textReply,
          image: {
            bytes: generatedImage.bytes || generatedImage.buffer || generatedImage.base64,
            mimeType: generatedImage.mimeType || generatedImage.mimetype || 'image/jpeg',
          },
        };
      }
    }
    return { text: textReply };
  };
}
```

#### 4. package.json (Dependències per entendre l'ecosistema)
```json
{
  "name": "socdepoble-org",
  "type": "module",
  "scripts": {
    "start": "node bot/index.mjs"
  },
  "dependencies": {
    "@google/genai": "^2.13.0",
    "baileys": "7.0.0-rc13",
    "dexie": "^4.4.4",
    "dotenv": "^17.4.2",
    "qrcode-terminal": "^0.12.0"
  }
}
```
\`\`\` (Assegura't de copiar tot el bloc)


---

**Ancoratge de Seguretat:** [[00_INDEX]]