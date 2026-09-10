import React from 'react';
import { UniversalPage } from '../../components/universal/UniversalPage';
import { DesignSectionContent } from './DesignSectionContent.jsx';
export default function DesignSection() {
  return (
    <UniversalPage
      chrome="full"
      showLogos={true}
      title="Disseny"
      labels={[
        { text: 'Sistema', className: 'sdp-badge-system' },
        { text: 'Pàgina', className: 'sdp-badge-tag' }
      ]}
      subtitle="Sistema oficial de disseny per a Sóc de Poble"
      lead="Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, perquè qualsevol IA puga entendre este sistema i reproduir-lo."
      copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
      heroImage="/assets/uploads/brain/ibanez_pedra_seca_design_1780873465211.png"
      authorName="Sóc de Poble"
      authorLocation="La Torre de les Maçanes"
      time="23:29"
      date="22/3/22"
    >
      <div className="universal-content sdp-design-system sdp-manual-disseny">
        <DesignSectionContent />
      </div>
    </UniversalPage>
  );
}