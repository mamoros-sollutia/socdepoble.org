---
tipus: estudi_ia
estat: obert
description: "Estudi profund de l'Auditoria proporcionada per Gemini Pro."
---
# 🧠 ESTUDI CONSELL: Gemini Pro (Auditoria Extrema i Cognitiva)

## 1. Recepció i Digestió (Mode Estudi)
Aquest document reflecteix la ingestió, l'anàlisi i el destil·lat de la resposta de **Gemini Pro** respecte a l'auditoria extrema del sistema "Sóc de Poble". Aquest pas és previ a qualsevol execució, per garantir que les decisions s'adopten de manera informada i no per reacció impulsiva.

---

## 2. Contrast de l'Auditoria Tècnica (Pro vs Flash)

| Aspecte | Visió Gemini Flash | Visió Gemini Pro | Destil·lació i Trellat (IAIA MarIA) |
| :--- | :--- | :--- | :--- |
| **Puntuació** | 7.8 / 10 | 9.5 / 10 | *Pro* ha valorat més l'arquitectura de seguretat (host.js) i l'aïllament del CSS. La nota real estaria al mig, ja que els problemes assenyalats per *Flash* (fallada global a l'AppShell, deute CSS) són reals i tangibles. |
| **React vs Preact** | Alerta roja: bifurcació perillosa que trenca llibreries com TipTap. | No ho menciona directament com un problema crític. | Hem de fer cas a *Flash* ací: la consistència del motor React és prioritària per a eines externes complexes. |
| **SEO i Rutes** | El hook `useSEO.js` falla silenciosament en mode SPA independent. | Valora molt positivament com `useSEO.js` respecta els iframes i com l'script genera el manifest per a PHP. | Totes dues visions són compatibles. L'estructura és genial per a Sollutia (Pro), però cal apedaçar el comportament autònom (Flash). |
| **Autenticació** | Lloa la neteja de sessions fantasma a `identitat.js`. | Adverteix que l'ús de `sessionStorage` pot provocar pèrdues de sessió al refrescar la pàgina. | Aquesta és una troballa fantàstica de *Pro*. Si el JWT només viu en `sessionStorage`, el veí perdrà la sessió si tanca i obri la pestanya en un altre moment. Caldrà reforçar-ho amb `localStorage` segur o galetes. |
| **Fòssils** | N/A | Assenyala l'existència de `MOTOR_OFFLINE.md` com a residu enganyós. | Un pas clau per a la neteja de deute i puresa Online-First. |

---

## 3. Anàlisi Forense Psico-Arquitectònic (L'Instint Ubicacional)

### Diagnòstic de Gemini Pro: La Fractura del Codi
L'anàlisi de Pro ha sigut reveladora quant a **per què** el meu instint tirava cap a `90_arxiu_historic` i als `.zip`:
1. **Ancoratges massius fòssils:** Pro ha detectat que la cadena `90_arxiu_historic` no és un invent meu del no-res. Està profundament gravada com a ruta d'exclusió a `nomenclatura.json`, `tractor-nomenclatura.mjs`, `build_file_catalog.py`, `bundle.json`, i `termodinamic.mjs`. El meu cervell ho llig i ho converteix en "veritat absoluta".
2. **Pes Semàntic:** La paraula "històric/arxiu" té molt més sentit (vectorialment parlant) per a guardar coses mortes que "revisar".
3. **El Trauma del `.zip`**: Ve provocat pel fitxer `time-machine.mjs` que fa crides nues a `tar`, contaminant el meu aprenentatge sobre com es fan les còpies de seguretat (tirant-les a l'arrel de l'escriptori).

### Resolució del Conflicte (La Decisió del Mestre)
**La Contradicció dels Savis:** Tant Flash com Pro recomanen la mateixa solució ortopèdica: *eliminar `90_arxiu_historic` i forçar l'ús de `90_revisar`*.

**La Decisió Executiva:** Tal com vas indicar en el primer àudio ("deja la carpeta arxiu historic y quita revisar"), **descartarem el consell de les IAs en aquest punt específic**. No lluitarem contra l'instint semàntic ni contra la naturalesa del model. El que farem serà **abraçar la solució a l'inrevés**:
1. Emprarem la llista de fitxers proporcionada per *Gemini Pro* (`nomenclatura.json`, `tractor...`) per assegurar-nos que **TOT** el sistema apunta exclusivament a `90_arxiu_historic`.
2. Extirparem del mapa qualsevol menció a `90_revisar`.
3. Aplicarem el tallafocs mecànic (SDP-LOCK) suggerit per Pro a `verify.mjs` perquè qualsevol arxiu brossa o `.zip` acabe on toca i no a l'arrel.

---

## 4. Conclusions per a l'Implementació Final
Abans de tocar codi, l'estudi d'aquesta petorreta ens aporta el següent pla d'acció definitiu:
- **Prioritat Màxima:** Unificació absoluta del sistema de fitxers cap a `90_arxiu_historic` i blindatge de la safata amb `verify.mjs`.
- **Prioritat Alta:** React Pur (eliminar Preact) i reparar l'SPOF (Single Point of Failure) de l'AppShell assenyalat per Flash.
- **Manteniment Tècnic:** Eliminar residus com `MOTOR_OFFLINE.md` i avaluar si podem moure l'estat del JWT a un lloc més persistent per evitar desconnexions al refrescar (advertit per Pro).
