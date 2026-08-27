# Auditoria Qwen - 27 Agost 2026 (Sóc de Poble)

### Investigant condicions de bloqueig d'IndexedDB a Safari iOS 13.7–14.4
S'ha iniciat la recerca empírica sobre comportaments crítics d’IndexedDB en entorns restringits (A10, WebKit antic).
- `indexedDB.open()` es queda penjat indefinidament sense disparar esdeveniments `blocked`, `upgradeneeded` ni `error` a iOS 14.6.
- Es desencadena quan es tanca una connexió existent amb `close()` i es reobre immediatament sense esperar que totes les transaccions pendents finalitzin.
- **Crash per exhauriment de memòria:** En condicions de baixa RAM (≤1 GB), l’emmagatzematge de blobs base64 o ArrayBuffers en IndexedDB provoca errors d’out of memory a WebKit.
- Les fallades no són teòriques ni genèriques — són reproductibles, condicionades per hardware concret (A10).

### Fuga de memòria confirmada a WebKit amb Blobs
- Safari iOS 13 i anteriors presenten fugues de memòria quan es guarden Blobs grans (≥3 MB) a IndexedDB.
- Safari 10.1.2 (iOS 10–11) falla en silenci en emmagatzemar Blobs a IndexedDB, retornant `null` sense error. Força un retrocés a `ArrayBuffer` que provoca inflació.
- **Inflació catastròfica:** en iOS 10/11, 3,5 MB de dades reals ocupen fins a 2,9 GB en la base de dades local després d’escriptures freqüents.

### Patrons de mitigació clau
- Es requereixen patrons Vanilla JS **estrictament lliures de promeses i async/await** per fer `put()` fragmentat amb control manual de transaccions (`onupgradeneeded`, `oncomplete`, `onerror`), ja que **les promeses interrompen prematurament les transaccions a WebKit antic**.
