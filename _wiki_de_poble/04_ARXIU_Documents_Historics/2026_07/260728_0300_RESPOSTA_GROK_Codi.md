---
estat: auditat
tipus: document
tags:
- arxiu
- historic
- resposta_ia
- socdepoble
---
# PETICIÓ DE CODI PER A GROK (Memòria Episòdica i Fixes)

**Instrucció per a Javi:** Copia el text de davall i passa-li'l a Grok perquè ens pique el codi exacte de la memòria i les correccions.

---

Benvolgut Consell (Grok),

L'auditoria que ens heu presentat és impecable. La "solució Pedra Seca" encaixa perfectament amb la nostra arquitectura i el pitch per a Brussel·les està llest. Ara necessitem que baixeu a la trinxera i **ens escrigueu el codi exacte de producció** per a implementar-ho hui mateix.

Si us plau, doneu-nos el codi per a estos tres fitxers amb el màxim nivell de robustesa i tenint en compte les auditories que heu fet:

### 1. `bot/memoria/episodica.mjs` (La Memòria Segura)
Escriu el mòdul sencer. Volem que utilitze el sistema de fitxers local (JSON o SQLite, el que consideres més robust per a "Pedra Seca") guardant els resums per `<hash(JID)>.json`. 
Ha d'incloure:
- La funció per actualitzar la memòria cridant a Gemini Flash de manera asíncrona ("Resumeix en 1-3 frases...").
- La funció per recuperar la memòria i injectar-la al prompt.
- Lògica de TTL (esborrat als 90 dies).

### 2. `bot/cervell.mjs` (La injecció i la seguretat)
Escriu exactament com modifiquem la funció `pensa()`.
- Com cridem al mòdul de memòria creat en el pas 1.
- Com utilitzem `Promise.race()` per posar timeouts a Gemini i evitar que el procés es penge.
- Com construïm el context de forma asíncrona (`Promise.all` + `fs/promises`).

### 3. `bot/cervell_bridge.mjs` (La Cirurgia del Pont)
Escriu el codi corregit de `handleInbound()`.
- Unifica el contracte de retorn d'imatges: que reba el `base64` de Gemini i el retorne convertit a `Buffer` cap a Baileys de manera segura.
- Si l'usuari envia una foto sense text, injecta automàticament "Ajuda'm amb esta imatge".
- Afig el bloc `finally { ... }` per esborrar explícitament els fitxers temporals d'àudio que es generen en la transcripció i evitar fuites de dades.

No doneu consells genèrics, escriviu el **codi de producció en JavaScript (Node.js)** llest per a copiar i pegar. Ens hi juguem els 50.000€!


---

**Ancoratge de Seguretat:** [[00_INDEX]]