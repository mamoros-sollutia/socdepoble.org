# Auditoria Kimi - 27 Agost 2026 (Sóc de Poble)

## 🚨 P0 — CRÍTIC: Escletxes que poden enfonsar la muralla

### P0-1. **OKLCH: La bomba de rellotgeria cromàtica (Incompatibilitat total amb A10)**
Al vostre `index.css`, la capa de primitius declara `oklch`.
**Veredicte:** L'iPad A10 (2016) corre Safari 14 o anterior. OKLCH no té suport fins Safari 15. En dispositius legacy, tota la paleta cau i l'aplicació es renderitza sense colors.

### P0-2. **Singleton Guard irreversible: La porta d'entrada que es converteix en mur**
A `PedraSecaEmbed.jsx`, el boolean `__SDP_REACT_MOUNTED__` mai es posa a `false`.
**Veredicte:** Si WordPress desmunta el component i el torna a muntar, la segona instància es queixa. L'estat global es contamina.

### P0-3. **Race condition en descàrrega de fonts: La cursa del desmuntatge**
A `descarregarFonts()`, el `setTimeout` de 500ms desmunta les fonts just quan una nova instància (en navegació ràpida de WP) pot estar muntant-se.
**Veredicte:** FOIT (Flash of Invisible Text) o FOUT en cada transició de pàgina. Cal un comptador de referències de fonts.

### P0-4. **Null pointer en missatgeria pre-boot (Mort sobtada del xat)**
Si l'usuari envia un missatge abans que `loadAppData` complete, `current.chatMessages` és `null` i peta.

### P0-5. **`@import` CSS trencat dins del Shadow DOM**
El `@import './legacy-components.css'` no es resol dins d'un Shadow Root injectat per string a causa de la falta de base URL.
**Veredicte:** Els estils legacy no es carreguen.

---

## ⚠️ P1 — GRAVE: Fissures estructurals que creixen amb el temps

### P1-1. **ActionsValue inestable: La cascada de re-renders**
`actionsValue` està dins d'un `useMemo` massiu. Cada missatge força el re-render de tota l'app.
### P1-2. **Circuit Breaker nuclear: Tres errors i esborrem la història**
### P1-3. **Cementeri d'outbox: Els morts no enterrats**
Missatges amb `estat: 'mort'` es queden a l'IndexedDB ocupant espai.
### P1-4. **TableOfContentsDrawer contamina el DOM global**
Deixa IDs orfes al DOM.
### P1-5. **Pull-to-refresh bloqueja el scroll vertical**
El `preventDefault()` no comprova si `scrollTop <= 0`.

---

## 🔧 P2 — MITJÀ: Deute tècnic i arestes
P2-1. Duplicació de lògica `handleDateTime`.
P2-2. BroadcastChannel duplicat en canvi ràpid d'usuari.
P2-3. Memory leak a `AvisadorEfimer` (el root global mai es desmunta).
P2-4. `stableExternalConfig` inconsistent.
