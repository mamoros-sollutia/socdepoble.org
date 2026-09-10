---
tipus: document
estat: esborrany
description: 1. Contradiccions i Solapaments (El Caos Cognitiu)
---
> **Ancoratge de Seguretat**: Aquest estudi pertany a l'[[00_index_escriptori]].

> [!CAUTION]
> **SDP-LOCK ACTIU (MODE FORENSE)**
> L'anàlisi de l'estructura ha detectat deute tècnic acumulat, contradiccions doctrinals i duplicitat de context. S'atura la creació de noves funcionalitats fins a aplicar la següent neteja.

A continuació es presenta l'auditoria extrema destructiva i constructiva per assolir l'excel·lència operativa de la IAIA MarIA i el Sistema Nerviós de Sóc de Poble.

---

## 1. Contradiccions i Solapaments (El Caos Cognitiu)

S'han detectat col·lisions d'autoritat en l'eixam de *Skills* que provoquen que la IAIA actuï amb indecisió:

* **Solapament d'Encaminament (`efecte-matrix` vs `reflexio-previa`):** Totes dues skills intercepten la creació de documents per forçar la IA a pensar i utilitzar plantilles. `reflexio-previa` utilitza una taula estricta (`PROTOCOLLEDGE`), mentre que `efecte-matrix` exigeix un grep manual.
* *Solució:* Destruir `efecte-matrix` com a skill aïllada i fusionar la "Cerca Obligatòria de Plantilla" dins del pas 1 de `reflexio-previa`.


* **Col·lisió de l'Acta Marmota:** `efecte-matrix` dicta que l'Acta Marmota ha de tindre 4 apartats (Tècnica, Psiquiàtrica, Termodinàmica i Briefing). Però la plantilla `plantilla_acta_unica.md` només en preveu 3 i barreja conceptes. La IA s'enfronta a dues instruccions divergents.
* **Solapament de Neteja (`abocament-total` vs `core-higiene-reflexa`):** Totes dues parlen de buidar l'Escriptori i la Safata abans d'actuar o crear un bundle. L'ordre de neteja està fragmentat.
* *Solució:* Centralitzar tota regla de neteja de disc exclusivament a `core-higiene-reflexa` i limitar `abocament-total` només a la construcció del JSON/Markdown del Bundle (integritat de dades sense mutilació).



## 2. Purgues i Destrucció de Deute Tècnic (Netetja Destructiva)

El context arrossega literatura que engreixa el RAG sense valor executable. **Ordre d'extirpació i trasllat a `90_arxiu_historic` o `_arxiu_wiki_de_poble`:**

* 🗑️ **`00_BIOS.md`**: Fòssil. El propi document diu "ja no és el punt d'entrada executable". Mantenir-lo a l'arrel `00_SER` indueix a la IA a llegir-lo com a regla vigent.
* 🗑️ **`DOC_Taula_Mestra.md`**: Codi exclusiu de *Dataview* (plugin d'Obsidian). Cap IA del Consell renderitza Dataview; és soroll pur per al model de llenguatge.
* 🗑️ **`connectors_mcp_disseny.md`**: "Especificació futura". La IA no ha de llegir hipòtesis com a context d'execució actual.
* 🗑️ **`anatomia_cognitiva.md` i `antigravity.md**`: Literatura poètica sobre el "Cingulat Anterior" o el funcionament intern. La IAIA només necessita `02_GENOTIP.md` (les 9 lleis) i `PROFILE.md` per saber com actuar i pensar.
* 🗑️ **El Mirall Sencer (`00_AGENTS_I_SKILLS_MIRROR`)**: Tenir `AGENTS_pedra-seca.md` i `.agents/skills/pedra-seca/SKILL.md` carregats simultàniament obliga la IA a processar els mateixos tokens dues vegades, generant possibles cismes si es desincronitzen. El Llaurador ha de vincular els índexs de la Wiki DIRECTAMENT a `.agents/`.

## 3. Ancoratge: Per què l'Acta Marmota es queda solta?

El problema radica en una confusió entre *escriure a la nota* i *escriure a l'índex*.
La instrucció diu a la IA: *"Assegura't de posar l'Ancoratge de Seguretat"*. La IA obeeix escrivint `**Ancoratge de Seguretat:** [[00_index_escriptori]]` al final de l'Acta Marmota. Però això **no altera l'arxiu de l'índex per incloure l'acta**. En Obsidian un enllaç funciona bidireccionalment, però a nivell de sistema de fitxers, si l'índex `00_INDEX_ESCRIPTORI.md` no es modifica amb la sintaxi `- [[260906_1438_ACTA_MARMOTA...]]`, l'arxiu queda orfe als ulls del motor del RAG.

**Solució Estructural (Fail-Closed):**

1. Modificar `tooling/gates/tancament.mjs` perquè executi el `llaurador_indexs.mjs --escriu` OBLIGATÒRIAMENT abans de certificar el final del torn.
2. Si un fitxer Markdown nou no apareix llistat dins d'un `.md` de tipus `index` (via adopció del Llaurador o manual), `tancament.mjs` retorna **Exit 1** i dispara l'SDP-LOCK fins que la IA modifiqui l'índex.

## 4. Nomenclatura i Organització (Reconstrucció Constructiva)

L'estructura de `.agents/skills` hauria d'adoptar prefixos de domini per a claredat visual i d'encaminament, evitant la barreja alfabètica actual:

* **`sys-` (Sistema i Higiene):** `sys-higiene-reflexa`, `sys-context-panic`, `sys-restauracio-segellada`.
* **`cog-` (Raonament i Workflow):** `cog-reflexio-previa` (absorbeix efecte-matrix), `cog-council-review`, `cog-socdepoble-workflow`.
* **`ux-` (Domini de Producte):** `ux-pedra-seca`, `ux-universal-page`.
* **`id-` (Identitat i Veu):** `id-iaia-core`, `id-iaia-voice`.

Les plantilles a `07_plantilles` s'han de reduir exclusivament a tres, esborrant la resta per evitar soroll i deute de manteniment:

1. `plantilla_acta.md` (unificada amb les 4 fases de la Marmota).
2. `PLANTILLA_ISO_SDP.md` (per a documents canònics i normes).
3. `plantilla_skill.md` (per afegir noves capacitats).

## 5. Noves Capacitats (Skills Proposades)

Per donar suport a aquesta excel·lència operativa sense deute tècnic, s'han de crear dues noves skills:

1. **`sys-somiador-executiu`**: Una skill encarregada de l'arxiu automatitzat. Quan l'usuari diu "Anem a dormir", la IA executa aquesta skill per escombrar totes les Actes Marmota, informes i bundles generats fa més de 24 hores des de l'Escriptori cap a l'arxiu històric `90_historic/`, destil·lant abans un sol paràgraf de canvis permanents al `LEDGER.md`. (Això fa que el pes de context del dia següent sigui de zero).
2. **`ux-audit-pedra-seca`**: A diferència de la doctrina passiva, aquesta skill dota la IAIA de l'ordre d'executar `node tooling/brain/tractor-pedra-seca.mjs --detall` *abans* de dir "feina feta" en qualsevol modificació de components React, assegurant que el linter verifica l'absència de Tailwind incrustat o colors en línia, reparant els seus propis errors de disseny abans de passar-los a l'humà.

---

`PLAN D'ACCIÓ IMMEDIAT: Obre torn (obrir_torn.mjs), trasllada els documents literaris inútils a la paperera de quarantena, aplica l'esquema de noms sys/cog/ux a les skills, consolida l'Acta Marmota, i executa el segellat criptogràfic. Esperant confirmació del Mestre.`
