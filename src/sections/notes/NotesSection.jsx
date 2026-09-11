import { useSearchParams } from '../../app/contexts/RouterContext';
import { NotesProvider, useNotes } from './NotesContext';
import NotesEditor from './NotesEditor';
import { UniversalManager } from '../../components/universal/manager/UniversalManager';
import { FileText } from 'lucide-react';
import { notesManagerConfig, buildNotesFacets } from '../../components/universal/manager/configs/notesManager';

function NotesSectionInner({ notaInicialId }) {
  const { notes, noteFolders, creaNota } = useNotes();

  return (
    <div className="sdp-gestor-pagina">
      <UniversalManager
        items={notes}
        facets={buildNotesFacets(noteFolders)}
        getItemId={notesManagerConfig.getItemId}
        getItemSearchText={notesManagerConfig.getItemSearchText}
        getItemCard={notesManagerConfig.getItemCard}
        renderDetail={() => <NotesEditor />}
        onActionCreate={() => creaNota()}
        createLabel="CREAR NOTA"
        listTitle="NOTES"
        listIcon={FileText}
        initialItemId={notaInicialId}
      />
    </div>
  );
}

export default function NotesSection() {
  const [searchParams] = useSearchParams();
  const notaInicialId = searchParams.get('nota');

  return (
    <NotesProvider>
      <NotesSectionInner notaInicialId={notaInicialId} />
    </NotesProvider>
  );
}
