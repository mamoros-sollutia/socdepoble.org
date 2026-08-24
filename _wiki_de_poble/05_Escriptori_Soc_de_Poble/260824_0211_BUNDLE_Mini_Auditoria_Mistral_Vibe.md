## Inventari

- `src/css/index.css` (91907)
- `src/pages/features/sosp-components.css` (12274)
- `src/sections/disseny/DesignSection.jsx` (52187)
- `src/components/universal/UniversalComponents.jsx` (39215)

**Total:** 195583 caràcters, 4 fitxers.

---

## Fitxer: src/css/index.css

```css
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
   0. Tokens de disseny (:root)  — nous --sdp-*, àlies legat --sp-*
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

:root, :host {
  /* ═══ CAPA 1 · PRIMITIUS ═══════════════════════════════════════ */

  /* Pedra · neutre càlid — OKLCH H 84°, croma baix */
  --sdp-blanc-pur: oklch(100% 0 0);
  --sdp-negre-pur: oklch(0% 0 0);
  --sdp-blanc: #ffffff;
  --sdp-negre: #000000;
  --sdp-pedra-50:  #fdfcfb;
  --sdp-pedra-100: #f9f8f5;
  --sdp-pedra-200: #efece7;
  --sdp-pedra-300: #dcd7cd;
  --sdp-pedra-400: #b7b1a5;
  --sdp-pedra-500: #8b857b;
  --sdp-pedra-600: #514c45;
  --sdp-pedra-700: #3d3b35;
  --sdp-pedra-750: #302e29;
  --sdp-pedra-800: #22211e;
  --sdp-pedra-850: #181715;
  --sdp-pedra-900: #0e0d0c;

  /* Primari · taronja de terra — OKLCH H 47.9° (to exacte del cànon #FF7300) */
  --sdp-primary-50:  #fff4ef;
  --sdp-primary-100: #ffe7dc;
  --sdp-primary-200: #ffd1bb;
  --sdp-primary-300: #ffb38c;
  --sdp-primary-400: #ff955b;
  --sdp-primary-500: #fe7406;   /* el cànon. Només com a FONS. */
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
  --sdp-secondary-500: #016ebf;   /* fons · text blanc 5,23:1 · AA */
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
  --sdp-fons-app:        var(--sdp-pedra-100);
  --sdp-fons-targeta:    var(--sdp-blanc-pur);
  --sdp-fons-elevat:     var(--sdp-blanc-pur);
  --sdp-fons-superficie: var(--sdp-blanc-pur);
  
  /* Estructura de marca: no canvia amb el tema */
  --sdp-fons-roca:       var(--sdp-pedra-900);
  --sdp-sobre-roca:      var(--sdp-pedra-50);
  --sdp-fons-subtil:     var(--sdp-pedra-200);
  --sdp-fons-invers:     var(--sdp-pedra-900);
  --sdp-fons-vel:        rgba(14, 13, 12, 0.55);

  /* Text — TOT compleix AAA (≥7:1) sobre la seua superfície */
  --sdp-text-titol:  var(--sdp-pedra-900);   /* 19,42:1 */
  --sdp-text-cos:    var(--sdp-pedra-700);   /* 11,20:1 */
  --sdp-text-suau:   var(--sdp-pedra-600);   /*  7,24:1 */
  --sdp-text-invers: var(--sdp-pedra-50);
  --sdp-text-desactivat: var(--sdp-pedra-500);  /* només controls inactius (exempts WCAG) */

  /* Vores */
  --sdp-vora:         var(--sdp-pedra-300);   /* decorativa */
  --sdp-vora-control: var(--sdp-pedra-500);   /* 3,66:1 · WCAG 1.4.11 */
  --sdp-vora-forta:   var(--sdp-pedra-600);

  /* Accent · taronja — identitat de marca */
  --sdp-accent:            var(--sdp-primary-500);
  --sdp-accent-hover:      var(--sdp-primary-600);
  --sdp-accent-subtil:     var(--sdp-primary-50);
  --sdp-sobre-accent:      var(--sdp-pedra-900);    /*  7,13:1 · AAA */
  --sdp-accent-text:       var(--sdp-primary-700);  /*  5,51:1 · AA  (interacció) */
  --sdp-accent-text-hover: var(--sdp-primary-800);  /*  7,97:1 · AAA */
  --sdp-accent-titol:      var(--sdp-primary-700);  /*  5,51:1 · AA (h2, h4) */

  /* Acció · blau */
  --sdp-accio:         var(--sdp-secondary-500);
  --sdp-accio-hover:   var(--sdp-secondary-700);
  --sdp-accio-forta:   var(--sdp-secondary-700);
  --sdp-accio-subtil:  var(--sdp-secondary-50);
  --sdp-sobre-accio:   #ffffff;                  /*  5,23:1 · AA */
  --sdp-accio-text:    var(--sdp-secondary-700); /*  7,20:1 · AAA (h1, h3, h5) */
  --sdp-focus:         var(--sdp-secondary-700);
  --sdp-focus-invers:  var(--sdp-primary-400);

  /* Estat semàntic */
  --sdp-error: var(--sdp-error-500);  --sdp-error-fons: var(--sdp-error-50);  --sdp-error-text: var(--sdp-error-700);
  --sdp-avis:  var(--sdp-avis-500);   --sdp-avis-fons:  var(--sdp-avis-50);   --sdp-avis-text:  var(--sdp-avis-700);
  --sdp-exit:  var(--sdp-exit-500);   --sdp-exit-fons:  var(--sdp-exit-50);   --sdp-exit-text:  var(--sdp-exit-700);
  --sdp-info:  var(--sdp-secondary-500); --sdp-info-fons: var(--sdp-secondary-50); --sdp-info-text: var(--sdp-secondary-700);

  /* ═══ MÈTRIQUES, MOVIMENT, TIPOGRAFIA ═════════════════════════ */

  /* Radis */
  --sdp-radi-s: 8px;
  --sdp-radi-m: 12px;
  --sdp-radi-g: 16px;
  --sdp-radi-xl: 24px;
  --sdp-radi-pastilla: 999px;

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
  --sdp-ctrl-scale: calc((var(--sdp-ctrl-vw) - 320px) / (1024 - 320));
  --sdp-step-0: calc(14px + (16 - 14) * var(--sdp-ctrl-scale));
  --sdp-space-base: var(--sdp-step-0);

  --sdp-col-sidebar: 260px;
  --sdp-col-llista: 380px;
  --sdp-alt-negra: 64px;
  --sdp-alt-accio: 58px;
  --sdp-alt-barres: calc(var(--sdp-alt-negra) + var(--sdp-alt-accio) * 2);  /* 180px · pila sticky */
  --sdp-alt-nav-mobil: 96px;                 /* nav inferior + separació */
  --sdp-pad-contenidor: clamp(16px, 4vw, 40px);

  /* LLEI DE VIDA · objectiu tàctil mínim. Cap control per davall. */
  --sdp-touch: 44px;
  --sdp-touch-comode: 48px;

  /* Escala z-index · única font de veritat */
  --z-barra-taronja: 80;
  --z-barra-blava: 90;
  --z-barra-negra: 100;
  --z-sidebar: 200;
  --z-fab: 500;
  --z-nav-mobil: 950;
  --z-vel: 960;
  --z-calaix: 1000;

  /* Tipografia */
  --sdp-font: 'Noto Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --sdp-font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

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

:root[data-theme="dark"], :host([data-theme="dark"]) {
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
  --sdp-accio-forta:   var(--sdp-secondary-600);
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
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  height: 100%;
  overscroll-behavior: none;           /* mata el rubber-band global */
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--sdp-font);
  line-height: 1.5;
  background: var(--sdp-fons-app);
  color: var(--sdp-text-titol);
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

:host {
  display: block;
  width: 100%;
  height: 100dvh;
  min-width: 0;
  min-height: 0;
  font-family: var(--sdp-font);
  line-height: 1.5;
  background: var(--sdp-fons-app);
  color: var(--sdp-text-titol);
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
/* ═══════════════════════════════════════════════════════════════
   TIPOGRAFIA EDITORIAL · TRELLAT PUR
   Regles globals — ÚNICA FONT DE VERITAT.
   Cap element de text necessita cap div embolcall ni estil inline.
   El ritme vertical és implacable per cascada.
   ═══════════════════════════════════════════════════════════════ */
h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6 {
  font-family: var(--sdp-font);
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
  color: var(--sdp-accio-text);
  text-align: center;
  margin-top: var(--sdp-mt-h1);
  margin-bottom: var(--sdp-mb-h1);
  letter-spacing: -0.01em;
}
h2, .h2 {
  font-size: var(--sdp-text-h2);
  line-height: var(--sdp-leading-snug);
  font-weight: 800;
  color: var(--sdp-accent-titol);
  text-align: center;
  margin-top: var(--sdp-mt-h2);
  margin-bottom: var(--sdp-mb-h2);
  letter-spacing: -0.005em;
}
h3, .h3 {
  font-size: var(--sdp-text-h3);
  line-height: var(--sdp-leading-snug);
  font-weight: 700;
  color: var(--sdp-accio-text);
  text-align: left;
  margin-top: var(--sdp-mt-h3);
  margin-bottom: var(--sdp-mb-h3);
}
h4, .h4 {
  font-size: var(--sdp-text-h4);
  line-height: var(--sdp-leading-snug);
  font-weight: 700;
  color: var(--sdp-accent-titol);
  text-align: left;
  margin-top: var(--sdp-mt-h4);
  margin-bottom: var(--sdp-mb-h4);
}
h5, .h5 {
  font-size: var(--sdp-text-h5);
  line-height: var(--sdp-leading-editorial);
  font-weight: 700;
  color: var(--sdp-accio-text);
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

:focus-visible { outline: 3px solid var(--sdp-focus); outline-offset: 2px; border-radius: 4px; }
/* Sobre superfícies fosques, l'anell de focus és taronja */
.app-sidebar :focus-visible,
header.bar-black :focus-visible,
header.bar-blue :focus-visible,
.mobile-nav :focus-visible,
.sp-card-footer :focus-visible,
.fab-button:focus-visible { outline-color: var(--sdp-accent-text); }

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
}

/* ── 3. COLUMNA 1 · SIDEBAR ────────────────────────────────────── */
nav.app-sidebar {
  flex: 0 0 var(--sdp-col-sidebar);
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--sdp-fons-invers);
  color: var(--sdp-text-invers);
  position: relative;
  z-index: var(--z-sidebar);
  overscroll-behavior: contain;
}
/* L'últim bloc (menú) absorbeix l'alçada restant i fa scroll propi */
nav.app-sidebar > div:last-child {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--sdp-text-suau) transparent;
}

.brand {
  height: var(--sdp-alt-negra);
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--sdp-space-6);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.brand img { width: 100%; max-width: 180px; height: auto; object-fit: contain; }

.sidebar-control-btn {
  display: flex;
  text-transform: uppercase;
  align-items: center;
  justify-content: center;
  flex: none;
  height: var(--sdp-alt-accio);
  background: var(--sdp-accio-forta);
  color: var(--sdp-text-invers);
  text-decoration: none;
  font-weight: 800;
  font-size: 1rem;
  padding: 0 var(--sdp-space-6);
  border: none;
  width: 100%;
  text-align: center;
  cursor: pointer;
  
  letter-spacing: 0.05em;
  transition: background var(--sdp-t);
}
.sidebar-control-btn:hover { background: var(--sdp-accio-hover); }
.sidebar-control-btn:active { background: var(--sdp-accio-forta); }

.nav-item {
  display: block;
  padding: var(--sdp-space-3) var(--sdp-space-4);
  margin-bottom: var(--sdp-space-1);
  border-radius: var(--sdp-radi-m);
  color: rgba(255,255,255,0.78);
  text-decoration: none;
  font-weight: 600;
  transition: background var(--sdp-t), color var(--sdp-t);
}
.nav-item:hover { background: rgba(255,255,255,0.09); color: var(--sdp-text-invers); }
.nav-item.active { background: var(--sdp-accent); color: var(--sdp-sobre-accent); }
.nav-item.active:hover { background: var(--sdp-accent-hover); }

/* ── 4. COLUMNA 2 · LLISTA CONTEXTUAL (opcional) ───────────────
   Esta demo no la inclou; l'app real (xats, llocs…) només ha de
   muntar <aside class="app-list"> entre la sidebar i el visor.   */
aside.app-list {
  flex: 0 0 var(--sdp-col-llista);
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--sdp-fons-targeta);
  border-right: 1px solid var(--sdp-vora);
  scrollbar-width: thin;
  scrollbar-color: var(--sdp-vora-forta) transparent;
}
@media (max-width: 1440px) { aside.app-list { flex-basis: 320px; } }

/* ── 5. COLUMNA 3 · VISOR — BARRES GLOBALS ─────────────────────── */
header.bar-black {
  height: var(--sdp-alt-negra);
  flex: none;
  background: var(--sdp-fons-invers);
  color: var(--sdp-text-invers);
  display: flex;
  align-items: center;
  padding: 0 var(--sdp-space-6);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: sticky;
  top: 0;
  z-index: var(--z-barra-negra);
}
.bar-black .right-icons { display: flex; align-items: center; gap: var(--sdp-space-2); margin-left: auto; }
.bar-black .right-icons .icon { width: var(--sdp-touch); height: var(--sdp-touch); padding: 6px; opacity: 0.8; cursor: pointer; transition: opacity var(--sdp-t), transform var(--sdp-t); }
.bar-black .right-icons .icon:hover { opacity: 1; transform: translateY(-1px); }
.bar-black .right-icons .icon img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
.bar-black .right-icons .icon:has(img) { width: 48px; height: 48px; }
@keyframes sdp-iaia-pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.iaia-icon {
  fill: #ff6b00; /* Orange color to match the old IAIA circular avatar */
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
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 var(--sdp-space-6);
  position: sticky;
  top: var(--sdp-alt-negra);
  z-index: var(--z-barra-blava);
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
}

/* Col·locació explícita a la reixeta dels components atòmics */
/* .bar-blue has 3 elements: Left, Center, Right */
header.bar-blue > *:first-child { grid-column: 1; justify-self: start; }
header.bar-blue > *:nth-child(2) { grid-column: 2; justify-self: center; }
header.bar-blue > *:last-child { grid-column: 3; justify-self: end; }




.bar-orange .bar-actions { flex: none; white-space: nowrap; }

/* Títol de pàgina */
header.page-title {
  flex: none;
  background: var(--sdp-fons-targeta);
  border-radius: 0 0 var(--sdp-radi-xl) var(--sdp-radi-xl);
  padding: var(--sdp-space-8) var(--sdp-space-10);
  text-align: center;
  margin: 0 var(--sdp-space-10) var(--sdp-space-8);
  box-shadow: var(--sdp-ombra-2);
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
.page-title-logo { display: block; width: 600px; max-width: 100%; height: auto; margin: 0 auto 16px; object-fit: contain; }
.page-title-labels { margin-top: 32px; margin-bottom: 32px; display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; }
.page-title-copyright { margin-bottom: 0; text-align: center; color: var(--sdp-text-suau); font-size: var(--sdp-text-meta); letter-spacing: 0.05em; }



/* ── 6. CONTINGUT EDITORIAL ────────────────────────────────────── */
article.content-wrapper {
  flex: none;
  padding: 0 var(--sdp-pad-contenidor) var(--sdp-pad-contenidor);
  width: 100%;
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
  border-bottom: 1px solid var(--sdp-vora);
  padding-bottom: 12px;
  margin-bottom: 28px;
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
.sw-pedra-75 { background: var(--sdp-pedra-75); color: var(--sdp-pedra-900); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); }
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
.sw-secondary-700 { background: var(--sdp-secondary-700); color: #ffffff; }
.sw-error-500 { background: var(--sdp-error-500); color: #ffffff; }
.sw-avis-500 { background: var(--sdp-avis-500); color: #ffffff; }
.sw-exit-500 { background: var(--sdp-exit-500); color: #ffffff; }
.swatch-info { line-height: 1.5; }

/* Previsualització CMS (contingut editorial universal) */
.cms-preview {
  border: 1px solid var(--sdp-vora);
  padding: var(--sdp-space-8);
  border-radius: var(--sdp-radi-m);
  background: var(--sdp-fons-targeta);
  position: relative;
  margin-top: var(--sdp-space-4);
  box-shadow: var(--sdp-ombra-1);
}
.cms-badge {
  position: absolute; top: 12px; right: 16px;
  font-size: 0.7rem; font-weight: 700; color: var(--sdp-text-suau);
   letter-spacing: 0.1em;
}
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
.btn-danger { background: var(--sdp-error); color: #ffffff; }
.btn-danger:hover:not(:disabled) { background: var(--sdp-error-text); }
.btn-ghost { background: transparent; color: var(--sdp-text-titol); border: 1px solid var(--sdp-vora); }
.btn-ghost:hover:not(:disabled) { background: rgba(14,13,12,0.06); border-color: var(--sdp-text-suau); }
.btn-sm { padding: var(--sdp-space-2) var(--sdp-space-4); font-size: 0.85rem; }
.btn-lg { padding: var(--sdp-space-4) var(--sdp-space-8); font-size: 1.15rem; }
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

/* 7.5 Taules */
.table-wrapper { overflow-x: auto; margin-bottom: var(--sdp-space-8); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); background: var(--sdp-fons-targeta); }
table { width: 100%; border-collapse: collapse; text-align: left; }
th { background: var(--sdp-fons-subtil); padding: var(--sdp-space-4); font-size: 0.8rem; font-weight: 700;  color: var(--sdp-text-suau); border-bottom: 2px solid var(--sdp-vora); }
td { padding: var(--sdp-space-4); border-bottom: 1px solid var(--sdp-vora); font-size: 0.95rem; }
tr:last-child td { border-bottom: none; }
tbody tr { transition: background var(--sdp-t); }
tbody tr:hover { background: var(--sdp-accent-subtil); }
.table-zebra tr:nth-child(even) { background: var(--sdp-fons-subtil); }
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
.spinner-group { display: flex; align-items: flex-end; gap: 24px; margin-bottom: var(--sdp-space-8); }
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
  border-bottom: 1px solid var(--sdp-vora);
  transition: background var(--sdp-t);
  list-style: none;
}
summary.accordion-header::-webkit-details-marker { display: none; }
.accordion-header:hover, summary.accordion-header:hover { background: var(--sdp-fons-subtil); }
.accordion-header svg, summary.accordion-header svg { flex: none; transition: transform var(--sdp-t); }
details[open] summary.accordion-header svg { transform: rotate(180deg); }
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
.dl-horizontal { display: grid; grid-template-columns: 120px 1fr; gap: 8px 16px; margin-bottom: var(--sdp-space-6); }
.dl-horizontal dt { font-weight: 700; color: var(--sdp-text-titol); }
.dl-horizontal dd { margin: 0; color: var(--sdp-text-titol); }

/* 7.20 Indicadors (UniversalIndicatorCard) */
.sdp-indicator-card {
  background: var(--sdp-fons-targeta);
  border: 1px solid transparent;
  border-radius: var(--sdp-radi-g);
  padding: var(--sdp-space-6) var(--sdp-space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all var(--sdp-t);
}

.sdp-indicator-card:hover {
  background: var(--sdp-fons-app);
  border-color: var(--sdp-vora);
  box-shadow: var(--sdp-ombra-1);
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
  font-size: 1rem;
  color: var(--sdp-text-blau);
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.sdp-indicator-card-subtitle {
  font-size: 0.85rem;
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
}

/* Targeta Mestra enllaçable: overlay a z1, capa interactiva a z2 */
.sp-card { position: relative; }
.sp-card-link-overlay { position: absolute; inset: 0; z-index: 1; border-radius: inherit; outline: none; }
.sp-card-link-overlay:focus-visible { box-shadow: 0 0 0 3px var(--sdp-focus) inset; }
.sp-card-header, .sp-card-footer, .sp-card-author-link, .sp-card-author-block, .btn-icon-orange, .btn-date-time, .sp-card-action, .sp-card-connect, .sp-card-labels, .sp-card-copyright, .sp-card-body a, .sp-card-body span[onClick] { position: relative; z-index: 2; }
.sp-card-author-link, .sp-card-author-block { display: flex; align-items: center; min-width: 0; flex: 1; }

/* Etiquetes de la Targeta Mestra i Sistema de Badges */
.sdp-badges-container, .sp-card-labels { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--sdp-space-2); margin-top: var(--sdp-space-3); margin-bottom: var(--sdp-space-4); list-style: none; padding: 0; }
.sdp-badges-container li, .sp-card-labels li { list-style: none; padding: 0; margin: 0; }
.sdp-badge, .sp-card-labels .sp-card-label, .sp-card-label { display: inline-flex; align-items: center; justify-content: center; height: 24px; padding: 0 12px; border-radius: 12px; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.05em; white-space: nowrap; }

/* Sistema de Badges Universals (Taxonomia 2026) */
.sdp-badge-system { background: var(--sdp-accio); color: var(--sdp-sobre-accio); }
:root[data-theme="dark"] .sdp-badge-system, :host([data-theme="dark"]) .sdp-badge-system { background: var(--sdp-accent); color: var(--sdp-sobre-accent); }
.sdp-badge-accent { background: var(--sdp-accent); color: var(--sdp-sobre-accent); }
:root[data-theme="dark"] .sdp-badge-accent, :host([data-theme="dark"]) .sdp-badge-accent { background: var(--sdp-accio); color: var(--sdp-sobre-accio); }
.sdp-badge-category { background: var(--sdp-accio-subtil); color: var(--sdp-accio-text); }
.sdp-badge-tag { background: var(--sdp-exit-fons); color: var(--sdp-exit-text); }
.sdp-badge-neutral { background: var(--sdp-fons-subtil); color: var(--sdp-text-titol); }

/* Retrocompatibilitat */

/* Tooltip (Bocata) */
.tooltip-container { position: relative; display: inline-flex; z-index: 3; }
.tooltip-text {
  visibility: hidden; opacity: 0;
  background-color: var(--sdp-fons-invers); color: var(--sdp-text-invers);
  text-align: center; border-radius: 4px; padding: 6px 10px;
  position: absolute; z-index: 4;
  top: 100%; left: 50%; transform: translateX(-50%) translateY(8px);
  font-size: 0.75rem; font-weight: 700; white-space: nowrap;
  transition: opacity var(--sdp-t), visibility var(--sdp-t), transform var(--sdp-t);
  pointer-events: none;
}
.tooltip-container:hover .tooltip-text { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(4px); }
.tooltip-text::after {
  content: ""; position: absolute; bottom: 100%; left: 50%; margin-left: -5px;
  border-width: 5px; border-style: solid; border-color: transparent transparent var(--sdp-pedra-900) transparent;
}

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

.sp-card-media { width: 100%; aspect-ratio: 1 / 1; display: block; object-fit: cover; object-position: top; background: var(--sdp-fons-subtil); vertical-align: top; }

.sp-card-body { padding: 22px 24px 16px; text-align: left; position: relative; min-width: 0; }
.sp-card-body:has(.sp-card-title:only-child) { text-align: center; }
.sp-card-title { font-size: 1.4rem; color: var(--sdp-accio-text); font-weight: 800; line-height: var(--sdp-leading-tight); margin: 0 0 var(--sdp-space-2) 0; flex: 1; text-align: center; }

.sp-card-main-button, .sp-card-main-link {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  text-align: inherit;
}
.sp-card-main-button:hover, .sp-card-main-link:hover {
  text-decoration: underline;
}

.sp-card-content-link {
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-decoration: none;
  color: inherit;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  text-align: inherit;
  width: 100%;
  cursor: pointer;
}
.sp-card-content-link:hover .sp-card-media {
  opacity: 0.95;
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
/* Si hi ha preu o etiqueta a dalt a la dreta, tot s'alinea a l'esquerra per a equilibrar el pes visual */
.sp-card .sp-card-body:has(.sp-card-price) h1,
.sp-card .sp-card-body:has(.sp-card-price) h2,
.sp-card .sp-card-body:has(.sp-card-price) .sp-card-title,
.sp-card .sp-card-body:has(.sp-card-price) .sp-card-subtitle,
.sp-card-body:has(.sp-card-price) p:not(.sp-card-copyright),
.sp-card-body:has(.sp-card-price) .sp-card-text,
.sp-card .sp-card-body:has(.sp-card-calendar-badge) h1,
.sp-card .sp-card-body:has(.sp-card-calendar-badge) h2,
.sp-card .sp-card-body:has(.sp-card-calendar-badge) .sp-card-title,
.sp-card .sp-card-body:has(.sp-card-calendar-badge) .sp-card-subtitle,
.sp-card-body:has(.sp-card-calendar-badge) p:not(.sp-card-copyright),
.sp-card-body:has(.sp-card-calendar-badge) .sp-card-text {
  text-align: left;
}
.sp-card-copyright {
  text-align: center;
}

.sp-card-title:only-child { text-align: center; flex: none; width: 100%; }
.sp-card-price { float: right; margin-left: 6px; margin-bottom: 6px; font-size: 1.2rem; font-weight: 800; color: var(--sdp-accio-text); background: var(--sdp-accio-subtil); padding: 4px 12px; border-radius: var(--sdp-radi-pastilla); white-space: nowrap; }
.sp-card-subtitle { font-size: 1.15rem; color: var(--sdp-accent-titol); font-weight: 700; line-height: var(--sdp-leading-snug); margin-top: var(--sdp-space-4); margin-bottom: var(--sdp-space-3); text-align: center; }
.sp-card-text { font-size: 1rem; color: var(--sdp-text-suau); font-weight: 500; line-height: var(--sdp-leading-body); margin-bottom: var(--sdp-space-6); text-align: center; margin-left: auto; margin-right: auto; }

.sp-card-copyright { color: var(--sdp-text-suau); font-size: var(--sdp-text-meta);  letter-spacing: 0.05em; }
.sp-card-footer { 
  background: var(--sdp-accio); 
  padding: var(--sdp-space-3) var(--sdp-space-4); 
  display: flex; justify-content: space-between;
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
  justify-self: center;
  margin: 0;
  padding: 0;
}
.sp-card-footer .sp-card-actions { margin-left: var(--sdp-space-1); }
.sp-card-action { background: transparent; border: none; color: currentColor; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; height: var(--sdp-space-12); width: var(--sdp-space-12); opacity: 0.9; transition: opacity var(--sdp-t), transform var(--sdp-t); }
.sp-card-action .icon { width: 30px; height: 30px; stroke-width: 2.5; display: block; margin: auto; }
.sp-card-action:hover { opacity: 1; transform: translateY(-1px); }
.sp-card-connect { background: var(--sdp-accio-forta); border: none; color: var(--sdp-text-invers); font-weight: 600; text-transform: uppercase; font-size: 0.8rem; cursor: pointer; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center; height: var(--sdp-space-12); padding: 0 var(--sdp-space-5); border-radius: var(--sdp-radi-pastilla); white-space: nowrap; transition: transform var(--sdp-t), opacity var(--sdp-t); margin-left: auto; }
.sp-card-connect:hover { transform: scale(1.02); opacity: 0.95; }

/* 7.22 Estadístiques i dashboards */
.stat-card { display: flex; align-items: center; gap: var(--sdp-space-4); background: var(--sdp-fons-targeta); border: 1px solid var(--sdp-vora); padding: var(--sdp-space-4); border-radius: var(--sdp-radi-s); box-shadow: var(--sdp-ombra-1); transition: transform var(--sdp-t), box-shadow var(--sdp-t), border-color var(--sdp-t); }
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--sdp-ombra-2); border-color: var(--sdp-vora-control); }
.stat-icon { font-size: 2rem; flex: none; }
.stat-info { display: flex; flex-direction: column; min-width: 0; }
.stat-value { font-size: 1.5rem; font-weight: 700; color: var(--sdp-text-titol); line-height: 1; margin-bottom: var(--sdp-space-1); }
.stat-label { font-size: 0.85rem; color: var(--sdp-text-suau);  }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--sdp-space-4); margin-bottom: var(--sdp-space-6); }
.dashboard-panel { background: var(--sdp-fons-targeta); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); overflow: hidden; margin-bottom: var(--sdp-space-6); }
.dashboard-header { background: var(--sdp-fons-subtil); padding: var(--sdp-space-3) var(--sdp-space-4); border-bottom: 1px solid var(--sdp-vora); font-weight: 700; text-align: center; color: var(--sdp-text-titol); display: flex; align-items: center; justify-content: center; gap: var(--sdp-space-2); }
.dashboard-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--sdp-vora); }
.sdp-card-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sdp-space-6); align-items: start; }
@media (max-width: 1400px) { .sdp-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 800px) { .sdp-card-grid { grid-template-columns: minmax(0, 1fr); } }

.dashboard-item { background: var(--sdp-fons-targeta); padding: 24px 16px; text-align: center; }
.dashboard-item-value { font-size: 1.25rem; font-weight: 700; color: var(--sdp-text-titol); margin-bottom: var(--sdp-space-1); }
.dashboard-item-label { font-size: 0.75rem; color: var(--sdp-text-suau);  }
.dashboard-footer { padding: 8px; text-align: center; font-size: 0.75rem; color: var(--sdp-text-suau); background: var(--sdp-fons-subtil); border-top: 1px solid var(--sdp-vora); }

/* 7.23 Cerca i filtratge */
.search-bar-basic { display: flex; margin-bottom: var(--sdp-space-6); }
.search-bar-basic input { flex: 1; min-width: 0; padding: var(--sdp-space-3) var(--sdp-space-4); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s) 0 0 var(--sdp-radi-s); outline: none; font-size: 1rem; transition: border-color var(--sdp-t), box-shadow var(--sdp-t); }
.search-bar-basic button { background: var(--sdp-fons-invers); color: var(--sdp-text-invers); border: none; padding: 0 var(--sdp-space-6); border-radius: 0 var(--sdp-radi-s) var(--sdp-radi-s) 0; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: var(--sdp-space-2); white-space: nowrap; transition: background var(--sdp-t); }
.search-bar-basic button:hover { background: var(--sdp-fons-invers); }
.search-filters { display: flex; gap: var(--sdp-space-4); margin-bottom: var(--sdp-space-6); }
.search-filters input, .search-filters select { padding: var(--sdp-space-3) var(--sdp-space-4); border: 1px solid var(--sdp-vora-control); border-radius: var(--sdp-radi-s); outline: none; font-size: 1rem; background-color: var(--sdp-fons-targeta); color: var(--sdp-text-cos); transition: border-color var(--sdp-t), box-shadow var(--sdp-t); }
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

/* ── 8. FAB (només escriptori) ─────────────────────────────────── */
.fab-button {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--sdp-accio);
  color: var(--sdp-sobre-accio);
  border: none;
  box-shadow: 0 4px 12px rgba(1,110,191,0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: var(--z-fab);
  transition: transform var(--sdp-t), box-shadow var(--sdp-t), background var(--sdp-t);
}
.fab-button:hover { transform: translateY(-2px) scale(1.05); box-shadow: 0 10px 24px rgba(1,110,191,0.48); background: var(--sdp-accio-hover); }
.fab-button:active { transform: scale(0.96); }
.fab-button svg { width: 24px; height: 24px; }

/* ── 9. UTILITATS sdp-* ────────────────────────────────────────── */
.text-center { text-align: center; }
.sdp-ocult { display: none !important; }
.sdp-text-exit { color: var(--sdp-exit); }
.sdp-text-error { color: var(--sdp-error); }
.sdp-text-avis { color: var(--sdp-avis); }
.sdp-text-info { color: var(--sdp-info); }

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
    box-shadow: var(--sdp-ombra-4);
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
  :host(:has(.app-sidebar.sidebar-open))::after {
    opacity: 1;
    pointer-events: auto;
  }

  /* El logo actua com a botó (sense hamburguesa addicional) */
  .mobile-logo-wrapper { display: flex; align-items: center; justify-content: center; }

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
    color: #ffffff;
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
    transform: translateY(-8px);
    box-shadow: 0 8px 20px rgba(0,73,131,0.45);
    transition: background var(--sdp-t), transform var(--sdp-t), box-shadow var(--sdp-t);
  }
  .mobile-nav__cta:hover { background: var(--sdp-accio-hover); }
  .mobile-nav__cta:active { background: var(--sdp-accio-forta); transform: translateY(-8px) scale(0.94); }
  .mobile-nav__cta svg { width: 24px; height: 24px; }

  /* El FAB d'escriptori desapareix (el substitueix el CTA central) */
  .fab-button { display: none !important; }

  /* Densitat de les barres */
  header.bar-black, header.bar-blue, section.bar-orange { padding: 0 var(--sdp-space-4); }
  .brand { padding: 0 var(--sdp-space-5); }
  header.page-title { margin: 0 var(--sdp-space-4) var(--sdp-space-5); padding: var(--sdp-space-6) var(--sdp-space-5); border-radius: 0 0 var(--sdp-radi-g) var(--sdp-radi-g); } }

/* ══ TAULETA XICOTETA I MÒBIL · ≤720px ════════════════════════ */
@media (max-width: 720px) {

  .palette { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: var(--sdp-space-4); }
  .grid-preview { flex-direction: column; }
  .lists-preview, .utils-grid { grid-template-columns: 1fr; }
  .dashboard-grid { grid-template-columns: repeat(2, 1fr); }
  .search-filters { flex-direction: column; }
  .search-filters input, .search-filters select, .search-filters button { flex: none; width: 100%; }
  .pagination-simple { flex-direction: column; }
  .steps-container { overflow-x: auto; justify-content: flex-start; padding-bottom: 8px; }
  
  .tabs, .nav-bar { overflow-x: auto; scrollbar-width: none; }
  .cms-preview { padding: 20px; }
  .modal-preview { padding: 20px; }
  th, td { padding: 12px; }
  .spinner-group { gap: var(--sdp-space-4); }
  .btn-group { gap: var(--sdp-space-3); }
  section.design-block { margin-bottom: var(--sdp-space-12); }
  header.page-title { margin-bottom: var(--sdp-space-4); } }

/* ══ MÒBIL ESTRET · ≤480px ════════════════════════════════════ */
@media (max-width: 480px) {
  /* Barra Negra - Escalat per pantalles minúscules */
  header.bar-black { padding: 0 8px; }
  .mobile-logo-wrapper { width: 135px; }
  .mobile-logo-wrapper img { width: 112px; }
  header.bar-black .right-icons { gap: 0; margin-left: auto; }
  header.bar-black .right-icons .icon { width: 36px; height: 36px; min-width: 36px; min-height: 36px; padding: 6px; }
  header.bar-black .right-icons img.icon { width: 28px; height: 28px; min-width: 28px; min-height: 28px; }
  header.bar-black .right-icons svg { width: 22px; height: 22px; stroke-width: 2; }

  /* Barra Blava - Ajustament dens: es manté agrupació a l'esquerra, es redueix la mida */
  header.bar-blue { padding: 0 8px; grid-template-columns: auto auto 1fr; }
  header.bar-blue > *:nth-child(2) { justify-self: start; margin-left: 0; }
  .bar-blue-left { gap: 0; }
  .sp-card-actions { gap: 0; }
  .bar-blue .sp-card-actions { position: static; transform: none; }
  .sp-card-action { width: 36px; height: 36px; min-width: 36px; min-height: 36px; }
  .sp-card-action .icon { width: 22px; height: 22px; stroke-width: 2; display: block; margin: auto; }
  .sp-card-connect { padding: 0 8px; font-size: 0.7rem; letter-spacing: 0; height: 32px; min-height: 32px; }

  .swatch-color { height: 80px; padding: 12px; }
  .btn { padding: 11px 20px; font-size: 0.95rem; }
  .btn-lg { padding: 14px 24px; font-size: 1.05rem; }
  header.page-title { margin: 0 12px 14px; }
  nav.mobile-nav { left: 8px; right: 8px; padding: 8px 10px; border-radius: 22px; }
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
.sdp-flex { display: flex; }
.sdp-grid { display: grid; }
.sdp-flex-col { display: flex; flex-direction: column; }
.sdp-items-center { align-items: center; }
.sdp-justify-center { justify-content: center; }
.sdp-justify-between { justify-content: space-between; }
.sdp-text-center { text-align: center; }
.sdp-text-left { text-align: left; }

.sdp-gap-4 { gap: var(--sdp-space-1); }
.sdp-gap-8 { gap: var(--sdp-space-2); }
.sdp-gap-12 { gap: var(--sdp-space-3); }
.sdp-gap-16 { gap: var(--sdp-space-4); }
.sdp-gap-20 { gap: var(--sdp-space-6); }
.sdp-gap-28 { gap: var(--sdp-space-8); }
.sdp-gap-48 { gap: var(--sdp-space-12); }

.sdp-m-0 { margin: var(--sdp-space-0); }
.sdp-mb-0 { margin-bottom: var(--sdp-space-0); }
.sdp-mb-1 { margin-bottom: var(--sdp-space-1); }
.sdp-mb-2 { margin-bottom: var(--sdp-space-2); }
.sdp-mb-3 { margin-bottom: var(--sdp-space-3); }
.sdp-mb-6 { margin-bottom: var(--sdp-space-6); }
.sdp-mb-20 { margin-bottom: var(--sdp-space-20); }

.sdp-mt-0 { margin-top: var(--sdp-space-0); }
.sdp-mt-2 { margin-top: var(--sdp-space-2); }
.sdp-mt-4 { margin-top: var(--sdp-space-4); }
.sdp-mt-6 { margin-top: var(--sdp-space-6); }
.sdp-mt-12 { margin-top: var(--sdp-space-12); }

.sdp-p-0 { padding: var(--sdp-space-0); }
.sdp-p-2 { padding: var(--sdp-space-2); }
.sdp-p-4 { padding: var(--sdp-space-4); }
.sdp-p-6 { padding: var(--sdp-space-6); }
.sdp-p-10 { padding: var(--sdp-space-10); }

/* --- Botons UI TopBar --- */
.sdp-top-bar-btn {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  border-radius: var(--sdp-radius-md);
}

.sdp-top-bar-btn:hover {
  background-color: var(--sdp-color-surface-hover);
}

.sdp-top-bar-btn:focus-visible {
  outline: 2px solid var(--sdp-color-focus);
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
    .sdp-scroll-reveal {
      animation: sdp-reveal linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 30%;
    }

    @keyframes sdp-reveal {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Parallax per a capçaleres */
    .sdp-parallax-bg {
      animation: sdp-parallax linear both;
      animation-timeline: scroll();
      animation-range: 0 100vh;
      transform-origin: top center;
    }

    @keyframes sdp-parallax {
      to { transform: translateY(20%) scale(1.05); opacity: 0.6; }
    }
  }
}

/* --- 3. Mode Bancal (Accessibilitat Visual) --- */
@media (prefers-contrast: more) {
  :root, :host {
    --sdp-color-text-body: #000000;
    --sdp-color-text-heading: #000000;
    --sdp-color-border-subtle: #000000;
    --sdp-color-bg-base: #FFFFFF;
    --sdp-shadow-sm: none;
    --sdp-shadow-md: none;
    --sdp-shadow-elevate: none;
  }
  
  .sdp-card {
    border: 2px solid #000000 !important;
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
.sdp-card {
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.2s ease,
              opacity 0.15s ease;
  will-change: transform, opacity;
}

.sdp-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--sdp-shadow-elevate);
}

/* === TOC DRAWER === */
.toc-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  animation: sdp-fade-in var(--sdp-t-rapida) ease-out;
}

.toc-drawer {
  width: 85%;
  max-width: 320px;
  height: 100%;
  background: var(--sdp-fons-targeta);
  box-shadow: var(--sdp-ombra-5);
  overflow-y: auto;
  animation: slideInLeft var(--sdp-t-normal) ease-out;
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
  color: var(--sdp-text-normal);
  font-size: 0.95rem;
  cursor: pointer;
  border-radius: var(--sdp-radi-s);
  transition: background var(--sdp-t-rapida), color var(--sdp-t-rapida);
}
.toc-item button:hover, .toc-item button:focus-visible {
  background: var(--sdp-fons-subtil);
  color: var(--sdp-text-titol);
}

.toc-level-1 { margin-left: 0; margin-top: var(--sdp-space-4); }
.toc-level-1:first-child { margin-top: 0; }
.toc-level-1 button { font-weight: 800; font-size: 0.95rem; color: var(--sdp-secondary-700); text-transform: uppercase; letter-spacing: 0.05em; }
.toc-level-1 button:hover, .toc-level-1 button:focus-visible { color: var(--sdp-secondary-600); }

.toc-level-2 { margin-left: 0; margin-top: var(--sdp-space-2); }
.toc-level-2 button { font-weight: 700; font-size: 0.95rem; color: var(--sdp-primary-700); }
.toc-level-2 button:hover, .toc-level-2 button:focus-visible { color: var(--sdp-primary-600); }

.toc-level-3 { margin-left: 0; }
.toc-level-3 button { font-weight: 600; font-size: 0.95rem; color: var(--sdp-secondary-600); }
.toc-level-3 button:hover, .toc-level-3 button:focus-visible { color: var(--sdp-secondary-500); }

.toc-level-4 { margin-left: 0; }
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
.sp-card-body--with-aside {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--sdp-space-4);
  align-items: start;
}

.sp-card-calendar-badge {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 128px;
  height: 128px;
  background-color: var(--sdp-primary-100);
  color: var(--sdp-accio-text);
  border-radius: var(--sdp-radi-xl);
  margin-bottom: var(--sdp-space-4);
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

.sdp-badge-poble {
  background: var(--sdp-fons-targeta);
  color: var(--sdp-text-titol);
  border: 1px solid var(--sdp-vora);
  border-radius: var(--sdp-radi-pastilla);
  padding: 4px 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.sdp-badge-poble--actiu {
  background: var(--sdp-accio);
  color: var(--sdp-sobre-accio);
  border-color: var(--sdp-accio);
}

:root[data-theme="dark"] .sp-card-calendar-badge, :host([data-theme="dark"]) .sp-card-calendar-badge {
  background-color: var(--sdp-accio-text);
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
  font-family: var(--sdp-font-family-display, inherit);
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

.sdp-filtres__vistes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sdp-space-2);
}

.sdp-filtre--vista, .sdp-filtre--accio, .sdp-filtre--camp input, .sdp-filtre--camp select {
  min-block-size: var(--sdp-touch-comode); /* 48px */
}

/* Blau per a arquitectura / vistes */
.sdp-filtre--vista {
  padding-inline: var(--sdp-space-5);
  background: var(--sdp-accio);
  color: var(--sdp-sobre-accio);
  border: 1px solid var(--sdp-accio);
  border-radius: var(--sdp-radi-pastilla);
  font-weight: 800;
  cursor: pointer;
}

/* Taronja per a estat/mode actiu */
.sdp-filtre--vista[aria-pressed="true"] {
  background: var(--sdp-accent);
  color: var(--sdp-sobre-accent);
  border: 1px solid var(--sdp-accent-hover);
  box-shadow: inset 0 -4px 0 var(--sdp-accent-hover);
}

.sdp-filtre--vista:focus-visible, .sdp-filtre--accio:focus-visible, .sdp-filtre--camp :is(input, select):focus-visible {
  outline: 3px solid var(--sdp-focus);
  outline-offset: 2px;
}

.sdp-filtre--camp {
  display: flex;
  flex-direction: column;
  gap: var(--sdp-space-1);
}

.sdp-filtre--camp span {
  font-size: var(--sdp-text-meta);
  font-weight: 700;
  color: var(--sdp-text-suau);
}

.mur-filter input, .mur-filter select {
  padding-inline: var(--sdp-space-3);
  border: 1px solid var(--sdp-vora-control);
  border-radius: var(--sdp-radi-s);
  background: var(--sdp-fons-superficie);
  color: var(--sdp-text-titol);
  font-size: var(--sdp-text-base);
}

.mur-map {
  background: var(--sdp-accent);
  color: var(--sdp-sobre-accent);
  border: none;
  border-radius: var(--sdp-radi-s);
  font-weight: 700;
  padding-inline: var(--sdp-space-4);
  cursor: pointer;
}

@media (max-width: 720px) {
  .mur-filters {
    grid-template-columns: 1fr;
  }
}

/* ── BADGES POBLE (Auditoria Grok) ── */
.label-poble-actiu { background: var(--sdp-exit-fons); color: var(--sdp-exit-text); }
.label-fototeca    { background: var(--sdp-accio-subtil); color: var(--sdp-accio-text); }
.label-mapa        { background: var(--sdp-accent-subtil); color: var(--sdp-accent-text-hover); }
.label-festes      { background: var(--sdp-avis-fons); color: var(--sdp-avis-text); }

```

