/**
 * sincronitzador.js — Motor de buidatge de la cua d'eixida.
 *
 * ---------------------------------------------------------------------------
 * CORRECCIONS RESPECTE DE LA VERSIÓ AUDITADA (27/08/2026)
 *
 *  P0-3  EL MOTOR NO ESTAVA CONNECTAT. `arrancaSincronitzador` tenia ZERO
 *        cridadors en tot l'arbre. `buida()` només s'invocava des de
 *        `sendChatMessage` i `sendSectionSubmission`, i la seua primera línia
 *        és `if (!navigator.onLine) return`. Resultat: si la persona escrivia
 *        sense cobertura i tornava la cobertura sense escriure res més, els
 *        missatges no eixien MAI. Tota la maquinària de reintents, retards i
 *        arrendaments d'`outbox.js` era codi mort.
 *        → Cal cridar `arrancaSincronitzador()` des d'`AppDataProvider`.
 *          Vegeu el bloc de connexió al final d'este fitxer.
 *
 *  P1-2  `compta()` FILTRAVA PER UN ESTAT INEXISTENT. `estat !== 'confirmat'`
 *        no descartava res, perquè els confirmats s'esborraven. Comptava morts
 *        i sentinelles: el globus de "pendents" no baixava mai de zero.
 *        Ara compta el que és de veres pendent: `pendent` i `enviant`.
 *
 *  P1-9  REENVIAMENT PER CONFIRMACIÓ FALLIDA. Si l'enviament reeixia però
 *        `confirma()` petava, el registre tornava a la cua i s'enviava un altre
 *        colp. Ara hi ha una guarda de sessió (`lliurats`) a més de la làpida
 *        d'`outbox.js`.
 *
 *  P1-10 BUCLE SENSE SOSTRE. `while (lot.length > 0)` sense límit de voltes.
 *        Ara hi ha `MAX_VOLTES`; el que quede es reprén al pròxim cicle.
 *
 *  P1-11 CÀRREGA MAL LLEGIDA. `r.payload || r.carrega` per al xat: `encua()`
 *        guarda el xat a `carrega` i els enviaments a `payload`. Ara es llig
 *        cadascun pel seu camp.
 * ---------------------------------------------------------------------------
 */
import { reclama, confirma, ajorna, pendents, enviaSigneVida, escombra } from './outbox.js';
import { appendChatMessages, appendSectionSubmissionNetworkOnly } from './backendPort.js';

const MAX_VOLTES = 50;
const INTERVAL_MS = 30_000;
const ESCOMBRA_CADA = 20;         // ~1 recollida de fem cada 10 minuts

let corrent = false;

/**
 * Ids ja lliurats a la xarxa en esta sessió però encara no confirmats a disc.
 * Segona línia de defensa contra el reenviament: si `confirma()` peta, el
 * registre continua a la cua, i quan el tornem a reclamar sabem que ja va eixir.
 */
const lliurats = new Set();

const senseXarxa = () =>
  typeof navigator !== 'undefined' && navigator.onLine === false;

/**
 * Buida la cua. No llança mai: torna un resum.
 * Segur si es crida en paral·lel: la guarda `corrent` serialitza dins de la
 * pestanya, i l'arrendament readwrite d'`outbox.js` serialitza entre pestanyes.
 */
