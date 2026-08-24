import React from 'react';
import { UniversalCard } from '../../universal/UniversalComponents.jsx';
import { Section } from '../primitives/Section.jsx';

export const Cards = () => (
  <Section id="targetes" title="24. Targetes (Cards)">
    <div className="sdp-card-grid sdp-mb-8">

      {/* 2. Targeta de la Botiga (Mercat) - Imatge Completa */}
      <UniversalCard 
        title="Samarreta Sóc de Poble"
        subtitle="L'edició definitiva amb el logotip complet"
        body="Dibuix del mapa del tresor. Cotó Roly de màxima qualitat."
        price="15.00€"
        imageUrl="https://socdepoble.org/assets/uploads/brain/media__1776503825171.jpg"
        labels={[
          { text: 'Mercat', className: 'label-blue' },
          { text: 'Roba', className: 'label-blue' },
          { text: 'Samarreta', className: 'label-green' }
        ]}
        author="Sóc de Poble"
        location="La Torre de les Maçanes"
        avatarUrl="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"
        time="00:29"
        date="23/3/22"
        copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
        showPin={true}
        hasFooter={true}
        connectLabel="Connectar"
      />

      {/* 3. Targeta de Mur (Disseny Pedra Seca) */}
      <UniversalCard 
        title="Disseny Pedra Seca"
        subtitle="Sistema oficial de disseny per a Sóc de Poble"
        body="Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, perquè qualsevol IA puga entendre este sistema i reproduir-lo."
        imageUrl="assets/img/ibanez_pedra_seca_design_1780873465211.png"
        labels={[
          { text: 'MUR', className: 'label-orange' },
          { text: 'Disseny UI', className: 'label-blue' }
        ]}
        author="Sóc de Poble"
        location="La Torre de les Maçanes"
        avatarUrl="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"
        time="10:00"
        date="07/8/22"
        copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
        showPin={true}
        hasFooter={true}
        connectLabel="Connectar"
      />

      {/* 4. Targeta d'Esdeveniments (Aplec pel Territori) */}
      <UniversalCard 
        title="2n Aplec pel Territori"
        subtitle="Jornada reivindicativa i festiva"
        body="Trobada anual en defensa del nostre territori. Música, xarrades i germanor a La Torre de les Maçanes."
        imageUrl="https://socdepoble.net/wp-content/uploads/2022/11/aplec-pel-territori-2023-A4-1900px-1.jpg"
        labels={[
          { text: 'Esdeveniment', className: 'label-orange' },
          { text: 'Calendari', className: 'label-blue' }
        ]}
        author="Sóc de Poble"
        location="La Torre de les Maçanes"
        avatarUrl="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"
        time="09:00"
        date="17/11/23"
        dateTime="2023-11-17T09:00:00"
        copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
        showPin={true}
        hasFooter={true}
        connectLabel="Connectar"
      />

    </div>
  </Section>
);
