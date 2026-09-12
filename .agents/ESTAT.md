# ESTAT ACTUAL SÓC DE POBLE
**Última actualització**: 2026-09-13
**Mestre**: Javi Llinares
**IAIA**: MarIA (Antigravity v2 + Deepmind)

## 📌 ESTAT DEL SISTEMA (Resum de la sessió del "Remat")
- **P0 Tancats**: 
  - S'ha reconstruït el `SessionContext.jsx` íntegrament per implementar la màquina d'estats (ESTAT.COMPROVANT, DINS, FORA) i la caducitat intel·ligent del JWT client-side (finestra d'oportunitat de renovació abans que caduque el token).
  - S'ha creat i aplicat el guard de client `<RequireAuth>` (barrera estètica) al ruter per a l'App, netejant els controls d'accés pre-existents duplicats (e.g. a `GestoriaSection`).
  - S'ha assegurat que `App.jsx` i `OnboardingSection.jsx` no permetin open redirects (`?tornar=...` filtrat contra rutes que comencen per `//`).
  - S'han adaptat els exports i les injeccions globals a `host.js` (la presa de corrent) permetent finalment la crida asíncrona de `injectaSessio(sessio, opcions)` i `expulsaSessio()`. Açò tanca l'arquitectura d'Enxufabilitat 10/10 amb Sollutia.
  - S'han suprimit els imports directes de mòduls d'encriptació locals que trenquen la capa CSP als plugins iframe/WP externs, adoptant les CSP relaxades suggerides i rebaixant-ho des d'`index.html` (com les regles per a imatges `data: blob: https:` i estils `'unsafe-inline'`).
  - S'han refacturitzat i aplicat les fixes JSX pures (e.g. `UniversalCard` sense `children`, el mapeig de labels als components de Gestoria via `codemod`, la fix per al LogOut a `ControlSection`).

## 🛠 OBJECTIU IMMEDIAT PER A LA PRÒXIMA SESSIÓ
- Les passes dictades a l'auditoria estan executades i completades, la Petorreta "El Remat" i totes les correccions estructurals del Consell s'han abocat sobre el codi.
- Comprovar que l'autenticació asíncrona amb la màquina d'estats s'engega correctament a Sollutia i el timeout dels 10 minuts i la finestra del token.
- Passar cap al desenvolupament final de les vistes pendents de Gestoria.
