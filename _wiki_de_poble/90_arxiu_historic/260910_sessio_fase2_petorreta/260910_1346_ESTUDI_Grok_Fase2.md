---
tipus: estudi_ia
estat: tancat
description: "Auditoria de Fase 2 (Post-P0) per Grok"
---
# 🧠 ESTUDI CONSELL: Grok (Fase 2)

Grok ha analitzat les vulnerabilitats estructurals latents i el deute tecnològic crític a x10, assenyalant:

### 1. Vulnerabilitats estructurals latents (POST-P0)
- **`supabaseBackend.js` és un monòlit**: Barreja autenticació, CRUD de seccions, mapeig, gestió d'errors. Sense contractes tipats per domini.
- **`App.jsx` com a "god object"**: Importa quasi totes les seccions i decideix el layout. Punt de fallada únic.
- **Contextos múltiples sense jerarquia**: Múltiples contexts (`Router`, `UI`, `Session`, `Identitat`, `CoreContent`, més els de cada secció) forcen re-renders en cascada sense *selector patterns*.
- **AuthBoundary Inexistent**: Sessió dispersa entre components. RLS a SQL però client confiat.
- **`index.css` Monolític**: Risc de regressió visual global per canvis aïllats.
- **Components Universals**: Acumulen lògica de presentació + dades. No preparats per *tree-shaking*.
- **`i18n.js` gegant**: Sense lazy-loading.

### 2. Deute tecnològic més crític a x10
- **Temps de boot i memòria:** Tot el CSS, i18n i contexts es carreguen al primer paint.
- **Propagació de canvis:** Un canvi de schema obliga a tocar múltiples capes (backend, context, UI, CSS). Cost de regressió super-lineal.
- **Impossibilitat de SSR:** Sense frontera clara entre "shell estàtic", "dades de secció" i "estat de client", causant waterfall fetching.
- **Mantenibilitat de l'equip:** Risc d'introducció de deute accidental només intentant localitzar on fer un canvi.

### 3. Pla de Fase 2: Ordre d'execució recomanat per Grok
1. **Tokens + deconstrucció CSS** (gate + migració incremental per secció).
2. **Extracció del backendPort** + eliminació total de seeds en mode remot.
3. **Lazy-loading de seccions** + reducció d'`App.jsx` a shell.
4. **AuthBoundary únic** + neteja de SessionContext.
5. **Contractes `getServerData`** + separació snapshot/subscripció al xat i al mur.
6. **Mesures de mida de bundle** i temps a interactive abans/després de cada pas.
