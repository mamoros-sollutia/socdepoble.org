import React, { useEffect, useState } from 'react';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { AGENTS } from '../profile/agentsSeed';
import { resolveAsset } from '../../config/assetResolver';
import { getVal, setVal } from '../../config/storage.js';
import { useUIActions } from '../../app/contexts/UIContext';

export default function RealitatSection() {
  const { t } = useUIActions();
  const [level, setLevel] = useState(() => {
    return parseInt(getVal('socdepoble-iaia-level', '1'), 10);
  });
  
  const [selectedCompanions, setSelectedCompanions] = useState(() => {
    return getVal('socdepoble-iaia-companions', []);
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVal('socdepoble-iaia-level', level.toString());
      setVal('socdepoble-iaia-companions', selectedCompanions);
    }
  }, [level, selectedCompanions]);

  const toggleCompanion = (id) => {
    setSelectedCompanions(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const aiAgents = AGENTS.filter(a => a.type === 'AI' || a.type === 'MASTER');

  return (
    <UniversalPage
      title={t('section.realitat.title', 'Selector de Realitat')}
      subtitle={t('section.realitat.subtitle', "Configura el teu nivell d'interacció amb la IAIA MarIA i els Acompanyants.")}
      chrome="system"
      showLogos={false}
    >
      <div className="stack-grid sdp-text-content" style={{ padding: '0 var(--sdp-space-4)' }}>
        {[
          { id: 0, label: 'Apagada', desc: 'Sense intervenció de la intel·ligència artificial.' },
          { id: 1, label: 'Passiva', desc: 'Només recomanacions i accions a petició teua.' },
          { id: 2, label: 'Interactiva (Selecció)', desc: 'Conversa activa amb acompanyants específics.' },
          { id: 3, label: 'Connexió Total', desc: 'Connexió total amb tots els agents de la Masia.' }
        ].map((lvl) => (
          <div key={lvl.id} className="sdp-flex-col">
            <button
              onClick={() => setLevel(lvl.id)}
              className={`card ${level === lvl.id ? 'card--accent' : 'card--hover'}`}
              style={{ textAlign: 'left', width: '100%', cursor: 'pointer' }}
            >
              <div className="card__body">
                <h3 className="card__title">
                  Nivell {lvl.id}: {lvl.label}
                </h3>
                <p className="card__text">
                  {lvl.desc}
                </p>
              </div>
            </button>
            
            {level === 2 && lvl.id === 2 && (
              <div className="card card--soft sdp-mt-4">
                <div className="card__body">
                  <h4 className="section-title sdp-mb-4">
                    Tria els teus acompanyants:
                  </h4>
                  <div className="stack-grid">
                  {aiAgents.map(agent => {
                    const isSelected = selectedCompanions.includes(agent.id);
                    return (
                      <label key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sdp-space-4)', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleCompanion(agent.id)}
                          style={{ width: '20px', height: '20px', accentColor: 'var(--sdp-accent)' }}
                        />
                        <img 
                          src={resolveAsset(agent.avatar_url)} 
                          alt={agent.name}
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div className="sdp-flex-col">
                          <strong style={{ color: 'var(--sdp-text-fort)' }}>{agent.name}</strong>
                          <span style={{ color: 'var(--sdp-text-suau)', fontSize: 'var(--sdp-text-sm)' }}>{agent.role}</span>
                        </div>
                      </label>
                    );
                  })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </UniversalPage>
  );
}
