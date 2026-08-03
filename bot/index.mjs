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
  console.log(`[BOT] Política de grups: ${process.env.IAIA_GRUPS || 'cap (defecte fail-closed)'}`);

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
    config: grups,
  });

  installShutdownHandlers(whatsapp);
}

main().catch((err) => {
  console.error("[BOT] Error fatal a l'arrancada:", err);
  process.exit(1);
});
