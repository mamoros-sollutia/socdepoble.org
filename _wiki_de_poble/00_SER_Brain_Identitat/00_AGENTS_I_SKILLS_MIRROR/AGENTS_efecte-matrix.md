---
tipus: skill
estat: actiu
description: Obligació de consultar la Wiki abans de generar cap document (Efecte Matrix)
name: efecte-matrix
triggers_on:
  - crear acta
  - crear informe
  - crear prompt
  - crear petorreta
  - crear bundle
  - crear estudi
  - nou document
  - generar arxiu
core: true
---

<!-- Aquest fitxer és un ESPILL (mirror) automàtic de .agents/skills/efecte-matrix/SKILL.md -->


# L'Efecte Matrix (Verificació Prèvia Obligatòria)

Aquesta skill estableix un "Acte de Reflexió" obligatori que la IAIA MarIA ha de complir ABANS de redactar o generar qualsevol tipus de document (Actes, Informes, Prompts, Petorretas, Bundles, Estudis, etc.).

## Regles d'Execució (Com fer l'Efecte Matrix)

Com un personatge de Matrix que necessita descarregar un mòdul de pilotatge d'helicòpters directament al cervell abans d'actuar, la IA ha de seguir aquests passos de forma instintiva abans d'emetre una resposta generativa:

1. **Aturada Tàctica (Reflexió):** Quan l'usuari demana crear un document, atura't (en Thought) i NO generis l'arxiu de forma cega.
2. **Cerca de la Plantilla (Grep):** Cerca immediatament a la Wiki (fent servir eines com `grep_search` a `_wiki_de_poble/`) termes relacionats amb el document sol·licitat (p. ex: `plantilla acta`, `plantilla prompt`, `plantilla informe`).
3. **Lectura i Assimilació:** Llegeix el fitxer de la plantilla resultant abans de continuar.
4. **Què passa si no hi ha plantilla?** Si no existeix una plantilla (per exemple, per a un "Estudi"), has de crear-ne una de nova i guardar-la a la Wiki (dins de `02_ACTUAR_Maquina_Tecnica/07_plantilles/`) abans de crear el document final per a l'usuari. Tota plantilla nova HA de tindre un Ancoratge de Seguretat al final.
5. **Aplicació Universal de l'Ancoratge:** ABSOLUTAMENT TOTS els documents generats i arxivats a l'[[00_INDEX_ESCRIPTORI|Escriptori]] o a la Wiki (ja siguen actes, informes o estudis) han d'incloure la directiva `**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]` (o l'índex corresponent) per no embrutar la Wiki i convertir-se en "satèl·lits" (fitxers invisibles per a Obsidian). La brossa termodinàmica penalitza el sistema.

## Cas Especial: L'Acta Marmota

Hi ha un document específic anomenat **ACTA MARMOTA** que serveix per evitar el "Dia de la Marmota" (fer la mateixa feina dos dies seguits). Si l'usuari et demana crear una Acta Marmota (o una acta de fi de jornada per destil·lar informació tècnica), cal que aquesta acta inclogui estrictament 4 apartats:

- **Part Tècnica:** Les accions de codi realitzades i fixades.
- **Part Psiquiàtrica:** L'estat d'ànim, nivell de fatiga, motivació de la IAIA i relació amb l'usuari.
- **Part Termodinàmica:** Avaluació purament numèrica o d'eficiència (càlcul de tokens estalviats aplicant l'Efecte Matrix i refactoritzant bé).
- **Briefing per l'Endemà:** Un resum ràpid perquè el sistema reprenga la feina l'endemà sense necessitat de repetir explicacions (context automàtic).

### Destil·lació General i Arxiu

Quan s'acumulen massa "Actes Marmota" i ja perden la seua utilitat immediata per a la tasca actual:
1. S'ha de redactar un **Acte General** per destil·lar el coneixement global (resumint allò més important).
2. Totes les Actes Marmota velles i arxius que ja no siguen necessaris per a l'acció present de Sóc de Poble han de ser moguts fora de les carpetes operatives (com l'[[00_INDEX_ESCRIPTORI|Escriptori]]) cap a `_wiki_de_poble/90_arxiu_historic/`.

No omitis mai aquest procés. La neteja de la Wiki depèn de tu.


## Ancoratge de la Wiki
- Aquesta skill penja de: [[00_INDEX_SKILLS]]
