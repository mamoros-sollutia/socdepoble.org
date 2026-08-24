import { Section } from '../primitives/Section';
import { UniversalCard } from '../../universal/UniversalComponents';

/*
 * RUTES D'IMATGE · jerarquia del Genotip §8
 *   /assets/uploads/<Tipus_Entitat>/<Nom_Entitat>/<Mòdul>/<Contingut_Card>/<fitxer>
 *
 * La ruta anterior era la mateixa a tres targetes i violava la llei dos voltes:
 *   https://socdepoble.org/assets/uploads/brain/media__1776503825171.jpg
 *   · "brain" no és cap Tipus_Entitat vàlid (empresa|persona|grup|ia|ajuntament|altres).
 *   · És una URL remota. En un iPad A10 sense cobertura, la targeta es queda buida.
 *     Local-First vol dir que el fitxer viu a public/, no a un domini.
 *
 * TODO MESTRE: els tres fitxers encara no existeixen al repositori. Puja'ls a
 * estes rutes exactes o canvia les constants. No m'invente cap URL que retorne 404.
 */
const IMG = {
  samarreta:  '/assets/uploads/empresa/soc-de-poble/mercat/samarreta-soc-de-poble/01-samarreta-mapa.jpg',
  festaMajor: '/assets/uploads/ajuntament/la-torre-de-les-macanes/calendari/festa-major/01-placa-esglesia.jpg',
  piPlaVerd:  '/assets/uploads/grup/soc-de-poble/pobles/pi-del-pla-verd/01-pi-del-pla-verd.jpg',
};

