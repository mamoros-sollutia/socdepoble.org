import { useParams } from 'react-router-dom';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import SectionItemCard from '../../components/SectionItemCard';
import { useAppData } from '../../app/AppDataContext';

export default function ProfileSection({ agents = [] }) {
  const { t } = useAppData();
  const { agentId } = useParams();
  const selectedAgent = agents.find((agent) => String(agent.id) === String(agentId)) || null;

  return (
    <UniversalPage
      title={t('section.profile.title', 'Agents i persones')}
      subtitle={t('section.profile.subtitle', 'Directori de persones, grups i agents del portal.')}
      chrome="system"
      showLogos={true}
    >
      {selectedAgent ? (
        <div className="card card--soft">
          <div className="split-grid">
            <div className="media-frame">
              <img src={selectedAgent.avatar_url} alt={selectedAgent.name} />
            </div>
            <div className="card__body">
              <ul className="sp-card-labels" aria-label="Categories">
                <li className="sp-card-label sdp-badge-system">Nivell {selectedAgent.level}</li>
                {selectedAgent.tag && <li className="sp-card-label sdp-badge-category">{selectedAgent.tag}</li>}
                {selectedAgent.type && <li className="sp-card-label sdp-badge-tag">{selectedAgent.type}</li>}
              </ul>
              <h2 className="card__title">{selectedAgent.name}</h2>
              <p className="card__text">{selectedAgent.role}</p>
              {selectedAgent.short_bio ? <p className="card__text">{selectedAgent.short_bio}</p> : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="feed-grid">
        {agents.map((agent, index) => (
          <SectionItemCard
            key={`${agent.id}-${index}`}
            to={`/perfil/${agent.id}`}
            state={{ preloadedItem: agent }}
            image={agent.avatar_url}
            title={agent.name}
            subtitle={agent.role}
            excerpt={agent.short_bio}
            eyebrow={agent.tag}
            meta={[agent.type]}
            buttonLabel={t('common.readMore', 'Llegir més')}
            className={String(agent.id) === String(selectedAgent?.id) ? 'card-link--active' : ''}
          />
        ))}
      </div>
    </UniversalPage>
  );
}
