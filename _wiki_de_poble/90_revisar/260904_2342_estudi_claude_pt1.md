# Estudi de l'Auditoria: CLAUDE (Part 1)
**Data i Hora:** 260904_2342
**Tema:** Verificació de codi i detecció de vulnerabilitats

## 1. Resum de la Proposta de Claude (Part 1)
Claude ha anat un pas més enllà de la teoria arquitectònica i ha **executat el codi real en jsdom**, trobant errors crítics (P0) causats per la nostra migració i deute tècnic anterior:

1. **Trampa de Focus (Accessibilitat):** Ha detectat que les columnes amagades al mòbil no porten l'atribut `inert`. Com que només s'amaguen amb `transform: translateX(-100%)`, si l'usuari tabula, el focus se'n va fora de la pantalla a columnes invisibles.
2. **Crash al botó "Tornar" (P0-1):** En la nostra migració, vam llevar `setMobilePanel` de `NotesContext`, però ens vam oblidar de llevar-lo de `NotesToolbar.jsx`. Si ara mateix s'obri l'app en un mòbil i es prem "Tornar", l'app peta (`TypeError: setMobilePanel is not a function`). S'ha de canviar per `useAppGrid().tancaPanells()`.
3. **Guardar Ajustos està trencat (P0-2):** Ens fa un *trace* complet de per què el perfil es buida en guardar: falta memoització a `ajustos`, no es declara `valor` per a `nom`, i el `guardarAjust` no refresca el context principal. El que semblava un error menor és una cadena de tres errors d'estat a React.
4. **Cinc botons morts (P0-3):** Assenyala que hi ha botons "Crear Nota", "Cercar", i el cadenat de "Privacitat" que no fan absolutament res perquè els mètodes no existeixen a `NotesContext`.
5. **Contradicció de Privacitat:** Alça la mà sobre una contradicció fonamental. Volem un botó "Publicar" al perfil, però el codi jura que "El perfil d'una persona és SEMPRE privat". Ens demana que prenguem una decisió de disseny sobre què fer amb les persones físiques abans de programar el botó.

## 2. Anàlisi DAFO (SWOT)

### Debilitats (Weaknesses)
- El nostre codi actual té regressions de la migració de l'`AppGridShell` (com el `NotesToolbar` trencat). Ho hem d'arreglar de forma urgent abans de posar-nos a crear nous components universals.

### Amenaces (Threats)
- **Trampa de focus:** L'absència de l'atribut `inert` en les columnes no visibles trenca l'experiència d'usuaris amb teclat o lectors de pantalla i incompleix els estàndards d'accessibilitat.
- Fer una capa visual damunt de funcions que no van (com desar un perfil) només empitjoraria el deute tècnic.

### Fortaleses (Strengths)
- Claude s'alinea exactament amb **Grok i Perplexity** sobre com ha de ser l'`AppGridColumn`: reitera que l'`AppGridShell` no ha de saber res de dades, i que els botons `+` s'han de passar per *props* com a accions (`accions={[{ icona: FolderPlus, ... }]}`). Açò solidifica encara més el patró de disseny.

### Oportunitats (Opportunities)
- **Ordre d'Implementació Implacable:** Ens ha donat un full de ruta de 8 passos exactes, on els punts 1 al 5 són reparacions del que sosté el sistema, i els 6 i 7 són la nova arquitectura. Este és l'ordre que seguirem fil per randa quan dissenyem el Pla d'Implementació.

## 3. Matriu d'Importància i Urgència (Eisenhower)

| | **Urgent** | **No Urgent** |
|---|---|---|
| **Important** | - Arreglar el `NotesToolbar` (crash al mòbil). <br>- Arreglar la trampa de focus posant l'atribut `inert` quan `data-visible=false`. <br>- Arreglar el cicle de guardat de `DetallAjust`. | - Fer l'editor d'identitat com a `UniversalPage`. <br>- Abstraure `AppGridColumn`. |
| **No Important** | - | - |

## 4. Coneixements Adquirits i Pla d'Acció Derivat
- La teoria arquitectònica està molt bé, però Claude ens ha baixat a la terra recordant-nos que **si els fonaments trontollen, no podem posar un sostre bonic**.
- Incorporarem a la primera fase del futur Pla d'Implementació (abans de cap component universal) la resolució dels P0 detectats per Claude: el crash del mòbil, l'atribut `inert` a les columnes i la reparació de l'estat de `PerfilContext`.

Quede a l'espera de la Part 2 de Claude i les següents respostes (Codex i les asiàtiques) per tindre l'espectre complet.