## Fitxer: src/pages/features/sosp-components.css

```css
/* ==========================================================
   CSS PUR PER ALS COMPONENTS SOSP (Arquitectura Pedra Seca)
   ========================================================== */

/* H2 & H3 Titles */
.sosp-h2 {
  font-size: 1.875rem;
  font-weight: 800;
  color: #1A1A1A;
  border-bottom: 2px solid #E7E5E4;
  padding-bottom: 0.5rem;
}
.sosp-h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #292524;
}

/* Cards */
.sosp-card {
  background-color: #FFFFFF;
  border: 1px solid #D6D3D1;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

/* Buttons */
.sosp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}
.sosp-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Button Variants */
.sosp-btn-primari {
  background-color: #f97316;
  color: #FFFFFF;
  padding: 0.625rem 1.25rem;
}
.sosp-btn-primari:hover:not(:disabled) { background-color: #ea580c; }

.sosp-btn-secundari {
  background-color: #0984E3;
  color: #FFFFFF;
  padding: 0.625rem 1.25rem;
}
.sosp-btn-secundari:hover:not(:disabled) { background-color: #076aba; }

.sosp-btn-perill {
  background-color: #DC2626;
  color: #FFFFFF;
  padding: 0.625rem 1.25rem;
}
.sosp-btn-perill:hover:not(:disabled) { background-color: #B91C1C; }

.sosp-btn-terciari {
  background-color: #FFFFFF;
  color: #1A1A1A;
  border: 1.5px solid #D6D3D1;
  padding: 0.625rem 1.25rem;
}
.sosp-btn-terciari:hover:not(:disabled) { background-color: #F5F5F4; }

.sosp-btn-neutral {
  background-color: #0e0e10;
  color: #FFFFFF;
  padding: 0.625rem 1.25rem;
}
.sosp-btn-neutral:hover:not(:disabled) { background-color: #000000; }

.sosp-btn-fantasma {
  background-color: transparent;
  color: #1A1A1A;
  border: 1.5px solid #D6D3D1;
  padding: 0.625rem 1.25rem;
}
.sosp-btn-fantasma:hover:not(:disabled) { background-color: #F5F5F4; }

.sosp-btn-enllac {
  background-color: transparent;
  color: #f97316;
  padding: 0;
}
.sosp-btn-enllac:hover:not(:disabled) { text-decoration: underline; }

/* Button Sizes */
.sosp-btn-sm { font-size: 0.875rem; padding: 0.375rem 0.875rem; }
.sosp-btn-lg { font-size: 1.125rem; padding: 0.875rem 1.75rem; }

/* Forms */
.sosp-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1C1917;
  margin-bottom: 0.25rem;
}
.sosp-input, .sosp-select, .sosp-textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1.5px solid #D6D3D1;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  color: #1C1917;
  background-color: #FFFFFF;
  transition: border-color 0.15s ease;
}
.sosp-input:focus, .sosp-select:focus, .sosp-textarea:focus {
  outline: none;
  border-color: #8B4513;
}
.sosp-input:disabled {
  background-color: #F5F5F4;
  cursor: not-allowed;
}
.sosp-input-error {
  border-color: #DC2626;
}
.sosp-text-error {
  font-size: 0.75rem;
  color: #DC2626;
}

/* Badges & Tags */
.sosp-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  white-space: nowrap;
}
.sosp-badge-default { background-color: #F5F5F4; color: #44403C; }
.sosp-badge-primari { background-color: #8B4513; color: #FFFFFF; }
.sosp-badge-exit { background-color: #DCFCE7; color: #166534; }
.sosp-badge-avis { background-color: #FEF9C3; color: #854D0E; }
.sosp-badge-perill { background-color: #FEE2E2; color: #991B1B; }
.sosp-badge-info { background-color: #DBEAFE; color: #1E40AF; }

.sosp-tag {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  background-color: #F5F5F4;
  color: #292524;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
}

/* Alerts */
.sosp-alert {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid transparent;
}
.sosp-alert-icon { font-size: 1.25rem; }
.sosp-alert-info { background-color: #EFF6FF; border-left-color: #3B82F6; color: #1E3A8A; }
.sosp-alert-success { background-color: #F0FDF4; border-left-color: #22C55E; color: #14532D; }
.sosp-alert-warning { background-color: #FFFBEB; border-left-color: #F59E0B; color: #78350F; }
.sosp-alert-error { background-color: #FEF2F2; border-left-color: #EF4444; color: #7F1D1D; }

/* Tables */
.sosp-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.sosp-table th, .sosp-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #E7E5E4;
}
.sosp-table th {
  background-color: #F5F5F4;
  font-weight: 600;
  color: #44403C;
}
.sosp-table-zebra tbody tr:nth-child(even) { background-color: #FAFAF9; }

/* Navbar & Breadcrumbs */
.sosp-navbar {
  background-color: #FFFFFF;
  border: 1px solid #E7E5E4;
  border-radius: 0.5rem;
  padding: 1rem;
}
.sosp-nav-logo {
  font-weight: 800;
  font-size: 1.25rem;
  color: #8B4513;
  text-decoration: none;
}
.sosp-nav-link {
  color: #57534E;
  text-decoration: none;
  font-weight: 500;
}
.sosp-nav-link:hover { color: #8B4513; }
.sosp-nav-link-active { color: #8B4513; font-weight: 700; border-bottom: 2px solid #8B4513; }

/* Pagination */
.sosp-pagination { display: flex; gap: 0.25rem; align-items: center; }
.sosp-pagination-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #D6D3D1;
  background-color: #FFFFFF;
  color: #292524;
  border-radius: 0.375rem;
  cursor: pointer;
}
.sosp-pagination-btn:hover:not(:disabled) { background-color: #F5F5F4; }
.sosp-pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.sosp-pagination-active { background-color: #8B4513; color: #FFFFFF; border-color: #8B4513; }

/* Progress */
.sosp-progress-bar {
  width: 100%;
  height: 0.5rem;
  background-color: #E7E5E4;
  border-radius: 9999px;
  overflow: hidden;
}
.sosp-progress-fill {
  height: 100%;
  background-color: #8B4513;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

/* Spinners & Skeletons */
.sosp-spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 3px solid #E7E5E4;
  border-top-color: #8B4513;
  border-radius: 50%;
  animation: sosp-spin 1s linear infinite;
}
.sosp-spinner-sm { width: 1.25rem; height: 1.25rem; border-width: 2px; }
.sosp-spinner-lg { width: 3rem; height: 3rem; border-width: 4px; }
@keyframes sosp-spin { to { transform: rotate(360deg); } }

.sosp-skeleton { background-color: #E7E5E4; border-radius: 0.25rem; animation: sosp-pulse 1.5s ease-in-out infinite; }
.sosp-skeleton-circle { border-radius: 50%; }
@keyframes sosp-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

/* Avatars */
.sosp-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #D6D3D1;
  color: #292524;
  font-weight: 700;
  border-radius: 50%;
}
.sosp-avatar-xs { width: 1.5rem; height: 1.5rem; font-size: 0.625rem; }
.sosp-avatar-sm { width: 2rem; height: 2rem; font-size: 0.75rem; }
.sosp-avatar-md { width: 3rem; height: 3rem; font-size: 1rem; }
.sosp-avatar-lg { width: 4rem; height: 4rem; font-size: 1.25rem; }
.sosp-avatar-xl { width: 5rem; height: 5rem; font-size: 1.5rem; }

/* Tooltips */
.sosp-tooltip-container { position: relative; display: inline-block; }
.sosp-tooltip {
  visibility: hidden;
  background-color: #1C1917;
  color: #fff;
  text-align: center;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  position: absolute;
  z-index: 10;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.75rem;
  white-space: nowrap;
}
.sosp-tooltip-container:hover .sosp-tooltip { visibility: visible; opacity: 1; }

/* Tabs */
.sosp-tab {
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-weight: 600;
  color: #57534E;
  cursor: pointer;
}
.sosp-tab:hover { color: #1C1917; background-color: #F5F5F4; }
.sosp-tab-active { color: #8B4513; border-bottom-color: #8B4513; }

/* Dividers */
.sosp-divider { border: 0; border-top: 1px solid #D6D3D1; }
.sosp-divider-with-text {
  display: flex;
  align-items: center;
  color: #78716C;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}
.sosp-divider-with-text::before, .sosp-divider-with-text::after {
  content: "";
  flex: 1;
  border-top: 1px solid #D6D3D1;
  margin: 0 1rem;
}

/* Lists */
.sosp-list-ordered { padding-left: 1.5rem; list-style-type: decimal; color: #44403C; }
.sosp-list-ordered li { margin-bottom: 0.5rem; }
.sosp-list-unordered { padding-left: 1.5rem; list-style-type: disc; color: #44403C; }
.sosp-list-unordered li { margin-bottom: 0.5rem; }

/* ==========================================================
   COMPATIBILITAT AMB CODI KIMI (Traducció Català)
   ========================================================== */

/* 19. Divisors i Separadors (Kimi compatibility) */
.sosp-divisor { display: block !important; border: 0; border-top: 1px solid #D6D3D1; margin: 1rem 0; width: 100%; }
.sosp-divisor-amb-etiqueta {
  display: flex;
  align-items: center;
  color: #78716C;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}
.sosp-divisor-amb-etiqueta hr {
  display: block !important;
  flex: 1;
  border: 0;
  border-top: 1px solid #D6D3D1;
  margin: 0 1rem;
}
.sosp-divisor-seccio { display: block !important; border: 0; border-top: 2px solid #8B4513; margin: 2rem 0; width: 100%; }
.sosp-divisor-puntejat { display: block !important; border: 0; border-top: 1px dashed #D6D3D1; margin: 1rem 0; width: 100%; }
.sosp-salt-pagina { height: 2rem; background-image: radial-gradient(#D6D3D1 1px, transparent 1px); background-size: 8px 8px; margin: 2rem 0; }

/* 20. Indicadors de Progrés (Kimi compatibility) */
.sosp-progres {
  width: 100%;
  height: 0.5rem;
  background-color: #E7E5E4;
  border-radius: 9999px;
  overflow: hidden;
}
.sosp-progres-barra {
  height: 100%;
  background-color: #8B4513;
  border-radius: 9999px;
  transition: width 0.3s ease;
}
.sosp-progres-amb-etiqueta {
  background-color: transparent;
  height: auto;
  overflow: visible;
}
.sosp-progres-cap {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #57534E;
  margin-bottom: 0.25rem;
}
.sosp-progres-barra-fons {
  width: 100%;
  height: 0.5rem;
  background-color: #E7E5E4;
  border-radius: 9999px;
  overflow: hidden;
}
.sosp-progres-pasos {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.sosp-pas {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
}
.sosp-pas-numero {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-color: #F5F5F4;
  color: #78716C;
  border: 2px solid #D6D3D1;
}
.sosp-pas-titol {
  font-size: 0.875rem;
  color: #78716C;
  font-weight: 500;
  position: absolute;
  top: 2.5rem;
  white-space: nowrap;
}
.sosp-pas-completat .sosp-pas-numero {
  background-color: #8B4513;
  color: #FFFFFF;
  border-color: #8B4513;
}
.sosp-pas-actiu .sosp-pas-numero {
  background-color: #FFFFFF;
  color: #8B4513;
  border-color: #8B4513;
}
.sosp-pas-actiu .sosp-pas-titol, .sosp-pas-completat .sosp-pas-titol {
  color: #1C1917;
  font-weight: 600;
}
.sosp-pas-connector {
  flex: 1;
  height: 2px;
  background-color: #D6D3D1;
  margin: 0 0.5rem;
  z-index: 1;
}
.sosp-pas-connector-completat {
  background-color: #8B4513;
}

/* Spinner and Skeleton (Kimi compatibility) */
.sosp-spinner {
  display: inline-flex;
}
.sosp-spinner-cercle {
  width: 2rem;
  height: 2rem;
  border: 3px solid #E7E5E4;
  border-top-color: #8B4513;
  border-radius: 50%;
  animation: sosp-spin 1s linear infinite;
}
.sosp-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}
.sosp-skeleton-linia {
  height: 1rem;
  background-color: #E7E5E4;
  border-radius: 0.25rem;
  animation: sosp-pulse 1.5s ease-in-out infinite;
  width: 100%;
}
.sosp-skeleton-linia-curta { width: 50%; }
.sosp-skeleton-linia-mitja { width: 75%; }

/* ==========================================================
   OPTIMITZACIONS TERMODINÀMIQUES (iPad A10)
   ========================================================== */
.sosp-section {
  contain: layout paint;
}

```

