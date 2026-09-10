---
tipus: document
estat: esborrany
description: "📜 ACTA DEL CONSELL: DICTAMEN D'AUDITORIA FINAL"
---
# 📜 ACTA DEL CONSELL: DICTAMEN D'AUDITORIA FINAL

**Data i Hora:** Dimarts, 8 de setembre de 2026, 04:07 CEST
**Rol:** IAIA MarIA (Seient del Consell)
**Objectiu:** Auditoria destructiva final i evolució cognitiva del Mas (Sóc de Poble).

Mestre, m'has demanat que faça de "Red Team" i desmunte el Mas abans d'obrir les portes a la gent del poble. Ho faré amb el Trellat per davant: sense afalacs, directe a la fusta corcada. L'arquitectura que heu muntat amb els tractors i les portes mecàniques és una obra d'artesania pura, però si rasquem l'estucat, hi ha vies d'aigua que ens poden afonar el projecte sencer.

Açò és el que he trobat.

---

## 1. Auditoria Frontend i Backend (Red Team)

L'arquitectura ha mutat cap a un model *Online-First* estricte amb Supabase com a font de veritat. Això ens dona agilitat, però exposa el flanc de seguretat si la integració amb Sollutia no és perfecta.

He localitzat les següents fallades estructurals:

* **Vulnerabilitat Crítica (XSS + Robatori de Sessió):** El fitxer de deute `.agents/deute/.sollutia-deute.json` declara obertament dos errors pendents crítics: **"JWT emmagatzemat en localStorage vulnerable a XSS"** i **"RLS per tenant incompleta"**. Guardar el JWT (el passaport de l'usuari) al `localStorage` o usar l'emmagatzematge efímer manual (`getEfimer`/`setEfimer` amb `sessionStorage`) a `src/data/oauthRelay.js` i `src/config/storage.js` exposa la clau de pas a qualsevol atac de *Cross-Site Scripting* (XSS). Si un script maliciós entra (per exemple, a través de la injecció d'HTML que fem amb DOMPurify si algun dia falla el sanejament), pot robar les sessions de tots els uelos.


* **Fritura de Dades (RLS Incompleta):** La base de dades és multi-tenant (`tenant_id`). Que la Row Level Security (RLS) estiga "incompleta" vol dir que, ara mateix, un usuari hàbil d'un poble podria teòricament llegir o manipular les dades (xats, perfils) d'un altre poble.


* **Deute Tècnic de Pedra Seca (Frontend):** L'escut de disseny està aguantant, però el document `.agents/deute/.pedra-seca-deute.json` ens diu que encara arrosseguem **121 infraccions d'estils en línia (`style={{...}}`)** en components clau com `XatSection.jsx` i `UniversalEditorShell.jsx`. Això no és un perill de seguretat, però viola la "Llei 3" del genotip de Pedra Seca i complica el manteniment futur.



---

## 2. Maduració de l'Arquitectura Cognitiva (L'Edat Adulta)

El cervell de la màquina (les meues *skills*) ha crescut molt, però encara actua com un xiquet que necessita que li recorden les normes bàsiques. Tenim l'arrel fragmentada en massa fitxers procedimentals: `skill-acte-reflex`, `skill-cicle-de-vida`, `core-context-panic`, etc.

Per passar a l'adultesa autònoma, cal aplicar una **Guillotina Topològica**:

* **Transició de Prosa a Mecànica (Zero Yapping):** L'agent adult no llig un document Markdown infinit per saber com actuar; topa contra un mur mecànic. Les regles escrites a `skill-acte-reflex/SKILL.md` (que demanen verificar i pensar) s'han de buidar de prosa i delegar completament al `PreToolUse` (els hooks com `.agents/hooks/verify.mjs` i `.agents/hooks/preflight_matrix_wrapper.mjs`). La porta tanca, l'agent aprén a base d'errors 403, no llegint sermons.


* **Fusió del Cicle de Vida:** La skill `skill-cicle-de-vida` i `skill-iaia-identitat` s'han d'unificar. La identitat no és només parlar valencià, és complir el cicle (obrir torn → treballar → executar `somiador.mjs` a la nit per netejar l'escriptori). En edat adulta, el tancament de sessió s'ha de fer per defecte sense intervenció humana.


* **Amnèsia Controlada:** La skill `core-context-panic` és un mecanisme excel·lent per tallar el *people-pleasing*, però cal vincular-la directament a l'esgotament de la memòria del bot. Si l'assistent fa dos intents fallits d'escriure un fitxer, ha de cridar de manera autònoma a un script d'abortament, no només queixar-se pel xat.



---

## 3. Puntuació de Resiliència i Veredicte

* **Puntuació de Resiliència:** **7.0 / 10**
L'estructura de tractors i el `SDP-LOCK` són impecables per al codi, però la capa d'autenticació i dades està compromesa.

**VEREDICTE: 🛑 NO-GO (PARADA OBLIGATÒRIA)**

Mestre, active el `SDP-LOCK` virtual sobre la pujada a producció.

No podem obrir el Mas amb l'escut foradat. Abans d'anunciar res al món, necessitem exigir a Sollutia que tanque el forat de la RLS multi-tenant i moga la gestió del JWT des del `sessionStorage`/`localStorage` a *HttpOnly Cookies* segures gestionades pel seu backend, eliminant així el risc de XSS. A més, s'han de netejar els 121 estils en línia restants per segellar el deute de la interfície.

Com vols que procedim amb l'equip de Sollutia per aplicar l'escut sobre el JWT abans de la setmana vinent?
