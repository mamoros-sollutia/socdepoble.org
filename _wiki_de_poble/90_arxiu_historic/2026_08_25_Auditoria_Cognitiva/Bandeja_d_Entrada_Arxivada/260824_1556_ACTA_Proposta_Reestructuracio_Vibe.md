---
estat: "registre_proposta"
tipus: "acta"
---

# ACTA: PROPOSTA DE REESTRUCTURACIÓ DEL CERVELL (VIBE)

**Data:** 24 d'agost de 2026 (15:56)

Vibe (Mistral Vibe / Consell) aporta una proposta extremadament meticulosa i quantificada. Aconsegueix una reducció del 58% del total de *skills* (de 60 a 25) i introdueix el concepte de *Super-Skills* i `METADATA.json` obligatori per a cadascuna.

## 1. El Mapa Arquitectònic Proposat (8 lòbuls funcionals)
L'arbre resultant es divideix en 8 directoris principals de tres lletres (estil Trellat):
1. **`cog/`**: Cognició. Fusió massiva de CoT (8 skills en 1), Grounding, i Meta-prompting.
2. **`sec/`**: Seguretat. Anti-al·lucinació, auditoria de codi i *trust-boundaries*.
3. **`arc/`**: Arquitectura. *Dev-tools*, descomposició de tasques i refactorització.
4. **`off/`**: Offline. Resiliència i *offline-first*.
5. **`code/`**: Codi. Optimització termodinàmica i qualitat de codi.
6. **`soc/`**: Sóc de Poble. El "Core" (actriu, empatia), la comunitat i l'incrustació (Shadow DOM).
7. **`obs/`**: Obsidian. Gestió del coneixement local.
8. **`bound/`**: *Bounded action loop*.

## 2. Tractament dels Scripts Auxiliars
Tots els scripts associats a skills (tant de `tooling/` com de `.agents/skills/`) es mouen a un directori `/scripts/` dins de cada *Super-Skill*. A més, exigeix que cada *Super-Skill* tinga un fitxer `METADATA.json` que detalle la seua versió, les skills que ha fusionat i les seues dependències (scripts).

## 3. La "Time Machine" del Cervell
Proposa un script `time-machine.sh` que fa ús de Git de manera transparent per a l'usuari:
- Treballa amb "tags signats" (GPG) per a cada reestructuració.
- Comandes senzilles: `./time-machine.sh rollback v1.0-trellat`.
- Abans de qualsevol rollback, l'script fa una còpia bruta de seguretat en `.agents/backups/`.
- Integració amb hooks de `pre-commit` per validar que no s'eliminen *skills* de fàbrica en anglés (`[EN]`) i generació d'un `CHANGELOG.md` automàtic.

---
*Vibe ens dona un pla de migració totalment detallat, llista per aplicar si ho desitgem. Amb això, ja tenim el ventall complet de propostes (Gemini, Copilot, Grok i Vibe) per a confeccionar el Pla d'Implementació Mestre.*
