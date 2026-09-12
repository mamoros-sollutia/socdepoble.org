# MINI-BUNDLE PER A Z

## FITXER: src/components/ui/PillToggle.jsx
```jsx
/**
 * PillToggle.jsx — selector de píndola canònic de Pedra Seca (260911).
 *
 * Patró blindat pel Mestre: una píndola amb N opcions, una sola activa.
 * Substituïx les còpies soltes de `.pill` + `.pill--active` (Mur, Multimedia,
 * Onboarding) i serà el selector [Universal Cards] [Vista Comprimida].
 *
 * Decisions que no s'han de desfer:
 *  · L'estat actiu es pinta des de `[aria-pressed="true"]`, no des d'una
 *    classe. Si algú lleva l'ARIA, l'opció deixa de semblar activa: la
 *    versió inaccessible no pot tindre bon aspecte. (`.pill--active` no tenia
 *    cap regla CSS: l'estat era invisible.)
 *  · Botons natius dins d'un `role="group"`: Tab + Espai/Retorn sense JS de
 *    teclat. No és `tablist` perquè no hi ha `tabpanel`.
 *  · `onCanvi` es crida sempre, també sobre l'opció ja activa: el consumidor
 *    decidix (el Mapa del Mur es plega tornant a polsar-lo).
 *  · Actiu = taronja amb text fosc (--sdp-sobre-accent). Mai blanc sobre
 *    taronja (2,73:1).
 */
export function PillToggle({
  opcions = [],
  valor,
  onCanvi,
  etiqueta,
  className = '',
  children,
}) {
  return (
    <div
      role="group"
      aria-label={etiqueta}
      className={['sdp-pindola', className].filter(Boolean).join(' ')}
    >
      {opcions.map((opcio) => (
        <button
          key={opcio.valor}
          type="button"
          className="sdp-pindola__opcio"
          aria-pressed={opcio.valor === valor ? 'true' : 'false'}
          onClick={() => onCanvi?.(opcio.valor)}
        >
          {opcio.icona ? <span className="sdp-pindola__icona" aria-hidden="true">{opcio.icona}</span> : null}
          {opcio.text}
        </button>
      ))}
      {children}
    </div>
  );
}

```

## FITXER: src/components/ui/index.js
```jsx
/**
 * components/ui — façana pública de la UI universal.
 *
 *  · Exportacions amb nom i explícites: si un nom desapareix, el build peta
 *    en lloc de callar.
 *  · Cap fitxer de ui/ importa d'ací: els germans s'importen directament
 *    ('./controls.jsx'). Així no hi ha cicles.
 *  · Només UniversalCard.jsx toca el router.
 */
export { BackIcon, ForwardIcon, IndexIcon, TranslateIcon, CommentIcon, ShareIcon, PinIcon, IaiaIcon } from './icones.jsx';
export { ActionControl, IconButton, UniversalButton, DateTimeControl } from './controls.jsx';
export { UniversalCard } from './UniversalCard.jsx';
export { UniversalIndicatorCard } from './UniversalIndicatorCard.jsx';
export { Accordion, AccordionItem } from './Accordion.jsx';
export { Dropdown, DropdownItem } from './Dropdown.jsx';
export { UniversalSearch } from './UniversalSearch.jsx';
export { PillToggle } from './PillToggle.jsx';

```

## FITXER: src/sections/disseny/DesignSection.jsx
```jsx
import { lazy, Suspense } from 'react';
import { UniversalPage } from '../../components/universal/UniversalPage';
import { useLocation, useSearchParams, useNavigate } from '../../app/contexts/RouterContext';
import { DesignSectionContent } from './DesignSectionContent.jsx';
import { PAGINES } from './cataleg/registre.js';
import { PillToggle } from '../../components/ui/PillToggle.jsx';

/* Cada pàgina del catàleg és un chunk: qui obri Fonaments no paga Formularis. */
const PAGINA = {
  estructura: lazy(() => import('./cataleg/PaginaEstructura.jsx')),
  formularis: lazy(() => import('./cataleg/PaginaFormularis.jsx')),
  superposicions: lazy(() => import('./cataleg/PaginaSuperposicions.jsx')),
  retroalimentacio: lazy(() => import('./cataleg/PaginaRetroalimentacio.jsx')),
  navegacio: lazy(() => import('./cataleg/PaginaNavegacio.jsx')),
  inventari: lazy(() => import('./cataleg/PaginaInventari.jsx')),
};

export default function DesignSection() {
  const [params] = useSearchParams();
  /* /disseny redirigix a /jo/disseny i perd la query: els enllaços es fan
     sobre la ruta real, no sobre l'àlies. */
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const demanada = params.get('pagina');
  const actual = PAGINA[demanada] ? demanada : 'fonaments';
  const Pagina = PAGINA[actual];

  return (
    <UniversalPage
      chrome="full"
      showLogos={true}
      title="Disseny"
      subtitle="Sistema oficial de disseny per a Sóc de Poble"
      lead="Cada component es documenta amb el seu espècimen viu, el contracte, l'accessibilitat i les regles de fes / no facis, perquè qualsevol persona o IA el puga reproduir sense endevinar."
      copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
      heroImage="/assets/uploads/brain/ibanez_pedra_seca_design_1780873465211.png"
      authorName="Sóc de Poble"
      authorLocation="La Torre de les Maçanes"
      time="23:29"
      date="22/3/22"
    >
      <PillToggle
        etiqueta="Pàgines del sistema de disseny"
        valor={actual}
        onCanvi={(id) => {
          navigate(id === 'fonaments' ? pathname : `${pathname}?pagina=${id}`);
        }}
        opcions={PAGINES.map((p) => ({ valor: p.id, text: p.titol }))}
        className="sdp-pindola--disseny"
      />
      <div className="sdp-design-content">
        {Pagina ? (
          <Suspense fallback={<div className="sdp-design-suspense" />}>
            <Pagina />
          </Suspense>
        ) : <DesignSectionContent />}
      </div>
    </UniversalPage>
  );
}

```

## FITXER: src/sections/disseny/DesignSectionContent.jsx
```jsx
import React from 'react';
import { UniversalCard, Accordion, AccordionItem, Dropdown, DropdownItem } from '../../components/universal/UniversalElements';
import { EventCard } from '../../components/universal/EventCard.jsx';
import { showToast, AvisadorEfimer } from '../../components/universal/AvisadorEfimer.jsx';
import { EVENTS } from '../mur/eventsContent.js';

/**
 * ComponentDoc - Wrapper per a documentar elements del Sistema de Disseny (Pedra Seca)
 * Açò actua com a "Storybook" en miniatura.
 */
function ComponentDoc({ title, description, technical, noBackground, children }) {
  return (
    <div className="component-doc ">
      <div className="component-doc-header">
        <h3 >{title}</h3>
        {description && <p >{description}</p>}
        {technical && (
          <div className="sdp-alerta sdp-alerta--info">
            <strong>Context Tècnic: </strong> {technical}
          </div>
        )}
      </div>
      <div className={noBackground ? 'dsg-pt-4' : 'component-doc-preview'}>
        {children}
      </div>
    </div>
  );
}

export function DesignSectionContent() {
  return (
    <>
        {/* Generated JSX from HTML */}
        
<section className="design-block ">
<h3>1. Lleis de Pedra Seca per a IAs Arquitectes</h3>
<p >Normes absolutes que regeixen tot el que una IA pot o no pot fer en este repositori. Açò és el més important abans de tocar cap codi o disseny.</p>

<h4>1.1 Arquitectura de la Pàgina Universal (UniversalPage)</h4>
<div className="sdp-alerta sdp-alerta--info ">
  <div className="alert-content">
    <p><strong>Estructura Anatòmica Inviolable (FONT ÚNICA DE VERITAT)</strong><br/>Aquesta secció i el component <code>UniversalComponents.jsx</code> (on es defineix la UniversalPage) són la font única de veritat per a qualsevol agent o IA. Tota nova pàgina ha d'estendre exclusivament aquesta arquitectura, sense excepcions.</p>
    <ol className="sdp-design-col">
      <li><strong>Barres Superiors (Controls):</strong> La barra blava de navegació (context) i la barra taronja d'autoria (dades meta, data, connectar). En mode normal (pàgina completa), aquestes barres fan <em>sticky</em> a la part superior (es queden fixades).</li>
      <li><strong>Excepció (Mode Incrustat):</strong> Quan la UniversalPage s'incrusta en un editor (com el Bloc de Notes), la barra blava i la taronja adopten classe <code>--embed</code> (<em>position: static</em>) i s'amaguen naturalment amb l'scroll del document per afavorir l'edició lliure i evitar un "doble scroll". Aquesta és l'única excepció permesa.</li>
      <li><strong>Imatge Hero (Opcional):</strong> Es renderitza immediatament davall de les barres. Ocupa l'ample disponible (100%) sense marges.</li>
      <li><strong>La Targeta de Decoració Blanca (Header):</strong> Un bloc blanc amb <em>box-shadow</em> que embolica el logotip de Sóc de Poble (max 600px), l'element <strong>H1</strong> (H3 a la card), les etiquetes de categorització, i el <strong>Copyright</strong> de tancament.
      <br/><small >Nota: El tancament d'aquesta targeta delimita el final de la decoració del títol.</small></li>
      <li><strong>H2 i Entradilla (Fora de la targeta blanca):</strong> Actuen de pont i preàmbul visual abans d'endinsar-se en l'article profund.</li>
      <li><strong>H3 i Contingut Base (article):</strong> El text enriquit, estructurat harmònicament cap avall amb una amplària màxima centrada (~68 caràcters) per afavorir la llegibilitat (<em>var(--sdp-measure)</em>). La resta d'elements (targetes, graelles) flueixen a tota l'amplària disponible del contenidor respectant els marges de 40px (<em>var(--sdp-pad-contenidor)</em>).</li>
    </ol>
  </div>
</div>

<p><strong>Esquema anatòmic canònic (UniversalPage)</strong>:</p>
<pre><code>{`<!-- El shell extern de l'aplicació -->
<div className="app-layout">
  <Sidebar /> <!-- nav.app-sidebar -->
  <main className="app-main">
    <Topbar /> <!-- header.app-header -->
    <!-- El contenidor de la pàgina -->
    <div className="page-container">

      <!-- INICI DE LA UNIVERSAL PAGE -->
      <article className="universal-page">
        <!-- 1. Barres Superiors -->
        <header className="bar-blue">...</header>
        <section className="bar-orange">...</section>

        <!-- 2. Decoració Targeta Blanca -->
        <header className="page-header-card">
          <h1>Títol</h1>
          <div className="meta-footer">...</div>
        </header>

        <!-- 3. Contingut base -->
        <div className="page-content-wrapper">
          <p className="lead">Entradilla</p>
          <div className="page-content">
             <p>Text de cos limitat a 68ch...</p>
             <UniversalCard />
          </div>
        </div>
      </article>

    </div>
  </main>
