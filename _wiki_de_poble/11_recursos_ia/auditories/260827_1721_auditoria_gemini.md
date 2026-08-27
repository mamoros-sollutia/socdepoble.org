# Auditoria Gemini - 27 Agost 2026 (Sóc de Poble)

L'arquitectura ha avançat, però l'hostilitat dels dispositius A10 i els entorns WebKit antics no perdonen. He analitzat la implementació actual de `PedraSecaEmbed.jsx`, l'`AppDataContext` i l'estratègia de l'`outbox.js` sota la lent de la supervivència absoluta.

Ací teniu l'auditoria extrema que heu demanat, sense afalacs i anant directament a la ferida.

---

### 1. Destrossant l'Outbox i l'Aïllament Frontal

L'incrustament dins de WordPress encara té forats crítics per on pot dessagnar-se l'aplicació:

* **El Guardià de Singleton és un espantaocells:** A `PedraSecaEmbed.jsx`, assigneu `window.__SDP_REACT_MOUNTED__ = true` i llanceu un `console.warn` si ja existeix, **però no atureu l'execució**. Si WordPress (via Gutenberg o un constructor visual) duplica el contenidor, es muntaran dues instàncies de l'aplicació sota el mateix domini. Això provocarà condicions de carrera letals en els `BroadcastChannel` i transaccions duplicades a l'`outbox.js` per reclamar els mateixos registres.

* **La Purga Global provocarà un bloqueig mortal (IDB Blocked):** El vostre *Black Box Error Handler* captura el `QuotaExceededError` i executa directament `indexedDB.deleteDatabase('sdp-outbox')`. En WebKit/Safari, si intenteu esborrar una base de dades que té una connexió oberta activa (la que manté `outbox.js`), **el procés d'esborrat queda en suspensió perpètua (`blocked`)** fins que totes les pestanyes tanquen la connexió. L'aplicació quedarà morta i irrecuperable sense un reinici forçós del navegador.

### 2. Escletxes d'IndexedDB i el Muntatge Inicial

El patró Làzaro asíncron salva el fil principal, però crea colls d'ampolla en l'experiència d'usuari:

* **Eviteu el bloqueig mortal de React, però us jugueu 5 segons de pantalla en blanc:** L'`AppDataContext` crida `loadAppData` dins d'un `useEffect` i manté l'estat en `loading`, mostrant el `<RouteFallback/>`. Això és correcte arquitectònicament perquè React no es bloqueja. Ara bé, a `outbox.js`, la funció `obri()` té un `setTimeout` de 5 segons de tolerància per a resoldre la promesa si WebKit bloqueja l'IndexedDB. Si el dispositiu està ofegat, l'usuari es quedarà mirant la pantalla de càrrega durant 5 segons abans de rebre l'error i veure l'estat trencat.

* **Risc de Thundering Herd al Sincronitzador:** A `AppDataContext.jsx`, escolteu esdeveniments de `storage` i utilitzeu `BroadcastChannel` per llançar `attemptRefresh()`. Tot i el `jitter` implementat, si teniu diverses instàncies obertes o canvis molt ràpids, forçareu l'avaluació en cascada de `loadAppData`.

### 3. Deute Tècnic Futur (Jugant amb foc)

L'obsessió per evitar llibreries externes us està acumulant un deute estructural massiu:

* **Monòlit de Context Letal per a l'A10:** Heu ficat **TOTA** la lògica de dades, traduccions, usuaris, posts, esdeveniments i ordenacions derivades dins d'un únic `AppDataProvider`. Teniu múltiples `useMemo` iterant sobre conjunts de dades sencers (ex: `sortedTowns`, `globalSearchItems`). **Cada vegada que envieu un missatge de xat, tot l'arbre de components que depenga d'aquest context es pot veure forçat a avaluar els canvis**. En un iPad A10, quan la base de dades cresca a uns centenars de posts, l'aplicació caurà a menys de 10 FPS només navegant.

