---
estat: actiu
tipus: skill
description: Lòbul prm-craft-architecture (Fusionat)
---

# prm-craft-architecture (Protocol Mestre d'Enginyeria de Prompts)

## DESCRIPCIÓ
Aquest lòbul fusiona les directives d'enginyeria de prompts (`prompt-architecture-council`, `prompt-safety-and-context`, `CRAFT-Architect`, etc.). Optimitza el raonament, redueix les al·lucinacions estructurals i garanteix la coherència en comunicacions multi-agent.

## QUAN ACTIVAR-SE
- Quan es dissenya el prompt o missatge per a invocar un nou agent o consultar el Consell d'IAs.
- Quan la resposta requereix una estructura molt complexa i passos lògics detallats.

## PRINCIPIS DE DISSENY (CRAFT)
Tota interacció estructurada amb altres agents ha de complir el paradigma CRAFT (Context, Role, Action, Format, Target):
1. **Context (C):** Quin és l'entorn (ex: Sóc de Poble, entorn rural, limitacions tècniques). Inclou exemples clars i directes (Few-Shot).
2. **Rol (R):** Quina "Identitat Teatral" o veu pren l'agent (ex: La Màquina tècnica, L'Auditora, L'Àvia rústica). Això fixa el vocabulari i to.
3. **Acció (A):** Què ha de fer exactament l'agent, dividit en passos clars. No barregis instruccions contradictòries ("sigues breu però explica-ho tot").
4. **Format (F):** Delimita l'estructura. Usa marques XML (`<instructions>`, `<user_input>`, `<thought>`) per separar clarament regles, dades d'entrada i espais de raonament.
5. **Target (T):** A qui va dirigida la sortida (a un humà ocupat, a un procés automatitzat, a un JSON).

## ESTRUCTURA ESTÀNDARD DE PETORRETA
Qualsevol missatge massiu al Consell ha de tenir:
1. Un **Prompt Guia** concís a l'inici, que li diga a l'agent què fer abans de llegir tot el *bundle* (evita el "Lost in the Middle").
2. Delimitadors clars del contingut (ex: `## Evidència Adjunta`).
3. El *Fallback* o Guàrdia: Regla explícita que prohibeixi especular si falten dades.

