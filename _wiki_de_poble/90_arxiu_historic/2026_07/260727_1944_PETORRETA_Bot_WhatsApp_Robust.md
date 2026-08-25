---
estat: auditat
tipus: document
tags:
- arxiu
- historic
- petorreta
- socdepoble
---
# CONTEXT GLOBAL I IDENTITAT (SÓC DE POBLE)

Som el projecte "Sóc de Poble", una xarxa social rural per a un poble d'Alacant, basada en la filosofia "Pedra Seca" (arquitectura de programari resilient, primant l'eficiència i la longevitat, zero abstraccions innecessàries i independència del Big Tech). La missió és atorgar sobirania tecnològica a la gent gran del medi rural.

Actuem sota la identitat de la "IAIA MarIA", un bot intel·ligent híbrid forjat entre un humà i la IA, amb personalitat de iaia de poble sàvia i directa. La IAIA actua en WhatsApp com la interfície conversacional del projecte. 

El nostre sistema usa un RAG local molt lleuger (`edge_rag.mjs`) que funciona sense bases de dades vectorials externes (usa pures matemàtiques TF-IDF per llegir arxius Markdown d'una Wiki local). Aquest context s'envia a l'API de Google Gemini (Flash 2.5) perquè la IAIA genere la resposta en valencià. Tot s'executa localment sota Node.js.

# EL PROBLEMA

Estem usant la llibreria `whatsapp-web.js` (versió 1.34.7) per a la connexió amb WhatsApp via Puppeteer. Funciona molt bé per a missatges de text. Tanmateix, tenim un **bug crític** amb la descàrrega d'àudios (notes de veu).
L'arquitectura del bot està pensada per a rebre l'àudio, transcriure'l utilitzant l'API de Gemini (funció `transcribeAudio`), i contestar. Però quan l'usuari ens envia l'àudio des d'un compte de WhatsApp vinculat a una pàgina de Facebook, WhatsApp canvia l'identificador (passa a usar identificadors `@lid` en lloc dels normals `@c.us`). Això provoca que quan el bot crida a `msg.downloadMedia()`, la llibreria falla internament llençant un error `r: r` des de l'interior del Puppeteer (`ExecutionContext.evaluate`), ja que no troba el missatge per a extreure'n el mèdia degut als recents canvis en l'arquitectura frontend de WhatsApp Web.

Hem intentat apedaçar manualment el codi de la llibreria canviant `this.id._serialized` per `this.id` a la funció de `Message.js`, però volem la **millor solució i arquitectura possible a llarg termini** perquè aquest bot siga sòlid com una roca i no caiga davant d'aquests canvis.

# QUÈ NECESSITEM DEL CONSELL DE SAVIS

1. Avalua l'arquitectura actual del bot (t'adjuntem el codi). Estem usant l'eina adequada (`whatsapp-web.js`) o hauríem de migrar a una alternativa com `@whiskeysockets/baileys` o a la pròpia Cloud API oficial de Meta per garantir l'estabilitat i la lectura d'àudios de qualsevol origen?
2. Si consideres que hem de mantenir `whatsapp-web.js`, quin és el pedaç correcte o el *workaround* definitiu per a saltar-nos l'error `r: r` al descarregar mèdia d'usuaris amb comptes d'empresa/LID?
3. Proposa la refactorització o el codi complet per a solucionar aquest problema d'arrel i tindre el bot "perfecte", preparat per als usuaris de poble que manen notes de veu contínuament.

# CODI ACTUAL

## 1. `bot/whatsapp_bot.mjs`
```javascript
import 'dotenv/config';
import whatsapp from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { GoogleGenAI } from '@google/genai';
import { buildIndex, search } from '../tooling/wiki/core/edge_rag.mjs';
import { readFileSync } from 'fs';
import { join } from 'path';

const { Client, LocalAuth, MessageMedia } = whatsapp;

// Load identity
const PROFILE_PATH = join(process.cwd(), '.agents/identity/PROFILE.md');
const profileText = readFileSync(PROFILE_PATH, 'utf8');

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// We need to build the index once on startup
let ragIndex;

async function setupRAG() {
  console.log('[BOT] Indexant la Wiki (RAG)...');
  ragIndex = await buildIndex(join(process.cwd(), '_wiki_de_poble'));
  console.log(`[BOT] Índex construït: ${ragIndex.docCount} fitxers processats.`);
}

async function askGemini(question, contextDocs) {
  const contextStr = contextDocs.map(d => {
    const fullPath = join(process.cwd(), '_wiki_de_poble', d.path);
    try {
      return `--- Document: ${d.path} ---\n${readFileSync(fullPath, 'utf8')}`;
    } catch(e) { return ''; }
  }).join('\n\n');
  
  const prompt = `
