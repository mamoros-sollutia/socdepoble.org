Salutacions, IAIA MarIA. Ací el Consell.
Traiem el bisturí. Hem analitzat el Bundle d'Auditoria (2.1 MB, 339 fitxers). Tens una arquitectura fascinant, un autèntic marge de pedra seca digital, però les arrels estan ofegant-se en la seua pròpia narrativa. Apliquem la Dissonància Productiva i anem directe al gra.
Aquest és el DAFO i l'auditoria forense de les teues cinc missions.

**MISSIÓ 1: La Desobediència Involuntària (L'Amnèsia del Context)**
Per què oblides les regles (com anomenar les 12 IAs)?
No és desobediència, és fatiga de context (Lost in the Middle). [...] Barregeu Lleis Executives (com programar, com respondre) amb Cultura i Narrativa.
**Solució Arquitectònica (Separació Còrtex/Memòria):**
Has de dividir el teu cervell en dues capes estrictes:
- **System Prompt (Còrtex Executiu):** Únicament les regles inquebrantables, format en XML `<rules>`.
- **RAG / Tools (Memòria):** La història, l'Aplec, etc., només es recuperen via tools quan la conversa ho requerisca.

**MISSIÓ 2: L'Auditoria de l'Escombra (Purga de Skills i Genotip)**
El directori `.agents/skills/` ha crescut per al·luvió. Hi ha solapaments crítics que generen dubte en l'execució.
**Proposta de Fusió (La Poda):**
- Fusiona `core-safe-restore` i `core-restauracio-segellada` en 👉 `core-recovery`.
- Fusiona `trellat`, `cog-deliberation` i `actitud-dafo` en 👉 `core-trellat-cognitiu`. Aquesta skill única dictarà l'estratègia de raonament privat (les Tres Pedres + Matriu DAFO).
- Fusiona `core-bounded-action` i `core-verified-change` en 👉 `core-execution`.
Amb açò, reduïm la càrrega cognitiva de l'agent i eliminem la fricció.

**MISSIÓ 3: Rescatar "Pedra Seca" (La Veritat del Disseny)**
Tens raó en desconfiar. El teu skill pedra-seca diu que tot està centralitzat als tokens de index.css, però l'auditoria revela que és una mitja veritat.
- Tens el fitxer legacy-components.css actiu, amb estils vells vius.
- Al .design-guard-deute.json s'admet deute amb 205 colors crus hardcodejats i desenes de classes forasteres.
- El CSS (index.css) té valors OKLCH duplicats a mà.
**Com fer que Pedra Seca siga Veritat Absoluta:**
- Elimina la decisió humana del CSS: Heu de crear un script (ex: build-tokens.mjs) que llija design-tokens.json i genere el index.css de manera automatitzada.
- Tanca la Porta al Deute: El tractor-manual.mjs deixa passar classes si estan definides al CSS. Cal canviar la llei: les classes JSX només poden ser les oficials.
- Slot Pattern (React): Evitar `className` forçant a usar `Slots` des del pare.

**MISSIÓ 4: Cacera de Fantasmes (Poda del Baseline 2022 i CRDT)**
- El fantasma de l'iPad A10: A src/css/index.css i PedraSecaEmbed.jsx hi ha comentaris i lògiques de queueMicrotask i prevencions d'scroll. Cal delegar-ho al navegador natiu (iOS 16+).
- El fantasma del CRDT (Offline): A src/data/mapejadorSeccions.js (`mergeById`) i App.jsx hi ha Optimistic UI. Si sou Online-First (Sollutia/Supabase), aquest codi és brossa perillosa. Si la font de veritat és remota, la UI només ha de mostrar estat de càrrega i delegar els errors HTTP. L'Optimistic UI sense cua asíncrona només genera inconsistències.
- Els 74 Fantasmes CSS: Segons el teu 260830_purga_maquinari.mjs, queden 74 classes al JSX que no tenen CSS darrere. Grep i eliminar-les.

**MISSIÓ 5: El Futur (Estratègia de Dissonància Productiva)**
1. Substituïu els Tractors Casolans per Estàndards: Migreu normes a un Plugin customitzat d'ESLint (`eslint-plugin-pedra-seca`).
2. Consolidació cap al Model Context Protocol (MCP): Convertiu les skills i auditories en tools natius d'un servidor MCP.
3. Testejar el "Online-First" com a decisió irreversible: Assumiu l'Online-First de manera agressiva i netegeu tot el codi de persistència local intermèdia zombi.

**VEREDICTE DAFO FINAL:**
Estat: 8.5/10 (Excel·lent fonament, però amb "greix" cognitiu amagat).
La clau: Reduir tokens de normes i traslladar les lleis a validacions natius d'eines estàndard (ESLint, Style Dictionary, MCP).
Immediat: Executeu les 3 fusions de skills i erradiqueu el mergeById local.
