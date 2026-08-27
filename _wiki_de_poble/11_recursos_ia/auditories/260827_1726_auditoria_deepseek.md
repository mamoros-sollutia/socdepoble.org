# Auditoria Deepseek - 27 Agost 2026 (Sóc de Poble)

# AUDITORIA EXTREMA: Aïllament React i Persistència IndexedDB (Patró Làzaro)

## ⚡ Resum Executiu
Hi ha tres escletxes crítiques que podrien fer rebentar l'aplicació en producció dins de WordPress i dues condicions de carrera silencioses a l'Outbox que, en un iPad A10, es tradueixen en pantalla congelada o pèrdua de dades.

---

## 1. Aïllament React i WordPress

### 🔥 Problemàtica 1: Singleton Guard Mal Implementat
El flag global no impedeix res, només avisa. Proposa no bloquejar i fer cada instància independent, o usar un `WeakMap`.

### 🔥 Problemàtica 2: `MemoryRouter` i Sincronització d'Estat
`MemoryRouter` no restaura l'estat de la ruta al recarregar. Cal passar-li `initialEntries={[window.location.pathname + window.location.search]}`.

---

## 2. Outbox i IndexedDB

### 🔥 Problemàtica 3: Condició de Carrera a `loadAppData` i `setRawData`
Falta de deduplicació de peticions en curs. Cal afegir una cache de promeses `pendingLoad`.

### 🔥 Problemàtica 4: Arrendament de Registres sense Renovació
Si la petició triga molt, una altra pestanya el roba.

### 🔥 Problemàtica 5: `buida()` SENSE LÍMIT DE REGISTRES
El bucle processa tots els registres sense cedir el fil d'execució. Cal processar per lots (ex: 20) i usar `await new Promise(r => setTimeout(r, 0))` per cedir.

---

## 3. Circuit Breaker i Purga de DB

### 🔥 Problemàtica 6: Purga Automàtica de `sdp-outbox` en `QuotaExceededError`
Esborrat cec. Proposa fer servir un `window.confirm` per a la purga si l'espai està ple, o compactar.

---

## 4. Deute Tècnic Acumulat

### 🔥 Problemàtica 7: `localStorage` Encara Present en Zones Crítiques
`getVal('socdepoble-user')` bloqueja el fil principal perquè és síncron.

### 🔥 Problemàtica 8: `request` Sense Timeout en `loadRemoteAppData`
L'`AbortController` no abasta correctament tot el grup de `Promise.all`.

### 🔥 Problemàtica 9: `css?inline` i Duplicació de CSS
Comprovació massa simple al catch de `adoptedStyleSheets`. Cal comprovar si realment falta el full d'estils abans d'injectar el `<style>`.
