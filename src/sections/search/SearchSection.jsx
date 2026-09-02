import { useDeferredValue, useMemo, useState } from 'react';
import { UniversalPage, UniversalCard } from '../../components/universal/UniversalComponents';
import { UniversalSearch } from '../../components/ui/UniversalSearch.jsx';
import { useAppData } from '../../app/AppDataContext';
import { resolveItemPath } from '../../config/navigation';

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
    >
      <div style={{ margin: 'var(--sdp-space-8) 0', padding: '0 var(--sdp-space-5)' }}>
        <UniversalSearch
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('section.search.searchPlaceholder', 'Cerca persones, pobles, posts...')}
          ariaLabel={t('section.search.searchPlaceholder', 'Cerca persones, pobles, posts...')}
        />
      </div>

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
          <div style={{  textAlign: 'center', padding: 'var(--sdp-space-8)'}}>
            {t('section.search.noResults', 'Cap resultat.')}
          </div>
        )}
      </div>
    </UniversalPage>
  );
}
