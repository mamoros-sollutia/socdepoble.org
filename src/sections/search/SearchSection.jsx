import { useDeferredValue, useMemo, useState } from 'react';
import { UniversalPage, UniversalCard } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { resolveItemPath } from '../../config/navigation';
import { Search } from 'lucide-react';

export default function SearchSection() {
  const { globalSearchItems, normalizeSearchText, t } = useAppData();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const term = normalizeSearchText(deferredQuery);
    if (!term) {
      return [];
    }
    return globalSearchItems.filter((item) => item.searchText.includes(term)).slice(0, 24);
  }, [deferredQuery, globalSearchItems, normalizeSearchText]);

  return (
    <UniversalPage
      title={t('section.search.title', 'Cercador Universal')}
      subtitle={t('section.search.subtitle', 'Busca persones, pobles, publicacions i pàgines en un sol lloc')}
      chrome="system"
      showLogos={true}
      labels={[t('section.search.label', 'Cercador')]}
    >
      // eslint-disable-next-line
      <div style={{ margin: 'var(--sdp-space-8) 0', padding: '0 var(--sdp-space-5)' }}>
        // eslint-disable-next-line
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--sdp-fons-subtil)', borderRadius: 'var(--sdp-radi-pastilla)', padding: '0 var(--sdp-space-4)', border: '1px solid var(--sdp-vora-control)' }}>
          // eslint-disable-next-line
          <Search size={20} color="var(--sdp-text-suau)" style={{ flexShrink: 0 }} />
          <input
            type="search"
            value={query}
            aria-label={t('section.search.searchPlaceholder', 'Cerca persones, pobles, posts...')}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('section.search.searchPlaceholder', 'Cerca persones, pobles, posts...')}
            // eslint-disable-next-line
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              padding: 'var(--sdp-space-4)',
              color: 'var(--sdp-text-titol)',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      // eslint-disable-next-line
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sdp-space-6)', padding: '0 var(--sdp-space-4)', paddingBottom: 'var(--sdp-space-12)' }}>
        {results.map((item) => {
          const path = resolveItemPath(item);
          const content = item.role || item.post_subtitle || item.content || item.message;
          const sectionId = item.sectionId || t('section.search.resultLabel', 'Resultat');
          
          return (
            <UniversalCard
              key={`${sectionId}-${item.id}`}
              title={item.name || item.title}
              subtitle={content?.substring(0, 100) + (content?.length > 100 ? '...' : '')}
              labels={[{ text: sectionId.toUpperCase() }]}
              mainHref={path}
              connectLabel={t('common.readMore', 'Veure Més')}
            />
          );
        })}
        {query && results.length === 0 && (
          // eslint-disable-next-line
          <div style={{ textAlign: 'center', padding: 'var(--sdp-space-8)', color: 'var(--sdp-text-suau)' }}>
            {t('section.search.noResults', 'Cap resultat.')}
          </div>
        )}
      </div>
    </UniversalPage>
  );
}
