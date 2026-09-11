---
tipus: document
estat: canonic
description: "Estat Actual: ManagerItemCard normativitzat amb Llei de Pedra Seca, Bug P0 Perfil solucionat, 404 centrada i Agenda de Restauració Notes i Xat"
---
# ESTAT.md (Registre d'Estat Cognitiu)

## Objectius Assolits (Sessió 260911)
- **Llei de la Fitxa de Gestor (Pedra Seca)**:
  - Creat `src/components/universal/manager/ManagerItemCard.jsx` seguint la norma canònica (títol ≤ 2 línies, subtítol ≤ 1 línia, miniatura quadrada 96×96px, zero estils en línia, WCAG AAA).
  - Portes validades amb `tooling/gates/tractor-fitxa-gestor.mjs` (9/9 ✅ EXIT 0).
  - Bloc canònic afegit a `src/css/index.css` (`.sdp-gestor-fitxa`, `.sdp-gestor-llista`, `.sdp-gestor-buit`, tokens semàntics).
- **Bug P0 del Perfil Resolt**:
  - A `src/components/universal/manager/ManagerList.jsx`, la clau i selecció de files s'ha canviat de `item.id` a `getItemId(item)`, evitant xocs d'IDs entre ajustos i permetent la navegació i selecció fluida de cada secció del Perfil.
- **Pàgina 404 Centrada i Estètica**:
  - `NotFoundPage.jsx` redissenyada amb `.sdp-404-cos`, icona brúixola, botó d'acció centrat i estils a `index.css`. Provada al navegador i aprovada pel Mestre.
- **Consumidors Migrats**:
  - `NotesSection.jsx`, `PerfilShell.jsx` i `AdminSection.jsx` integrats amb `getItemCard`.
- **Rescat Gestoria 3T & Fix RLS Perfil**:
  - Rescatada la maquinària de gestoria a `public/gestoria/` lliure de mode fosc forçat per SO, adaptada a Pedra Seca clara (`#fbf9f5` / `#ffffff`).
  - Resolt el bug 403 RLS de pujada de fotos a perfils mitjançant fallback de metadades a `auth.users` i sincronització de sessió.
  - Avatar de perfil actiu en rodó (`50%`) a la cantonada superior dreta del TopNav.
  - Panell de Control (`/control`): targetes d'acció centrades, targeta "Animalets", i nova secció `Utilitats` amb "Gestoria de Poble".
- **Petorreta 260911_0624 (Uniformització Gestoria & Selector de Píndola)**:
  - Generat el Bundle `260911_0624_BUNDLE_auditoria.md` i Prompt `260911_0624_PROMPT_auditoria.md` per al Consell d'IAs.
  - Objectiu: blindar el patró de botons en píndola `[Universal Cards] [Vista Comprimida]` i guiar la unificació visual sense barrejar CSS antic.

## Agenda i Briefing Integral (Documentat a `_wiki_de_poble/04_escriptori/260911_0520_ACTA_MARMOTA_tancament_sessio.md`)
1. **Bloc de Notes - Restauració de Capçalera Doble i Alineació**:
   - Reposar l'acordió vertical a la columna `CARPETES` (amagar/desplegar seccions) + botó replegar `[|<]`.
   - Sub-barra de Carpetes: pastilla destacada `[Inbox] Tot` + rodeta d'engranatge `⚙` per a la gestió global del bloc de notes.
   - Columna `NOTES`: títol de columna amb icona + botó de replegar. Sub-barra amb icona lupa compacta `🔍` + botó `CREAR NOTA` blau alineat amb la barra blava de l'editor.
   - Plegat harmònic: les 4 icones es mantenen alineades i visibles fins i tot quan les columnes estan plegades.
2. **Barra Blava Fixa (UniversalPage / Disseny)**:
   - Evitar que la barra blava superior desaparega amb l'scroll vertical; ancorar-la fermament a la part superior de la pàgina.
3. **Supabase (Xat)**:
   - Executar migracions `260908_xat_v2.sql` i `260908_xat_v2_correccions.sql` al SQL Editor de Supabase per registrar la funció RPC `xat_fils_meus` i eliminar els 404 del xat.
4. **Petorreta al Consell d'IAs**:
   - Fer córrer el prompt `260911_0624_PROMPT_auditoria.md` amb el bundle pel Consell (Qwen, DeepSeek, Claude, ChatGPT, Grok, etc.) per rebre els dictàmens d'uniformització.

