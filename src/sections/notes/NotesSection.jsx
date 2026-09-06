import { UniversalPage } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { NotesProvider } from './NotesContext';
import NotesSidebar from './NotesSidebar';
import NotesList from './NotesList';
import NotesEditor from './NotesEditor';
import notesStyles from './NotesSection.css?inline';
import AppGridShell from '../../components/layout/AppGridShell';

function NotesSectionContent() {
  const { t } = useAppData();

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
          initialPane="left"
          aria-label={t('section.notes.title', 'Bloc de notes')}
        />
      </UniversalPage>
    </div>
  );
}

export default function NotesSection() {
  return (
    <NotesProvider>
      <NotesSectionContent />
    </NotesProvider>
  );
}
