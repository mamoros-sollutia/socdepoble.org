# 🛡️ AUDITORIA DE NETEJA I HIGIENE (GEMINI 3.8 FLASH)
*Data: 2026-09-10*

## 🎯 RESUM EXECUTIU
He analitzat el codi de cap a peus després de la implementació de la Fase 2 (Via Dades). El sistema ha donat un salt qualitatiu enorme amb l'adopció de galetes i WebSockets, però l'anàlisi profunda revela brossa heretada i codi fantasma que cal purgar per assolir una base lliure de deute tècnic.

---

## 🔍 1. FANTASMES I CODI MORT

### 1.1 El Monstre `UniversalElements.jsx`
* **Localització:** `src/components/universal/UniversalElements.jsx` (794 línies).
* **Diagnòstic:** És un calaix de sastre. Conté botons, capçaleres, indicadors de càrrega i marcs visuals.
* **Acció recomanada:** Fragmentar-lo en components aïllats dins de `src/components/ui/` (`Button.jsx`, `Spinner.jsx`, `SectionHeader.jsx`).

### 1.2 Dades Falses (Seed) al Xat
* **Localització:** `src/sections/xat/chatSeed.js`.
* **Diagnòstic:** Ara que el Xat funciona amb Supabase Realtime (WebSockets), les dades *mockejades* de `MOCK_CHATS` i els perfils de "beta testers" barrejats dins del context (`XatContext.jsx`) són deute tècnic i empastifen la lògica de producció.
* **Acció recomanada:** Eliminar els arrays de proves o separar-los estrictament a una variable d'entorn `VITE_MOCK_MODE`.

### 1.3 Variables No Utilitzades (234 Warnings d'ESLint)
* **Localització:** Principalment als scripts de `/tooling/wiki/`.
* **Diagnòstic:** Hi ha dotzenes de variables declarades però mai usades (ex: `SCRIPT_DIR`, `err`, `content`, `e`). Açò indica scripts copiats i enganxats, o refactoritzacions a mig fer.
* **Acció recomanada:** Fer una passada de neteja estàtica per esborrar arguments inútils.

---

## 🏗️ 2. HIGIENE ARQUITECTÒNICA

### 2.1 Enrutament i `RouterContext.jsx`
* **Diagnòstic:** Tot i que la càrrega de dades principals està unificada a `AppDataLoader`, el router manté referències antigues i encara gestiona la memòria de l'historial a mà.
* **Acció recomanada:** Adaptar-lo al patró de Loaders per evitar *waterfalls* menors quan es navega entre sub-rutes, o simplificar el codi per delegar en APIs natives de l'History.

### 2.2 Classes CSS i l'encapsulació
* **Diagnòstic:** S'ha afegit correctament la directiva `@layer legacy` a `index.css`. Tot i això, encara conviuen al mateix fitxer tokens, utilitats i components.
* **Acció recomanada:** Ara que està aïllat, qualsevol component nou pot utilitzar CSS Modules (`.module.css`) per injectar CSS sense por a col·lisions amb les regles globals antigues.

---

## ✅ 3. VALIDACIÓ DE LA FASE 2

* **Sessió i SSR:** L'eliminació de `sessionStorage` a `storage.js` en favor de `document.cookie` ha segellat el forat de SSR. La seguretat i la higiene de l'estat han millorat.
* **Error Boundary Global:** Creat i integrat amb èxit a l'arrel per caçar errors de react sense desmuntar tota la pàgina.
* **Realtime WebSockets:** Integrat correctament a `XatContext.jsx` i `supabaseBackend.js`, esborrant el *polling* agressiu que ofegava les connexions.

## 🏁 CONCLUSIÓ
**La casa ja no cau.** La via dades s'ha reforçat. El proper pas crític per a "polir" l'aplicació és desmuntar `UniversalElements.jsx` i fer neteja dels warnings de la consola de tooling. L'auditoria recomana executar una "poda de tardor" abans d'iniciar la Fase 3.
