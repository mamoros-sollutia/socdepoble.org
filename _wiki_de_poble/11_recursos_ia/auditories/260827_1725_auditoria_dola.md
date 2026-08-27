# Auditoria Dola - 27 Agost 2026 (Sóc de Poble)

# 🔴 AUDITORIA EXTREMA: Veredicte

## 1. DESTROSSANT L'OUTBOX I L'AÏLLAMENT

### 🔴 FORATS CRÍTICS TROBATS

**A. Fuga de variables globals per múltiples instàncies**
El `fullCompartit` i `__SDP_GLOBAL_ERRORS_BOUND__` pateixen si WordPress carrega dues instàncies.

**B. El Global Error Handler és un martell de cirurgia**
Qualsevol `QuotaExceededError` (fins i tot d'altres plugins de WP) esborra la BD local sense confirmar. A més, no tanca la connexió, causant `onblocked`.

**C. `descarregarFonts` pot matar les fonts d'altres instàncies**
El node encara és al DOM durant `disconnectedCallback`, la lògica actual funciona per casualitat.

**D. El Singleton Guard no protegeix de React duplicat**
Si WordPress carrega React, el bundle també el carrega.

---

## 2. ESCLETXES D'INDEXEDDB I EL PATRÓ LÀZARO

### 🔴 BLOQUEIG MORTAL DURANT EL MUNTATGE

**A. `loadAppData` → `getSnapshot` no té timeout**
El `getSnapshot` no té limit de temps. Si WebKit bloqueja l'IndexedDB, l'usuari veu la pantalla de càrrega per sempre.

**B. Condició de carrera: `loadAppData` s'executa dues vegades**
Si l'`authTick` canvia, es llancen dos intents. Dues operacions `saveSnapshot` poden ocórrer alhora.

**C. `saveSnapshot` no gestiona `QuotaExceededError`**
Si l'escriptura a `SNAPSHOTS` falla per quota, es propaga l'error i no s'esborra de la memòria per recuperar-lo.

**D. El patró Làzaro no té control de versió d'esquema**
Sense migracions estructurals en `onupgradeneeded`.

---

## 3. DEUTE TÈCNIC FUTUR (ON JUGUEU AMB FOC)

### 🔴 A. Reinvenció de la roda amb IndexedDB natiu
La funció `tx()` no suporta transaccions aniuades entre magatzems ni cursors asíncrons.
### 🔴 B. El Circuit Breaker és massa simplista
3 errors = nuke total de dades, sense backoff ni aïllament d'errors.
### 🔴 C. `encua()` fa un read-back desnecessari però incomplet
### 🔴 D. El sincronitzador no té backoff per fallades de xarxa
### 🔴 E. `reclama()` no té límit de temps per lot

---

## 4. RESILIÈNCIA MÀXIMA: PEDAÇOS EN CÓDIGO

### 🔧 A. Circuit Breaker millorat (amb distinció d'errors i backoff)
Afegeix estats `CLOSED`, `OPEN`, `HALF_OPEN` i discrimina per `isRecoverableError` per no purgar per errors de quota temporals.

### 🔧 B. Timeout per operacions IDB (evita penjar l'app)
Wrapper `txWithTimeout` amb `Promise.race`.

### 🔧 C. Gestió robusta de QuotaExceeded (purga selectiva, no total)
La funció `purgaRegistresAntics` neteja registres "morts" i "confirmats".

### 🔧 D. Millora de l'arrendament (evita que dos pestanyes es barallin)
Usa un `TAB_ID` únic (`crypto.randomUUID()`) per evitar que una pestanya reclame el que ella mateixa està processant si l'arrendament venç mentre encara envia.

---

## 🎯 RECOMANACIÓ DIRECTA
Apliqueu el P0 immediatament: afegiu timeouts a totes les operacions IDB i feu que el Global Error Handler només purue si l'error prové del vostre codi.
