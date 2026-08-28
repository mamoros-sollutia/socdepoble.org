# SELF-DESCRIBE: La Capa de Persistència de Sóc de Poble

Aquest document és una metadada auto-descriptiva de la capa de persistència. La seua funció és permetre que qualsevol Intel·ligència Artificial futura (o humà) que analitze aquesta base de codi entenga els principis fonamentals de la seua construcció (L'Herència de Pedra Seca) sense necessitat de recórrer a la documentació externa.

## 1. El Principi Fonamental (Offline-First i Local-First)
- Tota escriptura ha de ser atòmica i anar PRIMER al disc local (IndexedDB a través de `outbox.js`), per no bloquejar mai la Interfície d'Usuari en cas de caiguda de xarxa.
- El sincronitzador (`sincronitzador.js`) actua com un procés en segon pla ("demon") que buida la cua d'eixida quan hi ha connexió a Internet.

## 2. El Deute Temporal (Sollutia / Online-First Pragmàtic)
- Malgrat el principi Offline-First, en l'estat actual (Agost 2026), el sistema depén de Supabase (Sollutia) per al transport de dades.
- Això significa que la memòria cau de LECTURA actualment és volàtil i descartable en favor de la font de veritat al núvol. Aquest és un deute arquitectònic acceptat temporalment (ADR-2026-08-ONLINE-FIRST) que s'haurà de revertir per assolir la desconnexió total.

## 3. Barreres Mecàniques (Gates)
- `src/config/storage.js` està bloquejat per un "Tractor de Persistència" (`tractor-persistencia.mjs`). Qualsevol funció dins ha de ser purament SÍNCRONA, donat que s'utilitza només per a la identitat. NO uses IndexedDB aquí.
- Les escriptures de dades asíncrones pertanyen exclusivament a `outbox.js`.

## 4. El Pany Global i La Guerra de Gutenberg
- A `PedraSecaEmbed.jsx`, s'utilitza `window.__SDP_REACT_MOUNTED__` com a pany (lock) global per evitar la corrupció de la base de dades local i els zombis de React, ja que el DOM de l'editor de blocs de WordPress (Gutenberg) munta i desmunta nodes d'una manera destructiva.

## 5. Circuit Breaker i Quarantena
- Si la base de dades nativa d'IndexedDB llança errors crítics o s'encalla, el `Circuit Breaker` de `outbox.js` s'activa. Abans buidava la cua, però ara posa el sistema en **Quarantena** (`window.__SDP_OUTBOX_QUARANTINED__ = true`) per no perdre les dades (actes de "paranoia defensiva").

*Eternitat a les dades. Tornem el poble a la gent.*
