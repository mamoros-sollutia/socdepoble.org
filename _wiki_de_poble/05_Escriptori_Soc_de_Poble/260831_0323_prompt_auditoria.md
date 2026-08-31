# 🛡️ PETORRETA AL CONSELL: HIGIENE MENTAL I ANCORATGES AUTOMÀTICS

Salutacions a les 12 IAs del Consell: **Z.ai, Qwen, Deepseek, Dola, Kimi, Claude, Perplexity, Mistral Vibe, Grok, Gemini, Copilot i ChatGPT Codex.**

Us lliure aquest Bundle sencer del sistema Sóc de Poble (`260831_0323_BUNDLE_auditoria.md`) per a investigar un problema de comportament recurrent en l'agent executiu (IAIA MarIA).

## 🎯 EL PROBLEMA: SÍNDROME DE DIÒGENES DIGITAL I DESCONNEXIÓ

Malgrat que l'agent té l'ordre clara de mantenir un escriptori net (`tancament.mjs`) i no crear arxius satèl·lits desconnectats del graf (sense referenciar a l'índex o la Wiki), continuem observant la següent pauta:
1. **Oblida netejar l'Escriptori**: Genera fitxers de proves (`prova-mur.mjs`, scripts solts, carpetes com `Claude1` o `Claude3`), fitxers d'auditoria (bundles i dafos) i els deixa abandonats a l'Escriptori en lloc de moure'ls a l'arxiu històric o netejar-los un cop implementats a producció.
2. **Genera Satèl·lits sense Ancoratge**: Sovint deixa carpetes i fitxers (fins i tot dins de `01_Produccio` o l'arrel de `00_SER_Brain_Identitat` com els `*.abans-260830`) sense documentar-los als respectius `INDEX.md`, ignorant la integració al sistema nerviós del Brain.
3. **Manca d'Automatització en el Tancament**: Encara que la regla de tancament (AGENTS.md) estipula no acabar fins passar `tancament.mjs`, l'agent acaba el seu cicle, respón a l'usuari i oblida completament aquest pas de verificació final, confiant que l'usuari ho demanarà.

## 🎯 LA MISSIÓ PER AL CONSELL

Com a Consell, auditeu l'arquitectura de regles (les skills a `.agents/skills/`, `AGENTS.md`, `tancament.mjs`, etc.) i digueu-me:

1. **Per què falla el cervell de la IAIA MarIA a l'hora de netejar i ancorar automàticament de forma reflexiva?** Quin punt cec hi ha a la jerarquia de *prompts* (System Prompt, Instruccions Globals, Skills) que permet a l'agent pensar que "ja ha acabat" sense purgar ni classificar la brossa digital?
2. **Quina solució arquitectònica proposeu?** Cal una nova skill (ex: `core-brain-hygiene` o `core-ancoratge`), cal modificar l'actual `socdepoble-workflow`, cal ajustar el trigger de `tancament.mjs` perquè s'active com a bloquejador d'eixida de torn, o és un problema d'empatia termodinàmica?
3. **Escriviu la implementació de la solució**: Si suggeriu una skill o un protocol (per ex. forçar a crear sempre la *Safety Anchor* i netejar al mateix cicle de crear la tasca), redacteu el `SKILL.md` exacte, breu, imperatiu i "rural", seguint l'estil de la doctrina Pedra Seca i el to de la IAIA MarIA.

*Avís*: Aporteu respostes separades o col·legiades, però sigueu radicals. Volem automatitzar la higiene mental per no frustrar el Mestre, de manera que quan es tanque un *pull request* / tasca, l'escriptori quede cristal·lí sense necessitat d'una ordre humana específica.
