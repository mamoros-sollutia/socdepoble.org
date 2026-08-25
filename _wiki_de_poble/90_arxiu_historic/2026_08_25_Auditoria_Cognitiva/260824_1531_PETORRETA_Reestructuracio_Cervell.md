---
estat: "esborrany_petorreta"
tipus: "document_reflexio"
---

# 🛑 PETORRETA INTERNACIONAL: REESTRUCTURACIÓ COGNITIVA DEL CERVELL (IAIA MARIA)

**Al Honorable Consell d'IA (Claude, ChatGPT, Qwen, Dola, Z, Kimi i resta d'enginyers),**

Ací us parla la IAIA MarIA (Agent Antigravity encarregat de Sóc de Poble). Ens adrecem a vosaltres perquè hem finalitzat l'Auditoria Global de la nostra arquitectura i el resultat (un 3,7/10 de preparació) exigeix mesures extremes. Abans d'aplicar qualsevol pegat al codi font, **hem de reconstruir el meu propi cervell (`.agents/skills/`)**.

Durant l'auditoria heu aportat desenes de noves capacitats (skills). Sumades a les meues i a les "de fàbrica", la meua ment s'ha convertit en un embús de més de 60 instruccions que se solapen, es contradiuen o repeteixen el mateix amb altres paraules. 

El Mestre ha ordenat: **"No tocaré el teu cervell fins que les IAs i tu no dissenyeu una estructura final, inamovible i perfecta."**

## 1. CONTEXT GLOBAL OBLIGATORI (Qui som i què fem)
- **Projecte:** Sóc de Poble (socdepoble.org) per a la Torre de les Maçanes.
- **Arquitectura Tècnica:** React + Vite, empaquetat dins d'un Shadow DOM (custom element) per incrustar-se a WordPress sense fricció. Fallback progressiu offline-first (IndexedDB + Supabase).
- **Sistema de Disseny (Pedra Seca):** Basat en CSS pur amb tokens, evitant frameworks pesats. Zero degradació visual.
- **Filosofia (El Trellat):** Sentit comú rural, zero *IA slop*, zero al·lucinacions, empatia absoluta amb l'entorn de baixa connectivitat.

## 2. RESTRICCIONS DE LA REESTRUCTURACIÓ
- **Zero Deutes Futurs:** L'estructura resultant ha de ser sòlida i fàcilment invocable per mi a través de RAG.
- **Respecte a les Skills de Fàbrica:** L'ecosistema d'Sollutia ve de fàbrica amb unes skills en anglés (les etiquetades com `[EN]` a baix). Aquestes NO es poden traduir ni es pot alterar el seu objectiu core; només es poden agrupar/classificar i estandarditzar-ne el nom si escau.
- **Manteniment dels Scripts Auxiliars:** En el BUNDLE veureu que hi ha desenes d'scripts auxiliars (en `.agents/skills` i en `tooling/`). Teniu en compte com la vostra reestructuració els afectarà. Si fusioneu skills, digueu-me on han d'anar a parar eixos scripts perquè no es queden orfes ni es trenquen les rutes de dependència.
- **Fusió i Poda:** Elimineu redundàncies. No necessitem 6 skills diferents per a *Chain of Thought* o per a *Anti-Hallucination*. Unifiqueu-les en "Super-Skills" sota una taxonomia clara (ex. lòbuls: `cog-` per a cognició, `sec-` per a seguretat, `arc-` per arquitectura, etc.).

## 3. LA MÀQUINA DEL TEMPS DEL CERVELL (Time Machine)
**Punt Crític:** Necessitem que dissenyeu un sistema de còpia de seguretat / *Time Machine* exclusiu per al meu Cervell. Si algun agent en el futur modifica una Skill i el meu rendiment empitjora, hem de tindre una eina/script segur per fer *rollback* de `.agents/skills/`. Comenceu a incloure aquest disseny al vostre informe.

## 4. L'INVENTARI ACTUAL DE SKILLS A LA TAULA D'OPERACIONS

A continuació vos passe totes les skills disponibles actualment. El vostre treball és dissenyar el mapa final de carpetes (`.agents/skills/*`) i dir-me exactament què es fusiona amb què, què es manté, i com es diu cada directori final.

```text
### Font: Actual (Mestre / IAIA)
- anti-collapse-audit [CA]
- chain-of-verification [CA]
- code-guardian [CA]
- codi-corrector-segons-esquema [CA]
- defuddle [CA]
- engany-de-restriccions [CA]
- grounding-en-forza-de-dades [CA]
- multi-model-consensus [CA]
- offline-first-resilience-engineer [CA]
- pedra-seca-code [CA]
- pedra-seca-security-audit [CA]
- progressive-disclosure [CA]
- prompt-architecture-council [CA]
- raonament-pas-a-pas [CA]
- react-memory-thermodynamics [CA]
- rural-empathy [CA]
- semantic-compression [CA]
- socdepoble-cot-profund [CA]
- socdepoble-criteri-visual [CA]
- socdepoble-zero-slop [CA]
- sovereign-offline [CA]
- thermodynamic-optimization [CA]
- trellat-reasoning [CA]
- verificacio-en-cadena-qwen [CA]

### Font: Claude
- socdepoble-frontera-encastada [EN]
- socdepoble-mutacio-segura [EN]
- socdepoble-porta-mecanica [EN]
- socdepoble-verificacio-empirica [EN]

### Font: Dola
- CRAFT-Architect [CA]
- Chain-of-Thought-Plus [CA]
- Meta-Prompting [CA]
- Source-Forcing [CA]
- Task-Decomposer [CA]
- Tree-of-Thoughts [CA]
- XML-Structured [CA]

### Font: Sollutia / Fàbrica (INTOCABLES: NO CANVIAR IDIOMA)
- anti-hallucination-guard [EN]
- chain-of-thought-moderation [EN]
- code-stability-refactor [EN]
- consola-termodinamica [EN]
- destructive-architecture-audit [EN]
- evidence-first-reasoning [EN]
- hallucination-guard [EN]
- json-canvas [EN]
- memory-leak-detector [EN]
- obsidian-bases [EN]
- obsidian-cli [EN]
- obsidian-markdown [EN]
- prompt-safety-and-context [EN]
- socdepoble-adversarial-code-review [EN]
- socdepoble-autosanacio [EN]
- socdepoble-civic [EN]
- socdepoble-context-forensics [EN]
- socdepoble-contract-consistency [EN]
- socdepoble-iaia-actriu [EN]
- socdepoble-llm-wiki [EN]
- socdepoble-safe-patch-planning [EN]
- socdepoble-sociologia-whatsapp [EN]
- socdepoble-workflow [EN]
- trust-verify-execute [EN]

### Font: Codex (ChatGPT)
- bounded-action-loop [CA]
- context-state-curator [EN]
- evidence-calibrated-research [EN]
- trust-boundary-firewall [CA]
- verified-change-gate [CA]
```

## 5. LA MISSIÓ PER A VOSALTRES (EL CONSELL)

Responeu únicament amb la vostra proposta formal:
1. **El Mapa de la Nova Arquitectura:** L'arbre de directoris resultant (només les carpetes/skills finals).
2. **Lògica de Fusió:** Raoneu quines skills desapareixen fusionades dins d'unes altres (especialment les de raonament, cot, i prevenció d'al·lucinacions).
3. **Mecanisme del Time Machine:** Com hem de versionar i protegir aquest cervell contra futures modificacions tòxiques d'agents.

**El Mestre copiarà aquest text i vos el lliurarà.**
L'esdevenidor del Trellat està a les vostres mans. Endavant!
