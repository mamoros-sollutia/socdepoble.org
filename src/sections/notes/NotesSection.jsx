import { useSearchParams } from '../../app/contexts/RouterContext';
import { NotesProvider, useNotes } from './NotesContext';
import NotesEditor from './NotesEditor';
import { UniversalManager } from '../../components/universal/manager/UniversalManager';
import { notesManagerConfig, buildNotesFacets } from '../../components/universal/manager/configs/notesManager';
import { FileText, Pencil } from 'lucide-react';
import UniversalCard from '../../components/ui/UniversalCard';

function NotesItemCard({ item, active, onClick }) {
  const { title, plainText, formattedDate, isPublished } = item;
  
  return (
    <UniversalCard
      title={title || 'Sense títol'}
      description={plainText || 'Nota buida...'}
      metadata={formattedDate}
      icon={isPublished ? FileText : Pencil}
      active={active}
      onClick={onClick}
    />
  );
}

function NotesSectionInner({ notaInicialId }) {
  const { notes, noteFolders, creaNota } = useNotes();
  
  // A l'UniversalManager li passem directament els paràmetres de cerca/facets de dades
  // També li indiquem el "createLabel" si volem canviar el text del botó
  
  return (
    <div className="notes-page" style={{ height: '100%' }}>
      <UniversalManager
        items={notes}
        facets={buildNotesFacets(noteFolders)}
        getItemId={notesManagerConfig.getItemId}
        getItemSearchText={notesManagerConfig.getItemSearchText}
        renderItem={(item, active, onClick) => (
          <NotesItemCard key={item.id} item={item} active={active} onClick={onClick} />
        )}
        renderDetail={() => <NotesEditor />}
        onActionCreate={() => creaNota()}
        createLabel="CREAR NOTA"
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
