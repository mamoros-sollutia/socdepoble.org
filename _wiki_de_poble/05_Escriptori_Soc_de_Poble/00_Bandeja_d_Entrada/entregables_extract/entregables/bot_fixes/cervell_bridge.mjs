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
