import { resolveAsset } from '../config/assetResolver';
import React from 'react';
import { UniversalPage } from '../components/universal/UniversalComponents';

export default function PiPlaVerd() {
  return (
    <UniversalPage
      title="Pi del Pla Verd"
      subtitle="Catàleg d'Arbres Emblemàtics i Monumentals de La Torre de les Maçanes"
      labels={[
        { text: 'Llocs', className: 'sdp-badge-category' },
        { text: 'Patrimoni', className: 'sdp-badge-tag' }
      ]}
      copyright="© Sóc de Poble / Associació El Rentonar"
      tone="brand"
    >
      <div className="sdp-mb-8">
        <img 
          src={resolveAsset("/assets/img/pi-pla-verd.jpg")} 
          alt="Pi del Pla Verd a poqueta nit" 
          style={{ width: '100%', height: 'auto', borderRadius: 'var(--sdp-radi-m)' }} 
        />
      </div>

      <p className="lead sdp-mb-8">
        Presenta un aspecte envellit amb el tronc recorbat. Una de les branques principals del seu còp està totalment sec a causa d'un raig que li va caure fa alguns anys.
      </p>

      <h3>Localització i Accés</h3>
      <p>
        <strong>Coordenades:</strong> X UTM 725272, Y UTM 4277313<br/>
        <strong>Altitud:</strong> 825 m
      </p>
      <p>
        Es troba situat junt al Mas del Pla Verd. Cal agafar la circumval·lació de La Torre de les Maçanes i el desvio cap al Mas del Els Castellans. A 400 m de l'encreuament s'arriba al pi que se situa la costat de la carretera.
      </p>

      <h3>Dimensions</h3>
      <ul>
        <li><strong>Alçada:</strong> 16 m</li>
        <li><strong>Diàmetre de còp:</strong> 17 m</li>
        <li><strong>Diàmetre de tronc (DBH):</strong> 476 cm</li>
        <li><strong>Edat estimada:</strong> Centenari</li>
      </ul>

      <div className="sdp-my-8">
        <img 
          src={resolveAsset("/assets/uploads/grup/soc-de-poble/pobles/pi-del-pla-verd/02-fitxa-arbre.jpg")} 
          alt="Fitxa tècnica de l'arbre monumental" 
          style={{ width: '100%', height: 'auto', borderRadius: 'var(--sdp-radi-m)', border: '1px solid var(--sdp-vora)' }} 
        />
      </div>

      <h3>Valor Cultural o Històric</h3>
      <p>
        A la vora de'ls masos de la zona es deixava créixer antigament un arbre perquè donara ombra. Aquestos arbres són part integrant del paisatge típic de la zona i del seu patrimoni cultural.
      </p>
      
      <h3>Estat de Salut</h3>
      <p>
        Apareixen símptomes de senescència com són còp poc dens i algunes ferides en el tronc mal cicatritzades. Mort per vellesa. Poden esgarrar-se algunes de les seues branques més pesades.
      </p>
    </UniversalPage>
  );
}
