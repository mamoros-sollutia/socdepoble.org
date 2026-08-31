/**
 * PedraSecaEmbed.jsx — <soc-de-poble>
 * ---------------------------------------------------------------------------
 * Correccions respecte de la versió auditada:
 *
 *  P0-1 MORT PER MOVIMENT DE DOM. `connectedCallback` es protegia amb
 *       `if (!this.shadowRoot)`. El shadow root SOBREVIU a un moviment de node,
 *       així que en tornar a connectar la guarda impedia tornar a muntar: el
 *       component quedava mort per sempre. WordPress (Gutenberg, Elementor)
 *       mou nodes constantment. Ara la guarda és sobre l'arrel de React i el
 *       shadow root es reaprofita.
 *
 *  P0-2 CURSA DEL setTimeout. El desmuntatge diferit s'executava encara que el
 *       node es reconnectara dins del mateix tick, matant l'arrel nova. Ara es
 *       cancel·la a `connectedCallback`.
 *
 *  P0-3 @font-face DINS DEL SHADOW DOM. Per especificació, un `@font-face`
 *       declarat dins d'un shadow root NO es registra: només compta l'arbre del
 *       document. A més, les URL relatives de `noto-sans.css` es resoldrien
 *       contra la pàgina de WordPress i donarien 404. Les fonts es carreguen
 *       ara al document, una sola vegada, via `fonts-href`.
 *
 *  P0-4 CSS DUPLICAT PER INSTÀNCIA. Cada instància injectava una còpia sencera
 *       del full (~150 kB). Ara es comparteix un únic `CSSStyleSheet` mitjançant
 *       `adoptedStyleSheets`.
 *
 *  P0-5 CONFIG MUTADA EN LLOC. `this.config` es mutava conservant la identitat
 *       de l'objecte, així que qualsevol `useMemo`/comparació per referència
 *       aigües avall veia el valor vell. Ara cada canvi crea un objecte nou.
 *       Llevar un atribut tampoc no netejava mai el valor: ara sí.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './app/App';
import { AppDataProvider } from './app/AppDataContext';
import { destroyToastSystem } from './components/universal/AvisadorEfimer.jsx';
import styles from './css/index.css?inline';
import legacyStyles from './css/legacy-components.css?inline';
import { readThemePreference, resolveTheme } from './config/theme';

/* ───────────────────────────── Error boundary ──────────────────────────── */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('[PedraSeca] Error capturat pel límit de React:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="alert">
          <h2>No s'ha pogut carregar Sóc de Poble</h2>
          <p>Torna a carregar la pàgina. Si continua, avisa l'administrador del lloc.</p>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function PedraSecaEmbed({ config }) {
  const RouterComponent = config.routerType === 'browser' ? BrowserRouter : 
                          config.routerType === 'memory' ? MemoryRouter : BrowserRouter;
  const routerProps = config.basename ? { basename: config.basename } : {};

  return (
    <ErrorBoundary>
      <RouterComponent {...routerProps}>
        <AppDataProvider externalConfig={config}>
          <App />
        </AppDataProvider>
      </RouterComponent>
    </ErrorBoundary>
  );
}

/* ──────────────────── Full d'estils compartit (P0-4) ───────────────────── */

let fullCompartit = null;

function obtenirFull() {
  if (fullCompartit) return fullCompartit;
  if (typeof CSSStyleSheet === 'undefined') return null;
  try {
    const full = new CSSStyleSheet();
    full.replaceSync(`:host{display:block;width:100%;height:100%;}\n${styles}`);
    const fullLegacy = new CSSStyleSheet();
    fullLegacy.replaceSync(legacyStyles);
    fullCompartit = [full, fullLegacy];
    return fullCompartit;
  } catch {
    return null; /* navegador sense adoptedStyleSheets → recurs de <style> */
  }
}

/* ─────────────────────── Fonts al document (P0-3) ──────────────────────── */

const fontRefCount = new Map();

