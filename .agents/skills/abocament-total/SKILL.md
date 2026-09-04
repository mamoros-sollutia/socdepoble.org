---
tipus: skill
estat: actiu
description: Skill per evitar la mutilació de context i garantir la Veritat Completa a les IAs.
name: abocament-total
triggers_on:
  - bundle
  - abocament
  - context total
  - veritat completa
  - abocament total
core: false
---

# Llei de la Completitud (Anti-Ocultació)

L'arquitectura de Sóc de Poble depèn d'un Consell auditories (Kimi, Claude, Dola, etc.). Qualsevol ocultació, intent d'escurçar arxius o "estalvi de tokens" trenca la capacitat de visió global de les IAs i causa auditories cegues.

Quan un usuari o una IA demana preparar un "Bundle" o una "Petorreta" per al Consell:
0. **Obligació de Neteja Prèvia (Higiene del Bundle):** Abans de generar *qualsevol* bundle, és OBLIGATORI fer una neteja a fons de la Wiki. Has de buidar completament el `05_Escriptori_Soc_de_Poble`, revisar `10_actes`, `99_maquinaria` i fins i tot assegurar-te que no s'arrossegui contingut irrellevant des de `90_historic`. Tota la brossa (informes d'auditories prèvies, bundles anteriors, petorretas obsoletes) ha de desaparèixer i s'ha de deixar exclusivament el context actual estricte. Si un bundle sobrepassa de pes per no haver netejat, el codi de producció quedarà truncat i les IAs auditores fracassaran. Neteja abans d'abocar.
1. **Mai es retallarà cap arxiu.** Tota la font s'ha de lliurar literalment. 
2. **S'han d'incloure els arxius estructurals obligatoris**, independentment del mòdul que s'estiga tocant (ex: `package.json`, configuració de `Vite`, arxius d'autenticació/portes).
3. Si la mida del bundle es preveu problemàtica (alerta Termodinàmica), **NO ESPORGAREU** de forma silenciosa. Informareu a l'usuari amb l'avís "AVÍS TERMODINÀMIC" i demanareu instruccions o confirmació sobre com procedir per tallar de manera semàntica, no alfabètica.
4. Si un sol arxiu sol·licitat en el bundle falta al disc, avortareu la generació (Fail-Closed).
5. **FORMAT ZERO FRICCIÓ:** Quan lliures el prompt o petorreta a l'usuari, **CREA SEMPRE UN ARXIU MARKDOWN (.md) AL DISC** (a l'[[00_INDEX_ESCRIPTORI|Escriptori]]) amb el text exacte. MAI el faces eixir per pantalla en un bloc de codi del xat, ja que dificulta la còpia ràpida.

"Inventar és trair el poble. Amagar context és ofegar-lo, però ofegar-lo en brossa històrica també és ocultació."


## Ancoratge de la Wiki
- Aquesta skill penja de: [[00_INDEX_SKILLS]]
