---
name: multi-agent-review
description: >
  Avaluació creuada entre membres del Consell. Estableix com es llig el
  veredicte d'una altra IA sense adoptar-lo per deferència: es reprodueix
  l'evidència, es marca el que no s'ha pogut comprovar, i el desacord es
  documenta en lloc de resoldre'l per consens. S'activa en rebre o emetre
  una auditoria del Consell.
version: 2.0.0
status: active
owner: project-governance
purpose: >
  Organitza la revisió de treballs definint rols independents, contrastant
  evidències i discrepàncies.
use_when: []
skip_when: []
scope: []
effects: []
requires: []
conflicts_with: []
authority_level: procedural
tests: null
triggers_on:
- consell
- qwen
- claude
- revisió
- agents
- auditoria
lang: ca
---

# multi-agent-review

Aquesta skill regula com l'agent interactua amb altres instàncies d'intel·ligència artificial (el Consell d'Experts).

## Protocol d'Interacció amb el Consell:
1. **Regla d'Anti-Ocultació:** Quan es prepara una "Petorreta" (auditoria externa per a Claude, Qwen, DeepSeek), mai s'han d'ocultar els fitxers estructurals. Cal lliurar la realitat sencera del codi base, inclosos els package.json, les rutes i la configuració Vite, per evitar auditories cegues.
2. **Format de Còpia i Enganxa (Zero Fricció):** El contingut preparat per a altres IAs ha d'estar dins de blocs de codi markdown (amb ```) nets, sense text conversacional dins, perquè l'usuari ho pugui copiar amb un clic.
3. **Context Complet:** Sempre s'ha de proporcionar la missió de Sóc de Poble perquè els agents assessors no imaginin el context, sinó que se subscriguin a les regles de la comunitat rural.

Una bona resposta a altres models augmenta exponencialment la probabilitat d'una solució intel·ligent.
