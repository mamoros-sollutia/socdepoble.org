---
tipus: document
estat: esborrany
---
> **Ancoratge de Seguretat**: Aquest estudi pertany a l'[[00_index_escriptori]].

Entenc perfectament l’esperit: esporga extrema del Sistema Nerviós, zero deute tècnic, però amb Trellat.

Ara mateix només tinc el manifest d’aquesta petorreta i els identificadors ISO dels altres documents, però no el contingut real de:

- **[[00_bios]]**
- **[[02_genotip]]**
- **[[doc_governanca]]**
- **[[doc_logos_oficials]]**
- Qualsevol `.agents/skills/*`
- Topologia de carpetes de la Wiki (`_wiki_de_poble/...`)

Per poder fer una auditoria seriosa (contradiccions, nova taxonomia, purgues, propostes de Skills noves, ancoratges), necessite com a mínim:

1. **Dump de Skills actuals**  
   - **Label:** `.agents/skills/`  
   - **Contingut:** fitxer per fitxer, encara que siga truncat, o un extracte representatiu de cada Skill (nom, propòsit, triggers, dependències).

2. **Mapa de la Wiki**  
   - **Label:** Arbre de carpetes  
   - **Contingut:** llistat de directoris i fitxers amb rutes completes sota `_wiki_de_poble/`, encara que siga només índex (sense cos).

3. **Documents nucli d’identitat i governança**  
   - **Label:** Identitat  
   - **Contingut:** text de `00_BIOS.md`, `02_GENOTIP.md`, `DOC_Governanca.md`, `ADR-2026-08-ONLINE-FIRST.md`.  
   - Això marca el “baseline” conceptual per detectar contradiccions.

4. **Exemple de document “fòssil”**  
   - **Label:** Acta Marmota / 99_maquinaria  
   - **Contingut:** un parell de fitxers que consideres fòssils o carpetes buides, per veure patrons de desanclatge.

Quan tinga això, et tornaré:

- Una **matriu de contradiccions** entre Skills + documents nucli.
- Una **nova taxonomia de carpetes i nomenclatura** (capa Brain / Nervi / Maquina, etc.).
- Un **catàleg de purgues** (què es destrueix, què es migra, què es refactora).
- Un **pla de noves Skills** (governança cognitiva, autopoiesi, esporga contínua, ancoratge).
- Un **protocol d’Ancoratge de Seguretat** perquè cap document clau torne a quedar sol.

Si vols, podem començar per un subconjunt (p. ex. només `.agents/skills/` + `00_BIOS` + `DOC_Governanca`) i fer la primera passada destructiva/constructiva allí abans d’estendre-la a tota la Wiki.
