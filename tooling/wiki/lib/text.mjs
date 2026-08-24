/**
 * Funcions centralitzades de processament de text
 */

/**
 * Normalitza el text per a la cerca i l'enllaçat (NFC).
 * Respecta caràcters propis del valencià (ç, l·l, accents).
 * @param {string} text
 * @returns {string}
 */
export function normalitza(text) {
  if (!text) return '';
  return text
    .normalize('NFC')
    .toLocaleLowerCase('ca')
    .trim();
}

/**
 * Normalitza el text de manera agressiva (NFD) eliminant diacrítics.
 * Usar NOMÉS quan siga estrictament necessari perdre fidelitat lingüística (per ex. URLs).
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('ca')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
