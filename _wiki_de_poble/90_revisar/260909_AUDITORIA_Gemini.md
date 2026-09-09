---
tipus: informe
estat: canonic
description: "Auditoria tècnica, correcció de la pàgina legal i anàlisi de l'arquitectura global."
---
# 🛡️ INFORME D'AUDITORIA: Pàgina Legal i Arquitectura

## 1. El Problema de la Pàgina Legal (Desalineació)
El defecte visual de la pàgina legal (i qualsevol pàgina de text pur generada per `TextSection.jsx`) no és un problema de les dades a `pageContent.js`, sinó un trencament del CSS de "Pedra Seca" a causa d'un excés de profunditat al DOM (DOM Depth) i classes incorrectes.

### Diagnòstic:
Al fitxer `src/sections/text/TextSection.jsx`, el contingut s'estava injectant així:
```jsx
<div className="sdp-grid sdp-text-content" style={{ padding: 'var(--sdp-space-6) var(--sdp-space-4)' }}>
  <article dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.html) }} />
</div>

```

Açò trenca la maqueta per dos motius:

1. S'aplica `sdp-grid` (que força un `display: grid`), destrossant el flux de text tradicional.
2. El CSS de Pedra Seca dictamina la màxima amplària de lectura (68 caràcters per no cansar la vista) amb selectors de fill directe, com ara `.cms-preview > p`. Com que l'HTML s'injecta dins d'un `<article>` sense classes, que al seu torn penja d'un `<div>`, el selector directe falla. El text s'expandeix al 100% de la pantalla.

### Solució (Codi a substituir a `TextSection.jsx`):

Eliminar l'embolcall sobrant i l'estil en línia (que viola la Llei de Pedra Seca), deixant que l'arrel de l'article actue com a contenidor de la previsualització:

```jsx
export default function TextSection({ page, pageKey }) {
  const { t } = useUIActions();
  return (
    <UniversalPage 
      title={page.title}
      subtitle={page.subtitle}
      lead={page.lead}
      heroImage={resolveAsset(page.image || '/assets/img/hero_panoramic_rural_view_1774720664221.png')}
      heroAlt={page.imageAlt || 'Panoràmica fictici d\'un poble'}
      labels={page.labels || [
        { text: 'Pàgina', className: 'sdp-badge-category' },
        { text: t?.('section.text.page', 'Pàgina') || pageKey.toUpperCase(), className: 'sdp-badge-system' }
      ]}
      showPin={false}
      showLogos={true}
      topBarData={{
        time: "22:28",
        date: "20/08/26",
        dateTime: "2026-08-20T22:28:00+02:00",
        copyright: "© Sóc de Poble / Fet per la IAIA i Nano Banana",
        chrome: "context"
      }}
    >
      <article 
        className="cms-preview sdp-text-content sdp-p-6" 
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.html) }} 
      />
    </UniversalPage>
  );
}

```

## 2. Millores Estructurals Globals (Rendiment i Robustesa)

### A. Polució d'estils en línia (`style={{}}`)

Hi ha múltiples fitxers (assenyalats al `.design-guard-deute.json` i presents a components com `AvisadorEfimer.jsx`, `XatSection.jsx` o `OnboardingSection.jsx`) que encara usen atributs `style={{}}`. Això impedeix que el Mode Fosc funcione correctament i trenca el patró de *Cascade Layers*.
**Proposta:** Moure tots els atributs físics (padding, z-index, transform) a classes de `src/css/index.css`.

### B. Rendiment i Càrrega Diferida (Lazy Loading)

Si bé `App.jsx` fa servir `React.lazy` per a diferir la càrrega de les rutes principals, els *Seeders* (`appSeed.js`, `pageContent.js`) concentren volums enormes de text pur i HTML que s'arrosseguen als *chunks* principals de l'aplicació, fins i tot quan l'usuari no visita la pàgina legal o el projecte.
**Proposta:** Desacoblar els objectes pesats de text ric (`PAGE_COPY`) perquè es carreguen de forma asíncrona (via `fetch` o `import()`) només quan el visitant entra a `/legal` o `/projecte`.

### C. Gestió de la Sessió Fantasma (Identitat i Cicle de Vida)

El sistema d'autenticació ha millorat, però cal assegurar que el "Tractor de Persistència" no s'enfronte a condicions de carrera. Com que s'està utilitzant `sessionStorage` per protegir els tokens, una recàrrega brusca en algunes pestanyes podria causar desincronització si l'esdeveniment `sdp:auth-change` no es captura a temps.
**Proposta:** Centralitzar la verificació del token actiu dins de l'orquestrador principal i usar un esdeveniment de broadcast (BroadcastChannel) per a mantindre sincronitzades múltiples pestanyes sota la mateixa sessió, com s'ha començat a insinuar a `devicesRuntime.js`.

### D. Reducció del DOM Depth (Patró Slot)

Al manual de disseny s'esmenta la migració al "patró Slot". Això s'hauria d'aplicar urgentment a `UniversalCard` per evitar embolcallar contínuament els `children` amb divs inútils (`.card__body`, `.split-grid`, etc.). Això farà l'aplicació més eficient en dispositius mòbils antics (Baseline 2022).

## 3. Resolució

Amb la modificació de `TextSection.jsx` canviant `.sdp-grid` per `.cms-preview` directament sobre el node arrel del contingut, s'arregla la desalineació de les pàgines legals sense trencar cap precepte del disseny de la Pedra Seca.

**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
