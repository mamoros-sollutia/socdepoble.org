---
tipus: document
estat: esborrany
description: "🛡️ PETORRETA AL CONSELL: AUDITORIA TÈCNICA (Deepseek)"
---
# 🛡️ PETORRETA AL CONSELL: AUDITORIA TÈCNICA (Deepseek)

## 1. Resum executiu
El projecte **Sóc de Poble** és un ecosistema digital rural ambiciosíssim. La governança és explícita i mecànica. Tanmateix, hi ha una bretxa entre la doctrina i l'execució, especialment en el compliment estricte dels estàndards de disseny "Pedra Seca" i la gestió del deute tècnic.

**Puntuació de Trellat estimada: 72/100**

## 2. Punts forts
- Governança explícita i mecànica.
- Separació clara entre saber i fer (Wiki vs Codi).
- Documentació exhaustiva.
- Sistema immunitari propi (Plaquetes, tractors).
- Enfocament rural i accessible.

## 3. Punts dèbils i deute observat
### A. Deute de disseny (Pedra Seca)
- **Estils en línia (`style={{}}`)**: presents a `UniversalEditorShell`, `DevicesSection`, etc.
- **Classes Tailwind il·legals**: `bg-*`, `text-*`, `rounded-*`.
- **Colors en cru**: `#FF7300`, etc.
- **Regles CSS buides**: Detectat per `tractor-estucat.mjs`.
- **Incoherències cromàtiques**: La rampa de `--sdp-pedra-*` no és monotònica.

### B. Deute d'arquitectura
- **Dualitat de rutes**: `App.jsx`, `sections.js`, `navigation.js`.
- **Codi mort**: `notes-column-header`, `perfil-columna-capcalera`.
- **Shim JSX inadequat**: `jsx-runtime.js` pot esborrar contingut en elements amb clau.

### C. Deute de procés (Promeses no complertes)
- 14 promeses escrites en comentaris (`TODO`) sense portes que les facin complir. Exemple: `despertar.mjs`.

### D. Context i RAG
- Els indexadors exclouen l'Escriptori però inclouen l'arxiu històric. La IA recupera informació antiga.

### E. Tests i CI
- No hi ha tests d'accessibilitat reals.
- La porta `porta:promesa` falla i talla la cadena de CI.
- Traduccions al basc i gallec no sincronitzades amb el català a `i18n.js`.

## 4. Propostes de millora
1. Reduir deute de disseny (llevar inline styles i tailwind prohibit).
2. Unificar rutes.
3. Tancar promeses (convertir TODOs en portes).
4. Revisar l'índex RAG (incloure Escriptori, excloure historic).
5. Activar el CI real.
6. Millorar la paritat d'idiomes.

## 5. Veredicte final
El poble està ben cuidat, però encara hi ha pedres per col·locar. Es recomana prioritzar la neteja del codi (Fase 2) per damunt de noves funcionalitats.
