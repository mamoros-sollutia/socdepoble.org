import React from 'react';
import { UniversalPage } from '../../../components/universal/UniversalPage';
import { useUIActions } from '../../../app/contexts/UIContext';

export default function GestoriaBurocracia() {
  const { t } = useUIActions();

  return (
    <UniversalPage chrome="system"
      title="ARXIU BUROCRÀTIC"
      labels={["GESTORIA", "BUROCRÀCIA"]}
    >
      <div className="content-wrapper sdp-card-grid">
        
        <h2 className="sp-card-copyright stat-value univ-manager-facet-header">
          GESTIÓ DE SUMA, HERÈNCIES I PAPERS QUE NO ENTENS
        </h2>

        <div className="upload-zone sdp-camp" onClick={() => {}}>
          <div className="upload-zone-text">🗄️</div>
          <h3 className="upload-zone-text">
            LLANÇA EL PAPER DE SUMA O DE L'HERÈNCIA ACÍ
          </h3>
          <p className="sdp-camp__ajuda sdp-camp">
            Accepta PDF o Fotos del paper.
          </p>
          <p className="sdp-camp__ajuda">
            La IAIA ho llegirà, et dirà de què va, i si has de pagar o pots oblidar-te'n.
          </p>
        </div>

        <div className="sdp-camp">
          <h3 className="sdp-divisor">
            Papers Arxivat (0)
          </h3>
          <p className="sdp-camp__ajuda sdp-camp">
            Encara no has pujat cap document burocràtic.
          </p>
        </div>

      </div>
    </UniversalPage>
  );
}