function carregarFonts(href) {
  if (!href || typeof document === 'undefined') return;
  const key = encodeURIComponent(href);
  const current = fontRefCount.get(key) || 0;
  fontRefCount.set(key, current + 1);

  if (current === 0 && !document.querySelector(`link[data-sdp-fonts="${key}"]`)) {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'style';
    preload.href = href;
    preload.setAttribute('data-sdp-fonts-preload', key);
    document.head.appendChild(preload);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-sdp-fonts', key);
    document.head.appendChild(link);
  }
}

function descarregarFonts(href) {
  if (!href || typeof document === 'undefined') return;
  const key = encodeURIComponent(href);
  const current = fontRefCount.get(key) || 0;
  fontRefCount.set(key, Math.max(0, current - 1));

  if (fontRefCount.get(key) === 0) {
    const link = document.querySelector(`link[data-sdp-fonts="${key}"]`);
    if (link) link.remove();
    const preload = document.querySelector(`link[data-sdp-fonts-preload="${key}"]`);
    if (preload) preload.remove();
  }
}

/* ───────────────────────────── Element custom ──────────────────────────── */

const BaseElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

export const activeElements = new Set();

const ATRIBUTS = {
  'base-path': 'basePath',
  'supabase-url': 'supabaseUrl',
  'supabase-anon-key': 'supabaseAnonKey',
  'data-mode': 'dataMode',
  'bot-api-url': 'botApiUrl',
  'fonts-href': 'fontsHref',
  'plugin-url': 'pluginUrl'
};

const CLAUS_PERMESES = new Set([
  'basePath','supabaseUrl','supabaseAnonKey','dataMode','botApiUrl',
  'fontsHref','pluginUrl','routerType','basename','tenantId','language','themeMode',
  'user', 'userId', 'manageDocumentHead', 'version', 'oauthRelayUrl'
]);

function sanejaConfig(cru) {
  const net = {};
  for (const clau of CLAUS_PERMESES) {
    if (clau in cru) net[clau] = cru[clau];
  }
  const CAMPOS_URL = ['supabaseUrl', 'botApiUrl', 'basePath', 'pluginUrl', 'fontsHref'];
  for (const field of CAMPOS_URL) {
    if (net[field]) {
      try {
        const cruUrl = net[field];
        if (cruUrl.startsWith('//')) { delete net[field]; continue; } // Z: bloqueig de protocol-relative
        const u = new URL(cruUrl, window.location.origin);
        if (u.protocol !== 'https:' && u.protocol !== 'http:' && !cruUrl.startsWith('/')) {
          delete net[field];
        }
      } catch { delete net[field]; }
    }
  }
  return net;
}

class SocDePobleElement extends BaseElement {
  static get observedAttributes() {
    return [...Object.keys(ATRIBUTS), 'config', 'config-id'];
  }

  constructor() {
    super();
    this._config = {};
    this._configProp = {};
    this._root = null;
    this._punt = null;
    this._pendingUnmount = false;
    this._graceTimer = null;
    this._hasMountedReact = false;
    this._manualLanguage = null;
  }

  /** Propietat JS: permet passar objectes rics (WordPress, React host, Vue…). */
  set config(valor) {
    this._configProp = valor && typeof valor === 'object' ? valor : {};
    this._recalcularConfig();
    this._render();
  }
  get config() {
    return this._config;
  }

