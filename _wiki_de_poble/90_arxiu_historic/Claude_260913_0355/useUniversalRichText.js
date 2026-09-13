import { useCallback, useEffect, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

/**
 * useUniversalRichText — TipTap tancat darrere d'una porta.
 *
 * P0 CORREGIT · EL RETARD NO EXISTIA
 *   L'efecte del `pagehide` depenia de `[id, onSave]`. `onSave` arriba com a
 *   fletxa en línia des de NotesEditor: identitat nova a cada pintada. Com
 *   que la neteja de l'efecte cridava `flushSave()`, la seqüència real era
 *
 *     tecla → onChange → estat → repintada → neteja d'efecte → DESAT
 *
 *   és a dir, una escriptura remota PER TECLA. Amb `saveNoteField` fent
 *   comparació i intercanvi sobre `revision`, dues tecles seguides es
 *   creuen i la segona torna 409. El retard de 800 ms no s'arribava a
 *   complir mai.
 *
 *   Ara les crides viuen en referències i l'efecte depén només d'`id`: es
 *   desmunta quan canvia de fitxa o quan mor el component, que és quan un
 *   buidatge té sentit.
 */
export function useUniversalRichText({
  content = '',
  onChange,
  onSave,
  id,
  debounceMs = 800
}) {
  const timeoutRef = useRef(null);
  const pendentRef = useRef(null);
  const idRef = useRef(id);
  const changeRef = useRef(onChange);
  const saveRef = useRef(onSave);

  idRef.current = id;
  changeRef.current = onChange;
  saveRef.current = onSave;

  const buida = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const pendent = pendentRef.current;
    pendentRef.current = null;
    if (pendent?.id) saveRef.current?.(pendent.html, pendent.id);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] } })],
    content,
    editorProps: {
      attributes: {
        class: 'editor-content',
        'aria-label': 'Cos del document'
      }
    },
    onUpdate: ({ editor: motor }) => {
      const html = motor.getHTML();
      const idActual = idRef.current;
      if (!idActual) return;

      pendentRef.current = { id: idActual, html };
      changeRef.current?.(html);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        pendentRef.current = null;
        saveRef.current?.(html, idActual);
      }, debounceMs);
    }
  });

  /* Sincronització d'entrada: només quan canvia la FITXA. Si també
     depenguera de `content`, cada desat remot reescriuria el document i
     et robaria el cursor a meitat paràgraf. */
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (editor.getHTML() === content) return;
    // TipTap 3: el segon argument és un objecte d'opcions, no un booleà.
    editor.commands.setContent(content || '', { emitUpdate: false });
  }, [id, editor]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Xarxa de seguretat: tancar pestanya, canviar de fitxa o desmuntar. */
  useEffect(() => {
    if (!id) return undefined;
    window.addEventListener('pagehide', buida);
    return () => {
      window.removeEventListener('pagehide', buida);
      buida();
    };
  }, [id, buida]);

  return editor;
}

export default useUniversalRichText;