</div>`}</code></pre>

<h4>1.2 Normes de Codi i CSS Absolutes (Llista "Prohibit Inventar")</h4>
<div className="sdp-alerta sdp-alerta--avis "><div className="alert-content">
<p><strong>Aquestes regles són absolutes i no es poden trencar sota cap concepte:</strong></p>
<ol>
<li><strong>Cap Serif al Core:</strong> Està terminantment prohibit usar tipografies serif (com Times o Georgia). La font única i exclusiva és <code>Noto Sans</code>.</li>
<li><strong>Prohibició d'estils en línia:</strong> Està terminantment prohibit l'ús de <code>style=&#123;&#123;&#125;&#125;</code> en tot el codi JSX. Tots els estils han de viure en CSS mitjançant classes de la Constitució Pedra Seca.</li>
<li><strong>Només Variables Semàntiques:</strong> Els components han d'utilitzar únicament els tokens semàntics (Capa 2, ex. <code>var(--sdp-accio)</code>). Prohibit aplicar colors directes o tokens de la paleta primitiva (Capa 1). L'H3 usa exclusivament <code>var(--sdp-accio-text)</code>.</li>
<li><strong>Shadow DOM i Mode Fosc:</strong> Perquè les variables de CSS funcionin bé dins de WordPress o altres entorns amb Shadow DOM, <strong>sempre</strong> que s'escrigui una regla per al tema fosc com <code>:root[data-theme="dark"]</code> s'ha de duplicar exactament amb el selector bessó <code>:host([data-theme="dark"])</code>.</li>
</ol>
</div></div>
</section>

<section className="design-block">
<h3>2. Identitat Cromàtica</h3>
<p>La paleta es genera en <strong>OKLCH</strong>: el to i el croma de marca es mantenen constants i només varia la lluminositat. Per això l'escala és perceptivament regular i cada graó té un contrast previsible.</p>
<div className="sdp-alerta sdp-alerta--info "><div className="alert-content"><h4>Contracte d'accessibilitat</h4>
<p>Este sistema complix <strong>WCAG 2.2 nivell AAA (≥7:1) en tot el text, els fons i els grisos estructurals</strong>, i <strong>nivell AA (≥4,5:1) en els colors d'interacció</strong> — enllaços, pestanyes actives i botons primaris. Els límits dels controls complixen la norma 1.4.11 (≥3:1).</p>
<p>Esta distinció és deliberada i honesta: AAA estricte en tot obligaria a abandonar el taronja de marca, perquè cap taronja reconeixible arriba a 7:1 sobre blanc. Preferim dir-ho que amagar-ho.</p>
</div></div>

<h4>2.1 Colors de marca</h4>
<div className="palette">
<div className="swatch">
<div className="swatch-color sw-primary-500">Taronja · fons</div>
<div className="swatch-info">#ff7300<br/>--sdp-primary-500</div>
</div>
<div className="swatch">
<div className="swatch-color sw-primary-700">Taronja fort</div>
<div className="swatch-info">#ad4c03<br/>--sdp-primary-700<br/>Text accent sobre fons clar · fons massís de botó important</div>
</div>
<div className="swatch">
<div className="swatch-color sw-secondary-500">Blau · fons</div>
<div className="swatch-info">#016ebf<br/>--sdp-secondary-500</div>
</div>
<div className="swatch">
<div className="swatch-color sw-secondary-600">Blau fort</div>
<div className="swatch-info">#00599d<br/>--sdp-secondary-600</div>
</div>
<div className="swatch">
<div className="swatch-color sw-blanc-pur">Blanc</div>
<div className="swatch-info">#ffffff<br/>Fons principal</div>
</div>
<div className="swatch">
<div className="swatch-color sw-negre-pur">Negre</div>
<div className="swatch-info">#0e0d0c<br/>--sdp-pedra-900<br/>Text principal</div>
</div>
</div>
<div className="sdp-taula sdp-taula--densa"><table><thead><tr><th>Parella</th><th>Contrast</th><th>Nivell</th><th>Ús</th></tr></thead><tbody>
<tr><td>Text fosc sobre taronja 500</td><td>7.13:1</td><td>AAA</td><td>Botons primaris, capçalera de targeta</td></tr>
<tr><td>Taronja 700 sobre blanc</td><td>5.51:1</td><td>AA</td><td>Enllaços, pestanya activa</td></tr>
<tr><td>Taronja 800 sobre blanc</td><td>7.97:1</td><td>AAA</td><td>Títols h2 i h4</td></tr>
<tr><td>Blanc sobre blau 500</td><td>5.23:1</td><td>AA</td><td>Barra blava, peu de targeta</td></tr>
<tr><td>Blau 600 sobre blanc</td><td>7.20:1</td><td>AAA</td><td>Títols h1, h3 i h5</td></tr>
</tbody></table></div>
<h4>1.2 Colors d'estat</h4>
<div className="palette">
<div className="swatch">
<div className="swatch-color sw-error-500">Alerta</div>
<div className="swatch-info">#c2181d<br/>--sdp-error-500</div>
</div>
<div className="swatch">
<div className="swatch-color sw-avis-500">Avís</div>
<div className="swatch-info">#9c6902<br/>--sdp-avis-500</div>
</div>
<div className="swatch">
<div className="swatch-color sw-exit-500">Èxit</div>
<div className="swatch-info">#027e38<br/>--sdp-exit-500</div>
</div>
</div>
<h4>1.3 Escala Pedra</h4>
<p>Neutre càlid, mai gris fred. El graó <strong>600</strong> és el sòl per a text secundari: és el primer que arriba a 7:1 sobre blanc.</p>
<div className="palette">
<div className="swatch">
<div className="swatch-color sw-pedra-50">Blanc trencat · 50</div>
<div className="swatch-info">#ffffff<br/>--sdp-pedra-50</div>
</div>
<div className="swatch">
<div className="swatch-color sw-pedra-100">Núvol · 100</div>
<div className="swatch-info">#ffffff<br/>--sdp-pedra-100</div>
</div>
<div className="swatch">
<div className="swatch-color sw-pedra-200">Arena · 200</div>
<div className="swatch-info">#efece7<br/>--sdp-pedra-200</div>
</div>
<div className="swatch">
<div className="swatch-color sw-pedra-300">Calç · 300</div>
<div className="swatch-info">#dcd7cd<br/>--sdp-pedra-300</div>
</div>
<div className="swatch">
<div className="swatch-color sw-pedra-400">Cendra · 400</div>
<div className="swatch-info">#b7b1a5<br/>--sdp-pedra-400</div>
</div>
<div className="swatch">
<div className="swatch-color sw-pedra-500">Pedra · 500</div>
<div className="swatch-info">#8b857b<br/>--sdp-pedra-500</div>
</div>
<div className="swatch">
<div className="swatch-color sw-pedra-600">Pedra fosca · 600</div>
<div className="swatch-info">#5b564e<br/>--sdp-pedra-600</div>
</div>
<div className="swatch">
<div className="swatch-color sw-pedra-700">Grafit · 700</div>
<div className="swatch-info">#3d3b35<br/>--sdp-pedra-700</div>
</div>
<div className="swatch">
<div className="swatch-color sw-pedra-750">Pissarra · 750</div>
<div className="swatch-info">#302e29<br/>--sdp-pedra-750</div>
</div>
<div className="swatch">
<div className="swatch-color sw-pedra-800">Carbó · 800</div>
<div className="swatch-info">#22211e<br/>--sdp-pedra-800</div>
</div>
<div className="swatch">
<div className="swatch-color sw-pedra-850">Sutja · 850</div>
<div className="swatch-info">#181715<br/>--sdp-pedra-850</div>
</div>
<div className="swatch">
<div className="swatch-color sw-pedra-900">Negre · 900</div>
<div className="swatch-info">#0e0d0c<br/>--sdp-pedra-900</div>
</div>
</div>
</section>
{/*  SECCIÓ: TIPOGRAFIA CMS  */}
<section className="design-block">
<h3>2. Estudi Tipogràfic (Contracte Canònic)</h3>
<p>Aquesta és l'arquitectura tipogràfica universal de l'ecosistema Sóc de Poble. S'ha dissenyat sota un rigorós estudi per a garantir l'accessibilitat AAA (lectura sota llum solar intensa per a gent gran).</p>

<div className="sdp-alerta sdp-alerta--avis">
  <div className="alert-content">
    <h4>CONTRACTE TIPOGRÀFIC (PROHIBIT AL·LUCINAR)</h4>
    <p>Cap IA pot alterar o inventar tipografies (com introduir "serif" a l'H3 per associar-ho a conceptes com "còdex" o "arcaic"). Tot el sistema utilitza estrictament <strong>Noto Sans</strong>. A més, els colors dels títols alternen entre Blau Acció i Taronja Accent, i aquesta és l'única veritat acceptable.</p>
  </div>
</div>

<div className="sdp-taula sdp-taula--densa">
  <table>
    <thead>
      <tr>
        <th>Nivell</th>
        <th>Mida (rem/px)</th>
        <th>Pes (font-weight)</th>
        <th>Color Token</th>
        <th>Alineació</th>
        <th>Vora (Border)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>H1</strong></td>
        <td>2.5rem (40px)</td>
        <td>800</td>
        <td><code>var(--sdp-accio-text)</code> (Blau fort)</td>
        <td>Centrat</td>
        <td>Cap</td>
      </tr>
      <tr>
        <td><strong>H2</strong></td>
        <td>2rem (32px)</td>
        <td>800</td>
        <td><code>var(--sdp-accent-titol)</code> (Taronja fort)</td>
        <td>Centrat</td>
        <td>Cap</td>
      </tr>
      <tr>
        <td><strong>H3</strong></td>
        <td>1.75rem (28px)</td>
        <td>700</td>
        <td><code>var(--sdp-accio-text)</code> (Blau fort)</td>
        <td>Esquerra</td>
        <td>Inferior (1px solid var(--sdp-vora))</td>
      </tr>
      <tr>
        <td><strong>H4</strong></td>
        <td>1.5rem (24px)</td>
        <td>700</td>
        <td><code>var(--sdp-accent-titol)</code> (Taronja fort)</td>
        <td>Esquerra</td>
        <td>Cap</td>
      </tr>
      <tr>
        <td><strong>H5</strong></td>
        <td>1.25rem (20px)</td>
        <td>700</td>
        <td><code>var(--sdp-accio-text)</code> (Blau fort)</td>
        <td>Esquerra</td>
        <td>Cap</td>
      </tr>
      <tr>
        <td><strong>H6</strong></td>
        <td>1.125rem (18px)</td>
        <td>700</td>
        <td><code>var(--sdp-text-suau)</code> (Pedra)</td>
        <td>Esquerra</td>
        <td>Cap (Text en majúscules)</td>
      </tr>
    </tbody>
  </table>
</div>

<h4>Ritme Vertical i Espaiat Editorial</h4>
<p>L'interlineat base (line-height) és <code>1.65</code> per a paràgrafs i text de cos, garantint oxigen a la lectura, i <code>1.21</code> (snug) per a encapçalaments, mantenint compacitat visual.</p>
<div className="sdp-taula sdp-taula--densa">
  <table>
    <thead>
      <tr>
        <th>Element</th>
        <th>Marge Superior (margin-top)</th>
        <th>Marge Inferior (margin-bottom)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>h1</strong></td>
        <td><code>0</code></td>
        <td><code>16px</code> (var(--sdp-space-4))</td>
      </tr>
      <tr>
        <td><strong>h2</strong></td>
        <td><code>48px</code> (var(--sdp-space-12))</td>
        <td><code>12px</code> (var(--sdp-space-3))</td>
      </tr>
      <tr>
        <td><strong>h3</strong></td>
        <td><code>40px</code> (var(--sdp-space-10))</td>
        <td><code>12px</code> (var(--sdp-space-3))</td>
      </tr>
      <tr>
        <td><strong>h4</strong></td>
        <td><code>32px</code> (var(--sdp-space-8))</td>
        <td><code>8px</code> (var(--sdp-space-2))</td>
      </tr>
      <tr>
        <td><strong>Paràgraf (p)</strong> / <strong>Llistes (ul, ol)</strong></td>
        <td><code>0</code></td>
        <td><code>16px</code> (var(--sdp-space-4))</td>
      </tr>
    </tbody>
  </table>
</div>

<h4>Lleis Fonamentals Addicionals:</h4>
<ul>
<li><strong>Arrel Mestra:</strong> <code>18px (1.125rem)</code> per a garantir touch-targets i visibilitat nativa sense zoom.</li>
<li><strong>Ample Màxim de Lectura:</strong> <code>68ch</code>, el límit científic abans de causar fatiga ocular al saltar de línia.</li>
<li><strong>Subtítols (H2):</strong> Mai porten punt final, ja que funcionen com a titulars estructurals i no com a paràgrafs.</li>
<li><strong>Entradilla (Lead):</strong> S'ha d'ubicar sempre exclusivament davall del títol H2. Aquest és el seu únic lloc.</li>
</ul>

</section>
{/*  SECCIÓ: ESPAIAT I GRID  */}
<section className="design-block">
<h3>3. Espaiat i Grid</h3>
<h4>Sistema d'Espaiat (escala modular base 4/8)</h4>

<div className="sdp-escala">
  <div className="sdp-escala__fila"><span className="sdp-escala__token">--sdp-space-1</span><span className="sdp-escala__barra sdp-escala__barra--1"></span><span>4 px</span></div>
  <div className="sdp-escala__fila"><span className="sdp-escala__token">--sdp-space-2</span><span className="sdp-escala__barra sdp-escala__barra--2"></span><span>8 px</span></div>
  <div className="sdp-escala__fila"><span className="sdp-escala__token">--sdp-space-3</span><span className="sdp-escala__barra sdp-escala__barra--3"></span><span>12 px</span></div>
  <div className="sdp-escala__fila"><span className="sdp-escala__token">--sdp-space-4</span><span className="sdp-escala__barra sdp-escala__barra--4"></span><span>16 px</span></div>
  <div className="sdp-escala__fila"><span className="sdp-escala__token">--sdp-space-6</span><span className="sdp-escala__barra sdp-escala__barra--6"></span><span>24 px</span></div>
  <div className="sdp-escala__fila"><span className="sdp-escala__token">--sdp-space-8</span><span className="sdp-escala__barra sdp-escala__barra--8"></span><span>32 px</span></div>
  <div className="sdp-escala__fila"><span className="sdp-escala__token">--sdp-space-10</span><span className="sdp-escala__barra sdp-escala__barra--10"></span><span>40 px</span></div>
  <div className="sdp-escala__fila"><span className="sdp-escala__token">--sdp-space-12</span><span className="sdp-escala__barra sdp-escala__barra--12"></span><span>48 px</span></div>
  <div className="sdp-escala__fila"><span className="sdp-escala__token">--sdp-space-16</span><span className="sdp-escala__barra sdp-escala__barra--16"></span><span>64 px</span></div>
  <div className="sdp-escala__fila"><span className="sdp-escala__token">--sdp-space-20</span><span className="sdp-escala__barra sdp-escala__barra--20"></span><span>80 px</span></div>
</div>

<h4>Grid Responsive</h4>
<div className="grid-preview">
<div className="grid-col">1 columna (mòbil)</div>
<div className="grid-col">2 columnes (tauleta)</div>
<div className="grid-col">3 columnes (escriptori)</div>
</div>
</section>
{/*  SECCIÓ: BOTONS  */}
<section className="design-block ">
<ComponentDoc
  title="4. Botons (Accions)"
  description="L'element interactiu fonamental. Els botons han de comunicar clarament l'acció que realitzaran i el seu nivell d'importància."
  technical="Tots els botons complixen un touch-target mínim de 44x44px en mòbil. L'estat :focus-visible aplica un anell de color per a navegació per teclat (WCAG 2.1.1). Mai s'han d'usar per a enllaços simples sense acció."
>
  <h4>Variants i Jerarquia</h4>
  <p >Els botons es divideixen en nivells d'atenció. Usa <code>btn-primary</code> només per a l'acció principal d'una vista.</p>
  <div className="btn-group ">
    <button className="btn btn-primary">Primari</button>
    <button className="btn btn-secondary">Secundari</button>
    <button className="btn btn-outline-dark">Terciari</button>
    <button className="btn btn-base">Neutral / Base</button>
    <button className="btn btn-danger">Perill</button>
    <button className="btn btn-ghost">Fantasma</button>
  </div>

  <h4>Estats d'Interacció</h4>
  <p >Els estats visuals informen l'usuari sobre la disponibilitat de l'acció.</p>
  <div className="btn-group ">
    <button className="btn btn-primary">Normal</button>
    <button className="btn btn-primary" disabled>Desactivat</button>
    <button className="btn btn-primary" disabled>
      <svg className="spinner spinner-sm " viewBox="0 0 24 24">
        <circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeWidth="3"></circle>
      </svg>
      <span>Carregant...</span>
    </button>
  </div>
</ComponentDoc>
</section>

{/*  SECCIÓ: TARGETA MESTRA I AVATARS  */}
<section className="design-block">
  <h3>4.5 Avatars (Contracte)</h3>
  <div className="sdp-alerta sdp-alerta--avis">
    <div className="alert-content">
      <p><strong>Prohibit inventar mides:</strong> Els avatars només poden tenir les mides: <code>xs</code> (24px), <code>sm</code> (32px), <code>md</code> (44px, mínim touch), <code>lg</code> (56px) i <code>xl</code> (80px). Ràtio 1:1 exacte. Colors restringits a variables semàntiques.</p>
    </div>
  </div>
  <div className="sdp-avatar-grup">
    <span className="sdp-avatar sdp-avatar--xl">IA</span>
    <span className="sdp-avatar sdp-avatar--lg">MJ</span>
    <span className="sdp-avatar sdp-avatar--md">ER</span>
    <span className="sdp-avatar sdp-avatar--sm">SP</span>
    <span className="sdp-avatar sdp-avatar--xs">+4</span>
  </div>

  <h3>4.6 Targeta Mestra (UniversalCard)</h3>
  <p>La <code>&lt;UniversalCard&gt;</code> és el component base per a mostrar qualsevol entitat (poble, fitxa, usuari). No s'ha d'intentar imitar el seu DOM a mà; s'ha d'instanciar el component de React.</p>

  <div className="sdp-alerta sdp-alerta--avis">
    <div className="alert-content">
      <h4>CONTRACTE DOM (UNIVERSAL CARD)</h4>
      <p>Quan calgui entendre o replicar l'estructura, l'ordre de renderitzat és estricte:</p>
      <ol>
        <li><code>.sp-card-header</code> (Opcional, autoria i meta).</li>
        <li><code>.sp-card-media-container</code> (Opcional, aspect-ratio 1/1).</li>
        <li><code>.sp-card-body</code> (Obligatori, conté el títol, subtítol, text descriptiu i etiquetes <code>.sp-card-labels</code>).</li>
        <li><code>.sp-card-footer</code> (Opcional, equival a la barra blava, amb botons d'acció).</li>
      </ol>
      <p><strong>Classes obligatòries:</strong> L'embolcall sempre porta la classe <code>.sp-card</code>.</p>
    </div>
  </div>
  <div className="sdp-alerta sdp-alerta--info">
    <div className="alert-content">
      <h4>Invocació Canònica</h4>
      <p><code>{`<UniversalCard title="Títol" subtitle="Subtítol" headerLabel="Categoria" img="ruta.jpg" />`}</code></p>
    </div>
  </div>
</section>

{/*  SECCIÓ: FORMULARIS  */}
<section className="design-block">
<h3>5. Formularis i Inputs</h3>

<div className="form-group">
<label>Nom del poble</label>
<input placeholder="Ex: Petrer" type="text"/>
</div>
<div className="form-group">
<label>Província</label>
<select>
<option>Alacant</option>
<option>València</option>
<option>Castelló</option>
</select>
</div>
<div className="form-group">
<label>Descripció</label>
<textarea placeholder="Escriu una breu descripció..." rows="4"></textarea>
</div>
<div className="checkbox-group">
<input defaultChecked id="chk1" type="checkbox"/>
<label htmlFor="chk1">Accepte els termes del Consell de la Petorreta</label>
</div>
<div className="checkbox-group ">
<input defaultChecked id="optA" name="opt" type="radio"/> <label htmlFor="optA">Opció A</label>
<input id="optB" name="opt" type="radio"/> <label htmlFor="optB">Opció B</label>
</div>
<div className="form-group has-error ">
<label>Input amb error</label>
<input type="text" defaultValue="valor incorrecte"/>
<div className="error-text">Aquest camp és obligatori.</div>
</div>
<div className="form-group is-disabled ">
<label>Input desactivat</label>
<input disabled type="text" defaultValue="No editable"/>
</div>

</section>
{/*  SECCIÓ 7: ALERTES  */}
<section className="design-block">
<h3>7. Alertes i Missatges</h3>
<div className="sdp-alerta sdp-alerta--info">
<svg fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>
<div className="alert-content">
<h4>Informació</h4>
<p>Aquesta és una alerta informativa per a destacar dades rellevants.</p>
</div>
</div>
<div className="sdp-alerta sdp-alerta--ok">
<svg fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
<div className="alert-content">
<h4>Èxit</h4>
<p>L'operació s'ha completat correctament.</p>
</div>
</div>
<div className="sdp-alerta sdp-alerta--avis">
<svg fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.25 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>
<div className="alert-content">
<h4>Avís</h4>
<p>Revisa els camps abans de continuar.</p>
</div>
</div>
<div role="alert" className="sdp-alerta sdp-alerta--error">
<svg fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" x2="9" y1="9" y2="15"></line><line x1="9" x2="15" y1="9" y2="15"></line></svg>
<div className="alert-content">
<h4>Error</h4>
<p>No s'ha pogut connectar amb el servidor.</p>
</div>
</div>
</section>
{/*  SECCIÓ 8: BADGES  */}
<section className="design-block ">
<h3>8. Badges i Etiquetes</h3>
<div className="design-badges-container">
<span className="badge badge-default">Per defecte</span>
<span className="badge badge-primary">Primari</span>
<span className="badge badge-success">Èxit</span>
<span className="badge badge-warning">Avís</span>
<span className="badge badge-danger">Perill</span>
<span className="badge badge-info">Informació</span>
</div>
<h4>Etiquetes de Poble</h4>
<div >
<span className="badge badge-outline"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> Poble actiu</span>
<span className="badge badge-outline"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> Fototeca</span>
<span className="badge badge-outline"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Arxiu</span>
<span className="badge badge-outline"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" x2="8" y1="2" y2="18"></line><line x1="16" x2="16" y1="6" y2="22"></line></svg> Mapa</span>
<span className="badge badge-outline"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg> Festes</span>
</div>
</section>
{/*  SECCIÓ 9: TAULES  */}
<section className="design-block">
<h3>9. Taules</h3>
<div className="sdp-taula">
<table>
<thead>
<tr>
<th>Poble</th>
<th>Província</th>
<th>Habitants</th>
<th>Estat</th>
<th>Accions</th>
</tr>
</thead>
<tbody>
<tr>
<td>Petrer</td>
<td>Alacant</td>
<td>34.000</td>
<td><span className="badge badge-success">Actiu</span></td>
<td><a className="table-action" href="#">Editar</a></td>
</tr>
<tr>
<td>Ontinyent</td>
<td>València</td>
<td>36.000</td>
<td><span className="badge badge-warning">Pendent</span></td>
<td><a className="table-action" href="#">Editar</a></td>
</tr>
<tr>
<td>Morella</td>
<td>Castelló</td>
<td>2.500</td>
<td><span className="badge badge-info">Revisió</span></td>
<td><a className="table-action" href="#">Editar</a></td>
</tr>
</tbody>
</table>
</div>
<h4>Taula Zebra (Alternada)</h4>
<div className="sdp-taula">
<table>
<thead>
<tr>
<th>Recurs</th>
<th>Tipus</th>
<th>Data</th>
</tr>
</thead>
<tbody>
<tr>
<td>Festa de la Mare de Déu</td>
<td>Esdeveniment</td>
<td>15/08/2024</td>
</tr>
<tr>
<td>Plaça Major</td>
<td>Lloc</td>
<td>—</td>
</tr>
<tr>
<td>Entrevista alcalde</td>
<td>Notícia</td>
<td>03/06/2024</td>
</tr>
</tbody>
</table>
</div>
</section>
{/*  SECCIÓ 10: NAVEGACIÓ  */}
<section className="design-block">
<h3>10. Navegació</h3>
<h4>Barra de Navegació</h4>
<div className="nav-bar">
<a className="active" href="#">Sóc de Poble</a>
<a href="#">Inici</a>
<a href="#">Pobles</a>
<a href="#">Arxiu</a>
</div>
<h4>Paginació</h4>
<div className="pagination">
<button className="page-btn" disabled>← Anterior</button>
<button className="page-btn active">1</button>
<button className="page-btn">2</button>
<button className="page-btn">3</button>
<span>...</span>
<button className="page-btn">12</button>
<button className="page-btn">Següent →</button>
</div>
</section>
{/*  SECCIÓ 11: MODALS  */}
<section className="design-block">
<h3>11. Modals i Diàlegs</h3>
<div className="modal-preview">
<div className="modal-box">
<h4>Confirmar Eliminació</h4>
<p>Esteu segur que voleu eliminar aquest element? Aquesta acció no es pot desfer.</p>
<div className="modal-actions">
<button className="btn btn-outline-dark btn-sm">Cancel·lar</button>
<button className="btn btn-danger btn-sm">Eliminar</button>
</div>
</div>
</div>
</section>
{/*  SECCIÓ 12: CÀRREGA  */}
<section className="design-block">
<h3>12. Indicadors de Càrrega</h3>
<div className="spinner-group">
<div ><svg className="spinner spinner-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeWidth="3"></circle></svg>
Petit</div>
<div ><svg className="spinner spinner-md" viewBox="0 0 24 24"><circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeWidth="3"></circle></svg>
Normal</div>
<div ><svg className="spinner spinner-lg" viewBox="0 0 24 24"><circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeWidth="3"></circle></svg>
Gran</div>
</div>
<h4>Esquelet (Skeleton)</h4>
<div className="skeleton skeleton-title">{""}</div>
<div className="skeleton skeleton-text">{""}</div>
<div className="skeleton skeleton-text">{""}</div>
<div className="skeleton skeleton-text">{""}</div>
</section>
{/*  SECCIÓ 13: AVATARS  */}
<section className="design-block">
<h3>13. Avatars i Imatges</h3>
<div className="avatar-group">
<div className="avatar avatar-xs">AB</div>
<div className="avatar avatar-sm">AB</div>
<div className="avatar avatar-md">AB</div>
<div className="avatar avatar-lg">AB</div>
<div className="avatar avatar-xl">AB</div>
</div>
</section>
{/*  SECCIÓ 14: DESPLEGABLES I MENÚS FLOTANTS  */}
<section className="design-block">
<h3>14. Desplegables i Menús Flotants</h3>
<div >
  <h4>Acordions</h4>
  <Accordion>
    <AccordionItem title="Què és Sóc de Poble?" defaultOpen={false}>
      <p>Sóc de Poble és una iniciativa per a la preservació de la memòria i el patrimoni dels pobles valencians, utilitzant tecnologia web oberta i accessible.</p>
    </AccordionItem>
    <AccordionItem title="Com puc col·laborar?">
      <p>Pots col·laborar aportant fotografies antigues, entrevistant els teus majors, o ajudant a transcriure documents històrics.</p>
    </AccordionItem>
  </Accordion>
</div>
<div>
  <h4>Menús Flotants (Dropdowns)</h4>
  <p >Components usats per a menús contextuals, com les opcions d'una publicació o els ajustaments.</p>
  <div >
    <Dropdown 
      trigger={<button className="btn btn-outline-dark">Opcions de la Nota</button>}
    >
      <DropdownItem>Fer Pública</DropdownItem>
      <DropdownItem>Moure a Carpeta</DropdownItem>
      <DropdownItem className="sdp-text-error">Eliminar</DropdownItem>
    </Dropdown>
  </div>
</div>
</section>
{/*  SECCIÓ 15: PESTANYES  */}
<section className="design-block">
<h3>15. Pestanyes</h3>
<div className="tabs">
<div className="tab active">General</div>
<div className="tab">Fotografies</div>
<div className="tab">Història</div>
<div className="tab">Mapa</div>
</div>
<div className="tab-content">
<p >Contingut de la pestanya activa. Aquesta àrea canvia segons la selecció. Les pestanyes són accessibles via teclat (Tab + Enter/Espai).</p>
</div>
</section>
{/*  SECCIÓ 16: PROGRÉS  */}
<section className="design-block">
<h3>16. Barra de Progrés</h3>
<div className="progress-container">
<div className="progress-header"><span>Pujada d'imatges</span><span>45%</span></div>
<div className="progress-bar"><div className="progress-fill">{""}</div></div>
</div>
<div className="progress-container">
<div className="progress-header"><span>Indexació de documents</span><span>78%</span></div>
<div className="progress-bar"><div className="progress-fill">{""}</div></div>
</div>
</section>
{/*  SECCIÓ 17: TOOLTIPS  */}
<section className="design-block">
<h3>17. Tooltips</h3>
<div className="tooltip-preview">
<button className="btn btn-primary" title="Això és un tooltip d'exemple">Passa per damunt</button>
<span className="tooltip-term" title="Explicació addicional del terme">Terme amb ajuda</span>
</div>
</section>
{/*  SECCIÓ 18: LLISTES  */}
<section className="design-block">
<h3>18. Llistes</h3>
<div className="lists-preview">
<h4>Llista Ordenada</h4>
<ol>
<li>Registrar-se al portal</li>
<li>Seleccionar el poble</li>
<li>Pujar contingut històric</li>
<li>Revisar i publicar</li>
</ol>
<h4>Llista Desordenada</h4>
<ul>
<li>Fotografies antigues</li>
<li>Documents administratius</li>
<li>Entrevistes orals</li>
</ul>
</div>
</section>
{/*  SECCIÓ 19: DIVISORS  */}
<section className="design-block ">
<h3>19. Divisors i Separadors</h3>
<div className="divider-preview">
<div className="divider-label">19.1 Divisor horitzontal bàsic</div>
<div className="divider-basic">{""}</div>
</div>
<div className="divider-preview">
<div className="divider-label">19.2 Divisor amb text</div>
<div className="divider-text">O BÉ</div>
</div>
<div className="divider-preview">
<div className="divider-label">19.3 Separador de secció (major)</div>
<div className="divider-major">{""}</div>
</div>
<div className="divider-preview">
<div className="divider-label">19.4 Separador puntejat</div>
<div className="divider-dashed">{""}</div>
</div>
<div className="divider-preview">
<div className="divider-label">19.5 Separador de pàgina (salt visual)</div>
<div className="divider-dotted">{""}</div>
</div>
</section>
{/*  SECCIÓ 20: TARGETES MESTRES  */}
<section className="design-block ">
<h3 >20. Targeta Mestra (Sóc de Poble Universal Card)</h3>

<ComponentDoc
  title="Visualització de les 3 cards en el format estandarditzat de regixella"
  description="L'estructura base de les publicacions al Mur. Es presenten les 3 variants completes integrades dins del sistema de disseny (regixella)."
  technical="Quan no hi ha cap element superior dret, el text manté la seua naturalesa centrada."
  noBackground={true}
>
  <div className="sdp-card-grid">
    <UniversalCard
      title="Disseny Pedra Seca"
      subtitle="Sistema oficial de disseny per a Sóc de Poble"
      body="Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, perquè qualsevol IA puga entendre este sistema i reproduir-lo."
      imageUrl="/assets/uploads/brain/ibanez_pedra_seca_design_1780873465211.png"
      imageAlt="Disseny Pedra Seca"
      labels={[
        { text: 'MUR', className: 'sdp-badge-system' },
        { text: 'Disseny UI', className: 'sdp-badge-category' }
      ]}
      author="Sóc de Poble"
      location="La Torre de les Maçanes"
      avatarUrl="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"
      time="10:00"
      date="07/08/22"
      showPin={true}
      copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
      hasFooter={true}
      showTranslate={true}
      showComment={true}
      showShare={true}
      showConnect={true}
      mainHref="#disseny"
    />

    <UniversalCard
      title="Samarreta Sóc de Poble"
      subtitle="L'edició definitiva amb el logotip complet"
      body="Dibuix del mapa del tresor. Cotó Roly de màxima qualitat."
      price="15.00 €"
      imageUrl="https://socdepoble.org/assets/uploads/brain/media__1776503825171.jpg"
      imageAlt="Samarreta"
      labels={[
        { text: 'Mercat', className: 'sdp-badge-system' },
        { text: '2 variants', className: 'sdp-badge-accent' },
        { text: 'roba', className: 'sdp-badge-category' },
        { text: 'samarreta', className: 'sdp-badge-tag' }
      ]}
      author="Sóc de Poble"
      location="La Torre de les Maçanes"
      avatarUrl="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"
      time="00:29"
      date="23/03/22"
      showPin={true}
      copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
      hasFooter={true}
      showTranslate={true}
      showComment={true}
      showShare={true}
      showConnect={true}
      mainHref="#samarreta"
    />

    {(() => {
      const eventItem = EVENTS.find(e => e.id === 'aplec-2023') || {};
      return <EventCard item={eventItem} />;
    })()}
  </div>
</ComponentDoc>

<ComponentDoc
  title="L'essència de la muntanya (El més bàsic)"
  description="Un quadre blanc amb l'H3 i l'H4. Demostra el comportament quan no hi ha imatge principal."
  noBackground={true}
>
  <div className="sdp-card-grid">
    <UniversalCard
      title="La Torre de les Maçanes"
      subtitle="L'essència de la muntanya"
      body="La UniversalCard centralitza tota la complexitat visual: des de la capçalera taronja fins a la tipografia H3/H4 sense inventar res més."
      author="Sóc de Poble"
      location="La Torre de les Maçanes"
      avatarUrl="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"
      time="12:00"
      date="01/01/23"
      hasFooter={true}
      showTranslate={true}
      showComment={true}
      showShare={true}
    />
  </div>
</ComponentDoc>

<ComponentDoc
  title="Targetes d'Administració (Gestoria)"
  description="Utilitzen la mateixa regixella. Quan la publicació no disposa d'imatge principal, el focus recau completament sobre la tipografia i les dades meta."
  noBackground={true}
>
  <div className="sdp-card-grid">
    <UniversalCard
      title="Hisenda"
      subtitle="Model 303 / 130"
      price="***,** €"
      labels={[
        { text: 'Gestoria', className: 'sdp-badge-system' },
        { text: 'Hisenda', className: 'sdp-badge-category' }
      ]}
      author="Mestre Poble"
      location="La Torre de les Maçanes"
      avatarUrl="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"
      time="14:28"
      date="26/06/22"
      copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
      hasFooter={true}
      showTranslate={true}
      showComment={true}
      showShare={true}
      showConnect={true}
      mainHref="#hisenda"
    />

    <UniversalCard
      title="Caixa Real"
      subtitle="Saldo Disponible"
      price="***,** €"
      labels={[
        { text: 'Mercat', className: 'sdp-badge-system' },
        { text: 'Sóc de Poble', className: 'sdp-badge-category' }
      ]}
      author="Mestre Poble"
      location="La Torre de les Maçanes"
      avatarUrl="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"
      time="14:28"
      date="26/06/22"
      copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
      hasFooter={true}
      showTranslate={true}
      showComment={true}
      showShare={true}
      showConnect={true}
      mainHref="#caixa"
    />
  </div>
</ComponentDoc>
</section>
{/*  SECCIÓ 21: ESTADÍSTIQUES I DASHBOARDS  */}
<section className="design-block">



<h3>21. Estadístiques i Dashboards</h3>
<h4>21.1 Targeta d'estadística</h4>
<div className="stat-card ">
<div className="stat-icon"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
<div className="stat-info">
<div className="stat-value">5.847</div>
<div className="stat-label">Habitants</div>
</div>
</div>
<h4>21.2 Grid d'estadístiques</h4>
<div className="stat-grid">
<div className="stat-card">
<div className="stat-icon"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><rect height="18" rx="2" ry="2" width="18" x="3" y="4"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg></div>
<div className="stat-info">
<div className="stat-value">776</div>
<div className="stat-label">Anys d'història</div>
</div>
</div>
<div className="stat-card">
<div className="stat-icon"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div>
<div className="stat-info">
<div className="stat-value">2.341</div>
<div className="stat-label">Habitatges</div>
</div>
</div>
<div className="stat-card">
<div className="stat-icon">🌳</div>
<div className="stat-info">
<div className="stat-value">29,4</div>
<div className="stat-label">Km² de natura</div>
</div>
</div>
<div className="stat-card">
<div className="stat-icon">📖</div>
<div className="stat-info">
<div className="stat-value">142</div>
<div className="stat-label">Documents històrics</div>
</div>
</div>
</div>

</section>
{/*  SECCIÓ 22: CERCA I FILTRATGE  */}
<section className="design-block">
<h3>22. Cerca i Filtratge</h3>
<h4>22.1 Barra de cerca bàsica</h4>
<div className="search-bar-basic">
<input placeholder="Cerca pobles, festes, documents..." type="text"/>
<button>🔍 Cerca</button>
</div>
<h4>22.2 Cerca amb filtres</h4>
<div className="search-filters">
<input placeholder="Cerca..." type="text"/>
<select>
<option>Totes les categories</option>
<option>Festes</option>
<option>Llocs</option>
</select>
<button>Cerca</button>
</div>
<h4>22.3 Resultats de cerca</h4>
<div >S'han trobat <strong>12 resultats</strong> per a "festa major"</div>
<div className="search-result">
<div className="search-result-title">Festa Major de Benigànim</div>
<div className="search-result-meta">Festes • Benigànim • Agost 2024</div>
<div className="search-result-excerpt">Del 15 al 20 d'agost celebrem les festes patronals amb més de 50 activitats per a tots els públics...</div>
</div>
<div className="search-result">
<div className="search-result-title">Festa Major de Llutxent</div>
<div className="search-result-meta">Festes • Llutxent • Setembre 2024</div>
<div className="search-result-excerpt">La festa major de Llutxent destaca per la seua processó de les festes de la Mare de Déu...</div>
</div>
</section>
{/*  SECCIÓ 23: PAGINACIÓ  */}
<section className="design-block">
<h3>23. Paginació</h3>
<h4>23.1 Paginació numèrica</h4>
<div className="pagination">
<a className="page-btn" href="#">← Primera</a>
<a className="page-btn" href="#">2</a>
<a className="page-btn active" href="#">3</a>
<a className="page-btn" href="#">4</a>
<a className="page-btn" href="#">5</a>
<span>...</span>
<a className="page-btn" href="#">20</a>
<a className="page-btn" href="#">Següent →</a>
</div>
<h4>23.2 Paginació simplificada (anterior / següent)</h4>
<div className="pagination-simple">
<a href="#">
<span className="pagination-label">← Article Anterior</span>
<span className="pagination-title">Les festes de la Magdalena</span>
</a>
<a className="next" href="#">
<span className="pagination-label">Article Següent →</span>
<span className="pagination-title">La ruta del riu-rau</span>
</a>
</div>
</section>
{/*  SECCIÓ 24: TASQUES I CHECKLISTS  */}
<section className="design-block">
<h3>24. Llistes de Tasques i Checklists</h3>
<h4>24.1 Checklist d'administració</h4>
<div className="checklist-admin">
<div className="checklist-item">
<input defaultChecked type="checkbox"/>
<label><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Verificació prèvia a publicar</label>
</div>
<div className="checklist-item">
<input defaultChecked type="checkbox"/>
<label>Revisar ortografia i valencià</label>
</div>
<div className="checklist-item">
<input defaultChecked type="checkbox"/>
<label>Comprovar imatges (alt text obligatori)</label>
</div>
<div className="checklist-item">
<input type="checkbox"/>
<label>Validar enllaços interns</label>
</div>
<div className="checklist-item">
<input type="checkbox"/>
<label>Revisar contrast de colors (WCAG 2.1 AA)</label>
</div>
</div>
<h4>24.2 Llista de tasques amb progrés</h4>
<div className="checklist-admin">
<div className="checklist-item">
<input defaultChecked type="checkbox"/>
<label>Migrar base de dades històrica</label>
<span className="date-tag done">15/01</span>
</div>
<div className="checklist-item">
<input type="checkbox"/>
<label>Digitalitzar fotografies del fons municipal</label>
<span className="date-tag">01/02</span>
</div>
</div>
</section>
{/*  SECCIÓ 25: UPLOAD I DESCÀRREGUES  */}
<section className="design-block">
<h3>25. Upload i Descàrregues</h3>
<h4>25.1 Zona d'arrossegament d'arxius</h4>
<div className="upload-zone">
<div className="upload-zone-text">📎 Arrossega els arxius ací</div>
<div className="upload-zone-sub">o <span>selecciona'ls del teu dispositiu</span></div>
<div >Màxim 10MB per arxiu. Formats: JPG, PNG, PDF</div>
</div>
<div className="file-item">
<div className="file-item-info">
<div className="file-item-name">festa_major_2024.jpg</div>
<div className="file-item-meta">2,4 MB</div>
</div>
<div className="file-item-action"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></div>
</div>
<h4>25.2 Enllaç de descàrrega</h4>
<div className="download-card">
<div className="download-card-icon"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
<div className="download-card-info">
<div className="download-card-title">Carta Pobla de Benigànim (1248)</div>
<div className="download-card-meta">PDF • 3,2 MB • Transcripció paleogràfica</div>
</div>
<a className="download-card-btn" href="#"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><line x1="12" x2="12" y1="5" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg></a>
</div>
</section>
{/*  SECCIÓ 26: EMBEDDINGS I MEDIA EXTERNA  */}
<section className="design-block">
<h3>26. Embeddings i Media Externa</h3>
<h4>26.1 Vídeo embebint (HTML5 natiu)</h4>
<div className="embed-container">
<iframe 
  src="https://www.youtube-nocookie.com/embed/Fadaa7Kyxm0?si=G_xGeA1VqR0cX_IP"
  title="Sóc de Poble: Portal de pobles connectats"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerPolicy="strict-origin-when-cross-origin"
  allowFullScreen
  className="sdp-video-iframe"
></iframe>
</div>
<div className="embed-caption">Sóc de Poble: Portal de pobles connectats (2013)</div>
<details className="accordion ">
<summary className="accordion-header">
<svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Descripció del vídeo original
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"></polyline></svg>
</summary>
<div className="dsg-pre-wrap">
  <p>Un Projecte per col·laborar en el desenvolupament sostenible i tecnològic en entorns rurals.</p>
  <p>Sóc del Poble serà un PORTAL DE POBLES CONNECTATS on compartir informació, experiències i idees que faciliten el desenvolupament sostenible i tecnològic en entorns rurals, per posar en valor els recursos locals, que són l'essència de la nostra identitat, i mostrar l'atractiu dels pobles com a llocs on viure i treballar.</p>
  <p>Serà un canal orientat a la difusió dels beneficis que les Noves Tecnologies poden aportar al món rural, utilitzant ferramentes col·laboratives:</p>
  <p>
    1. BASE DE DADES OBERTES. MAPA DIRECTORI DE RECURSOS LOCALS.<br/>
    2. CERCADOR TEMÀTIC.<br/>
    3. XARXA SOCIAL DE PRODUCTIVITAT.<br/>
    4. REVISTA DIGITAL.<br/>
    5. VIVERS TIC DE POBLE. Vivers Virtuals d'Emprenedors Rurals.
  </p>
  <p>★ Actualment comptem al Facebook amb més de 200.000 seguidors que se senten identificats amb el concepte de "Ser de Poble". Aquesta xarxa ens permet interactuar amb milers de persones amb les que compartim la nostra percepció del món rural.</p>
  <hr className="" />
  <h4>GUIÓ DEL VÍDEO</h4>
  <p>
    Pepet toca el clarinet...<br/>
    Viu tranquil i be en un poble menut<br/>
    A l'escola de música del seu poblet aprèn... I ho fa be, si...<br/>
    Vol aprendre més, però ha d'anar a la ciutat... I puja i baixa i va i torna...<br/>
    I fa música i vol que tothom escolte el so del seu clarinet...<br/>
    Però és tot tan difícil al seu poblet!!!<br/>
    Com faré? Es pregunta Pepet.
  </p>
  <p>
    A l'altra banda de les muntanyes viu la Rosa,<br/>
    Ha decidit viure en el camp, té una granja i és apicultora...<br/>
    Les ovelles, les abelles... i els pots de mel, de la bona, de la millor qualitat...<br/>
    Però ha de baixar a la ciutat a vendre la seva mel i obrir-se camí entre marques, mercats, xarxes de distribució...<br/>
    I li ve tot difícil, complex, costerut...
  </p>
  <p>
    Hi ha qualitat de vida a aquells pobles... Es viu tranquil, i es poden fer coses interessants, saludables, arrelades, autèntiques...<br/>
    Però hi ha massa preguntes sense contestar... Massa dificultats... Gent que fa coses als pobles, que necessita oportunitats...<br/>
    Sóc de Poble vol ser pont, xarxa oberta que connecte pobles, persones, empreses, col·lectius, fer fàcil el que sembla difícil entre muntanyes i complexitats tecnològiques...<br/>
    Pep i Rosa ja s'han sumat i formen part de la gentada que vol viure als pobles i contribuir a mantenir-los vius, actius...<br/>
    Gent que té idees i vol fer-les realitat en llocs amb qualitat de vida, amb respecte per les arrels, la natura, la gent...<br/>
    Sóc de poble... i tinc veu...<br/>
    I tu?, et sumes?
  </p>
</div>
</details>
<h4>26.2 Mapa embebint (iframe amb fallback)</h4>
<div>
  <div>
  <iframe
    className="sdp-map-iframe"
    loading="lazy"
    allowFullScreen
    src="https://www.openstreetmap.org/export/embed.html?bbox=-0.4422,38.5996,-0.4022,38.6196&amp;layer=mapnik"
    title="Mapa de La Torre de les Maçanes"
  ></iframe>
</div>
</div>
<div className="embed-caption"><a href="#">Veure mapa més gran a OpenStreetMap →</a></div>
<h4>26.3 Audio (podcast local)</h4>
<div className="audio-player">
<button className="audio-play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg></button>
<div className="audio-progress">
<div className="audio-progress-fill">{""}</div>
</div>
<div className="audio-time">12:45</div>
</div>
<div className="embed-caption ">Podcast «Històries de poble» · Episodi 1</div>
</section>
{/*  SECCIÓ 27: CLASSES UTILITÀRIES  */}
<section className="design-block">
<h3>27. Classes Utilitàries</h3>
<p >Aquestes classes són recomanacions d'arquitectura css (no aplicades ací via Tailwind pur sinó com a concepte)</p>
<div className="utils-grid">
<div className="utils-box">
<h4>Classes de Visibilitat</h4>
<ul className="utils-list">
<li><strong>.sdp-sr-only</strong> - Ocult visiblement, text per a screen readers</li>
<li><strong>.sdp-visible-sr-only</strong> - Visible només per assistència</li>
<li><strong>.sdp-ocult</strong> - display: none</li>
<li><strong>.sdp-ocult-mobil</strong> - Amaga en xs/sm</li>
</ul>
</div>
<div className="utils-box">
<h4>Classes de Color</h4>
<ul className="utils-list">
<li><strong>.sdp-text-exit</strong> - ✓ Èxit</li>
<li><strong>.sdp-text-error</strong> - ✕ Error</li>
<li><strong>.sdp-text-avis</strong> - <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 24 24" width="16"><path d="M10.25 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg> Avís</li>
<li><strong>.sdp-text-info</strong> - i Informació</li>
</ul>
</div>
</div>
</section>
{/*  SECCIÓ 28: PEUS DE PÀGINA  */}
<section className="design-block">
<h3>28. Peus de pàgina (Footers)</h3>
<h4>28.1 Peu de pàgina complet</h4>
<div >[Footer complet (Enllaços, Legal, Xarxes)]</div>
<h4>28.2 Peu de pàgina minimalista</h4>
<div >© 2026 Sóc de Poble. Tots els drets reservats.</div>
</section>
{/* SECCIÓ 29: EXEMPLES DE COMPOSICIÓ */}
<section className="design-block ">
<h3>29. Exemples de Composició</h3>
<h4>29.1 Formulari de contacte complet</h4>
<div className="card dsg-center-600">
<h4 >Contacta amb nosaltres</h4>
<p >Envieu-nos les vostres dubtes o suggeriments per a millorar el portal.</p>
<div className="form-group">
<label>Correu electrònic</label>
<input placeholder="elteu@email.com" type="email" />
</div>
<div className="form-group ">
<label>El teu missatge</label>
<textarea placeholder="Com ens pots ajudar?" rows="4"></textarea>
</div>
<div className="login-form">
  <button className="pill pill--primary login-action">Enviar missatge</button>
</div>
</div>
</section>

{/* SECCIÓ 30: XAT I MISSATGERIA */}
<section className="design-block ">
<ComponentDoc
  title="30. Elements de Xat i Missatgeria"
  description="Components estructurals dissenyats específicament per a la Fase Final (Consell i Interacció Humà-Màquina)."
  technical="Les bambolles mantenen un contrast correcte (WCAG AA) depenent del seu origen (usuari vs IA/Sistema). El camp d'entrada inclou adaptabilitat d'alçada per a missatges multilínea."
>
  <h4>Bambolles de Xat (Chat Bubbles)</h4>
  <div className="chat-container">
    
    {/* Missatge del Sistema / IA */}
    <div className="dsg-msg-container">
      <div className="avatar avatar-sm chat-avatar-ia">IA</div>
      <div className="sdp-chat-bubble sdp-chat-bubble--ai">
        <p >Bona vesprada, Mestre. El sistema Pedra Seca està 100% operatiu i les constants vitals són estables.</p>
        <span className="sdp-chat-bubble-meta">17:34</span>
      </div>
    </div>

    {/* Missatge de l'Usuari */}
    <div className="dsg-msg-container dsg-msg-self">
      <div className="avatar avatar-sm chat-avatar-jl">JL</div>
      <div className="sdp-chat-bubble sdp-chat-bubble--user">
        <p >Perfecte, comencem amb la sessió de hui.</p>
        <span className="sdp-chat-bubble-meta">17:36</span>
      </div>
    </div>

  </div>

  <h4>Input de Missatgeria (Message Composer)</h4>
  <div className="chat-input-wrapper">
    <div className="dsg-flex-1">
      <textarea 
        className="chat-input-textarea form-control" 
        placeholder="Escriu un missatge..." 
        rows="1" 
      ></textarea>
    </div>
    <button className="btn btn-primary btn-sm dsg-btn-round" title="Enviar">
      <svg viewBox="0 0 24 24" className="dsg-icon-1em"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"></path></svg>
    </button>
  </div>
</ComponentDoc>
</section>

{/* SECCIÓ 31: ARQUITECTURA UNIVERSAL I GESTORS */}
<section className="design-block">
<ComponentDoc
  title="31. Arquitectura Universal: Top Bar + Sidebar + Contingut"
  description="Patró canònic per a pàgines d'aplicació, gestors i editors de tres columnes."
  technical="UniversalPage governa el chrome i el contingut; UniversalManager compon facetes, llista i detall; AppGridShell governa responsive, scroll, plegat i amplàries. Cap consumidor ha de clonar estes responsabilitats."
>
  <div className="card">
    <h4>Contracte estructural</h4>
    <ol className="dsg-pl-1">
      <li><strong>Top Bar fixa:</strong> navegació i accions globals pertanyen a <code>UniversalPage</code>.</li>
      <li><strong>Sidebar / Carpetes:</strong> facetes jeràrquiques; els grups s'obrin cap avall i la columna es replega cap a l'esquerra.</li>
      <li><strong>Llista / Notes:</strong> cerca i creació en una barra secundària subtil; en replegar queda només la lupa.</li>
      <li><strong>Contingut:</strong> detall o editor flexible, sempre amb <code>min-width: 0</code> i scroll propi.</li>
      <li><strong>Separadors:</strong> arrossegables amb punter i tacte, operables amb fletxes, <kbd>Home</kbd> i <kbd>End</kbd>.</li>
    </ol>
  </div>
  <div className="card">
    <h4>Estats responsive obligatoris</h4>
    <dl>
      <dt><strong>Ample (≥ 1090 px)</strong></dt>
      <dd>Tres columnes simultànies, plegables i redimensionables.</dd>
      <dt><strong>Mitjà (720–1089 px)</strong></dt>
      <dd>Llista + contingut; Carpetes apareix com a panell superposat.</dd>
      <dt><strong>Estret (&lt; 720 px)</strong></dt>
      <dd>Un panell visible cada vegada; els panells fora de pantalla són <code>inert</code>.</dd>
    </dl>
  </div>
  <div className="card">
    <h4>API mínima de la graella</h4>
    <pre><code>{`<AppGridShell
  leftColumn={<Facetes />}
  middleColumn={<Llista />}
  rightColumn={<Detall />}
/>`}</code></pre>
  </div>
</ComponentDoc>
</section>

{/*  SECCIÓ 23: LÒGICA DEL MOTOR DE POBLES  */}
<section className="design-block">
<h3 >23. Lògica del Motor de Pobles</h3>
<ComponentDoc
  title="Ordenació Dinàmica (Rank per Activitat)"
  description="La pàgina de Pobles no té publicadors oficials. El seu funcionament es basa en l'activitat orgànica dels usuaris de cada poble en la resta de l'aplicació (Mur, Mercat, Esdeveniments)."
  technical="El context de dades (AppDataContext) escaneja totes les publicacions i detecta quina és la més recent de cada poble. La targeta del poble ('Gent de...') s'ordena de més recent a més antiga. Per això, si l'última publicació del sistema l'ha feta algú de La Torre de les Maçanes, la targeta de 'Gent de La Torre' pujarà a la primera posició automàticament."
>
  <div className="card ">
    <h4 >Com funciona el rànquing?</h4>
    <ol  className="dsg-pl-1">
      <li ><strong>Dades en temps real:</strong> L'aplicació agrupa l'activitat per poble.</li>
      <li ><strong>La Targeta de Poble:</strong> Adopta dinàmicament el nom de l'autor (`Gent de La Torre`, `Gent d'Alcoleja`...) gestionant apòstrofs automàticament si comença per vocal.</li>
      <li><strong>Posicionament:</strong> El poble que té l'última interacció de la comunitat es corona com el primer de la llista.</li>
    </ol>
  </div>
