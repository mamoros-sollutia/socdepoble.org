---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
---
# ACTA: SÍNTESI DE L'AUDITORIA INVERSA DE GROK (ARQUITECTURA PEDRA SECA)

**Data:** 24 d'agost de 2026 (14:55)

En resposta a la Petorreta d'Auditoria Global, el membre del Consell **Grok** ha desglossat tota l'arquitectura de *Pedra Seca*, analitzant des dels *seeds* fins a les rutes de navegació. Grok detecta que el sistema, malgrat la seua robustesa ideològica (Offline-First, Mode Bancal), amaga una fragilitat alarmant en el procés de muntatge de l'estat i en el tooling de manteniment.

## 1. Diagnòstic d'Arquitectura i Riscos

- **Estabilitat i Estat Buit:** Absència de gestió defensiva quan `MOCK_FEED` o altres llistes estan buides (fallada silenciosa). 
- **Normalització Duplicada:** Funcions vitals com `stripAccents` estan repetides per diversos llocs, amenaçant de divergir si s'actualitza només en un costat.
- **Seguretat / P2P Spoofing:** Confirmació que qualsevol *script* (com els de WordPress) al mateix origen pot injectar dades al `BroadcastChannel` sense autenticació.
- **Risc Màxim (Eines de Tooling):** La pitjor amenaça no és el codi React sinó els scripts destructius (Python i NodeJS) a `.agents/` o `tooling/` que refan o esborren components sencers. Es recomana enviar els scripts d'un sol ús a una quarantena estricta (o eliminar-los).

## 2. 10 Pegats per a l'Estabilitat Absoluta (El 10/10)

Grok ha proposat 10 mesures escalonades per tancar completament els forats de seguretat i estabilitat:
1. **Font de veritat única per normalització:** Consolidar `stripAccents` i `normalizeSearchText` només a `contentHelpers.js`.
2. **Validació i *freeze* de seeds:** Assertions en desenvolupament (verificació d'ID únic) i fallback de UI si la secció està buida.
3. **Persistència de xat robusta:** Abandonar `getSeedChatState` com a generador i emprar un versionat autèntic a localStorage (`socdepoble-chat-v2`).
4. **Device Bridge Defensiu:** Fallback silenciós si `BroadcastChannel` no està disponible, garantint destrucció de listeners.
5. **Theme sense FOUC:** Funcions unificades d'escriptura per evitar discrepàncies entre `data-theme`, `localStorage` i Shadow DOM.
6. **Validació d'Assets:** Bloqueig estricte d'URL malicioses (evitar *path traversal* en components).
7. **Refactor d'Agents:** Extreure `systemPrompt` pesats cap a llistes sota demanda, deixant la llista en memòria (UI) lleugera.
8. **Protecció contra Scripts Destructius:** Confinar tot script massiu de modificació del DOM i prioritzar sempre pegats parcials (diffs) en lloc de regeneració completa.
9. **Error Boundaries:** Afegir límits de caiguda globals per a cada vista.
10. **Tests de Contracte Mínims:** Assertions simples (IDs únics, rutes vàlides).

## 3. Noves Skills Integrades al Genoma

Grok ha destil·lat les millors pràctiques d'enginyeria de l'ecosistema IA en 4 noves habilitats magistrals que han sigut inserides a `.agents/skills/`:
- `trellat-reasoning`: Sentit comú rural, verificació de fets i negació estricta a inventar.
- `pedra-seca-code`: Compliment absolut del manifest semàntic de HTML+CSS i rebuig de mutacions massives.
- `anti-collapse-audit`: Llista de comprovació obligatòria (*checklist*) abans de qualsevol modificació massiva o tooling.
- `sovereign-offline`: Presumpció de zero connectivitat, memòria local i llegibilitat per a hardware antic a plena llum solar (Mode Bancal).

---
**NOTA DE PROCEDIMENT:** Mantenim la posició. Estem prenent nota. Si queden més membres del Consell per parlar, els escoltarem; altrament, el Mestre marcarà per quin dels 10 punts comencem a aplicar l'ordre.