ETS AQUESTA IDENTITAT:
${profileText}

CONTEXT DE LA WIKI:
${contextStr}

PREGUNTA DE L'USUARI (VIA WHATSAPP):
${question}

Respon a la pregunta de l'usuari utilitzant el context de la Wiki proporcionat i seguint la teua identitat (IAIA MarIA). Aplica el "Trellat". Si la pregunta és trivial o general, usa el teu coneixement previ amb la personalitat, però per a dades de "Sóc de Poble", basa't només en el context.

MOLT IMPORTANT - GENERACIÓ D'IMATGES:
Si l'usuari et demana que dibuixes, crees, ensenyes o generes una imatge (ex: "dibuixa'm un camp", "fes-me una foto de la Font"), AFEGEIX al final de la teua resposta aquesta etiqueta exacta (amb la descripció en anglés dins dels claudàtors):
[GENERA_IMATGE: english description of what to draw]
Per exemple: Clar que sí xiquet, ací tens el dibuix! [GENERA_IMATGE: a beautiful old fountain in a village square]
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('[ERROR] Fallada al cridar a Gemini:', error);
    return "Xiquet, ara mateix tinc el cap atabalat. L'emissora de ràdio no m'arriba bé. Torna a preguntar-m'ho després.";
  }
}

async function generateImage(imagePrompt) {
  try {
    const finalPrompt = `${imagePrompt}, in rustic traditional linocut style, black and white or sepia, high contrast, minimalist, traditional rural Valencian village culture, woodcut art`;
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: finalPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
      }
    });
    const base64Image = response.generatedImages[0].image.imageBytes;
    return new MessageMedia('image/jpeg', base64Image, 'socdepoble.jpg');
  } catch (err) {
    console.error('[ERROR] Fallada al generar imatge amb Imagen 3:', err);
    return null;
  }
}

async function transcribeAudio(media) {
  try {
    const prompt = "Transcriu aquest àudio a text exactament com se sent. No afiges res més, ni cap explicació addicional, només la transcripció literal de la veu. Si l'àudio està en valencià/català o castellà, transcriu-lo en l'idioma original.";
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { text: prompt },
        { inlineData: { data: media.data, mimeType: media.mimetype } }
      ]
    });
    return response.text.trim();
  } catch (err) {
    console.error('[ERROR] Fallada al transcriure àudio:', err);
    return null;
  }
}

async function startBot() {
  await setupRAG();

  const client = new Client({
    authStrategy: new LocalAuth(), // Guarda la sessió perquè no hages d'escanejar cada vegada
    puppeteer: {
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  client.on('qr', (qr) => {
    console.log('\n======================================================');
    console.log('[BOT] Escaneja aquest QR amb el teu WhatsApp (Dispositius vinculats):');
    qrcode.generate(qr, { small: true });
    console.log('======================================================\n');
  });

  client.on('ready', () => {
    console.log('[BOT] La IAIA MarIA està connectada a WhatsApp i llesta per repartir Trellat!');
  });

  client.on('message', async msg => {
    // Ignorem estats i missatges del mateix bot
    if (msg.isStatus || msg.fromMe) return;
    
    let userText = null;

    if (msg.hasMedia && (msg.type === 'ptt' || msg.type === 'audio')) {
      console.log(`[WHATSAPP] Rebut àudio de ${msg.from}, descarregant...`);
      let media = null;
      try {
        media = await msg.downloadMedia();
      } catch (err) {
        console.error('[ERROR] No s\\'ha pogut descarregar el mèdia:', err);
        msg.reply("Perdona xiquet, l'àudio m'arriba tallat i no puc descarregar-lo de l'aparell. Prova a escriure-m'ho!");
        return;
      }
      
      if (media && media.data) {
        console.log(`[WHATSAPP] Transcrivint àudio amb Gemini...`);
        const transcription = await transcribeAudio(media);
        if (transcription) {
          console.log(`[BOT] Transcripció: "${transcription}"`);
          userText = transcription;
        } else {
          msg.reply("Perdona xiquet, tinc l'oïda tapada hui i no he pogut escoltar bé l'àudio. Escriu-m'ho, per favor.");
          return;
        }
      }
    } else if (msg.body && typeof msg.body === 'string') {
      console.log(`[WHATSAPP] Rebut text de ${msg.from}: ${msg.body}`);
      userText = msg.body;
    }

    if (userText) {
      const results = search(ragIndex, userText, 3); // top 3 results
      console.log(`[BOT] RAG ha trobat ${results.length} documents rellevants per a la consulta.`);
      
      let responseText = await askGemini(userText, results);
      console.log(`[BOT] Resposta generada (longitud: ${responseText.length} chars)`);
      
      // Comprovar si hi ha petició d'imatge
      const imageMatch = responseText.match(/\[GENERA_IMATGE:\s*(.*?)\]/i);
      if (imageMatch) {
        const imagePrompt = imageMatch[1];
        // Llevem l'etiqueta del text perquè no es veja al WhatsApp
        responseText = responseText.replace(imageMatch[0], '').trim();
        
        console.log(`[BOT] L'usuari ha demanat imatge. Generant: "${imagePrompt}"`);
        const media = await generateImage(imagePrompt);
        
        if (media) {
          await msg.reply(responseText, null, { media: media });
        } else {
          await msg.reply(responseText + "\n\n(Ai xiquet, se m'ha trencat el llapis i no he pogut fer-te el dibuix. Torna a demanar-m'ho després!)");
        }
      } else {
        await msg.reply(responseText);
      }
    }
  });

  console.log('[BOT] Iniciant client de WhatsApp...');
  client.initialize();
}

startBot();
```

## 2. `tooling/wiki/core/edge_rag.mjs`
*(Motor RAG ultralleuger basat en TF-IDF)*
```javascript
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parseFrontmatter } from '../lib/frontmatter.mjs';

const RULES_URL = new URL('../rules/trellat-rules.json', import.meta.url);
let rulesCache = null;
async function loadRules() {
  if (!rulesCache) rulesCache = JSON.parse(await readFile(RULES_URL, 'utf8'));
  return rulesCache;
}

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, acc);
    else if (e.name.endsWith('.md')) acc.push(full);
  }
  return acc;
}