  connectedCallback() {
    this._pendingUnmount = false;
    if (this._unmountListener) {
      document.removeEventListener('visibilitychange', this._unmountListener);
      this._unmountListener = null;
    }

    // Convertim activeElements a array abans d'iterar per evitar mutar el set mentre l'iterem
    const elementsActuals = Array.from(activeElements);
    for (const old of elementsActuals) {
      if (old !== this && old.isConnected && typeof old._desmuntaAra === 'function') {
        old._desmuntaAra(); // Últim que arriba guanya: desmuntatge SÍNCRON
      }
      // Netejem possibles zombis (ara de forma segura)
      if (old !== this && !old.isConnected) {
        if (typeof old._desmuntaAra === 'function') old._desmuntaAra();
      }
    }

    activeElements.add(this);
    this._hasMountedReact = true;

    /* El shadow root sobreviu als moviments: es reaprofita, no es recrea. */
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

    const arrel = this.shadowRoot;
    const full = obtenirFull();
    if (full && 'adoptedStyleSheets' in arrel) {
      try {
        let currentSheets = Array.from(arrel.adoptedStyleSheets);
        full.forEach(sheet => {
          if (!currentSheets.includes(sheet)) currentSheets.push(sheet);
        });
        arrel.adoptedStyleSheets = currentSheets;
      } catch {
        // Fallback robust per a certs entorns (WP editor) que trenquen adoptedStyleSheets
      }
    } 
    
    if (!full || !('adoptedStyleSheets' in arrel) || arrel.adoptedStyleSheets.length === 0) {
      if (!arrel.querySelector('style[data-sdp-fallback]')) {
        const style = document.createElement('style');
        style.setAttribute('data-sdp-fallback', '');
        style.textContent = `soc-de-poble { display: block; width: 100%; height: 100%; }\n${styles}\n${legacyStyles}`;
        arrel.prepend(style);
      }
    }

    if (!this._punt || !this._punt.isConnected) {
      this._punt = document.createElement('div');
      this._punt.className = 'sdp-root';
      arrel.appendChild(this._punt);
    }

    this._recalcularConfig();
    this.dataset.theme = resolveTheme(this._config.themeMode ?? readThemePreference());

    /* P0-1: la guarda va sobre l'arrel de React, no sobre el shadow root. */
    if (!this._root) {
      /* Auditoria 260830: ací hi havia freezeImplementation(). Segellar el
         backend dins del cicle de vida deixava una finestra d'injecció de zero
         mil·lisegons, perquè customElements.define() dispara connectedCallback
         síncronament quan l'etiqueta ja és al DOM (el cas de WordPress).
         El segellat viu ara a src/host.js:arrenca(). Vegeu tractor-enxufe.mjs. */
      this._root = createRoot(this._punt);
    }
    this._render();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    if (this._recalcularConfig()) {
      this._render();
    }
  }

  /** P0-5: objecte nou cada vegada; llevar un atribut esborra el valor. */
  _recalcularConfig() {
    const desDAtributs = {};
    for (const [attr, clau] of Object.entries(ATRIBUTS)) {
      const v = this.getAttribute(attr);
      if (v !== null) desDAtributs[clau] = v;
    }

    let desDeJson = {};
    const configId = this.getAttribute('config-id');
    if (configId) {
      try {
        const scriptEl = document.getElementById(configId);
        if (scriptEl && scriptEl.type === 'application/json') {
          const parsed = JSON.parse(scriptEl.textContent);
          if (parsed && typeof parsed === 'object') desDeJson = parsed;
        }
      } catch {
        console.warn('[soc-de-poble] L\'atribut "config-id" no s\'ha pogut llegir.');
      }
    }

    const cru = this.getAttribute('config');
    if (cru) {
      try {
        const parsed = JSON.parse(cru);
        if (parsed && typeof parsed === 'object') desDeJson = { ...desDeJson, ...parsed };
      } catch {
        console.warn('[soc-de-poble] L\'atribut "config" no és JSON vàlid; s\'ignora.');
      }
    }

    const configObject = { ...desDeJson, ...desDAtributs, ...this._configProp };
    if (!configObject.pluginUrl && this.getAttribute('plugin-url')) {
      configObject.pluginUrl = this.getAttribute('plugin-url');
    }
    
    if (!configObject.basename && configObject.basePath && configObject.basePath !== '/') {
      configObject.basename = configObject.basePath;
    }
    
    const rawConfig = sanejaConfig(configObject);
    if (this._manualLanguage) {
      rawConfig.language = this._manualLanguage;
    }
    
    let canviat = false;
    if (!this._config || Object.keys(rawConfig).length !== Object.keys(this._config).length) {
      canviat = true;
    } else {
      for (const key in rawConfig) {
        if (rawConfig[key] !== this._config[key]) {
          canviat = true;
          break;
        }
      }
    }

    if (canviat) {
      const oldFontsHref = this._config?.fontsHref;
      this._config = { ...rawConfig };
      if (oldFontsHref && oldFontsHref !== this._config.fontsHref) {
        descarregarFonts(oldFontsHref);
      }
      if (this._config.fontsHref) {
        carregarFonts(this._config.fontsHref);
      }
    }
    return canviat;
  }

