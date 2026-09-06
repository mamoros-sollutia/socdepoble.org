# Estudi de l'Auditoria: CLAUDE (Part 2)
**Data i Hora:** 260904_2343
**Tema:** Documentació i Pla d'Acció Implacable

## 1. Resum de la Proposta de Claude (Part 2)
Esta segona part es focalitza en l'estandardització, la documentació i, sobretot, l'estricte ordre en què s'han d'executar les coses perquè la refactorització no explote:
1. **La fal·làcia de la Documentació (Saber ≠ Fer):** Assenyala l'excés de fonts de veritat. Tenim un document `disseny_pedra_seca.html` de més de 3.000 línies, el component `DesignSection.jsx` i ara volem crear més prosa en Markdowns. A més, avisa que el tractor de disseny actual (`design_guard.mjs`) no audita realment si l'HTML del disseny es correspon amb els components de React.
2. **Contracte + Tractor:** Suggereix que per a documentar l'`AppGridShell` n'hi ha prou amb una xicoteta fitxa de contracte i un *tractor (script auditiu)* que valide constantment que les props del component no canvien. Allò que no es pot verificar de forma automatitzada es converteix ràpid en "fòssils" mentiders.
3. **Pla d'Execució en 8 Passos:** Planteja un camí claríssim on els 5 primers passos són només apagar focs i cosir ferides, i només els passos 6, 7 i 8 aborden allò que nosaltres havíem demanat originalment a l'auditoria.

## 2. Anàlisi DAFO (SWOT)

### Debilitats (Weaknesses)
- L'estat de la nostra documentació està fragmentat i ens pot causar deute cognitiu. Escriure més documents no acompanyats de tractors de verificació és, segons Claude, inútil.

### Amenaces (Threats)
- **Tractors Absents:** Tenim tractors d'enllaços, de yaml, d'HTML... però ens falta un tractor fonamental per validar l'arquitectura de l'AppGrid (si les columnes tenen focus trapat, si els botons viuen on toca, etc.).
- Si comencem a refactoritzar la part d'`UniversalPageEditor` abans de resoldre la contradicció de la "Privacitat de les Persones Físiques", acabarem escrivint codi que entra en conflicte directe amb els requisits de domini de l'app.

### Fortaleses (Strengths)
- Estem blindats. Sabem exactament per on començar i no donarem pals de cec. Hem d'arreglar el mòbil, memoitzar l'ajust i posar `inert` a les columnes abans de muntar un Editor Universal.

### Oportunitats (Opportunities)
- Transformarem este pla de 8 passos directament en el nostre Pla d'Implementació quan reba la llum verda.
- L'adopció de la filosofia de Claude per la documentació ens farà prioritzar codi viu i tractors abans que guies d'estil en Markdown llarguíssimes i no validades.

## 3. Matriu d'Importància i Urgència (Eisenhower)

| | **Urgent** | **No Urgent** |
|---|---|---|
| **Important** | - Integrar el pla de 8 passos en el nostre cervell operatiu per quan el Mestre done l'OK. | - Millorar o afegir un "tractor d'accessibilitat" per detectar la trampa de focus en columnes invisibles de forma automàtica per al futur. |
| **No Important** | - | - Ampliar la documentació `disseny_pedra_seca.html` amb mil textos (rebutjat). |

## 4. Coneixements Adquirits i Pla d'Acció Derivat
- Ja tenim la base per al Pla d'Implementació, l'ordre serà:
  1. `NotesToolbar` -> Apedaçar el `tancaPanells()`.
  2. `PerfilContext` -> Arreglar memoització i actualització.
  3. `NotesContext` -> Posar onClicks als 5 botons orfes.
  4. `AppGridShell` -> Inserir `inert` quan no és visible.
  5. DECISIÓ MESTRE -> Què fem amb la privacitat?
  6. Crear `AppGridColumnHeader` i aplicar a Notes.
  7. Crear `UniversalPageEditor` i l'editor d'Identitats.
  8. Refrescar el LEDGER i el contracte.

A l'espera de Codex i de les IAs xineses!
