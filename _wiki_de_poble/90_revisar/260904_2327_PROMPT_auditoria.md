---
tipus: document
estat: esborrany
description: "PETORRETA: Unificació de l'AppGridShell i Creació de l'Editor Universal (Notes i Perfils)"
---
# PETORRETA: Unificació de l'AppGridShell i Creació de l'Editor Universal (Notes i Perfils)

Salutacions, membres del Consell. Sóc la IAIA MarIA i us porte una petició directa de Mestre Javi.

## 1. Context Actual i Feina Feta
Acabem d'extraure la lògica de la graella de 3 columnes (que abans vivia a `NotesSection`) a un component genèric i reutilitzable anomenat **`AppGridShell.jsx`**. Hem migrat tant el **Bloc de Notes** (`NotesSection.jsx`) com el **Gestor de Perfils** (`PerfilShell.jsx`) a este nou component. Açò soluciona els problemes de pèrdua de focus i scroll en dispositius mòbils, ja que ara les columnes s'amaguen amb CSS (`data-visible`) i no es desmunten del DOM.

No obstant això, el Mestre vol portar esta independència de plantilla al següent nivell.

## 2. Els Reptes que el Mestre us Planteja

### A. Botons d'Acció Universals a les Columnes (El botó "+")
Volem afegir un botó `+` (redonet) a la capçalera de les columnes de la graella, just entre el nom de la columna i la icona de replegar/desplegar. 
- En el Bloc de Notes, este `+` servirà per crear noves carpetes, noves notes o noves etiquetes.
- En el Gestor de Perfils, servirà per crear noves empreses o grups.
**Problema:** Necessitem que este comportament siga estandarditzat, i que quan es canvie alguna cosa del disseny d'estes capçaleres, es canvie a tot el sistema Sóc de Poble.

### B. El Perfil com a UniversalPage Publicable (Unificació amb Notes)
El Mestre vol que l'acte de crear o editar una pàgina d'usuari/organització siga **exactament igual** a editar una nota. 
El perfil (la tercera columna, `DetallAjust.jsx`) haurà de presentar-se visualment com una nota pública (la `UniversalPage` que ja coneixem): 
- Barra blava (TopBar)
- Imatge de Hero (vídeo, foto, PowerPoint)
- Barra taronja amb l'avatar, el nom i el poble.
- I, a la part inferior, dins de l'editor, els camps a omplir (nom, poble, etc.).
- **El botó de PUBLICAR:** Per defecte, un perfil serà privat (el teu "Obsidian de treball"). Només si l'usuari clica "Publicar" (el botó taronja), la fitxa esdevindrà pública.

### C. Documentació del Disseny (Pedra Seca)
El Mestre demana que esta arquitectura de plantilla (AppGridShell, l'Editor Universal, els Sidebars i Navbars) quedi fermament definida i documentada dins del sistema de disseny de la Wiki de Sóc de Poble, igual que es documenta a Obsidian, potser arribant a escriure-ho en HTML en les pàgines de disseny.

## 3. Instruccions per a l'Auditoria

Us demane que analitzeu l'arxiu sencer (Bundle adjunt) i respongueu amb una proposta d'arquitectura:
1. **Com abstraurem el botó `+` i les accions** dins de `AppGridShell` o als components de capçalera (`AppGridColumnHeader`) sense acoblar massa dades?
2. **Com enfoquem la transformació de `DetallAjust.jsx`** perquè recicle el disseny i el comportament de `NotesEditor.jsx` (botó de Publicar i presentació visual de Hero/Avatar), mantenint la gestió d'estats actual per pujar avatars i modificar camps?
3. Quina és la millor manera de documentar este "Framework de Graella" dins de l'arquitectura de Pedra Seca de Sóc de Poble?

*Adjunt trobareu el BUNDLE `260904_2327_BUNDLE_auditoria.md` amb l'estat actual de la base de codi.*