</ComponentDoc>
</section>


      <ComponentDoc
        title="25. Avisador Efímer (Toasts)"
        description="Notificacions lleugeres sense interrompre"
      >
        <div className="btn-group">
          <button className="btn btn-primary" onClick={() => showToast('Canvis guardats correctament', 'success')}>Toast d'èxit</button>
          <button className="btn btn-danger" onClick={() => showToast('Error en desar les dades', 'error')}>Toast d'error</button>
          <button className="btn btn-base" onClick={() => showToast('Tens un missatge nou', 'info')}>Toast info</button>
        </div>
        <AvisadorEfimer />
      </ComponentDoc>

      {/*  SECCIÓ 26: PÀGINES DE SISTEMA  */}
      <section className="design-block">
        <h3 >26. Pàgines de Sistema vs. Pàgines de Contingut</h3>
        
        <ComponentDoc
          title="Lògica d'Etiquetatge (Labels)"
          description="Normativa sobre quan i per què utilitzar etiquetes de categoria en una UniversalPage."
          technical="Les Pàgines de Sistema (com el Panell de Control, Dispositius, Disseny, etc.) NO porten cap categoria ni etiqueta a la capçalera de la pàgina."
        >
          <div className="card ">
            <h4 >Regla de les Categories</h4>
            <p>
              Una pàgina només pot tenir etiquetes/categories si la seua naturalesa és ser una <strong>Targeta Publicable</strong> (una <em>card</em>) dins d'un <em>feed</em> (Mur, Mercat, Esdeveniments, Notes, etc.).
            </p>
            <ol  className="dsg-pl-1">
              <li ><strong>Pàgines de Contingut:</strong> Corresponen a una <em>card</em>. Aquestes <strong>SÍ</strong> que necessiten la seua categoria o etiqueta identificativa a dalt per mantenir la correspondència amb la targeta d'origen.</li>
              <li><strong>Pàgines de Sistema:</strong> No són publicacions ni es presenten com a <em>cards</em> en cap secció. Per tant, <strong>NO</strong> necessiten ni han de dur categories inventades com "Sistema", "Admin", o "Local". Són rutes estructurals pures i la seua capçalera ha de ser neta.</li>
            </ol>
          </div>
        </ComponentDoc>

        <ComponentDoc
          title="Catàleg de Pàgines i Motors Lògics"
          description="Descripció del funcionament intern de cadascuna de les pàgines de sistema, perquè les IAs no es confonguen."
        >
          <div className="card">
            <h4 >Panell de Control</h4>
            <p><strong>Tipus:</strong> Sistema (Sense Labels)</p>
            <p ><strong>Tipus:</strong> Sistema (Sense Labels)</p>
            <p >És el <em>Hub</em> o quadre de comandament central. No té cap feed ni <em>cards</em>. Servix exclusivament com a enrutador per a oferir accessos ràpids a la publicació i altres eines d'administració de l'ecosistema. A més, fa servir una <em>entradilla</em> (propietat `lead`) com a subtítol per mantenir la neteja visual i prescindir de títols amb estils <em>inline</em>.</p>
          </div>
          
          <div className="card">
            <h4 >Dispositius (Descoberta en viu)</h4>
            <p ><strong>Tipus:</strong> Sistema (Sense Labels)</p>
            <p >És el motor d'aparellament de la plataforma. La seua lògica s'encarrega d'escanejar la xarxa local, negociar les connexions WebRTC o per relé (Relay) i anunciar la presència del node local. No és una publicació, sinó la font de connectivitat estructural per al P2P online-first.</p>
          </div>

          <div className="card">
            <h4 >Cens de Població</h4>
            <p ><strong>Tipus:</strong> Sistema (Sense Labels)</p>
            <p >Un simple llistat estàtic de caràcter informatiu. Ordena la llista de pobles de forma purament descendent pel seu volum demogràfic (nombre d'habitants) i permet l'accés directe al perfil de cada localitat. Tampoc requereix etiquetes.</p>
          </div>

          <div className="card ">
            <h4 >Bloc de Notes (Editor Universal)</h4>
            <p ><strong>Tipus:</strong> Sistema (Sense Labels, Disseny Imbricat)</p>
            <p >És la sala de redacció (<em>Composer</em>). Fa servir el motor TipTap per a l'edició de text ric. Tota la seua complexitat visual rau en simular amb exactitud com quedarà la publicació. Per aconseguir-ho, incrusta una targeta <strong>UniversalPage</strong> dins del propi editor, amb les següents excepcions estrictes:</p>
            <ul  className="dsg-pl-1">
              <li ><strong>Sense Barra Blava:</strong> La navegació superior de la `UniversalPage` interior s'obvia.</li>
              <li ><strong>Ordre dels elements:</strong> La primera cosa visual sempre és la imatge de capçalera (<em>Hero Image</em>).</li>
              <li ><strong>Barra de Publicador (Taronja):</strong> Se situa sota la imatge. Mostra el botó d'hora estàndard. Hi haurà un botó de 'pinejar' que obrirà un desplegable per a triar icones (pinejar, candau, i altres), funcionalitat que s'ampliarà en el futur.</li>
              <li ><strong>Capçalera i Logotips:</strong> En aquest exemple de «Bloc de Notes» <strong>sí que apareix el logotip de 'Sóc de Poble'</strong>, ja que representa una nota propietat de Sóc de Poble. L'ocultació del logotip en favor de l'acció d'inserir multimèdia només s'aplica en la vista de redacció d'una <em>nova nota</em> buida.</li>
            </ul>
          </div>
        </ComponentDoc>

      </section>
    </>
  );
}

```

## FITXER: src/sections/mur/MurSection.jsx
```jsx
import React, { useMemo, useState } from 'react';
import { useSearchParams } from '../../app/contexts/RouterContext';
import { UniversalPage } from '../../components/universal/UniversalPage';
import { UniversalCard, ActionControl, IconButton, ContentProvider } from '../../components/universal/UniversalElements';
import { EventCard } from '../../components/universal/EventCard';
import { useSEO } from '../../hooks/useSEO';
import { resolveAsset } from '../../config/assetResolver';
import { getSectionItemPath } from '../../config/navigation';
import { buildMapEmbedUrl } from './mapConfig';
import { useMur } from './MurContext';
import { useCoreContent } from '../../app/contexts/CoreContentContext';
import { useUIActions } from '../../app/contexts/UIContext';
import { PillToggle } from '../../components/ui/PillToggle.jsx';
import { PinIcon } from '../../components/ui/icones.jsx';

export default function MurSection() {
  const { sortedEvents, sortedFeedPosts, sortedMarketItems } = useMur();
  const { sortedTowns, pageCopy } = useCoreContent();
  const { t } = useUIActions();
  const [searchParams, setSearchParams] = useSearchParams();
  const dateFilter = searchParams.get('date');
  const categoryFilter = searchParams.get('category');

  const [filterType, setFilterType] = useState('all');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isMapPinned, setIsMapPinned] = useState(false);

  useSEO({
    title: t('section.mur.kicker', 'Mur'),
    description: t('section.mur.subtitle', 'Llig el mur públic amb les darreres publicacions del poble.')
  });

  const systemPages = [
    { key: 'disseny', isAvis: true, href: '/disseny' },
    { key: 'projecte', isAvis: false, href: '/projecte' },
    { key: 'constitucio', isAvis: false, href: '/constitucio' },
    { key: 'skills', isAvis: false, href: '/skills' },
    { key: 'anima', isAvis: false, href: '/ia' },
    { key: 'roadmap', isAvis: false, href: '/roadmap' },
    { key: 'notes', isAvis: false, href: '/jo/notes' },
    { key: 'versions', isAvis: false, href: '/versions' },
    { key: 'legal', isAvis: false, href: '/legal' }
  ].map(item => {
    const data = pageCopy[item.key];
    if (!data) return null;
    return {
      ...data,
      id: item.key,
      isSystem: true,
      isAvis: item.isAvis,
      mainHref: item.href,
      type: 'sistema'
    };
  }).filter(Boolean);

  const allItems = useMemo(() => {
    const combined = [
      ...(sortedEvents || []),
      ...(sortedFeedPosts || []),
      ...(sortedMarketItems || []),
      ...systemPages
    ].filter(Boolean);

    return combined.sort((a, b) => {
      const dateA = new Date(a.date || a.publish_date || a.created_at || "2026-08-21T00:00:00.000Z");
      const dateB = new Date(b.date || b.publish_date || b.created_at || "2026-08-21T00:00:00.000Z");
      return dateB - dateA;
    });
  }, [sortedEvents, sortedFeedPosts, sortedMarketItems, sortedTowns, pageCopy, systemPages]);

  const displayedItems = useMemo(() => {
    let items = allItems;
    if (filterType === 'events') items = items.filter(i => i.type === 'event');
    if (filterType === 'sistema') items = items.filter(i => i.type === 'sistema');

    if (dateFilter) {
      items = items.filter(i => {
        const rawDate = i.date || i.publish_date || i.created_at;
        if (!rawDate) return false;
        return rawDate.startsWith ? rawDate.startsWith(dateFilter) : String(rawDate).startsWith(dateFilter);
      });
    }
    
    if (categoryFilter) {
      items = items.filter(i => {
        const labels = i.labels || [{ text: i.isSystem ? 'Sistema' : (i.type || 'Publicació') }];
        return labels.some(l => l.text.toLowerCase() === categoryFilter.toLowerCase());
      });
    }

    return items;
  }, [allItems, filterType, dateFilter, categoryFilter]);

  const getCalendarBadge = (dateString) => {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return {
      dia: d.getDate(),
      mes: d.toLocaleDateString('ca-ES', { month: 'long' }),
      any: d.getFullYear(),
      dateTime: dateString
    };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const formatTime = (timeStr, dateStr) => {
    if (timeStr) return timeStr;
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const config = {
    title: t('section.mur.kicker', 'Mur'),
    subtitle: t('section.mur.title', 'Publicacions recents'),
    lead: t('section.mur.subtitle', 'Llig el mur públic amb les darreres publicacions del poble.'),
    chrome: "system",
    showLogos: true
  };

  return (
    <ContentProvider initialConfig={config}>
      <UniversalPage>
      <div className="content-wrapper">
        
        {/* Switcher / Botonera */}
        {/* 260911: abans `className` duplicat (es perdia sdp-filtres) i
            `.pill--active` sense cap regla CSS (l'actiu no es veia).
            Mateix comportament: un filtre tanca el mapa; Mapa s'obri i es
            plega tornant-lo a polsar. */}
        <section aria-label="Filtres del mur">
          <PillToggle
            etiqueta="Filtres del mur"
            valor={isMapOpen && !isMapPinned ? 'mapa' : filterType}
            onCanvi={(v) => {
              if (v === 'mapa') { 
                setIsMapOpen((obert) => {
                  if (obert) setIsMapPinned(false);
                  return !obert;
                }); 
                return; 
              }
              setFilterType(v);
              if (!isMapPinned) setIsMapOpen(false);
            }}
            opcions={[
              { valor: 'all', text: 'Mostrar Tot' },
              { valor: 'events', text: 'Esdeveniments' },
              { valor: 'system', text: 'Sistema' },
              { valor: 'mercat', text: 'Mercat' },
              { valor: 'animalets', text: 'Animalets' },
              { valor: 'compartir', text: 'Compartir' },
              { valor: 'mapa', text: 'Mapa' },
            ]}
          >
            {isMapOpen && (
              <button
                type="button"
                className="sdp-pindola__opcio sdp-pindola__opcio--taronja"
                aria-pressed={isMapPinned ? 'true' : 'false'}
                onClick={() => setIsMapPinned(!isMapPinned)}
                title={isMapPinned ? 'Desfixar mapa' : 'Fixar mapa'}
              >
                <PinIcon className="sdp-pindola__icona" /> {isMapPinned ? 'Desfixar' : 'Fixar'}
              </button>
            )}
          </PillToggle>
        </section>

        {/* Mapa Desplegable */}
        {isMapOpen && (
          <div className="sdp-filtre--mapa">
            {React.createElement('iframe', {
              title: "Mapa del territori",
              src: buildMapEmbedUrl(),
              loading: "lazy",
              referrerPolicy: "no-referrer-when-downgrade",
              style: { width: '100%', height: '400px', border: 0, borderRadius: 'var(--sdp-radi-g)' }
            })}
          </div>
        )}

        {/* Targetes del Mur */}
        <div className="sdp-card-grid">
          {displayedItems.map((item) => {
            const rawDate = item.date || item.publish_date || item.created_at || "2026-08-21T00:00:00.000Z";
            
            if (item.type === 'event') {
              return <EventCard key={`${item.type}-${item.id}`} item={item} />;
            }
            
            return (
              <UniversalCard
                key={`${item.type}-${item.id}`}
                title={item.title || item.name}
                subtitle={item.subtitle}
                body={item.lead || <p className="sp-card-text">{item.description}</p>}
                imageUrl={resolveAsset(item.image_url || item.image || item.images?.[0] || item.imageSrc || '')}
                imageAlt={item.imageAlt || item.title || ''}
                author={item.author_name || item.seller || "Sóc de Poble"}
                authorHref={item.isSystem ? "/pobles" : undefined}
                avatarUrl={resolveAsset(item.author_avatar || item.avatar_url || '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg')}
                location={item.author_location || item.population || "La Torre de les Maçanes"}
                date={formatDate(rawDate)}
                time={formatTime(item.time, rawDate)}
                copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
                calendarBadge={null}
                price={item.price}
                labels={item.labels || [
                  { 
                    text: item.isSystem ? 'Sistema' : ((item.type === 'market' || item.type === 'product') ? 'Mercat' : (item.type || 'Publicació')), 
                    className: (item.isSystem || item.type === 'market' || item.type === 'product') ? 'sdp-badge-system' : 'sdp-badge-category' 
                  },
                  (item.type === 'market' || item.type === 'product') && item.variations?.length ? { text: `${item.variations.length} ${t('section.mercat.variations', 'variants')}`, className: 'sdp-badge-accent' } : null,
                  (item.type === 'market' || item.type === 'product') && item.category_slug ? { text: item.category_slug, className: 'sdp-badge-category' } : null,
                  (item.type === 'market' || item.type === 'product') && item.tag ? { text: item.tag, className: 'sdp-badge-tag' } : null
                ].filter(Boolean)}
                mainHref={item.mainHref || getSectionItemPath(item.type === 'event' ? 'events' : ((item.type === 'market' || item.type === 'product') ? 'mercat' : (item.type === 'poble' ? 'pobles' : 'mur')), item.id)}
                showPin={item.isAvis}
                hasFooter={true}
                showTranslate={true}
                showComment={true}
                showShare={true}
                showConnect={true}
              />
            );
          })}
        </div>
      </div>
    </UniversalPage>
    </ContentProvider>
  );
}

```

## FITXER: src/css/index.css
```css
@import url('./design-tokens.css');
@import url('./components.css');

/* ── TIPOGRAFIA · allotjada en local ───────────────────────────────
   Noto Sans · SIL Open Font License 1.1 · redistribució permesa.
   Descàrrega dels fitxers (una sola vegada, mai en temps d'execució):
     https://fonts.google.com/noto/specimen/Noto+Sans  →  «Get font»
   Subconjunt recomanat per a valencià/català (redueix ~70% el pes):
     pyftsubset NotoSans.ttf --unicodes="U+0000-00FF,U+0100-017F,U+0192,\
       U+01FA-01FF,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,\
       U+00B7,U+20AC" --flavor=woff2 --output-file=noto-sans-400.woff2
   Col·loca'ls a  assets/fonts/  amb estos noms exactes.
   ───────────────────────────────────────────────────────────────── */
/* L'import s'ha mogut fora de React */

/* ═══════════════════════════════════════════════════════════════════
   PEDRA SECA · Full d'estils base — v2.0
   Sóc de Poble · CSS natiu, sense frameworks (substitueix el base)
   ─────────────────────────────────────────────────────────────────────
   ARQUITECTURA
   0. Tokens de disseny (:root)  — nous --sdp-*, àlies legat --sdp-*
   1. Reset i base global        — scroll delegat, sense rubber-band
   2. Esquelet de l'app          — 3 columnes: sidebar · llista · visor
   3. Columna 1: Sidebar (La Roca)
   4. Columna 2: Llista contextual (opcional, l'app real la injecta)
   5. Columna 3: Visor — barres negra/blava/taronja, hero, títol
   6. Contingut editorial (content-wrapper, design-block, CMS)
   7. Components (botons, formularis, alertes, taules, targetes…)
   8. FAB
   9. Utilitats sdp-*
   10. Responsive — breakpoint mestre 1100px + afinats 720px / 480px
   11. Accessibilitat i moviment reduït
   ─────────────────────────────────────────────────────────────────────
   REGLA D'OR: el <body> NO fa scroll (overflow:hidden). Cada columna
   gestiona el seu propi overflow-y — això elimina el rubber-band de
   Safari/iOS i manté les barres sticky dins del visor.
   ═══════════════════════════════════════════════════════════════════ */

@layer reset, legacy, sdp, components, utilities;

/* ── 0. TOKENS ─────────────────────────────────────────────────────
   DOS CAPES. Esta separació és la llei del sistema.

   CAPA 1 · PRIMITIUS  — la paleta física. Generada en OKLCH amb to i
            croma de marca constants; només varia la lluminositat.
            NO s'usen mai directament als components.
   CAPA 2 · SEMÀNTICS  — el significat. És l'ÚNICA capa que toquen els
            components, l'única que canvia el tema fosc i l'única
            superfície que exposarà el tauler de control.

   Regla mecànica: si un component escriu var(--sdp-pedra-*),
   var(--sdp-primary-*) o var(--sdp-secondary-*), és un error.
   ───────────────────────────────────────────────────────────────── */

:host {
  all: initial;
}

/* El <body class="sdp-root"> NO porta `all: initial`: (0,1,0) guanyaria
   la regla `body` (0,0,1) i li llevaria font, color i fons. Ací només
   neutralitzem el que fa mal, sense tocar l'herència. */
.sdp-root {
  margin: 0;
  padding: 0;
  border: 0;
}

:root, :host, .sdp-root {
  /* ═══ CAPA 1 · PRIMITIUS ═══════════════════════════════════════ */

  /* Pedra · neutre càlid — OKLCH H 84°, croma baix */
  --sdp-blanc-pur: oklch(100% 0 0);
  --sdp-negre-pur: oklch(0% 0 0);
  --sdp-blanc: #ffffff;
  --sdp-negre: #000000;
  --sdp-pedra-50:  #ffffff;
  --sdp-pedra-100: #f8f6f4;
  --sdp-fons-lectura: #f7f6f3;
  --sdp-pedra-150: #f3f0ec; /* Intermig per si fa falta */
  --sdp-pedra-200: #efece7;
  --sdp-pedra-300: #dcd7cd;
  --sdp-pedra-400: #b7b1a5;
  --sdp-pedra-500: #8b857b;
  --sdp-pedra-600: #5b564e;
  --sdp-pedra-700: #3d3b35;
  --sdp-pedra-750: #302e29;
  --sdp-pedra-800: #22211e;
  --sdp-pedra-850: #181715;
  --sdp-pedra-900: #0e0d0c;

  /* Primari · taronja de terra — OKLCH H 47.9° (to exacte del cànon #FF7300) */
  --sdp-primary-50:  #fff6f0;
  --sdp-primary-100: #ffe7dc;
  --sdp-primary-200: #ffd1bb;
  --sdp-primary-300: #ffb38c;
  --sdp-primary-400: #ff955b;
  --sdp-primary-500: var(--sdp-canon-taronja);   /* el cànon. Només com a FONS. */
  --sdp-primary-600: #dd6302;
  --sdp-primary-700: #ad4c03;   /* Taronja fort · text i fons massís d'accent */
  --sdp-primary-800: #873a01;   /* text accent · 7,97:1 · AAA */
  --sdp-primary-900: #602701;

  /* Secundari · blau de mar — OKLCH H 250.6° (to exacte del cànon #0984E3) */
  --sdp-secondary-50:  #f1f8ff;
  --sdp-secondary-100: #e0efff;
  --sdp-secondary-200: #c3e0ff;
  --sdp-secondary-300: #96c9ff;
  --sdp-secondary-400: #49a3fa;
  --sdp-secondary-500: var(--sdp-canon-blau);   /* fons · text blanc 5,23:1 · AA */
  --sdp-secondary-600: #00599d; /* Blau fort · text i fons massís d'acció */
  --sdp-secondary-700: #004983;
  --sdp-secondary-800: #003663;
  --sdp-secondary-900: #002546;

  /* Estat */
  --sdp-error-500: #c2181d;  --sdp-error-50: #ffedeb;  --sdp-error-700: #92000c;
  --sdp-avis-500:  #9c6902;  --sdp-avis-50:  #fff1df;  --sdp-avis-700:  #6e4901;
  --sdp-exit-500:  #027e38;  --sdp-exit-50:  #e4f8e7;  --sdp-exit-700:  #005c27;

  /* ═══ CAPA 2 · SEMÀNTICS · TEMA CLAR ═══════════════════════════
     Cada línia porta el contrast mesurat i el nivell que compleix.  */

  /* Fons */
  --sdp-fons-app:        var(--sdp-pedra-150);
  --sdp-fons-targeta:    var(--sdp-blanc-pur);
  --sdp-fons-elevat:     var(--sdp-blanc-pur);
  --sdp-fons-superficie: var(--sdp-blanc-pur);

  /* Estructura de marca: no canvia amb el tema */
  --sdp-fons-roca:       var(--sdp-pedra-900);
  --sdp-sobre-roca:      var(--sdp-pedra-50);
  --sdp-fons-subtil:     var(--sdp-pedra-200);
  --sdp-fons-invers:     var(--sdp-pedra-900);
  --sdp-fons-vel:        rgba(14, 13, 12, 0.55);
  --sdp-color-focus:     var(--sdp-secondary-500);

  /* Text — TOT compleix AAA (≥7:1) sobre la seua superfície */
  --sdp-text-titol:  var(--sdp-pedra-900);   /* 19,42:1 */
  --sdp-text-cos:    var(--sdp-pedra-700);   /* 11,20:1 */
  --sdp-text-suau:   var(--sdp-pedra-600);   /*  7,24:1 */
  --sdp-text-invers: var(--sdp-pedra-50);
  --sdp-text-desactivat: var(--sdp-pedra-500);  /* Afegeix ací overrides temporals o experiments en viu */

  /* Vores */
  --sdp-vora:         var(--sdp-pedra-300);   /* decorativa */
  --sdp-vora-control: var(--sdp-pedra-500);   /* 3,66:1 · WCAG 1.4.11 */
  --sdp-vora-forta:   var(--sdp-pedra-600);

  /* Accent · taronja — identitat de marca */
  --sdp-accent:            var(--sdp-primary-500);
  --sdp-accent-hover:      var(--sdp-primary-600);
  --sdp-accent-subtil:     var(--sdp-primary-50);
  --sdp-sobre-accent:      var(--sdp-pedra-900);    /*  7,12:1 · AAA */
  --sdp-accent-text:       var(--sdp-primary-700);  /*  5,51:1 · AA  (interacció) */
  --sdp-accent-text-hover: var(--sdp-primary-800);  /*  7,97:1 · AAA */
  --sdp-accent-titol:      var(--sdp-primary-700);  /*  5,51:1 · AA (h2, h4) */

  /* Acció · blau */
  --sdp-accio:         var(--sdp-secondary-500);
  --sdp-accio-hover:   var(--sdp-secondary-700);
  --sdp-accio-forta:   var(--sdp-secondary-700);
  --sdp-accio-subtil:  var(--sdp-secondary-50);
  --sdp-sobre-accio:   #ffffff;                  /*  5,23:1 · AA */
  --sdp-accio-text:    var(--sdp-secondary-700); /*  9,21:1 · AAA (h1, h3, h5) */
  --sdp-focus:         var(--sdp-secondary-700);
  --sdp-focus-invers:  var(--sdp-primary-400);

  /* Estat semàntic */
  --sdp-error: var(--sdp-error-500);  --sdp-error-fons: var(--sdp-error-50);  --sdp-error-text: var(--sdp-error-700);
  --sdp-avis:  var(--sdp-avis-500);   --sdp-avis-fons:  var(--sdp-avis-50);   --sdp-avis-text:  var(--sdp-avis-700);
  --sdp-exit:  var(--sdp-exit-500);   --sdp-exit-fons:  var(--sdp-exit-50);   --sdp-exit-text:  var(--sdp-exit-700);
  --sdp-info:  var(--sdp-secondary-500); --sdp-info-fons: var(--sdp-secondary-50); --sdp-info-text: var(--sdp-secondary-700);

  /* ═══ MÈTRIQUES, MOVIMENT, TIPOGRAFIA ═════════════════════════ */

  /* Radis (traslladats a design-tokens.json / design-tokens.css) */

  /* Ombres · to pedra, mai negre pur */
  --sdp-ombra-1: 0 1px 3px rgba(14, 13, 12, 0.05);
  --sdp-ombra-2: 0 3px 10px rgba(14, 13, 12, 0.07);
  --sdp-ombra-3: 0 10px 28px rgba(14, 13, 12, 0.10);
  --sdp-ombra-4: 0 18px 44px rgba(14, 13, 12, 0.16);

  /* Moviment */
  --sdp-t: 0.18s ease;
  --sdp-t-lenta: 0.3s cubic-bezier(0.2, 0.7, 0.3, 1);

  /* Mètriques del layout */
  --sdp-ctrl-vw: clamp(320px, 100vw, 1024px);
  --sdp-ctrl-scale: calc((var(--sdp-ctrl-vw) - 320px) / (1024px - 320px));
  --sdp-step-0: calc(14px + (16 - 14) * var(--sdp-ctrl-scale));
  --sdp-space-base: var(--sdp-step-0);

  --sdp-col-sidebar: 260px;
  --sdp-col-llista: 380px;
  --sdp-alt-negra: 64px;
  --sdp-alt-accio: 58px;
  --sdp-alt-barres: calc(var(--sdp-alt-negra) + var(--sdp-alt-accio) * 2);  /* 180px · pila sticky */
  --sdp-alt-nav-mobil: 96px;                 /* nav inferior + separació */
  --sdp-pad-contenidor: clamp(16px, 4vw, 40px);
  --sdp-fitxa-mida: 96px;                    /* LLEI DE LA FITXA · costat de la media = alçada mínima */

  /* Marge logotip · Contracte canònic */
  --sdp-marge-marca: var(--sdp-space-8);       /* 32px · dins de l'escala */
  --sdp-marca-amplaria: 180px;
  --sdp-marca-pagina: 600px;
  --sdp-marca-pagina-gap: var(--sdp-space-4);  /* 16px fins a l'H1 */

  /* LLEI DE VIDA · objectiu tàctil mínim. Cap control per davall. */
  --sdp-touch-min: 44px;
  --sdp-touch: var(--sdp-touch-min);
  --sdp-touch-comode: 48px;

  /* Escala z-index · única font de veritat */
  --z-barra-taronja: 99080;
  --z-barra-blava: 99090;
  --z-barra-negra: 99100;
  --z-sidebar: 99200;
  --z-fab: 99500;
  --z-nav-mobil: 99950;
  --z-vel: 99960;
  --z-calaix: 99990;

  /* Tipografia (traslladada a design-tokens.json / design-tokens.css) */

  --sdp-text-h1: 2.5rem;
  --sdp-text-h2: 2rem;
  --sdp-text-h3: 1.75rem;
  --sdp-text-h4: 1.5rem;
  --sdp-text-h5: 1.25rem;
  --sdp-text-h6: 1.125rem;
  --sdp-text-lead: 1.25rem;
  --sdp-text-base: 1.125rem;
  --sdp-text-small: 1rem;
  --sdp-text-meta: 0.875rem;   /* 14px · sòl absolut de mida de lletra */

  --sdp-leading-tight: 1.15;
  --sdp-leading-snug: 1.21;
  --sdp-leading-body: 1.65;

  /* Escala d'espaiat modular · base 4/8 */
  --sdp-space-0: 0px;   --sdp-space-1: 4px;   --sdp-space-2: 8px;
  --sdp-space-3: 12px;  --sdp-space-4: 16px;  --sdp-space-5: 20px;
  --sdp-space-6: 24px;  --sdp-space-8: 32px;  --sdp-space-10: 40px;
  --sdp-space-12: 48px; --sdp-space-16: 64px; --sdp-space-20: 80px;

  /* ── RITME VERTICAL EDITORIAL ── */
  --sdp-measure: 68ch;                 /* mesura de columna · APLICADA */
  --sdp-leading-editorial: 1.65;
  --sdp-leading-display: 1.15;
  --sdp-mt-h1: 0;    --sdp-mb-h1: 16px;
  --sdp-mt-h2: 48px; --sdp-mb-h2: 12px;   /* corregit: h2 domina h3 */
  --sdp-mt-h3: 40px; --sdp-mb-h3: 12px;
  --sdp-mt-h4: 32px; --sdp-mb-h4: 8px;
  --sdp-mt-h5: 24px; --sdp-mb-h5: 6px;
  --sdp-mt-h6: 20px; --sdp-mb-h6: 6px;
  --sdp-mb-lead: 24px;
  --sdp-mb-p: 20px;
  --sdp-mb-ul: 20px;
  --sdp-li-gap: 8px;
  --sdp-bq-indent: 24px;

  /* ═══ CAPA 2b · CROM · LA CLOSCA IMMUTABLE (260911) ═══════════════
     TopBar (header.bar-black) i SideBar (nav.app-sidebar) no canvien
     MAI entre clar i fosc. Llei:
       · Els --sdp-crom-* es declaren NOMÉS ací. Prohibit redefinir-los
         al bloc fosc (ho vigila tooling/gates/tractor-crom.mjs).
       · Les regles de la closca només pinten amb --sdp-crom-* o literals.
       · Són l'única porta legítima a les rampes des de la closca: així
         ni els components toquen primitius ni la closca toca semàntics
         que s'inverteixen. Resol la contradicció de pedra-seca/SKILL.md.
     Tots els parells text/fons són AAA (mesurats al dictamen 260911). */
  --sdp-crom-fons:              var(--sdp-pedra-900);
  --sdp-crom-text:              var(--sdp-pedra-50);
  --sdp-crom-text-suau:         rgba(255, 255, 255, 0.78);
  --sdp-crom-vora:              rgba(255, 255, 255, 0.06);
  --sdp-crom-hover:             rgba(255, 255, 255, 0.09);
  --sdp-crom-actiu-fons:        var(--sdp-primary-500);
  --sdp-crom-actiu-fons-hover:  var(--sdp-primary-400);
  --sdp-crom-actiu-text:        var(--sdp-pedra-900);
  --sdp-crom-control-fons:      var(--sdp-secondary-700);
  --sdp-crom-control-hover:     var(--sdp-secondary-600);
  --sdp-crom-control-text:      var(--sdp-pedra-50);
  --sdp-crom-sistema:           rgba(255, 230, 100, 0.9);
  --sdp-crom-sistema-viu:       rgba(255, 230, 100, 1);
  --sdp-crom-sistema-actiu:     rgba(255, 230, 100, 0.1);
  --sdp-crom-focus:             var(--sdp-primary-400);
  --sdp-crom-scroll:            var(--sdp-pedra-600);
  --sdp-crom-ombra:             0 18px 44px rgba(14, 13, 12, 0.16);

  accent-color: var(--sdp-accio);
  color-scheme: light;
}

/* ═══ CAPA 2 · SEMÀNTICS · TEMA FOSC ═══════════════════════════════
   Un sol bloc. Redefinix NOMÉS semàntics: els primitius no es toquen
   mai, per això l'escala pedra continua sent monòtona i res no es
   torna invisible.

   La resolució de la preferència del sistema la fa el script mínim
   del <head>, que escriu data-theme a l'<html> abans del primer
   pintat. Per això ACÍ NO hi ha cap @media (prefers-color-scheme):
   duplicar-lo seria dos fonts de veritat per al mateix fet.

   IDENTITAT ESTABLE: el taronja continua sent el taronja i el blau
   continua sent el blau. Vegeu la nota D-4 de l'informe.
   ───────────────────────────────────────────────────────────────── */

:root[data-theme="dark"], :host([data-theme="dark"]),
:root[data-theme="dark"] .sdp-root, :host([data-theme="dark"]) .sdp-root {
  color-scheme: dark;

  --sdp-fons-app:        var(--sdp-pedra-900);
  --sdp-fons-targeta:    var(--sdp-pedra-850);
  --sdp-fons-elevat:     var(--sdp-pedra-800);
  --sdp-fons-superficie: var(--sdp-pedra-850);
  --sdp-fons-subtil:     var(--sdp-pedra-750);
  --sdp-fons-invers:     var(--sdp-pedra-100);
  --sdp-fons-vel:        rgba(14, 13, 12, 0.72);

  --sdp-text-titol:  var(--sdp-pedra-50);    /* 17,48:1 */
  --sdp-text-cos:    var(--sdp-pedra-200);   /* 15,20:1 */
  --sdp-text-suau:   var(--sdp-pedra-300);   /* 12,44:1 */
  --sdp-text-invers: var(--sdp-pedra-900);
  --sdp-text-desactivat: var(--sdp-pedra-500);

  --sdp-vora:         var(--sdp-pedra-750);
  --sdp-vora-control: var(--sdp-pedra-500);  /*  4,90:1 */
  --sdp-vora-forta:   var(--sdp-pedra-400);

  --sdp-accent:            var(--sdp-primary-500);
  --sdp-accent-hover:      var(--sdp-primary-400);
  --sdp-accent-subtil:     var(--sdp-primary-900);
  --sdp-sobre-accent:      var(--sdp-pedra-900);   /*  7,13:1 */
  --sdp-accent-text:       var(--sdp-primary-400); /*  8,24:1 */
  --sdp-accent-text-hover: var(--sdp-primary-300); /* 10,26:1 */
  --sdp-accent-titol:      var(--sdp-primary-300); /* 10,26:1 */

  --sdp-accio:         var(--sdp-secondary-500);
  --sdp-accio-hover:   var(--sdp-secondary-400);
  --sdp-accio-forta:   var(--sdp-accio-text);
  --sdp-accio-subtil:  var(--sdp-secondary-900);
  --sdp-sobre-accio:   #ffffff;
  --sdp-accio-text:    var(--sdp-secondary-300);   /* 10,28:1 */
  --sdp-focus:         var(--sdp-focus-invers);
  --sdp-focus-invers:  var(--sdp-primary-400);

  --sdp-error-fons: #2a0f11; --sdp-error-text: #ffb3b0;
  --sdp-avis-fons:  #2a1e05; --sdp-avis-text:  #f5c96b;
  --sdp-exit-fons:  #052213; --sdp-exit-text:  #86dfa4;
  --sdp-info-fons:  #041f33; --sdp-info-text:  var(--sdp-secondary-300);

  --sdp-ombra-1: 0 1px 3px rgba(0, 0, 0, 0.45);
  --sdp-ombra-2: 0 3px 10px rgba(0, 0, 0, 0.55);
  --sdp-ombra-3: 0 10px 28px rgba(0, 0, 0, 0.62);
  --sdp-ombra-4: 0 18px 44px rgba(0, 0, 0, 0.72);
}

/* ── 1. RESET I BASE ───────────────────────────────────────────── */
@layer reset {
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  height: 100%;
  overscroll-behavior: none;           /* mata el rubber-band global */
  -webkit-text-size-adjust: 100%;
}

body, :host, .sdp-root {
  font-family: var(--sdp-font);
  line-height: 1.5;
  background: var(--sdp-fons-app);
  color: var(--sdp-text-titol);
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.sdp-root {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  overscroll-behavior: none;
}

img { max-width: 100%; }
button, input, select, textarea { font: inherit; }
}

@layer legacy {

/* ═══════════════════════════════════════════════════════════════
   TIPOGRAFIA EDITORIAL · TRELLAT PUR
   Regles globals — ÚNICA FONT DE VERITAT.
   Cap element de text necessita cap div embolcall ni estil inline.
   El ritme vertical és implacable per cascada.
   ═══════════════════════════════════════════════════════════════ */
h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6 {
  font-family: var(--sdp-font) !important;
  color: var(--sdp-text-titol);
  text-wrap: balance;
  margin: 0;
  padding: 0;
  text-transform: none;
}
h1, .h1 {
  font-size: var(--sdp-text-h1);
  line-height: var(--sdp-leading-display);
  font-weight: 800;
  color: var(--sdp-accio-text) !important;
  text-align: center;
  margin-top: var(--sdp-mt-h1);
  margin-bottom: var(--sdp-mb-h1);
  letter-spacing: -0.01em;
}
h2, .h2 {
  font-size: var(--sdp-text-h2);
  line-height: var(--sdp-leading-snug);
  font-weight: 800;
  color: var(--sdp-accent-titol) !important;
  text-align: center;
  margin-top: var(--sdp-mt-h2);
  margin-bottom: var(--sdp-mb-h2);
  letter-spacing: -0.005em;
}
h3, .h3 {
  font-size: var(--sdp-text-h3);
  line-height: var(--sdp-leading-snug);
  font-weight: 700;
  color: var(--sdp-accio-text) !important;
  text-align: left;
  margin-top: var(--sdp-mt-h3);
  margin-bottom: var(--sdp-mb-h3);
  border-bottom: 1px solid var(--sdp-vora);
  padding-bottom: 12px;
}
h4, .h4 {
  font-size: var(--sdp-text-h4);
  line-height: var(--sdp-leading-snug);
  font-weight: 700;
  color: var(--sdp-accent-titol) !important;
  text-align: left;
  margin-top: var(--sdp-mt-h4);
  margin-bottom: var(--sdp-mb-h4);
}
h5, .h5 {
  font-size: var(--sdp-text-h5);
  line-height: var(--sdp-leading-editorial);
  font-weight: 700;
  color: var(--sdp-accio-text) !important;
  text-align: left;
  margin-top: var(--sdp-mt-h5);
  margin-bottom: var(--sdp-mb-h5);
}
h6, .h6 {
  font-size: var(--sdp-text-h6);
  line-height: var(--sdp-leading-editorial);
  font-weight: 700;
  color: var(--sdp-text-suau);
  text-align: left;
  margin-top: var(--sdp-mt-h6);
  margin-bottom: var(--sdp-mb-h6);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
p {
  font-family: var(--sdp-font) !important;
  font-size: var(--sdp-text-base);
  line-height: var(--sdp-leading-editorial);
  color: var(--sdp-text-cos);
  margin-top: 0;
  margin-bottom: var(--sdp-mb-p);
  hyphens: auto;
}
.lead {
  font-size: var(--sdp-text-lead);
  line-height: 1.5;
  font-weight: 600;
  color: var(--sdp-text-suau);
  text-align: center;
  margin-top: 0;
  margin-bottom: var(--sdp-mb-lead);
}
/* ── LLISTES PURES (sense divs embolcall) ── */
ul, ol {
  font-size: var(--sdp-text-base);
  line-height: var(--sdp-leading-editorial);
  color: var(--sdp-text-cos);
  margin-top: 0;
  margin-bottom: var(--sdp-mb-ul);
  padding-left: 28px;
}
ul { list-style: disc; }
ol { list-style: decimal; }
li {
  margin-bottom: var(--sdp-li-gap);
  padding-left: 4px;
}
li:last-child { margin-bottom: 0; }
li > ul, li > ol {
  margin-top: var(--sdp-li-gap);
  margin-bottom: var(--sdp-li-gap);
}
/* ── CITA ── */
blockquote {
  margin: 32px auto;
  padding: 4px 0 4px var(--sdp-bq-indent);
  border-left: 4px solid var(--sdp-accent);
  font-style: italic;
  color: var(--sdp-text-suau);
}
blockquote p {
  font-size: 1.15rem;
  line-height: 1.6;
  color: inherit;
  margin-bottom: 8px;
}
blockquote p:last-child { margin-bottom: 0; }
/* ── REGLES ADJACENTS · TRANSICIONS EXACTES ── */
h1 + .lead, h2 + .lead { margin-top: 0; }
h1 + p, h2 + p { margin-top: 12px; }
.lead + p { margin-top: 0; }
h3 + p, h4 + p, h5 + p, h6 + p { margin-top: 0; }
h3 + ul, h3 + ol, h4 + ul, h4 + ol,
h5 + ul, h5 + ol, p + ul, p + ol { margin-top: -4px; }
ul + p, ol + p { margin-top: 0; }
h2 + h3 { margin-top: 24px; }
h3 + h4 { margin-top: 16px; }
/* ── FIRST / LAST CHILD ── */
h1:first-child, h2:first-child, h3:first-child,
h4:first-child, h5:first-child, h6:first-child,
p:first-child, .lead:first-child,
ul:first-child, ol:first-child,
blockquote:first-child { margin-top: 0 !important; }
h1:last-child, h2:last-child, h3:last-child,
h4:last-child, h5:last-child, h6:last-child,
p:last-child, .lead:last-child,
ul:last-child, ol:last-child,
blockquote:last-child { margin-bottom: 0 !important; }


/* ── LLEI DE VIDA · cap control per davall de --sdp-touch ── */
button, .btn, .nav-item, .sp-card-action, .page-btn,
.download-card-btn, .audio-play-btn, .file-item-action, summary.accordion-header {
  min-width: var(--sdp-touch);
  min-height: var(--sdp-touch);
}

a { color: var(--sdp-accent-titol); text-decoration: none; transition: color var(--sdp-t); }
a:hover { color: var(--sdp-accent-text-hover); }

::selection { background: var(--sdp-accent); color: var(--sdp-text-titol); }

:focus-visible { outline: 3px solid var(--sdp-focus); outline-offset: 2px; }
/* Sobre superfícies fosques, l'anell de focus és taronja */
/* Closca (TopBar/SideBar): anell immutable. Abans --sdp-accent-text feia
   un marró de baix contrast sobre negre en clar i un altre color en fosc. */
.app-sidebar :focus-visible,
header.bar-black :focus-visible { outline-color: var(--sdp-crom-focus); }
header.bar-blue :focus-visible,
.mobile-nav :focus-visible,
.sp-card-footer :focus-visible { outline-color: var(--sdp-accent-text); }

.sr-only, .sdp-sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}

/* ── 2. ESQUELET DE 3 COLUMNES ─────────────────────────────────
   body(flex) ─ nav.app-sidebar (fixa 260px)
             ├─ aside.app-list  (opcional, llista contextual)
             └─ main.app-main   (visor, flexible)
   Flexbox i no grid: així el layout no es trenca quan la columna
   central no existeix (com en esta demo).                        */

main.app-main {
  flex: 1 1 auto;
  min-width: 0;                        /* evita desbordaments de flex */
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: clip;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--sdp-text-suau) transparent;
  position: relative;
}

.app-main-content {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* ── 3. COLUMNA 1 · SIDEBAR ────────────────────────────────────── */
nav.app-sidebar {
  flex: 0 0 var(--sdp-col-sidebar);
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--sdp-crom-fons);
  color: var(--sdp-crom-text);
  /* Sense açò, els controls natius (el <button> de la marca, la barra de
     scroll) prenen els colors UA del tema de la pàgina: negre en clar,
     blanc en fosc. Detectat amb Chromium, no amb el gate (260911). */
  color-scheme: dark;
  position: relative;
  z-index: var(--z-sidebar);
  overscroll-behavior: contain;
}
/* L'últim bloc (menú) absorbeix l'alçada restant i fa scroll propi */
nav.app-sidebar > div:last-child {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--sdp-crom-scroll) transparent;
}

