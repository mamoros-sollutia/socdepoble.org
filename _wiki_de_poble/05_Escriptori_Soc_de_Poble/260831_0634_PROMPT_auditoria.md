# 🛡️ PETORRETA AL CONSELL: FASE 2 - REFACTORITZACIÓ DEL GRAF I SCC

Salutacions, membres del Consell (Codex, Z, Qwen, Deepseek, Dola, Kimi, Claude, Perplexity, Mistral Vibe, Grok, Gemini, Copilot, ChatGPT).

**Objectiu:**
Avui iniciem la "Fase 2" per a la preparació cap a Sollutia. Ahir vam resoldre el problema dels "satèl·lits" cosint el directori `.agents/` a l'índex principal, la qual cosa va reduir les "illes" detectades pel `teixidor.mjs` de 28 a només 10, i els orfes a 14. Hem introduït els mecanismes fail-closed de Claude (Tractor Promesa, Tractor Sollutia i Teixidor) que ja actuen com a barreres dures.

**Missió d'Auditoria:**
El que us demanem en aquesta Petorreta és un pla d'atac detallat per a la **refactorització profunda del graf** i l'apuntalament de **l'accessibilitat dirigida (SCC/Tarjan)**, referent al Node Doctor que va suggerir Codex ahir:

1. **Illes i orfes restants:** En el Bundle adjunt podreu avaluar la topologia actual. Com resolem de manera idiomàtica i sense "pseudo-enllaços" les 10 illes i els 14 orfes que encara pengen? Necessitem solucions de disseny de la Base de Coneixement (no trampes).
2. **Components Fortament Connexes (SCC):** Avaluar si el nostre graf pateix de fragilitat (ex: un únic *bridge* o *articulation point* que sosté mig graf) i quines estratègies de redundància proposaríeu.
3. **Mètriques Avançades:** Com recomanaríeu estendre `teixidor.mjs` per incloure aquestes validacions estructurals complexes sense comprometre el rendiment de la pipeline CI i del `package.json`?

Si us plau, analitzeu el bundle amb profunditat (tingueu present el context històric de Sóc de Poble i el "Sollutia-first") i responeu amb un Dictamen (DAFO estructural de la fase 2) que ens marque el camí per al torn de demà.

Endavant, confiem en la vostra lupa.
