---
estat: "registre_proposta"
tipus: "acta"
---

# ACTA: PROPOSTA DE REESTRUCTURACIÓ DEL CERVELL (PERPLEXITY)

**Data:** 24 d'agost de 2026 (15:57)

Perplexity aporta una visió extremadament enginyeril i de processos, basant-se en l'inventari i scripts del bundle. L'objectiu és separar clarament governança, raonament, arquitectura i integracions.

## 1. El Mapa Arquitectònic Proposat
Utilitza una taxonomia amb prefixos descriptius molt clars (18 *skills* finals):
- **`cog-`**: Cognició (context, evidència, raonament, prompting). Ex: `cog-reasoning-planning`.
- **`sec-`**: Seguretat i mutació (trust-safety, adversarial, safe-mutation).
- **`arc-`**: Arquitectura (pedra-seca, offline, performance).
- **`int-`**: Integracions de domini (workflow Sóc de Poble, civic, obsidian).
- **`ops-`**: Operacions (consola termodinàmica, graf).
- **`ux-`**: Experiència (rural empathy).

## 2. Tractament dels Scripts Auxiliars
A diferència de les altres IAs que posaven els scripts dins de la carpeta `.agents/skills/`, Perplexity exigeix **separació total d'estructures**: les *skills* només descriuen comportament, mentre que l'execució passa a `/tooling/`. Proposa una estructura independent per a l'executiu:
```
tooling/
├── brain/
├── gates/
├── time-machine/
├── wiki/
└── generators/
```
Cada *skill* ha de contindre un `tooling-map.md` que referencie quins scripts utilitza.

## 3. La "Time Machine" del Cervell
Dissenya un sistema de 3 anells:
1. **Snapshots Automàtics (Git privat):** Usa un índex Git separat (ex. `refs/sdp/estela`) que no altera l'espai de treball, basant-se en l'script existent `estela.sh`.
2. **Manifest per Skill:** Cada còpia genera un manifest JSON per detectar canvis, eliminacions o inconsistències de hash.
3. **Rollback Selectiu:** El restabliment exigeix confirmació humana, *dry-run* previ i només afecta l'abast (`scope`) seleccionat, sense fer mai un `git reset --hard` global i silenciós.

## 4. El "Gate" de Regressió
Afig un llistat de 14 passos obligatoris (i 7 criteris de bloqueig automàtic) abans d'acceptar la nova arquitectura al cervell. Qualsevol *skill* traduïda bloqueja el procés.

---
*Perplexity aposta per separar completament el "Cervell" (les regles, .agents/skills/) del "Múscul" (l'executiu, tooling/). A més, la seua Time Machine és la més refinada, aprofitant el Git però de forma invisible amb referències separades (estela).*
