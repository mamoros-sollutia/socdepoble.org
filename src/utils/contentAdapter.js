import { sanitizeHtml } from './sanitize.js';

/**
 * Extreu el text pla d'un bloc de codi HTML ric (per exemple, per usar en meta-tags o resums SEO)
 * 
 * @param {string} html El contingut HTML del cos de la publicació
 * @param {number} maxLength Longitud màxima del resum
 * @returns {string} Text netejat de tags HTML i truncat
 */
export function extractPlainText(html, maxLength = 160) {
  if (!html) return '';

  const safeHtml = sanitizeHtml(String(html));
  let text;

  if (typeof window !== 'undefined' && window.DOMParser) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      safeHtml
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/(p|li|h[1-6]|blockquote|div)>/gi, '</$1> '),
      'text/html'
    );
    text = doc.body.textContent || '';
  } else {
    // Fallback per a renderitzat sense DOM. El sanejador ja ha eliminat els
    // blocs prohibits; ací només convertim l'HTML segur restant a text.
    text = safeHtml
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/p>|<\/li>|<\/h[1-6]>|<\/blockquote>|<\/div>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
      .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&(?:apos|#39);/gi, "'");
  }

  const cleanText = text.replace(/\s+/g, ' ').trim();
    
  if (!Number.isFinite(maxLength) || cleanText.length <= maxLength) return cleanText;
  if (maxLength <= 0) return '';
  
  // 3. Trunca intel·ligentment
  const truncated = cleanText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated).trimEnd() + '...';
}

/**
 * Assegura que l'HTML produït pel motor d'edició és segur per ser renderitzat.
 * Actua de pont per unificar qualsevol canvi futur de motor d'edició.
 * 
 * @param {string} html L'HTML en brut del motor d'edició
 * @returns {string} L'HTML sanejat
 */
export function prepareContentForRender(html) {
  return sanitizeHtml(html || '');
}
