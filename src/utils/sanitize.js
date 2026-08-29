import DOMPurify from 'dompurify';

/**
 * Sanejador d'HTML. ÚNIC punt d'entrada d'HTML a l'arbre.
 *
 * PER QUÈ NO EL FEM A MÀ: un sanejador d'HTML propi és el camí més curt cap a
 * un XSS. Ací la Pedra Seca cedix: el dolor de mantindre DOMPurify és menor que
 * el dolor de reinventar-lo malament. És l'única excepció d'aquest fitxer.
 *
 * Imposat per tooling/gates/tractor-innerhtml.mjs.
 */

let ganxosPosats = false;

function posaGanxos() {
  if (ganxosPosats) return;
  ganxosPosats = true;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // 1. Cap far de tercers. Només imatges del nostre origen o data: URI.
    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src') || '';
      const esLocal =
        src.startsWith('/') ||
        src.startsWith('./') ||
        src.startsWith('data:image/') ||
        (typeof window !== 'undefined' && src.startsWith(window.location.origin));
      if (!esLocal) {
        node.removeAttribute('src');
        node.setAttribute('alt', node.getAttribute('alt') || 'Imatge externa bloquejada');
        node.setAttribute('data-sdp-bloquejada', '1');
      }
      node.setAttribute('loading', 'lazy');
      node.setAttribute('decoding', 'async');
      node.setAttribute('referrerpolicy', 'no-referrer');
    }

    // 2. Cap segrest de pestanya, i cap fuita de referent.
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      node.setAttribute('rel', 'noopener noreferrer nofollow');
      if (node.getAttribute('target') === '_blank') {
        node.setAttribute('target', '_blank');
      }
    }
  });
}

export function sanitizeHtml(html) {
  if (!html) return '';
  posaGanxos();
  return DOMPurify.sanitize(String(html), {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'span', 'div', 'img', 'hr', 'code', 'pre'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class', 'src', 'alt',
      'width', 'height', 'loading', 'decoding', 'referrerpolicy',
      'data-sdp-bloquejada'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input', 'svg', 'math'],
    FORBID_ATTR: ['style', 'srcset', 'formaction', 'ping']
  });
}

/**
 * Netejador de TEXT PLA. NO és un sanejador d'HTML i no ha de ser-ho:
 * React ja escapa el text. Passar text pla per DOMPurify el destrueix
 * («l'aigua < 5 litres & la pedra» → «l'aigua &lt; 5 litres &amp; la pedra»)
 * i el dany és permanent, perquè es guarda escapat a l'Outbox i a Supabase.
 */
export function netejaText(valor, maxim = 4000) {
  return String(valor ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n?/g, '\n')
    .normalize('NFC')
    .trim()
    .slice(0, maxim);
}
