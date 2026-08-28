import { getVal, setVal } from './storage.js';

export const THEME_KEY = 'sdp-theme';
const VALID = new Set(['light', 'dark', 'system']);

export function readThemePreference(configured) {
  if (VALID.has(configured)) return configured;
  
  if (typeof window === 'undefined' || typeof document === 'undefined') return 'light'; // Fallback

  // 1. Font de veritat: atribut HTML (Shadow DOM o arrel)
  let root = null;
  if (typeof document !== 'undefined') {
    const sdpElement = document.querySelector('soc-de-poble');
    if (sdpElement && sdpElement.shadowRoot) {
      root = sdpElement.shadowRoot.querySelector('.sdp-root');
    }
    if (!root) {
      root = document.querySelector('.sdp-root') || document.querySelector('#socdepoble-app') || document.documentElement;
    }
  }
  const htmlTheme = root ? root.getAttribute('data-theme') : null;
  if (htmlTheme && VALID.has(htmlTheme)) return htmlTheme;

  // 2. Fallback a LocalStorage (text cru)
  const raw = getVal(THEME_KEY);
  if (raw && VALID.has(raw)) return raw;

  return 'light'; // Fallback final
}

export function resolveTheme(preference) {
  if (preference !== 'system') return preference;
  if (typeof window === 'undefined') return 'light'; // Fallback per SSR
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function writeThemePreference(preference) {
  setVal(THEME_KEY, preference);
}
