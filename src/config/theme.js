export const THEME_KEY = 'sdp-theme';
const LEGACY_KEYS = ['socdepoble-theme-mode'];
const VALID = new Set(['light', 'dark', 'system']);

const decode = (raw) => {
  return raw; // Text cru (dark/light), ja no fem JSON.parse
};

export function readThemePreference(configured) {
  if (VALID.has(configured)) return configured;
  
  if (typeof window === 'undefined' || typeof document === 'undefined') return 'light'; // Fallback

  // 1. Font de veritat: atribut HTML (Shadow DOM o arrel)
  let root = null;
  if (typeof document !== 'undefined') {
    root = document.querySelector('#soc-de-poble') || document.documentElement;
  }
  const htmlTheme = root ? root.getAttribute('data-theme') : null;
  if (htmlTheme && VALID.has(htmlTheme)) return htmlTheme;

  // 2. Fallback a LocalStorage (text cru)
  try {
    const raw = window.localStorage.getItem(THEME_KEY);
    if (raw && VALID.has(raw)) return raw;
  } catch {
    // Ignorar errors de localStorage
  }
  return 'light'; // Fallback final
}

export function resolveTheme(preference) {
  if (preference !== 'system') return preference;
  if (typeof window === 'undefined') return 'light'; // Fallback per SSR
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function writeThemePreference(preference) {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(THEME_KEY, preference);
    } catch {
      // Ignorar errors de localStorage
    }
  }
}
