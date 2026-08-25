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
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { AppDataProvider } from './app/AppDataContext';
import styles from './css/index.css?inline';
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
  render() {
    if (this.state.hasError) {
      return (
        <div className="sdp-p-4">
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
  const basePath = config?.basePath || '/';

  const RouterComponent = BrowserRouter;
  const routerProps = { basename: basePath === '/' ? '' : basePath };

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
    full.replaceSync(`:host{display:block;width:100%;}\n${styles}`);
    fullCompartit = full;
    return full;
  } catch {
    return null; /* navegador sense adoptedStyleSheets → recurs de <style> */
  }
}

/* ─────────────────────── Fonts al document (P0-3) ──────────────────────── */

function carregarFonts(href) {
  if (!href || typeof document === 'undefined') return;
  if (!document.querySelector(`link[data-sdp-fonts="${CSS.escape(href)}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-sdp-fonts', href);
    document.head.appendChild(link);
  }
}

function descarregarFonts(href) {
  if (!href || typeof document === 'undefined') return;
  const numInstancies = document.getElementsByTagName('soc-de-poble').length;
  if (numInstancies > 0) return;
  const link = document.querySelector(`link[data-sdp-fonts="${CSS.escape(href)}"]`);
  if (link) link.remove();
}

/* ───────────────────────────── Element custom ──────────────────────────── */

const BaseElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

const ATRIBUTS = {
  'base-path': 'basePath',
  'supabase-url': 'supabaseUrl',
  'supabase-anon-key': 'supabaseAnonKey',
  'data-mode': 'dataMode',
  'bot-api-url': 'botApiUrl',
  'fonts-href': 'fontsHref',
  'plugin-url': 'pluginUrl'
};

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
    this._desmuntatge = null;
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
    
    /* P0-2: cancel·la un desmuntatge pendent si tornem a entrar al DOM. */
    if (this._desmuntatge !== null) {
      cancelAnimationFrame(this._desmuntatge);
      clearTimeout(this._desmuntatgeTimeout);
      this._desmuntatge = null;
    }

    /* El shadow root sobreviu als moviments: es reaprofita, no es recrea. */
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

    const arrel = this.shadowRoot;
    const full = obtenirFull();
    if (full && 'adoptedStyleSheets' in arrel) {
      try {
        if (!arrel.adoptedStyleSheets.includes(full)) {
          arrel.adoptedStyleSheets = [...arrel.adoptedStyleSheets, full];
        }
      } catch {
        // Fallback robust per a certs entorns (WP editor) que trenquen adoptedStyleSheets
      }
    } 
    
    if (!full || !('adoptedStyleSheets' in arrel) || arrel.adoptedStyleSheets.length === 0) {
      if (!arrel.querySelector('style[data-sdp]')) {
        const style = document.createElement('style');
        style.setAttribute('data-sdp', '');
        style.textContent = `:host{display:block;width:100%;}\n${styles}`;
        arrel.appendChild(style);
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
    if (!this._root) this._root = createRoot(this._punt);
    this._render();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this._recalcularConfig();
    this._render();
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

    const rawConfig = { ...desDeJson, ...desDAtributs, ...this._configProp };
    
    // Assegurem que pluginUrl arriba sempre si està a l'atribut HTML
    if (!rawConfig.pluginUrl && this.getAttribute('plugin-url')) {
      rawConfig.pluginUrl = this.getAttribute('plugin-url');
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
      this._config = { ...rawConfig };
    }
    carregarFonts(this._config.fontsHref);
  }

  _render() {
    if (!this._root) return;
    this._root.render(
      <PedraSecaEmbed config={this._config} />
    );
  }

  disconnectedCallback() {
    if (this._config.fontsHref) {
      descarregarFonts(this._config.fontsHref);
    }

    if (!this._root || this._desmuntatge !== null) return;
    
    const cleanup = () => {
      this._desmuntatge = null;
      if (this.isConnected) return; /* ha tornat: no toquem res */
      this._root?.unmount();
      this._root = null;
      if (this._punt) {
        this._punt.remove();
        this._punt = null;
      }
    };

    this._desmuntatge = requestAnimationFrame(cleanup);
    this._desmuntatgeTimeout = setTimeout(() => {
      if (this._desmuntatge !== null) {
        cancelAnimationFrame(this._desmuntatge);
        cleanup();
      }
    }, 500);
  }
}

export function defineCustomElement() {
  if (typeof window === 'undefined') return;
  if (!customElements.get('soc-de-poble')) {
    customElements.define('soc-de-poble', SocDePobleElement);
  }
}