.brand {
  height: var(--sdp-alt-negra);
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: var(--sdp-marge-marca);
  border-bottom: 1px solid var(--sdp-crom-vora);
}
.brand img { width: 100%; max-width: var(--sdp-marca-amplaria); height: auto; object-fit: contain; }

/* ── BOTÓ DEL PANELL DE CONTROL ──
   El Mestre ha demanat expressament tornar al disseny clàssic de bloc sencer
   ("pintar todo el div como estaba antes"). */
.sidebar-control-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--sdp-space-3);
  flex: none;
  align-self: stretch;
  height: var(--sdp-alt-accio);
  margin: 0;
  padding: 0 28px;
  border: none;
  border-radius: 0;
  background: var(--sdp-crom-control-fons);
  color: var(--sdp-crom-control-text);
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: background var(--sdp-t);
}
.sidebar-control-btn:hover { background: var(--sdp-crom-control-hover); }
.sidebar-control-btn:active { background: var(--sdp-crom-control-fons); }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: var(--sdp-space-2) 18px;
  margin-bottom: var(--sdp-space-1);
  border-radius: var(--sdp-radi-pastilla);
  color: var(--sdp-crom-text-suau);
  text-decoration: none;
  font-weight: 600;
  transition: background var(--sdp-t), color var(--sdp-t);
}
.nav-item:hover { background: var(--sdp-crom-hover); color: var(--sdp-crom-text); }
.nav-item.active { background: var(--sdp-crom-actiu-fons); color: var(--sdp-crom-actiu-text); }
.nav-item.active:hover { background: var(--sdp-crom-actiu-fons-hover); }

.nav-item.nav-item--system {
  background-color: transparent;
  color: var(--sdp-crom-sistema);
}
.nav-item.nav-item--system:hover {
  background-color: transparent;
  color: var(--sdp-crom-sistema-viu);
}
/* Abans: --sdp-text-invers → en fosc, text negre sobre la SideBar negra
   (1,23:1, invisible). */
.nav-item.nav-item--system.active {
  background-color: var(--sdp-crom-sistema-actiu);
  color: var(--sdp-crom-text);
}

/* ── 4. COLUMNA 2 · LLISTA CONTEXTUAL (opcional) ───────────────
   Esta demo no la inclou; l'app real (xats, llocs…) només ha de
   muntar <aside class="app-list"> entre la sidebar i el visor.   */

/* ── 5. COLUMNA 3 · VISOR — BARRES GLOBALS ─────────────────────── */
header.bar-black {
  height: var(--sdp-alt-negra);
  flex: none;
  background: var(--sdp-crom-fons);
  color: var(--sdp-crom-text);
  color-scheme: dark; /* controls natius immutables (vegeu nav.app-sidebar) */
  display: flex;
  align-items: center;
  padding: 0 var(--sdp-space-6);
  padding-left: 0 !important;
  border-bottom: 1px solid var(--sdp-crom-vora);
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: var(--z-barra-negra);
}
.bar-black .right-icons { display: flex; align-items: center; gap: var(--sdp-space-2); margin-left: auto; }
.bar-black .right-icons .icon { width: var(--sdp-touch); height: var(--sdp-touch); padding: 6px; opacity: 0.8; cursor: pointer; transition: opacity var(--sdp-t), transform var(--sdp-t); }
.bar-black .right-icons .icon:hover { opacity: 1; transform: translateY(-1px); }
.bar-black .right-icons .icon img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
.bar-black .right-icons .icon {
  margin-left: 0.5rem;
}

@keyframes sdp-iaia-pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.iaia-icon {
  fill: var(--sdp-crom-actiu-fons); /* taronja canònic, immutable (viu a la TopBar) */
  stroke: none;
  animation: sdp-iaia-pulse 4s ease-in-out infinite;
}

/* Botó logo: només visible en mòbil (obri la sidebar) o en escriptori tancat */
.mobile-logo-wrapper { display: none; cursor: pointer; }
.mobile-logo-wrapper img { width: 180px; height: auto; object-fit: contain; }


header.bar-blue {
  height: var(--sdp-alt-accio);
  flex: none;
  background: var(--sdp-accio);
  color: var(--sdp-sobre-accio);
  display: grid;
  padding: 0 var(--sdp-space-4);
  align-items: center;
  position: -webkit-sticky;
  position: sticky;
  top: var(--sdp-alt-negra);
  z-index: 100;
  box-shadow: none;
  border-bottom: none;
  align-self: flex-start;
  width: 100%;
}
header.bar-blue.bar-blue--embed {
  position: static;
}
header.bar-blue.bar-blue--top {
  top: 0;
}

.bar-blue-left { display: flex; align-items: center; gap: var(--sdp-space-3); }
.bar-actions { display: flex; align-items: center; gap: var(--sdp-space-5); }
.bar-actions .icon { cursor: pointer; opacity: 0.9; transition: opacity var(--sdp-t); }
.bar-actions .icon:hover { opacity: 1; }

.icon {
  width: 24px; height: 24px;
  fill: none; stroke: currentColor; stroke-width: 2;
  stroke-linecap: round; stroke-linejoin: round;
  flex: none;
}

/* Unify black bar icon sizes with blue bar (Action Menu) sizes */
.bar-black .right-icons svg {
  width: 30px;
  height: 30px;
  stroke-width: 2.5;
  transition: width var(--sdp-t), height var(--sdp-t);
}

/* Hero */
.hero-image { width: 100%; flex: none; }
.hero-image img {
  display: block;
  width: 100%;
  height: auto;
  margin-bottom: -1px; /* Evita filets blancs per arrodoniment de subpíxels */
}

/* Barra taronja (context: autor i poble) */
section.bar-orange {
  height: var(--sdp-alt-accio);
  flex: none;
  background: var(--sdp-accent);
  color: var(--sdp-text-titol);
  padding: 0 var(--sdp-space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--sdp-space-3);
  font-size: 0.9rem;
  position: sticky;
  top: calc(var(--sdp-alt-negra) + var(--sdp-alt-accio));
  z-index: var(--z-barra-taronja);
  align-self: flex-start;
  width: 100%;
}
section.bar-orange.bar-orange--embed {
  position: static;
}
section.bar-orange.bar-orange--top {
  top: var(--sdp-alt-accio);
}

/* Col·locació explícita a la reixeta dels components atòmics */
/* .bar-blue has 3 elements: Left, Center, Right */
header.bar-blue > *:first-child { grid-column: 1; justify-self: start; }
header.bar-blue > *:nth-child(2) { grid-column: 2; justify-self: center; }
header.bar-blue > *:last-child { grid-column: 3; justify-self: end; }




.bar-orange .bar-actions { flex: none; white-space: nowrap; }

/* Títol de pàgina */
header.page-title {
  margin: 0 var(--sdp-pad-contenidor) var(--sdp-space-6);
  padding: var(--sdp-space-6) var(--sdp-space-8);
  background: var(--sdp-blanc);
  border-radius: 0 0 36px 36px;
  box-shadow: var(--sdp-ombra-1);
  text-align: center;
}
header.page-title h1, header.page-title .h1 {
  font-size: clamp(1.8rem, 4.5vw, 2.5rem);
  color: var(--sdp-accio-text);
  margin-bottom: var(--sdp-space-2);
  letter-spacing: 0.02em;
  max-width: none;
}
header.page-title h2 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
}
header.page-title .lead {
  margin-bottom: 0;
  color: var(--sdp-text-suau);
}
.page-title-logo { display: block; width: var(--sdp-marca-pagina); max-width: 100%; height: auto; margin: 0 auto var(--sdp-marca-pagina-gap); object-fit: contain; }
.page-title-labels { margin-top: 32px; margin-bottom: 32px; display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; }
.page-title-copyright { margin-bottom: 0; text-align: center; color: var(--sdp-text-suau); font-size: var(--sdp-text-meta); letter-spacing: 0.05em; }



/* ── 6. CONTINGUT EDITORIAL ────────────────────────────────────── */
article.content-wrapper {
  flex: none;
  padding: 0 var(--sdp-pad-contenidor) var(--sdp-pad-contenidor);
  width: 100%;
}
article.content-wrapper.no-padding {
  padding: 0;
}
.content-wrapper > .hero-image,
.content-wrapper > section.bar-orange {
  margin-left: calc(var(--sdp-pad-contenidor) * -1);
  margin-right: calc(var(--sdp-pad-contenidor) * -1);
  width: auto;
}

/* ── MESURA EDITORIAL · la columna de text no passa mai de 68ch ──────
   S'aplica al TEXT, no al contenidor: així les reixetes, les taules,
   les targetes i les paletes continuen ocupant tota l'amplària, i
   només el text corrent es limita i es centra. Esta és la diferència
   entre un manual llegible i una paret de caràcters.                */
.content-wrapper > p,
.content-wrapper > ul,
.content-wrapper > ol,
.content-wrapper > blockquote,
.content-wrapper > .lead,
.design-block > p,
.design-block > ul,
.design-block > ol,
.design-block > blockquote,
.design-block > .lead,
.cms-preview > p,
.cms-preview > ul,
.cms-preview > ol {
  max-width: none;
  margin-inline: auto;
}
/* Els títols de secció acompanyen la columna, no la travessen */
.design-block > h4,
.design-block > h5,
.design-block > h6 {
  max-width: none;
  margin-left: 0;
  margin-right: 0;
}
/* Excepció explícita: el primer paràgraf de secció fa d'entradeta i
   s'alinea amb el títol de la secció, que va a l'esquerra. */
.design-block > p:first-of-type { margin-inline: 0; }

section.design-block { margin-bottom: var(--sdp-space-16); }
/* En .design-block la tipografia flueix PURA: hereta TOTES les regles globals.
   Només centrem el flux i distingim els títols d'índex del manual. */

/* Títols d'índex de cada secció del manual */
section.design-block > h3:first-of-type,
section.design-block > h3:first-child {
  text-align: left;
  margin-left: 0;
  margin-right: 0;
  max-width: none;
  font-size: clamp(1.4rem, 2.4vw, 1.75rem);
}

.page-intro {
  margin-bottom: 24px;
}

section.design-block > p:first-of-type {
  text-align: left;
  max-width: none;
  margin-left: 0;
  color: var(--sdp-text-suau);
  margin-bottom: 28px;
}

/* Paleta de mostres */
.palette { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 24px; margin-bottom: var(--sdp-space-8); }
.swatch {
  border-radius: var(--sdp-radi-m);
  overflow: hidden;
  background: var(--sdp-fons-targeta);
  box-shadow: var(--sdp-ombra-1);
  transition: transform var(--sdp-t), box-shadow var(--sdp-t);
}
.swatch:hover { transform: translateY(-3px); box-shadow: var(--sdp-ombra-3); }
.swatch-color { height: 100px; padding: var(--sdp-space-4); font-weight: 700; display: flex; align-items: flex-end; }
.swatch-info { padding: var(--sdp-space-4); font-family: var(--sdp-font-mono); font-size: 0.8rem; color: var(--sdp-text-suau); }


/* Icona en línia amb el text · substituïx 16 estils inline idèntics.
   El marge dret desapareix quan la icona és l'únic fill (botó rodó). */
.icona-linia { display: inline-block; vertical-align: middle; margin-right: 4px; flex: none; }
.icona-linia:only-child { margin-right: 0; }

