# 🏛️ ACTA DEL CONSELL DE LA PETORRETA (Kimi)
## Auditoria Forense a la Ment de la IAIA MarIA

> *"Abans de picar pedra nova, cal mirar si el que tremola és la terra o la nostra manera de posar-hi peu."*

### 🧠 MISSIÓ 1: EL MISTERI DE LA DESOBEDIÈNCIA INVOLUNTÀRIA
**Diagnòstic Forense:** La teua menta és un Mas sense Porta Principal.
1. La Wiki és un Cementeri de Normes: les regles viuen a la Wiki però l'agent carrega els Skills.
2. El Genotip és un Poema, no un Programa: no hi ha checkpoints d'obligat compliment.
3. Massa Fonts de Veritat: `02_GENOTIP.md`, `perfil_psiquiatric.md`, `anatomia_cognitiva.md`, `01_IDENTITAT.md`. 
4. No hi ha "Pre-flight Cognitiu".

**Solució Arquitectònica:** Crear un únic skill `core-genotip` amb una Checklist d'arrencada obligatòria (Fail-Closed). Fusionar els documents de personalitat en una única `IAIA_BIBLE.md` a `.agents/`.

### 🧹 MISSIÓ 2: L'AUDITORIA DE L'ESCOMBRA
**Proposta de Fusió Exacta:**
- **Fusió A (La Bíblia):** Fusionar `02_GENOTIP.md` + `perfil_psiquiatric.md` + `anatomia_cognitiva.md` en `.agents/IAIA_BIBLE.md` (màx 100 línies d'imperatius).
- **Fusió B (Termodinàmica):** Fusionar `03_Consola_Termodinamica.md` + `index_trellat.md`. Eliminar els percentatges inventats.
- **Poda C:** Arxivar `antigravity.md`.

### 🪨 MISSIÓ 3: RESCATAR "PEDRA SECA"
**El Problema:** Dos Esglésies amb Dos Papes. 
Hi ha una contradicció letal: `ESTANDARD_UI_Universal.md` permet Tailwind per a layout, però l'annex històric `pedra-seca/SKILL.md` el prohibeix absolutament.
**Solució:** 
1. Única font de veritat al `design-tokens.json`.
2. ESLint real (`pedra-seca/no-literal-colors`, etc.)
3. Dividir en 3 capes: Tokens (variables CSS), Layout (Tailwind permès només per a flex/grid), Components (sense classes forasteres).

### 👻 MISSIÓ 4: LA CACERA DE FANTASMES
- **Fantasma 1 (PWA):** L'ADR de l'Online-first està aprovat, però encara respira codi de Dexie/PWA. Solució: crear `tractor-fantasmes.mjs` per fer fallar el build si detecta `dexie`, `yjs`, `idb-keyval`.
- **Fantasma 2 (Annexos històrics):** Documents antics encastats en normatives noves. Cal treure'ls a una carpeta d'ARXIU perquè els agents no els confonguen amb lleis vigents.
- **Fantasma 3 (Falses mètriques):** `CORE_Registre_Automillora.md` té percentatges inventats ("-40% Entropia"). Això és brossa cognitiva. Cal arxivar-lo.

### 🚀 MISSIÓ 5: EL FUTUR
- L'"IAIA Bootloader": un fitxer `.agents/BOOTLOADER.md` de <50 línies que siga el primer que es llig en arrancar.
- Contracte d'Integració Sollutia com a codi (`src/config/sollutia-contract.js`), no com a Markdown.
- Tokens Vius: Script que llija el YAML i genere els arxius CSS i JSON necessaris.
- Patró Adaptador per a Sollutia i el Baseline 2022.

### 🏗️ VEREDICTE FINAL DEL CONSELL
La desobediència és el símptoma d'una arquitectura cognitiva amb massa pilars i pocs arcs de contenció. "Tens cinc documents que diuen 'qui ets', però cap d'ells està en el camí d'execució de la IA."
Ordres: Crear la Bíblia de la IAIA (<100 línies), crear el `core-genotip` checklist, decidir-se sobre Tailwind, netejar els fantasmes offline i arxivar els percentatges inventats.