## Fitxer: src/sections/disseny/DesignSection.jsx

```jsx
import React from 'react';
import { UniversalPage } from '../../components/universal/UniversalComponents.jsx';
import '../../pages/features/sosp-components.css';
import { useAppData } from '../../app/AppDataContext';

export default function DesignSection() {
  const { t } = useAppData();

  return (
    <UniversalPage
      chrome="context"
      showLogos={true}
      title="Disseny"
      subtitle="Sistema oficial de disseny per a Sóc de Poble"
      lead="Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, perquè qualsevol IA puga entendre este sistema i reproduir-lo."
      labels={[
        { text: 'Mur', className: 'label-blue' },
        { text: 'Disseny UI', className: 'label-orange' }
      ]}
      copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
      heroImage="/assets/uploads/brain/ibanez_pedra_seca_design_1780873465211.png"
      authorName="Sóc de Poble"
      authorLocation="La Torre de les Maçanes"
      time="23:29"
      date="22/3/22"
    >
      <div className="universal-content sosp-design-system sdp-manual-disseny">
        {/* Generated JSX from HTML */}
        
<section className="design-block">
<h3>1. Identitat Cromàtica</h3>
<p>La paleta es genera en <strong>OKLCH</strong>: el to i el croma de marca es mantenen constants i només varia la lluminositat. Per això l'escala és perceptivament regular i cada graó té un contrast previsible.</p>
<div className="alert alert-info sdp-mb-6"><div className="alert-content"><h4>Contracte d'accessibilitat</h4>
<p>Este sistema complix <strong>WCAG 2.2 nivell AAA (≥7:1) en tot el text, els fons i els grisos estructurals</strong>, i <strong>nivell AA (≥4,5:1) en els colors d'interacció</strong> — enllaços, pestanyes actives i botons primaris. Els límits dels controls complixen la norma 1.4.11 (≥3:1).</p>
<p>Esta distinció és deliberada i honesta: AAA estricte en tot obligaria a abandonar el taronja de marca, perquè cap taronja reconeixible arriba a 7:1 sobre blanc. Preferim dir-ho que amagar-ho.</p>
</div></div>

<h3>🤖 LLEIS DE PEDRA SECA PER A IAs ARQUITECTES</h3>
<div className="alert alert-warning sdp-mb-6"><div className="alert-content">
<p><strong>Aquestes regles són absolutes i no es poden trencar sota cap concepte:</strong></p>
<ol>
<li><strong>Prohibició d'estils en línia:</strong> Està terminantment prohibit l'ús de <code>style=&#123;&#123;&#125;&#125;</code> en tot el codi JSX. Tots els estils han de viure en CSS mitjançant classes de la Constitució Pedra Seca.</li>
<li><strong>Arquitectura OKLCH de 2 Capes:</strong> Els colors primitius (Capa 1) s'han de basar en OKLCH mantenint el to i el croma exactes de la marca. Aquests <strong>mai</strong> s'apliquen directament, sempre es mapen a variables semàntiques (Capa 2) que són les que responen al mode fosc.</li>
<li><strong>Shadow DOM i Mode Fosc:</strong> Perquè les variables de CSS funcionin bé dins de WordPress o altres entorns amb Shadow DOM, <strong>sempre</strong> que s'escrigui una regla per al tema fosc com <code>:root[data-theme="dark"]</code> s'ha de duplicar exactament amb el selector bessó <code>:host([data-theme="dark"])</code>.</li>
</ol>
</div></div>
<h4>1.1 Colors de marca</h4>
<div className="palette">
<div className="swatch">
<div className="swatch-color sw-primary-500">Taronja · fons</div>
<div className="swatch-info">#fe7406<br/>--sdp-primary-500</div>
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
</div>
<div className="table-wrapper"><table><thead><tr><th>Parella</th><th>Contrast</th><th>Nivell</th><th>Ús</th></tr></thead><tbody>
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
<div className="swatch-info">#fdfcfb<br/>--sdp-pedra-50</div>
</div>
<div className="swatch">
<div className="swatch-color sw-pedra-100">Núvol · 100</div>
<div className="swatch-info">#f9f8f5<br/>--sdp-pedra-100</div>
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
<h3>2. Estudi Tipogràfic</h3>
<p>Aquesta és l'arquitectura tipogràfica universal de l'ecosistema Sóc de Poble. S'ha dissenyat sota un rigorós estudi per a garantir l'accessibilitat AAA (lectura sota llum solar intensa per a gent gran).</p>

<h4>Lleis Fonamentals:</h4>
<ul>
<li><strong>Arrel Mestra:</strong> <code>18px (1.125rem)</code> per a garantir touch-targets i visibilitat nativa sense zoom.</li>
<li><strong>Font Única:</strong> <code>Noto Sans</code>, escollida per l'altura de la seua "x", les seues formes obertes i el suport multilingüe extrem.</li>
<li><strong>Ample Màxim de Lectura:</strong> <code>68ch</code>, el límit científic abans de causar fatiga ocular al saltar de línia.</li>
<li><strong>Interlineat (Line-height):</strong> <code>1.6</code> en paràgrafs per a donar oxigen; <code>1.2</code> en capçaleres per mantindre la compacitat.</li>
</ul>
<p>Dalt del títol pot anar una imatge o multimèdia d'un ample màxim de 600x600. Baix d'aquest H1 aniran exclusivament els components de presentació de la Targeta Mestra: categoria, etiqueta i copyright.</p>
<p>L'H2 divideix els grans blocs temàtics de la pàgina.</p>
<h1>H1: Títol Principal (40px)</h1>
<div className="sdp-text-center">
<h2>H2: Secció Major (32px)</h2>
<p className="lead">
Aquesta és l'<em>entradilla</em> (<code>&lt;p className="lead"&gt;</code>). S'usa exclusivament sota l'H2 per establir la premissa de la secció amb un cos superior al text normal.
</p>
</div>
<h3>H3: Sub-secció Temàtica (24px)</h3>
<p>L'H3 s'empra per donar jerarquia interna dins d'un bloc H2. Sol acompanyar llistes de dades o enumeracions llargues.</p>
<p>El text de cos (<code>&lt;p&gt;</code>) funciona com a ciment. No pot baixar mai dels 16px en mòbil, però l'estàndard base d'este sistema és 18px. Este paràgraf demostra la llegibilitat continuada i serveix d\'exemple de com es veu un text normal després de l'entradilla.</p>
<ul>
<li>La llista no ordenada (<code>&lt;ul&gt;</code>) manté un marge esquerre net per diferenciar-se ràpidament del paràgraf.</li>
<li>S'evita usar majúscules ("uppercase") en capçaleres per preservar la silueta de la paraula, fonamental per a la lectura ràpida.</li>
</ul>
<h4>H4: Component de Suport (20px)</h4>
<p>L'H4 és útil per a targetes (cards) internes o petites cites que necessiten el seu propi títol sense trencar l'esquema de lectura.</p>
<blockquote>
<p>“Un poble sense memòria és com un arbre sense arrels, condemnat a caure al primer vent fort.”</p>
</blockquote>
<h5>H5: Títol de Widget o Metadada (16px, Negreta)</h5>
<ol>
<li>Títols que requereixen presència però no pertanyen al flux narratiu principal.</li>
<li>S'usa sovint en barres laterals (sidebars).</li>
</ol>
<h6>H6: Micro-Etiqueta (14px, Majúscules)</h6>
<p>L'H6 és l'única etiqueta on es permet l'ús de majúscules pel seu caràcter de "badge" visual (sobretítols, dates, categories pures).</p>

</section>
{/*  SECCIÓ: ESPAIAT I GRID  */}
<section className="design-block">
<h3>3. Espaiat i Grid</h3>
<h4>Sistema d'Espaiat (escala modular base 4/8)</h4>

<div className="spacing-item">
<div className="spacing-bar" ></div>
<div className="spacing-label">--sdp-space-1 = 4px</div>
</div>
<div className="spacing-item">
<div className="spacing-bar" ></div>
<div className="spacing-label">--sdp-space-2 = 8px</div>
</div>
<div className="spacing-item">
<div className="spacing-bar" ></div>
<div className="spacing-label">--sdp-space-3 = 12px</div>
</div>
<div className="spacing-item">
<div className="spacing-bar" ></div>
<div className="spacing-label">--sdp-space-4 = 16px</div>
</div>
<div className="spacing-item">
<div className="spacing-bar" ></div>
<div className="spacing-label">--sdp-space-6 = 24px</div>
</div>
<div className="spacing-item">
<div className="spacing-bar" ></div>
<div className="spacing-label">--sdp-space-8 = 32px</div>
</div>
<div className="spacing-item">
<div className="spacing-bar" ></div>
<div className="spacing-label">--sdp-space-10 = 40px</div>
</div>
<div className="spacing-item">
<div className="spacing-bar" ></div>
<div className="spacing-label">--sdp-space-12 = 48px</div>
</div>
<div className="spacing-item">
<div className="spacing-bar" ></div>
<div className="spacing-label">--sdp-space-16 = 64px</div>
</div>
<div className="spacing-item">
<div className="spacing-bar" ></div>
<div className="spacing-label">--sdp-space-20 = 80px</div>
</div>

<h4>Grid Responsive</h4>
<div className="grid-preview">
<div className="grid-col">1 columna (mòbil)</div>
<div className="grid-col">2 columnes (tauleta)</div>
<div className="grid-col">3 columnes (escriptori)</div>
</div>
</section>
{/*  SECCIÓ: BOTONS  */}
<section className="design-block">
<h3>4. Botons</h3>
<h4>Variants</h4>
<div className="btn-group">
<button className="btn btn-primary">Primari</button>
<button className="btn btn-secondary">Secundari</button>
<button className="btn btn-outline-dark">Terciari</button>
<button className="btn btn-base">Neutral / Base</button>
<button className="btn btn-danger">Perill</button>
<button className="btn btn-ghost">Fantasma</button>
</div>

<h4>Mides</h4>
<div className="btn-group">
<button className="btn btn-primary btn-sm">Petit</button>
<button className="btn btn-primary">Normal</button>
<button className="btn btn-primary btn-lg">Gran</button>
</div>
<h4>Estats</h4>
<div className="btn-group">
<button className="btn btn-primary">Normal</button>
<button className="btn btn-primary" disabled="">Desactivat</button>
<button className="btn btn-primary">
<svg className="spinner" viewBox="0 0 20 20"><circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeWidth="3"></circle></svg>
            Carregant...
          </button>
</div>
<h4>Amb Icona</h4>
<div className="btn-group">
<button className="btn btn-primary">
<svg className="icon-btn" viewBox="0 0 20 20"><path d="M12 5v14M5 12h14"></path></svg> Afegir
          </button>
<button className="btn btn-secondary">
<svg className="icon-btn" viewBox="0 0 20 20"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Eliminar
          </button>
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
<div className="checkbox-group sdp-mt-2">
<input defaultChecked id="optA" name="opt" type="radio"/> <label htmlFor="optA">Opció A</label>
<input id="optB" name="opt" type="radio"/> <label htmlFor="optB">Opció B</label>
</div>
<div className="form-group has-error sdp-mt-4">
<label>Input amb error</label>
<input type="text" defaultValue="valor incorrecte"/>
<div className="error-text">Aquest camp és obligatori.</div>
</div>
<div className="form-group is-disabled sdp-mt-4">
<label>Input desactivat</label>
<input disabled="" type="text" defaultValue="No editable"/>
</div>

</section>
{/*  SECCIÓ 7: ALERTES  */}
<section className="design-block">
<h3>7. Alertes i Missatges</h3>
<div className="alert alert-info">
<div className="alert-icon"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg></div>
<div className="alert-content">
<h4>Informació</h4>
<p>Aquesta és una alerta informativa per a destacar dades rellevants.</p>
</div>
</div>
<div className="alert alert-success">
<div className="alert-icon"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
<div className="alert-content">
<h4>Èxit</h4>
<p>L'operació s'ha completat correctament.</p>
</div>
</div>
<div className="alert alert-warning">
<div className="alert-icon"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><path d="M10.25 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg></div>
<div className="alert-content">
<h4>Avís</h4>
<p>Revisa els camps abans de continuar.</p>
</div>
</div>
<div className="alert alert-error">
<div className="alert-icon"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><circle cx="12" cy="12" r="10"></circle><line x1="15" x2="9" y1="9" y2="15"></line><line x1="9" x2="15" y1="9" y2="15"></line></svg></div>
<div className="alert-content">
<h4>Error</h4>
<p>No s'ha pogut connectar amb el servidor.</p>
</div>
</div>
</section>
{/*  SECCIÓ 8: BADGES  */}
<section className="design-block text-center">
<h3>8. Badges i Etiquetes</h3>
<div className="sdp-flex sdp-gap-12 sdp-justify-center sdp-mb-6">
<span className="badge badge-default">Per defecte</span>
<span className="badge badge-primary">Primari</span>
<span className="badge badge-success">Èxit</span>
<span className="badge badge-warning">Avís</span>
<span className="badge badge-danger">Perill</span>
<span className="badge badge-info">Informació</span>
</div>
<h4>Etiquetes de Poble</h4>
<div className="sdp-flex sdp-gap-12">
<span className="badge badge-outline"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> Poble actiu</span>
<span className="badge badge-outline"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> Fototeca</span>
<span className="badge badge-outline"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Arxiu</span>
<span className="badge badge-outline"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" x2="8" y1="2" y2="18"></line><line x1="16" x2="16" y1="6" y2="22"></line></svg> Mapa</span>
<span className="badge badge-outline"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg> Festes</span>
</div>
</section>
{/*  SECCIÓ 9: TAULES  */}
<section className="design-block">
<h3>9. Taules</h3>
<div className="table-wrapper">
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
<div className="table-wrapper">
<table className="table-zebra">
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
<button className="page-btn" disabled="">← Anterior</button>
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
<div className="sdp-text-center"><svg className="spinner spinner-sm" viewBox="0 0 20 20"><circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeWidth="3"></circle></svg>
Petit</div>
<div className="sdp-text-center"><svg className="spinner spinner-md" viewBox="0 0 20 20"><circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeWidth="3"></circle></svg>
Normal</div>
<div className="sdp-text-center"><svg className="spinner spinner-lg" viewBox="0 0 20 20"><circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeWidth="3"></circle></svg>
Gran</div>
</div>
<h4>Esquelet (Skeleton)</h4>
<div className="skeleton skeleton-title"></div>
<div className="skeleton skeleton-text"></div>
<div className="skeleton skeleton-text"></div>
<div className="skeleton skeleton-text"></div>
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
{/*  SECCIÓ 14: DESPLEGABLES  */}
<section className="design-block">
<h3>14. Desplegables</h3>
<div className="accordion">
<div className="accordion-header">
            Què és Sóc de Poble?
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20" width="20"><polyline points="6 9 12 15 18 9"></polyline></svg>
</div>
<div className="accordion-header">
            Com puc col·laborar?
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20" width="20"><polyline points="6 9 12 15 18 9"></polyline></svg>
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
<p className="sdp-m-0">Contingut de la pestanya activa. Aquesta àrea canvia segons la selecció. Les pestanyes són accessibles via teclat (Tab + Enter/Espai).</p>
</div>
</section>
{/*  SECCIÓ 16: PROGRÉS  */}
<section className="design-block">
<h3>16. Barra de Progrés</h3>
<div className="progress-container">
<div className="progress-header"><span>Pujada d'imatges</span><span>45%</span></div>
<div className="progress-bar"><div className="progress-fill"></div></div>
</div>
<div className="progress-container">
<div className="progress-header"><span>Indexació de documents</span><span>78%</span></div>
<div className="progress-bar"><div className="progress-fill"></div></div>
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
<section className="design-block sdp-mb-20">
<h3>19. Divisors i Separadors</h3>
<div className="divider-preview">
<div className="divider-label">19.1 Divisor horitzontal bàsic</div>
<div className="divider-basic"></div>
</div>
<div className="divider-preview">
<div className="divider-label">19.2 Divisor amb text</div>
<div className="divider-text">O BÉ</div>
</div>
<div className="divider-preview">
<div className="divider-label">19.3 Separador de secció (major)</div>
<div className="divider-major"></div>
</div>
<div className="divider-preview">
<div className="divider-label">19.4 Separador puntejat</div>
<div className="divider-dashed"></div>
</div>
<div className="divider-preview">
<div className="divider-label">19.5 Separador de pàgina (salt visual)</div>
<div className="divider-dotted"></div>
</div>
</section>
{/*  SECCIÓ 20: TARGETES MESTRES  */}
<section className="design-block">
<h3>20. Targeta Mestra (Sóc de Poble Universal Card)</h3>
<p className="sdp-text-center sdp-mb-2">La Targeta Mestra és un bloc modular desmuntable i enllaçable (amb <code>&lt;a className="sp-card-main-link"&gt;</code> dins del títol). Qualsevol clic dins d'ella condueix a la pàgina, excepte els botons amb funcions específiques (z-index superior).</p>
<h4>20.1 Targeta Mestra: Text pur i Etiquetes (Gestoria de Poble)</h4>
<article className="sp-card">
<header className="sp-card-header">
<a className="sp-card-author-link" href="#" title="Anar al perfil de l'autor">
<div className="sp-card-author">
<img alt="Avatar" className="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
<div className="sp-card-author-info">
<div className="sp-card-author-name">Javi Llinares</div>
<div className="sp-card-author-location">La Torre de les Maçanes</div>
</div>
</div>
</a>
<div className="sp-card-meta sdp-gap-8">
{/*  Tooltip (Bocata) d'Avís o PIN  */}
<div className="tooltip-container">
<button className="btn-icon-orange" title="Mode Privadesa">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
</button>
<div className="tooltip-text">Mode Privadesa actiu</div>
</div>
<button className="btn-date-time" title="Veure calendari d'este dia">
<span>14:28</span><span>26/06/22</span>
</button>
</div>
</header>
<div className="sp-card-body">
<div className="sp-card-price sdp-mb-6">***,** €</div>
<h4 className="sp-card-title"><a href="#caixa-real" className="sp-card-main-link" title="Obrir Caixa Real">Caixa Real</a></h4>
<p className="sp-card-subtitle">Saldo Disponible</p>
<div className="sp-card-labels">
<span className="sp-card-label label-blue">Gestoria</span>
<span className="sp-card-label label-green">Caixa Real</span>
</div>
<div className="sp-card-copyright sdp-mt-4">© Sóc de Poble / Fet per la IAIA i Nano Banana</div>
</div>
<footer className="sp-card-footer">
<div className="sp-card-actions">
<button className="sp-card-action" title="Traduir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
</button>
<button className="sp-card-action" title="Comentar (Xat Privat)">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
</button>
<button className="sp-card-action" title="Compartir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>
</button>
</div>
<button className="sp-card-connect" title="Connectar amb Caixa Real">Connectar</button>
</footer>
</article>
<h4>20.2 Targeta Mestra: Text pur (Hisenda)</h4>
<article className="sp-card">
<header className="sp-card-header">
<a className="sp-card-author-link" href="#" title="Anar al perfil de l'autor">
<div className="sp-card-author">
<img alt="Avatar" className="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
<div className="sp-card-author-info">
<div className="sp-card-author-name">Javi Llinares</div>
<div className="sp-card-author-location">La Torre de les Maçanes</div>
</div>
</div>
</a>
<div className="sp-card-meta sdp-gap-8">
<div className="tooltip-container">
<button className="btn-icon-orange" title="Avís Important">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
</button>
<div className="tooltip-text">Falten 3 dies per presentar el model</div>
</div>
<button className="btn-date-time" title="Veure calendari d'este dia">
<span>14:28</span><span>26/06/22</span>
</button>
</div>
</header>
<div className="sp-card-body">
<div className="sp-card-price sdp-mb-6">***,** €</div>
<h4 className="sp-card-title"><a href="#hisenda" className="sp-card-main-link" title="Obrir Hisenda">Hisenda</a></h4>
<p className="sp-card-subtitle">Model 303 / 130</p>
<div className="sp-card-labels">
<span className="sp-card-label label-blue">Gestoria</span>
<span className="sp-card-label label-orange">Hisenda</span>
</div>
<div className="sp-card-copyright sdp-mt-4">© Sóc de Poble / Fet per la IAIA i Nano Banana</div>
</div>
<footer className="sp-card-footer">
<div className="sp-card-actions">
<button className="sp-card-action" title="Traduir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
</button>
<button className="sp-card-action" title="Comentar (Xat Privat)">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
</button>
<button className="sp-card-action" title="Compartir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>
</button>
</div>
<button className="sp-card-connect" title="Connectar amb Hisenda">Connectar</button>
</footer>
</article>
<h4>20.3 Targeta Mestra: Imatge Completa (Producte)</h4>
<article className="sp-card">
<header className="sp-card-header">
<a className="sp-card-author-link" href="#" title="Anar al perfil de l'autor">
<div className="sp-card-author">
<img alt="Avatar" className="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
<div className="sp-card-author-info">
<div className="sp-card-author-name">Sóc de Poble</div>
<div className="sp-card-author-location">La Torre de les Maçanes</div>
</div>
</div>
</a>
<div className="sp-card-meta sdp-gap-8">
<button className="btn-icon-orange" title="Ancorar" >
<svg className="icon" viewBox="0 0 20 20"><path d="M16 11V7a4 4 0 0 0-8 0v4l-2 4h12l-2-4z"></path><path d="M12 15v7"></path></svg>
</button>
<button className="btn-date-time" title="Veure calendari d'este dia">
<span>00:29</span><span>23/3/22</span>
</button>
</div>
</header>
<div className="sp-card-media">
<img alt="Samarreta" src="https://socdepoble.org/assets/uploads/brain/media__1776503825171.jpg"/>
</div>
<div className="sp-card-body">
<div className="sp-card-price">15.00€</div>
<h4 className="sp-card-title"><a href="#samarreta" className="sp-card-main-link" title="Obrir Samarreta Sóc de Poble">Samarreta Sóc de Poble</a></h4>
<p className="sp-card-subtitle">L'edició definitiva amb el logotip complet</p>
<p className="sp-card-text">Dibuix del mapa del tresor. Cotó Roly de màxima qualitat.</p>
<div className="sp-card-labels">
<span className="sp-card-label label-blue">Mercat</span>
<span className="sp-card-label label-blue">Roba</span>
<span className="sp-card-label label-green">Samarreta</span>
</div>
<div className="sp-card-copyright sdp-mt-4">© Sóc de Poble / Fet per la IAIA i Nano Banana</div>
</div>
<footer className="sp-card-footer">
<div className="sp-card-actions">
<button className="sp-card-action" title="Traduir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
</button>
<button className="sp-card-action" title="Comentar (Xat Privat)">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
</button>
<button className="sp-card-action" title="Compartir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>
</button>
</div>
<button className="sp-card-connect" title="Connectar">Connectar</button>
</footer>
</article>
<h4>20.4 Targeta Mestra: Pàgina de Mur (Disseny)</h4>
<article className="sp-card">
<header className="sp-card-header">
<a className="sp-card-author-link" href="#" title="Anar al perfil de l'autor">
<div className="sp-card-author">
<img alt="Avatar" className="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
<div className="sp-card-author-info">
<div className="sp-card-author-name">Sóc de Poble</div>
<div className="sp-card-author-location">La Torre de les Maçanes</div>
</div>
</div>
</a>
<div className="sp-card-meta sdp-gap-8">
<button className="btn-icon-orange" title="Ancorar">
<svg className="icon" viewBox="0 0 20 20"><path d="M16 11V7a4 4 0 0 0-8 0v4l-2 4h12l-2-4z"></path><path d="M12 15v7"></path></svg>
</button>
<button className="btn-date-time" title="Veure calendari d'este dia">
<span>10:00</span><span>07/8/22</span>
</button>
</div>
</header>
<div className="sp-card-media">
<img alt="Disseny Pedra Seca" src="assets/img/ibanez_pedra_seca_design_1780873465211.png"/>
</div>
<div className="sp-card-body">
<h4 className="sp-card-title"><a href="#disseny" className="sp-card-main-link" title="Obrir Disseny Pedra Seca">Disseny Pedra Seca</a></h4>
<p className="sp-card-subtitle">Sistema oficial de disseny per a Sóc de Poble</p>
<p className="sp-card-text">Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, perquè qualsevol IA puga entendre este sistema i reproduir-lo.</p>
<div className="sp-card-labels">
<span className="sp-card-label label-orange">MUR</span>
<span className="sp-card-label label-blue">Disseny UI</span>
</div>
<div className="sp-card-copyright sdp-mt-4">© Sóc de Poble / Fet per la IAIA i Nano Banana</div>
</div>
<footer className="sp-card-footer">
<div className="sp-card-actions">
<button className="sp-card-action" title="Traduir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
</button>
<button className="sp-card-action" title="Comentar (Xat Privat)">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
</button>
<button className="sp-card-action" title="Compartir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>
</button>
</div>
<button className="sp-card-connect" title="Connectar">Connectar</button>
</footer>
</article>
</section>
{/*  SECCIÓ 21: ESTADÍSTIQUES I DASHBOARDS  */}
<section className="design-block">
<h3>21. Estadístiques i Dashboards</h3>
<h4>21.1 Targeta d'estadística</h4>
<div className="stat-card sdp-mb-6">
<div className="stat-icon"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
<div className="stat-info">
<div className="stat-value">5.847</div>
<div className="stat-label">Habitants</div>
</div>
</div>
<h4>21.2 Grid d'estadístiques</h4>
<div className="stat-grid">
<div className="stat-card">
<div className="stat-icon"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><rect height="18" rx="2" ry="2" width="18" x="3" y="4"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg></div>
<div className="stat-info">
<div className="stat-value">776</div>
<div className="stat-label">Anys d'història</div>
</div>
</div>
<div className="stat-card">
<div className="stat-icon"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div>
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
<h4>21.3 Panell d'Umami (Integració directa)</h4>
<div className="dashboard-panel">
<div className="dashboard-header"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><line x1="18" x2="18" y1="20" y2="10"></line><line x1="12" x2="12" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="14"></line></svg> Activitat del Portal</div>
<div className="dashboard-grid">
<div className="dashboard-item">
<div className="dashboard-item-value">5.847</div>
<div className="dashboard-item-label">Visitants únics</div>
</div>
<div className="dashboard-item">
<div className="dashboard-item-value">23.412</div>
<div className="dashboard-item-label">Pàgines vistes</div>
</div>
<div className="dashboard-item">
<div className="dashboard-item-value">29,4%</div>
<div className="dashboard-item-label">Taxa de rebuig</div>
</div>
<div className="dashboard-item">
<div className="dashboard-item-value">2m 45s</div>
<div className="dashboard-item-label">Duració mitjana</div>
</div>
</div>
<div className="dashboard-footer">Dades d'<span>Umami Analytics</span> • Actualització en temps real</div>
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
<div className="sdp-mb-1">S'han trobat <strong>12 resultats</strong> per a "festa major"</div>
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
<label><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Verificació prèvia a publicar</label>
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
<div className="sdp-mt-2">Màxim 10MB per arxiu. Formats: JPG, PNG, PDF</div>
</div>
<div className="file-item">
<div className="file-item-info">
<div className="file-item-name">festa_major_2024.jpg</div>
<div className="file-item-meta">2,4 MB</div>
</div>
<div className="file-item-action"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></div>
</div>
<h4>25.2 Enllaç de descàrrega</h4>
<div className="download-card">
<div className="download-card-icon"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
<div className="download-card-info">
<div className="download-card-title">Carta Pobla de Benigànim (1248)</div>
<div className="download-card-meta">PDF • 3,2 MB • Transcripció paleogràfica</div>
</div>
<a className="download-card-btn" href="#"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><line x1="12" x2="12" y1="5" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg></a>
</div>
</section>
{/*  SECCIÓ 26: EMBEDDINGS I MEDIA EXTERNA  */}
<section className="design-block">
<h3>26. Embeddings i Media Externa</h3>
<h4>26.1 Vídeo embebint (HTML5 natiu)</h4>
<div className="embed-container">
<div className="sdp-flex sdp-items-center sdp-justify-center">
<div className="sdp-flex sdp-items-center sdp-justify-center"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
</div>
</div>
<div className="embed-caption">Sóc de Poble: Portal de pobles connectats (2013)</div>
<div className="accordion sdp-mb-6">
<div className="accordion-header">
<svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Descripció del vídeo original
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20" width="20"><polyline points="6 9 12 15 18 9"></polyline></svg>
</div>
</div>
<h4>26.2 Mapa embebint (iframe amb fallback)</h4>
<div className="embed-container sdp-flex sdp-items-center sdp-justify-center">
          [OpenStreetMap Iframe]
        </div>
<div className="embed-caption"><a href="#">Veure mapa més gran a OpenStreetMap →</a></div>
<h4>26.3 Audio (podcast local)</h4>
<div className="audio-player">
<button className="audio-play-btn"><svg viewBox="0 0 20 20"><path d="M8 5v14l11-7z"></path></svg></button>
<div className="audio-progress">
<div className="audio-progress-fill"></div>
</div>
<div className="audio-time">12:45</div>
</div>
<div className="embed-caption sdp-text-left">Podcast «Històries de poble» · Episodi 1</div>
</section>
{/*  SECCIÓ 27: CLASSES UTILITÀRIES  */}
<section className="design-block">
<h3>27. Classes Utilitàries</h3>
<p className="sdp-text-center sdp-mb-6">Aquestes classes són recomanacions d'arquitectura css (no aplicades ací via Tailwind pur sinó com a concepte)</p>
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
<li><strong>.sdp-text-avis</strong> - <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><path d="M10.25 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg> Avís</li>
<li><strong>.sdp-text-info</strong> - i Informació</li>
</ul>
</div>
</div>
</section>
{/*  SECCIÓ 28: PEUS DE PÀGINA  */}
<section className="design-block">
<h3>28. Peus de pàgina (Footers)</h3>
<h4>28.1 Peu de pàgina complet</h4>
<div className="sdp-p-10">[Footer complet (Enllaços, Legal, Xarxes)]</div>
<h4>28.2 Peu de pàgina minimalista</h4>
<div className="sdp-p-4 sdp-text-center">© 2026 Sóc de Poble. Tots els drets reservats.</div>
</section>
{/*  SECCIÓ 29: EXEMPLES DE COMPOSICIÓ  */}
<section className="design-block sdp-mb-20">
<h3>29. Exemples de Composició</h3>
<h4>29.1 Formulari de contacte complet</h4>
<div className="sdp-p-6">
<h4>Contacta amb nosaltres</h4>
<div className="sdp-mb-1">Les teues dades</div>
<div className="form-group">
<label>Nom complet <span>*</span></label>
<input type="text"/>
</div>
<div className="form-group">
<label>Correu electrònic <span>*</span></label>
<input type="email"/>
</div>
<div className="form-group">
<label>Motiu del contacte</label>
<select>
<option>Selecciona un motiu...</option>
</select>
</div>
</div>
</section>

      </div>
    </UniversalPage>
  );
}

```

