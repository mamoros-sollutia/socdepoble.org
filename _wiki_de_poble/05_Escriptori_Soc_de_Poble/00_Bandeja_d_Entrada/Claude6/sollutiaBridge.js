/**
 * sollutiaBridge.js — PONT AMB L'AMFITRIÓ (Sollutia / WordPress)
 *
 * REESCRIT PER L'AUDITORIA 260831. Defectes de la versió anterior:
 *
 *   1. `handleMessage` no comparava `event.origin`. La validació estava
 *      escrita com a comentari («Validar origen si escau: ...»). Qualsevol
 *      finestra amb un handle podia injectar `{type, payload}` al bus de
 *      subscriptors de l'aplicació.
 *   2. `postMessage(carrega, '*')` difonia a l'amfitrió que fos. Si algú ens
 *      emmarcava, ho rebia tot.
 *   3. `new SollutiaBridge()` s'executava a la importació del mòdul i llegia
 *      `window.SOLLUTIA_ENV` en eixe instant. Si l'amfitrió el definia després
 *      del bundle, el pont quedava mort per sempre sense dir-ho.
 *   4. `window` al nivell superior: el mòdul petava en qualsevol entorn sense
 *      DOM (proves, SSR, `tooling/mocks/sollutiaBackend.js`).
 *
 * CONTRACTE
 *   · L'amfitrió declara el seu origen. Sense origen declarat, el pont no
 *     escolta i no parla. Fail-closed: el silenci és el mode segur.
 *   · L'origen es llig en `arranca()`, no a la importació.
 *   · Vigilat per `tooling/gates/tractor-postmissatge.mjs` (F1–F4).
 */

const ORIGEN_PER_DEFECTE = [];

/** Normalitza a origen pur («https://x.com»), o null si no és una URL vàlida. */
const aOrigen = (valor) => {
  try { return new URL(valor).origin; } catch { return null; }
};

class PontSollutia {
  constructor() {
    this.subscriptors = new Set();
    this.origensPermesos = new Set();
    this.actiu = false;
    this._oient = null;
  }

  /**
   * Arranca el pont. Cal cridar-la explícitament des de `PedraSecaEmbed.jsx`
   * DESPRÉS que l'amfitrió haja tingut ocasió de definir la configuració.
   *
   * @param {{origens?: string[]}} config  origens de l'amfitrió, absoluts.
   * @returns {boolean} true si ha quedat escoltant.
   */
  arranca(config = {}) {
    if (this.actiu) return true;
    if (typeof window === 'undefined') return false;

    const bruts = config.origens
      ?? window.SOLLUTIA_ENV?.origens
      ?? ORIGEN_PER_DEFECTE;

    for (const o of bruts) {
      const net = aOrigen(o);
      if (net) this.origensPermesos.add(net);
    }
    /* El nostre propi origen sempre val: som nosaltres parlant amb nosaltres. */
    this.origensPermesos.add(window.location.origin);

    if (bruts.length === 0) {
      /* Cap origen d'amfitrio declarat. No obrim el canal: un pont que
       * accepta de tothom no es un pont, es una porta oberta. */
      console.warn('[PontSollutia] Cap origen d\'amfitrio declarat. El pont queda tancat.');
      return false;
    }

    this._oient = (e) => this._rep(e);
    window.addEventListener('message', this._oient);
    this.actiu = true;
    return true;
  }

  atura() {
    if (this._oient) window.removeEventListener('message', this._oient);
    this._oient = null;
    this.actiu = false;
    this.subscriptors.clear();
  }

  /** Gestor. Igualtat exacta d'origen: res de `startsWith` ni `includes`. */
  _rep(event) {
    if (!this.origensPermesos.has(event.origin)) return;
    const d = event.data;
    if (!d || typeof d !== 'object' || typeof d.type !== 'string') return;
    /* Ens parlem a nosaltres mateixos per `postMessage`? Ignora'ns: si no,
     * `envia()` es realimenta en l'escenari de mateixa finestra. */
    if (d.source === 'soc-de-poble') return;
    for (const cb of this.subscriptors) {
      try { cb(d); } catch (err) { console.error('[PontSollutia] subscriptor:', err); }
    }
  }

  subscriu(callback) {
    this.subscriptors.add(callback);
    return () => this.subscriptors.delete(callback);
  }

  /**
   * Envia cap amunt. Un `postMessage` per origen declarat, mai `'*'`.
   * Si el pont no esta arrancat, no fa res: no filtrem per accident.
   */
  envia(type, payload) {
    if (!this.actiu || typeof window === 'undefined') return false;
    const mare = window.parent;
    if (!mare || mare === window) return false;
    const carrega = { source: 'soc-de-poble', type, payload };
    let enviats = 0;
    for (const origen of this.origensPermesos) {
      if (origen === window.location.origin) continue;
      try { mare.postMessage(carrega, origen); enviats += 1; } catch { /* origen no valid ara */ }
    }
    return enviats > 0;
  }
}

export const pontSollutia = new PontSollutia();
export { PontSollutia };
