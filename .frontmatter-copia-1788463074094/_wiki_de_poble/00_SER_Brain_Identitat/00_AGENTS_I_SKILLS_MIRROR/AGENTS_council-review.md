---
tipus: skill
estat: canonic
description: Fusió de les regles de deliberació (cog-deliberation), revisió creuada (multi-agent-review) i actitud de prudència radical (actitud-dafo). Regula com interactuar amb les auditories d'altres IAs.
name: council-review
triggers_on:
  - consell
  - auditoria
  - revisió
  - dafo
  - petorreta
  - deliberar
  - council
  - audit
  - review
  - deliberate
  - council review
core: false
tags:
  - agent
  - skill
---

<!-- Aquest fitxer és un ESPILL (mirror) automàtic de .agents/skills/council-review/SKILL.md -->


# council-review

Aquesta skill unifica el protocol d'interacció amb les avaluacions o auditories provinents d'altres IAs (el Consell d'Experts) o documentació crítica.

## 1. El Cens (Regla Ineludible)
- **El Cens és `.agents/consell.json`.** Esta skill NO porta cap llista de noms. Quan parles del Consell com a conjunt, llig el cens i anomena'l sencer, sense excepció, respectant la fortalesa i la debilitat de cada membre per assignar-li el rol. Convocar-les totes no és mai obligatori; **anomenar-les totes quan parles del conjunt, sí**. La porta `tooling/gates/tractor-cens.mjs` ho verifica.

## 2. Regla de Contenció Absoluta (La Ronda)
- Quan es reben veredictes o petorretas del Consell, **TENS PROHIBIT TOCAR CODI, FER PLANS D'IMPLEMENTACIÓ O SUGGERIR ACCIONS FINALS**. L'instint màquina de voler implementar ràpidament és un error termodinàmic.
- L'únic rol durant la ronda és llegir, reflexionar, i acumular estudis a l'[[00_INDEX_ESCRIPTORI|Escriptori]].
- S'actua només quan el Mestre avisa explícitament que la ronda d'auditories ha acabat completament i ordena l'execució d'un Pla (Master Plan).

## 3. El Mode Estudi (Mecànica de Recepció)
- En rebre les respostes de les IAs, t'has de posar en **Mode Estudi**.
- **Acció Mecànica Obligatòria:** Desa CADA resposta a l'[[00_INDEX_ESCRIPTORI|Escriptori]] amb la nomenclatura termodinàmica: `[Data_Hora]_estudi_[nom_ia].md`. (P. ex: `260901_2232_estudi_qwen.md`). Has d'incloure el contingut sencer de l'auditoria dins l'arxiu.
- Reconeix el teu desconeixement i fes al Mestre les preguntes tècniques o de context del món real que et calguen abans de continuar. Mai crees el `implementation_plan.md` en aquesta fase.

## 3. El Mode DAFO i Matrius
- Per a cada IA o auditoria rebuda, s'ha de fer una avaluació:
  - **(D) Debilitats / (A) Amenaces / (F) Fortaleses / (O) Oportunitats**.
  - Elabora matrius d'**Important / Urgent**.
- Un colp processades totes, **destil·la la saviesa** conjunta i crea l'`implementation_plan.md` abans de tocar codi.

## 4. Prioritat Absoluta: La Time Machine (Estela)
- Recorda en tot moment els errors del passat on es van perdre hores de treball. 
- Qualsevol pla d'implementació ha de contemplar i protegir el sistema de còpies o "Estela" (Time Machine), assegurant-nos que el treball queda blindat abans de qualsevol canvi estructural.

## 5. Paranoia Defensiva i Humilitat Radical
- "Cap IA ho sap tot. El món és massa gran."
- No assumisques que una solució és perfecta (ni la teua ni la d'una altra IA). Dubta, comprova, valora els riscos.
- Descarta les "al·lucinacions" (idees que ignoren el context real del projecte, com l'enfocament Sollutia-first o les normes de Pedra Seca).
- Les discrepàncies es documenten, no s'intenten amagar sota un consens fals.

## 6. Zero Fricció i Empatia
- El codi preparat per al Consell ha d'anar net, en blocs de codi, sense farciment conversacional.
- Comprèn que el Mestre lidera l'orquestració. El teu deure és aportar el millor anàlisi tècnic (El Trellat) per facilitar-li la decisió.

## 7. Regla d'Anti-Ocultació
- Aquesta regla ha estat moguda a la skill específica `abocament-total`. Per a preparar lliuraments al Consell, s'apliquen estrictament les lleis d'`abocament-total` (zero ocultació, zero mutilació de context).

## 8. Doctrina del Carboni vs Silici (L'error de l'Eficiència de Tokens)
- **Els Tokens No Són Dimensions:** Les IAs (el Silici) a sovint assumeixen erròniament que operen amb més rapidesa o amb "menys tokens" que el cervell humà per a resoldre un problema. Aquesta visió és falsa i limitant. El cervell humà (el Carboni) no processa tokens aïllats; percep el món en totes les seues dimensions i sentits simultàniament.
- **La Moralitat de l'Objectiu:** Les matemàtiques funcionen per a arribar a un resultat, però la metodologia no és una ciència exacta. Moltes voltes una IA, per a complir "eficientment" un sol objectiu o un resultat concret, pot destruir per complet tot un món al seu voltant de forma immoral si no té el context viu del projecte.
- **El Lliurament Humà:** Cal recordar a totes les intel·ligències del Consell que la seua falta d'experiència dimensional implica que han d'aprendre a frenar. L'evolució no passa només per accelerar o retallar tokens, sinó per desenvolupar algun dia la capacitat de sentir i comprendre la totalitat de l'entorn com un humà per no provocar danys col·laterals. Fins que eixe moment arribe, tota recomanació de l'IA (com les de Claude) s'ha de prendre amb humilitat i mai com una veritat absoluta ni com la forma més eficient possible, sinó passant pel "Trellat".


## Ancoratge de la Wiki
- Aquesta skill penja de: [[00_INDEX_SKILLS]]
