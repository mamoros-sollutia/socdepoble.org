import { useNotes } from './NotesContext';
import UniversalToolbar from '../../components/universal/UniversalToolbar';

export default function NotesToolbar({ editor }) {
  const { publishNote, activeNote, t } = useNotes();

  return (
    <UniversalToolbar 
      editor={editor}
      onPublish={publishNote}
      publishDisabled={!activeNote}
      isPublished={activeNote?.isPublished}
      t={t}
    />
  );
}