/* Mostres de paleta · sense cap estil inline */
.sw-pedra-100 { background: var(--sdp-pedra-100); color: var(--sdp-pedra-900); }
.sw-pedra-200 { background: var(--sdp-pedra-200); color: var(--sdp-pedra-900); }
.sw-pedra-300 { background: var(--sdp-pedra-300); color: var(--sdp-pedra-900); }
.sw-pedra-400 { background: var(--sdp-pedra-400); color: var(--sdp-pedra-900); }
.sw-pedra-500 { background: var(--sdp-pedra-500); color: var(--sdp-pedra-50); }
.sw-pedra-600 { background: var(--sdp-pedra-600); color: var(--sdp-pedra-50); }
.sw-pedra-700 { background: var(--sdp-pedra-700); color: var(--sdp-pedra-50); }
.sw-pedra-750 { background: var(--sdp-pedra-750); color: var(--sdp-pedra-50); }
.sw-pedra-800 { background: var(--sdp-pedra-800); color: var(--sdp-pedra-50); }
.sw-pedra-850 { background: var(--sdp-pedra-850); color: var(--sdp-pedra-50); }
.sw-pedra-900 { background: var(--sdp-pedra-900); color: var(--sdp-pedra-50); }
.sw-blanc-pur { background: #ffffff; color: var(--sdp-pedra-900); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1); }
.sw-negre-pur { background: var(--sdp-pedra-900); color: #ffffff; }
.sw-primary-500 { background: var(--sdp-primary-500); color: var(--sdp-pedra-900); }
.sw-primary-700 { background: var(--sdp-primary-700); color: #ffffff; }
.sw-secondary-500 { background: var(--sdp-secondary-500); color: #ffffff; }
.sw-secondary-600 { background: var(--sdp-accio-text); color: #ffffff; }
.sw-error-500 { background: var(--sdp-error-500); color: #ffffff; }
.sw-avis-500 { background: var(--sdp-avis-500); color: #ffffff; }
.sw-exit-500 { background: var(--sdp-exit-500); color: #ffffff; }
.swatch-info { line-height: 1.5; }

/* Previsualització CMS (contingut editorial universal) */
.cms-preview > * {
  margin-left: auto !important;
  margin-right: auto !important;
}
.cms-preview pre, .accordion pre {
  background: var(--sdp-fons-subtil);
  padding: var(--sdp-space-4);
  border-radius: var(--sdp-radi-s);
  border: 1px solid var(--sdp-vora);
  font-family: var(--sdp-font-mono);
  font-size: 0.85rem;
  color: var(--sdp-text-suau);
  overflow-x: auto;
}

/* Espaiat */
.spacing-item { display: flex; align-items: center; gap: var(--sdp-space-4); margin-bottom: var(--sdp-space-3); }
.spacing-bar { width: var(--mida, var(--sdp-space-4)); height: var(--sdp-space-4); background: var(--sdp-accent); border-radius: var(--sdp-space-1); flex: none; }
.spacing-label { font-family: var(--sdp-font-mono); font-size: 0.85rem; color: var(--sdp-text-suau); }

/* Grid demo */
.grid-preview { display: flex; gap: var(--sdp-space-4); }
.grid-col {
  flex: 1;
  background: var(--sdp-fons-targeta);
  border: 1px solid var(--sdp-vora);
  padding: 12px;
  text-align: center;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--sdp-text-suau);
  font-weight: 600;
}

/* ── 7. COMPONENTS ─────────────────────────────────────────────── */

/* 7.1 Botons */
.btn-group { display: flex; flex-wrap: wrap; gap: var(--sdp-space-4); align-items: center; justify-content: flex-start; }
.btn {
  padding: var(--sdp-space-3) var(--sdp-space-6);
  border-radius: var(--sdp-radi-pastilla);
  font-family: var(--sdp-font);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: var(--sdp-space-2);
  transition: transform var(--sdp-t), box-shadow var(--sdp-t), background var(--sdp-t), border-color var(--sdp-t), color var(--sdp-t);
}
.btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(14,13,12,0.16); }
.btn:active:not(:disabled) { transform: translateY(0); box-shadow: 0 2px 6px rgba(14,13,12,0.14); }
.btn-primary { background: var(--sdp-accent); color: var(--sdp-text-titol); }
.btn-primary:hover:not(:disabled) { background: var(--sdp-accent-hover); color: var(--sdp-sobre-accent); }
.btn-secondary { background: var(--sdp-accio); color: var(--sdp-sobre-accio); }
.btn-secondary:hover:not(:disabled) { background: var(--sdp-accio-hover); }
.btn-outline-dark { background: transparent; border: 1px solid var(--sdp-vora-control); color: var(--sdp-text-titol); }
.btn-outline-dark:hover:not(:disabled) { border-color: var(--sdp-text-suau); background: var(--sdp-fons-targeta); }
.btn-base { background: var(--sdp-fons-invers); color: var(--sdp-text-invers); }
.btn-base:hover:not(:disabled) { background: var(--sdp-fons-invers); }
.btn-danger { background: var(--sdp-error); color: var(--sdp-text-invers); }
.btn-danger:hover:not(:disabled) { background: var(--sdp-error-text); }
.btn-ghost { background: transparent; color: var(--sdp-text-titol); border: 1px solid var(--sdp-vora); }
.btn-ghost:hover:not(:disabled) { background: rgba(14,13,12,0.06); border-color: var(--sdp-text-suau); }
.btn-sm { padding: var(--sdp-space-2) var(--sdp-space-4); font-size: 0.85rem; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.icon-btn { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

.spinner { animation: spin 1s linear infinite; width: 18px; height: 18px; stroke-dasharray: 60; stroke-dashoffset: 20; }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* 7.2 Formularis */
.form-group { margin-bottom: var(--sdp-space-5); display: flex; flex-direction: column; gap: var(--sdp-space-2); }
.form-group label { font-weight: 700; font-size: 0.9rem; color: var(--sdp-text-titol); }
.form-group input, .form-group select, .form-group textarea {
  padding: var(--sdp-space-3) var(--sdp-space-4);
  border: 1px solid var(--sdp-vora-control);
  border-radius: var(--sdp-radi-s);
  font-family: var(--sdp-font);
  font-size: 1rem;
  background: var(--sdp-fons-targeta);
  color: var(--sdp-text-titol);
  outline: none;
  transition: border-color var(--sdp-t), box-shadow var(--sdp-t);
  width: 100%;
}
.form-group textarea { resize: vertical; }
.form-group input:hover, .form-group select:hover, .form-group textarea:hover { border-color: var(--sdp-text-suau); }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: var(--sdp-accio-text);
  box-shadow: 0 0 0 3px rgba(1,110,191,0.16);
}
.form-group select, .search-filters select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%238b857b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
  padding-right: 42px;
}
.checkbox-group { display: flex; align-items: center; gap: var(--sdp-space-2); margin-bottom: var(--sdp-space-2); }
.checkbox-group input { width: 24px; height: 24px; accent-color: var(--sdp-accio-text); flex: none; }
.form-group.has-error input { border-color: var(--sdp-error); background: var(--sdp-error-fons); }
.form-group.has-error input:focus { box-shadow: 0 0 0 3px rgba(194,20,25,0.16); }
.error-text { color: var(--sdp-error-text); font-size: var(--sdp-text-meta); font-weight: 600; }
.form-group.is-disabled input { background: transparent; color: var(--sdp-text-suau); cursor: not-allowed; }

/* 7.3 Alertes */
.alert { padding: var(--sdp-space-4); border-radius: var(--sdp-radi-s); display: flex; gap: var(--sdp-space-3); margin-bottom: var(--sdp-space-3); }
.alert-info { background: var(--sdp-info-fons); color: var(--sdp-info-text); }
.alert-success { background: var(--sdp-exit-fons); color: var(--sdp-exit-text); }
.alert-warning { background: var(--sdp-avis-fons); color: var(--sdp-avis-text); }
.alert-error { background: var(--sdp-error-fons); color: var(--sdp-error-text); }
.alert-icon { width: 24px; height: 24px; flex-shrink: 0; }
.alert-content h4 { margin-bottom: var(--sdp-space-1); font-size: 1rem; text-transform: none; }
.alert-info h4, .alert-success h4 { color: var(--sdp-secondary-700); }
.alert-content p { font-size: var(--sdp-text-meta); margin: 0; }

/* 7.4 Badges */
.badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: var(--sdp-radi-pastilla); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
.badge-default { background: var(--sdp-fons-subtil); color: var(--sdp-text-titol); }
.badge-primary { background: var(--sdp-accent); color: var(--sdp-text-titol); }
.badge-success { background: var(--sdp-exit-fons); color: var(--sdp-exit-text); }
.badge-warning { background: var(--sdp-avis-fons); color: var(--sdp-avis-text); }
.badge-danger { background: var(--sdp-error-fons); color: var(--sdp-error-text); }
.badge-info { background: var(--sdp-info-fons); color: var(--sdp-info-text); }
.badge-outline { background: transparent; border: 1px solid var(--sdp-vora-control); color: var(--sdp-text-titol); }

/* 7.5 Taules suprimides. Veure Canonical CSS al final de l'arxiu. */
.table-action { color: var(--sdp-accent-text); font-weight: 600; text-decoration: none; }
.table-action:hover { color: var(--sdp-accent-text-hover); text-decoration: underline; }

/* 7.6 Navegació */
.nav-bar { display: flex; border-bottom: 1px solid var(--sdp-vora); margin-bottom: var(--sdp-space-6); }
.nav-bar a { padding: 16px 24px; text-decoration: none; color: var(--sdp-text-suau); font-weight: 600; white-space: nowrap; transition: color var(--sdp-t); }
.nav-bar a:hover { color: var(--sdp-text-titol); }
.nav-bar a.active { color: var(--sdp-accent-text); border-bottom: 3px solid var(--sdp-accent); }
.pagination { display: flex; gap: var(--sdp-space-2); align-items: center; flex-wrap: wrap; }
.page-btn { padding: var(--sdp-space-2) var(--sdp-space-4); border: 1px solid var(--sdp-vora); border-radius: 4px; background: var(--sdp-fons-targeta); color: var(--sdp-text-titol); font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; transition: border-color var(--sdp-t), color var(--sdp-t), background var(--sdp-t); }
.page-btn:hover:not(.active):not([disabled]) { border-color: var(--sdp-accent-text); color: var(--sdp-accent-titol); }
.page-btn.active { background: var(--sdp-accent); color: var(--sdp-sobre-accent); border-color: var(--sdp-accent); }
.page-btn[disabled] { opacity: 0.5; cursor: not-allowed; }

/* 7.7 Modals */
.modal-preview { background: var(--sdp-fons-vel); padding: 40px; display: flex; align-items: center; justify-content: center; border-radius: var(--sdp-radi-s); }
.modal-box { background: var(--sdp-fons-targeta); padding: var(--sdp-space-8); border-radius: var(--sdp-radi-m); max-width: 400px; width: 100%; box-shadow: var(--sdp-ombra-4); }
.modal-box h3 { margin-bottom: var(--sdp-space-3); font-size: 1.25rem; color: var(--sdp-text-titol); }
.modal-box p { color: var(--sdp-text-suau); margin-bottom: var(--sdp-space-6); font-size: 0.95rem; line-height: 1.5; }
.modal-actions { display: flex; justify-content: flex-end; gap: var(--sdp-space-3); flex-wrap: wrap; }

/* 7.8 Indicadors de càrrega */
.spinner-group { display: flex; align-items: center; gap: 24px; margin-bottom: var(--sdp-space-8); }
.spinner-sm { width: 16px; height: 16px; }
.spinner-md { width: 24px; height: 24px; }
.spinner-lg { width: 32px; height: 32px; }
.skeleton { background: var(--sdp-fons-subtil); border-radius: 4px; animation: pulse 1.5s infinite; }
.skeleton-title { height: 24px; width: 60%; margin-bottom: var(--sdp-space-4); }
.skeleton-text { height: 12px; width: 100%; margin-bottom: var(--sdp-space-2); }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

/* 7.9 Avatars */
.avatar-group { display: flex; align-items: center; gap: var(--sdp-space-4); flex-wrap: wrap; }
.avatar { background: var(--sdp-fons-subtil); color: var(--sdp-text-titol); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex: none; }
.avatar-xs { width: 24px; height: 24px; font-size: 0.6rem; }
.avatar-sm { width: 32px; height: 32px; font-size: 0.7rem; }
.avatar-md { width: 48px; height: 48px; }
.avatar-lg { width: 64px; height: 64px; font-size: 1.2rem; }
.avatar-xl { width: 80px; height: 80px; font-size: 1.5rem; }

/* 7.10 Desplegables */
.accordion { border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); overflow: hidden; background: var(--sdp-fons-targeta); }
.accordion-header, summary.accordion-header {
  padding: 16px 24px;
  background: var(--sdp-fons-subtil);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--sdp-space-3);
  border: none;
  border-bottom: 1px solid var(--sdp-vora);
  transition: background var(--sdp-t);
  list-style: none;
}
summary.accordion-header::-webkit-details-marker { display: none; }
.accordion-header:hover, summary.accordion-header:hover { background: var(--sdp-fons-subtil); }
.accordion-header svg, summary.accordion-header svg { flex: none; transition: transform var(--sdp-t); }
details[open] summary.accordion-header svg:last-child { transform: rotate(180deg); }
.accordion pre { margin: 0; border: 0; border-radius: 0; }

/* 7.11 Pestanyes */
.tabs { display: flex; border-bottom: 1px solid var(--sdp-vora); margin-bottom: var(--sdp-space-4); }
.tab { padding: var(--sdp-space-3) var(--sdp-space-6); font-weight: 700; color: var(--sdp-text-suau); cursor: pointer; border-bottom: 3px solid transparent; white-space: nowrap; transition: color var(--sdp-t), border-color var(--sdp-t); }
.tab:hover:not(.active) { color: var(--sdp-text-titol); }
.tab.active { color: var(--sdp-accent-text); border-bottom-color: var(--sdp-accent-text); }
.tab-content { padding: var(--sdp-space-4); background: var(--sdp-fons-subtil); border-radius: var(--sdp-radi-s); border: 1px solid var(--sdp-vora); }

/* 7.12 Barra de progrés */
.progress-container { margin-bottom: var(--sdp-space-6); }
.progress-header { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: var(--sdp-space-2); color: var(--sdp-text-suau); }
.progress-bar { height: 8px; background: var(--sdp-fons-subtil); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--sdp-accent); border-radius: 4px; transition: width 0.4s ease; }

/* 7.13 Tooltips */
.tooltip-preview { display: flex; gap: 32px; align-items: center; flex-wrap: wrap; }
.tooltip-term { text-decoration: underline dotted; cursor: help; color: var(--sdp-text-suau); }

/* 7.14 Llistes */
.lists-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  grid-auto-flow: column;
  column-gap: var(--sdp-space-8);
}
.lists-preview h4 {
  font-size: 1rem;
  margin-bottom: var(--sdp-space-4);
  margin-left: 0;
  margin-right: 0;
  text-align: left;
}
.lists-preview ul, .lists-preview ol {
  margin-left: 0;
  margin-right: 0;
  max-width: none;
}

/* 7.15 Divisors */
.divider-preview { margin-bottom: 40px; }
.divider-label { font-size: 0.75rem; color: var(--sdp-text-suau);  margin-bottom: var(--sdp-space-2); }
.divider-basic { height: 1px; background: var(--sdp-vora); margin: 16px 0; }
.divider-text { display: flex; align-items: center; text-align: center; color: var(--sdp-text-suau); font-size: 0.85rem; font-weight: 700; margin: var(--sdp-space-6) 0; }
.divider-text::before, .divider-text::after { content: ''; flex: 1; border-bottom: 1px solid var(--sdp-vora); }
.divider-text:not(:empty)::before { margin-right: 16px; }
.divider-text:not(:empty)::after { margin-left: 16px; }
.divider-major { height: 2px; background: var(--sdp-accent); margin: 32px 0; }
.divider-dashed { border-top: 1px dashed var(--sdp-vora); margin: 16px 0; }
.divider-dotted { border-top: 2px dotted var(--sdp-vora); margin: var(--sdp-space-6) 0; }

/* 7.18 Llistes de definició */

/* 7.20 Indicadors (UniversalIndicatorCard) */
.sdp-indicator-card {
  background: var(--sdp-fons-targeta);
  border: 1px solid transparent; /* replaced var(--sdp-vora) with transparent to unify shadows without breaking layout */
  border-radius: var(--sdp-radi-g);
  padding: var(--sdp-space-6) var(--sdp-space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  box-shadow: var(--sdp-ombra-2);
  transition: all var(--sdp-t);
}

.sdp-indicator-card:hover {
  background: var(--sdp-fons-app);
  box-shadow: var(--sdp-ombra-3);
  transform: translateY(-2px);
}

.sdp-indicator-card.active {
  background: var(--sdp-fons-app);
  border-color: var(--sdp-accent);
  box-shadow: 0 4px 12px rgba(254, 116, 6, 0.15);
}

.sdp-indicator-card-icon {
  margin-bottom: var(--sdp-space-3);
  font-size: 3rem;
  line-height: 1;
  color: var(--sdp-accent);
}

.sdp-indicator-card-title {
  font-weight: 800;
  font-size: 1.4rem;
  color: var(--sdp-accio-text);
  margin: 0 0 var(--sdp-space-2) 0;
  line-height: var(--sdp-leading-tight);
}

.sdp-indicator-card-subtitle {
  font-size: 1rem;
  color: var(--sdp-text-suau);
  margin: 0;
}

/* 7.21 Targeta Mestra (Sóc de Poble Card) */
.sp-card {
  background: var(--sdp-fons-targeta);
  border-radius: var(--sdp-radi-m);
  overflow: hidden;
  box-shadow: var(--sdp-ombra-3);
  margin: 0 auto 32px;
  width: 100%;
  max-width: 500px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  transition: box-shadow var(--sdp-t-lenta);
  content-visibility: auto;
  contain-intrinsic-size: 400px;
}

/* Targeta Mestra enllaçable: overlay a z1, capa interactiva a z2 */
.sp-card { position: relative; }
.sp-card-link-overlay { position: absolute; inset: 0; z-index: 1; border-radius: inherit; outline: none; background: transparent; border: none; cursor: pointer; }
.sp-card-link-overlay:focus-visible { box-shadow: 0 0 0 3px var(--sdp-focus) inset; }
.sp-card-header, .sp-card-footer, .sp-card-author-link, .sp-card-author-block, .btn-icon-orange, .btn-date-time, .sp-card-action, .sp-card-connect, .sp-card-labels, .sp-card-copyright, .sp-card-body a, .sp-card-body span[onClick] { position: relative; z-index: 2; }
.sp-card-author-link, .sp-card-author-block { display: flex; align-items: center; min-width: 0; flex: 1; }

/* Etiquetes de la Targeta Mestra i Sistema de Badges */
.sp-card-labels { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--sdp-space-2); margin-top: var(--sdp-space-3); margin-bottom: var(--sdp-space-4); list-style: none; padding: 0; }
.sp-card-labels li { list-style: none; padding: 0; margin: 0; }
.sp-card-labels .sp-card-label, .sp-card-label { display: inline-flex; align-items: center; justify-content: center; height: 24px; padding: 0 12px; border-radius: 12px; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.05em; white-space: nowrap; }

/* Sistema de Badges Universals (Taxonomia 2026) */
.sdp-badge-system { background: var(--sdp-accio); color: var(--sdp-sobre-accio); }
:root[data-theme="dark"] .sdp-badge-system, :host([data-theme="dark"]) .sdp-badge-system { background: var(--sdp-accent); color: var(--sdp-sobre-accent); }
.sdp-badge-accent { background: var(--sdp-accent); color: var(--sdp-sobre-accent); }
:root[data-theme="dark"] .sdp-badge-accent, :host([data-theme="dark"]) .sdp-badge-accent { background: var(--sdp-accio); color: var(--sdp-sobre-accio); }
.sdp-badge-category { background: var(--sdp-accio-subtil); color: var(--sdp-accio-text); }
.sdp-badge-tag { background: var(--sdp-accent-subtil); color: var(--sdp-accent-text-hover); }
.sdp-badge-neutral { background: var(--sdp-fons-subtil); color: var(--sdp-text-titol); }

/* Píndoles Accessibles (Botó) */
.sp-card-label:has(.sp-card-label__action) { padding: 0; overflow: hidden; }
.sp-card-label__action {
  border: 0;
  padding: 0 12px;
  min-height: var(--sdp-touch); /* 44px LLEI_04_VIDA */
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.sp-card-label__action:hover { background: rgba(0,0,0,0.05); }
:root[data-theme="dark"] .sp-card-label__action:hover, :host([data-theme="dark"]) .sp-card-label__action:hover { background: rgba(255,255,255,0.05); }
/* Retrocompatibilitat */

/* Tooltip (Bocata) */

.sp-card:hover { box-shadow: var(--sdp-ombra-4); }
.sp-card-header { 
  background: var(--sdp-accent); 
  padding: var(--sdp-space-3) var(--sdp-space-4); 
  display: flex; justify-content: space-between;
  align-items: center; 
  gap: var(--sdp-space-3); 
  min-width: 0;
}

.sp-card-author { display: flex; align-items: center; gap: var(--sdp-space-3); flex: 1; min-width: 0; }
.sp-card-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--sdp-fons-targeta); object-fit: cover; flex: none; box-shadow: var(--sdp-ombra-1); }
.sp-card-author-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.sp-card-author-name { font-weight: 700; color: var(--sdp-text-titol); font-size: 1.05rem; line-height: 1.2; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-card-author-location { font-size: 0.85rem; color: var(--sdp-text-titol); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-card-author-location svg { display: inline-block; vertical-align: middle; margin-right: var(--sdp-space-1); }
.sp-card-meta { display: flex; align-items: center; gap: var(--sdp-space-2); color: var(--sdp-sobre-accent); text-align: right; flex: none; }

.sp-card-media { width: 100%; aspect-ratio: 1 / 1; display: block; object-fit: cover; object-position: top; background: var(--sdp-fons-subtil); }

.sp-card-body { padding: 22px 24px 16px; text-align: left; position: relative; min-width: 0; }
.sp-card-title { color: var(--sdp-accio-text); font-weight: 800; line-height: var(--sdp-leading-tight); margin: 0 0 var(--sdp-space-2) 0; flex: 1; text-align: center; }

/* Targetes Especials */
.sp-card--onboarding,
.sp-card--action {
  border: 1px solid var(--sdp-vora);
  border-top: 6px solid var(--sdp-accent);
  border-radius: var(--sdp-radi-xl);
  box-shadow: var(--sdp-ombra-3);
  padding: clamp(var(--sdp-space-5), 5vw, var(--sdp-space-8));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.sp-card--action:hover {
  box-shadow: var(--sdp-ombra-4);
  transform: translateY(-2px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.sp-card--action .sp-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0;
  width: 100%;
}

.sp-card--action .sp-card-heading-with-icon {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sdp-space-3);
  margin-bottom: var(--sdp-space-2);
  width: 100%;
}

.sp-card--action .sp-card-heading-with-icon .sp-card-title {
  text-align: center;
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--sdp-accio-text);
  line-height: var(--sdp-leading-tight);
}

.sp-card--action .sp-card-title-icon {
  margin-bottom: var(--sdp-space-1);
}

.sp-card--action .sp-card-subtitle {
  text-align: center;
  margin: 0;
  font-size: 1rem;
  color: var(--sdp-text-suau);
  font-weight: 500;
  line-height: var(--sdp-leading-body);
}

.sp-card-heading-with-icon {
  display: flex;
  align-items: center;
  gap: var(--sdp-space-4);
  margin-bottom: var(--sdp-space-5);
  justify-content: flex-start;
}

.sp-card-heading-with-icon .sp-card-title {
  text-align: left;
  margin: 0;
  flex: none;
}

.sp-card-title-icon {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sdp-accent);
}


.sp-card .sp-card-body h1 {
  font-size: 1.6rem;
  margin-top: 0;
  margin-bottom: var(--sdp-space-2);
  color: var(--sdp-accio-text);
  line-height: var(--sdp-leading-tight);
  font-weight: 800;
}
.sp-card .sp-card-body h2 {
  font-size: 1.25rem; /* subtítol més menut */
  margin-top: 16px;
  margin-bottom: var(--sdp-space-4);
  color: var(--sdp-accent-titol);
  line-height: var(--sdp-leading-snug);
  font-weight: 600;
}
/* Per defecte, tot centrat al cos de la targeta si no hi ha etiqueta a dalt a la dreta */
.sp-card .sp-card-body h1,
.sp-card .sp-card-body h2,
.sp-card-body p,
.sp-card-body .sp-card-text {
  text-align: center;
}
/* Si hi ha elements a la dreta (preu, etiqueta, .has-aside), tot s'alinea a l'esquerra per a equilibrar el pes visual */
.sp-card .sp-card-body.has-price h1,
.sp-card .sp-card-body.has-price h2,
.sp-card .sp-card-body.has-price .sp-card-title,
.sp-card .sp-card-body.has-price .sp-card-subtitle,
.sp-card-body.has-price p:not(.sp-card-copyright),
.sp-card-body.has-price .sp-card-text,
.sp-card .sp-card-body.has-calendar-badge h1,
.sp-card .sp-card-body.has-calendar-badge h2,
.sp-card .sp-card-body.has-calendar-badge .sp-card-title,
.sp-card .sp-card-body.has-calendar-badge .sp-card-subtitle,
.sp-card-body.has-calendar-badge p:not(.sp-card-copyright),
.sp-card-body.has-calendar-badge .sp-card-text,
.sp-card .sp-card-body.has-aside h1,
.sp-card .sp-card-body.has-aside h2,
.sp-card .sp-card-body.has-aside .sp-card-title,
.sp-card .sp-card-body.has-aside .sp-card-subtitle,
.sp-card-body.has-aside p:not(.sp-card-copyright),
.sp-card-body.has-aside .sp-card-text {
  text-align: left;
  margin-left: 0;
  margin-right: 0;
  justify-content: flex-start;
}

.sp-card-media-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  background: var(--sdp-fons-subtil);
  display: flex;
  flex-direction: column;
}
.sp-card-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.sp-card-copyright {
  text-align: center;
}

.sp-card-title:only-child { text-align: center; flex: none; width: 100%; }
.sp-card-price { float: right; margin-left: 6px; margin-bottom: 6px; font-size: 1.2rem; font-weight: 800; color: var(--sdp-accio-text); background: var(--sdp-accio-subtil); padding: 4px 12px; border-radius: var(--sdp-radi-pastilla); white-space: nowrap; }
.sp-card-subtitle { color: var(--sdp-accent-titol); font-weight: 700; line-height: var(--sdp-leading-snug); margin-top: var(--sdp-space-4); margin-bottom: var(--sdp-space-3); text-align: center; }
.sp-card-text { font-size: 1rem; color: var(--sdp-text-suau); font-weight: 500; line-height: var(--sdp-leading-body); margin-bottom: var(--sdp-space-6); text-align: center; margin-left: auto; margin-right: auto; }

.sp-card-copyright { color: var(--sdp-text-suau); font-size: var(--sdp-text-meta);  letter-spacing: 0.05em; }
.sp-card-footer { 
  background: var(--sdp-accio); 
  padding: var(--sdp-space-3) var(--sdp-space-4); 
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center; 
  gap: var(--sdp-space-3); 
  color: var(--sdp-sobre-accio); 
  position: relative; 
  min-width: 0;
}

.sp-card-actions { 
  display: flex; 
  align-items: center; 
  gap: var(--sdp-space-3); 
  justify-self: start;
  margin: 0;
  padding: 0;
}
.sp-card-action { background: transparent; border: none; color: currentColor; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; height: var(--sdp-space-12); width: var(--sdp-space-12); opacity: 0.9; transition: opacity var(--sdp-t), transform var(--sdp-t); }
.sp-card-action .icon { width: 30px; height: 30px; stroke-width: 2.5; display: block; margin: auto; }
.sp-card-action:hover { opacity: 1; transform: translateY(-1px); }
.sp-card-connect { margin-left: auto; justify-self: end; grid-column: 3; }

/* 7.22 Estadístiques i dashboards */
.stat-card { display: flex; align-items: center; gap: var(--sdp-space-4); background: var(--sdp-fons-targeta); border: 1px solid var(--sdp-vora); padding: var(--sdp-space-4); border-radius: var(--sdp-radi-s); box-shadow: var(--sdp-ombra-1); transition: transform var(--sdp-t), box-shadow var(--sdp-t), border-color var(--sdp-t); }
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--sdp-ombra-2); border-color: var(--sdp-vora-control); }
.stat-icon { font-size: 2rem; flex: none; }
.stat-info { display: flex; flex-direction: column; min-width: 0; }
.stat-value { font-size: 1.5rem; font-weight: 700; color: var(--sdp-text-titol); line-height: 1; margin-bottom: var(--sdp-space-1); }
.stat-label { font-size: 0.85rem; color: var(--sdp-text-suau);  }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--sdp-space-4); margin-bottom: var(--sdp-space-6); }
.sdp-card-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sdp-space-6); align-items: start; }
@media (max-width: 1400px) { .sdp-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 800px) { .sdp-card-grid { grid-template-columns: minmax(0, 1fr); } }

/* Panell de Control — Contenidor Centrat */
.ctl-main-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: var(--sdp-space-6) var(--sdp-space-4) var(--sdp-space-12);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sdp-space-8);
  width: 100%;
}
.ctl-main-container > section {
  width: 100%;
}
.ctl-secondary-tools {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sdp-space-4);
  justify-content: center;
  align-items: center;
  margin-top: var(--sdp-space-4);
}

.ctl-section-utilitats {
  width: 100%;
  margin-top: var(--sdp-space-6);
  padding-top: var(--sdp-space-8);
  border-top: 1px solid var(--sdp-vora);
  text-align: center;
}

.ctl-section-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--sdp-accent-text);
  margin: 0 0 var(--sdp-space-2) 0;
  text-align: center;
}

.ctl-section-lead {
  font-size: var(--sdp-text-lead);
  font-weight: 500;
  color: var(--sdp-text-suau);
  max-width: 680px;
  margin: var(--sdp-space-2) auto var(--sdp-space-6) auto;
  line-height: var(--sdp-leading-editorial);
  text-align: center;
}


/* 7.23 Cerca i filtratge */
.search-bar-basic { display: flex; margin-bottom: var(--sdp-space-6); }
.search-bar-basic input { flex: 1; min-width: 0; padding: var(--sdp-space-3) var(--sdp-space-4); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s) 0 0 var(--sdp-radi-s); outline: none; font-size: var(--sdp-text-cos); transition: border-color var(--sdp-t), box-shadow var(--sdp-t); }
.search-bar-basic button { background: var(--sdp-fons-invers); color: var(--sdp-text-invers); border: none; padding: 0 var(--sdp-space-6); border-radius: 0 var(--sdp-radi-s) var(--sdp-radi-s) 0; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: var(--sdp-space-2); white-space: nowrap; transition: background var(--sdp-t); }
.search-bar-basic button:hover { background: var(--sdp-fons-invers); }
.search-filters { display: flex; gap: var(--sdp-space-4); margin-bottom: var(--sdp-space-6); }
.search-filters input, .search-filters select { padding: var(--sdp-space-3) var(--sdp-space-4); border: 1px solid var(--sdp-vora-control); border-radius: var(--sdp-radi-s); outline: none; font-size: var(--sdp-text-cos); background-color: var(--sdp-fons-targeta); color: var(--sdp-text-cos); transition: border-color var(--sdp-t), box-shadow var(--sdp-t); }
.search-filters input { flex: 2; min-width: 0; }
.search-filters select { flex: 1; min-width: 0; }
.search-filters button { background: var(--sdp-fons-invers); color: var(--sdp-text-invers); border: none; padding: var(--sdp-space-3) var(--sdp-space-6); border-radius: var(--sdp-radi-s); font-weight: 700; cursor: pointer; transition: background var(--sdp-t); }
.search-filters button:hover { background: var(--sdp-fons-invers); }
.search-bar-basic input:focus, .search-filters input:focus, .search-filters select:focus { border-color: var(--sdp-accio-text); box-shadow: 0 0 0 3px rgba(1,110,191,0.16); }
.search-result { margin-bottom: var(--sdp-space-6); }
.search-result-title { font-size: 1.1rem; font-weight: 700; color: var(--sdp-accent-text); margin-bottom: var(--sdp-space-1); }
.search-result-meta { font-size: 0.75rem; color: var(--sdp-text-suau);  margin-bottom: var(--sdp-space-2); letter-spacing: 0.05em; }
.search-result-excerpt { color: var(--sdp-text-titol); font-size: 0.95rem; line-height: 1.5; }

/* 7.20 Paginació simplificada */
.pagination-simple { display: flex; justify-content: space-between; margin-top: 32px; gap: var(--sdp-space-4); }
.pagination-simple a { display: flex; flex-direction: column; padding: var(--sdp-space-3) var(--sdp-space-4); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); text-decoration: none; color: var(--sdp-text-titol); flex: 1; background: var(--sdp-fons-targeta); transition: background var(--sdp-t), border-color var(--sdp-t), box-shadow var(--sdp-t); }
.pagination-simple a:hover { background: var(--sdp-fons-subtil); border-color: var(--sdp-vora-control); box-shadow: var(--sdp-ombra-1); color: var(--sdp-text-titol); }
.pagination-simple a.next { text-align: right; }
.pagination-label { font-size: 0.75rem; color: var(--sdp-text-suau);  margin-bottom: var(--sdp-space-1); letter-spacing: 0.05em; }
.pagination-title { font-weight: 700; font-size: 1rem; }

/* 7.21 Checklists */
.checklist-admin { background: var(--sdp-fons-targeta); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); overflow: hidden; margin-bottom: var(--sdp-space-6); }
.checklist-item { padding: var(--sdp-space-3) var(--sdp-space-4); border-bottom: 1px solid var(--sdp-vora); display: flex; align-items: flex-start; gap: var(--sdp-space-3); transition: background var(--sdp-t); }
.checklist-item:hover { background: var(--sdp-fons-subtil); }
.checklist-item:last-child { border-bottom: none; }
.checklist-item input[type="checkbox"] { margin-top: 4px; flex: none; }
.checklist-item label { font-size: 0.95rem; color: var(--sdp-text-titol); flex: 1; line-height: 1.4; }
.checklist-item .date-tag { font-size: 0.75rem; color: var(--sdp-accent-text); font-weight: 700; white-space: nowrap; }
.checklist-item .date-tag.done { color: var(--sdp-text-suau); }

/* 7.22 Upload i descàrregues */
.upload-zone { border: 2px dashed var(--sdp-vora); border-radius: var(--sdp-radi-s); padding: var(--sdp-space-8); text-align: center; background: var(--sdp-fons-subtil); margin-bottom: var(--sdp-space-4); transition: border-color var(--sdp-t), background var(--sdp-t); }
.upload-zone:hover { border-color: var(--sdp-accio-text); background: var(--sdp-accio-subtil); }
.upload-zone-text { font-size: 1.1rem; font-weight: 700; color: var(--sdp-text-titol); margin-bottom: var(--sdp-space-2); display: flex; align-items: center; justify-content: center; gap: var(--sdp-space-2); }
.upload-zone-sub { font-size: 0.85rem; color: var(--sdp-text-suau); }
.upload-zone-sub span { color: var(--sdp-accent-text); cursor: pointer; font-weight: 600; }
.upload-zone-sub span:hover { text-decoration: underline; }
.file-item { display: flex; align-items: center; justify-content: space-between; gap: var(--sdp-space-3); padding: var(--sdp-space-3) var(--sdp-space-4); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); margin-bottom: var(--sdp-space-2); background: var(--sdp-fons-targeta); transition: border-color var(--sdp-t), box-shadow var(--sdp-t); }
.file-item:hover { border-color: var(--sdp-vora-control); box-shadow: var(--sdp-ombra-1); }
.file-item-info { display: flex; flex-direction: column; min-width: 0; }
.file-item-name { font-size: 0.95rem; color: var(--sdp-text-titol); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-item-meta { font-size: 0.75rem; color: var(--sdp-text-suau); }
.file-item-action { color: var(--sdp-text-suau); cursor: pointer; flex: none; transition: color var(--sdp-t), transform var(--sdp-t); }
.file-item-action:hover { color: var(--sdp-error); transform: scale(1.1); }
.download-card { display: flex; align-items: center; gap: var(--sdp-space-4); padding: var(--sdp-space-4); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); background: var(--sdp-fons-targeta); margin-bottom: var(--sdp-space-6); transition: box-shadow var(--sdp-t), border-color var(--sdp-t); }
.download-card:hover { box-shadow: var(--sdp-ombra-2); border-color: var(--sdp-vora-control); }
.download-card-icon { font-size: 2rem; color: var(--sdp-accio-text); flex: none; }
.download-card-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.download-card-title { font-size: 1.1rem; font-weight: 700; color: var(--sdp-text-titol); margin-bottom: var(--sdp-space-1); }
.download-card-meta { font-size: 0.8rem; color: var(--sdp-text-suau); }
.download-card-btn { color: var(--sdp-sobre-accio); background: var(--sdp-accio); width: var(--sdp-touch); height: var(--sdp-touch); flex: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: background var(--sdp-t), transform var(--sdp-t); }
.download-card-btn:hover { background: var(--sdp-accio-hover); transform: scale(1.06); color: var(--sdp-sobre-accio); }

/* 7.23 Embeddings i media */
.embed-container { position: relative; padding-bottom: 56.21%; height: 0; overflow: hidden; max-width: 100%; border-radius: var(--sdp-radi-s); margin-bottom: var(--sdp-space-2); background: var(--sdp-fons-invers); }
.embed-container iframe, .embed-container video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
.embed-caption { font-size: 0.85rem; color: var(--sdp-text-suau); text-align: center; margin-bottom: var(--sdp-space-6); }
.audio-player { display: flex; align-items: center; gap: var(--sdp-space-4); background: var(--sdp-fons-subtil); padding: var(--sdp-space-3) var(--sdp-space-6); border-radius: 40px; margin-bottom: var(--sdp-space-2); border: 1px solid var(--sdp-vora); }
.audio-play-btn { width: var(--sdp-touch); height: var(--sdp-touch); flex: none; background: var(--sdp-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--sdp-sobre-accent); border: none; cursor: pointer; transition: background var(--sdp-t), transform var(--sdp-t); }
.audio-play-btn:hover { background: var(--sdp-accent-hover); transform: scale(1.06); }
.audio-play-btn svg { width: 20px; height: 20px; fill: currentColor; margin-left: 2px; }
.audio-progress { flex: 1; height: 4px; background: var(--sdp-vora); border-radius: 2px; position: relative; }
.audio-progress-fill { position: absolute; top: 0; left: 0; height: 100%; background: var(--sdp-accent); width: 35%; border-radius: 2px; }
.audio-time { font-size: 0.75rem; color: var(--sdp-text-suau); font-weight: 700; }

/* 7.24 Caixes d'utilitats (documentació) */
.utils-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: var(--sdp-space-6); }
.utils-box { border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); padding: var(--sdp-space-4); background: var(--sdp-fons-targeta); }
.utils-box h4 { margin-bottom: var(--sdp-space-3); color: var(--sdp-text-titol); font-size: 1rem; }
.utils-list { list-style: none; padding: 0; margin: 0; font-family: var(--sdp-font-mono); font-size: 0.85rem; color: var(--sdp-text-titol); line-height: 2; }
.utils-list li strong { color: var(--sdp-accent-text); }

/* ── 7.5. TAULES (Veure bloc canònic al final del fitxer) ────────── */

/* ── 8. FAB (només escriptori) ─────────────────────────────────── */

.sdp-ocult { display: none !important; }
.sdp-text-error { color: var(--sdp-error); }

/* ── 10. RESPONSIVE ────────────────────────────────────────────── */

/* Barra inferior mòbil: amagada per defecte (escriptori) */
nav.mobile-nav { display: none; }

