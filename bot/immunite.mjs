import { sessions } from './cervell.mjs';
import { purgeExpired } from './memoria/episodica.mjs';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hores

let cicleEnCurs = false;
let timer = null;

export async function runPlaquetes() {
  if (cicleEnCurs) return;
  cicleEnCurs = true;
  console.log('[PLAQUETES] Iniciant cicle immunitari...');
  
  try {
    // 1. Purga sessions mortes (LRU radical)
    const ara = Date.now();
    let purgades = 0;
    const aEsborrar = [];
    for (const [veihash, sessio] of sessions) {
      if (ara - sessio.lastSeen > SESSION_TTL_MS) aEsborrar.push(veihash);
    }
    for (const veihash of aEsborrar) {
      sessions.delete(veihash);
      purgades++;
    }
    if (purgades > 0) console.log(`[PLAQUETES] Sessions purgades: ${purgades}`);
    
    // 2. Purga memòria episòdica expirada per GDPR
    try {
      await purgeExpired();
    } catch (error) {
      console.error('[PLAQUETES] Error purgant memòria episòdica:', error);
    }
  } finally {
    cicleEnCurs = false;
  }
}

export function startPlaquetes() {
  if (timer) return;
  timer = setInterval(() => void runPlaquetes(), 15 * 60 * 1000);
  timer.unref();
  void runPlaquetes(); // run once immediately
  console.log('[PLAQUETES] Sistema immunitari activat (cicle 15 min).');
}

export function stopPlaquetes() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
