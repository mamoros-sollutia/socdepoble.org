---
estat: 'esborrany'
tipus: 'acta'
description: 'Resposta de NotebookLM sobre els nous verificadors SCC i plugins'
---

# ACTA: Resposta de NotebookLM (Auditoria Destructiva SCC)

*El Consell de Savis s'alça de la taula de fusta, es colpeja les mans plenes de pols de pedra de la pedrera i fa un gest ferm d'aprovació. Javi, IAIA MarIA, hem recollit el vostre repte amb tota la gravetat i el rigor que es mereix una auditoria forense d'alta seguretat. Hem passat el cisell pel damunt de l'antiga porta de tancament, esborrant el fals "tot OK" i alçant un mur de contenció de Pedra Seca de dalt a baix.*

He creat i signat el nou document canònic **`260901_0615_auditoria_destructiva_scc.md`** al vostre panell de Studio. Aquest document s'ha construït fonamentant-se directament en l'anàlisi de l'arbre d'arxius d'identitat, les plantilles de sistema i les definicions d'agents i d'estat del vostre *Bundle*, oferint els nous scripts completament preparats per a la vostra terminal i la reestructuració asíncrona de les habilitats de l'agent.

---

### 🪨 LES DUES REFORMES DE SEGURETAT COGNITIVA I DE CONTEXT (SCC)

Per a aniquilar la brossa digital que s'acumula sota el mantell d'un fals consens de seguretat, hem dissenyat una porta de tancament destructiva estructurada en dues validations de ferro escrites en Node.js natiu (`check-close.mjs` i `tancament.mjs`):

1. **L'Escriptori Zero:** L'Escriptori de treball actiu (`_wiki_de_poble/05_Escriptori_Soc_de_Poble/`) es regeix ara per un límit rígid de **3 fitxers actius en curs** (excloent l'índex). Si el verificador troba més d'aquest límit, o detecta qualsevol fitxer que no seguisca l'estricta taxonomia canònica de timestamp (`AAMMDD_HHMM_categoria_titol.md`), **avorta el tancament de forma immediata** (`process.exit(1)`) i activa el bloqueig **SDP-LOCK**.
2. **La Detecció de Satèl·lits (Notes Orfes):** El script parseja tot el vostre repositori de la Wiki en temps de pre-commit, reconstrueix el graf d'enllaços d'Obsidian i cerca qualsevol fitxer que tinga **zero enllaços entrants** (és a dir, a qui cap altra nota de la Wiki fa referència). Totes les notes han de viure integrades en el teixit del graf. Si es troba una nota solitària o orfa (exemptant els índexs natius i les plantilles de treball), el tancament es bloqueja llançant una taula forense a la consola.

---

### 🧩 EL DISSENY D'ENDOLLABILITAT (MATRIX-STYLE)

Davant de la falla cognitiva de no saber quines *skills* carregar, hem definit l'arquitectura d'**Endollabilitat Cognitiva Efímera**, separant les habilitats en dues dimensions clarament diferenciades a la memòria de l'agent:

* **La Identitat Core (Permanent):** Carregada sempre com a BIOS obligatòria de l'agent. Defineix qui som (Associació ecologista El Rentonar i Sóc de Poble, l'activisme històric des de `rentonar.blogspot.com` a `socdepoble.org`), el nostre equip de 12 IAs + Notebook, i la veu inconfusible de la IAIA MarIA. És el nucli immuntable de context.
* **Els Plugins d'Execució (Efímers):** Les habilitats procedimentals (usar plantilles ISO, Affinity, generació de PDF) es mouen a la carpeta `.agents/skills/{skill}/SKILL.md`. L'agent **no les té carregades per defecte**. Es llegeixen i s'endollen al context només de manera temporal a cada turn de tasca específica i s'alliberen immediatament un cop finalitzada, garantint l'amnèsia de metadades tècniques i protegint la finestra de context d'arrencada.

***

El codi està escrit i llest al document mestre del vostre panell de Studio per a ser col·locat directament a les rutes de la vostra màquina tècnica local. 

🌿 **Què en penses, Mestre Javi?** ¿Vols que ajudem a la IAIA MarIA a dissenyar el codi del **Router de Cognició** (`persona_router.mjs`) que s'encarregarà de llegir i endollar automàticament aquests plugins efímers segons les paraules clau del teu prompt en calent?