## Fitxer: src/components/universal/UniversalComponents.jsx

```jsx
import { resolveAsset } from '../../config/assetResolver';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAppData } from '../../app/AppDataContext';
const PAGE_CHROME_MODES = new Set(['none', 'page', 'context', 'full', 'system']);

const DEFAULT_AUTHOR = {
  name: 'Sóc de Poble',
  location: 'La Torre de les Maçanes',
  avatarUrl: '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg'
};




export function ActionControl({
  label,
  title = label,
  className,
  onClick,
  disabled = false,
  children
}) {
  const presentationOnly = !onClick;

  if (presentationOnly) {
    return (
      <span className={className} aria-label={label} title={title}>
        {children}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      title={title}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function DateTimeControl({ time, date, dateTime, label, onClick }) {
  if (!time && !date) return null;

  const accessibleLabel = label || ['Data i hora', time, date].filter(Boolean).join(': ');
  const content = (
    <>
      {time && <span>{time}</span>}
      {date && <span>{date}</span>}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className="btn-date-time sp-card-time sdp-flex-col"
        aria-label={accessibleLabel}
        title={accessibleLabel}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <time
      className="btn-date-time sp-card-time sdp-flex-col"
      dateTime={dateTime}
      aria-label={accessibleLabel}
    >
      {content}
    </time>
  );
}

export function GlobeIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function IaiaIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="414 456 241 378"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path
        style={{ fillRule: "nonzero", clipRule: "evenodd", strokeLinejoin: "round", strokeMiterlimit: 2 }}
        d="M654.322021484375,634.7418212890625L639.4090576171875,575.3836669921875C639.4090576171875,575.3836669921875,638.4949951171875,570.5927124023438,633.9271240234375,567.901123046875C629.3841552734375,565.2110595703125,583.4334716796875,537.8279418945312,583.4334716796875,537.8279418945312C581.4577026367188,536.6675415039062,579.3094482421875,535.9998779296875,577.1859741210938,535.7286376953125C576.7413940429688,535.6306762695312,576.297607421875,535.5552978515625,575.85302734375,535.5552978515625L568.7909545898438,535.5552978515625C568.8406982421875,535.4573974609375,568.8896484375,535.3338012695312,568.9884033203125,535.210205078125C574.642822265625,528.740478515625,578.0751342773438,520.2723388671875,578.0751342773438,510.9874267578125C578.0751342773438,498.5180969238281,571.8773803710938,487.4819641113281,562.3958129882812,480.8147888183594C561.679931640625,480.3204650878906,561.26025390625,479.2835998535156,561.3341064453125,478.4200744628906C561.407958984375,477.72833251953125,561.4576416015625,476.9883728027344,561.4576416015625,476.2710266113281C561.4576416015625,465.06158447265625,552.3709106445312,455.99969482421875,541.1614990234375,455.99969482421875C529.9761352539062,455.99969482421875,520.889404296875,465.08721923828125,520.889404296875,476.2710266113281C520.889404296875,476.9883728027344,520.9391479492188,477.72833251953125,521.0130004882812,478.4200744628906C521.1116943359375,479.2835998535156,520.6671142578125,480.3204650878906,519.9512329101562,480.8147888183594C510.46966552734375,487.4819641113281,504.27191162109375,498.5180969238281,504.27191162109375,510.9874267578125C504.27191162109375,520.2723388671875,507.7042236328125,528.740478515625,513.358642578125,535.210205078125C513.4573974609375,535.3338012695312,513.5071411132812,535.4573974609375,513.5809326171875,535.5552978515625L503.82733154296875,535.5552978515625C502.6427917480469,535.5552978515625,501.55621337890625,535.9260864257812,500.59320068359375,536.4444580078125C499.5804748535156,536.8152465820312,498.5684814453125,537.2598266601562,497.6303405761719,537.8279418945312L495.4820556640625,539.1361083984375L462.4942626953125,558.7412719726562C462.4942626953125,558.7412719726562,448.81475830078125,566.74072265625,446.02520751953125,568.5431518554688C442.79034423828125,570.6424560546875,441.926025390625,574.2970581054688,441.926025390625,574.2970581054688L429.8025817871094,622.4698486328125C421.99981689453125,626.0250244140625,418.4198303222656,631.9266357421875,418.4198303222656,631.9266357421875C413.95068359375,638.8651123046875,413.9996643066406,647.1372680664062,413.9996643066406,647.1372680664062L413.9996643066406,824.7174072265625C413.9996643066406,824.7174072265625,414.1978454589844,831.8050537109375,421.75341796875,831.8050537109375C429.2841491699219,831.8050537109375,429.852294921875,825.2855834960938,429.852294921875,825.2855834960938C429.852294921875,825.2855834960938,429.9751281738281,651.4821166992188,430.1484375,649.4083862304688L430.1484375,649.2109375C432.24700927734375,651.6795043945312,435.0863037109375,653.5316772460938,438.44476318359375,654.37109375C439.7777404785156,654.692138671875,441.1114807128906,654.8654174804688,442.4195861816406,654.8654174804688C449.40777587890625,654.8654174804688,455.778076171875,650.2734375,457.8517761230469,643.3349609375C458.46966552734375,645.0379638671875,458.8893737792969,647.8034057617188,459.65496826171875,652.00048828125C460.8153991699219,658.2969970703125,474.8648681640625,660.3721923828125,474.51898193359375,649.358642578125C474.14825439453125,638.322509765625,470.222412109375,633.8284912109375,465.23480224609375,627.1854248046875C464.5928039550781,626.2977905273438,463.7533874511719,625.506591796875,462.81524658203125,624.7666015625C462.74139404296875,624.7169189453125,462.6916809082031,624.6671752929688,462.6419372558594,624.6189575195312L470.4944152832031,593.3838500976562L471.0128479003906,591.334228515625L472.0745544433594,590.6922607421875L491.30902099609375,579.259765625L486.8398742675781,606.7423095703125L480.370849609375,646.4952392578125L465.062255859375,740.4703369140625C465.062255859375,744.0510864257812,467.9512634277344,746.9401245117188,471.5312805175781,746.9401245117188L494.7164611816406,746.9401245117188L494.7164611816406,817.7548828125C494.7164611816406,820.2490234375,495.3336181640625,822.61962890625,496.32147216796875,824.7174072265625C498.9384765625,830.1503295898438,504.4452209472656,833.95263671875,510.8893737792969,833.95263671875C518.1978149414062,833.95263671875,524.2968139648438,829.063720703125,526.2966918945312,822.4221801757812C526.7412719726562,820.9407958984375,527.062255859375,819.385498046875,527.062255859375,817.7548828125L527.062255859375,746.9401245117188L553.3587646484375,746.9401245117188L553.3587646484375,817.7548828125C553.3587646484375,817.9522705078125,553.4085083007812,818.1256103515625,553.4085083007812,818.2989501953125C553.7046508789062,826.9900512695312,560.790771484375,833.95263671875,569.5316772460938,833.95263671875C574.9638671875,833.95263671875,579.7788696289062,831.2369384765625,582.6920166015625,827.1136474609375C584.5690307617188,824.4461669921875,585.70458984375,821.26171875,585.70458984375,817.7548828125L585.70458984375,746.9401245117188L609.0133666992188,746.9401245117188C612.5941162109375,746.9401245117188,615.4823608398438,744.0510864257812,615.4823608398438,740.4703369140625L606.1002197265625,684.298095703125L588.4210205078125,578.4444580078125L610.0502319335938,591.334228515625L622.989013671875,642.6432495117188C624.0996704101562,647.1116333007812,627.0135498046875,650.6682739257812,630.766845703125,652.791748046875C633.13671875,654.1239624023438,635.8283081054688,654.8654174804688,638.6683349609375,654.8654174804688C639.9515991210938,654.8654174804688,641.2853393554688,654.692138671875,642.5941772460938,654.37109375C651.260498046875,652.1979370117188,656.5200805664062,643.4088134765625,654.322021484375,634.7418212890625"
      />
    </svg>
  );
}

export function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function ThemeIcon({ className, mode = 'light' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {mode === 'dark' ? (
        <>
          <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
          <line x1="12" x2="12" y1="1" y2="3" />
          <line x1="12" x2="12" y1="21" y2="23" />
          <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
          <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
          <line x1="1" x2="3" y1="12" y2="12" />
          <line x1="21" x2="23" y1="12" y2="12" />
          <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
          <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
        </>
      ) : (
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      )}
    </svg>
  );
}

export function BackIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

export function ForwardIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m12 19 7-7-7-7" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function IndexIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

export function TranslateIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  );
}

export function CommentIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

export function ShareIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

export function PinIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16 11V7a4 4 0 0 0-8 0v4l-2 4h12l-2-4z" />
      <path d="M12 15v7" />
    </svg>
  );
}

export function TableOfContentsDrawer({ isOpen, onClose }) {
  const [headings, setHeadings] = useState([]);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const rootNode = rootRef.current ? rootRef.current.getRootNode() : document;
    const domHeadings = rootNode.querySelectorAll('.page-title h1, .page-title h2, .content-wrapper h1, .content-wrapper h2, .content-wrapper h3, .content-wrapper h4, .sp-card-body h1, .sp-card-body h2, .sp-card-body h3, .sp-card-body h4');
    
    const parsedHeadings = Array.from(domHeadings).map((el, idx) => {
      // Ignoremos els visualment amagats
      if (el.classList.contains('sr-only') || el.textContent.trim() === '') return null;
      
      // Sense filtre de números per suportar targetes i pantalles sense numeració
      
      if (!el.id) {
        el.id = `toc-heading-${idx}`;
      }
      return {
        id: el.id,
        text: el.innerText || el.textContent,
        level: parseInt(el.tagName.substring(1), 10),
        element: el
      };
    }).filter(Boolean);

    setHeadings(parsedHeadings);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="toc-overlay" onClick={onClose} ref={rootRef}>
      <aside className="toc-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="toc-header">
          <h2>Taula de continguts</h2>
          <button className="toc-close-btn" onClick={onClose} aria-label="Tancar taula">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav className="toc-nav">
          {headings.length === 0 ? (
            <p className="toc-empty">No s'han trobat seccions.</p>
          ) : (
            <ul>
              {headings.map((h, idx) => (
                <li key={idx} className={`toc-item toc-level-${h.level}`}>
                  <button 
                    onClick={() => {
                      h.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      onClose();
                    }}
                  >
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </aside>
    </div>
  );
}

export function UniversalPage({
  title,
  subtitle,
  lead,
  labels = [],
  copyright,
  showLogos = false,
  tone,
  chrome = 'page',
  showTopBars,
  topBarData = {},
  heroImage,
  heroAlt = '',
  authorName = DEFAULT_AUTHOR.name,
  authorLocation = DEFAULT_AUTHOR.location,
  authorAvatar = DEFAULT_AUTHOR.avatarUrl,
  authorAvatarAlt = '',
  time,
  date,
  dateTime,
  viewerAvatarUrl = DEFAULT_AUTHOR.avatarUrl,
  viewerAvatarAlt = 'Sóc de Poble',
  themeMode = 'light',
  onLanguage,
  onIaia,
  onSearch,
  onTheme,
  onProfile,
  onBack,
  onForward,
  onIndex,
  onTranslate,
  onComment,
  onShare,
  onConnect,
  onPin,
  onDateTime,
  connectLabel = 'Connectar',
  price,
  children
}) {
  const [isTocOpen, setIsTocOpen] = useState(false);
  const navigate = useNavigate();
  const appData = useAppData();
  
  const currentThemeMode = themeMode !== 'light' ? themeMode : (appData?.themeMode || 'light');
  
  const handleConnect = onConnect || (() => navigate('/connectar?item_id=' + encodeURIComponent(title || 'page')));
  
  const handleBack = onBack || (() => navigate(-1));
  const handleForward = onForward || (() => navigate(1));
  const handleIndex = onIndex || (() => setIsTocOpen(true));
  const handleTranslate = onTranslate || (() => navigate('/traduccions'));
  const handleTheme = onTheme || appData?.toggleTheme || (() => {});
  const handleComment = onComment || (() => navigate('/xat'));
  const handleShare = onShare || (() => {
    if (navigator.share) {
      navigator.share({ title: title || document.title, url: window.location.href }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enllaç copiat al porta-retalls');
    }
  });
  
  const handleDateTime = onDateTime || ((e) => {
    e.preventDefault();
    e.stopPropagation();
    let yyyymmdd;
    if (barDateTime) {
      yyyymmdd = barDateTime.split('T')[0];
    } else if (barDate) {
      const parts = barDate.split('/');
      if (parts.length === 3) {
        let [dd, mm, yy] = parts;
        if (yy.length === 2) yy = '20' + yy;
        yyyymmdd = `${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      } else {
        const d = new Date(barDate);
        if (!isNaN(d.getTime())) yyyymmdd = d.toISOString().split('T')[0];
      }
    }
    if (yyyymmdd) {
      navigate(`/mur?date=${yyyymmdd}`);
    } else {
      navigate('/mur');
    }
  });

  const requestedChrome = showTopBars ? 'full' : chrome;
  const resolvedChrome = PAGE_CHROME_MODES.has(requestedChrome) ? requestedChrome : 'page';
  const showBlackBar = resolvedChrome === 'full';
  const showBlueBar = resolvedChrome === 'full' || resolvedChrome === 'context' || resolvedChrome === 'system';
  const showOrangeBar = resolvedChrome === 'full' || resolvedChrome === 'context';
  const showPageHeader = resolvedChrome !== 'none';
  const hasHeader = Boolean(showPageHeader && (showLogos || title || labels.length || copyright));

  const barAuthorName = topBarData.authorName ?? authorName;
  const barAuthorLocation = topBarData.authorLocation ?? authorLocation;
  const barAuthorAvatar = topBarData.authorAvatar ?? authorAvatar;
  const barTime = topBarData.time ?? time;
  const barDate = topBarData.date ?? date;
  const barDateTime = topBarData.dateTime ?? dateTime;
  const barHeroImage = topBarData.heroImage ?? heroImage;
  const barHeroAlt = topBarData.heroAlt ?? heroAlt;

  return (
    <>
      {showBlackBar && (
        <header className="bar-black">
          <div
            className="mobile-logo-wrapper sdp-flex sdp-items-center sdp-justify-center"
            id="mobile-sidebar-toggle"
          >
            <img
              alt="Sóc de Poble"
              src={resolveAsset("/assets/system/ui/logo-socdepoble-rect-blanc.svg")}
            />
          </div>
          <div className="right-icons">
            <ActionControl
              className="icon sp-card-action"
              label="Idioma"
              onClick={onLanguage}
            >
              <GlobeIcon />
            </ActionControl>
            <ActionControl
              className="icon sp-card-action"
              label="IAIA MarIA"
              onClick={onIaia}
            >
              <IaiaIcon className="iaia-icon" />
            </ActionControl>
            <ActionControl
              className="icon sp-card-action"
              label="Cercar"
              onClick={onSearch}
            >
              <SearchIcon />
            </ActionControl>
            <ActionControl
              className="icon sp-card-action"
              label="Canviar el tema"
              onClick={handleTheme}
            >
              <ThemeIcon mode={currentThemeMode} />
            </ActionControl>
            <ActionControl
              className="icon sp-card-action"
              label="Perfil"
              onClick={onProfile}
            >
              <img alt={viewerAvatarAlt} src={viewerAvatarUrl} />
            </ActionControl>
          </div>
        </header>
      )}

      {showBlueBar && (
        <>
          <header className="bar-blue">
            <div className="bar-blue-left sdp-flex sdp-items-center">
              <IconButton label="Tornar arrere" onClick={handleBack} presentation>
                <BackIcon className="icon" />
              </IconButton>
              <IconButton label="Tornar endavant" onClick={handleForward} presentation>
                <ForwardIcon className="icon" />
              </IconButton>
              <IconButton label="Índex de secció" onClick={handleIndex} presentation>
                <IndexIcon className="icon" />
              </IconButton>
            </div>
            <div className="sp-card-actions">
              <IconButton label="Traduir" onClick={handleTranslate} presentation>
                <TranslateIcon className="icon" />
              </IconButton>
              <IconButton
                label="Comentar (Xat Privat)"
                onClick={handleComment}
                presentation
              >
                <CommentIcon className="icon" />
              </IconButton>
              <IconButton label="Compartir" onClick={handleShare} presentation>
                <ShareIcon className="icon" />
              </IconButton>
            </div>
            <ActionControl
              className="sp-card-connect"
              label={connectLabel}
              onClick={handleConnect}
            >
              {connectLabel}
            </ActionControl>
          </header>

          {topBarData?.heroComponent ? (
            <div className="hero-image">
              {topBarData.heroComponent}
            </div>
          ) : barHeroImage ? (
            <div className="hero-image">
              <img alt={barHeroAlt} src={resolveAsset(barHeroImage)} />
            </div>
          ) : null}

          {showOrangeBar && (
            <section className="bar-orange" aria-label="Autoria i data">
              <div className="sp-card-author">
                <img
                  className="sp-card-avatar"
                  src={resolveAsset(barAuthorAvatar)}
                  alt={authorAvatarAlt}
                  decoding="async"
                  width="48"
                  height="48"
                />
                <div className="sp-card-author-info">
                  <div className="sp-card-author-name">{barAuthorName}</div>
                  <div className="sp-card-author-location">{barAuthorLocation}</div>
                </div>
              </div>
              <div className="bar-actions sdp-flex sdp-items-center sdp-gap-8">
                {topBarData?.showPin !== false && (
                  <ActionControl
                    className="btn-icon-orange"
                    label="Ancorar"
                    onClick={onPin}
                  >
                    <PinIcon className="icon" />
                  </ActionControl>
                )}
                <DateTimeControl
                  time={barTime}
                  date={barDate}
                  dateTime={barDateTime}
                  onClick={handleDateTime}
                />
              </div>
            </section>
          )}
        </>
      )}

      {hasHeader && (
        <header
          className={['page-title', tone && `is-${tone}`].filter(Boolean).join(' ')}
        >
          {(showLogos || chrome === 'system') && (
            <>
              <img
                alt="Logotip Sóc de Poble"
                className="page-title-logo light-only"
                src={resolveAsset("/assets/system/ui/logo-socdepoble-rect-negre.svg")}
              />
              <img
                alt="Logotip Sóc de Poble"
                className="page-title-logo dark-only"
                src={resolveAsset("/assets/system/ui/logo-socdepoble-rect-blanc.svg")}
              />
            </>
          )}
          {title && (
            <h1>
              {title}
              {price && <span className="sp-card-price" style={{ float: 'none', marginLeft: 16, display: 'inline-block', verticalAlign: 'middle', marginBottom: 4 }}>{price}</span>}
            </h1>
          )}
          {labels.length > 0 && (
            <ul className="sp-card-labels page-title-labels" aria-label="Categories">
              {labels.map((label, index) => {
                const text = typeof label === 'string' ? label : label.text;
                const className = typeof label === 'string' ? 'sdp-badge-tag' : label.className || 'sdp-badge-tag';
                const href = typeof label === 'string' ? null : label.href;
                return (
                  <li
                    key={`${text}-${index}`}
                    className={['sp-card-label', className].join(' ')}
                  >
                    {href ? (
                      href.startsWith('http') ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{text}</a>
                      ) : (
                        <Link to={href} style={{ color: 'inherit', textDecoration: 'none' }}>{text}</Link>
                      )
                    ) : text}
                  </li>
                );
              })}
            </ul>
          )}
          {copyright && (
            <p className="sp-card-copyright page-title-copyright">{copyright}</p>
          )}
        </header>
      )}

      <article className="content-wrapper">
        {(subtitle || lead) && (
          <div className="page-intro sdp-text-center sdp-mb-6 sdp-mx-auto">
            {subtitle && <h2>{subtitle}</h2>}
            {lead && <p className="lead">{lead}</p>}
          </div>
        )}
        {children}
      </article>

      <TableOfContentsDrawer isOpen={isTocOpen} onClose={() => setIsTocOpen(false)} />
    </>
  );
}