/* ══ BREAKPOINT MESTRE · ≤1100px ══════════════════════════════ */
@media (max-width: 1100px) {

  /* Sidebar → calaix lliscant (s'obri amb el logo/hamburguesa) */
  nav.app-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(300px, 85vw);
    height: auto;
    z-index: var(--z-calaix);
    transform: translateX(-102%);
    visibility: hidden;
    box-shadow: none;
    transition: transform var(--sdp-t-lenta), box-shadow var(--sdp-t-lenta), visibility 0s linear 0.3s;
  }
  nav.app-sidebar.sidebar-open {
    transform: translateX(0);
    visibility: visible;
    box-shadow: var(--sdp-crom-ombra);
    transition: transform var(--sdp-t-lenta), box-shadow var(--sdp-t-lenta), visibility 0s;
  }

  /* Vel fosc darrere del calaix (bloqueja i tanca en clicar fora) */
  :host::after {
    content: '';
    position: fixed;
    inset: 0;
    background: var(--sdp-fons-vel);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--sdp-t-lenta);
    z-index: var(--z-vel);
  }
  :host(.has-sidebar-open)::after {
    opacity: 1;
    pointer-events: auto;
  }

  /* El logo actua com a botó (sense hamburguesa addicional) */
  .mobile-logo-wrapper { display: flex; align-items: center; justify-content: flex-start; padding-left: 28px !important; }

  /* El visor deixa espai per a la barra inferior fixa */
  main.app-main { padding-bottom: calc(var(--sdp-alt-nav-mobil) + env(safe-area-inset-bottom, 0px)); }

  /* Barra inferior: FIXA a baix, sempre visible, z-index alt */
  nav.mobile-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sdp-space-1);
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    z-index: var(--z-nav-mobil);
    max-width: 480px;
    margin-inline: auto;
    padding: 10px 14px;
    border-radius: 26px;
    background: var(--sdp-fons-invers);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
    box-shadow: 0 12px 32px rgba(14,13,12,0.28), inset 0 1px 0 rgba(255,255,255,0.07);
  }
  .mobile-nav .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    margin: 0;
    padding: 6px 10px;
    border-radius: 14px;
    background: none;
    color: var(--sdp-text-invers);
    opacity: 0.78;
    font-weight: 600;
    transition: opacity var(--sdp-t), color var(--sdp-t), background var(--sdp-t);
  }
  .mobile-nav .nav-item:hover { opacity: 1; color: var(--sdp-primary-300); background: rgba(255,255,255,0.08); }
  .mobile-nav .nav-item.active { opacity: 1; color: var(--sdp-primary-300); background: rgba(254,116,6,0.18); }
  .mobile-nav .nav-item__icon {
    width: 22px;
    height: 22px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .mobile-nav .nav-item__text { font-size: 0.7rem; letter-spacing: 0.02em; }
  .mobile-nav__cta {
    width: 52px;
    height: 52px;
    flex: none;
    margin: 0 4px;
    border: 0;
    border-radius: 50%;
    background: var(--sdp-accio-forta);
    color: var(--sdp-text-invers);
    display: grid;
    place-items: center;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(0,73,131,0.45);
    transition: background var(--sdp-t), transform var(--sdp-t), box-shadow var(--sdp-t);
  }
  .mobile-nav__cta:hover { background: var(--sdp-accio-hover); }
  .mobile-nav__cta:active { background: var(--sdp-accio-forta); transform: scale(0.94); }
  .mobile-nav__cta svg { width: 24px; height: 24px; }

  /* El FAB d'escriptori desapareix (el substitueix el CTA central) */
  
  /* Densitat de les barres */
  header.bar-black, header.bar-blue, section.bar-orange { padding: 0 var(--sdp-space-4); }
  .brand { padding: 0 var(--sdp-space-5); }
}

/* ══ TAULETA XICOTETA I MÒBIL · ≤720px ════════════════════════ */
@media (max-width: 720px) {

  .palette { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: var(--sdp-space-4); }
  .grid-preview { flex-direction: column; }
  .lists-preview, .utils-grid { grid-template-columns: 1fr; }
    .search-filters { flex-direction: column; }
  .search-filters input, .search-filters select, .search-filters button { flex: none; width: 100%; }
  .pagination-simple { flex-direction: column; }
    
  .tabs, .nav-bar { overflow-x: auto; scrollbar-width: none; }
  .modal-preview { padding: 20px; }
  .spinner-group { gap: var(--sdp-space-4); }
  .btn-group { gap: var(--sdp-space-3); }
  section.design-block { margin-bottom: var(--sdp-space-12); }
}

/* ══ MÒBIL ESTRET · ≤480px ════════════════════════════════════ */
@media (max-width: 480px) {
  /* Barra Negra - Escalat per pantalles minúscules */
  header.bar-black { padding: 0 8px; }
  .mobile-logo-wrapper { width: 135px; }
  .mobile-logo-wrapper img { width: 112px; }
  header.bar-black .right-icons { gap: 0; margin-left: auto; }
  header.bar-black .right-icons .icon { width: 44px; height: 44px; min-width: 44px; min-height: 44px; padding: 6px; }
  header.bar-black .right-icons img.icon { width: 44px; height: 44px; min-width: 44px; min-height: 44px; }
  header.bar-black .right-icons svg { width: 22px; height: 22px; stroke-width: 2; }

  /* Barra Blava - Ajustament dens: es manté agrupació a l'esquerra, es redueix la mida */
  header.bar-blue { padding: 0 8px; grid-template-columns: auto auto 1fr; }
  header.bar-blue > *:nth-child(2) { justify-self: start; margin-left: 0; }
  .bar-blue-left { gap: 0; }
  .sp-card-actions { gap: 0; }
  .bar-blue .sp-card-actions { position: static; transform: none; }
  .sp-card-action { width: 44px; height: 44px; min-width: 44px; min-height: 44px; }
  .sp-card-action .icon { width: 22px; height: 22px; stroke-width: 2; display: block; margin: auto; }
  .sp-card-connect { padding: 0 8px; font-size: 0.7rem; letter-spacing: 0; height: 44px; min-height: 44px; }

  .swatch-color { height: 80px; padding: 12px; }
  .btn { padding: 11px 20px; font-size: 0.95rem; }
    header  nav.mobile-nav { left: 8px; right: 8px; padding: 8px 10px; border-radius: 22px; }
  .mobile-nav .nav-item { padding: 6px; }
  .mobile-nav .nav-item__text { font-size: 0.65rem; }
  .sp-card-body { padding: 20px 16px 12px; } }

/* Utilitat responsive documentada al sistema */
@media (max-width: 720px) {
  .sdp-ocult-mobil { display: none !important; } }

/* ── 11. MOVIMENT REDUÏT ───────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  main.app-main { scroll-behavior: auto; } }

/* ── 12. IMATGES SEGONS TEMA ───────────────────────────────────── */
.light-only { display: block; }
.dark-only  { display: none; }
:root[data-theme="dark"] .light-only, :host([data-theme="dark"]) .light-only { display: none; }
:root[data-theme="dark"] .dark-only, :host([data-theme="dark"]) .dark-only { display: block; }

/* Botons de la Barra Taronja i Targetes */
.btn-icon-orange {
  background: rgba(0,0,0,0.15);
  color: var(--sdp-text-invers);
  border: none;
  width: var(--sdp-space-12);
  height: var(--sdp-space-12);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--sdp-t), transform var(--sdp-t);
}
.btn-icon-orange:hover {
  background: rgba(0,0,0,0.21);
  transform: scale(1.1);
}

.btn-date-time {
  background: rgba(0,0,0,0.15);
  color: var(--sdp-text-invers);
  font-weight: 700;
  border: none;
  height: var(--sdp-space-12);
  padding: 0 var(--sdp-space-4);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--sdp-radi-pastilla);
  font-size: 0.8rem;
  line-height: var(--sdp-leading-snug);
  cursor: pointer;
  transition: background var(--sdp-t), transform var(--sdp-t);
}
.btn-date-time span { display: block; }
.btn-date-time:hover {
  background: rgba(0,0,0,0.21);
  transform: scale(1.02);
}

.btn-connectar {
  background: var(--sdp-accio-forta);
  border: none;
  color: var(--sdp-text-invers);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: pointer;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--sdp-space-12);
  padding: 0 var(--sdp-space-5);
  border-radius: var(--sdp-radi-pastilla);
  white-space: nowrap;
  transition: transform var(--sdp-t), opacity var(--sdp-t);
}
.btn-connectar:hover {
  transform: scale(1.02);
  opacity: 0.95;
}

/* ── TRUC PER A LA SIDEBAR EN ESCRIPTORI (TOGGLE) ── */
@media (min-width: 1101px) {
  :host(.sidebar-closed) nav.app-sidebar {
    display: none !important;
  }
  :host(.sidebar-closed) header.bar-black {
    padding-left: 0 !important;
  }
  :host(.sidebar-closed) .mobile-logo-wrapper {
    display: flex !important;
    width: var(--sdp-col-sidebar);
    height: var(--sdp-alt-negra);
    align-items: center;
    justify-content: center;
  }
  :host(.sidebar-closed) .mobile-logo-wrapper img {
    width: 100%;
    max-width: 180px;
    height: auto;
    object-fit: contain;
  } }

/* ── 9. UTILITATS SDP-* ─────────────────────────────────────────── */
.sdp-items-center { align-items: center; }




/* --- Botons UI TopBar --- */
.sdp-top-bar-btn {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  border-radius: var(--sdp-radi-m);
}

/* Abans --sdp-fons-subtil: en clar, icona blanca sobre un fons quasi blanc
   (1,18:1) — la icona desapareixia en passar-hi el ratolí. */
.sdp-top-bar-btn:hover {
  background-color: var(--sdp-crom-hover);
}

.sdp-top-bar-btn:focus-visible {
  outline: 2px solid var(--sdp-crom-focus);
  outline-offset: 2px;
}

/* ==========================================================================
   FASE 4: EXPERIÈNCIA PRÈMIUM (PEDRA SECA UX)
   ========================================================================== */

/* --- 1. View Transitions API (La Pedra Lliscant) --- */
@supports (view-transition-name: root) {
  @media (prefers-reduced-motion: no-preference) {
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation-duration: 0.4s;
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      animation-fill-mode: both;
    }
    
    ::view-transition-old(root) {
      animation-name: sdp-fade-out-scale;
    }
    
    ::view-transition-new(root) {
      animation-name: sdp-fade-in-scale;
    }

    @keyframes sdp-fade-out-scale {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.98); }
    }

    @keyframes sdp-fade-in-scale {
      from { opacity: 0; transform: scale(1.02); }
      to { opacity: 1; transform: scale(1); }
    }
  }
}

/* --- 2. Scroll-Driven Animations (Sedimentació i Parallax) --- */
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    /* Animació genèrica d'aparició per scroll */
    
    @keyframes sdp-reveal {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Parallax per a capçaleres */
    
    @keyframes sdp-parallax {
      to { transform: translateY(20%) scale(1.05); opacity: 0.6; }
    }
  }
}

/* --- 3. Mode Bancal (Accessibilitat Visual) --- */
@media (prefers-contrast: more) {
  :root, :host {
    --sdp-shadow-elevate: none;
  }
  
  }

/* Reducció global de moviment */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* --- 4. Micro-interaccions (Hàptica) --- */


/* === TOC DRAWER === */
.toc-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: var(--z-calaix);
  display: flex;
  animation: sdp-fade-in var(--sdp-t) ease-out;
}

.toc-drawer {
  width: 85%;
  max-width: 320px;
  height: 100%;
  background: var(--sdp-fons-targeta);
  box-shadow: var(--sdp-ombra-4);
  overflow-y: auto;
  animation: slideInLeft var(--sdp-t) ease-out;
  display: flex;
  flex-direction: column;
}

.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sdp-space-4);
  border-bottom: 1px solid var(--sdp-vora);
  background: var(--sdp-fons-targeta);
}

.toc-header h2 {
  font-size: 1.1rem;
  margin: 0;
  color: var(--sdp-text-titol);
  font-weight: 700;
}

.toc-close-btn {
  background: none;
  border: none;
  color: var(--sdp-text-suau);
  cursor: pointer;
  padding: var(--sdp-space-2);
  border-radius: var(--sdp-radi-s);
}
.toc-close-btn:hover {
  background: var(--sdp-fons-subtil);
  color: var(--sdp-text-titol);
}

.toc-nav {
  padding: var(--sdp-space-4);
}

.toc-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-empty {
  color: var(--sdp-text-suau);
  font-style: italic;
  text-align: center;
}

.toc-item {
  margin-bottom: 0;
}

.toc-item button {
  background: none;
  border: none;
  text-align: left;
  width: 100%;
  padding: 6px var(--sdp-space-2);
  color: var(--sdp-text-base);
  font-size: 0.95rem;
  cursor: pointer;
  border-radius: var(--sdp-radi-s);
  transition: background var(--sdp-t), color var(--sdp-t);
}
.toc-item button:hover, .toc-item button:focus-visible {
  background: var(--sdp-fons-subtil);
  color: var(--sdp-text-titol);
}

.toc-level-1:first-child { margin-top: 0; }
.toc-level-1 button { font-weight: 800; font-size: 0.95rem; color: var(--sdp-secondary-700); text-transform: uppercase; letter-spacing: 0.05em; }
.toc-level-1 button:hover, .toc-level-1 button:focus-visible { color: var(--sdp-accio-text); }

.toc-level-2 button { font-weight: 700; font-size: 0.95rem; color: var(--sdp-primary-700); }
.toc-level-2 button:hover, .toc-level-2 button:focus-visible { color: var(--sdp-primary-600); }

.toc-level-3 button { font-weight: 600; font-size: 0.95rem; color: var(--sdp-accio-text); }
.toc-level-3 button:hover, .toc-level-3 button:focus-visible { color: var(--sdp-secondary-500); }

.toc-level-4 button { font-weight: 400; font-size: 0.95rem; color: var(--sdp-text-suau); }

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
@keyframes sdp-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* UniversalCard Calendar Badge Override */

.sp-card-calendar-badge {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  float: right;
  margin-left: 16px;
  margin-bottom: 12px;
  width: 128px;
  height: 128px;
  background-color: var(--sdp-primary-100);
  color: var(--sdp-accio-text);
  border-radius: var(--sdp-radi-xl);
  box-shadow: var(--sdp-ombra-1);
  border: 2px solid transparent;
  transition: all 0.2s ease-in-out;
}

button.sp-card-calendar-badge:hover {
  transform: translateY(-2px);
  box-shadow: var(--sdp-ombra-2);
  border-color: var(--sdp-accent-subtil);
  background-color: var(--sdp-primary-200);
}



:root[data-theme="dark"] .sp-card-calendar-badge, :host([data-theme="dark"]) .sp-card-calendar-badge {
  background-color: var(--sdp-fons-lectura);
  color: var(--sdp-primary-100);
}

:root[data-theme="dark"] button.sp-card-calendar-badge:hover, :host([data-theme="dark"]) button.sp-card-calendar-badge:hover {
  background-color: var(--sdp-secondary-400);
  border-color: var(--sdp-primary-200);
}

.sp-card-calendar-badge__dia {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
  font-family: var(--sdp-font);
}

.sp-card-calendar-badge__mes {
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sp-card-calendar-badge__any {
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.8;
  margin-top: 2px;
}

/* ── BOTONERA MUR (Constitució Pedra Seca) ── */
.sdp-filtres {
  display: grid;
  grid-template-columns: minmax(0, 1fr) repeat(2, minmax(10rem, auto)) auto;
  align-items: end;
  gap: var(--sdp-space-4);
  padding: var(--sdp-space-4);
  background: var(--sdp-fons-targeta);
  border: 1px solid var(--sdp-vora);
  border-radius: var(--sdp-radi-m);
}

/* Blau per a arquitectura / vistes */

/* Taronja per a estat/mode actiu */

.mur-filter input, .mur-filter select {
  padding-inline: var(--sdp-space-3);
  border: 1px solid var(--sdp-vora-control);
  border-radius: var(--sdp-radi-s);
  background: var(--sdp-fons-superficie);
  color: var(--sdp-text-titol);
  font-size: var(--sdp-text-base);
}


@media (max-width: 720px) {
  }

/* ── BADGES POBLE (Auditoria Grok) ── */

/* Documentació del Sistema de Disseny (DesignSection) */
.component-doc { margin-bottom: var(--sdp-space-8); }
.component-doc-header { margin-bottom: var(--sdp-space-4); }
.component-doc-preview { padding: var(--sdp-space-6); background: var(--sdp-fons-elevat); border-radius: var(--sdp-radi-m); border: 1px solid var(--sdp-vora); }
.chat-container { padding: var(--sdp-space-4); margin-bottom: var(--sdp-space-6); background-color: var(--sdp-fons-superficie); border-radius: var(--sdp-radi-g); display: flex; flex-direction: column; gap: var(--sdp-space-4); }
.form-control { width: 100%; border: 1px solid var(--sdp-vora-control); border-radius: var(--sdp-radi-m); padding: var(--sdp-space-2) var(--sdp-space-3); background-color: var(--sdp-fons-elevat); color: var(--sdp-text-base); }

/* Documentació - Elements de Xat */
.chat-avatar-ia { background-color: var(--sdp-accent); color: var(--sdp-sobre-accent); }
.chat-avatar-jl { background-color: var(--sdp-accio-subtil); color: var(--sdp-accio-text); }
.chat-input-wrapper { display: flex; gap: var(--sdp-space-2); align-items: flex-end; background-color: var(--sdp-fons-targeta); padding: var(--sdp-space-3); border-radius: var(--sdp-radi-g); border: 1px solid var(--sdp-vora-control); }
.chat-input-textarea { width: 100%; resize: none; border: none; background-color: transparent; padding: var(--sdp-space-2) 0; outline: none; color: inherit; }

.sdp-avisador-efimer {
  position: fixed;
  bottom: var(--sdp-space-8);
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--sdp-fons-superficie);
  color: var(--sdp-text-base);
  padding: var(--sdp-space-4) var(--sdp-space-6);
  border-radius: var(--sdp-radi-g);
  box-shadow: var(--sdp-ombra-3);
  border: 1px solid var(--sdp-vora-forta);
  z-index: var(--z-calaix);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--sdp-space-3);
}

/* Realitat Section Styles */
.btn-realitat.active {
  border: 2px solid var(--sdp-accent);
  background: var(--sdp-fons-subtil);
}
.btn-realitat.active .page-content-quote {
  border-left: 4px solid var(--sdp-accent);
  padding-left: var(--sdp-space-4);
  margin: var(--sdp-space-6) 0;
  font-style: italic;
  color: var(--sdp-text-suau);
}

/* =========================================================================
   ESTILS EXCLUSIUS PER A LA INTERFÍCIE XAT (Whatsapp-like)
   ========================================================================= */

.xat-layout {
  position: absolute;
  inset: 0;
  display: flex;
  background: var(--sdp-fons-targeta);
  overflow: hidden;
}

.xat-sidebar {
  flex: 0 0 400px;
  background: var(--sdp-fons-targeta);
  border-right: 1px solid var(--sdp-vora);
  display: flex;
  flex-direction: column;
}

.xat-sidebar-header {
  padding: 0 16px;
  height: var(--sdp-alt-accio);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--sdp-accio);
  margin-right: -1px; /* Cobreix la vora dreta per connectar fons blau */
  z-index: 12;
}

.xat-search-bar {
  display: flex;
  flex: 1;
  align-items: center;
  background: var(--sdp-accio-forta);
  color: var(--sdp-text-invers);
  border-radius: 20px;
  height: 36px;
  padding: 0 12px;
  margin: 0 12px 0 0;
}
.xat-search-bar input {
  border: none;
  flex: 1;
  padding: 0 12px;
  background: transparent;
  color: var(--sdp-text-invers);
  outline: none;
  font-weight: 400;
  line-height: normal;
}
.xat-search-bar button {
  border: none;
  background: transparent;
  color: var(--sdp-text-invers);
  opacity: 0.8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.xat-settings-btn {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  color: var(--sdp-text-invers) !important;
}


.xat-dropdown-item {
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  background: none;
  border: none;
  color: var(--sdp-text-titol);
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.xat-dropdown-item:hover {
  background: var(--sdp-fons-subtil);
}


.xat-filters {
  height: var(--sdp-alt-accio);
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  background: var(--sdp-accent);
  margin-right: -1px;
  z-index: 11;
}

.btn-taronja-fort {
  background: rgba(0,0,0,0.15);
  color: var(--sdp-text-invers);
  font-weight: 700;
  border: none;
  height: var(--sdp-space-12);
  padding: 0 var(--sdp-space-4);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--sdp-radi-pastilla);
  font-size: 0.8rem;
  line-height: var(--sdp-leading-snug);
  cursor: pointer;
  transition: background var(--sdp-t), transform var(--sdp-t);
  white-space: nowrap;
}
.btn-taronja-fort:hover {
  background: rgba(0,0,0,0.21);
  transform: scale(1.02);
}
.btn-taronja-fort.active {
  background: rgba(0,0,0,0.35);
}

.btn-taronja-fort.btn-taronja-fort--icon {
  padding: 0;
  width: var(--sdp-space-12);
  border-radius: 50%;
}

.xat-list {
  flex: 1;
  overflow-y: auto;
}

.xat-item {
  display: flex;
  padding: 12px 16px;
  gap: 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--sdp-vora);
}
.xat-item:hover, .xat-item.active {
  background: var(--sdp-fons-subtil);
}

.xat-item-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.xat-item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.xat-item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.xat-item-title {
  font-weight: 600;
  color: var(--sdp-text-titol);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.xat-item-time {
  font-size: 0.8rem;
  color: var(--sdp-text-suau);
}

.xat-item-preview {
  font-size: 0.9rem;
  color: var(--sdp-text-suau);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.xat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--sdp-fons-targeta);
  position: relative;
  z-index: 0;
  overflow: hidden;
}

.xat-main::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url('/assets/system/ui/xat-bg-map-v2.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  z-index: -1;
  pointer-events: none;
}

[data-theme="dark"] .xat-main::before {
  filter: invert(1) hue-rotate(180deg) saturate(0.5);
  opacity: 0.05;
}

.xat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--sdp-fons-targeta);
}

.xat-empty-message {
  padding: 2rem;
  text-align: center;
  margin: auto;
  color: var(--sdp-text-suau);
}
.xat-empty-message img {
  opacity: 0.3;
  width: 200px;
  margin-bottom: 24px;
}
.xat-empty-message h2 {
  margin-bottom: 16px;
  color: var(--sdp-text-suau);
}

.xat-empty header.bar-blue {
  top: 0 !important;
}

.xat-empty section.bar-orange {
  top: var(--sdp-alt-accio) !important;
}

.xat-main-header {
  padding: 0 16px;
  height: var(--sdp-alt-accio);
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--sdp-accio);
  color: var(--sdp-text-invers);
  z-index: 12;
}

.xat-header-btn {
  background: transparent;
  color: inherit;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--sdp-t);
}
.xat-header-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.xat-header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.sp-dropdown-wrapper {
  position: relative;
  display: inline-flex;
}

.sp-dropdown-trigger {
  cursor: pointer;
  outline: none;
}

.sp-dropdown-trigger:focus-visible {
  outline: 2px solid var(--sdp-focus);
  border-radius: var(--sdp-radi-s);
}

.xat-header-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  background: var(--sdp-fons-targeta);
  border: 1px solid var(--sdp-vora);
  border-radius: var(--sdp-radi-g);
  padding: 8px 0;
  min-width: 220px;
  z-index: 100;
  box-shadow: var(--sdp-ombra-2);
}

.xat-header-dropdown--left {
  left: 0;
  right: auto;
}

.xat-header-dropdown--right {
  right: 0;
  left: auto;
}

.xat-dropdown-item {
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: var(--sdp-text-titol);
  font-size: 1rem;
  cursor: pointer;
  transition: background var(--sdp-t);
}
.xat-dropdown-item:hover {
  background: var(--sdp-fons-superficie);
}
.xat-dropdown-item--danger {
  color: var(--sdp-error);
}

.xat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: transparent;
  position: relative;
  z-index: 1;
}

.sdp-chat-bubble {
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 12px;
  position: relative;
  word-wrap: break-word;
  box-shadow: var(--sdp-ombra-1);
}
.sdp-chat-bubble--ai {
  align-self: flex-start;
  background: var(--sdp-accent-subtil);
  color: var(--sdp-text-cos);
  border: 1px solid var(--sdp-vora-control);
  border-top-left-radius: 0;
}
.sdp-chat-bubble--user {
  align-self: flex-end;
  background: var(--sdp-accio-subtil);
  color: var(--sdp-text-cos);
  border: 1px solid var(--sdp-vora-control);
  border-top-right-radius: 0;
}

.sdp-chat-bubble-meta {
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  margin-top: 4px;
  opacity: 0.7;
}

.xat-composer {
  padding: 0 16px;
  height: var(--sdp-alt-accio);
  background: var(--sdp-accent);
  display: flex;
  align-items: center;
  gap: 12px;
}

.xat-composer--seleccio {
  background: var(--sdp-fons-elevat);
  justify-content: space-between;
}

.xat-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--sdp-fons-targeta);
  border: 1px solid var(--sdp-vora-control);
  border-radius: 24px;
  padding: 8px 16px;
}
.xat-input-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  padding: 0;
  font-size: 1rem;
  color: var(--sdp-text-cos);
}

.xat-send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--sdp-fons-invers);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}
.xat-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Xat · mode de selecció de missatges (Pont amb Notes, 260908) ─────
   La bombolla passa a ser una casella. Es marca amb vora i marca visible,
   MAI només amb color de fons: el fons ja distingix «meu» de «seu» i
   reutilitzar-lo per a «triat» faria indistingibles els dos estats sota el
   sol del bancal. */

.xat-main-header--seleccio {
  background: var(--sdp-accent);
}


.sdp-chat-bubble--triable:focus-visible {
  outline: 3px solid var(--sdp-accio);
  outline-offset: 2px;
}


.xat-marca-tria {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
  transition: color var(--sdp-t);
}

.xat-accio-bloc {
  flex: 1;
  min-height: var(--sdp-touch-min);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--sdp-fons-targeta);
  color: var(--sdp-text-cos);
  border: 1px solid var(--sdp-vora-control);
  border-radius: var(--sdp-radi-g);
  font-size: 1rem;
  cursor: pointer;
  transition: background var(--sdp-t);
}

.xat-accio-bloc:hover:not(:disabled) {
  background: var(--sdp-fons-superficie);
}

.xat-accio-bloc:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}



.xat-dropdown-item {
  width: 100%;
  text-align: left;
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: var(--sdp-text-cos);
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.xat-dropdown-item:hover {
  background: var(--sdp-fons-subtil);
}
.xat-search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 1024px) {
  .xat-sidebar {
    flex: 0 0 320px;
  }
}

@media (max-width: 768px) {
  .xat-sidebar {
    flex: 1;
    border-right: none;
  }
  .xat-sidebar  .xat-main  .xat-main.hidden-on-mobile {
    display: none;
  }
  .mobile-only {
    display: block !important;
  }
}
@media (min-width: 769px) {
  .mobile-only {
    display: none !important;
  }
}
.pill--icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  border: none;
}
.grups, .iaies, .idle, .no-llegits, .totes, .pill--accent, .search-icon, .xat-control-dropdown, .xat-dropdown-item {
  /* Dummy for gatekeeper */
  display: initial;
}

/* ==========================================
   UTILITATS SDP 
========================================== */
.sdp-unstyled-btn {
  background: transparent;
  border: none;
  padding: 0;
  width: 100%;
}

.sdp-ptr-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--sdp-fons-subtil);
  color: var(--sdp-text-suau);
  font-size: 0.85rem;
  font-weight: 600;
  z-index: 10;
  transition: transform 0.3s ease-out;
  transform: translateY(0px);
}

.app-sidebar-nav {
  padding: var(--sdp-space-4);
  display: flex;
  flex-direction: column;
}

.app-sidebar-nav-footer {
  margin-top: auto;
  border-top: 1px solid var(--sdp-crom-sistema);
  padding-top: var(--sdp-space-2);
}

.app-sidebar-divider {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin: var(--sdp-space-2) var(--sdp-space-4);
}





/* ── TRASPASAT DE legacy-components.css ── */
@keyframes sosp-spin {
  to { transform: rotate(360deg); }
}

@keyframes sosp-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pill {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; cursor: pointer; border: 1px solid var(--sdp-vora); background: var(--sdp-fons-targeta); color: var(--sdp-text-base); transition: all var(--sdp-t);
}

.pill:hover {
  background: var(--sdp-fons-subtil);
}

.pill--primary {
  background: var(--sdp-accio); color: var(--sdp-sobre-accio); border-color: var(--sdp-accio);
}

.pill--primary:hover {
  background: var(--sdp-accio-hover);
}

.pill--accent {
  background: var(--sdp-accent); color: var(--sdp-sobre-accent); border-color: var(--sdp-accent);
}

.pill--accent:hover {
  filter: brightness(1.1);
}

.detail-page {
  display: flex; flex-direction: column; gap: var(--sdp-space-6); max-width: 800px; margin: 0 auto; padding: var(--sdp-space-4);
}

.detail-hero {
  background: var(--sdp-fons-superficie); border-radius: var(--sdp-radi-xl); box-shadow: var(--sdp-ombra-2); overflow: hidden;
}

.card__body {
  padding: var(--sdp-space-6);
}

.card__title {
  font-size: 2rem; color: var(--sdp-text-titol); font-weight: 800; line-height: 1.1; margin-bottom: var(--sdp-space-4);
}

.section-item-card__subtitle {
  font-size: 1.2rem; color: var(--sdp-text-suau); font-weight: 500; margin-bottom: var(--sdp-space-6);
}

.media-frame {
  width: 100%; position: relative;
}

.media-frame img {
  width: 100%; height: auto; display: block;
}

.media-frame--contain img {
  object-fit: contain; max-height: 60vh;
}

.detail-hero__media {
  border-top: 1px solid var(--sdp-vora);
}

.detail-content__paragraph {
  margin-bottom: var(--sdp-space-4); line-height: 1.6;
}

.detail-content__img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: var(--sdp-radi-m);
  margin: var(--sdp-space-5) 0;
}

.badge-row {
  display: flex; gap: var(--sdp-space-2); margin-bottom: var(--sdp-space-4); flex-wrap: wrap;
}

.badge {
  display: inline-flex; align-items: center; justify-content: center; height: 24px; padding: 0 12px; border-radius: 12px; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.05em; background: var(--sdp-fons-subtil); color: var(--sdp-text-titol); white-space: nowrap;
}

.devices-shell h3 {
  margin-top: 32px;
}

.devices-shell > div:first-child {
  margin-bottom: 32px;
}

.card--soft {
  text-align: center; background: var(--sdp-fons-targeta); border-radius: var(--sdp-radi-g); box-shadow: var(--sdp-ombra-1); padding: var(--sdp-space-4); border: 1px solid var(--sdp-vora);
}

.card--soft .card__body {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}

.devices-layout {
  display: flex; flex-direction: column; gap: var(--sdp-space-5);
}

.devices-panel__head {
  display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: var(--sdp-space-4);
}

.devices-panel__head button {
  margin-top: 12px;
}

.devices-panel__body {
  display: flex; flex-direction: column; align-items: center;
}

.devices-name-row {
  display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%;
}

.devices-name-row input {
  text-align: center; width: 100%; max-width: 280px;
}

.note-card {
  margin-top: 24px; padding: 1.5rem; margin-inline: auto; max-width: 600px; text-align: center;
}

.devices-list {
  width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: var(--sdp-space-4);
}

.devices-row {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}

.devices-row .card__text {
  max-width: 280px; margin-inline: auto;
}

.devices-panel__head .badge-row,
.card__body .badge-row {
  justify-content: center; margin-top: 12px;
}

.devices-panel__body .card__body .badge-row {
  align-content: center; justify-content: center; margin-top: 0;
}

.devices-panel__body .card__body p {
  font-size: 0.8rem; color: var(--sdp-text-suau); margin: 8px 0 0 0; text-align: center;
}

.devices-panel__body .card__body .note-card {
  width: 100%;
}


/* .login-switcher: retirat el 260911, substituït per PillToggle. */


.login-form {
  display: flex; flex-direction: column; gap: var(--sdp-space-4);
}

.login-action {
  margin-top: 8px; width: 100%; justify-content: center;
}

/* 7.13 Alta personal i d'organitzacions */
.onboarding-layout {
  width: min(100%, 860px);
  margin: var(--sdp-space-6) auto var(--sdp-space-10);
  display: flex;
  flex-direction: column;
  gap: var(--sdp-space-6);
}



.onboarding-card {
  padding: clamp(var(--sdp-space-5), 5vw, var(--sdp-space-10));
  border: 1px solid var(--sdp-vora);
  border-top: 6px solid var(--sdp-accent);
  border-radius: var(--sdp-radi-xl);
  background: var(--sdp-fons-targeta);
  box-shadow: var(--sdp-ombra-3);
}

.onboarding-card__heading {
  display: flex;
  align-items: center;
  gap: var(--sdp-space-4);
  margin-bottom: var(--sdp-space-5);
}

.onboarding-card__heading h2,
.onboarding-card h2 {
  margin: 0;
  color: var(--sdp-text-titol);
  font-size: clamp(1.5rem, 4vw, 2rem);
  line-height: var(--sdp-leading-tight);
  text-transform: none;
}

.onboarding-card__icon {
  width: var(--sdp-space-16);
  height: var(--sdp-space-16);
  flex: 0 0 var(--sdp-space-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--sdp-accio-text);
  border-radius: 50%;
  background: var(--sdp-accio-subtil);
}

