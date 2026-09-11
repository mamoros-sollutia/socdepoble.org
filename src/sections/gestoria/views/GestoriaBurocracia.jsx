import React from 'react';
import { UniversalPage } from '../../../components/universal/UniversalPage';
import { useUIActions } from '../../../app/contexts/UIContext';

export default function GestoriaBurocracia() {
  const { t } = useUIActions();

  return (
    <UniversalPage
      title="ARXIU BUROCRÀTIC"
      category="GESTORIA"
      tags={["BUROCRÀCIA"]}
    >
      <div className="up-document universal-grid">
        
        <h2 className="sdp-text-centrat sdp-text-accent sdp-text-maj">
          GESTIÓ DE SUMA, HERÈNCIES I PAPERS QUE NO ENTENS
        </h2>

        <div className="sdp-dropzone sdp-marge-top" onClick={() => {}}>
          <div className="sdp-dropzone-icona">🗄️</div>
          <h3 className="sdp-dropzone-titol">
            LLANÇA EL PAPER DE SUMA O DE L'HERÈNCIA ACÍ
          </h3>
          <p className="sdp-text-mut sdp-marge-bottom-petit">
            Accepta PDF o Fotos del paper.
          </p>
          <p className="sdp-text-mut sdp-text-menut">
            La IAIA ho llegirà, et dirà de què va, i si has de pagar o pots oblidar-te'n.
          </p>
        </div>

        <div className="sdp-marge-top-gran">
          <h3 className="sdp-borde-inferior">
            Papers Arxivat (0)
          </h3>
          <p className="sdp-text-mut sdp-marge-top">
            Encara no has pujat cap document burocràtic.
          </p>
        </div>

      </div>
    </UniversalPage>
  );
}
