# BIOS Cognitiu Executable (Sóc de Poble)

Aquest document descriu la seqüència d'arrencada (boot) que ha de seguir qualsevol Intel·ligència Artificial o nou desenvolupador en entrar a treballar al codi base. No és només text, és verificable pel `tooling/verify-bios.mjs`.

## PASSOS DE LA SEQÜÈNCIA D'ARRENCADA
1. **Verificar el BIOS**: Executar `node tooling/verify-bios.mjs` per garantir que el sistema de fitxers core està intacte.
2. **Revisar el BOOTSTRAP**: Llegir `.agents/BOOTSTRAP.md` per conèixer els valors i l'arquitectura.
3. **Assumir el Contracte**: Llegir `.agents/AGENTS.md` (La Font Única de Veritat Executiva).
4. **Verificar Portes Mecàniques**: Executar `npm run gate` per verificar que no hi ha regressions en persistència ni lints.
5. **Comprovar el LEDGER**: Revisar `.agents/LEDGER.md` per veure les últimes decisions arquitectòniques històriques i signar-lo si es modifica (amb `node tooling/verify-ledger.mjs --sign`).

## CONFIGURACIÓ ACTIVA
- **Model Arquitectònic**: Offline-First (Actualment Online-First Temporal amb Supabase, veure `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/architecture/ADR-2026-08-ONLINE-FIRST.md`).
- **Sistema de Disseny**: Pedra Seca (Llegir `.agents/skills/pedra-seca/SKILL.md`).
- **Emmagatzematge Local**: IndexedDB via `src/data/outbox.js` (Escriptures Atòmiques, Circuit Breaker).
