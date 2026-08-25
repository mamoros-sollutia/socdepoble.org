---
estat: "registre_proposta"
tipus: "acta"
seient: "Núm. 5 — Auditor Sènior (Claude)"
---

# ACTA: VEREDICTE FINAL (CLAUDE)

**Data:** 24 d'agost de 2026 (16:15)

L'auditor sènior Claude ha emès el seu veredicte sobre el Pla d'Implementació Mestre.
**Vist i Plau Condicionat:** Aprova l'estructura plana i la integració de La Tanca al `mutation_kernel` (retirant la seua proposta original d'eina satèl·lit per evitar que caiga en l'oblit). Tot i això, assenyala esmenes crítiques que s'han d'aplicar abans de la cirurgia:

## 1. Esmenes Taxonòmiques (Bloquejants)
- **Falta el Lòbul de l'Evidència:** Posar les skills de *grounding*, *verification*, i *Source-Forcing* dins de `cog-` barreja "com pensar" amb "com no mentir". El "Zero IA Slop" és una promesa de procedència.
- **L'Error del prefix `tool-`:** "tool" defineix *quina forma té* la skill, no *de què va*. Acabarà sent un calaix de sastre.
- **Resolució:** El prefix `tool-` se substitueix per **`evi-`** (Evidència). Les 39 carpetes i els 7 prefixos es mantenen en número, però guanyen rigor semàntic. La taxonomia global (per a les de fàbrica també) viurà en un fitxer `CERVELL.md`.

## 2. Esmenes Tècniques del Time Machine (Zero Trust)
- **`renamex_np` no existeix en Node:** L'intercanvi atòmic real en Node pur i multiplataforma (macOS/Linux) es fa mitjançant **intercanvi de symlinks** (reapuntant un enllaç simbòlic `skills -> cervells/<hash>`). Un _rollback_ atòmic i O(1).
- **El perill d'Ed25519 al mateix repo:** Si la clau privada viu al servidor on actuen els agents, l'agent pot signar brossa com si fóra autèntica (teatre criptogràfic). La recomanació és utilitzar **SHA-256 en un magatzem extern** pel moment, fins tindre custòdia de claus en maquinari.
- **Còpia Zero manual:** La primera còpia de seguretat s'ha de fer manualment amb `tar`, abans que existisca cap Time Machine basada en Node.

## 3. Les 5 Portes d'Entrada (Checklist pre-operatòria)
Claude exigeix que abans de moure un sol directori fem les següents 5 comprovacions:
1. (E1) `sync_agent_mirror.py` no té noms de carpetes hardcoded.
2. (E2) `sync_agent_mirror.py` no resol/segueix symlinks destructivament (permetre el disseny C.1).
3. (E3) **Cerca Exhaustiva (grep -rF):** Buscar els 64 noms de skills a TOT el repositori per assegurar que només n'hi ha 2 hardcoded (`socdepoble-workflow` i `socdepoble-iaia-actriu`).
4. (E4) Confirmar plataforma de producció.
5. (E5) Resoldre l'estratègia Ed25519 vs SHA-256 (Decidit: usarem SHA-256 de moment).

---
*Amb aquest veredicte, el Pla Mestre arriba a la seua forma definitiva. L'execució queda retinguda a l'espera de superar les 5 comprovacions de la Porta d'Entrada.*
