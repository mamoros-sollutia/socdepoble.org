# SELF-DESCRIBE: La Capa de Persistència de Sóc de Poble

Aquest document és una metadada auto-descriptiva de la capa de persistència. 

## 1. El Principi Fonamental (Online-First Estricte)
- Sóc de Poble és una arquitectura **Online-First** pura des de l'auditoria de l'Agost de 2026.
- El Frontend és un "Terminal Estúpid" (Dumb Terminal). Si no hi ha xarxa o el backend rebutja l'escriptura, la UI reverteix l'estat i avisa l'usuari. NO hi ha cues asíncrones (Outbox) ni emmagatzematge local de dades de negoci.

## 2. Injecció Agnòstica (Llei de l'Enxufabilitat)
- Tot l'accés a dades es fa a través de `backendPort.js`. Cap component de React pot importar l'adaptador específic (ex: `supabaseBackend.js`).
- El `host.js` actua de pany. Abans de ser cridada la funció `arrenca()`, l'entorn (Sollutia, etc) injecta la seua implementació. Una vegada segellat, és immutable.

## 3. Barreres Mecàniques (Gates)
- `src/config/storage.js` només pot emmagatzemar tokens d'autenticació (`socdepoble-jwt`), no estats de negoci. 

## 4. El Pany Global i La Guerra de Gutenberg
- A `PedraSecaEmbed.jsx`, s'utilitza `window.__SDP_REACT_MOUNTED__` com a pany (lock) global per evitar la corrupció i els zombis de React per culpa del moviment de nodes per part d'alguns editors web o entorns amfitrions hostils.

*Eternitat a les dades. Tornem el poble a la gent, però amb la veritat per davant.*