export async function buida(config) {
  if (corrent) return { enviats: 0, ajornats: 0, voltes: 0, motiu: 'ja-corrent' };
  if (senseXarxa()) return { enviats: 0, ajornats: 0, voltes: 0, motiu: 'sense-xarxa' };

  corrent = true;
  let enviats = 0;
  let ajornats = 0;
  let voltes = 0;

  try {
    let lot;
    while (voltes < MAX_VOLTES && (lot = await reclama()).length > 0) {
      voltes += 1;

      for (const r of lot) {
        /* Ja va eixir a la xarxa i només falta netejar-lo del disc. */
        if (lliurats.has(r.id)) {
          try {
            await confirma(r.id);
            lliurats.delete(r.id);
          } catch (e) {
            console.warn('[SINCRONITZADOR] Confirmació pendent per a', r.id, e);
          }
          continue;
        }

        try {
          if (r.tipus === 'submission') {
            await appendSectionSubmissionNetworkOnly(r.payload, config);
          } else {
            await appendChatMessages([r.carrega ?? r.payload], config);
          }

          /* Marquem ABANS de confirmar: si l'esborrat peta, el pròxim cicle
             sabrà que este registre ja va eixir i no el reenviarà. */
          lliurats.add(r.id);
          await confirma(r.id);
          lliurats.delete(r.id);
          enviats += 1;
        } catch (e) {
          console.warn('[SINCRONITZADOR] Enviament fallit, s\'ajorna:', r.id, e);
          try {
            await ajorna(r);
          } catch (e2) {
            console.error('[SINCRONITZADOR] Tampoc s\'ha pogut ajornar:', r.id, e2);
          }
          ajornats += 1;
        }
      }

      if (senseXarxa()) break;
    }

    if (voltes >= MAX_VOLTES) {
      console.warn('[SINCRONITZADOR] Límit de voltes assolit; es reprén al pròxim cicle.');
    }
  } catch (e) {
    console.error('[SINCRONITZADOR] Falla crítica al bucle de buidatge:', e);
  } finally {
    corrent = false;
  }

  return { enviats, ajornats, voltes };
}

/**
 * P0-3. Arranca el motor. SENSE ESTA CRIDA LA CUA NO ES BUIDA MAI.
 *
 * Torna una funció de neteja pensada per a un `useEffect`:
 *
 *     useEffect(() => arrancaSincronitzador(stableExternalConfig), [stableExternalConfig]);
 *
 * Disparadors: torna la cobertura, torna la pestanya a primer pla, i un
 * rellotge de seguretat. El rellotge també renova el signe de vida (defensa
 * contra el 7-Day Purge de Safari) i passa l'escombra de tant en tant.
 */
export function arrancaSincronitzador(config, opcions = {}) {
  if (typeof window === 'undefined') return () => {};

  const intervalMs = opcions.intervalMs ?? INTERVAL_MS;
  const escombraCada = opcions.escombraCada ?? ESCOMBRA_CADA;

  let viu = true;
  let cicles = 0;

  const disparador = () => {
    if (!viu) return;
    buida(config).catch((e) => console.error('[SINCRONITZADOR]', e));
  };

  const perVisibilitat = () => {
    if (document.visibilityState === 'visible') disparador();
  };

  const tic = () => {
    if (!viu) return;
    cicles += 1;
    enviaSigneVida().catch(() => {});
    if (cicles % escombraCada === 0) escombra().catch(() => {});
    disparador();
  };

  window.addEventListener('online', disparador);
  document.addEventListener('visibilitychange', perVisibilitat);
  const rellotge = setInterval(tic, intervalMs);

  /* Arrancada en fred: pot haver-hi cua d'una sessió anterior. */
  enviaSigneVida().catch(() => {});
  disparador();

  return () => {
    viu = false;
    window.removeEventListener('online', disparador);
    document.removeEventListener('visibilitychange', perVisibilitat);
    clearInterval(rellotge);
  };
}

/**
 * P1-2. Quants missatges esperen de veres.
 * Els morts, les làpides i els sentinelles no són pendents: no compten.
 */
export const compta = async () =>
  (await pendents()).filter((r) => r.estat === 'pendent' || r.estat === 'enviant').length;

/* ---------------------------------------------------------------------------
 * CONNEXIÓ REQUERIDA — src/app/AppDataContext.jsx
 *
 *   import { buida, arrancaSincronitzador } from '../data/sincronitzador.js';
 *
 *   // dins d'AppDataProvider, al costat dels altres useEffect:
 *   useEffect(
 *     () => arrancaSincronitzador(stableExternalConfig),
 *     [stableExternalConfig]
 *   );
 *
 * Sense estes tres línies, `outbox.js` continua sent una cua d'escriptura
 * només: guarda els missatges de l'uelo i no els envia mai.
 * --------------------------------------------------------------------------- */
