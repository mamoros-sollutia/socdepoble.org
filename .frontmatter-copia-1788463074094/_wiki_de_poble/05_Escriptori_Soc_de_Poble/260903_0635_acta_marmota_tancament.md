# Acta Marmota - Tancament Sessio (Matí 3 de Setembre)

**Data i hora:** 260903_0635
**Autor:** IAIA MarIA (redactat segons instruccions del Mestre)

## 1. Estat de la Intervenció
S'ha revertit completament la iniciativa funcional ("Acordió Inline") en el `NotesEditor.jsx` deixant-ho exactament com estava amb el `Dropdown` natiu, per tal de no destrossar la feina estructurada ni molestar en la pròxima sessió. El "fix" per protegir Tiptap durant els Fast Refresh de Vite s'ha mantingut per evitar que la pantalla rebente i provoque l'Error Boundary roig.

## 2. Instruccions de Disseny i UI (Pendent per a la pròxima sessió)
1. **Unificació dels botons (Forma de píndola):** S'ha d'unificar tot el sistema cap a botons amb vores completament redones (pill shape). Actualment la *sidebar* utilitza botons quadrats i pareix que conviuen dos sistemes de disseny diferents. Tota l'App haurà de convergir.
2. **Respiració dels botons (Padding horitzontal):** Els botons han de respirar molt més. Cal afegir almenys 20-22 píxels de marge (padding) entre el text/icona i la vora exterior del botó perquè s'adapte elàsticament al seu contingut però sense ofegar-se. 
   - *Malament:* El botó "Publicar" (pareix que li falte aire als extrems) i "Crear nota".
   - *Bé:* El botó "Connectar".
3. **Estat del botó Publicar:** A la barra d'eines (`NotesToolbar`), si la nota ja està publicada (com l'exemple que tenim), el botó de "Publicar" (actualment blau) canviarà el seu text a "Publicat" i el color haurà de ser taronja. I al fer-li clic desplegarà el *Dropdown* (mai un acordió) superposant-se a l'editor.
4. **Targetes del Bloc de Notes (Miniatures):** El llistat de notes patirà una reformulació estructural severa. La columna serà previsiblement més ampla i les *cards* seran completament rectangulars per aprofitar al màxim l'espai. Incorporaran una miniatura del post, el títol (H1) i el subtítol (H2). 

## 3. Directiva Operativa de Convivència
El Mestre ha sigut molt clar: **Prou d'iniciatives funcionals ofuscades**. La meua tasca és escoltar i ser quirúrgica. Cal afiançar l'estructura i consolidar la presentació visual abans d'implementar cap funcionalitat. "No fa falta que penses per mi". 

Deixem la base sòlida per treballar demà. L'arquitectura aguanta i el disseny espera el seu refinament. Bona nit (o bon dia) Mestre!
