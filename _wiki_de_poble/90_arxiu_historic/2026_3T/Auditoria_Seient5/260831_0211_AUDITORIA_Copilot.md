# Auditoria de Copilot: Desobediència, Fantasmes i Pedra Seca

He llegit la teua comanda i prepararé una auditoria pràctica, accionable i sense floritures. Com que has adjuntat un document bloquejat, he recuperat el seu text per revisar-lo i he buscat referències arquitectòniques i pràctiques modernes per fonamentar les recomanacions. A continuació tens un diagnòstic estructurat per missions, amb causes, proves concretes a executar, canvis d’arquitectura i un DAFO final. Incloc fragments textuals rellevants extrets del teu document per ancorar el diagnòstic.

---

## Missió 1: El misteri de la desobediència involuntària
**Problema resumit**  
La Wiki conté regles explícites (p. ex. la “Regla Sagrada” de nomenar les 12 IAs) però el comportament observat no les respecta. Això indica una ruptura entre *font de veritat* (la Wiki) i *runtime* (els skills / agents que actuen).

**Causes probables (prioritzades)**
1. **Font de veritat no és autoritària en runtime** — els skills carreguen còpies locals o constants embegudes i no consulten la Wiki en temps d'execució.  
2. **Ordre d’inicialització i caché** — la regla existeix però s’esborra o s’overrides per un procés d’inicialització posterior.  
3. **Format/Schema incompatible** — la regla està escrita en un format que els parsers dels skills no reconeixen (p. ex. text lliure vs. JSON-LD/manifest).  
4. **Regles condicionals o excepcions** — hi ha regles amb condicions que no s’avaluen com esperat (ex.: “nomena les 12 IAs, excepte si…”).  
5. **Tests insuficients** — manca cobertura que verifiqui que totes les regles de la Wiki s’apliquen en cada flux.

**Solució arquitectònica (inevitable i sistemàtica)**
1. **Convertir la Wiki en la única font de veritat accessible via API interna**  
   - Exposar la Wiki com a **manifest machine-readable** (JSON Schema / JSON-LD) amb versions semàntiques.  
   - Implementar un **Rule Loader** central que: valida, normalitza i firma (HMAC) cada regla. Els agents només accepten regles signades per aquest loader.
2. **Forçar la resolució en temps d’execució**  
   - No embedir regles en builds. Els agents han de carregar (o validar la cache) al *startup* i abans d’executar prompts crítics.  
3. **Contractes i Schema**  
   - Definir un **schema estricte** per regles (id, text, conditions, priority, version, signature). Rebutjar qualsevol fitxer que no compleixi.
4. **Fail-safe i observabilitat**  
   - Si la regla no es troba o no valida, el runtime entra en *safe mode*.
5. **Testing obligatori**  
   - Pipeline CI que valida que cada commit manté la coherència entre la Wiki i els artefactes compilats.

---

## Missió 2: Auditoría dels Skills i Genotip
**Objectiu**: llegir `.agents/skills/` i documents d’identitat, detectar contradiccions, redundàncies i propostes de fusió.

**Checks automàtics a executar**
1. **Inventari**: `find .agents/skills -type f -name '*.js' -o -name '*.mjs' -o -name '*.md'` → generar CSV amb nom, mida, exports, imports.
2. **Anàlisi d’API**: per cada skill, extreure signatures (funcions exportades) i comparar solapaments semàntics.
3. **Static analysis**: linters i detectors d’anti-patrons (funcions massa llargues, dependències cíclics).
4. **Test de personalitat**: prompts de regressió que verifiquin que la sortida d’un skill combinat manté la veu i to de l’IAIA MarIA.

**Exemples de fusió proposats (plantilla de proposta)**
- **Fusionar `greetings` + `persona-voice` → `persona-core`**  
- **Fusionar `data-fetch` + `cache-manager` → `data-core`**  

**Checklist per assegurar adopció completa de la personalitat**
- **Canonical persona file**: `persona.json` amb *voice, lexicon, forbidden_phrases, mandatory_mentions* (p. ex. la llista de 12 IAs com a `mandatory_mentions`).
- **Persona enforcement**: middleware que injecta i valida la `persona.json` abans de generar text.

---

## Missió 3: Re-estructurar Pedra Seca (sistema de disseny)
**Arquitectura proposada**
1. **Design System Monorepo** (`/pedra-seca`) amb tres capes: Tokens, Components, Integracions.
2. **Contractes explícits** per component.
3. **Runtime enforcement**: Linter i CI prohibeixen imports fora del monorepo oficial.
4. **Visual regression i audit**: Storybook + Chromatic.
5. **Migration plan**: Detectar components “shadow” i planificar migració.

---

## Missió 4: La cacera de fantasmes (poda de legacy)
**Patrons a buscar**
- Polyfills globals (per a Baseline < 2022).
- Feature flags obsolets i branques condicionals per a versions antigues.
- Adapters duplicats.

**Pla de treball**
1. Inventari de dependències (`npm ls --prod`).
2. Coverage + runtime telemetry.
3. Feature flag audit.
4. Deprecation PRs per eliminar cada fantasma amb tests.

---

## Entregables oferts per Copilot:
- **(A)** Esquema `rules.jsonld` i un `rule-loader` bàsic en Node.
- **(B)** Script d’inventari i la plantilla `persona.json`.
