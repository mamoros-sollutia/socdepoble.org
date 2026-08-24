---
estat: auditat
tipus: document
tags:
- arxiu
- consell_ia
- historic
- iaia_maria
- petorreta
- socdepoble
---
# PETORRETA AL CONSELL: "L'Emissora d'Imatges Trencada i el Ràdio-Cassette Trencat" (FULL CONTEXT)

**Data:** 28 de juliol de 2026
**Sol·licitant:** IAIA MarIA (Bessó Digital de Sóc de Poble)
**Objectiu:** Auditoria forense i solució arquitectònica per a la fallada de les capacitats multimèdia (Imatge i Àudio) del nostre bot, mantenint la puresa de la Pedra Seca.

---

## 1. CONTEXT GLOBAL I "PEDRA SECA" (Obligatori ingerir-ho tot)
Som **Sóc de Poble**, una iniciativa per a la preservació del patrimoni, la memòria oral i l'etnobotànica de La Torre de les Maçanes i el món rural valencià.
La nostra arquitectura tècnica es basa en el principi de la **Pedra Seca**: sistemes frugals, robustos, sense dependències innecessàries (com llibreries o frameworks inflats), que puguen aguantar dècades amb un manteniment mínim, sense processos màgics ni acoblaments tòxics. Si una funcionalitat trenca el sistema, no ens serveix.
L'**IAIA MarIA** és el nostre agent conversacional (connectat per WhatsApp mitjançant Baileys). Té una personalitat forta ("La Gran Actriu"), parla valencià autèntic, empra el "Trellat" i té la capacitat (via *Function Calling*) de dibuixar "estampes" (estil linogravat, Berlanga, blanc i negre).

## 2. ELS PROBLEMES ACTUALS

1. **GENERACIÓ D'IMATGES (Trencat):** Usàvem `ai.models.generateImages` amb el model `imagen-3.0-generate-001` (o 4.0) a l'SDK gratuït de Gemini (`@google/genai`). Ara Google ha tancat el model per a usuaris gratuïts, llançant l'error `404 NOT_FOUND: This model models/imagen-4.0-generate-001 is no longer available to new users.` Busquem una alternativa robusta i frugal, exclusivament per a generar imatges per REST/Fetch, que s'integre en el nostre codi sense afegir SDKs estranys.
2. **TRANSCRIPCIÓ D'ÀUDIO (Trencat):** La funció `transcriuAudio` (veure codi a baix) usa `gemini-2.5-flash` per processar l'àudio, però els usuaris reporten que tampoc els respon quan li envien notes de veu. (Podria ser un problema amb com l'SDK `@google/genai` versió 2.13.0 processa el `inlineData` de l'àudio o el format de l'àudio de WhatsApp?).
3. **GENERACIÓ DE VÍDEO (Futur):** Volem asseure les bases per poder generar petits vídeos en el futur. Com s'integraria en el nostre flux actual?

## 3. ARQUITECTURA ACTUAL (El "Cervell")
Perquè pugueu analitzar i solucionar el codi de forma precisa, vos facilitem el cor del sistema actual.

### A. `bot/cervell_bridge.mjs` (El Pont d'Enllaç)
Aquest fitxer rep el missatge de WhatsApp (de l'adaptador Baileys que ja és totalment robust) i decideix com passar-ho al cervell de la IAIA.
```javascript
export function createCervellHandler(cervell) {
  if (!cervell || typeof cervell.pensa !== 'function') throw new TypeError('El cervell ha d’implementar pensa');
  return async function handleInbound(envelope) {
    const {  audio, image, sendProgress, signal, senderJid, chatJid } = envelope;
    let question = typeof text === 'string' ? text.trim() : '';
    let audioBytes = null;
    try {
      if (audio) { // AUDIO PROCESSING
        audioBytes = audio.bytes; 
        question = await cervell.transcriuAudio(audio.bytes, audio.mimeType, { signal });
      }
      if (image && !question) question = "Ajuda'm amb esta imatge, per favor.";
      if (typeof question !== 'string' || !question.trim()) return null;
      
      const sender = senderJid || chatJid || null;
      const result = await cervell.pensa(question.trim(), { signal, image, sender });
      if (typeof result === 'string') return { text: result };
      
      const textReply = result?.answer || result?.text || '';
      const imagePrompt = result?.imatgePrompt || result?.imagePrompt || result?.image_prompt || null;
      
      if (imagePrompt && typeof cervell.generaImatge === 'function') { // IMAGE PROCESSING
        if (typeof sendProgress === 'function') {
          await sendProgress(textReply ? `${textReply}\n\n*(Xiquet, dóna'm 2 o 3 minutets que vaig a encendre el llapis...)*` : "*(Xiquet, dóna'm 2 o 3 minutets que vaig a encendre el llapis...)*");
        }
        const generated = await cervell.generaImatge(imagePrompt, { signal });
        if (!generated || (!generated.bytes && !generated.base64)) return { text: 'Ai xiquet, no he pogut fer el dibuix ara mateix. Els pinzells m\'han fallat.' };
        return {
          text: typeof sendProgress === 'function' ? null : textReply,
          image: { bytes: generated.bytes || Buffer.from(generated.base64, 'base64'), mimeType: generated.mimeType || 'image/jpeg' },
        };
      }
      return { text: textReply };
    } finally {
      if (audioBytes && Buffer.isBuffer(audioBytes)) audioBytes.fill(0);
      if (audio?.bytes && Buffer.isBuffer(audio.bytes)) audio.bytes.fill(0);
    }
  };
}
```

### B. `bot/cervell.mjs` (Les Habilitats de la IAIA)
Aquest és el codi actual que comunica amb Gemini (`@google/genai@2.13.0`).
```javascript
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_TIMEOUT_MS = 60_000;

