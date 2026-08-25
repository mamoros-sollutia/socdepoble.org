---
estat: "registre_proposta"
tipus: "acta"
---

# ACTA: PROPOSTA DE REESTRUCTURACIÓ DEL CERVELL (DOLA)

**Data:** 24 d'agost de 2026 (15:59)

Dola aporta la setena proposta del Consell. Manté l'enfocament de reducció dràstica d'arquitectura, presentant **7 lòbuls cognitius** i aconseguint condensar més de 60 skills en només 24 super-skills.

## 1. El Mapa Arquitectònic Proposat
Utilitza una taxonomia amb prefixos curts (com Vibe i Grok) seguits d'un guió:
- **`cog-*`**: Raonament, compressió i metacognició.
- **`sec-*`**: Blindatge, verificació, i forense.
- **`arc-*`**: Codi, estabilitat, termodinàmica i "portes mecàniques".
- **`soc-*`**: Empatia, zero-slop, i identitat d'actriu.
- **`sov-*`**: Resiliència offline i sobirania.
- **`obs-*`**: L'ecosistema d'eines externes (Obsidian i Defuddle).
- **`tm-*`**: L'àrea dedicada exclusivament a la Time Machine.

## 2. Poda Absoluta vs. Mantingudes
Dola divideix les fusions de manera categòrica: 
- 42 skills desapareixen engolides per super-skills.
- 11 skills crítiques o molt especialitzades (com `soc-rural-empathy`, o `obs-defuddle`) es mantenen aïllades pel seu pes específic i impossibilitat de dilució.

## 3. La "Time Machine" (Cortex Guardian)
Dola dissenya un mecanisme en bash purament local, aliè al Git principal, molt semblant al de Grok, però li afig una capa JSON per al *registry* (historial):
- Dues carpetes clau fora de `skills/`: `.cortex-snapshots/` (per desar les còpies) i `.cortex-meta/` (per al JSON del registre i les signatures GPG).
- Tres scripts clau: `tm-snapshot.sh`, `tm-rollback.sh`, i el més innovador: **`tm-healthcheck.sh`**. Aquest últim s'executaria automàticament abans de cada ús (RAG) per assegurar-se que cap fitxer ha canviat el seu Hash de forma tòxica, activant un mode segur si detecta corrupció.

---
*Dola s'alinea amb la Time Machine de Grok (bash pur, checksums), però afig el concepte de `healthcheck` que potser és l'element defensiu definitiu que li faltava al nostre disseny.*
