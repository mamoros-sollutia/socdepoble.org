import { reclama, confirma, ajorna, pendents } from './outbox.js';
import { appendChatMessages, appendSectionSubmissionNetworkOnly } from './supabaseBackend.js';

let corrent = false;

export async function buida(config) {
  if (corrent || !navigator.onLine) return;
  corrent = true;
  try {
    let lot;
    while ((lot = await reclama()).length > 0) {
      for (const r of lot) {
        try {
          if (r.tipus === 'submission') {
            await appendSectionSubmissionNetworkOnly(r.payload, config);
          } else {
            // Per defecte és xat per compatibilitat endarrerida
            await appendChatMessages([r.payload || r.carrega], config);
          }
          await confirma(r.id);
        } catch (e) {
          console.warn('[SINCRONITZADOR] Error enviant registre, s\'ajorna:', e);
          await ajorna(r);
        }
      }
      if (!navigator.onLine) break;
    }
  } catch(e) {
    console.error('[SINCRONITZADOR] Falla crítica al bucle de buidatge:', e);
  } finally { corrent = false; }
}

export function arrancaSincronitzador(config) {
  const disparador = () => buida(config).catch(e => console.error(e));
  
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') disparador();
  };

  window.addEventListener('online', disparador);
  document.addEventListener('visibilitychange', handleVisibility);
  
  const rellotge = setInterval(disparador, 30_000);
  disparador();
  
  return () => {
    window.removeEventListener('online', disparador);
    document.removeEventListener('visibilitychange', handleVisibility);
    clearInterval(rellotge);
  };
}

export const compta = async () =>
  (await pendents()).filter((r) => r.estat !== 'confirmat').length;
