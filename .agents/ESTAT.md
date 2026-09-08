---
tipus: document
estat: esborrany
description: "Estat Actual: Sóc de Poble"
---
# Estat Actual: Sóc de Poble

## Objectius Assolits de l'Última Sessió (260908)
- Auditories de "Puresa i Seguretat" completades (Bundle i respostes arxivats).
- Còpia de seguretat (backup local `.tar.gz`) executada i assegurada a l'arrel.
- **Refactorització Backend i Pont de Notes (Fase 5):** S'ha implementat amb èxit la selecció múltiple de missatges al xat i l'enviament directe a una nova nota, usant `createNote()`, gràcies a l'arquitectura dissenyada per Codex. Tests i Linter superats.
- **Xat i Missatgeria (Pedra Seca):** Incorporació del disseny de bambolles tipus WhatsApp per a claredat visual, i mapa cartogràfic com a fons transparent (fixat bug de Vite).
- **Aturada Estratègica de Desplegament:** S'ha evitat forçar un desplegament a producció a cegues. Es demanarà a la IA experta/Sollutia quin és el procediment correcte.

## Pròxim Objectiu (Nova Sessió - En espera d'inici)
1. **Verificació de la Beta i Desplegament:** Tota l'arquitectura del Xat v2 (Fases 3, 4 i 5), així com els errors crítics P0 d'autenticació (Sessió trencada) i funcionalitat (Cerca i creació de noves converses segures per RLS amb `membres_del_poble`) han estat integrats, fusionats manualment i consolidats a la base de codi gràcies al segon pegat de Claude. El sistema està llest per a executar `npm run porta`, fer `build` i fer el desplegament final a producció prèvia comprovació de la integració Supabase.
2. **Verificació del Registre d'Usuari:** Connectar-nos en local per comprovar que el registre amb Supabase/Google funciona perfectament un cop tancat el P0 de la sessió.

## Tasques Agendades per a Post-Beta (Backlog)
- **Usabilitat del Registre:** Considerar afegir els 5 botons d'idioma directament a la pàgina de registre perquè els usuaris puguen triar-lo només arribar.
- **Sistematització del Disseny:** Abstreure les "onboarding-cards" a un component Pedra Seca global.

## Notes Tècniques i Restriccions
- 🚨 **Gestió de Quotes IAs de Pagament (Codex):** El límit de Codex s'ha esgotat (0 restants) només fent ús de dos petorretas. Cal **ESTRATÈGIA D'ESTALVI MÀXIM**: només llançar-hi prompts quan siga estrictament necessari per al disseny/arquitectura més complexos.
- S'ha generat `260908_0650_ACTA_MARMOTA_Tancament.md` documentant els fets. El codi està assegurat en Git.
- **DORMINT:** El sistema està netejat i a punt per obrir nova conversa fresca.
