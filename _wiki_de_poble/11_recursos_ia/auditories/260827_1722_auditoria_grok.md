# Auditoria Grok - 27 Agost 2026 (Sóc de Poble)

## 1. Aïllament / WordPress encara pot matar el component

### P0 — Singleton Guard incorrecte i perillós
```js
if (window.__SDP_REACT_MOUNTED__) {
  console.warn(...);
}
window.__SDP_REACT_MOUNTED__ = true;
```
- Només avisa. No impedeix un segon `define` + muntatge.
- Es posa a `true` **sempre**, fins i tot si `customElements.define` ja existia.
- **Mai es posa a `false`** a `disconnectedCallback`. Després d’un hot-reload d’Elementor/Gutenberg o d’un SPA WP que destrueix el node, qualsevol re-execució del bundle creu que ja hi ha instància i només avisa; l’estat global (`__SDP_GLOBAL_ERRORS_BOUND__`, fonts, `fullCompartit`) queda contaminat.
- Si hi ha **dues** `<soc-de-poble>` a la mateixa pàgina (bloc + shortcode, o header + cos), la segona no està protegida: dos `createRoot`, dos providers, un sol IDB, cursa a l’Outbox.

### P0 — `deleteDatabase` global sense tancar connexions
A `defineCustomElement`:
```js
indexedDB.deleteDatabase('sdp-outbox');
```
i al Circuit Breaker d’`outbox.js` el mateix.  
`deleteDatabase` **falla silenciosament** (o queda `blocked`) si qualsevol pestanya/transacció té la DB oberta. A WP amb múltiples editors o previsualitzacions, la “purga” no passa i el breaker es reinicia a 0 amb DB corrupta encara viva.

### P1 — MemoryRouter no aïlla del host
- Correcte per no lluitar amb l’historial de WP.
- Però `document.documentElement.setAttribute('lang', …)` i `document.startViewTransition` toquen el document host. Si WP canvia `lang` o el tema, hi ha feedback.
- El toast (`AvisadorEfimer`) s’enganxa a `#socdepoble-app` o `document.body` — **fora** del shadow. Col·lisions de z-index / CSS de WP garantides.

### P1 — Fonts i CSS compartits
- `adoptedStyleSheets` + fallback `<style data-sdp>`: bé.
- `carregarFonts` / `descarregarFonts` compten `getElementsByTagName('soc-de-poble')`. Si el desmuntatge diferit (rAF + 500 ms) encara té el node al DOM, el comptador no baixa i les fonts no es treuen. Fuita de `<link>` a `document.head` en editors que munten/desmunten constantment.

---

## 2. Escletxes IndexedDB / muntatge inicial (Làzaro)

### P0 — `tx()` no espera requests IDB
```js
r = fn(t.objectStore(MAGATZEM)); // put/get retornen IDBRequest
t.oncomplete = () => resol(r?.result ?? r);
```
`put`/`get` són asíncrons. En WebKit A10, de vegades `oncomplete` pot disparar-se abans que `request.onsuccess` hagi omplert `result`, o `r` és l’`IDBRequest` i es resol amb l’objecte request, no amb el valor.  

### P0 — Circuit Breaker destrucció massiva
3 errors qualsevol (timeout 5 s, blocked, QuotaExceeded, abort) → `deleteDatabase` + reset comptador.  
Problemes:
1. Un timeout de WebKit en background (pestanya oculta) compta com a error.
2. Després de `deleteDatabase`, `dbPromesa = null`, però connexions obertes en altres pestanyes queden zombie → `blocked` etern.
3. **Esborra també els snapshots** (store `snapshots`). Després d’una ràfega de 3 errors transitòris, l’usuari perd tot l’estat local i torna al seed. Pèrdua de dades irreversible.

### P0 — `getSnapshot` / `saveSnapshot` sense circuit ni timeout
`obri()` té timeout 5 s; les transaccions de snapshot **no** passen per `tx()` ni per `tripCircuitBreaker`. Si `open` penja, `loadAppData` queda penjat → React es queda a `status === 'loading'` per sempre.

---

## 4. Pedaços Vanilla JS (resiliència)

### 4.1 `tx` correcte + Quota conscient
```js
const tx = async (mode, fn) => {
  const db = await obri();
  return new Promise((resol, rebutja) => {
    const t = db.transaction(MAGATZEM, mode);
    let settled = false;
    const fail = (err) => {
      if (settled) return;
      settled = true;
      if (err?.name === 'QuotaExceededError') tripCircuitBreaker(true);
      else tripCircuitBreaker(false);
      rebutja(err);
    };
    t.oncomplete = () => { if (!settled) { settled = true; resetCircuitBreaker(); resol(result); } };
    t.onerror = () => fail(t.error);
    t.onabort = () => fail(t.error || new Error('abort'));
    let result;
    try {
      const req = fn(t.objectStore(MAGATZEM));
      if (req && typeof req === 'object' && 'onsuccess' in req) {
        req.onsuccess = () => { result = req.result; };
        req.onerror = () => fail(req.error);
      } else {
        result = req;
      }
    } catch (err) {
      try { t.abort(); } catch (_) {}
      fail(err);
    }
  });
};
```

### 4.2 Circuit breaker amb quarantenes (no nuke immediat)
```js
// (Veure detalls al document per a purgeOldSnapshots)
```

### 4.3 `getSnapshot` / `saveSnapshot` amb timeout i signal
```js
function withTimeout(promise, ms, label) {
  // Timeout wrapper implementation
}
```

### 4.4 Singleton d’instàncies (comptador viu)
```js
// a SocDePobleElement
connectedCallback() {
  window.__SDP_LIVE__ = (window.__SDP_LIVE__ || 0) + 1;
}
disconnectedCallback() {
  window.__SDP_LIVE__ = Math.max(0, (window.__SDP_LIVE__ || 1) - 1);
  if (window.__SDP_LIVE__ === 0) {
    window.__SDP_REACT_MOUNTED__ = false;
  }
}
```

### 4.6 GC de registres `mort`
(Funció `gcMorts` per buidar els tombstone de la base de dades).
