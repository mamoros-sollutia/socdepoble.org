---
doc_id: SDP-DOC-260828_2312
doc_type: "[WIKI_DOC]"
authoring_agent: "IAIA MarIA"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "23:12"
academic_metadata:
  data_creacio: "2026-08-28"
  nivell_maduresa: "Esborrany"
---

# Acta Sessió Ronda 6: Netetja Pedra Seca i Preparació Petorreta

> **Anclatge de Seguretat**: Aquest document està ancorat a l'índex central [[00_INDEX_ESCRIPTORI]] / [[00_index]] per evitar l'orfenesa i garantir la consciència de la IA en futures auditories.

## Estat de l'Arquitectura
Totes les validacions estrictes de **Pedra Seca** (els `gates`) estan netes. Hem netejat l'aplicació d'estils en línia i de classes òrfenes.
*   **Llei 01 (Classes òrfenes):** Solucionat un problema d'anàlisi de regex que detectava classes dinàmiques al JSX com a "tokens". Les condicions booleanes (`isLogin`, etc.) s'han extret fóra del JSX per a respectar la comprovació estàtica de qualitat.
*   **Llei 03 (Estils en línia):** Eliminats TOTS els estils literals (`marginTop: 16px`, fons i colors absoluts) en `LoginSection` i `MyProfileSection`. S'han convertit a classes d'utilitat com `.avatar--large`, `.pill--error` o re-aprofitant `.login-action`.
*   **Llei 06 (i18n tancat):** Incloses les traduccions `section.myprofile.adminTitle`, `section.myprofile.adminDesc` i `section.myprofile.adminButton` en els 5 idiomes a `src/config/i18n.js`.

## Fantasmes resolts
El Mestre ha detectat que:
1. Els textos de "Registre personal" i les advertències no eixien bé en el Login.
2. Hi havia un logotip gegant d'aigua blanc tapant el fons sencer ("el fantasma").

**Diagnòstic i solució:**
El component `UniversalPage` ja s'encarregava d'injectar el logo oficial (al títol) utilitzant la propietat `showLogos={true}`. Així i tot, teníem invocat un component exclusiu `<BrandMark />` dins del cos del formulari de `LoginSection.jsx`. Per defecte, aquest component carregava la variant "light" (que correspon al `.svg` blanc pensat per a mode fosc), i com no tenia `.dark-only` amagant-lo o estil adequat de límit de grandària al cos, es renderitzava com un fons invisible immens. D'altra banda, `UniversalPage` acoblava de forma rígida el títol general del portal, ignorant les peticions de la UI per alterar el missatge al registre.
*Solució implementada:* Eliminat el `<BrandMark />` intern (deixant el control total a `UniversalPage`) i passats el `title` i `subtitle` de forma dinàmica segons si s'usa login, registre o Google, reflectint el text oficial aprovat.

## Passos per a la nova sessió (Trobada del Consell)
1. Iniciar un xat net des de zero amb aquesta acta i tot el context previ.
2. Generar la **Petorreta Mestra** (Context Bundle) per a auditar la solidesa d'aquesta "Ronda 6" amb Claude, ChatGPT (i els membres del Consell: Qwen, Grok, etc.).
3. Arrancar la definició i implementació del `Centre de Control / Configuració` seguint les imatges de referència de WhatsApp aportades pel Mestre. 
4. Garantir mantenibilitat, escalabilitat i ABSÈNCIA TOTAL de deute tècnic. Continuem lluitant pel "Offline-First".
