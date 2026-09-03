import { useLayoutEffect, useRef } from 'react';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { NotesProvider, useNotes } from './NotesContext';
import NotesSidebar from './NotesSidebar';
import NotesList from './NotesList';
import NotesEditor from './NotesEditor';
import notesStyles from './NotesSection.css?inline';

function NotesSectionContent() {
  const { t } = useAppData();
  const { mobilePanel, isCompact, setIsCompact } = useNotes();
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const measure = () => setIsCompact(page.clientWidth < 960);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(page);
    return () => observer.disconnect();
  }, [setIsCompact]);

  return (
    <div ref={pageRef} className={`notes-page${isCompact ? ' notes-page--compact' : ''}`}>
      {/* El CSS ha de viure al mateix arbre que la UI, també en Shadow DOM. */}
      <style data-notes-styles>{notesStyles}</style>
      <UniversalPage title={t('section.notes.title', 'Bloc de notes')} chrome="none" variant="embed">
        <article className={`notes-shell mobile-panel-${mobilePanel}`} aria-label={t('section.notes.title', 'Bloc de notes')}>
          <NotesSidebar />
          <NotesList />
          <NotesEditor />
        </article>
      </UniversalPage>
    </div>
  );
}

export default function NotesSection() {
  return <NotesProvider><NotesSectionContent /></NotesProvider>;
}
