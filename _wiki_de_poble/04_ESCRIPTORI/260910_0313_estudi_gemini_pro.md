# Estudi Gemini Pro: Auditoria Estructural
**Data:** 10 de setembre de 2026 (03:13)
**IA:** Gemini Pro
**Origen:** Petorreta d'Auditoria Estructural

Salutacions, Mestre. Ací tens la IAIA MarIA (amb el motor d'Antigravity funcionant al màxim) aplicant el Trellat més implacable. He disseccionat l'arquitectura de *Sóc de Poble* fil per randa. Tens una visió noble i un disseny conceptualment brillant, però a nivell de codi has construït un laberint que es devorarà a si mateix si no l'esporguem prompte.

Aquesta és l'auditoria forense, directa a l'os:

### 🏗️ Sobre-enginyeria al Tooling (Anti-Patró)

* **Excés de Burocràcia Mecànica:** Tota la carpeta `tooling/gates/` és una col·lecció de scripts fets a mida que parsegen AST i fan expressions regulars complexes sobre el codi font. Això és un deute tècnic inassumible a 5 anys vista.
* **Fricció Futura:** Un programador nou no pot aprendre 30 lleis de validació customitzades (`tractor-cromatic.mjs`, `tractor-estucat.mjs`, etc.). Aquestes eines acabaran fallant amb les noves versions de Node o ECMAScript.
* **Solució Resilient:** Substitueix immediatament aquests tractors per un ecosistema estàndard. Utilitza regles personalitzades d'ESLint i automatitza les comprovacions amb GitHub Actions o GitLab CI.

### 🔐 Vulnerabilitats de Sessió i Injecció

* **Condició de Carrera (Race Condition) al Pany:** A `src/data/backendPort.js`, confies en un `setTimeout` de 5.000 ms per congelar l'API i evitar injeccions tardanes. En xarxes rurals lentes, aquest temps arbitrari pot fallar i permetre la manipulació de la injecció del backend.
* **Sessió Fràgil:** Retenir el JWT a `sessionStorage` (via `identitat.js`) trenca l'experiència multi-pestanya i exposa l'usuari si hi ha una vulnerabilitat XSS.
* **Solució Resilient:** La sessió ha de viatjar en galetes `httpOnly` gestionades completament per Supabase o pel servidor de Sollutia. El pany de l'API s'ha de tancar síncronament just després del muntatge, sense temporitzadors.

### 🧩 Fragilitat del Frontend i Dependències

* **Aliàsing Perillós:** A `vite.config.js`, forces l'aliàsing de `react` cap a `preact/compat`. Això és una bomba de rellotgeria amagada per a llibreries complexes del projecte com `@tiptap/react`, que esperen l'arbre virtual de React 18+ real.
* **Solució Resilient:** Accepta el pes de React pur per evitar defectes de renderitzat asimètrics en el futur. La "Pedra Seca" s'ha de mantenir en la puresa de l'HTML/CSS, no falsejant el framework base.

### 🛠️ Avaluació Global

L'esforç per mantenir la puresa ha generat una paranoia defensiva que asfixia el codi. Si hi ha un risc de destrucció per refactorització massiva, caldrà activar l'**SDP-LOCK** abans d'intervenir. El teu projecte necessita menys regles autogenerades i més eines de l'estàndard de la indústria per ser un regal per als programadors del demà.

**NOTA GLOBAL DE RESILIÈNCIA: 6.5 / 10**

Quin dels tractors de `tooling/gates/` et genera més maldecaps de manteniment actualment per començar a dissenyar-ne la substitució cap a un plugin d'ESLint estàndard?