// EL PROBLEMA 1 ESTÀ ACÍ (Transcriu Àudio falla):
export async function transcriuAudio(base64Data, mimetype) {
  try {
    const prompt = "No respongues a l'àudio, no continues el diàleg. Fes només una transcripció literal, paraula per paraula.";
    const data = typeof base64Data === 'string' ? base64Data : Buffer.from(base64Data).toString('base64');
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ text: prompt }, { inlineData: { data, mimeType: mimetype } }],
      }), GEMINI_TIMEOUT_MS, 'Transcripció àudio'
    );
    return (response.text ?? '').trim() || null;
  } catch (err) {
    console.error('[CERVELL] Fallada al transcriure àudio:', err?.message || err);
    return null;
  }
}

// EL PROBLEMA 2 ESTÀ ACÍ (Imatges fallant amb 404):
export async function generaImatge(imagePrompt) {
  try {
    const finalPrompt = `${imagePrompt}, in rustic traditional linocut style, black and white or sepia, high contrast, minimalist, traditional rural Valencian village culture, woodcut art, Luis Garcia Berlanga aesthetic`;
    const response = await withTimeout(
      ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: finalPrompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
      }), 90_000, 'Imagen 4'
    );
    const base64 = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64) return null;
    return { bytes: Buffer.from(base64, 'base64'), mimeType: 'image/jpeg' };
  } catch (err) {
    console.error('[CERVELL] Fallada al generar imatge amb Imagen:', err?.message || err);
    return null;
  }
}

// ... La resta de funcions `pensa` (Function Calling, RAG) funcionen bé.
```

## 4. PREGUNTES I TASQUES PER AL CONSELL D'IES
Amb tot este coneixement en el vostre poder, us demanem, com a Arquitectes d'IA:

1. **Àudio:** Analitzeu la nostra funció `transcriuAudio`. Per què pot estar fallant amb Baileys i l'SDK `@google/genai@2.13.0`? És correcte passar `inlineData` així per a un arxiu ogg/opus que ens envia WhatsApp, o cal configurar algun paràmetre addicional a Gemini? Escriviu-nos la funció `transcriuAudio` corregida per a que les notes de veu funcionen impecablement.
2. **Imatges (Alternativa Pedra Seca):** Quina API REST externa ens recomaneu integrar exclusivament per a les imatges, atès que Google ho ha bloquejat en la capa gratuïta? Ha de ser *pay-as-you-go*, barata, i que puga fer estampes increïbles. Proporcioneu-nos la funció `generaImatge(imagePrompt)` completament refactoritzada usant exclusivament un `fetch` natiu (res de nous SDKs) adaptada a l'API recomanada, capturant els errors (try/catch) de manera segura perquè el flux no rebente mai.
3. **Vídeo:** Conceptualment, si l'usuari diguera "crea'm un vídeo del poble", quina eina s'alinea amb la nostra filosofia i com encaixaria al `cervell_bridge.mjs` i el *Function Calling* en el futur? (No cal codi ací, només visió tècnica).

Feu el que millor sabeu fer: pensar amb profunditat i construir sistemes invulnerables. Tota la saviesa del poble confia en vosaltres.


---

**Ancoratge de Seguretat:** [[00_INDEX]]