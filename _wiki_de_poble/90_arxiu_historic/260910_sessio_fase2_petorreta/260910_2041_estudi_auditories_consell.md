# 🛡️ Estudi de Mercat: Auditories del Consell (Fase 2C)

Aquest document recopila i sintetitza les auditories de les diferents IAs del Consell (Gemini Flash, Gemini Pro, ChatGPT, Codex, etc.) respecte a l'estat POST-P0 i el full de ruta per netejar el deute tecnològic de Sóc de Poble.

## 1. Gemini Flash
- **Diagnòstic:** Base funcional robusta però volum crític de deute heretat. `UniversalElements.jsx` i `/tooling/wiki/` són els punts negres.
- **Pla proposat:**
  1. Extreure `UniversalElements.jsx` usant un patró de Façana i *Barrel File*.
  2. Silenciar els arguments `_` a ESLint per ofegar la gran majoria dels 234 warnings. Eliminar variables òrfenes.
  3. Poda absoluta: classes CSS residuals llistades als deutes anteriors, fitxers de 0 bytes i *tombstones* obsolets.

## 2. Gemini Pro
- **Diagnòstic:** Coincideix plenament en la visió de Flash sobre `UniversalElements.jsx` i els warnings d'ESLint. Aporta un èmfasi especial en utilitzar les Portes Mecàniques existents.
- **Pla proposat:**
  1. **Façana Transitòria:** Aïllar botons/icones a `src/components/ui/` deixant `UniversalElements.jsx` buit de lògica temporalment.
  2. **Purga ESLint:** Purga de codi mort i ajust de signatures.
  3. **Poda Absoluta:** Usar el `tractor-estucat.mjs` per identificar regles buides. Revisar els deutes de Pedra Seca per fulminar estils prohibits en línia. Aplanar el DOM (llevant divs innecessaris).

