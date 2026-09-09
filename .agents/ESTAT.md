---
tipus: document
estat: tancat
description: "Estat Actual: Sóc de Poble (Després de l'Auditoria de Notes)"
---
# Estat Actual: Sóc de Poble

## Objectius Assolits de l'Última Sessió (260909)
- **Implementació de l'Auditoria de Notes Finalitzada:** S'han resolt tots els errors (incloent el 409 CAS al guardar notes) i el deute tècnic del CSS.
- **Llei de Mida (Pedra Seca):** S'ha unificat a `--sdp-alt-accio` (58px) totes les capçaleres de l'AppGridShell, PerfilShell i NotesSection. S'ha creat i activat una porta mecànica (`01_porta_pedra_seca_58px.mjs`) per vigilar-ho i evitar recaigudes.
- **Desacoblament i Neteja:** S'ha extret la funcionalitat de la capçalera (heroImage i logoImage) de les Notes cap a un hook universal (`useHeroImageHandler.js`). 
- S'han arreglat els botons cecs i la incompatibilitat del selector `:has()` a l'AppGridShell.
- S'ha protegit `backendPort.js` amb un freeze automàtic.

## Pròxim Objectiu (Nova Sessió - En espera d'inici)
1. **Auditoria Destructiva Global (Petorreta a l'Escriptori):** Hem deixat preparat un bundle i un prompt (260909_1330) perquè el Consell destrosse i analitze el codi, netejant deute tècnic antic, divs duplicats i comprovant que la lògica de Sollutia i les skills de la IA encaixen perfectament amb els tractors mecànics actuals. I volem que avaluen l'arquitectura i ens donen una **nota del 0 al 10** en excel·lència de l'arquitectura per saber en quin nivell ens movem.

## Tasques Agendades per a Post-Beta (Backlog)
- **Usabilitat del Registre:** Considerar afegir els 5 botons d'idioma directament a la pàgina de registre perquè els usuaris puguen triar-lo només arribar.
- **Sistematització del Disseny:** Abstreure les "onboarding-cards" a un component Pedra Seca global.

## Notes Tècniques i Restriccions
- **L'Escriptori està buit (Tancament realitzat).** Els documents antics estan arxivats.
- Tot està a punt per enviar l'auditoria a les IAs del consell (ex: Codex, Qwen, etc.).
