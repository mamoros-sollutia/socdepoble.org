import { useEffect, useRef } from 'react';
import { sanitizeHtml } from '../../../utils/sanitize.js';

/**
 * EditableField — un camp `contenteditable` d'una sola línia lògica.
 *
 * PER QUÈ NO `dangerouslySetInnerHTML` A CADA PINTADA: si el pare torna a
 * pintar amb l'HTML que acabes d'escriure, React reescriu el `innerHTML` i
 * el cursor se'n va al principi. Ací l'HTML entra pel DOM només quan ve de
 * FORA (canvi de fitxa, càrrega remota), comparant amb el que hi ha escrit.
 * Mentres l'usuari teclege, el DOM mana i React no el toca.
 *
 * ACCESSIBILITAT: `role="textbox"` + `aria-label` perquè un lector de
 * pantalla sàpia què és això. Sense això era un <span> mut.
 */
export function EditableField({
  html,
  placeholder,
  label,
  onChange,
  onBlur,
  className = '',
  multiline = false
}) {
  const ref = useRef(null);
  const netHtml = html == null ? null : sanitizeHtml(html);

  useEffect(() => {
    const node = ref.current;
    if (!node || netHtml == null) return;
    if (node.innerHTML === netHtml) return;
    // Només reescrivim si el canvi NO ve del teclat d'este camp.
    if (document.activeElement === node) return;
    node.innerHTML = netHtml;
  }, [netHtml]);

  if (html === null) return null;

  return (
    <span
      ref={ref}
      className={className}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label={label || placeholder}
      aria-multiline={multiline || undefined}
      tabIndex={0}
      data-placeholder={placeholder}
      onInput={(e) => onChange?.(sanitizeHtml(e.currentTarget.innerHTML))}
      onBlur={(e) => onBlur?.(sanitizeHtml(e.currentTarget.innerHTML))}
      onKeyDown={(e) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
}

export default EditableField;
