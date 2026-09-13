import { useEffect, useRef, useCallback } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function useUniversalRichText({
  content = '',
  onChange,
  onSave,
  id,
  debounceMs = 800
}) {
  const timeoutRef = useRef(null);
  const pendingSaveRef = useRef({ id: null, content: null });
  const currentIdRef = useRef(id);
  const onChangeRef = useRef(onChange);
  const onSaveRef = useRef(onSave);

  // Sync refs with latest props
  currentIdRef.current = id;
  onChangeRef.current = onChange;
  onSaveRef.current = onSave;

  // The flush function reads from the draft, never from the editor, 
  // preventing empty-string overwrites if the editor is already destroyed.
  const flush = useCallback((expectedId) => {
    const pending = pendingSaveRef.current;
    if (pending.content === null) return;
    if (expectedId !== undefined && pending.id !== expectedId) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    pendingSaveRef.current = { id: null, content: null };
    
    if (pending.id != null) {
      onSaveRef.current?.(pending.content, pending.id);
    }
  }, []);

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] } })],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const currentId = currentIdRef.current;
      pendingSaveRef.current = { id: currentId, content: html };
      
      onChangeRef.current?.(html, currentId);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => flush(currentId), debounceMs);
    },
    editorProps: {
      attributes: {
        class: 'editor-content page-content sdp-text-cos sdp-prose'
      },
    },
  });

  // Sync incoming content changes (e.g. when changing notes)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    try {
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content || '', false);
      }
    } catch (err) {
      console.warn('Editor sync skipped', err);
    }
  }, [content, editor, id]);

  // Global exit hooks (pagehide, visibilitychange)
  useEffect(() => {
    const flushSave = () => flush();
    const flushWhenHidden = () => {
      if (document.visibilityState === 'hidden') flushSave();
    };

    window.addEventListener('pagehide', flushSave);
    document.addEventListener('visibilitychange', flushWhenHidden);
    return () => {
      window.removeEventListener('pagehide', flushSave);
      document.removeEventListener('visibilitychange', flushWhenHidden);
      flushSave();
    };
  }, [flush]);

  // Flush when note ID changes or component unmounts
  useEffect(() => {
    return () => flush(id);
  }, [id, flush]);
  
  // ProseMirror orphan event cleanup as recommended by the Council
  useEffect(() => {
    return () => {
      if (editor && !editor.isDestroyed && editor.view) {
         editor.view.destroy();
      }
    };
  }, [editor]);

  return editor;
}
