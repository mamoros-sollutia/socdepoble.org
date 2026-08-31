/**
 * main.jsx — Punt d'entrada del build de desenvolupament i del standalone.
 *
 * CANVI 260830: abans cridava `defineCustomElement()` directament, cosa que
 * segellava el backend a l'instant i no deixava cap finestra perquè un host
 * (Sollutia) injectara la seua implementació. Ara l'arrencada passa per
 * `host.js`, que separa configuració i segellat en dues fases.
 *
 * Ordre resultant:
 *   1 · es carrega el bundle i s'exposa `window.SocDePoble`
 *   2 · un <script> del host pot cridar `window.SocDePoble.configura({...})`
 *   3 · `arrencaAuto()` segella i defineix l'element al següent tick
 *
 * Si ningú configura res, el comportament és idèntic al d'abans: Supabase.
 */

import { arrencaAuto, exposaGlobal } from './host.js';

// El build standalone de WordPress no és ESM: sense aquest global, un host que
// el carregue amb un <script> pla no té cap manera d'arribar al port.
exposaGlobal();

const init = () => {
  // Programa el segellat per al següent tick. Un <script> col·locat després
  // del bundle encara arriba a temps de cridar configura().
  arrencaAuto();

  // Desenvolupament local amb Vite: instanciem l'element com faria WordPress.
  const arrel = document.getElementById('root');
  if (arrel && !arrel.innerHTML) {
    const element = document.createElement('soc-de-poble');
    element.setAttribute('fonts-href', '/src/assets/fonts/noto-sans.css');
    element.setAttribute('config', JSON.stringify({
      pluginUrl: '/',
      supabaseUrl: (typeof import.meta !== 'undefined' && import.meta.env)
        ? import.meta.env.VITE_SUPABASE_URL
        : '',
      supabaseAnonKey: (typeof import.meta !== 'undefined' && import.meta.env)
        ? import.meta.env.VITE_SUPABASE_ANON_KEY
        : '',
      dataMode: (typeof import.meta !== 'undefined' && import.meta.env)
        ? import.meta.env.VITE_DATA_MODE
        : undefined,
    }));
    arrel.appendChild(element);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
