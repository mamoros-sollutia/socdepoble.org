import DOMPurify from 'dompurify';

/**
 * Neteja cadenes HTML per prevenir injeccions de scripts (XSS).
 * Només permet etiquetes i atributs absolutament essencials per al contingut de text.
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'span', 'div', 'img', 'iframe'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'src', 'alt', 'width', 'height', 'allowfullscreen', 'loading']
  });
}
