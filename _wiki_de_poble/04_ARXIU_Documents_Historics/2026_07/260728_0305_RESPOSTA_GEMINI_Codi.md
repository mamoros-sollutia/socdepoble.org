---
estat: auditat
tipus: document
tags:
- arxiu
- historic
- resposta_ia
- socdepoble
---
# PETICIÓ DE CODI PER A GEMINI (Tools i RAG Biogràfic)

**Instrucció per a Javi:** Copia el text de davall i passa-li'l a Gemini perquè ens programe les `Tools` (Function Calling) i la Memòria de Síntesi.

---

Benvolgut Consell (Gemini),

Has tocat les tecles clau. El concepte de "Bessó Digital Cultural" i "Memòria de Síntesi" són or pur per al discurs dels 50.000€, i la substitució de les RegEx per *Function Calling* (Tools) és l'arquitectura robusta que necessitàvem.

Ara necessite que em passes el **codi de producció exacte en JavaScript (Node.js)** per a implementar-ho al nostre `bot/cervell.mjs`. Escriu-ho llest per a copiar i pegar, sisplau:

### 1. Injecció de Tools (Function Calling) i Prompt
Escriu el codi exacte de la crida a `ai.models.generateContent` on declarem la ferramenta `dibuixar_estampa(prompt_angles)` a la configuració de Gemini 2.5. 
Volem que l'objecte de retorn de la teua funció gestione correctament l'execució d'aquesta tool. Ensenya'ns com captures la crida de la funció i com evites haver d'usar RegEx.

### 2. Memòria de Síntesi (RAG Biogràfic Local)
Escriu les funcions necessàries per a:
- Recuperar la memòria prèvia del veí des de `.data/veins/<hash_JID>.md` i injectar-la al nou *System Prompt*.
- Un sistema en segon pla on, cada 5 missatges, es crida al model Flash per a fer un resum de la conversa actual i actualitzar el fitxer `.md` del veí de forma incremental (sense sobreescriure la saviesa anterior, només actualitzant-la).

### 3. Solució del Coll d'Ampolla del RAG
Mostra'ns com modifiques la funció `iniciaCervell()` per llegir un índex `rag_index.json` prèviament calculat de disc (asíncronament sense bloquejar l'arrancada), en lloc de fer un `buildIndex()` síncron de tota la Wiki.

Volem codi de màxima qualitat, asíncron, segur i fidel als principis de la Pedra Seca. El destí del projecte està a les teues mans!


---

**Ancoratge de Seguretat:** [[00_INDEX]]