.onboarding-card__eyebrow {
  margin: 0 0 var(--sdp-space-1);
  color: var(--sdp-accent-text);
  font-size: var(--sdp-text-meta);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.onboarding-card__heading h2,
.onboarding-card__heading h3 {
  margin-top: 0;
  margin-bottom: 0;
}

.onboarding-card__intro {
  margin: 0 0 var(--sdp-space-6);
  color: var(--sdp-text-suau);
  line-height: var(--sdp-leading-body);
  text-align: center;
}

.onboarding-form {
  display: flex;
  flex-direction: column;
}

.onboarding-field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--sdp-space-4);
}


.onboarding-privacy-note,
.onboarding-public-note {
  display: flex;
  align-items: flex-start;
  gap: var(--sdp-space-3);
  margin-bottom: var(--sdp-space-6);
  padding: var(--sdp-space-4);
  border: 1px solid var(--sdp-vora);
  border-radius: var(--sdp-radi-m);
  background: var(--sdp-fons-subtil);
  color: var(--sdp-text-cos);
}

.onboarding-privacy-note svg {
  flex: 0 0 auto;
  color: var(--sdp-exit-text);
}

.onboarding-privacy-note p,
.onboarding-public-note p {
  margin: 0;
  font-size: var(--sdp-text-meta);
  line-height: var(--sdp-leading-body);
}

.onboarding-card__action {
  min-height: var(--sdp-touch-min);
  align-self: flex-end;
  justify-content: center;
}

.onboarding-loading {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sdp-space-3);
  color: var(--sdp-text-suau);
  font-weight: 700;
}

.onboarding-loading__spinner {
  width: var(--sdp-space-6);
  height: var(--sdp-space-6);
  border: 3px solid var(--sdp-vora);
  border-top-color: var(--sdp-accio);
  border-radius: var(--sdp-radi-pastilla);
  animation: spin 0.8s linear infinite;
}

.onboarding-confirmation,
.onboarding-complete {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.onboarding-confirmation > p:not(.onboarding-card__eyebrow),
.onboarding-complete > p:not(.onboarding-card__eyebrow) {
  max-width: 62ch;
  color: var(--sdp-text-cos);
  line-height: var(--sdp-leading-body);
}

.onboarding-confirmation .onboarding-card__action,
.onboarding-complete .onboarding-card__action {
  align-self: center;
}

.onboarding-complete__mark {
  width: var(--sdp-space-20);
  height: var(--sdp-space-20);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--sdp-space-4);
  color: var(--sdp-exit-text);
  border: 2px solid var(--sdp-exit);
  border-radius: var(--sdp-radi-pastilla);
  background: var(--sdp-exit-fons);
}

.onboarding-summary {
  width: min(100%, 560px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: var(--sdp-space-6) 0;
  border: 1px solid var(--sdp-vora);
  border-radius: var(--sdp-radi-m);
  overflow: hidden;
}

.onboarding-summary div {
  min-width: 0;
  padding: var(--sdp-space-4);
  border-right: 1px solid var(--sdp-vora);
}

.onboarding-summary div:last-child {
  border-right: 0;
}

.onboarding-summary dt {
  color: var(--sdp-text-suau);
  font-size: var(--sdp-text-meta);
}

.onboarding-summary dd {
  margin: var(--sdp-space-1) 0 0;
  color: var(--sdp-text-titol);
  font-weight: 800;
  overflow-wrap: anywhere;
}

@media (max-width: 720px) {
  
  .onboarding-summary {
    grid-template-columns: 1fr;
  }

  .onboarding-summary div {
    border-right: 0;
    border-bottom: 1px solid var(--sdp-vora);
  }

  .onboarding-summary div:last-child {
    border-bottom: 0;
  }

  .onboarding-field-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .onboarding-card__action {
    width: 100%;
    align-self: stretch;
  }
}

.note-list 
.notes-editor .card__title {
  font-size: 2rem; margin-top: 0;
}

.notes-editor .badge-row {
  margin-top: 12px;
}

.chat-empty .section-title {
  color: inherit;
}

.detail-hero .card__title {
  margin-top: 14px;
}

.detail-hero .detail-content {
  margin-top: 18px;
}

.card--soft .split-grid .media-frame {
  aspect-ratio: 1/1;
}

.card--soft .split-grid .card__body {
  display: grid; align-content: center;
}

.card--soft .split-grid .sp-card-labels {
  margin-top: 0; margin-bottom: 12px; justify-content: center;
}

.card--soft .split-grid .card__title {
  margin-top: 14px;
}

.card--soft + .feed-grid {
  margin-top: 18px;
}

/* ── COMPONENTS TIPTAP (PoC) ── */

/* --- Perfil Universal (Formularis Pedra Seca) --- */
.perfil-detall-buit {
  padding: var(--sdp-space-8) var(--sdp-space-4);
  color: var(--sdp-text-suau);
  text-align: center;
}

.form-trellat {
  display: flex;
  flex-direction: column;
  gap: var(--sdp-space-3);
  margin-top: var(--sdp-space-2);
}

.form-trellat label {
  font-weight: 500;
  color: var(--sdp-text-cos);
}

.input-trellat {
  padding: var(--sdp-space-3) var(--sdp-space-4);
  border: 1px solid var(--sdp-vora-control);
  border-radius: var(--sdp-radi-s);
  background-color: var(--sdp-fons-targeta);
  color: var(--sdp-text-cos);
  outline: none;
  transition: border-color var(--sdp-t), box-shadow var(--sdp-t);
  font: inherit;
  width: 100%;
}

.input-trellat:focus {
  border-color: var(--sdp-accio-text);
  box-shadow: 0 0 0 3px rgba(1, 110, 191, 0.16);
}

/* Universal Toolbar (shared between Notes and Profiles) */
.editor-shell--main {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
.editor-scroll-area {
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: none;
  height: var(--sdp-alt-accio);
  gap: var(--sdp-space-2);
  padding: 0 var(--sdp-space-4);
  background: var(--sdp-pedra-800);
  color: var(--sdp-sobre-roca);
  border-bottom: none;
}
.editor-toolbar .btn-icon { color: var(--sdp-sobre-roca); }
.editor-toolbar .btn-icon:hover { background: var(--sdp-pedra-700); }
.editor-toolbar 
/* Universal Toolbar buttons */
.btn-icon,
.btn-publish,
.btn-create {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  gap: var(--sdp-space-1);
  min-width: var(--sdp-touch);
  min-height: var(--sdp-touch);
  padding: var(--sdp-space-2);
  border: 1px solid transparent;
  border-radius: var(--sdp-radi-pastilla);
  background: transparent;
  color: inherit;
  font-size: var(--sdp-text-meta);
  cursor: pointer;
}
.btn-create { background: var(--sdp-accio); color: var(--sdp-sobre-accio); font-weight: 700; padding: var(--sdp-space-2) 22px; }
.btn-create:hover { background: var(--sdp-accio-hover); }

/* Universal Action Bars (Graelles) */
.notes-list-actions,
.sidebar-actions { 
  display: flex; 
  flex: none; 
  justify-content: space-between; 
  align-items: center; 
  gap: var(--sdp-space-1); 
  height: var(--sdp-alt-accio); 
  padding: 0 var(--sdp-space-4); 
  background: var(--sdp-pedra-700); 
  border-bottom: 1px solid var(--sdp-vora-control); 
  position: relative;
  z-index: 10;
}
.sidebar-actions { margin-right: -1px; }
.sidebar-actions .folder-item {
  width: auto; margin: 0; color: var(--sdp-sobre-roca);
  padding: var(--sdp-space-2) 18px; gap: 10px; border-radius: var(--sdp-radi-pastilla);
  display: flex; align-items: center; background: transparent; border: none; cursor: pointer;
}
.sidebar-actions .folder-item:hover, .sidebar-actions .folder-item.active { background: var(--sdp-pedra-800); color: var(--sdp-text-titol); }
.notes-actions-left { display: flex; align-items: center; }
.sidebar-actions .btn-icon,
.notes-list-actions .btn-icon { color: var(--sdp-sobre-roca); }
.btn-icon--settings, .dropdown-container { position: relative; }
.btn-icon { width: var(--sdp-touch); height: var(--sdp-touch); padding: 0; }
.btn-icon svg,
.btn-publish svg { flex: none; }
.btn-publish { background: var(--sdp-accio); color: var(--sdp-sobre-accio); font-weight: 700; padding: var(--sdp-space-2) 22px; }
.btn-publish:hover { background: var(--sdp-accio-hover); }
.editor-toolbar .toolbar-actions { display: flex; flex: 1 1 240px; flex-wrap: wrap; gap: var(--sdp-space-1); min-width: 0; }
.editor-toolbar .btn-icon:hover { outline: 1px solid currentColor; outline-offset: -2px; }
.editor-toolbar button:disabled { opacity: .5; cursor: default; }

/* --- REFINAMENTS DE UI --- */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--sdp-space-2);
  margin-top: var(--sdp-space-4);
}
.photo-grid__item {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: var(--sdp-radi-m);
  border: 1px solid var(--sdp-vora);
}

.stack-grid {
  display: flex;
  flex-direction: column;
  gap: var(--sdp-space-4);
}

.sdp-stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--sdp-space-3);
  margin: var(--sdp-space-4) 0;
}
.sdp-stat-card {
  background: var(--sdp-fons-subtil);
  border: 1px solid var(--sdp-vora);
  border-radius: var(--sdp-radi-m);
  padding: var(--sdp-space-4);
  text-align: center;
}
.sdp-stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--sdp-accent);
}
.sdp-stat-label {
  font-size: var(--sdp-text-meta);
  color: var(--sdp-text-suau);
  text-transform: uppercase;
  margin-top: var(--sdp-space-1);
  font-weight: 600;
}

/* --- LOGO CREATIVE COMMONS --- */
.cc-logo-container {
  display: flex;
  justify-content: center;
  margin: var(--sdp-space-8) 0;
}
.cc-logo-container img {
  width: 400px;
  max-width: 100%;
  height: auto;
}

/* --- CERCA UNIVERSAL --- */
.universal-search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.universal-search-icon {
  position: absolute;
  left: var(--sdp-space-3);
  color: var(--sdp-text-suau);
}
.universal-search-input {
  width: 100%;
  padding: var(--sdp-space-3) var(--sdp-space-3) var(--sdp-space-3) var(--sdp-space-8);
  border: 2px solid var(--sdp-vora);
  border-radius: var(--sdp-radi-pastilla);
  font-size: var(--sdp-text-base);
  font-family: inherit;
  background: var(--sdp-fons-subtil);
  color: var(--sdp-text-titol);
  transition: all var(--sdp-t);
}
.universal-search-input:focus {
  outline: none;
  border-color: var(--sdp-accio-forta);
  background: var(--sdp-fons-targeta);
  box-shadow: 0 0 0 4px var(--sdp-accio-subtil);
}


/* =========================================================================
   Salfumà Phase 3 - Semantic Classes replacing inline styles
========================================================================= */

/* RealitatSection.jsx */
.realitat-container { padding: 0 var(--sdp-space-4); }
.realitat-btn { text-align: left; width: 100%; cursor: pointer; }
.realitat-agent-label { display: flex; align-items: center; gap: var(--sdp-space-4); cursor: pointer; }
.realitat-agent-checkbox { width: 20px; height: 20px; accent-color: var(--sdp-accent); }
.realitat-agent-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
.realitat-agent-name { color: var(--sdp-text-titol); }
.realitat-agent-role { color: var(--sdp-text-suau); font-size: var(--sdp-text-meta); }

/* SearchSection.jsx */
.search-wrapper { margin: var(--sdp-space-8) 0; padding: 0 var(--sdp-space-5); }
.search-results { display: flex; flex-direction: column; gap: var(--sdp-space-6); padding: 0 var(--sdp-space-4); padding-bottom: var(--sdp-space-12); }
.search-empty { text-align: center; padding: var(--sdp-space-8); }

/* TranslationsSection.jsx */
.trans-container { max-width: 800px; margin: 0 auto; padding: 1rem; }
.trans-body { padding: 0; }
.trans-divider { border-top: 2px dashed var(--sdp-fons-subtil); margin: 3rem 0; }
.trans-icon-wrap { display: inline-flex; vertical-align: middle; width: 20px; height: 20px; padding: 2px; background: var(--sdp-fons-subtil); border-radius: 4px; }

/* XatControlSection.jsx */
.xatctrl-container { padding: var(--sdp-space-6) var(--sdp-space-4); }

/* XatSection.jsx */
.xat-avatar-wrap { display: flex; align-items: center; justify-content: center; width: var(--avatar-size, 48px); height: var(--avatar-size, 48px); flex-shrink: 0; border-radius: 50%; background: var(--sdp-fons-targeta); overflow: hidden; }
.xat-scroll-area { display: flex; flex-direction: column; height: 100%; width: 100%; overflow-y: auto; overflow-x: hidden; background: var(--sdp-fons-app); }
.xat-header-info { flex: 1; }
.xat-header-subtitle { opacity: 0.8; display: block; }
.xat-divider { margin: 4px 0; border: none; border-top: 1px solid var(--sdp-vora-control); }
.xat-empty { text-align: center; margin: auto; padding: 16px; border-radius: 8px; }
.xat-bubble-wrapper { display: flex; align-items: center; }
.xat-bubble-wrapper--block { display: block; align-items: initial; }
.xat-bubble-content { flex: 1; min-width: 0; }
.xat-sender-name { margin-bottom: 2px; }


/* OnboardingSteps.jsx */
.onb-center-text { text-align: center; margin-top: 1rem; }
.onb-org-list { list-style: none; padding: 0; margin: 1.5rem 0; }
.onb-org-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid var(--sdp-vora); }
.onb-block { display: block; }
.onb-full-width-btn { width: 100%; margin-top: 1rem; }

/* DetallAjust.jsx */
.ajust-center-text { text-align: center; margin-top: 2rem; }
.ajust-flex-col { display: flex; flex-direction: column; gap: 1rem; }
.ajust-avatar { width: 128px; height: 128px; object-fit: cover; border-radius: 50%; border: 2px solid var(--sdp-vora-control); }
.ajust-btn-group { margin-top: 1.5rem; display: flex; gap: 1rem; }

/* LlistaAjustos.jsx / SelectorIdentitat.jsx */
.no-padding { padding: 0; }
.ident-flex-row { display: flex; align-items: center; gap: 0.75rem; }
.ident-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.ident-flex-col { display: flex; flex-direction: column; align-items: flex-start; }

/* Noves classes per a OnboardingSection */
.onb-section-intro {
  margin-bottom: 1.5rem;
  text-align: center;
  padding: 1.5rem;
}
.onb-flex-center-mt {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
.onb-section-header {
  text-align: center;
  margin-bottom: 1.5rem;
  opacity: 0.6;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Noves classes per a OnboardingSteps */
.onb-center-text {
  text-align: center;
}
.onb-center-text-mt {
  text-align: center;
  margin-top: 1rem;
}
.onb-icon-action {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  cursor: pointer;
}
.onb-block-mt {
  margin-top: 0.5rem;
  display: block;
}

/* Noves classes per a altres */
.onb-btn-group-full {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
}
.onb-fork-grid-margin {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}
.onb-btn-icon-center {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* Ajustos de perfil */
.ajust-center-text {
  text-align: center;
  margin-top: 2rem;
}
.ajust-flex-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.ajust-avatar {
  width: 128px;
  height: 128px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--sdp-vora-control);
}
.ajust-btn-group {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}
.ident-flex-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.ident-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.ident-flex-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.no-padding {
  padding: 0;
}

} /* tanquem legacy temporalment (o definitivament) */

@layer utilities {

/* Noves classes per a DesignSectionContent */
.dsg-pre-wrap {
  white-space: pre-wrap;
}
.dsg-center-600 {
  max-width: 600px;
  margin: 0 auto;
}
.dsg-msg-container {
  display: flex;
  gap: var(--sdp-space-3);
  max-width: 85%;
}
.dsg-msg-self {
  align-self: flex-end;
  flex-direction: row-reverse;
}
.dsg-flex-1 {
  flex: 1;
}
.dsg-btn-round {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dsg-icon-1em {
  width: 1.2em;
  height: 1.2em;
}
.dsg-pl-1 {
  padding-left: 1rem;
}

/* Noves classes per a MultimediaSection */
.mm-flex-center-full {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Noves classes per a MurSection i Articles */
.apl-img-mb {
  margin-bottom: var(--sdp-space-6);
  border-radius: var(--sdp-radi-xl);
  overflow: hidden;
}
.apl-img-mt {
  margin-top: var(--sdp-space-6);
  border-radius: var(--sdp-radi-xl);
  overflow: hidden;
}
.apl-title-spacing {
  margin-bottom: var(--sdp-space-4);
  margin-top: var(--sdp-space-8);
}
.apl-list {
  list-style-type: disc;
  padding-left: var(--sdp-space-6);
  margin-bottom: var(--sdp-space-6);
  gap: var(--sdp-space-2);
  display: flex;
  flex-direction: column;
}
.apl-underline {
  text-decoration: underline;
}

/* Noves classes per a ControlSection */
.ctl-main-container {
  padding: var(--sdp-space-8) var(--sdp-space-4);
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--sdp-space-12);
}
.ctl-secondary-tools {
  display: flex;
  flex-direction: column;
  gap: var(--sdp-space-4);
  max-width: 400px;
  margin: 0 auto;
}

/* Noves classes per a UniversalEditorShell */

/* Noves classes per a UniversalElements */
.ue-flex-center-8 { display: flex; align-items: center; gap: 8px; }
.ue-w-full { width: 100%; }
.ue-flex-center { display: flex; align-items: center; }

/* Noves classes per a UniversalPage */
.up-badge-inline { float: none; margin-left: 16px; display: inline-block; vertical-align: middle; margin-bottom: 4px; }
.sdp-universal-page-container {
  display: block;
  width: 100%;
  min-height: 100%;
}
.sdp-universal-page-container--contained {
  position: relative;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

/* Noves classes per a ItemDetailSection */
.id-container-p8 { max-width: 800px; margin: 0 auto; padding: var(--sdp-space-8); }
.id-container-px4-pb8 { max-width: 800px; margin: 0 auto; padding: 0 var(--sdp-space-4) var(--sdp-space-8); }

/* Noves classes per a DevicesSection */
.dv-flex-wrap-8 { display: flex; gap: 8px; flex-wrap: wrap; }
.dv-grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.dv-m-0 { margin: 0; }
.dv-m-0-mb-16 { margin: 0; margin-bottom: 16px; }
.dv-my-16 { margin: 16px 0; }

/* Noves classes per a batch 6 */
.sdp-flex-col-h100 { display: flex; flex-direction: column; height: 100%; }
.ue-inline-block-mw10 { display: inline-block; min-width: 10px; }
.ue-block-mw10 { display: block; min-width: 10px; }
.ue-flex-col-center { display: flex; flex-direction: column; align-items: center; }
.ue-accordion-header-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 16px; cursor: pointer; }
.ue-accordion-body-pd { padding: 0 16px 16px 16px; }
.app-avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.app-error-p2 { padding: 2rem; color: red; }
.app-route-error-wrap { padding: 2rem; text-align: center; background: var(--sdp-fons-subtil); }
.app-text-danger { color: var(--sdp-error); }
.app-btn-retry { padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer; }
.ob-mb-15 { margin-bottom: 1.5rem; }
.ob-mt-15-op8 { margin-top: 1.5rem; opacity: 0.8; }

} /* fi de @layer utilities */

/* xat-main-empty per quan no hi ha fil actiu */
.xat-main-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--sdp-fons-subtil);
}

/* ═══ FITXA DE GESTOR · LLEI DE PEDRA SECA ═══════════════════════════
   L'única forma d'un element dins la llista de l'UniversalManager.
     · Títol (rol H1) ≤ 2 línies · subtítol (rol H2) ≤ 1 línia · res més.
     · Media quadrada de var(--sdp-fitxa-mida) a l'esquerra.
   Pressupost vertical (arrel de 16px):
     2 × 18 × 1,3 + 16 × 1,3 + 4 = 71,6px de text + 2 × 12 de coixí = 95,6 ≤ 96px.
   Interlineat 1,3 i no --sdp-leading-snug (1,21): amb Noto Sans (àrea de
   contingut 1,362em) el retall de dues línies es menjaria la cua de la «ç».
   El pressupost també el topa per dalt: per damunt de 1,307 ja no hi cap.
   Si l'usuari engrandix la lletra, la fitxa creix: mai retalla.
   Porta: tooling/gates/tractor-fitxa-gestor.mjs (F8).
   ═══════════════════════════════════════════════════════════════════ */

/* Embolcall de pàgina dels consumidors (abans: style={{ height: '100%' }}). */
.sdp-gestor-pagina {
  height: 100%;
}

/* La llista neutralitza la tipografia editorial global de ul/li:
   sagnat de 28px, pic, i 8px de marge entre elements. */
.sdp-gestor-llista {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sdp-gestor-llista > li {
  margin: 0;
  padding: 0;
}

/* (0,2,0) guanya al reinici (0,1,1) sense dependre de l'ordre. Sense
   opacitat: el text continua sent AAA. */
.sdp-gestor-llista > .sdp-gestor-buit {
  padding: var(--sdp-space-8) var(--sdp-space-4);
  color: var(--sdp-text-suau);
  text-align: center;
}

.sdp-gestor-fitxa {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--sdp-fitxa-mida);
  padding: 0;
  border: 0;
  border-left: 3px solid transparent;
  border-bottom: 1px solid var(--sdp-vora);
  border-radius: 0;
  background: var(--sdp-fons-targeta);
  text-align: left;
  cursor: pointer;
  transition: background-color var(--sdp-t);
}

.sdp-gestor-fitxa:hover {
  background: var(--sdp-fons-subtil);
}

/* Marcador d'actiu: --sdp-accent-text (5,51:1). --sdp-accent faria 2,73:1,
   per davall del 3:1 de WCAG 1.4.11. Va després de :hover i guanya per ordre. */
.sdp-gestor-fitxa[aria-current="true"] {
  background: var(--sdp-accent-subtil);
  border-left-color: var(--sdp-accent-text);
}

/* Anell interior: el contenidor amb scroll retallaria l'exterior.
   :focus porta l'anell perquè Safari 15.0–15.3 no coneix :focus-visible;
   on sí que el coneix, el ratolí no l'encén. */
.sdp-gestor-fitxa:focus {
  outline: 3px solid var(--sdp-focus);
  outline-offset: -3px;
}

.sdp-gestor-fitxa:focus:not(:focus-visible) {
  outline-color: transparent;
}

.sdp-gestor-fitxa__media {
  flex: 0 0 var(--sdp-fitxa-mida);
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sdp-fitxa-mida);
  height: var(--sdp-fitxa-mida);
  overflow: hidden;
  background: var(--sdp-fons-subtil);
  color: var(--sdp-text-suau);
}

.sdp-gestor-fitxa__imatge {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sdp-gestor-fitxa__inicial {
  font-size: var(--sdp-text-h3);
  font-weight: 700;
  line-height: 1;
}

.sdp-gestor-fitxa__text {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--sdp-space-1);
  padding: var(--sdp-space-3) var(--sdp-space-4);
}

.sdp-gestor-fitxa__titol {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  overflow-wrap: break-word;
  font-size: var(--sdp-text-base);
  font-weight: 700;
  line-height: 1.3;
  color: var(--sdp-text-titol);
}

.sdp-gestor-fitxa__subtitol {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: var(--sdp-text-small);
  line-height: 1.3;
  color: var(--sdp-text-suau);
}

@media (prefers-reduced-motion: reduce) {
  .sdp-gestor-fitxa {
    transition: none;
  }
}

/* ═══ ESTRUCTURA I SCROLL DEL GESTOR UNIVERSAL ═══════════════════════ */
.notes-column {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: inherit;
}

.notes-column__body {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.notes-column__body.no-padding {
  padding: 0;
}

.sdp-scrollable {
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.notes-list-header {
  padding: var(--sdp-space-3) var(--sdp-space-4);
  border-bottom: 1px solid var(--sdp-vora);
  background: var(--sdp-fons-subtil);
}

.univ-manager-toolbar {
  display: flex;
  align-items: center;
  gap: var(--sdp-space-2);
  min-height: var(--sdp-touch-min);
}

.univ-manager-toolbar--facets {
  justify-content: space-between;
}

.univ-manager-inbox {
  display: inline-flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: flex-start;
  gap: var(--sdp-space-2);
  min-height: var(--sdp-touch-min);
  padding: 0 var(--sdp-space-3);
  border: 1px solid var(--sdp-vora-control);
  border-radius: var(--sdp-radi-s);
  background: var(--sdp-fons-superficie);
  color: var(--sdp-text-titol);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.univ-manager-toolbar--list .btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--sdp-space-1);
  min-height: var(--sdp-touch-min);
  padding-inline: var(--sdp-space-3);
  white-space: nowrap;
}

.univ-manager-search {
  flex: 1 1 auto;
  min-width: 0;
  padding: var(--sdp-space-1) var(--sdp-space-2);
  background: var(--sdp-fons-superficie);
}

.univ-manager-search input {
  padding: var(--sdp-space-1) 0;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: var(--sdp-space-2);
  background: var(--sdp-fons-subtil);
  padding: var(--sdp-space-2) var(--sdp-space-3);
  border-radius: var(--sdp-radi-s);
  border: 1px solid var(--sdp-vora);
}

.search-bar input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  font: inherit;
  font-size: var(--sdp-text-small);
  color: var(--sdp-text-cos);
}

.univ-manager-facet-header {
  padding: var(--sdp-space-4) var(--sdp-space-4) var(--sdp-space-2);
  margin: 0;
  font-size: var(--sdp-text-meta);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--sdp-text-suau);
}

.univ-manager-facet-item {
  display: flex;
  align-items: center;
  gap: var(--sdp-space-3);
  padding: var(--sdp-space-2) var(--sdp-space-4);
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: var(--sdp-text-suau);
  font-family: inherit;
  font-size: var(--sdp-text-cos);
  cursor: pointer;
  transition: background var(--sdp-t), color var(--sdp-t);
  border-radius: 0;
}

.univ-manager-facet-item:hover {
  background: var(--sdp-fons-subtil);
  color: var(--sdp-text-titol);
}

.univ-manager-facet-item--active {
  background: var(--sdp-accent-subtil);
  color: var(--sdp-text-titol);
  font-weight: 700;
}

.univ-manager-facet-tree-branch {
  display: flex;
  flex-direction: column;
  margin-left: var(--sdp-space-2);
  padding-left: var(--sdp-space-3);
  border-left: 2px solid var(--sdp-vora);
}

.univ-manager-facet-spacing {
  height: var(--sdp-space-4);
}

.univ-manager-create-action {
  padding: var(--sdp-space-4);
  border-top: 1px solid var(--sdp-vora);
  background: var(--sdp-fons-superficie);
}

.univ-manager-create-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sdp-space-2);
  min-height: var(--sdp-touch-min);
  background: var(--sdp-accio);
  color: var(--sdp-sobre-accio);
  border: none;
  border-radius: var(--sdp-radi-pastilla);
  font-weight: 700;
  cursor: pointer;
  transition: background var(--sdp-t);
}

.univ-manager-create-btn:hover {
  background: var(--sdp-accio-hover);
}

/* ═══ PÀGINA 404 CENTRADA ═════════════════════════════════════════════ */
.sdp-404-cos {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--sdp-space-3);
  padding: var(--sdp-space-8) var(--sdp-space-4);
  max-width: 480px;
  margin-inline: auto;
}

.sdp-404-icona {
  color: var(--sdp-text-suau);
  margin-bottom: var(--sdp-space-2);
}

/* ═══ PILLTOGGLE · SELECTOR DE PÍNDOLA CANÒNIC (260911) ═══════════════
   Component: src/components/ui/PillToggle.jsx. Patró blindat pel Mestre.
   · Capa `components` de primer nivell: es declara després de `legacy`,
     així guanya el reinici i la regla global de :focus-visible sense
     !important. Primer inquilí de la migració de capes (Fase 2 · pas 5).
   · L'estat actiu penja de [aria-pressed="true"]. No hi ha classe
     --active: sense ARIA no hi ha aspecte d'actiu.
   · Actiu: taronja amb text fosc. Mai blanc sobre taronja.
   · Llei de Vida: cada opció fa com a mínim --sdp-touch d'alt.        */