export function IconButton({
  label,
  children,
  onClick,
  className = '',
  disabled = false,
  presentation = false
}) {
  if (!onClick && !presentation && !disabled) return null;

  return (
    <ActionControl
      className={['sp-card-action', className].filter(Boolean).join(' ')}
      label={label}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </ActionControl>
  );
}

export function UniversalButton({
  children,
  onClick,
  variant = 'primary',
  size = '',
  type = 'button',
  className = '',
  disabled = false,
  icon = null,
  ariaLabel
}) {
  const sizeClass = size ? `btn-${size}` : '';
  const variantClass = variant ? `btn-${variant}` : '';

  return (
    <button
      className={['btn', variantClass, sizeClass, className].filter(Boolean).join(' ')}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      {icon && (
        <span className="icon-btn" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}

function CardHeader({ hasAuthor, authorHref, authorContent, hasMeta, pinVisible, pinLabel, onPin, dateTimeVisible, time, date, dateTime, handleDateTime }) {
  return (
    <header className="sp-card-header">
      {hasAuthor && (
        authorHref ? (
          <Link className="sp-card-author-link" to={authorHref}>
            {authorContent}
          </Link>
        ) : (
          <span className="sp-card-author-block">{authorContent}</span>
        )
      )}
      {hasMeta && (
        <div className="sp-card-meta">
          {pinVisible && (
            <ActionControl
              className="btn-icon-orange"
              label={pinLabel}
              onClick={onPin}
            >
              <PinIcon className="icon" />
            </ActionControl>
          )}
          {dateTimeVisible && (
            <DateTimeControl
              time={time}
              date={date}
              dateTime={dateTime}
              onClick={handleDateTime}
            />
          )}
        </div>
      )}
    </header>
  );
}

function CardBody({ imageUrl, imageAlt, calendarBadge, price, title, titleContent, TitleTag, subtitle, body, labels, copyright }) {
  return (
    <>
      {imageUrl && (
        <div className="sp-card-media-container" style={{ width: '100%', aspectRatio: '1 / 1', position: 'relative', overflow: 'hidden', background: 'var(--sdp-fons-subtil)', display: 'flex', flexDirection: 'column' }}>
          <img
            className="sp-card-media"
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      <div
        className={[
          'sp-card-body',
          (price || calendarBadge) && 'sp-card-body--with-aside'
        ].filter(Boolean).join(' ')}
      >
        {calendarBadge && (
          calendarBadge.onClick ? (
            <button
              type="button"
              className="sp-card-calendar-badge"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                calendarBadge.onClick();
              }}
              aria-label={calendarBadge.label || [calendarBadge.dia, calendarBadge.mes, calendarBadge.any].filter(Boolean).join(' ')}
              style={{ position: 'relative', zIndex: 20, cursor: 'pointer', border: '1px solid var(--sdp-accent-subtil)', padding: 0 }}
            >
              <time dateTime={calendarBadge.dateTime} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="sp-card-calendar-badge__dia">{calendarBadge.dia}</span>
                <span className="sp-card-calendar-badge__mes">{calendarBadge.mes}</span>
                {calendarBadge.any && <span className="sp-card-calendar-badge__any">{calendarBadge.any}</span>}
              </time>
            </button>
          ) : (
            <time
              className="sp-card-calendar-badge"
              dateTime={calendarBadge.dateTime}
              aria-label={calendarBadge.label || [calendarBadge.dia, calendarBadge.mes, calendarBadge.any].filter(Boolean).join(' ')}
            >
              <span className="sp-card-calendar-badge__dia">{calendarBadge.dia}</span>
              <span className="sp-card-calendar-badge__mes">{calendarBadge.mes}</span>
              {calendarBadge.any && <span className="sp-card-calendar-badge__any">{calendarBadge.any}</span>}
            </time>
          )
        )}
        {price && <p className="sp-card-price">{price}</p>}

        {title && <TitleTag className="sp-card-title">{titleContent}</TitleTag>}
        {subtitle && <h4 className="sp-card-subtitle">{subtitle}</h4>}
        {body && (
          typeof body === 'string' ? (
            <p className="sp-card-text">{body}</p>
          ) : (
            <div className="sp-card-text">{body}</div>
          )
        )}
        {labels.length > 0 && (
          <ul className="sp-card-labels" aria-label="Categories">
            {labels.map((label, index) => {
              const text = typeof label === 'string' ? label : label.text;
              const className = typeof label === 'string' ? 'sdp-badge-tag' : label.className || 'sdp-badge-tag';
              const href = typeof label === 'string' ? null : label.href;
              return (
                <li
                  key={`${text}-${index}`}
                  className={['sp-card-label', className].join(' ')}
                >
                  {href ? (
                    href.startsWith('http') ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{text}</a>
                    ) : (
                      <Link to={href} style={{ color: 'inherit', textDecoration: 'none' }}>{text}</Link>
                    )
                  ) : text}
                </li>
              );
            })}
          </ul>
        )}
        {copyright && <p className="sp-card-copyright">{copyright}</p>}
      </div>
    </>
  );
}

function CardFooter({ hasIconActions, translateVisible, handleTranslate, commentVisible, handleComment, shareVisible, handleShare, connectVisible, connectLabel, handleConnect, connectAriaLabel }) {
  return (
    <footer className="sp-card-footer">
      {hasIconActions && (
        <div className="sp-card-actions">
          {translateVisible && (
            <IconButton label="Traduir" onClick={handleTranslate} presentation>
              <TranslateIcon className="icon" />
            </IconButton>
          )}
          {commentVisible && (
            <IconButton label="Comentar" onClick={handleComment} presentation>
              <CommentIcon className="icon" />
            </IconButton>
          )}
          {shareVisible && (
            <IconButton label="Compartir" onClick={handleShare} presentation>
              <ShareIcon className="icon" />
            </IconButton>
          )}
        </div>
      )}
      {connectVisible && (
        <ActionControl
          className="sp-card-connect"
          label={connectLabel}
          onClick={handleConnect}
          aria-label={connectAriaLabel}
        >
          {connectLabel}
        </ActionControl>
      )}
    </footer>
  );
}

export function UniversalCard({
  title,
  headingLevel = 'h3',
  subtitle,
  body,
  location,
  time,
  date,
  dateTime,
  author,
  authorHref,
  avatarUrl,
  avatarAlt = '',
  imageUrl,
  imageAlt = '',
  price,
  labels = [],
  mainHref,
  onMainClick,
  copyright,
  calendarBadge = null,
  isAvis = false,
  hasFooter,
  showPin,
  showDateTime,
  showTranslate,
  showComment,
  showShare,
  showConnect,
  onPin,
  onDateTime,
  onTranslate,
  onComment,
  onShare,
  onConnect,
  connectLabel = 'Connectar'
}) {
  const navigate = useNavigate();
  const handleConnect = onConnect || (() => navigate('/connectar?item_id=' + encodeURIComponent(title || 'card')));
  const handleTranslate = onTranslate || (() => navigate('/traduccions'));
  const handleComment = onComment || (() => navigate('/xat'));
  const handleShare = onShare || (() => {
    if (navigator.share) {
      navigator.share({ title: title || document.title, url: mainHref || window.location.href }).catch(console.error);
    } else {
      navigator.clipboard.writeText(mainHref ? (window.location.origin + mainHref) : window.location.href);
      alert('Enllaç copiat al porta-retalls');
    }
  });
  
  const handleDateTime = onDateTime || ((e) => {
    e.preventDefault();
    e.stopPropagation();
    let yyyymmdd;
    if (dateTime) {
      yyyymmdd = dateTime.split('T')[0];
    } else if (date) {
      const parts = date.split('/');
      if (parts.length === 3) {
        let [dd, mm, yy] = parts;
        if (yy.length === 2) yy = '20' + yy;
        yyyymmdd = `${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      } else {
        const d = new Date(date);
        if (!isNaN(d.getTime())) yyyymmdd = d.toISOString().split('T')[0];
      }
    }
    if (yyyymmdd) {
      navigate(`/mur?date=${yyyymmdd}`);
    } else {
      navigate('/mur');
    }
  });

  const hasAuthor = Boolean(author || avatarUrl || location);
  const footerDefaultsVisible = hasFooter === true;
  const pinVisible = showPin ?? Boolean(onPin);
  const dateTimeVisible = showDateTime ?? Boolean(time || date || onDateTime);
  const translateVisible = showTranslate ?? (footerDefaultsVisible || Boolean(onTranslate));
  const commentVisible = showComment ?? (footerDefaultsVisible || Boolean(onComment));
  const shareVisible = showShare ?? (footerDefaultsVisible || Boolean(onShare));
  const connectVisible = showConnect ?? (footerDefaultsVisible || Boolean(onConnect));
  const hasMeta = pinVisible || dateTimeVisible;
  const hasHeader = hasAuthor || hasMeta;
  const hasIconActions = translateVisible || commentVisible || shareVisible;
  const footerVisible = hasFooter === false ? false : hasIconActions || connectVisible;
  const TitleTag = headingLevel || 'h3';

  const authorContent = hasAuthor && (
    <span className="sp-card-author">
      {avatarUrl && (
        <img
          alt={avatarAlt}
          className="sp-card-avatar"
          src={avatarUrl}
          width="48"
          height="48"
        />
      )}
      {(author || location) && (
        <span className="sp-card-author-info">
          {author && <span className="sp-card-author-name">{author}</span>}
          {location && <span className="sp-card-author-location">{location}</span>}
        </span>
      )}
    </span>
  );

  const titleContent = title;
  const pinLabel = title ? `Ancorar ${title}` : 'Ancorar';
  const connectAriaLabel = title ? `${connectLabel} amb ${title}` : connectLabel;

  return (
    <article className={['sp-card', isAvis && 'sp-card--avis'].filter(Boolean).join(' ')}>
      {hasHeader && (
        <CardHeader 
          hasAuthor={hasAuthor}
          authorHref={authorHref}
          authorContent={authorContent}
          hasMeta={hasMeta}
          pinVisible={pinVisible}
          pinLabel={pinLabel}
          onPin={onPin}
          dateTimeVisible={dateTimeVisible}
          time={time}
          date={date}
          dateTime={dateTime}
          handleDateTime={handleDateTime}
        />
      )}

      {mainHref ? (
        <Link className="sp-card-link-overlay" to={mainHref} onClick={onMainClick} aria-label={title || 'Obrir detall'} />
      ) : onMainClick ? (
        <button type="button" className="sp-card-link-overlay" onClick={onMainClick} aria-label={title || 'Obrir detall'} />
      ) : null}

      <CardBody
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        calendarBadge={calendarBadge}
        price={price}
        title={title}
        titleContent={titleContent}
        TitleTag={TitleTag}
        subtitle={subtitle}
        body={body}
        labels={labels}
        copyright={copyright}
      />

      {footerVisible && (
        <CardFooter
          hasIconActions={hasIconActions}
          translateVisible={translateVisible}
          handleTranslate={handleTranslate}
          commentVisible={commentVisible}
          handleComment={handleComment}
          shareVisible={shareVisible}
          handleShare={handleShare}
          connectVisible={connectVisible}
          connectLabel={connectLabel}
          handleConnect={handleConnect}
          connectAriaLabel={connectAriaLabel}
        />
      )}
    </article>
  );
}

export function UniversalIndicatorCard({
  icon,
  title,
  subtitle,
  active,
  onClick,
  iconColor,
  className = ''
}) {
  return (
    <button 
      type="button"
      className={`sdp-indicator-card ${active ? 'active' : ''} ${className}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="sdp-indicator-card-icon" style={iconColor ? { color: iconColor } : {}}>
        {icon}
      </span>
      <span className="sdp-indicator-card-title">{title}</span>
      {subtitle && <span className="sdp-indicator-card-subtitle">{subtitle}</span>}
    </button>
  );
}

```


---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
