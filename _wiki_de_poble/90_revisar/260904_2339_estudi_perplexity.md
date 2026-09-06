---
tipus: document
estat: esborrany
description: "Estudi de l'Auditoria: PERPLEXITY"
---
# Estudi de l'Auditoria: PERPLEXITY
**Data i Hora:** 260904_2339
**Tema:** Unificació de l'AppGridShell i Editor Universal (Notes i Perfils)

## 1. Resum de la Proposta de Perplexity
Perplexity ofereix l'auditoria més sòlida a nivell arquitectònic, aprofundint en els problemes de domini i com separar la lògica visual de la lògica de dades:
1. **`AppGridColumnHeader` amb Composició:** Confirma que la millor opció és la composició pura (`<NotesSidebar header={<AppGridColumnHeader />} />`). Resol el problema de múltiples accions amb una propietat `createMenu` (semblant al `ActionMenu` de Vibe però més integrat). Proporciona el CSS exacte usant els tokens de Pedra Seca.
2. **`UniversalDocumentEditor` via Render Props:** En lloc de fer que `DetallAjust` es convertisca en un clon de `NotesEditor` (el qual acabaria divergint), proposa extraure un `UniversalDocumentEditor.jsx` (amb el Hero, Avatar, TopBar) i usar *render props* (`renderFields`, `renderHeroActions`) perquè cadascú hi injecte els seus formularis.
3. **Mappers d'Estat (`profileToUniversalDraft`):** Suggereix no embrutar l'Editor Universal amb estats específics de perfil. Passa per crear un adaptador que convertix el `formData` en un `Draft` universal.
4. **Política de Privacitat Estricta:** Subratlla que publicar i guardar són dos fets diferents (`draft/private` vs `published/public`) i requereixen dues trucades diferents al backend remot.
5. **Ledger i READMEs:** Suggereix registrar decisions al `LEDGER.md`, crear `README.md` a les carpetes de components, i afegir l'HTML a la Wiki de components.

## 2. Anàlisi DAFO (SWOT)

### Debilitats (Weaknesses)
- **Sobrecàrrega d'Abstracció (Render Props):** Usar *Render Props* (`renderFields={props => <ProfileFields />}`) pot fer el codi una mica més complex d'entendre al principi si no estem acostumats, tot i que React ho suporta perfectament.
- **Massa fitxers Markdown:** Crear un `README.md` per cada carpeta potser és massa granul·lat. És millor concentrar el coneixement a la Wiki i al LEDGER.

### Amenaces (Threats)
- Refactoritzar `NotesEditor.jsx` sencer per extraure'n el `UniversalDocumentEditor` és una feina delicada, ja que `NotesEditor` té actualment tota la integració amb TipTap. Hem de separar amb molta cura la part de "Rich Text" de la part de "Document Universal".

### Fortaleses (Strengths)
- **El disseny de l'API de `AppGridColumnHeader`:** Proposa l'ús de `{children}` i de botons condicionals, unificant l'enfocament de Vibe i Gemini en un sol codi ultra-net.
- **Visió de Domini:** Evita el risc que `DetallAjust` i `NotesEditor` divergixquen visualment amb el temps, forçant un component contenidor estricte on només canvien els *camps interns*.

### Oportunitats (Opportunities)
- La proposta de mapejar l'estat del perfil a un "Draft" universal i mapejar-lo de tornada fa que la implementació siga molt escalable cap a futurs tipus de documents (com Grups o Empreses).
- Usarem la recomanació d'actualitzar el `.agents/LEDGER.md` amb estes decisions, tal com mana la doctrina de Pedra Seca.

## 3. Matriu d'Importància i Urgència (Eisenhower)

| | **Urgent** | **No Urgent** |
|---|---|---|
| **Important** | - Definir definitivament `AppGridColumnHeader` usant la sintaxi suggerida. <br> - Projectar el `UniversalDocumentEditor` per embolcallar el Form del perfil. | - Escriure la decisió de disseny a `.agents/LEDGER.md` i la pàgina HTML de disseny. |
| **No Important** | - | - Fer READMEs fragmentats per cada directori. |

## 4. Coneixements Adquirits i Pla d'Acció Derivat
- Hem de seguir 100% la composició declarativa per als headers. AppGridShell NO ha de tindre props extranyes; el header es passa dins de cada columna.
- El botó `+` es dirà `onCreate`, i si hi ha múltiples opcions, hi haurà un `createMenu` o similar.
- Abans de tocar `DetallAjust.jsx`, la jugada mestra és **extraure la carcassa de `NotesEditor.jsx`** en un nou component anomenat `UniversalDocumentEditor.jsx`. Una vegada extret, tant `NotesEditor` com `DetallAjust` heretaran esta carcassa. 
- Quan ens donen llum verda, el **Pla d'Implementació** estarà molt clar i serà robust. Estic a l'espera!
