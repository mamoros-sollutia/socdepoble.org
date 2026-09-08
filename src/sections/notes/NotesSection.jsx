import { useSearchParams } from 'react-router-dom';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { NotesProvider } from './NotesContext';
import NotesSidebar from './NotesSidebar';
import NotesList from './NotesList';
import NotesEditor from './NotesEditor';
import notesStyles from './NotesSection.css?inline';
import AppGridShell from '../../components/layout/AppGridShell';
import { useUIActions } from '../../app/contexts/UIContext';

function NotesSectionContent({ notaInicialId }) {
  const { t } = useUIActions();

  return (
    <div className="notes-page">
      <style data-notes-styles>{notesStyles}</style>
      <UniversalPage title={t('section.notes.title', 'Bloc de notes')} chrome="none" variant="embed" noPadding>
        <AppGridShell
          leftColumn={<NotesSidebar />}
          middleColumn={<NotesList />}
          rightColumn={<NotesEditor />}
          leftTitle="CARPETES"
          middleTitle="NOTES"
          /* En pantalla estreta, arribar amb una nota demanada vol dir que
             l'usuari ve a llegir-la. Obrir-li damunt el calaix de carpetes és
             posar-li una porta al davant. */
          initialPane={notaInicialId ? null : 'left'}
          aria-label={t('section.notes.title', 'Bloc de notes')}
        />
      </UniversalPage>
    </div>
  );
}

export default function NotesSection() {
  /* PER QUÈ UN PARÀMETRE DE CONSULTA I NO UNA RUTA (P0-3 · 260908):
     `/jo/notes/<id>` JA està servit per `:sectionId/:itemId` › ItemDetailSection.
     Declarar `notes/:noteId` guanyaria per especificitat i mataria eixos
     enllaços de detall. `?nota=` no col·lisiona amb cap ruta i no obliga a
     tocar App.jsx. */
  const [searchParams] = useSearchParams();
  const notaInicialId = searchParams.get('nota');

  return (
    <NotesProvider notaInicialId={notaInicialId}>
      <NotesSectionContent notaInicialId={notaInicialId} />
    </NotesProvider>
  );
}
