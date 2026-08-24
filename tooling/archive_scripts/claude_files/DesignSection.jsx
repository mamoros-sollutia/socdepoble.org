import SectionChrome from '../../components/SectionChrome';
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

/*
 * MANUAL DEL SISTEMA DE DISSENY
 *
 * QUÈ S'HA LLEVAT I PER QUÈ
 *
 * 1. <main>.  index.css construeix tot l'esquelet damunt de `main.app-main`.
 *    Este component en muntava un segon, niat dins del primer. Dos landmarks
 *    <main> al mateix document trenca la navegació per regions (WCAG 1.3.1)
 *    i VoiceOver es queda al primer. El contenidor ara és un <div> mut.
 *
 * 2. `max-w-5xl mx-auto p-6 grid grid-cols-1 gap-y-12 w-full`  → .sdp-manual-disseny.
 *    Sis classes per fer una columna. `grid-cols-1` és un flex-column amb
 *    passos extra de layout, i `w-full` no fa res damunt d'un bloc amb max-width.
 *
 * 3. `pb-24`.  index.css ja reserva l'espai de la barra inferior mòbil:
 *      main.app-main { padding-bottom: calc(var(--sdp-alt-nav-mobil) + safe-area) }
 *    Els dos junts feien 96px + 96px de buit fantasma per davall de 1100px.
 *
 * 4. `bg-stone-100 border-stone-300 text-stone-600 text-stone-500`.
 *    Color hardcodejat fora de la capa de tokens: en tema fosc la caixa es
 *    quedava blanca damunt del fons negre. Ara beu de --sdp-fons-subtil.
 *
 * 5. L'<h3> de l'avís d'obra.  Era un títol sense secció pròpia penjant de
 *    l'índex del manual entre mig de les seccions reals. Un paràgraf amb
 *    <strong> diu exactament el mateix sense embrutar l'esquema d'encapçalats.
 *
 * PENDENT DE VERIFICAR PEL MESTRE
 *    grep -rn "universal-content\|sosp-design-system" src/
 *    Cap de les dos classes existeix ni a index.css ni a injected_styles.css.
 *    Si tampoc estan a sosp-components.css, esborra-les: són fantasmes.
 *    No les llev jo perquè no tinc el fitxer al davant (Paradigma de l'Aixada).
 */
export default function DesignSection() {
  const { t } = useAppData();

  return (
    <SectionChrome
      kicker={t('section.disseny.kicker', 'Disseny')}
      title={t('section.disseny.title', 'Sistema de Disseny Sóc de Poble')}
      subtitle={t('section.disseny.subtitle', 'Arquitectura Pedra Seca per a interfícies clares i resistents.')}
    >
      <div className="universal-content sosp-design-system sdp-manual-disseny">
        <ColorPalette />
        <Typography />
        <SpacingAndGrid />
        <Buttons />
        <FormsAndInputs />
        <Cards />
        <Alerts />
        <LegacySections />

        <p className="sdp-avis-obra">
          <strong>{t('section.disseny.workInProgress', 'Treball en progrés')}</strong>{' '}
          {t('section.disseny.note', 'Les seccions restants estan migrant cap al patró Slot per reduir el DOM_DEPTH.')}
        </p>
      </div>
    </SectionChrome>
  );
}
