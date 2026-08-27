const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

/**
 * CONTRACTE: estes tres funcions són SÍNCRONES per sempre.
 * Només identitat i preferències. Res que puga créixer.
 * Imposat per tooling/gates/tractor-persistencia.mjs (L1, L2).
 */
export const getVal = (key, fallback = null) => {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch {
    return fallback;
  }
};

export const setVal = (key, value) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / serialization issues in demo mode.
  }
};

export const delVal = (key) => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore
  }
};
