---
name: pedra-seca
description: >-
  Llei Estructural, Tokens i CSS root definitiu (Pedra Seca Design System) per
  aplicacions Sóc de Poble.
authority: IAIA MarIA
version: V1
tags:
  - accessibilitat
  - trellat
aliases:
  - Pedra Seca Specs
  - Sistema de Disseny
created_at: '260627_0240'
updated_at: '260628_1618'
---
# Pedra Seca Design System (Aplicació Web Offline-first)

Aquest document estableix la Llei Estructural, Tokens i Sistema de referència per a aplicacions Sóc de Poble (A10-Optimitzat). Tota definició és "Llei de Ferro" seguint el [[el_trellat|Trellat]] i actua com a *CSS root* (el nucli central on s'emmagatzemen les variables globals de colors i mides perquè tota l'aplicació bega d'elles sense repetir codi).

Aquest Sistema de Disseny no opera de forma aïllada. És el front-end visual concebut per a vestir la robusta [[04_arquitectura_disseny/arquitectura_tecnica|Arquitectura Resilient]] (PWA Offline-first) i per a donar resposta tàctil i estètica a les decisions del cervell sintètic governat per l'[[04_arquitectura_disseny/arquitectura_cognitiva|Arquitectura Cognitiva]].

## 1. Tokens de Color Base (Variables Globals CSS)

Establiment de l'escala de "Tints" matemàtica, assegurant un ús coherent tant a fons com a vores per a garantir alta visibilitat.

```css
:root {
  /* COLORS CANÒNICS (Base 100%) */
  --sp-black-100: #000000;      /* RGB(0,0,0) - Nit Sòlida */
  --sp-white-100: #FFFFFF;      /* RGB(255,255,255) - Llum Pura */
  --sp-orange-100: #FF7300;     /* RGB(255,115,0) - Corporatiu */
  --sp-blue-100: #0984E3;       /* RGB(9,132,227) - Protocol normatiu i IAIA */

  /* ESCALA ORANGE (Taronja Sóc de Poble - Tints calculats sobre blanc) */
  --sp-orange-80: #FF8F33;      /* Estat "Surar" (Hover) sobre base taronja forta */
  --sp-orange-50: #FFB980;      /* Fons secundaris o taronges de selecció desactivada */
  --sp-orange-20: #FFE3CC;      /* Avís Efímer / Toast (Light warning background) */
  --sp-orange-10: #FFF1E6;      /* Fons taronja quasi imperceptible */

  /* ESCALA BLAU (Normatiu - Tints calculats sobre blanc) */
  --sp-blue-80: #3A9DE9;        /* Estat "Surar" (Hover) de botó primari iaia */
  --sp-blue-50: #84C2F1;        /* Borders / Marges IAIA passius */
  --sp-blue-20: #CEE6FA;        /* Fons de globus Xat / Fons informatiu */
  --sp-blue-10: #E7F3FD;        /* Estat Seleccionat primari en fons clar */

  /* TOKENS D'ESTRUCTURA MÈTRICS (REM basats en em=16px) */
  --sp-radius-main: 1.75rem;    /* Corbes GEM (28px equivalent a geometria) */
  --sp-radius-secondary: 1.125rem; /* Secundari (18px eq) */
  --sp-shadow-elevate: 0 10px 30px rgba(0, 0, 0, 0.15); /* Protocol ombres genèric PWA */
}
```

## 2. Màxim Contrast Visual (Estàndard d'Accessibilitat)

Al dissenyar pantalles que s'han de llegir a l'exterior sota la llum directa del sol (entorns rurals amb iPad):

- **Fons Orange 100% (`#FF7300`)**: Text obligat: **NEGRE** (`#000000`). Contrast Ratio aproximat: **8.5:1** (Supera sobradament el 7:1 obligatori pel AAA). NO ES POT POSAR TEXT BLANC ací, cauria baix del ratio acceptable (~2.4:1).
- **Fons Blau 100% (`#0984E3`)**: Text obligat: **BLANC** (`#FFFFFF`). Contrast Ratio aproximat: **4.8:1** (APTE per a AA en text petit i AAA en text gran d'encapçalament >18pt).


## 3. Diccionari "Trellat" (Ex-Anglicismes i Accions d'Estats)

Tota la definició oficial d'estats interactius (Hover, Active, etc.) i components de front-end (Toast, FAB, Modal) es troba centralitzada a l'única font de veritat: [[diccionari_trellat|Diccionari Trellat]].

### Exemples Estats Botó Genèric (Vainilla CSS)
L'optimització de termodinàmica pura per PWA (zero scripts nocius d'animació Javascript complexes, utilitzant només renders purs CSS del navegador del xip A10):
```css
.btn-trellat-primary {
  background-color: var(--sp-orange-100);
  color: var(--sp-black-100);
  border-radius: var(--sp-radius-main);
  padding: 1rem 1.5rem; /* Ajust autoescalable a mides grans per a dits robustos */
  font-weight: 700;
  transition: all 0.2s ease-in-out; 
}

/* Surar (Hover) */
.btn-trellat-primary:hover {
  background-color: var(--sp-orange-80);
  transform: translateY(-2px); /* Eleva sense rebombori pesat de CPU */
  box-shadow: var(--sp-shadow-elevate);
}

/* Premut (Active) */
.btn-trellat-primary:active {
  background-color: var(--sp-orange-100); /* Restableix a fons principal d'impacte */
  transform: translateY(1px); /* Contacte mecànic d'apretó */
  box-shadow: none; /* Apaga l'ombra */
}

/* Sec (Disabled) */
.btn-trellat-primary:disabled {
  background-color: var(--sp-orange-20);
  color: rgba(0, 0, 0, 0.4);
  cursor: not-allowed;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .btn-trellat-primary,
  .btn-trellat-primary:hover,
  .btn-trellat-primary:active {
    transition: none;
    transform: none;
    animation: none;
  }
  
  /* Desactivar tota animació CSS al Mas */
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 4. Estacionament Tàctic (Breakpoints de Reforç per IA)
La PWA opera per defecte sota "Mobile-First" amb disseny fluïd, però respon mecànicament a:
1. `--bp-esmentat` o `max-width: 480px`: Telèfon mòbil estàndard d'alqueria.
2. `--bp-tauleta` o `min-width: 768px`: Entrada en joc de la Barra Lateral, deixant el *Drawer* ocult. Optimització bàsica iPad A10 Vertical.
3. `--bp-gran` o `min-width: 1024px`: Desktop panoràmic. El plafó central assoleix ample fix o maximitza a calaixos multi-informatius (ex. Llista Pàgina Esquerra, Detall Dreta).

## 5. Llei de Maquetació Universal (Jerarquia H1-H6)

Per mantindre una lectura coherent i nativa sense injectar CSS brut, s'ha d'utilitzar SEMPRE la jerarquia de Markdown:
- **H1 (Títol de Pàgina / Arrel):** Taronja, Centrat i Llarg. Genera l'slug.
- **H2 (Subtítol):** Subtítol genèric sota l'H1.
- **H3 (Nom del Document):** Blau. Reservat per al nom de l'arxiu (Ex: "📄 GENOTIP").
- **H4 (Títol Intern - `#`):** Taronja. Títol principal DINS del Markdown.
- **H5 (Subsecció - `##`):** Blau. Blocs o llistes enumerades.
- **H6 (Kicker / Preàmbul - `###`):** Negre i Negreta. Separador ideal abans de llistes per donar "aire" sense usar CSS.

**PROHIBICIÓ `<hr>` (---):** Les línies horitzontals sense criteri embruten l'arquitectura i creen fantasmes visuals en pantalles xicotetes. La separació es fa exclusivament amb títols (H4, H5, H6).

## 6. Antipatrons: La Traïció vs El Trellat (Llista Negra)

### 🚫 AÇÒ NO (Tailwind Tòxic)
- `className="bg-[#FF7300] text-white rounded-[28px] p-6 shadow-lg"`
  *Raó:* Codi inflexible, mescla estètica amb estructura, colors i radis hardcodejats, i viola l'estàndard de Màxim Contrast Visual d'accessibilitat.
- `<h2>Festes</h2> <hr className="my-8" /> <p>Inici</p>`
  *Raó:* L'etiqueta `<hr>` (fantasmes visuals) està prohibida.

### ✅ AÇÒ SÍ (Arquitectura Sóc de Poble)
- `<article className="flex flex-col gap-4 w-full sosp-card">`
  *Raó:* Tailwind només maqueta l'espai (cos). La classe genèrica `.sosp-card` gestiona la pintura (vestit).
- `margin-top: var(--sp-espai-4)`
  *Raó:* Ús de l'escala oficial d'espaiat (Carrer).

## 7. Capçaleres de Ciment (Estructures HTML Inquebrantables)
Per garantir que les barres de navegació suporten dispositius de 320px sense trencar-se:

### 7.1. Capçalera Universal (Barra Negra Principal)
S'utilitza per a la navegació arrel de l'app. Alçada fixa de 56px (`h-[56px]`), graella de flexió per repartir l'espai i icones adaptatius que minven per a pantalles inferiors a 350px.
*(Codi HTML de referència disponible als arxius històrics del repositori `src/components/layout/Header.jsx`)*

### 7.2. Capçalera de Context / Xat (Barra Color Yin-Yang)
Fons que canvia de Taronja (Mode Clar) a Blau fosc (Mode Nit). Inclou sempre la barra de cerca arrodonida amb `focus-within:ring-[#0369A1]`.


## 🔗 Veure també (Enllaços de Tornada)
- [[04_arquitectura_disseny/arquitectura_tecnica|Arquitectura Tècnica (La Infraestructura)]]
- [[04_arquitectura_disseny/arquitectura_cognitiva|Arquitectura Cognitiva (El Cervell)]]
- [[02_filosofia/el_trellat|El Trellat]]
