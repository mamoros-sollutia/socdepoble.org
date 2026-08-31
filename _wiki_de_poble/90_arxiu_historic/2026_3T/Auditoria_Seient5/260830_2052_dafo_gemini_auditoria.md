# DAFO AUDITORIA GEMINI / AI STUDIO (Seient Núm. 6)

## 1. Debilitats (Errors de codi i Ceguesa de la IA)
- **Ceguesa Estructural de la IA**: A diferència de Claude i Codex, Gemini ha passat per alt completament els bloquejants P0 (el TDZ de `backendPort.js` i l'engoliment de dades del Mur per la manca de `mergeById`). Ha atorgat un "SUPERAT AMB HONORS" a codi que ara mateix ni arranca. Açò demostra per què el Consell ha de ser plural.
- **Duplicitat d'Errors (UX)**: Ha detectat que quan el Mur falla, el sistema llança dos Toasts solapats (un des de `ConnectarSection.jsx` i altre disparat per l'esdeveniment a `App.jsx`).
- **Silenci al Xat (UX)**: Quan el Xat falla, s'emet l'esdeveniment `sdp:chat-rejected`, però `App.jsx` no l'està escoltant. La caixa de text recupera el missatge, però l'usuari no rep cap avís flotant de que la xarxa ha caigut.

## 2. Amenaces (Vulnerabilitats de Seguretat i Integritat)
- **Bloqueig del Mode Local/Seed**: Gemini assenyala correctament que `getResolvedConfig` força `dataMode` i `runtimeDataMode` a `'remote'`. Açò mata qualsevol possibilitat d'usar l'App en mode desenvolupament (`seed`) i contradiu obertament el `README.md`. Condemna els desenvolupadors a dependre sempre d'un backend viu.

## 3. Fortaleses (La Pedra Seca que aguanta)
- **Validació de l'Arrancada per Microtasques**: Reconeix com una "Obra Mestra" l'ús de `queueMicrotask` a `arrencaAuto()`. Confirma que aquest patró deixa precisament el temps exacte perquè Sollutia injecte el seu `<script>` abans que React prenga el control del DOM.
- **Rollback UX validat**: Malgrat els errors de persistència al backend que van trobar les altres IAs, Gemini confirma que a nivell de React/UI, el patró de tornar a posar el text a la caixa quan falla el Xat és un excel·lent detall de disseny.

## 4. Oportunitats (Camí a la Implementació)
- **Sanejar el Flux d'Avisos (Toasts)**: Netejar la duplicitat d'avisos al Mur i afegir el listener per al Xat a `App.jsx`.
- **Aclarir el Futur del Mode Seed**: Hem de prendre una decisió arquitectònica: o s'esborra qualsevol rastre del Mode Seed i assumim que som 100% Remots (i actualitzem la documentació), o s'arregla `getResolvedConfig` perquè respecte l'opció passada per configuració de `VITE_DATA_MODE`.

---
> **VEREDICTE ACTITUDA DAFO:**
> Aquesta auditoria demostra el valor de la "Matriu de Consell". Mentre Claude i Codex han sigut mecànics, implacables i precisos assenyalant errors de compilació i lògica profunda (la "cimentació"), Gemini ha fet una auditoria més superficial d'alt nivell (la "façana" i l'UX). Cap visió sobra; la combinació de les tres ens dona el mapa complet del que falla a l'App.
