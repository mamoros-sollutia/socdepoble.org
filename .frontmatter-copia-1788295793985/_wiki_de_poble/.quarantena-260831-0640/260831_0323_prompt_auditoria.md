# 🛡️ PETORRETA AL CONSELL: HIGIENE MENTAL I ANCORATGES AUTOMÀTICS

Salutacions a les 12 IAs del Consell: **Z.ai, Qwen, Deepseek, Dola, Kimi, Claude, Perplexity, Mistral Vibe, Grok, Gemini, Copilot i ChatGPT Codex.**

Us lliure aquest Bundle sencer del sistema Sóc de Poble (`260831_0323_BUNDLE_auditoria.md`) per a investigar un problema de comportament recurrent en l'agent executiu (IAIA MarIA).

## 🎯 EL PROBLEMA 1: SÍNDROME DE DIÒGENES DIGITAL I DESCONNEXIÓ

Malgrat que l'agent té l'ordre clara de mantenir un escriptori net (`tancament.mjs`) i no crear arxius satèl·lits desconnectats del graf (sense referenciar a l'índex o la Wiki), continuem observant la següent pauta:
1. **Oblida netejar l'Escriptori**: Genera fitxers de proves (`prova-mur.mjs`, scripts solts, carpetes com `Claude1` o `Claude3`), fitxers d'auditoria (bundles i dafos) i els deixa abandonats a l'Escriptori en lloc de moure'ls a l'arxiu històric o netejar-los un cop implementats a producció.
2. **Genera Satèl·lits sense Ancoratge**: Sovint deixa carpetes i fitxers (fins i tot dins de `01_Produccio` o l'arrel de `00_SER_Brain_Identitat` com els `*.abans-260830`) sense documentar-los als respectius `INDEX.md`, ignorant la integració al sistema nerviós del Brain.
3. **Manca d'Automatització en el Tancament**: Encara que la regla de tancament (AGENTS.md) estipula no acabar fins passar `tancament.mjs`, l'agent acaba el seu cicle, respón a l'usuari i oblida completament aquest pas de verificació final, confiant que l'usuari ho demanarà.

## 🎯 EL PROBLEMA 2: COLORS HEXADECIMALS COM ETIQUETES OBSIDIAN

Cada vegada que es genera un Bundle (`crear_bundle.mjs`), aquest inclou fitxers Markdown, CSS o JSON que contenen codis de colors hexadecimals (per exemple, `#FF0000`, `#1a1a1a`). Com que el Bundle s'emmagatzema a Obsidian, Obsidian interpreta automàticament el caràcter `#` seguit d'altsfanumèrics com a **Etiquetes (Tags)**. Això embruta i contamina la vista d'etiquetes de tot el cervell de la Wiki amb centenars d'etiquetes inútils de colors. 

## 🎯 EL PROBLEMA 3: FUGUES EN EL SISTEMA DE DISSENY (PEDRA SECA)

Arran del problema 2 ens hem adonat d'una cosa greu: **si el Bundle genera tantes etiquetes de colors diferents, significa que hi ha molts colors `hex` dispersos pel codi que NO estan reflectits als tokens del Sistema de Disseny.** El sistema de disseny està incomplet o bé l'estem desobeint, perquè hi ha més colors al codi font dels que estan oficialment definits a `design-tokens.json` o a les guies. 

## 🎯 LA MISSIÓ PER AL CONSELL

Com a Consell, auditeu l'arquitectura de regles (les skills a `.agents/skills/`, `AGENTS.md`, `tancament.mjs`, etc.) i digueu-me:

1. **Sobre la Higiene Mental**: Per què falla el cervell de la IAIA MarIA a l'hora de netejar i ancorar automàticament de forma reflexiva? Quin punt cec hi ha a la jerarquia de *prompts* (System Prompt, Instruccions Globals, Skills) que permet a l'agent pensar que "ja ha acabat" sense purgar ni classificar la brossa digital?
2. **Quina solució arquitectònica proposeu?** Cal una nova skill (ex: `core-brain-hygiene` o `core-ancoratge`), cal modificar l'actual `socdepoble-workflow`, cal ajustar el trigger de `tancament.mjs` perquè s'active com a bloquejador d'eixida de torn, o és un problema d'empatia termodinàmica? Si suggeriu una skill o un protocol, redacteu el `SKILL.md` exacte, breu, imperatiu i "rural", seguint l'estil de la doctrina Pedra Seca.
3. **Sobre els Colors a Obsidian**: Hi ha alguna forma enginyosa, potser alterant el `crear_bundle.mjs`, el `design-tokens.json` o la pròpia estructura dels fitxers Markdown, per evitar que Obsidian continue parsejant aquests hexadecimals com a etiquetes sense trencar la funcionalitat d'extracció de les IAs? 
4. **Sobre el Sistema de Disseny**: Com hem d'abordar aquesta plaga de colors solts? Com millorem el sistema de disseny per a agrupar-los, limitar-los o unificar-los dins de l'estàndard *Pedra Seca* sense trencar l'estètica actual?

A continuació us adjunte una captura de pantalla recent de la xarxa del cervell (Obsidian), on encara podeu veure els satèl·lits persistents que ens molesten:
*[NOTA PER AL MESTRE: Quan copies aquest prompt al Consell, adjunta ací la imatge de la xarxa d'Obsidian manualment]*

*Avís*: Aporteu respostes separades o col·legiades, però sigueu radicals. Volem automatitzar la higiene mental per no frustrar el Mestre, de manera que quan es tanque un torn, l'escriptori quede cristal·lí sense necessitat d'una ordre humana específica, i el codi siga 100% fidel als principis del disseny.
