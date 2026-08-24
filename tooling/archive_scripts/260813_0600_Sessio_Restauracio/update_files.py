import os

base_dir = "/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org"
cards_path = os.path.join(base_dir, "src/components/design-system/sections/Cards.jsx")
universal_path = os.path.join(base_dir, "src/components/universal/UniversalComponents.jsx")
design_path = os.path.join(base_dir, "src/sections/disseny/DesignSection.jsx")

cards_content = """import React from 'react';
import { Section } from '../primitives/Section';
import { UniversalCard } from '../../universal/UniversalComponents';

export const Cards = () => (
  <Section id="targetes" title="6. Targetes">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Targeta bàsica */}
      <article className="sosp-card p-6 flex flex-col gap-y-2">
        <h3 className="text-lg font-bold text-stone-900 m-0">Targeta bàsica</h3>
        <p className="text-stone-600 m-0 leading-relaxed">
          Contenidor amb ombra suau, cantonades arrodonides i vora de 1px.
          Fons blanc trencat per a màxim contrast en pantalles IPS.
        </p>
      </article>

      {/* Targeta amb capçalera */}
      <article className="sosp-card overflow-hidden flex flex-col">
        <header className="bg-[var(--sdp-accent)] p-4">
          <h3 className="text-lg font-bold text-[var(--sdp-sobre-accent)] m-0">Targeta amb capçalera</h3>
        </header>
        <p className="text-stone-600 p-6 m-0 leading-relaxed">
          La capçalera porta el color de marca. Útil per a destacar seccions importants.
        </p>
      </article>

      {/* Targeta amb accions */}
      <article className="sosp-card flex flex-col justify-between">
        <section className="p-6 flex flex-col gap-y-2">
          <h3 className="text-lg font-bold text-stone-900 m-0">Targeta amb accions</h3>
          <p className="text-stone-600 m-0 leading-relaxed">
            Peu de targeta amb botons d'acció clarament separats.
          </p>
        </section>
        <footer className="p-4 border-t border-stone-200 flex gap-2 justify-end bg-stone-50 rounded-b-xl">
          <button type="button" className="sosp-btn sosp-btn-fantasma" aria-label="Cancel·lar acció">
            Cancel·lar
          </button>
          <button type="button" className="sosp-btn sosp-btn-primari" aria-label="Guardar canvis">
            Guardar
          </button>
        </footer>
      </article>

      {/* Targeta d'informació */}
      <article className="sosp-card border-l-4 border-l-[var(--sdp-exit)] p-6 flex flex-col">
        <header className="flex items-center gap-2 mb-2">
          <span className="text-[var(--sdp-exit)]" aria-hidden="true">ℹ️</span>
          <h3 className="text-lg font-bold text-stone-900 m-0">Targeta d'informació</h3>
        </header>
        <p className="text-stone-600 m-0 leading-relaxed">
          Vora esquerra acolorida per a indicar tipus de contingut.
          Verd per a èxit/informació, roig per a alertes.
        </p>
      </article>

      {/* Targeta Mestra: Mercat */}
      <UniversalCard
        title="Samarreta Sóc de Poble"
        subtitle="L'edició definitiva amb el logotip complet"
        body="Dibuix del mapa del tresor. Cotó Roly de màxima qualitat."
        imageUrl="https://socdepoble.org/assets/uploads/brain/media__1776503825171.jpg"
        price="15.00€"
        labels={[
          { text: 'Mercat', className: 'label-blue' },
          { text: 'Roba', className: 'label-blue' },
          { text: 'Samarreta', className: 'label-green' }
        ]}
      />

      {/* Targeta Mestra: Calendari — imatge diferent */}
      <UniversalCard
        title="Festa Major del Poble"
        subtitle="Plaça de l'Església"
        body="Vine a gaudir de la música, el menjar i la bona companyia! Començarem a les 10:00 h."
        imageUrl="https://socdepoble.org/assets/uploads/brain/media__1776503825172.jpg"
        calendarBadge={{ dia: '14', mes: 'JUNY' }}
        labels={[
          { text: 'Calendari', className: 'label-orange' },
          { text: 'Festa', className: 'label-green' }
        ]}
      />

      {/* Targeta mínima */}
      <UniversalCard title="Exemple de card mínima" />

      {/* Gestoria */}
      <UniversalCard
        title="Caixa Real"
        subtitle="Saldo Disponible"
        price="***,** €"
        labels={[
          { text: 'Gestoria', className: 'label-blue' },
          { text: 'Caixa Real', className: 'label-green' }
        ]}
      />

      <UniversalCard
        title="Hisenda"
        subtitle="Model 303 / 130"
        price="***,** €"
        labels={[
          { text: 'Gestoria', className: 'label-blue' },
          { text: 'Hisenda', className: 'label-orange' }
        ]}
      />

      {/* Enquesta */}
      <UniversalCard
        title="On fem la paella popular?"
        subtitle="Vota per l'espai d'enguany"
        body={
          <div className="progress-bar-container sdp-mt-4 sdp-mb-4">
            <div className="progress-bar-label">
              <span className="progress-bar-title">Plaça de l'Església</span>
              <span className="progress-bar-percent">45%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill progress-bar-blue" style={{ width: '45%' }} />
            </div>
            <div className="progress-bar-label sdp-mt-2">
              <span className="progress-bar-title">Poliesportiu</span>
              <span className="progress-bar-percent">30%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill progress-bar-green" style={{ width: '30%' }} />
            </div>
          </div>
        }
        labels={[
          { text: 'Participació', className: 'label-blue' },
          { text: 'Enquesta', className: 'label-orange' }
        ]}
      />

      {/* Mur */}
      <UniversalCard
        title="Necessite transport a Alcoi"
        subtitle="Demà a les 09:00 per anar al metge"
        body="Si algú baixa a Alcoi de matí i em pot portar a l'hospital, compartim despeses."
        labels={[
          { text: 'Mur', className: 'label-blue' },
          { text: 'Peticions', className: 'label-orange' }
        ]}
      />

      {/* Llocs — títol actualitzat + imatge diferent */}
      <UniversalCard
        title="Pi del Pla Verd de La Torre de les Maçanes"
        subtitle={'Coordenades: 38°36\'23.4"N 0°25\'45.1"W'}
        body="Aigua fresca de naixement tot l'any. Un dels llocs més emblemàtics per refrescar-se a l'estiu."
        imageUrl="https://socdepoble.org/assets/uploads/brain/media__1776503825173.jpg"
        labels={[
          { text: 'La Torre de les Maçanes', className: 'label-blue' },
          { text: 'Llocs Emblemàtics', className: 'label-green' }
        ]}
      />

      {/* Avís */}
      <UniversalCard
        title="Tall d'Aigua Programat"
        subtitle="Carrer Major i adjacents"
        body="Demà de 9:00 a 14:00 es tallarà el subministrament d'aigua per obres de millora a la xarxa general."
        isAvis={true}
        labels={[
          { text: 'Bàndol', className: 'label-blue' },
          { text: 'Avís', className: 'label-red' }
        ]}
      />
    </div>
  </Section>
);
"""

