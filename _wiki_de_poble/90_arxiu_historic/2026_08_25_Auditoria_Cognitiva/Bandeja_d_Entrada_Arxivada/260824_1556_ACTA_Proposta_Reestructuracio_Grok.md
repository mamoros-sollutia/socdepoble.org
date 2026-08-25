---
estat: "registre_proposta"
tipus: "acta"
---

# ACTA: PROPOSTA DE REESTRUCTURACIÓ DEL CERVELL (GROK)

**Data:** 24 d'agost de 2026 (15:56)

Grok (xAI) ha enviat la seua "Petorreta de Resposta" tancada. La seua proposta és molt radical i estructurada, enfocada a reduir dràsticament el nombre de skills de més de 60 a només 22, utilitzant prefixos molt curts i fàcils de recordar.

## 1. El Mapa Arquitectònic Proposat (7 Lòbuls curts)
L'arbre resultant es divideix en directoris curts:
1. **`00_CORE/`**: Identitat de la IAIA (actriu), empatia rural i regles Zero Slop.
2. **`cog/`**: Raonament. Centralitza pràcticament tots els protocols anti-al·lucinació i de cadena de pensament en una sola "Super-Skill" (`cog-reasoning-engine`), a més de la compressió semàntica.
3. **`sec/`**: Seguretat i blindatge de codi (Auditories, tallafocs).
4. **`arc/`**: Arquitectura, resiliència offline, termodinàmica i fuites de memòria.
5. **`visu/`**: El disseny de Pedra Seca i el cànon visual.
6. **`dom/`**: Les especificitats del domini "Sóc de Poble" (campanyes cíviques, WhatsApp, sobirania local).
7. **`tool/`**: Eines com Obsidian i JSON Canvas.

## 2. Tractament dels Scripts Auxiliars
Tots els scripts auxiliars (com `update_universal.py` o eines CSS) es mouen a un directori separat anomenat `tooling/skills-scripts/`, organitzats internament amb les mateixes categories (`visu`, `arc`, etc.). Els scripts que queden orfes van a un subdirectori `_legacy/`.

## 3. La "Time Machine" del Cervell
Proposa crear un directori `_time-machine/` dins del cervell, amb tres eines bàsiques en bash:
- **`snapshot.sh`**: Fa una còpia atòmica de `.agents/skills/` amb `tar`, calcula el hash SHA-256 i deixa un `MANIFEST.json`.
- **`restore.sh`**: Permet rehidratar un snapshot (amb opció obligatòria prèvia de `--dry-run`), creant automàticament una xarxa de seguretat de l'estat just abans de restaurar.
- **Protecció del Sistema**: Cap agent pot editar una *skill* sense haver executat abans l'script de *snapshot*.

---
*Grok aporta el primer mecanisme de Time Machine "baix en greixos", sense Git intern com Copilot, basat purament en Bash i checksums, cosa que sembla molt encertada per a l'esperit de Pedra Seca. A l'espera de possibles aportacions de Dola i Claude (que ja sabem que tardarà 4 hores).*
