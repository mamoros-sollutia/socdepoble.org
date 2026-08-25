import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UniversalPage, UniversalCard } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { useSEO } from '../../hooks/useSEO';
import { resolveAsset } from '../../config/assetResolver';
import { getSectionItemPath } from '../../config/navigation';
import { buildMapEmbedUrl } from './mapConfig';

export default function MurSection() {
  const { sortedEvents, sortedFeedPosts, sortedMarketItems, sortedTowns, pageCopy, t } = useAppData();
  const [searchParams, setSearchParams] = useSearchParams();
  const dateFilter = searchParams.get('date');
  const categoryFilter = searchParams.get('category');

  const [filterType, setFilterType] = useState('all');
  const [isMapOpen, setIsMapOpen] = useState(false);

  useSEO({
    title: t('section.mur.kicker', 'Mur'),
    description: t('section.mur.subtitle', 'Llig el mur públic amb les darreres publicacions del poble.')
  });

  const systemPages = [
    { key: 'disseny', isAvis: true, href: '/disseny' },
    { key: 'projecte', isAvis: false, href: '/projecte' },
    { key: 'constitucio', isAvis: false, href: '/constitucio' },
    { key: 'skills', isAvis: false, href: '/skills' },
    { key: 'anima', isAvis: false, href: '/ia' },
    { key: 'roadmap', isAvis: false, href: '/roadmap' },
    { key: 'versions', isAvis: false, href: '/versions' },
    { key: 'legal', isAvis: false, href: '/legal' }
  ].map(item => {
    const data = pageCopy[item.key];
    if (!data) return null;
    return {
      ...data,
      id: item.key,
      isSystem: true,
      isAvis: item.isAvis,
      mainHref: item.href,
      type: 'sistema'
    };
  }).filter(Boolean);

  const allItems = useMemo(() => {
    const combined = [
      ...(sortedEvents || []),
      ...(sortedFeedPosts || []),
      ...(sortedMarketItems || []),
      ...(sortedTowns || []),
      ...systemPages
    ].filter(Boolean);

    return combined.sort((a, b) => {
      const dateA = new Date(a.date || a.publish_date || a.created_at || "2026-08-21T00:00:00.000Z");
      const dateB = new Date(b.date || b.publish_date || b.created_at || "2026-08-21T00:00:00.000Z");
      return dateB - dateA;
    });
  }, [sortedEvents, sortedFeedPosts, sortedMarketItems, sortedTowns, pageCopy, systemPages]);

  const displayedItems = useMemo(() => {
    let items = allItems;
    if (filterType === 'events') items = items.filter(i => i.type === 'event');
    if (filterType === 'sistema') items = items.filter(i => i.type === 'sistema');

    if (dateFilter) {
      items = items.filter(i => {
        const rawDate = i.date || i.publish_date || i.created_at;
        if (!rawDate) return false;
        return rawDate.startsWith ? rawDate.startsWith(dateFilter) : String(rawDate).startsWith(dateFilter);
      });
    }
    
    if (categoryFilter) {
      items = items.filter(i => {
        const labels = i.labels || [{ text: i.isSystem ? 'Sistema' : (i.type || 'Publicació') }];
        return labels.some(l => l.text.toLowerCase() === categoryFilter.toLowerCase());
      });
    }

    return items;
  }, [allItems, filterType, dateFilter, categoryFilter]);

  const getCalendarBadge = (dateString) => {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return {
      dia: d.getDate(),
      mes: d.toLocaleDateString('ca-ES', { month: 'long' }),
      any: d.getFullYear(),
      dateTime: dateString
    };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const formatTime = (timeStr, dateStr) => {
    if (timeStr) return timeStr;
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <UniversalPage
      title={t('section.mur.kicker', 'Mur')}
      subtitle={t('section.mur.title', 'Publicacions recents')}
      lead={t('section.mur.subtitle', 'Llig el mur públic amb les darreres publicacions del poble.')}
      chrome="system"
      showLogos={true}
    >
      // eslint-disable-next-line
      <div className="sdp-mx-auto" style={{ maxWidth: 'var(--sdp-amplada-article)' }}>
        
        {/* Switcher / Botonera */}
        <section className="sdp-filtres" aria-label="Filtres del mur">
          <div className="sdp-filtres__vistes">
            <button
              type="button"
              className="sdp-filtre--vista"
              aria-pressed={filterType === 'all'}
              onClick={() => { setFilterType('all'); setIsMapOpen(false); }}
            >
              Mostrar Tot
            </button>
            <button
              type="button"
              className="sdp-filtre--vista"
              aria-pressed={filterType === 'events'}
              onClick={() => { setFilterType('events'); setIsMapOpen(false); }}
            >
              Esdeveniments
            </button>
            <button
              type="button"
              className="sdp-filtre--vista"
              aria-pressed={filterType === 'sistema'}
              onClick={() => { setFilterType('sistema'); setIsMapOpen(false); }}
            >
              Sistema
            </button>
          </div>

          <div className="sdp-filtre--camp">
            <label htmlFor="mur-data"><span>Data</span></label>
            <input
              id="mur-data"
              type="date"
              value={dateFilter || ''}
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams);
                e.target.value ? newParams.set('date', e.target.value) : newParams.delete('date');
                setSearchParams(newParams);
              }}
            />
          </div>

          <div className="sdp-filtre--camp">
            <label htmlFor="mur-categoria"><span>Categoria</span></label>
            <select
              id="mur-categoria"
              value={categoryFilter || ''}
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams);
                e.target.value ? newParams.set('category', e.target.value) : newParams.delete('category');
                setSearchParams(newParams);
              }}
            >
              <option value="">Totes les categories</option>
              <option value="Mur">Mur</option>
              <option value="Mercat">Mercat</option>
              <option value="Pobles">Pobles</option>
            </select>
          </div>

          <button
            type="button"
            className="sdp-filtre--accio"
            onClick={() => setIsMapOpen(!isMapOpen)}
            title={isMapOpen ? 'Tancar Mapa' : 'Obrir Mapa'}
          >
            {isMapOpen ? 'Tancar Mapa' : '🗺️ Mapa'}
          </button>
        </section>

        {/* Mapa Desplegable */}
        {isMapOpen && (
          <div className="sdp-filtre--mapa sdp-w-full sdp-mb-8">
            <iframe
              title="Mapa del territori"
              src={buildMapEmbedUrl()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: '100%', height: '400px', border: 0, borderRadius: 'var(--sdp-radi-lg)' }}
            />
          </div>
        )}

        {/* Targetes del Mur */}
        <div className="sdp-card-grid">
          {displayedItems.map((item) => {
            const rawDate = item.date || item.publish_date || item.created_at || "2026-08-21T00:00:00.000Z";
            
            return (
              <UniversalCard
                key={`${item.type}-${item.id}`}
                title={item.title || item.name}
                subtitle={item.subtitle}
                body={item.lead || <p className="sp-card-text">{item.description}</p>}
                imageUrl={resolveAsset((typeof item.image_url === 'string' ? item.image_url : null) || (typeof item.image === 'string' ? item.image : null) || '')}
                imageAlt={item.imageAlt || ''}
                author={item.author_name || "Sóc de Poble"}
                authorHref={item.isSystem ? "/pobles" : undefined}
                avatarUrl={resolveAsset((typeof item.author_avatar === 'string' ? item.author_avatar : null) || '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg')}
                location="La Torre de les Maçanes"
                date={formatDate(rawDate)}
                time={formatTime(item.time, rawDate)}
                copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
                calendarBadge={item.type === 'event' ? getCalendarBadge(rawDate) : null}
                labels={item.labels || [
                  { text: item.isSystem ? 'Sistema' : (item.type || 'Publicació'), className: item.isSystem ? 'sdp-badge-system' : 'sdp-badge-category' }
                ]}
                mainHref={item.mainHref || getSectionItemPath(item.type === 'event' ? 'events' : (item.type === 'market' ? 'mercat' : (item.type === 'poble' ? 'pobles' : 'mur')), item.id)}
                showPin={item.isAvis}
                hasFooter={true}
                showTranslate={true}
                showComment={true}
                showShare={true}
                showConnect={true}
              />
            );
          })}
        </div>
      </div>
    </UniversalPage>
  );
}
