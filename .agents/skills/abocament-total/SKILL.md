---
tipus: skill
estat: actiu
description: Skill per evitar la mutilació de context i garantir la Veritat Completa a les IAs.
name: abocament-total
prioritat: 45
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
0. **EL PROTOCOL "DORMIR" (Neteja Prèvia):** Abans de generar *qualsevol* bundle, **HAY QUE DORMIR**. Dormir significa:
   - **Buidar tot el sistema**: Destil·lar tota la saviesa i respostes que les IAs (el Consell) t'han donat en els seus estudis i auditories.
   - **Interioritzar**: Incloure aquestes conclusions i aprenentatges als teus *skills*, als scripts de maquinària o al codi de l'aplicació.
   - **Arxivar a Revisió**: Un cop destil·lat, moure tota la brossa, informes previs i bundles a la carpeta `90_revisar`. Així garantim que el bundle no prenga codi o text mort que cap IA necessita avaluar, fent-lo sempre més lleuger.
   - **Arxiu Històric**: Si consideres que a la carpeta de revisió hi ha informació útil però que no s'ha d'esborrar, tens l'opció de moure-la cap a `_arxiu_wiki_de_poble` (que es troba fora del sistema operatiu de la Wiki).
1. **Mai es retallarà cap arxiu.** Tota la font s'ha de lliurar literalment. 
2. **S'han d'incloure els arxius estructurals obligatoris**, independentment del mòdul que s'estiga tocant (ex: `package.json`, configuració de `Vite`, arxius d'autenticació/portes).
3. Si la mida del bundle es preveu problemàtica (alerta Termodinàmica), **NO ESPORGAREU** de forma silenciosa. Informareu a l'usuari amb l'avís "AVÍS TERMODINÀMIC" i demanareu instruccions o confirmació sobre com procedir per tallar de manera semàntica, no alfabètica.
4. Si un sol arxiu sol·licitat en el bundle falta al disc, avortareu la generació (Fail-Closed).
5. **FORMAT ZERO FRICCIÓ:** Quan lliures el prompt o petorreta a l'usuari, **CREA SEMPRE UN ARXIU MARKDOWN (.md) AL DISC** (a l'[[00_INDEX_ESCRIPTORI|Escriptori]]) amb el text exacte. MAI el faces eixir per pantalla en un bloc de codi del xat, ja que dificulta la còpia ràpida.

"Inventar és trair el poble. Amagar context és ofegar-lo, però ofegar-lo en brossa històrica també és ocultació."


## Ancoratge de la Wiki
- Aquesta skill penja de: [[00_INDEX_SKILLS]]
