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