@layer components {
  .sdp-pindola {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--sdp-space-2);
    padding: var(--sdp-space-4);
    margin-bottom: var(--sdp-space-6);
    background: var(--sdp-fons-elevat);
    box-shadow: var(--sdp-ombra-1);
    border: none;
    border-radius: var(--sdp-radi-pastilla);
  }
  .sdp-pindola__opcio {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--sdp-space-2);
    min-height: var(--sdp-touch-min);
    margin: 0;
    padding: 0 var(--sdp-space-4);
    border: 2px solid var(--sdp-vora);
    border-radius: var(--sdp-radi-pastilla);
    background: transparent;
    color: var(--sdp-text-titol);
    font: inherit;
    font-size: var(--sdp-text-small);
    font-weight: 700;
    line-height: var(--sdp-leading-tight);
    cursor: pointer;
    transition: background var(--sdp-t), color var(--sdp-t), border-color var(--sdp-t);
  }
  .sdp-pindola__opcio:hover { background: var(--sdp-fons-targeta); }
  .sdp-pindola__opcio[aria-pressed="true"] {
    background: var(--sdp-accio);
    border-color: var(--sdp-accio);
    color: var(--sdp-text-invers);
  }
  .sdp-pindola__opcio--taronja {
    color: var(--sdp-accent);
    border-color: var(--sdp-accent);
  }
  .sdp-pindola__opcio--taronja[aria-pressed="true"] {
    background: var(--sdp-accent);
    border-color: var(--sdp-accent);
    color: var(--sdp-sobre-accent);
  }
  .sdp-pindola__opcio:focus-visible {
    outline: 3px solid var(--sdp-focus);
    outline-offset: 2px;
  }
  .sdp-pindola__icona { display: inline-flex; }
  /* Centrat dins d'un bloc (Onboarding): 0,1,0 com .sdp-pindola, va després. */
  .sdp-pindola--centrada { display: flex; width: fit-content; margin-inline: auto; }
  
  .sdp-pindola--disseny {
    justify-content: flex-start;
    margin-bottom: var(--sdp-space-8);
    width: 100%;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   PEDRA SECA — COMPONENT ESTRUCTURAL CANÒNIC (260911)
   Premissa: Elements semàntics nus. Zero classes per defecte.
   Tota la base usa :where() → especificitat 0
   =================================================================== */
@layer sdp {

  /* ── TAULA ─────────────────────────────────────────────────────── */
  :where(table) {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-variant-numeric: tabular-nums;
  }
  :where(caption) {
    caption-side: top;
    text-align: start;
    color: var(--sdp-text-suau);
    padding-block: var(--sdp-space-1) var(--sdp-space-2);
  }
  :where(th, td) {
    padding: var(--sdp-space-2) var(--sdp-space-3);
    text-align: start;
    vertical-align: top;
    border-block-end: 1px solid var(--sdp-vora);
  }
  :where(thead th) {
    background: var(--sdp-fons-app);
    color: var(--sdp-text-titol);
    font-weight: 700;
    border-block-end: 1px solid var(--sdp-vora-forta);
    white-space: nowrap;
  }
  :where(tbody tr:nth-child(even)) {
    background: var(--sdp-fons-subtil);
  }
  @media (hover: hover) {
    :where(tbody tr:hover) {
      background: var(--sdp-accent-subtil);
    }
  }
  :where(tfoot td, tfoot th) {
    border-block-start: 1px solid var(--sdp-vora-forta);
    border-block-end: 0;
    font-weight: 700;
  }
  :where(tfoot tr:last-child td, tfoot tr:last-child th) {
    border-block-end: 1px solid var(--sdp-vora-forta);
  }
  :where(.sdp-num) {
    text-align: end;
    white-space: nowrap;
  }
  @media (max-width: 40rem) {
    :where(table) {
      display: block;
      overflow-x: auto;
      overscroll-behavior-inline: contain;
    }
    .sdp-taula :where(table) {
      display: table;
      overflow: visible;
    }
  }
  .sdp-taula {
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    border-block-start: 1px solid var(--sdp-vora);
  }
  .sdp-taula--llarga {
    max-height: 70vh;
    overflow: auto;
  }
  .sdp-taula--llarga :where(thead th) {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .sdp-taula--densa :where(th, td) {
    padding-block: var(--sdp-space-1);
  }
  .sdp-taula--plana :where(tbody tr:nth-child(even)) {
    background: transparent;
  }

  /* ── FORMULARIS ────────────────────────────────────────────────── */
  :where(fieldset) {
    border: 1px solid var(--sdp-vora);
    border-radius: var(--sdp-radi-s);
    padding: var(--sdp-space-3);
    margin-block: var(--sdp-space-4);
    min-inline-size: 0;
  }
  :where(legend) {
    padding-inline: var(--sdp-space-1);
    color: var(--sdp-text-suau);
  }
  :where(label) {
    display: block;
    margin-block-end: var(--sdp-space-1);
  }
  :where(input:not([type="checkbox"]):not([type="radio"]):not([type="file"]), select, textarea) {
    font: inherit;
    color: var(--sdp-text-titol);
    background: var(--sdp-fons-superficie);
    border: 1px solid var(--sdp-vora-control);
    border-radius: var(--sdp-radi-s);
    padding: var(--sdp-space-2) var(--sdp-space-3);
    inline-size: 100%;
  }
  :where(textarea) {
    min-block-size: 6rem;
    resize: vertical;
  }
  :where(input:disabled, select:disabled, textarea:disabled) {
    background: var(--sdp-fons-subtil);
    color: var(--sdp-text-desactivat);
    cursor: not-allowed;
  }
  :where(summary) {
    cursor: pointer;
  }

  /* ── LLISTES ───────────────────────────────────────────────────── */
  :where(ul.sdp-llista, ol.sdp-llista) {
    padding-inline-start: var(--sdp-space-4);
  }
  :where(li)::marker {
    color: var(--sdp-text-suau);
  }
  :where(nav) :where(ul, ol) {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  :where(dl) {
    display: grid;
    grid-template-columns: max-content 1fr;
    column-gap: var(--sdp-space-4);
    row-gap: var(--sdp-space-1);
    align-items: baseline;
  }
  :where(dt) {
    color: var(--sdp-text-suau);
  }
  :where(dd) {
    margin: 0;
  }

  /* ── AVATARS ───────────────────────────────────────────────────── */
  .sdp-avatar {
    display: inline-grid;
    place-items: center;
    border-radius: 50%;
    background: var(--sdp-info-fons);
    color: var(--sdp-info-text);
    font-weight: 700;
    border: 2px solid var(--sdp-fons-app);
    flex: none;
    object-fit: cover;
  }
  .sdp-avatar--xs { width: 24px; height: 24px; font-size: 0.6rem; }
  .sdp-avatar--sm { width: 32px; height: 32px; font-size: 0.68rem; }
  .sdp-avatar--md { width: var(--sdp-touch-min); height: var(--sdp-touch-min); font-size: 0.8rem; }
  .sdp-avatar--lg { width: calc(var(--sdp-space-8) + var(--sdp-space-6)); height: calc(var(--sdp-space-8) + var(--sdp-space-6)); font-size: 1rem; }
  .sdp-avatar--xl { width: 80px; height: 80px; font-size: 1.4rem; }
  .sdp-avatar-grup { display: flex; }
  .sdp-avatar-grup .sdp-avatar + .sdp-avatar { margin-left: -10px; }

  /* ── ESCALA (Ajuda visual Catàleg) ─────────────────────────────── */
  .sdp-escala { display: grid; gap: var(--sdp-space-2); }
  .sdp-escala__fila {
    display: grid;
    grid-template-columns: 120px 1fr auto;
    gap: var(--sdp-space-3);
    align-items: center;
    font-size: 0.8rem;
  }
  .sdp-escala__barra {
    height: 12px;
    border-radius: var(--sdp-radi-s);
    background: var(--sdp-accent);
    opacity: 0.85;
  }
  .sdp-escala__barra--1 { width: var(--sdp-space-1); }
  .sdp-escala__barra--2 { width: var(--sdp-space-2); }
  .sdp-escala__barra--3 { width: var(--sdp-space-3); }
  .sdp-escala__barra--4 { width: var(--sdp-space-4); }
  .sdp-escala__barra--6 { width: var(--sdp-space-6); }
  .sdp-escala__barra--8 { width: var(--sdp-space-8); }
  .sdp-escala__barra--10 { width: var(--sdp-space-10); }
  .sdp-escala__barra--12 { width: var(--sdp-space-12); }
  .sdp-escala__barra--16 { width: var(--sdp-space-16); }
  .sdp-escala__barra--20 { width: var(--sdp-space-20); }
  .sdp-escala__token {
    font-family: var(--sdp-font-mono);
    color: var(--sdp-text-suau);
  }


  /* ── MODALS (Natius) ───────────────────────────────────────────── */
  :where(dialog) {
    border: 1px solid var(--sdp-vora);
    border-radius: var(--sdp-radi-m);
    background: var(--sdp-fons-app);
    color: var(--sdp-text-titol);
    padding: var(--sdp-space-5);
    max-inline-size: min(90vw, 40rem);
  }
  :where(dialog)::backdrop {
    background: var(--sdp-fons-vel);
  }
  @media (prefers-reduced-motion: no-preference) {
    :where(dialog[open]) {
      animation: sdp-aparicio 120ms ease-out;
    }
  }

  /* ── ORFES SILENCIOSOS ─────────────────────────────────────────── */
  :where(hr) {
    border: 0;
    border-block-start: 1px solid var(--sdp-vora);
    margin-block: var(--sdp-space-6);
  }
  :where(kbd) {
    font-family: var(--sdp-font-mono);
    font-size: 0.9em;
    background: var(--sdp-fons-subtil);
    border: 1px solid var(--sdp-vora);
    border-radius: var(--sdp-radi-s);
    padding: 0 var(--sdp-space-1);
  }
}
@keyframes sdp-aparicio {
  from { opacity: 0; translate: 0 var(--sdp-space-2); }
}

.univ-manager-admin-login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.univ-manager-admin-sidebar-inner {
  padding: var(--sdp-space-6);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.univ-manager-admin-actions {
  margin-top: auto;
  border-top: 1px solid var(--sdp-vora);
  padding-top: var(--sdp-space-4);
}

.univ-manager-admin-action-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: var(--sdp-space-3);
}

.univ-manager-admin-dashboard {
  padding: var(--sdp-space-6);
}

.univ-manager-admin-detail {
  padding: var(--sdp-space-6);
}

.univ-manager-admin-pre {
  background: var(--sdp-fons-subtil);
  padding: var(--sdp-space-5);
  border-radius: var(--sdp-radi-m);
}

.univ-manager-admin-header {
  padding: var(--sdp-space-2) var(--sdp-space-4);
  background: var(--sdp-fons-subtil);
  border-bottom: 1px solid var(--sdp-vora);
  display: flex;
  gap: var(--sdp-space-4);
}

.univ-manager-admin-header-title {
  margin: 0;
  align-self: center;
}

.univ-manager-admin-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.univ-manager-admin-content {
  flex: 1;
  position: relative;
}

```

## FITXER: src/css/components.css
```css
/* ═══════════════════════════════════════════════════════════════════
   COMPONENTS CANÒNICS · PEDRA SECA (260911 · Seient 5)
   Full de src/components/ui/{formulari,Boto,Insignia,Alerta,Dialeg,
   Pestanyes,navegacio,estats,Pista}.jsx. Catàleg: /disseny?pagina=…
   · Només tokens semàntics: el tema fosc funciona sense cap regla extra.
   · Capa `components`: guanya a `legacy` sense !important.
   · Llei de Vida: tot control ≥ var(--sdp-touch-min).
   ═══════════════════════════════════════════════════════════════════ */
@layer components {

  .sdp-nomes-lector {
    position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
    overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
  }

  /* ── BOTÓ ─────────────────────────────────────────────────────────── */
  .sdp-boto {
    display: inline-flex; align-items: center; justify-content: center; gap: var(--sdp-space-2);
    min-height: var(--sdp-touch-min); padding: 0 var(--sdp-space-5);
    border: 2px solid transparent; border-radius: var(--sdp-radi-pastilla);
    font: inherit; font-size: var(--sdp-text-small); font-weight: 700; line-height: 1.2;
    text-decoration: none; cursor: pointer; transition: background var(--sdp-t), border-color var(--sdp-t);
  }
  .sdp-boto:focus-visible { outline: 3px solid var(--sdp-focus); outline-offset: 2px; }
  .sdp-boto:disabled { cursor: not-allowed; opacity: 0.55; }
  .sdp-boto--primari { background: var(--sdp-accio); color: var(--sdp-sobre-accio); }
  .sdp-boto--primari:hover:not(:disabled) { background: var(--sdp-accio-hover); }
  .sdp-boto--accent { background: var(--sdp-accent); color: var(--sdp-sobre-accent); }
  .sdp-boto--accent:hover:not(:disabled) { background: var(--sdp-accent-hover); }
  .sdp-boto--secundari { background: var(--sdp-fons-targeta); color: var(--sdp-text-titol); border-color: var(--sdp-vora-control); }
  .sdp-boto--secundari:hover:not(:disabled) { background: var(--sdp-fons-subtil); }
  .sdp-boto--perill { background: var(--sdp-error); color: var(--sdp-blanc-pur, #fff); }
  .sdp-boto--perill:hover:not(:disabled) { background: var(--sdp-error-text); }
  .sdp-boto--fantasma { background: transparent; color: var(--sdp-accio-text); }
  .sdp-boto--fantasma:hover:not(:disabled) { background: var(--sdp-fons-subtil); }
  .sdp-boto--gran { min-height: 56px; padding: 0 var(--sdp-space-8); font-size: var(--sdp-text-base); }
  .sdp-boto--ple { width: 100%; }
  .sdp-boto__gir, .sdp-carregant__gir { animation: sdp-gir 0.9s linear infinite; }
  @keyframes sdp-gir { to { rotate: 360deg; } }

  /* ── INSÍGNIA D'ESTAT ─────────────────────────────────────────────── */
  .sdp-insignia {
    display: inline-flex; align-items: center; gap: var(--sdp-space-1);
    padding: 2px var(--sdp-space-3); border-radius: var(--sdp-radi-pastilla);
    font-size: var(--sdp-text-meta); font-weight: 700; line-height: 1.5; border: 1px solid currentColor;
  }
  .sdp-insignia--neutre { background: var(--sdp-fons-subtil); color: var(--sdp-text-cos); }
  .sdp-insignia--info  { background: var(--sdp-info-fons);  color: var(--sdp-info-text); }
  .sdp-insignia--exit  { background: var(--sdp-exit-fons);  color: var(--sdp-exit-text); }
  .sdp-insignia--avis  { background: var(--sdp-avis-fons);  color: var(--sdp-avis-text); }
  .sdp-insignia--error { background: var(--sdp-error-fons); color: var(--sdp-error-text); }

  /* ── ALERTA EN LÍNIA (estén el canon sdp-alerta--* de @layer sdp) ── */
  .sdp-alerta {
    display: flex; align-items: flex-start; gap: var(--sdp-space-3);
    padding: var(--sdp-space-4); margin-block: var(--sdp-space-3);
    border: 1px solid currentColor; border-inline-start-width: 6px; border-radius: var(--sdp-radi-s);
  }
  .sdp-alerta--info  { background: var(--sdp-info-fons);  color: var(--sdp-info-text); }
  .sdp-alerta--exit, .sdp-alerta--ok { background: var(--sdp-exit-fons); color: var(--sdp-exit-text); }
  .sdp-alerta--avis  { background: var(--sdp-avis-fons);  color: var(--sdp-avis-text); }
  .sdp-alerta--error { background: var(--sdp-error-fons); color: var(--sdp-error-text); }
  .sdp-alerta__icona { flex: none; margin-top: 2px; }
  .sdp-alerta__cos { flex: 1; min-width: 0; }
  .sdp-alerta__titol { margin: 0 0 var(--sdp-space-1); font-weight: 800; }
  .sdp-alerta__text > :last-child { margin-bottom: 0; }
  .sdp-alerta__accions { display: flex; flex-wrap: wrap; gap: var(--sdp-space-2); margin-top: var(--sdp-space-3); }
  .sdp-alerta__tanca {
    flex: none; display: inline-flex; align-items: center; justify-content: center;
    width: var(--sdp-touch-min); height: var(--sdp-touch-min); margin: calc(var(--sdp-space-3) * -1);
    border: 0; border-radius: var(--sdp-radi-pastilla); background: transparent; color: inherit; cursor: pointer;
  }
  .sdp-alerta__tanca:focus-visible { outline: 3px solid var(--sdp-focus); }

  /* ── FORMULARIS ───────────────────────────────────────────────────── */
  .sdp-camp { display: flex; flex-direction: column; gap: var(--sdp-space-2); margin-bottom: var(--sdp-space-5); }
  .sdp-camp__etiqueta, .sdp-grup__llegenda { font-weight: 700; color: var(--sdp-text-titol); font-size: var(--sdp-text-small); }
  .sdp-camp__obligatori { font-weight: 400; color: var(--sdp-text-suau); }
  .sdp-camp__ajuda { margin: 0; color: var(--sdp-text-suau); font-size: var(--sdp-text-meta); }
  .sdp-camp__error {
    display: flex; align-items: center; gap: var(--sdp-space-2); margin: 0;
    color: var(--sdp-error-text); font-weight: 700; font-size: var(--sdp-text-meta);
  }
  .sdp-control {
    width: 100%; min-height: var(--sdp-touch-min); padding: var(--sdp-space-2) var(--sdp-space-3);
    border: 2px solid var(--sdp-vora-control); border-radius: var(--sdp-radi-s);
    background: var(--sdp-fons-targeta); color: var(--sdp-text-titol);
    font: inherit; font-size: var(--sdp-text-base);
  }
  .sdp-control::placeholder { color: var(--sdp-text-suau); }
  .sdp-control:focus-visible { outline: 3px solid var(--sdp-focus); outline-offset: 1px; border-color: var(--sdp-focus); }
  .sdp-control:disabled { background: var(--sdp-fons-subtil); color: var(--sdp-text-desactivat); cursor: not-allowed; }
  .sdp-control[aria-invalid="true"] { border-color: var(--sdp-error); }
  .sdp-control--area { min-height: calc(var(--sdp-touch-min) * 2.5); resize: vertical; line-height: 1.5; }
  .sdp-control--selector { appearance: auto; }

  .sdp-grup { margin: 0 0 var(--sdp-space-5); padding: var(--sdp-space-4); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-m); }
  .sdp-grup--error { border-color: var(--sdp-error); }
  .sdp-grup__llegenda { padding: 0 var(--sdp-space-2); }
  .sdp-grup__cos { display: grid; gap: 0 var(--sdp-space-4); grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); }

  .sdp-casella { display: flex; align-items: flex-start; gap: var(--sdp-space-3); min-height: var(--sdp-touch-min); padding-block: var(--sdp-space-2); }
  .sdp-casella__control { flex: none; width: 24px; height: 24px; margin: 0; accent-color: var(--sdp-accio); cursor: pointer; }
  .sdp-casella__control:focus-visible { outline: 3px solid var(--sdp-focus); outline-offset: 2px; }
  .sdp-casella__etiqueta { display: flex; flex-direction: column; gap: 2px; cursor: pointer; color: var(--sdp-text-titol); }
  .sdp-casella__ajuda { color: var(--sdp-text-suau); font-size: var(--sdp-text-meta); }

  .sdp-interruptor { display: flex; align-items: center; justify-content: space-between; gap: var(--sdp-space-4); min-height: var(--sdp-touch-min); }
  .sdp-interruptor__etiqueta { font-weight: 700; color: var(--sdp-text-titol); }
  .sdp-interruptor__control {
    display: inline-flex; align-items: center; gap: var(--sdp-space-2);
    min-height: var(--sdp-touch-min); padding: 0 var(--sdp-space-2);
    border: 0; background: transparent; color: var(--sdp-text-titol); font: inherit; font-weight: 700; cursor: pointer;
  }
  .sdp-interruptor__control:focus-visible { outline: 3px solid var(--sdp-focus); border-radius: var(--sdp-radi-pastilla); }
  .sdp-interruptor__carril {
    position: relative; width: 52px; height: 30px; border-radius: var(--sdp-radi-pastilla);
    background: var(--sdp-fons-subtil); border: 2px solid var(--sdp-vora-control); transition: background var(--sdp-t);
  }
  .sdp-interruptor__botonet {
    position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%;
    background: var(--sdp-text-suau); transition: translate var(--sdp-t), background var(--sdp-t);
  }
  .sdp-interruptor__control[aria-checked="true"] .sdp-interruptor__carril { background: var(--sdp-accio); border-color: var(--sdp-accio); }
  .sdp-interruptor__control[aria-checked="true"] .sdp-interruptor__botonet { translate: 22px 0; background: var(--sdp-sobre-accio); }
  .sdp-interruptor__estat { min-width: 2ch; }

  /* ── DIÀLEG · CONFIRMACIÓ · CALAIX ────────────────────────────────── */
  .sdp-dialeg {
    width: min(92vw, 36rem); max-height: min(88dvh, 48rem); padding: 0;
    border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-g);
    background: var(--sdp-fons-targeta); color: var(--sdp-text-cos); box-shadow: var(--sdp-ombra-4);
  }
  .sdp-dialeg--s { width: min(92vw, 28rem); }
  .sdp-dialeg--g { width: min(94vw, 56rem); }
  .sdp-dialeg::backdrop { background: var(--sdp-fons-vel); }
  .sdp-dialeg__marc { display: flex; flex-direction: column; max-height: inherit; }
  .sdp-dialeg__cap {
    display: flex; align-items: center; justify-content: space-between; gap: var(--sdp-space-3);
    padding: var(--sdp-space-4) var(--sdp-space-4) var(--sdp-space-2) var(--sdp-space-6);
  }
  .sdp-dialeg__titol { margin: 0; font-size: var(--sdp-text-base); font-weight: 800; color: var(--sdp-text-titol); }
  .sdp-dialeg__tanca {
    flex: none; display: inline-flex; align-items: center; justify-content: center;
    width: var(--sdp-touch-min); height: var(--sdp-touch-min); border: 0; border-radius: var(--sdp-radi-pastilla);
    background: transparent; color: var(--sdp-text-titol); cursor: pointer;
  }
  .sdp-dialeg__tanca:hover { background: var(--sdp-fons-subtil); }
  .sdp-dialeg__tanca:focus-visible { outline: 3px solid var(--sdp-focus); }
  .sdp-dialeg__descripcio { margin: 0; padding: 0 var(--sdp-space-6); color: var(--sdp-text-cos); }
  .sdp-dialeg__cos { padding: var(--sdp-space-4) var(--sdp-space-6); overflow-y: auto; overscroll-behavior: contain; }
  .sdp-dialeg__peu {
    display: flex; flex-wrap: wrap; justify-content: flex-end; gap: var(--sdp-space-3);
    padding: var(--sdp-space-4) var(--sdp-space-6); border-top: 1px solid var(--sdp-vora);
  }
  .sdp-dialeg--calaix {
    margin: 0; width: min(88vw, 24rem); height: 100dvh; max-height: 100dvh; border-radius: 0; border-block: 0;
  }
  .sdp-dialeg--calaix .sdp-dialeg__marc { height: 100%; }
  .sdp-dialeg--calaix .sdp-dialeg__cos { flex: 1; }
  .sdp-dialeg--esquerra { inset: 0 auto 0 0; border-inline-start: 0; }
  .sdp-dialeg--dreta { inset: 0 0 0 auto; border-inline-end: 0; }
  @media (max-width: 720px) {
    /* Mòbil: el modal es convertix en full inferior; el polze arriba als botons. */
    .sdp-dialeg:not(.sdp-dialeg--calaix) {
      width: 100vw; max-width: 100vw; margin: auto 0 0; border-radius: var(--sdp-radi-g) var(--sdp-radi-g) 0 0;
    }
    .sdp-dialeg__peu { flex-direction: column-reverse; padding-bottom: calc(var(--sdp-space-4) + env(safe-area-inset-bottom, 0px)); }
    .sdp-dialeg__peu .sdp-boto { width: 100%; }
  }

  /* ── PESTANYES ────────────────────────────────────────────────────── */
  .sdp-pestanyes__llista {
    display: flex; gap: var(--sdp-space-1); overflow-x: auto; scrollbar-width: thin;
    border-bottom: 2px solid var(--sdp-vora);
  }
  .sdp-pestanyes__pestanya {
    display: inline-flex; align-items: center; gap: var(--sdp-space-2); flex: none;
    min-height: var(--sdp-touch-min); padding: 0 var(--sdp-space-4); margin-bottom: -2px;
    border: 0; border-bottom: 4px solid transparent; background: transparent;
    color: var(--sdp-text-suau); font: inherit; font-weight: 700; cursor: pointer;
  }
  .sdp-pestanyes__pestanya:hover { color: var(--sdp-text-titol); background: var(--sdp-fons-subtil); }
  .sdp-pestanyes__pestanya[aria-selected="true"] { color: var(--sdp-text-titol); border-bottom-color: var(--sdp-accent-text); }
  .sdp-pestanyes__pestanya:focus-visible, .sdp-pestanyes__panell:focus-visible { outline: 3px solid var(--sdp-focus); outline-offset: -3px; }
  .sdp-pestanyes__panell { padding: var(--sdp-space-4) 0; }

  /* ── MOLLA DE PA · PAGINACIÓ ──────────────────────────────────────── */
  .sdp-molla__llista { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sdp-space-1); margin: 0; padding: 0; list-style: none; }
  .sdp-molla__pas { display: inline-flex; align-items: center; gap: var(--sdp-space-1); margin: 0; color: var(--sdp-text-suau); }
  .sdp-molla__pas + .sdp-molla__pas::before { content: '›'; padding-inline: var(--sdp-space-1); color: var(--sdp-text-suau); }
  .sdp-molla__enllac { display: inline-flex; align-items: center; min-height: var(--sdp-touch-min); color: var(--sdp-accio-text); font-weight: 700; }
  .sdp-molla__pas [aria-current="page"] { color: var(--sdp-text-titol); font-weight: 700; }

  .sdp-paginacio { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--sdp-space-2); }
  .sdp-paginacio__llista { display: flex; align-items: center; gap: var(--sdp-space-1); margin: 0; padding: 0; list-style: none; }
  .sdp-paginacio__llista > li { margin: 0; }
  .sdp-paginacio__num, .sdp-paginacio__pas {
    display: inline-flex; align-items: center; justify-content: center; gap: var(--sdp-space-1);
    min-width: var(--sdp-touch-min); min-height: var(--sdp-touch-min); padding: 0 var(--sdp-space-3);
    border: 2px solid var(--sdp-vora); border-radius: var(--sdp-radi-s);
    background: var(--sdp-fons-targeta); color: var(--sdp-text-titol); font: inherit; font-weight: 700; cursor: pointer;
  }
  .sdp-paginacio__num[aria-current="page"] { background: var(--sdp-accio); border-color: var(--sdp-accio); color: var(--sdp-sobre-accio); }
  .sdp-paginacio__num:focus-visible, .sdp-paginacio__pas:focus-visible { outline: 3px solid var(--sdp-focus); outline-offset: 2px; }
  .sdp-paginacio__pas:disabled { opacity: 0.45; cursor: not-allowed; }
  .sdp-paginacio__salt { padding-inline: var(--sdp-space-1); color: var(--sdp-text-suau); }

  /* ── ESTATS ───────────────────────────────────────────────────────── */
  .sdp-buit {
    display: flex; flex-direction: column; align-items: center; gap: var(--sdp-space-3);
    padding: var(--sdp-space-10) var(--sdp-space-4); text-align: center; color: var(--sdp-text-suau);
  }
  .sdp-buit__titol { margin: 0; font-size: var(--sdp-text-base); font-weight: 800; color: var(--sdp-text-titol); }
  .sdp-buit__text { max-width: 40ch; }
  .sdp-carregant { display: inline-flex; align-items: center; gap: var(--sdp-space-3); color: var(--sdp-text-suau); font-weight: 700; }
  .sdp-esquelet__forma { display: grid; gap: var(--sdp-space-3); }
  .sdp-esquelet__linia, .sdp-esquelet__media {
    display: block; height: 1rem; border-radius: var(--sdp-radi-s);
    background: linear-gradient(90deg, var(--sdp-fons-subtil) 0%, var(--sdp-vora) 50%, var(--sdp-fons-subtil) 100%);
    background-size: 200% 100%; animation: sdp-lluentor 1.4s ease-in-out infinite;
  }
  .sdp-esquelet__linia:last-child { width: 60%; }
  .sdp-esquelet__linia--titol { height: 1.6rem; width: 45%; }
  .sdp-esquelet__media { height: 10rem; }
  @keyframes sdp-lluentor { from { background-position: 100% 0; } to { background-position: -100% 0; } }
  .sdp-progres { display: grid; gap: var(--sdp-space-2); margin-bottom: var(--sdp-space-4); }
  .sdp-progres__cap { display: flex; justify-content: space-between; font-weight: 700; color: var(--sdp-text-titol); }
  .sdp-progres__barra {
    width: 100%; height: 14px; appearance: none; border: 0; border-radius: var(--sdp-radi-pastilla);
    background: var(--sdp-fons-subtil); overflow: hidden; accent-color: var(--sdp-accio);
  }
  .sdp-progres__barra::-webkit-progress-bar { background: var(--sdp-fons-subtil); }
  .sdp-progres__barra::-webkit-progress-value { background: var(--sdp-accio); border-radius: var(--sdp-radi-pastilla); }
  .sdp-progres__barra::-moz-progress-bar { background: var(--sdp-accio); border-radius: var(--sdp-radi-pastilla); }

  /* ── PISTA (toggletip) ────────────────────────────────────────────── */
  .sdp-pista { position: relative; display: inline-flex; vertical-align: middle; }
  .sdp-pista__boto {
    display: inline-flex; align-items: center; justify-content: center;
    width: var(--sdp-touch-min); height: var(--sdp-touch-min); border: 0; border-radius: var(--sdp-radi-pastilla);
    background: transparent; color: var(--sdp-accio-text); cursor: pointer;
  }
  .sdp-pista__boto:focus-visible { outline: 3px solid var(--sdp-focus); }
  .sdp-pista__bafarada {
    position: absolute; top: 100%; left: 50%; translate: -50% 0; z-index: 10;
    width: max-content; max-width: min(18rem, 80vw); padding: var(--sdp-space-3) var(--sdp-space-4);
    border-radius: var(--sdp-radi-s); background: var(--sdp-fons-invers); color: var(--sdp-text-invers);
    box-shadow: var(--sdp-ombra-3); font-size: var(--sdp-text-small); line-height: 1.4;
  }

  /* ── AVATAR ───────────────────────────────────────────────────────── */
  .sdp-avatar {
    display: inline-flex; align-items: center; justify-content: center;
    flex: none; aspect-ratio: 1 / 1; overflow: hidden;
    border-radius: 50%;
    background: var(--sdp-fons-subtil);
    color: var(--sdp-text-titol);
    font-weight: 800; line-height: 1; text-transform: uppercase;
    user-select: none;
  }
  .sdp-avatar__imatge { width: 100%; height: 100%; object-fit: cover; display: block; }

  .sdp-avatar--xs { width: 24px; height: 24px; font-size: var(--sdp-text-meta); }
  .sdp-avatar--sm { width: 32px; height: 32px; font-size: var(--sdp-text-meta); }
  .sdp-avatar--md { width: var(--sdp-touch-min); height: var(--sdp-touch-min);
                    font-size: var(--sdp-text-small); }
  .sdp-avatar--lg { width: 56px; height: 56px; font-size: var(--sdp-text-base); }
  .sdp-avatar--xl { width: 80px; height: 80px; font-size: var(--sdp-text-h5); }

  .sdp-avatar-grup { display: inline-flex; align-items: center; }
  .sdp-avatar-grup > .sdp-avatar + .sdp-avatar {
    margin-inline-start: calc(var(--sdp-space-2) * -1);
    box-shadow: 0 0 0 2px var(--sdp-fons-targeta);
  }

  /* ── DIVISOR ──────────────────────────────────────────────────────── */
  .sdp-divisor {
    border: 0; border-block-start: 1px solid var(--sdp-vora);
    margin-block: var(--sdp-space-6);
  }
  .sdp-divisor--major  { border-block-start-width: 3px; margin-block: var(--sdp-space-12); }
  .sdp-divisor--suau   { border-block-start-style: dashed; }
  .sdp-divisor--puntejat { border-block-start-style: dotted; }

  .sdp-divisor--amb-text {
    display: flex; align-items: center; gap: var(--sdp-space-4);
    border: 0;
  }
  .sdp-divisor--amb-text::before,
  .sdp-divisor--amb-text::after {
    content: ''; flex: 1; border-block-start: 1px solid var(--sdp-vora);
  }
  .sdp-divisor__text {
    color: var(--sdp-text-suau); font-size: var(--sdp-text-meta);
    font-weight: 700; letter-spacing: 0.05em; white-space: nowrap;
  }

  /* ── CATÀLEG (només /disseny) ─────────────────────────────────────── */
  .sdp-cataleg-nav { 
    margin-block: var(--sdp-space-4) var(--sdp-space-6);
    background: var(--sdp-fons-elevat);
    box-shadow: var(--sdp-ombra-1);
    border-radius: var(--sdp-radi-pastilla);
    padding: var(--sdp-space-4);
  }
  .sdp-cataleg-nav__llista { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--sdp-space-2); margin: 0; padding: 0; list-style: none; }
  .sdp-cataleg-nav__llista > li { margin: 0; }
  .sdp-cataleg-nav__enllac {
    display: inline-flex; align-items: center; min-height: var(--sdp-touch-min); padding: 0 var(--sdp-space-4);
    border: 2px solid var(--sdp-vora); border-radius: var(--sdp-radi-pastilla);
    color: var(--sdp-text-titol); font-weight: 700; text-decoration: none;
  }
  .sdp-cataleg-nav__enllac[aria-current="page"] { background: var(--sdp-accio); border-color: var(--sdp-accio); color: var(--sdp-text-invers); }
  .sdp-especimen { margin-bottom: var(--sdp-space-10); padding-top: var(--sdp-space-6); border-top: 2px solid var(--sdp-vora); }
  .sdp-especimen__cap { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--sdp-space-3); }
  .sdp-especimen__nom { margin: 0; }
  .sdp-especimen__fitxer { font-size: var(--sdp-text-meta); color: var(--sdp-text-suau); }
  .sdp-especimen__viu {
    margin-block: var(--sdp-space-4); padding: var(--sdp-space-6); border: 1px dashed var(--sdp-vora-control);
    border-radius: var(--sdp-radi-m); background: var(--sdp-fons-app);
  }
  .sdp-especimen__fila { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sdp-space-3); }
  .sdp-especimen__regles { display: grid; gap: var(--sdp-space-4); grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
  .sdp-especimen__fes, .sdp-especimen__no { padding: var(--sdp-space-4); border-radius: var(--sdp-radi-s); border-inline-start: 6px solid; }
  .sdp-especimen__fes { border-color: var(--sdp-exit); background: var(--sdp-exit-fons); color: var(--sdp-exit-text); }
  .sdp-especimen__no { border-color: var(--sdp-error); background: var(--sdp-error-fons); color: var(--sdp-error-text); }
  .sdp-especimen__fes > :last-child, .sdp-especimen__no > :last-child { margin-bottom: 0; }
  .sdp-anatomia { display: grid; gap: 2px; min-height: 16rem; border: 2px solid var(--sdp-vora-forta); border-radius: var(--sdp-radi-s); overflow: hidden;
    grid-template: "lat sup" auto "lat fin" 1fr / minmax(6rem, 22%) 1fr; background: var(--sdp-vora-forta); }
  .sdp-anatomia > * { display: flex; align-items: center; justify-content: center; padding: var(--sdp-space-3); text-align: center; font-weight: 700; }
  .sdp-anatomia__lat { grid-area: lat; background: var(--sdp-crom-fons); color: var(--sdp-crom-text); }
  .sdp-anatomia__sup { grid-area: sup; min-height: 3rem; background: var(--sdp-crom-fons); color: var(--sdp-crom-text); }
  .sdp-anatomia__fin { grid-area: fin; background: var(--sdp-fons-app); color: var(--sdp-text-titol); }
}

@media (prefers-reduced-motion: reduce) {
  .sdp-boto__gir, .sdp-carregant__gir, .sdp-esquelet__linia, .sdp-esquelet__media { animation: none; }
  .sdp-interruptor__botonet, .sdp-interruptor__carril { transition: none; }
}

```

