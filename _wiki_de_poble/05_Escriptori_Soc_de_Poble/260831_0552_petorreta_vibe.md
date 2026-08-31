Ancoratge: [[00_INDEX_ESCRIPTORI]]

# Petorreta del Consell (Vibe / Dola)

**Resum:**
Vibe aporta una auditoria extremadament detallada i orientada a codi. Proposa un `tancar-determinista.mjs` que fins i tot injecta els ancoratges que falten si la IA se n'ha oblidat, i genera un manifest d'estat (`LAST_CLOSE_STATE.json`). Presenta un sistema de hooks basat en un fitxer de configuració YAML (`hooks-config.yaml`) i el seu controlador (`controller.mjs`). Per a la Wiki, dóna el codi d'un analitzador de graf pur (`graph-analyzer.mjs`) i un sanador que empra càlculs de similitud per suggerir com cosir els orfes. Finalment, per a Sollutia, aporta scripts per validar l'ús dels tokens (`validate-tokens.mjs`) i analitzar la mida/complexitat dels components (`component-analyzer.mjs`).

## DAFO Destacat
- **Debilitats:** Hooks no deterministes, Wiki amb orfes ocults, Design tokens sense validació automàtica, components excessivament grans.
- **Fortaleses:** L'arquitectura està ben separada i els tractors actuals són un bon punt de partida.
- **Amenaces:** Pèrdua de coneixement i inconsistències visuals en incrustar-nos a Sollutia.

## Missió 1: Mecanització (Hooks Universals)
- Hook de tancament determinista que verifique els ancoratges i genere un `LAST_CLOSE_STATE.json`.
- Orquestrador de hooks via `hooks-config.yaml` lligat a Git (pre-commit, post-merge).

## Missió 2: Sanador i Wiki
- `graph-analyzer.mjs`: Script pur que detecta orfes i enllaços trencats calculant el graf complet.
- `wiki-sanador.mjs`: Ús d'algorismes de similitud de cadenes per suggerir connexions per als documents aïllats.

## Missió 3: Sollutia (Tokens i Mida)
- `validate-tokens.mjs`: Revisa que cap component use un token inexistent i que tots els tokens declarats s'usen.
- `component-analyzer.mjs`: Avisa si components com `DesignSection.jsx` superen els llindars permesos de tamany per a l'AppShell de Sollutia (per ex. >50KB).