export const Cards = () => (
  <Section id="targetes" title="6. Targetes">
    <div className="sdp-card-grid sdp-mb-8">

      {/* 1 · Bàsica */}
      <article className="sosp-card sdp-flex-col sdp-gap-8 sdp-p-6">
        <h3 className="sdp-titol-targeta">Targeta bàsica</h3>
        <p className="sdp-mb-0">
          Contenidor amb ombra suau, cantonades arrodonides i vora d&apos;1px.
          Fons blanc trencat per a màxim contrast en pantalles IPS.
        </p>
      </article>

      {/* 2 · Amb capçalera de marca.
          Abans: bg-[#f97316] + text-white. Dos infraccions alhora:
          #f97316 és el taronja de Tailwind, no el cànon (--sdp-accent),
          i blanc damunt d'eixe taronja mesura 2,80:1 — molt per davall de l'AA.
          Pedra Seca §2 és explícita: damunt de taronja, text NEGRE (7,49:1). */}
      <article className="sosp-card sdp-flex-col sdp-retall">
        <header className="sdp-capcalera-marca">
          <h3 className="sdp-titol-targeta">Targeta amb capçalera</h3>
        </header>
        <p className="sdp-p-6 sdp-mb-0">
          La capçalera porta el color de marca amb text negre. Útil per a destacar
          seccions importants sense trencar el contrast a plena llum del sol.
        </p>
      </article>

      {/* 3 · Amb accions.
          El <section> intern era un fals amic: sense nom accessible no genera
          cap regió, només afegeix una etiqueta. Torna a ser un <div>.
          Els botons passen de sosp-btn-* a la família .btn d'index.css, que és
          la que fan servir UniversalButton i la resta del sistema.
          Fora btn-sm: 0,85rem = 13,6px, per davall del sòl declarat de 14px
          (--sdp-text-meta). */}
      <article className="sosp-card sdp-flex-col sdp-justify-between">
        <div className="sdp-flex-col sdp-gap-8 sdp-p-6">
          <h3 className="sdp-titol-targeta">Targeta amb accions</h3>
          <p className="sdp-mb-0">Peu de targeta amb botons d&apos;acció clarament separats.</p>
        </div>
        <footer className="sdp-peu-accions">
          <button type="button" className="btn btn-ghost">Cancel·lar</button>
          <button type="button" className="btn btn-primary">Guardar</button>
        </footer>
      </article>

      {/* 4 · D'informació.
          border-l-[#16A34A] era verd de Tailwind; el cànon és --sdp-exit (#027e38).
          text-[#16A34A] damunt de l'emoji era codi mort: els glifs de color
          ignoren la propietat `color`. */}
      <article className="sosp-card sdp-vora-exit sdp-flex-col sdp-p-6">
        <header className="sdp-flex sdp-items-center sdp-gap-8 sdp-mb-2">
          <span aria-hidden="true">ℹ️</span>
          <h3 className="sdp-titol-targeta">Targeta d&apos;informació</h3>
        </header>
        <p className="sdp-mb-0">
          Vora esquerra acolorida per a indicar el tipus de contingut.
          Verd per a èxit o informació, roig per a alertes.
        </p>
      </article>

      {/* 5 · Mercat */}
      <UniversalCard
        title="Samarreta Sóc de Poble"
        subtitle="L'edició definitiva amb el logotip complet"
        body="Dibuix del mapa del tresor. Cotó Roly de màxima qualitat."
        imageUrl={IMG.samarreta}
        imageAlt="Samarreta amb el mapa del tresor de Sóc de Poble estampat al pit"
        price="15,00 €"
        labels={[
          { text: 'Mercat', className: 'label-blue' },
          { text: 'Roba', className: 'label-blue' },
          { text: 'Samarreta', className: 'label-green' },
        ]}
      />

      {/* 6 · Calendari */}
      <UniversalCard
        title="Festa Major del Poble"
        subtitle="Plaça de l'Església"
        body="Vine a gaudir de la música, el menjar i la bona companyia. Comencem a les 10:00 h."
        imageUrl={IMG.festaMajor}
        imageAlt="Plaça de l'Església engalanada amb banderetes per a la festa major"
        calendarBadge={{ dia: '14', mes: 'JUNY' }}
        labels={[
          { text: 'Calendari', className: 'label-orange' },
          { text: 'Festa', className: 'label-green' },
        ]}
      />

      {/* 7 · Mínima */}
      <UniversalCard title="Exemple de card mínima" />

      {/* 8 · Gestoria · Caixa */}
      <UniversalCard
        title="Caixa Real"
        subtitle="Saldo disponible"
        price="***,** €"
        labels={[
          { text: 'Gestoria', className: 'label-blue' },
          { text: 'Caixa Real', className: 'label-green' },
        ]}
      />

      {/* 9 · Gestoria · Hisenda */}
      <UniversalCard
        title="Hisenda"
        subtitle="Model 303 / 130"
        price="***,** €"
        labels={[
          { text: 'Gestoria', className: 'label-blue' },
          { text: 'Hisenda', className: 'label-orange' },
        ]}
      />

      {/* 10 · Enquesta.
          Les barres estaven invisibles: el JSX escrivia .progress-bar-fill i
          index.css només defineix .progress-fill. Sis classes de la família
          progress-bar-* no existien enlloc. Estan al pegat.
          Fora els estils inline (textAlign, position, zIndex) i fora
          .sdp-mb-4, que tampoc existia a l'escala d'utilitats. */}
      <UniversalCard
        title="On fem la paella popular?"
        subtitle="Vota per l'espai d'enguany"
        body={
          <div className="progress-bar-container">
            <div className="progress-bar-label">
              <span className="progress-bar-title">Plaça de l&apos;Església</span>
              <span className="progress-bar-percent">45%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill progress-bar-blue" style={{ width: '45%' }} />
            </div>

            <div className="progress-bar-label sdp-mt-4">
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
          { text: 'Enquesta', className: 'label-orange' },
        ]}
      />

      {/* 11 · Mur */}
      <UniversalCard
        title="Necessite transport a Alcoi"
        subtitle="Demà a les 09:00 per anar al metge"
        body="Si algú baixa a Alcoi de matí i em pot portar a l'hospital, compartim despeses."
        labels={[
          { text: 'Mur', className: 'label-blue' },
          { text: 'Peticions', className: 'label-orange' },
        ]}
      />

      {/* 12 · Llocs · abans "La Font de Dalt".
          NO reciclem les coordenades antigues: 38°36'23.4"N 0°25'45.1"W apuntaven
          a la font, no al pi. Penjar-les d'un altre paratge seria fabricar dades
          geogràfiques falses dins d'un mapa comunitari.
          TODO MESTRE: passa'm les coordenades reals del pi i les torne al subtítol. */}
      <UniversalCard
        title="Pi del Pla Verd"
        subtitle="Paratge del Pla Verd · La Torre de les Maçanes"
        body="Arbre monumental i punt de referència de les rutes del Pla Verd. Bona ombra per a fer la parada abans de continuar pujant."
        imageUrl={IMG.piPlaVerd}
        imageAlt="Pi monumental del Pla Verd amb els bancals de pedra seca al davant"
        labels={[
          { text: 'La Torre de les Maçanes', className: 'label-blue' },
          { text: 'Llocs Emblemàtics', className: 'label-green' },
        ]}
      />

      {/* 13 · Bàndol.
          isAvis pintava .sp-card--avis, que no existia a cap dels dos fulls:
          la targeta d'avís es veia idèntica a una de normal. Igual amb
          .label-red. Les dos estan al pegat. La distinció no és només de
          color (WCAG 1.4.1): l'etiqueta "Avís" porta el text. */}
      <UniversalCard
        title="Tall d'aigua programat"
        subtitle="Carrer Major i adjacents"
        body="Demà de 9:00 a 14:00 es tallarà el subministrament d'aigua per obres de millora a la xarxa general."
        isAvis
        labels={[
          { text: 'Bàndol', className: 'label-blue' },
          { text: 'Avís', className: 'label-red' },
        ]}
      />

    </div>
  </Section>
);