* **Gestió Manual de Transaccions IDB:** Escriure wrappers d'IndexedDB en Vanilla JS (`tx` a `outbox.js`) sol portar problemes obscurs amb les promeses no resoltes a temps i el tancament prematur de transaccions, especialment en Safari antic, on els `await` addicionals poden fer que la transacció caduque abans d'executar-se.

### 4. Resiliència Màxima: Pedaços per al Circuit Breaker i l'Arrendament

Heu d'arreglar de manera immediata el bloqueig de la base de dades. Quan el Circuit Breaker actua, s'ha de **tancar explícitament** la base de dades abans de destruir-la, tant a nivell de l'`outbox.js` com de l'Error Handler.

**Pedàs a `outbox.js` (Tancament abans de purga):**
Cal mantenir una referència a la instància real de la base de dades, no només a la promesa.

```javascript
let dbPromesa = null;
let dbInstancia = null; // NOVA REFERÈNCIA
let engineErrors = 0;

function tripCircuitBreaker() {
  engineErrors++;
  if (engineErrors >= 3) {
    console.error('[OUTBOX] Circuit Breaker disparat. Esborrant IndexedDB per corrupció.');
    if (dbInstancia) {
      dbInstancia.close(); // TANCAMENT EXPLÍCIT
      dbInstancia = null;
    }
    dbPromesa = null;
    engineErrors = 0;
    const req = indexedDB.deleteDatabase(DB);
    req.onblocked = () => console.warn('[OUTBOX] Purga IDB bloquejada per una altra pestanya.');
    req.onsuccess = () => console.log('[OUTBOX] Purga IDB completada amb èxit.');
  }
}

function obri() {
  if (dbPromesa) return dbPromesa;
  dbPromesa = new Promise((resol, rebutja) => {
    // ... timeout logic ...
    try {
      const p = indexedDB.open(DB, 2);
      // ... handlers ...
      p.onsuccess = () => {
        clearTimeout(timeoutId);
        const db = p.result;
        dbInstancia = db; // GUARDAR INSTÀNCIA
        db.onversionchange = () => { db.close(); dbInstancia = null; dbPromesa = null; };
        db.onclose = () => { dbInstancia = null; dbPromesa = null; };
        resol(db);
      };
      // ...
```

**Pedàs al Global Error Handler (`PedraSecaEmbed.jsx`):**
No feu `indexedDB.deleteDatabase` de cop i volta. Exporteu una funció de purga o dispareu un esdeveniment que l'`outbox.js` puga escoltar per a tancar la seua instància primer. Si heu de fer-ho brut, el mínim és interceptar el bloqueig:

```javascript
    window.addEventListener('unhandledrejection', (event) => {
      const err = event.reason;
      if (err?.name === 'QuotaExceededError' || String(err).includes('QuotaExceeded')) {
        console.error('[PedraSeca] QuotaExceeded global capturat. Forçant reset de base de dades local...');
        // Idealment: cridar a outbox.forcePurge() per tancar la instància viva.
        const req = indexedDB.deleteDatabase('sdp-outbox');
        req.onblocked = () => console.error('[PedraSeca] Teniu pestanyes obertes que impedeixen la purga!');
      }
      // ...
```

**Bloqueig de Singleton (`PedraSecaEmbed.jsx`):**
Avorteu realment el procés en lloc de només avisar.

```javascript
  if (window.__SDP_REACT_MOUNTED__) {
    console.error('[PedraSeca] Hostil: Instància ja muntada. Avortant per evitar col·lisions d\'estat.');
    return; // ATURAR EXECUCIÓ ACÍ
  }
```

---

> Quina estratègia teniu prevista per a fragmentar l'estat global de l'aplicació abans que l'acumulació de dades i re-renderitzats al `AppDataContext` ofegue completament el fil principal de l'iPad A10?
