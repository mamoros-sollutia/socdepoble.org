import React, { useEffect, useState } from 'react';
import { useAppData } from '../../app/AppDataContext';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { AGENTS } from '../profile/agentsSeed';
import { resolveAsset } from '../../config/assetResolver';
import { getVal, setVal } from '../../config/storage.js';

export default function RealitatSection() {
  const { t } = useAppData();
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
      <div className="content-wrapper">
        {[
          { id: 0, label: 'Apagada', desc: 'Sense intervenció de la intel·ligència artificial.' },
          { id: 1, label: 'Passiva', desc: 'Només recomanacions i accions a petició teua.' },
          { id: 2, label: 'Interactiva (Selecció)', desc: 'Conversa activa amb acompanyants específics.' },
          { id: 3, label: 'Connexió Total', desc: 'Connexió total amb tots els agents de la Masia.' }
        ].map((lvl) => (
          <div key={lvl.id} className="sdp-flex-col">
            <button
              onClick={() => setLevel(lvl.id)}
              className={`btn-realitat ${level === lvl.id ? 'active' : ''}`}
            >
              <div className="realitat-titol">
                Nivell {lvl.id}: {lvl.label}
              </div>
              <div className="realitat-desc">
                {lvl.desc}
              </div>
            </button>
            
            {level === 2 && lvl.id === 2 && (
              <div className="realitat-companions">
                <p className="realitat-companions-titol">
                  Tria els teus acompanyants:
                </p>
                {aiAgents.map(agent => {
                  const isSelected = selectedCompanions.includes(agent.id);
                  return (
                    <label key={agent.id} className="companion-label">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleCompanion(agent.id)}
                        className="companion-checkbox"
                      />
                      <img 
                        src={resolveAsset(agent.avatar_url)} 
                        alt={agent.name}
                        className="companion-avatar"
                      />
                      <div className="sdp-flex-col">
                        <span className="companion-name">{agent.name}</span>
                        <span className="companion-role">{agent.role}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </UniversalPage>
  );
}
