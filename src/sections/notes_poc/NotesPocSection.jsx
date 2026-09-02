import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { UniversalPage, UniversalButton } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { ArrowLeft } from 'lucide-react';

export default function NotesPocSection() {
  const navigate = useNavigate();
  const { t } = useAppData();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Benvingut al nou espai de notes (Prova de Concepte amb TipTap) 🚜</p><p>Pots escriure llistes:</p><ul><li>Una cosa</li><li>Una altra cosa</li></ul><p>Tot amb la tipografia Pedra Seca.</p>',
    editorProps: {
      attributes: {
        class: 'sdp-text-cos sdp-prose focus:outline-none',
        style: 'min-height: 300px; padding: var(--sdp-space-4); border: 1px solid var(--sdp-border-clar); border-radius: 8px;'
      },
    },
  });

  return (
    <UniversalPage
      title="Prova de Concepte: Notes"
      subtitle="Editor de text enriquit basat en TipTap (Block-based approach)"
      chrome="system"
      labels={[
        { text: 'PoC', className: 'sdp-badge-system' },
        { text: 'Experimental', className: 'sdp-badge-warning' }
      ]}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--sdp-space-6)' }}>
        
        <div style={{ display: 'flex', gap: 'var(--sdp-space-4)', marginBottom: 'var(--sdp-space-4)' }}>
          <UniversalButton variant="outline" icon={<ArrowLeft size={18} />} onClick={() => navigate(-1)}>
            Tornar
          </UniversalButton>
        </div>

        {/* TipTap Menu Bar */}
        <div className="sdp-tiptap-menu">
          <button 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            className={`sdp-button sdp-button-sm ${editor?.isActive('bold') ? 'active' : ''}`}
          >
            Negreta
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            className={`sdp-button sdp-button-sm ${editor?.isActive('italic') ? 'active' : ''}`}
          >
            Cursiva
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            className={`sdp-button sdp-button-sm ${editor?.isActive('heading', { level: 2 }) ? 'active' : ''}`}
          >
            H2
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            className={`sdp-button sdp-button-sm ${editor?.isActive('bulletList') ? 'active' : ''}`}
          >
            Llista
          </button>
        </div>

        {/* TipTap Editor */}
        <div className="sdp-tiptap-container">
          <EditorContent editor={editor} />
        </div>

      </div>
    </UniversalPage>
  );
}
