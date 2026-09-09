# Estudi d'Auditoria: Bloc de Notes i Arquitectura (260909)

Aquest document recopila els dictàmens de la "Família Electrònica" (Consell d'IAs) per a poder tenir-los en context fresc, analitzar les divergències i consensuar un Pla d'Implementació robust quan finalitzen totes les consultes.

---

## 1. DICTAMEN DE CLAUDE (Seient Núm. 5)

**Punts Clau:**
- **P0 Guardat (CAS):** Les notes no es guarden a partir de la segona modificació. L'estat `rawNotes` no s'actualitza i genera un error 409 fals. Solució: `useRef(new Map())` per a fer el seguiment de revisions al client.
- **58px Capçaleres:** Cinc alçades diferents (56, 58, 59). Solució CSS unificant `--app-grid-header-height: var(--sdp-alt-accio)`.
- **Doble Propòsit (Perfil/Notes):** L'abstracció ja existeix, però la dependència CSS està invertida. Solució: Crear `.app-grid-pane` a `AppGridShell.css` i llevar `.notes-column--editor`.
- **Responsive Fantasma:** `isCompact` i `mobilePanel` no s'exporten al context, però s'usen.
- **Tema Fosc Sollutia:** Cal afegir `:root` i `:host` als selectors `[data-theme="dark"]`.
- **Compatibilitat iOS 15:** L'ús de `:has()` trenca l'obertura del menú lateral. Cal passar a atribut `data-panell`.
- **Poda:** Eliminar CSS mort, JS inútil de `NotesEditor` (còpia de l'Universal), botons morts (`creaNota`).
- **Privacitat / Bugs:** `section_submissions` no filtra per propietari, `folder_id` per defecte és 'general' (no existeix), i s'admet SVG com a imatge. `sessionStorage` es bloqueja amb les imatges de portada i para de guardar esborranys.

---

## 2. DICTAMEN DE GEMINI

**Punts Clau:**
- **Incompliment Llei Mida:** Coincideix amb Claude en el desajust de capçaleres a `AppGridShell.css`.
- **Sopa de DOM (DOM Soup):** Coincideix en l'abstracció. Proposa eliminar wrappers `<aside>` i `<section>` redundants a `NotesSidebar` i `NotesList` i usar `.app-grid-menu-item` i `.app-grid-list-card`.
- **Violació Llei Persistència:** Es llig `sessionStorage.getItem` directament. Cal usar `getEfimer` de `storage.js`.
- **Desconnexió Estat/Ruta:** En fer clic a una nota, s'actualitza l'estat local però no la URL (`?nota=...`).

---

## 3. DICTAMEN DE GROK

**Punts Clau:**
- **Capçaleres 58px:** Coincideix completament amb Claude i Gemini. Aporta el codi CSS net per a unificar.
- **Abstracció Layout:** Coincideix amb Claude en fer `UniversalEditorShell` agnòstic de Notes.
- **Poda:** Coincideix amb Claude en netejar les classes de `.notes-column-header`.
- **Auditoria Destructiva:** Identifica alertes addicionals com la dualitat de schemas de frontmatter, atribut `inert=""` buit, dependències antigues de `fs` vs `node:fs` (tractors), i un `alert()` nadiu a NotesEditor que s'hauria de canviar per `AvisadorEfimer`.

---

## 4. DICTAMEN DE MISTRAL VIBE

**Punts Clau:**
- **Capçaleres 58px:** Coincideix amb els altres, però proposa un enfocament basat estrictament en el `design-tokens.json` i `index.css` (potencialment ignorant el CSS del layout com a via principal).
- **Abstracció Layout:** Al·lucina/proposa crear una estructura nova (`SplitViewLayout.jsx`) en lloc de donar-se compte que `AppGridShell` ja fa exactament aquesta funció. (Nota de la IAIA: *Mistral Vibe s'ha despistat en aquest punt per manca de context profund en l'estat actual d'AppGridShell*).
- **Poda CSS:** Assenyala la necessitat de reduir l'`index.css` (133KB).
- **Auditoria Destructiva (Falsos Positius i Alerta SDP-LOCK):** Suggereix eliminar `backendPort.js` creient que és un duplicat de `supabaseBackend.js`, quan en realitat és un Facade/Adapter. Apunta risc de Open Redirect a `oauthRelay.js` si no es valida la URL de retorn.
- S'ha auto-imposat un bloqueig (SDP-LOCK) correctament per prudència abans d'esborrar el backendPort.

---

## 5. DICTAMEN DE PERPLEXITY

**Punts Clau:**
- **Capçaleres 58px:** Coincideix de nou. Identifica la necessitat d'una font única per a l'altura de les barres (`--sdp-alt-barra`).
- **Abstracció Layout:** Igual que Vibe, no s'ha adonat que `AppGridShell` ja és el nostre *SplitLayout*. Proposa crear un `WorkspaceSplitLayout` des de zero (una altra al·lucinació per falta de context espacial, tot i que la intenció d'abstracció és correcta).
- **Deute Tècnic:** Assenyala un alt nombre d'estils inline a Notes (125) i 12 controls tàctils menors de 44px (problema d'accessibilitat). També detecta 116 classes orfes al bundle.
- **Testing:** Aporta una bona idea per evitar regressions: crear un test de contracte per al layout visual (`notes-layout.test.jsx`) i una comprovació a les "portes" de Pedra Seca per validar estrictament l'alçada del CSS.

---

## 6. DICTAMEN DE DOLA

**Punts Clau:**
- **Capçaleres 58px:** Coincidència total. Assenyala clarament el `min-height: 56px` i el `calc(... + 1px)`.
- **Abstracció Layout:** Dola **SÍ** que ha entès l'arquitectura! Ha vist que `AppGridShell` és correcte i que el problema és només l'acoblament de noms (ex: `.notes-column--editor` dins d'un component suposadament universal).
- **Duplicació Greu (Nou descobriment):** Ha detectat que `NotesEditor` i `UniversalEditorShell` tenen copiades i apegades literalment les mateixes funcions de gestió d'imatges (`triaImatge`, `triaLogo`, `handleDeleteHero`, etc.). Proposa crear un hook compartit `useHeroImageHandler.js`.
- **Bugs Funcionals P0:** Assenyala (com Claude) que els botons de crear nota, cercar i les etiquetes no tenen la funcionalitat lligada a l'UI (`onClick` inexistent).
- **Concurrència (409) i Seguretat:** Coincideix amb l'error del 409 i la necessitat d'arreglar-ho. Aporta una millora de seguretat creativa per a `backendPort.js`: un `setTimeout` de 5 segons que congele l'adaptador automàticament si algú s'oblida de tancar-lo, per evitar injeccions.
- **Accessibilitat antiga:** Coincideix de ple amb Claude en què el `:has()` trenca la interfície per a l'iPad vell.

---

## 7. DICTAMEN DE DEEPSEEK

**Punts Clau:**
- **Visió Arquitectònica de CTO:** A diferència dels altres, Deepseek no ha baixat al fang del CSS ni dels 58px. S'ha comportat com un arquitecte cap, analitzant l'estat global del sistema.
- **Auditoria Destructiva (Privacitat):** Ha detectat un punt molt interessant de governança i RGPD: la funció `membres_del_poble()` exposa dades que podrien vulnerar la privacitat segons com estiga configurada.
- **Deute Tècnic Global:** Recorda els deutes històrics congelats (116 classes òrfenes, 121 estils inline, 33 colors crus) i adverteix sobre el pes del bundle i la complexitat del tooling (més de 50 scripts).
- **Veredicte General:** Considera que el projecte és extremadament resilient gràcies als "tractors" (portes mecàniques) i aprova l'arquitectura, alertant només de la complexitat d'entrada per a nous desenvolupadors.

---

## 8. DICTAMEN DE Z

**Punts Clau:**
- **Troballa Meta-Arquitectònica CRÍTICA:** Z ha descobert per què algunes IAs al·lucinaven l'arquitectura: **el bundle que han rebut estava truncat!** Només contenia el manifest (json capçalera) però no el codi font real dels fitxers. (Això explica perfectament l'al·lucinació col·lectiva de Vibe, Perplexity i el mateix Z sobre inventar-se un `LayoutDocuments` o `SplitViewLayout`).
- **Deriva per Duplicació (Vulnerabilitat de Manteniment Severa):** Com que ha analitzat el manifest a fons, ha detectat que tenim fitxers clau duplicats per l'escriptori que estan divergent. Per exemple, `identitat.js` a `src/` no és igual al de la carpeta `1809` (hi ha 64B de diferència). Si toquem el roí, es liarà.
- **Càncer de Shells per Secció:** Ha vist que `detailSectionMeta.jsx` està copiat idèntic 4 vegades (un per cada secció: detail, mercat, multimedia, mur). Una malaltia de duplicació de codi idèntica a la que volem curar a Notes/Perfil.
- **Portes Mecàniques:** Proposa afegir una "sonda" (script) a les portes per caçar automàticament "números màgics" com `56px` o `+1px` al CSS i fer explotar el commit si no s'usa la variable correcta.

---

## 9. DICTAMEN DE QWEN

**Punts Clau:**
- **Lliçó Teòrica de CSS:** Com a bon docent, ens fa una lliçó magistral sobre el `box-sizing: border-box` i el model de caixa per a justificar per què els 58px fallen quan s'aplica el `padding` o el `border`.
- **Capçaleres 58px:** Reitera la necessitat d'usar la variable `--sdp-alt-accio` en lloc de valors en brut per tota la interfície.
- **Abstracció Layout:** Comprèn l'existència d'un layout base (`AppGridShell`), tot i que ofereix el patró clàssic de *Compound Components* (React.Children) com a via alternativa. Aconselha fer que les classes CSS siguen semàntiques del contenidor i no del domini ("notes").
- **Auditoria Operativa (P0 Crítics):** Identifica el bloqueig de concurrència (409) proposant un *Optimistic Locking* (recàrrega o versionat); demana vigilar els `useEffect` de components efímers per evitar fuites de memòria, i alerta fortament del risc d'obviar les polítiques RLS (`eq('user_id', ...)`).

---

## 🎯 MATRIU DE DECISIONS I CONSENS FINAL (DAFO ACCIONABLE)

Després d'analitzar les 8 IAs del Consell, el consens és clar. Ací tenim la llista d'accions prioritzada i destil·lada de brossa o al·lucinacions:

### 🔴 P0 - VULNERABILITATS CRÍTIQUES (A fer primer)
1. **Pèrdua de Dades al Guardar (Error 409 fals):** (Claude, Dola, Qwen). Cal corregir la gestió de `rawNotes` i l'estat local de `updateNote` (implementar `useRef` o *optimistic locking*) perquè no rebutge les edicions posteriors a la primera.
2. **Deriva per Duplicació:** (Z). Revisar els fitxers duplicats com `identitat.js` que pul·lulen en carpetes de l'Escriptori (`1809`, `1824`) i estan divergent del codi font oficial a `src/`. Cal eliminar o enviar a la paperera els vells.
3. **Bugs d'Accessibilitat i Botons Morts:** (Dola, Claude, Perplexity). Arreglar els botons de NotesList i NotesSidebar que no tenen l'esdeveniment `onClick` connectat; i solucionar el selector CSS `:has()` trencat a iPad vell.

### 🟡 P1 - ARQUITECTURA I LLEI DE MIDA (El nucli de la tasca)
1. **Unificació de les Capçaleres (58px):** Totes les IAs coincideixen unànimement. Cal netejar `AppGridShell.css` i `NotesSection.css`, llevant els `56px` i el `calc(+1px)`, i aplicar exclusivament el token `--sdp-alt-accio` (o `--sdp-alt-barra`).
2. **Universalització del Layout (Desacoblament):** El contenidor de Perfil/Notes ja existeix (`AppGridShell`), però els noms estan acoblats. Cal llevar les classes com `.notes-column--editor` i fer classes CSS neutres (ex: `.editor-shell--main`).
3. **Duplicació de Funcions d'Imatge:** (Dola). Extreure la lògica de `triaImatge` i `triaLogo` (que estan exactament igual a `NotesEditor` i `UniversalEditorShell`) a un hook comú.

### 🟢 P2 - PODA I PORTES (Deute Tècnic a mig termini)
1. **Poda CSS i JS Mort:** Netejar tot el CSS mort relacionat amb capçaleres de `NotesSection.css` i els botons `creaNota` perduts.
2. **Millora de Portes Mecàniques:** (Z, Perplexity). Afegir sondes a la carpeta `.agents/hooks/verify.mjs` (o similar) perquè l'ús de `height: 56px` en una capçalera bloquege el repositori directament.
3. **Seguretat timeout:** (Dola). Afegir un *freeze* automàtic de 5s a `backendPort.js`.

***Fi de l'Estudi d'Auditoria***