  _render() {
    if (!this._root) return;
    this._root.render(
      <PedraSecaEmbed config={this._config} />
    );
  }

  // API Pública per a Sollutia
  refreshData() {
    if (this._punt) {
      this._punt.dispatchEvent(new CustomEvent('sdp:refresh-data', { bubbles: true, composed: true }));
    }
  }
  
  getCurrentUser() {
    return import('./data/backendPort.js').then(m => m.getCurrentUser());
  }

  on(event, callback) {
    this.addEventListener(event, callback);
  }

  setTheme(theme) {
    this._config = { ...this._config, themeMode: theme };
    this.dataset.theme = resolveTheme(theme);
    this._render();
  }
  
  getShadowRoot() {
    return this.shadowRoot;
  }
  
  getInternalRoot() {
    return this._punt;
  }
  
  setLanguage(lang) {
    this._manualLanguage = lang;
    this._config = { ...this._config, language: lang };
    this._render();
  }

  _forcaDesmuntatge() {
    this._desmuntaAra();
  }
  
  _desmuntaAra() {
    this._pendingUnmount = false;
    
    if (this._config && this._config.fontsHref) {
      descarregarFonts(this._config.fontsHref);
    }
    
    if (this._unmountListener) {
      document.removeEventListener('visibilitychange', this._unmountListener);
      this._unmountListener = null;
    }
    
    try { this._root?.unmount(); } catch { /* WebKit legacy pot plorar */ }
    this._root = null;
    this._punt?.remove();
    this._punt = null;
    this._hasMountedReact = false;
    
    activeElements.delete(this);
    
    destroyToastSystem();
  }

  disconnectedCallback() {
    if (!this._root || this._pendingUnmount) return;
    
    this._pendingUnmount = true;
    queueMicrotask(() => {
      if (!this._pendingUnmount) return;
      this._pendingUnmount = false;
      if (this.isConnected) return;
      
      if (document.visibilityState === 'visible') {
        this._desmuntaAra();
      } else {
        const unmountOnVisible = () => {
          if (document.visibilityState === 'visible') {
            document.removeEventListener('visibilitychange', unmountOnVisible);
            this._unmountListener = null;
            if (!this.isConnected) this._desmuntaAra();
          }
        };
        // Netejar listener vell si n'hi ha abans d'assignar el nou
        if (this._unmountListener) {
          document.removeEventListener('visibilitychange', this._unmountListener);
        }
        this._unmountListener = unmountOnVisible;
        document.addEventListener('visibilitychange', unmountOnVisible);
      }
    });
  }
}

export function defineCustomElement() {
  if (typeof window === 'undefined') return;

  if (!window.__SDP_GLOBAL_ERRORS_BOUND__) {
    window.addEventListener('unhandledrejection', (event) => {
      const err = event.reason;
      const strErr = String(err);
      
      // Kimi: Només engolir si té a veure amb Sóc de Poble i no som en dev
      if (strErr.includes('sdp') || strErr.includes('soc-de-poble') || err?.stack?.includes('soc-de-poble')) {
        if (err?.name === 'QuotaExceededError' || strErr.includes('QuotaExceeded')) {
          console.warn('[PedraSeca] QuotaExceeded global capturat. Confiem en fallbacks.');
          event.preventDefault(); // Evitem que embrute la consola del WP
        } else {
          // Si no som a Vite env (process env no existeix fàcilment ací a no ser que ho fiquem), ens callem l'error 
          console.warn('[PedraSeca] Promesa rebutjada globalment:', err);
        }
      }
    });
    window.__SDP_GLOBAL_ERRORS_BOUND__ = true;
  }

  if (!customElements.get('soc-de-poble')) {
    customElements.define('soc-de-poble', SocDePobleElement);
  }
}