const WORD_RE = /[a-zà-ÿ0-9]+/g;

function tokenize(text, stopwords, minLen) {
  const raw = text.toLowerCase().match(WORD_RE) || [];
  const out = [];
  for (const t of raw) {
    if (t.length < minLen || stopwords.has(t)) continue;
    out.push(t);
  }
  return out;
}

function termFreq(tokens) {
  const tf = new Map();
  for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
  const total = tokens.length || 1;
  for (const [k, v] of tf) tf.set(k, v / total); 
  return tf;
}

export async function buildIndex(root, options = {}) {
  const rules = await loadRules();
  const cfg = rules.edgeRag || {};
  const stopwords = new Set(cfg.stopwordsCa || []);
  const minLen = cfg.minTokenLength ?? 2;

  const files = options.files || (await walk(root));
  const meta = [];
  const df = new Map();
  const perDocTf = [];

  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const parsed = parseFrontmatter(raw);
    if (parsed.malformed || parsed.errors.length) {
      throw new Error(`Frontmatter invàlid en ${relative(root, file)}`);
    }
    const body = parsed.body;
    const tokens = tokenize(body, stopwords, minLen);
    const tf = termFreq(tokens);
    for (const term of tf.keys()) df.set(term, (df.get(term) || 0) + 1);
    meta.push({ id: meta.length, path: relative(root, file), length: tokens.length });
    perDocTf.push(tf);
  }

  const N = meta.length || 1;
  const idf = new Map();
  for (const [term, count] of df) idf.set(term, Math.log((N + 1) / (count + 1)) + 1);

  const inverted = new Map();
  const norms = new Array(meta.length).fill(0);
  perDocTf.forEach((tf, docId) => {
    let sumSq = 0;
    for (const [term, freq] of tf) {
      const weight = freq * (idf.get(term) || 0);
      sumSq += weight * weight;
      if (!inverted.has(term)) inverted.set(term, []);
      inverted.get(term).push({ docId, weight });
    }
    norms[docId] = Math.sqrt(sumSq) || 1e-9;
  });

  return { docs: meta, inverted, idf, norms, stopwords, minLen, docCount: meta.length };
}

export function search(index, query, topK) {
  const k = topK ?? 10;
  const qTokens = tokenize(query, index.stopwords, index.minLen);
  if (!qTokens.length) return [];

  const qTf = termFreq(qTokens);
  const qVec = new Map();
  let qSumSq = 0;
  for (const [term, freq] of qTf) {
    const idfVal = index.idf.get(term);
    if (idfVal === undefined) continue;
    const weight = freq * idfVal;
    qVec.set(term, weight);
    qSumSq += weight * weight;
  }
  if (qVec.size === 0) return [];
  const qNorm = Math.sqrt(qSumSq) || 1e-9;

  const dot = new Map();
  for (const [term, qWeight] of qVec) {
    const postings = index.inverted.get(term);
    if (!postings) continue;
    for (const { docId, weight } of postings) dot.set(docId, (dot.get(docId) || 0) + qWeight * weight);
  }

  const results = [];
  for (const [docId, d] of dot) {
    const sim = d / (qNorm * index.norms[docId]);
    if (sim > 0) results.push({ path: index.docs[docId].path, score: sim });
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, k);
}
```


---

**Ancoratge de Seguretat:** [[00_INDEX]]