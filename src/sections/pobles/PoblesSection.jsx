import React from 'react';
import { UniversalPage, UniversalCard } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { getSectionItemPath } from '../../config/navigation';
import { useSEO } from '../../hooks/useSEO';

export default function PoblesSection() {
  const { sortedTowns, t } = useAppData();
  
  useSEO({
    title: t('section.pobles.kicker', 'Pobles'),
    description: t('section.pobles.subtitle', 'Explora els pobles i el seu context territorial.')
  });

  return (
    <UniversalPage
      title={t('section.pobles.kicker', 'Pobles')}
      subtitle={t('section.pobles.title', 'Nodes i territori')}
      lead={t('section.pobles.subtitle', 'Explora els pobles i el seu context territorial.')}
      chrome="system"
      showLogos={true}
    >
      <div className="sdp-card-grid sdp-mb-12">
        {sortedTowns.map((town) => {

          return (
            <UniversalCard
              key={town.id}
              author={(() => {
                if (town.title === 'La Torre de les Maçanes') return 'Gent de La Torre';
                if (/^[aeiouhàèéíòóú]/i.test(town.title)) return `Gent d'${town.title}`;
                return `Gent de ${town.title}`;
              })()}
              authorHref={getSectionItemPath('pobles', town.id)}
              avatarUrl={town.avatar_url || town.image_url}
              location={town.comarca}
              time={town.dynamic_time || town.time}
              date={town.dynamic_date}
              imageUrl={town.imageSrc || town.image_url}
              imageAlt={town.title}
              title={town.title}
              subtitle={town.comarca}
              body={
                <div>
                  <p className="sp-card-text">{town.content}</p>
                </div>
              }
              labels={[
                { text: t('section.pobles.kicker', 'Pobles'), className: 'sdp-badge-system', href: '/pobles' },
                ...(town.population ? [{ text: town.population, className: 'sdp-badge-accent', href: '/poblacio' }] : []),
                { 
                  text: t('section.pobles.wikipedia_link', "Publicat a la Viquipèdia"), 
                  className: 'sdp-badge-neutral', 
                  href: `https://ca.wikipedia.org/wiki/${town.id === 'sella' ? 'Sella_(Marina_Baixa)' : town.id === 'relleu' ? 'Relleu_(municipi)' : encodeURIComponent(town.title.replace(/ /g, '_'))}` 
                }
              ]}
              copyright="© Viquipèdia / Wikimedia Commons (CC BY-SA)"
              mainHref={getSectionItemPath('pobles', town.id)}
              hasFooter={true}
              showTranslate={true}
              showComment={true}
              showShare={true}
              showConnect={true}
            />
          );
        })}
        {sortedTowns.length === 0 && (
          <div className="sdp-text-center sdp-p-8 sdp-text-suau">
            {t('section.pobles.noResults', 'Cap poble trobat.')}
          </div>
        )}
      </div>
    </UniversalPage>
  );
}
