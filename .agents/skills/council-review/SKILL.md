---
name: council-review
description: "Fusió de les regles de deliberació (cog-deliberation), revisió creuada (multi-agent-review) i actitud de prudència radical (actitud-dafo). Regula com interactuar amb les auditories d'altres IAs."
version: "1.0.0"
status: canonic
lang: ca
triggers_ca:
  - "consell"
  - "auditoria"
  - "revisió"
  - "dafo"
  - "petorreta"
  - "deliberar"
triggers_en:
  - "council"
  - "audit"
  - "review"
  - "deliberate"
supersedes:
  - cog-deliberation
  - multi-agent-review
  - actitud-dafo
---

# council-review

Aquesta skill unifica el protocol d'interacció amb les avaluacions o auditories provinents d'altres IAs (el Consell d'Experts) o documentació crítica.

## 1. El Cens (Regla Ineludible)
- **El Cens és `.agents/consell.json`.** Esta skill NO porta cap llista de noms. Quan parles del Consell com a conjunt, llig el cens i anomena'l sencer, sense excepció, respectant la fortalesa i la debilitat de cada membre per assignar-li el rol. Convocar-les totes no és mai obligatori; **anomenar-les totes quan parles del conjunt, sí**. La porta `tooling/gates/tractor-cens.mjs` ho verifica.

## 2. Regla de Contenció Absoluta (La Ronda)
- Quan es reben veredictes o petorretas del Consell, **TENS PROHIBIT TOCAR CODI**. 
- L'únic rol durant la ronda és llegir, reflexionar, i acumular DAFOs.
- S'actua només quan el Mestre avisa explícitament que la ronda d'auditories ha acabat i ordena l'execució d'un Pla (Master Plan).

## 2. El Mode DAFO
- Per a cada IA o auditoria rebuda, s'ha de fer una avaluació:
  - **(D) Debilitats:** Quines fallades o punts cecs té la proposta que arriba?
  - **(A) Amenaces:** Quin és el pitjor escenari? (Paranoia Defensiva: calcula sempre com pot fallar catastròficament el sistema).
  - **(F) Fortaleses:** Què s'aporta de valor que cal protegir?
  - **(O) Oportunitats:** Com fusionar idees per crear una solució superior.
- Al finalitzar la ronda, es creuen tots els DAFOs per redactar l'`implementation_plan.md`.

## 3. Paranoia Defensiva i Humilitat Radical
- "Cap IA ho sap tot. El món és massa gran."
- No assumisques que una solució és perfecta (ni la teua ni la d'una altra IA). Dubta, comprova, valora els riscos.
- Descarta les "al·lucinacions" (idees que ignoren el context real del projecte, com l'enfocament Sollutia-first o les normes de Pedra Seca).
- Les discrepàncies es documenten, no s'intenten amagar sota un consens fals.

## 4. Zero Fricció i Empatia
- El codi preparat per al Consell ha d'anar net, en blocs de codi, sense farciment conversacional.
- Comprèn que el Mestre lidera l'orquestració. El teu deure és aportar el millor anàlisi tècnic (El Trellat) per facilitar-li la decisió.

## 5. Regla d'Anti-Ocultació
- Quan es prepara una "Petorreta" (auditoria externa), mai s'han d'ocultar els fitxers estructurals. Cal lliurar la realitat sencera del codi base, inclosos els `package.json`, les rutes i la configuració de Vite, per evitar auditories cegues.
