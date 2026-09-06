---
titol: "ACTA MARMOTA: Altura de les Barres i Estructura Universal"
data: "2026-09-05T00:55:00+02:00"
estat: "pendent_revisio"
---

# Objectiu de la Pròxima Sessió

El Mestre ha detectat un desfasament de 1 o 2 píxels en l'altura de la capçalera de la columna de carpetes respecte al panell central (ex: entre el botó de plegar carpetes i la barra del centre de control). A més, es vol garantir que l'estructura `AppGridShell` i `AppGridColumn` siga **realment universal**, per poder aplicar-la idènticament al Bloc de Notes, als Perfils Personals, als Perfils d'Empresa, etc.

## 1. Problema Actual
Tant la barra blava superior com la del panell de control mesuren exactament **58px** (segons captura).
Per tant, totes les capçaleres de les columnes (`AppGridColumn`) han de fer obligatòriament **58px** per encaixar a la perfecció.
- El Mestre indica que hi havia un 'apaño' (un píxel desplaçat cap amunt) per tapar una línia blanca entre els divs. Açò s'ha de resoldre estructuralment (margin/padding/border) sense desplaçaments, ja que si el div està ben pintat, s'apega a l'altre sense deixar blancs.

## 2. Tasques a Realitzar
1. **Auditoria del Box Model**: Fer una anàlisi amb l'eina de Chrome DevTools (o similar) per comprovar les mides exactes (height, padding, border, margin) de `.app-grid-col-header` i forçar que el contenidor siga de 58px d'alçada.
2. **Fixació Tècnica (Sense Apaños)**: Aplicar `height: 58px` o la variable corresponent, forçant `box-sizing: border-box`. Llevar qualsevol hack de `margin-top: -1px` o desplaçaments relatius que intenten tapar línies blanques.
3. **Consolidació d'AppGridColumn**: Revisar que tots els usos de l'esquema d'estructura utilitzen els mateixos tokens de disseny per evitar regressions en el futur, tant al Bloc de Notes com als Perfils Personals/d'Empresa.

## 3. Neteja de l'Arxiu Històric (Fet)
Com a part de la rutina de tancament, s'han eliminat les carpetes conflictives `90_arxiu_historic` i `90_historic` de dins del repositori (`_wiki_de_poble`). A partir d'ara:
- Tot el que necessite revisió s'envia a **`90_revisar`**.
- Un cop revisat, s'elimina o s'envia FORA del repositori, a **`../_arxiu_wiki_de_poble`**.