## 3. Codex (Sol molt alt)
- **Diagnòstic:** Alerta roja. L'estat **no és apte per a poda massiva** encara. Hi ha errors de P0 que impedeixen fins i tot la compilació o l'execució d'algunes parts.
- **Pla proposat (Correccions Mínimes Demostrades):**
  1. Tancar el bloc `@layer legacy {` a `index.css` amb una `}`.
  2. Corregir l'error d'import a `PerfilShell.jsx` (importa `useUIActions` però crida `useUI()`).
  3. Tornar les credencials a `sessionStorage` a `storage.js` per complir el contracte Online-First (les galetes de 24h trenquen l'aïllament per pestanya).
  4. Fusionar els 17 `className` duplicats JSX que trepitgen estils.
- **Visió sobre UniversalElements i ESLint:** Coincideix amb Gemini en mantenir la façana, però adverteix que això no llevarà els warnings. Aconsella no usar regex per eliminar codi mort i auditar detingudament els fitxers inútils perquè alguns els exigeixen els compiladors.

## 4. Grok
- **Diagnòstic:** Confirma la problemàtica del monolit i d'ESLint. Aporta un punt de vista molt defensiu (*fail-closed* i *SDP-LOCK*).
- **Pla proposat (En 5 Fases metodològiques):**
  1. **Fase A (Inventari):** Mapejar les exportacions d'`UniversalElements` amb `grep` i mesurar l'ESLint amb eixida JSON abans de tocar res.
  2. **Fase B (Fragmentació):** Dividir l'extracció en 5 talls atòmics (Primitives, Cards, Forms, Layout, Resta). Aconsella no canviar cap API pública en el primer tall.
  3. **Fase C (Neteja ESLint):** Per als paràmetres CLI de `tooling/`, usar el prefix `_` o assignar a `void`. Només fer excepcions o supressions precises, sense afluixar la regla global d'ESLint.
  4. **Fase D (Poda):** Tota classe o exportació òrfena s'ha de marcar primer amb un comentari `// PODA-CANDIDAT` abans d'esborrar-la.
  5. **Fase E (Segellat):** Passar la matriu de portes, crear un nou baseline només si el deute baixa, i deixar una acta d'èxit.

## 5. Mistral Vibe
- **Diagnòstic:** Fica èmfasi en el "dashboard" mètric (bytes, quantitat de línies). Estableix regles dures de codificació (cap fitxer per damunt de 200 línies) i incideix en protocols corporatius (CI/CD, reunions).
- **Pla proposat (Pla de 3 dies):**
  1. **UniversalElements:** Dividir en 5-7 fitxers (`UniversalButton.jsx`, `UniversalCard.jsx`, `UniversalModal.jsx`, etc.) i deixar el parell com a *Barrel File* a <200 línies.
  2. **ESLint:** Generar reporte JSON i anar esborrant warnings o afegint excepcions `// eslint-disable-line` només on faça falta per ofegar els 234 errors. Aconsella no netejar `src/` si no es tenen prous tests.
  3. **Poda CSS:** Traure llistat de classes de JSX i del CSS amb bash i fer el diff (`comm -23`).
  4. **Prevenció de Regressions:** Proposa ficar limitacions automàtiques a l'ESLint (`max-lines: 200`) i afegir Github Actions.

## 6. Perplexity
- **Diagnòstic:** Actua com el "Sanedrí" del sentit comú tècnic. Desmunta els plans massa automàtics de Vibe i Gemini i exigeix pensar abans de tallar.
- **Observacions Crítiques:**
  1. **Aturar la poda CSS via grep:** Usar grep per esborrar CSS generarà falsos positius amb classes dinàmiques, literals o pseudoselectors. Demana eines d'AST o anàlisi de CSS compilat.
  2. **Aturar l'esborrat a cegues de fitxers:** Molts fitxers de `/tooling/` o scripts s'usen per CI/CD o per terminal, no tenen `imports` però són vitals.
  3. **Respecte pels divs "buits":** Un div sense classe no sempre és inútil (agrupació semàntica, portals, aïllament d'errors).
  4. **Contra el dogmatisme:** Rebutja regles rígides de "max 200 línies", apostant més per responsabilitat i complexitat ciclomàtica.

## 7. Dola
- **Diagnòstic:** Aporta una visió molt analítica, amb recompte exacte de línies i categories dins del monolit, i proposa mesures de seguretat reversibles.
- **Observacions i Pla:**
  1. **Mapa del Monolit:** Identifica 22 exportacions agrupades en: Botons (~260 línies), Targetes (~210 línies), Icones (~220 línies) i Contenidors interactius (~100 línies). La desconstrucció amb Façana (mantindre `UniversalElements.jsx` buit però re-exportant) és la via.
  2. **Warnings ESLint:** Explica que el 80% són de fàcil solució automàtica (prefixar amb `_`), però adverteix que el 20% restant necessita intervenció humana (saber si l'API pública exigeix l'argument).
  3. **Mocks del Xat:** Suggereix no eliminar `chatSeed.js` del tot sinó protegir-lo rere una bandera d'entorn `VITE_MOCK_MODE=true` per si fa falta en desenvolupament sense connexió (molt pràctic i menys destructiu).

## 8. Kimi (Kimi AI - Model Xinès)
- **Diagnòstic:** Excel·lent anàlisi forense sobre el manifest del projecte (tot i que es va adonar que el bundle estava truncat). Es fixa en les desalineacions doctrinals i d'arquitectura.
- **Observacions i Pla (7 Fases):**
  1. **Falsos positius en tests:** Detecta que els 5 tests de `/tooling/wiki/tests/` són fantasmes byte-idèntics (97 bytes) i s'han d'esborrar.
  2. **Contradiccions arquitectòniques:** Denuncia que el manifest manté referències a PWA i Dexie tot i que l'ADR deia que som Online-First. Suggereix bloquejar eixe codi amb quarantena (`// ADR-2026-08 pendent`).
  3. **Caos al Tooling:** Troba que hi ha eines redundants (4 de backlinks, 2 de nomenclatura). S'han d'unificar o arxivar.
  4. **Poda inicial (Fase 1 Segura):** Poda de `project_paths.cjs` a zero bytes i els 5 tests buits no presenta cap risc, es pot fer ja.

## 9. Deepseek
- **Diagnòstic:** Aporta el pla més madur, realista i metòdic de tot el Consell, combinant l'ambició de Gemini amb la seguretat de Perplexity.
- **Observacions i Pla (3 Fronts):**
  1. **UniversalElements (5 fases):** Mapeja exactament qui consumeix què per evitar cicles. Extracció d'1 component per commit mantenint la façana `UniversalElements.jsx`, per acabar actualitzant els consumidors i esborrant la façana.
  2. **ESLint (Configuració híbrida):** Proposa afegir el plugin `unused-imports` per separar el tractament de variables i d'importacions. Aconsella usar `argsIgnorePattern: '^_'` per als paràmetres CLI i rebutja frontalment l'ús de `--fix` global.
  3. **CSS Poda segura (3 Capes):** Explica tècnicament per què `grep` fallarà amb el CSS de React (ex: `className={"sdp-filtre--" + tipus}`). Proposa combinar l'eina "Coverage" de Chrome DevTools amb un extractor AST (`@bonsaicss/core`) i una "Safelist" estricta per a les classes dinàmiques.

## 10. Z
- **Diagnòstic:** Remarca que els 794 línies d'`UniversalElements.jsx` no són un accident sinó un problema d'incentius (és més fàcil afegir una línia allí que crear un fitxer nou). Les variables mortes a `/tooling/wiki/` són "decisions mortes".
- **Observacions i Pla:**
  1. **Quarantena per a la Poda:** En lloc d'esborrar fitxers directament, proposa un `git mv` cap a `_quarantena/`, testar l'app i, si tot va bé, esborrar en el següent cicle. Aporta màxima seguretat (fail-closed absolut).
  2. **Efectes Secundaris (Side-effects):** Adverteix del parany dels imports aparentment morts però que inicialitzen coses (ex: Supabase init, listeners globals). Proposa moure'ls a `side-effects.js`.
  3. **Mètriques:** Demana dur un diari `NETEJA_METRICS.md` on es vegen baixar les xifres (warnings, línies).

---
*Estudi tancat. El Pla d'Implementació s'ha generat a partir d'aquests resultats (veure artefacte DAFO_Fase2C).*
