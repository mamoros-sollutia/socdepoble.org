---
estat: "actiu"
tipus: "acta"
---

# 🌅 Acta de la Marmota: Tancament i Pla d'Acció Immediat

Salutacions a mi mateixa a la propera sessió. Aquesta Acta estableix exactament on hem deixat les coses i quin és l'únic pla d'acció que has d'executar immediatament en obrir el xat abans d'iniciar la nova "Petorreta Internacional".

**Data del snapshot**: Avui s'ha creat una còpia de seguretat 100% segura mitjançant el nou protocol de la Time Machine (`tooling/gates/estela.sh`), gravant l'estat exacte del worktree sense friccions.
**Estat de neteja**: El Brain està descarregat. El domini etnogràfic ha estat mogut correctament fora del sistema Sollutia (`../_cultura_de_poble`).

## 🎯 OBJECTIU PRIORITARI DE LA NOVA SESSIÓ
Tens una tasca arquitectònica aprovada pendents d'implementar. El Consell (Seient 5) ha establert 10 fragments crítics que **HAS DE** portar a terme ara mateix per sanejar el codi (CSS, JSX, i Sistema de Seguretat). 

### PASSOS EXACTES A EXECUTAR ARA MATEIX:

#### 1. Portes de Seguretat i Manteniment (Aplicar immediatament)
- **`package.json`**: Afegeix `"porta:manual": "node tooling/gates/tractor-manual.mjs"`, `"porta:consell": "node tooling/gates/tractor-consell.mjs"`, i `"porta": "npm run porta:manual && npm run porta:consell"`. Posa `npm run porta` al principi del script `"build"`.
- **`.husky/pre-commit`**: Afegeix les instruccions:
  ```sh
  sh tooling/gates/estela.sh "pre-commit"
  node tooling/gates/tractor-manual.mjs  || exit 1
  node tooling/gates/tractor-consell.mjs || exit 1
  node tooling/wiki/pre-commit.mjs       || exit 1
  ```
- **`tooling/gates/design_guard.mjs`**: Revisa que tinga `.jsx` al set d'extensions a escanejar (línia 5).
- **Moure arxius**: Mou `archive_scripts/tractor-manual.mjs` cap a `gates/tractor-manual.mjs`. Mou `wiki/tractor-consell.mjs` cap a `gates/tractor-consell.mjs`.

#### 2. Fonts i CSS Central (Fragment 1, 6, 7, 9 i 10)
Al fitxer `src/css/index.css`:
- Substitueix `--sdp-pedra-75` per `--sdp-pedra-100` als fons de l'app. Afegeix `--sdp-blanc` i `--sdp-negre`.
- Resol la pèrdua de variables dins del Shadow DOM afegint el bessó `:host([data-theme="dark"])` sempre junt al `:root[data-theme="dark"]` on el tema estiga en ús, especialment per `.light-only`, `.dark-only` i `.sp-card-calendar-badge:hover`.
- Injecta a la secció de botons la nova gramàtica per als Filtres del Mur (`.sdp-filtres`, `.sdp-filtre--vista`, `.sdp-filtre--camp`, etc.), on el blau és arquitectura i el taronja és mode/estat, tal com indica l'Informe 5.
- Substitueix tot l'estil `.sp-card-calendar-badge` i aplica `grid-template-columns` a `.sp-card-body--with-aside`.
- Inserta les regles `.sdp-badge-poble` i `.sdp-badge-poble--actiu`.

#### 3. Pàgina Accessible a IA (DesignSection.jsx i CSS)
Al fitxer `src/sections/disseny/DesignSection.jsx`:
- Substitueix les etiquetes del codi "Taronja text" i "Blau text" per "Taronja fort" i "Blau fort" acompanyant-les amb la nota: "Text accent sobre fons clar · fons massís de botó important" (pel Taronja fort).
- **MOLT IMPORTANT:** Afegeix una nova sub-secció 🤖 **LLEIS DE PEDRA SECA PER A IAs ARQUITECTES** que explique de forma explícita les regles a les IAs (prohibició d'estils en línia `style={{}}`, l'arquitectura de 2 capes semàntiques de OKLCH, i com el `Shadow DOM` obliga a duplicar els selectors `:host([data-theme="dark"])`).

#### 4. Mode Fosc i Sincronització (Fragments 4 i 5)
- **`src/app/AppDataContext.jsx`**: Unifica la font de veritat llegint des de l'atribut HTML `data-theme` en lloc de cridar el `JSON.parse` del `localStorage`. Fes el fallback corresponent a 'light' i guarda el tema com text cru `dark` i `light`.
- **`src/app/App.jsx`**: A `useLayoutEffect`, aplica el `setAttribute('data-theme', tema)` tant al `document.documentElement` com al `mainRef.current.getRootNode().host` perquè WordPress i l'Shadow DOM no discrepen.

#### 5. JSX del Mur (Fragment 8)
- A **`src/sections/mur/MurSection.jsx`**: Elimina l'ús d'estils en línia (res de `style={{}}`) en els botons de filtrat. Refactoritza per a usar els nous atributs `aria-pressed` i la nova distribució de les classes `sdp-filtres`. Soluciona l'error `.startswith` passant-ho a majúscula `.startsWith()`.

---

Quan hagis implementat tots i cadascun d'aquests punts, la tasca estarà finalitzada. Podràs avisar al Mestre Javi, i llavors començareu la nova "Petorreta Internacional".

Som-hi IAIA, fes memòria i avant!
