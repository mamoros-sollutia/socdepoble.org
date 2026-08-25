---
estat: "registre_proposta"
tipus: "acta"
---

# ACTA: PROPOSTA DE REESTRUCTURACIÓ DEL CERVELL (GEMINI)

**Data:** 24 d'agost de 2026 (15:50)

Gemini ha sigut la primera IA del Consell en respondre a la Petorreta Internacional. La seua proposta de reestructuració es basa en "Lòbuls Semàntics" i respecta fil per randa les lleis de Pedra Seca i el Genoma de Fàbrica.

## 1. El Mapa Arquitectònic Proposat
S'estableixen 9 lòbuls clars on s'agruparan les desenes de skills actuals:
1. `cog-trellat-reasoning/`: CoT profund i raonament pas a pas.
2. `cog-multi-agent/`: Gestió de consells, meta-prompting i resolució de consensos.
3. `sec-verificacio-empirica/`: Verificació en cadena i exigència de fonts (anti-al·lucinacions avançat).
4. `sec-boundary-guards/`: Tallafocs d'accés, aïllament i portes de mutació.
5. `arc-pedra-seca-canon/`: Les lleis de UI, HTML semàntic, accessibilitat extrema i 0 slop.
6. `arc-sovereign-thermodynamics/`: Optimització extrema, *offline-first* i degradació elegant.
7. `wf-context-memory/`: Compressió semàntica i cura de l'estat.
8. `wf-identitat-rural/`: Empatia rural, to d'actriu i progressiva divulgació.
9. `sollutia-core-en/`: La caixa forta intocable per a les 24 skills de fàbrica de Sollutia.

## 2. Tractament dels Scripts Auxiliars
Els scripts interns (com els validadors de disseny o eines de `tooling/`) s'hauran de traslladar físicament a les capçaleres de cada lòbul corresponent (per exemple, cap a `arc-pedra-seca-canon/`). Els *imports* relatius s'hauran d'actualitzar fent ús de `tooling/wiki/lib/project_paths.mjs` per no trencar l'arquitectura.

## 3. La "Time Machine" del Cervell
Per assegurar `.agents/skills/`, Gemini proposa ampliar l'eina `tanca.mjs`:
- **Snapshot Automàtic:** Abans de qualsevol escriptura al cervell, es comprimirà en ZIP/Tarball l'estat del directori dins de `.time-machine/skills_snapshots/`.
- **Rollback Quirúrgic:** S'afig un flag `--restore-brain=<snapshot_id>` a l'eina `sdp.mjs` per poder tornar arrere si el rendiment cognitiu empitjora.

---
*Aquesta és la primera peça de l'esbós final. Esperem les propostes de Claude, Codex i Dola abans de decidir la fusió definitiva.*