design_content = """import SectionChrome from '../../components/SectionChrome';
import '../../pages/features/sosp-components.css';
import { useAppData } from '../../app/AppDataContext';

import { ColorPalette } from '../../components/design-system/sections/ColorPalette';
import { Typography } from '../../components/design-system/sections/Typography';
import { SpacingAndGrid } from '../../components/design-system/sections/SpacingAndGrid';
import { Buttons } from '../../components/design-system/sections/Buttons';
import { FormsAndInputs } from '../../components/design-system/sections/FormsAndInputs';
import { Cards } from '../../components/design-system/sections/Cards';
import { Alerts } from '../../components/design-system/sections/Alerts';
import { LegacySections } from '../../components/design-system/sections/LegacySections';

export default function DesignSection() {
  const { t } = useAppData();
  return (
    <SectionChrome
      kicker={t('section.disseny.kicker', 'Disseny')}
      title={t('section.disseny.title', 'Sistema de Disseny Sóc de Poble')}
      subtitle={t('section.disseny.subtitle', 'Arquitectura Pedra Seca per a interfícies clares i resistents.')}
    >
      <main className="universal-content w-full sosp-design-system max-w-5xl mx-auto p-6 pb-24 grid grid-cols-1 gap-y-12">
        <ColorPalette />
        <Typography />
        <SpacingAndGrid />
        <Buttons />
        <FormsAndInputs />
        <Cards />
        <Alerts />
        <LegacySections />

        <div className="text-center p-12 bg-stone-100 rounded-xl border border-dashed border-stone-300 mt-16">
          <h3 className="text-xl font-bold text-stone-600">
            {t('section.disseny.workInProgress', 'Treball en Progrés')}
          </h3>
          <p className="text-stone-500">
            {t('section.disseny.note', 'Les següents seccions estan sent migrades cap al patró Slot per reduir el DOM_DEPTH.')}
          </p>
        </div>
      </main>
    </SectionChrome>
  );
}
"""

with open(cards_path, "w") as f:
    f.write(cards_content)

with open(design_path, "w") as f:
    f.write(design_content)

print("Updates completed via python script.")
