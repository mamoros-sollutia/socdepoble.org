---
tipus: document
estat: esborrany
description: "ACTA ARQUITECTÒNICA: Identitats i Orfes (Páginas Huérfanas)"
---
# ACTA ARQUITECTÒNICA: Identitats i Orfes (Páginas Huérfanas)
**Data:** 07/09/2026
**Autor:** IAIA MarIA (segons àudios del Mestre Javi)

## Decisions Fundamentals (Píndola de Veritat)

Els darrers àudios del Mestre han aportat una claredat absoluta sobre el model de creació d'entitats, esborrant de colp una complexitat que havíem assumit erròniament durant El Consell i establint el full de ruta competitiu contra *Puebli*.

### 1. Zero Pàgines Òrfenes
- **La veritat:** "No vamos a crear ninguno nosotros que no tenga usuario, serán los usuarios los que los creen. Nosotros damos la plataforma."
- **Implicació SQL:** No existeix el concepte d'empresa "buida" esperant ser reclamada. Qualsevol empresa o grup creat naix obligatòriament amb un `owner` (el creador). El trigger `add_organization_owner` ha de funcionar per a **tots** els tipus de creació, no només per a grups. (Ja ho he corregit en `schema.sql`).
- **Implicació UX:** El sistema de "reclamacions" (`organization_claims`) queda relegat a casos extrems o a un futur llunyà. Per a l'MVP, si un usuari vol la seua empresa a la plataforma, *ell mateix la crea*.

### 2. Multi-Administració Integrada
- **La veritat:** "El usuario que cree una empresa o grupo sí puede dar permiso de administrador a otros usuarios... En cuanto a grupos y empresas pueden tener muchos administradores."
- **Implicació SQL:** L'arquitectura actual suporta això de manera nativa gràcies a la taula `organization_memberships` que té els rols `owner` i `admin`. Ja ho tenim cobert. Només caldrà fer la UI per convidar administradors.

### 3. Ajuntaments: Fora de la Fase 1
- **La veritat:** "En cuanto al ayuntamiento, olvídalo. No quiero que un usuario cree un ayuntamiento. Lo crearemos nosotros... va a tener que supervisarse y ahí sí podemos cobrar."
- **Implicació UX & Negoci:** Els ajuntaments queden completament fora de l'abast del MVP d'autoservei. Seran una font d'ingressos (B2G) supervisada manualment per l'equip administrador. El sistema de registre i onboarding obviarà qualsevol flux automatitzat per a Ajuntaments.

### 4. Creació Automàtica de Pobles
- **La veritat:** "Si un usuario se registra de un pueblo que no tenemos, automáticamente creas el pueblo. Tienes que tener un script que lo hace."
- **Implicació:** Confirmem que la creació de pobles nous no passa per un procés d'aprovació manual. Si un usuari entra d'un poble nou, s'obri el poble, es genera l'entrada a la taula `towns` i el seu Mur.

### 5. Estratègia Competitiva: Tipus de Publicació (Clon de Puebli)
- **La veritat:** "Hay que copiar los servicios que tiene Puebli y ofrecerlos nosotros aquí. Al final no dejan de ser una card con una variación... Serán más tipos de publicación (mercado, evento, compartir coche)."
- **Implicació UX/Front:** No es crearan fluxos de dades completament aïllats per a cada servei (ex. no hi haurà una taula de base de dades a part per a 'cotxes compartits'). S'utilitzarà la mateixa base (`app_content` o equivalent) amb diferents **variants de Card** (amb components UI modulars: preu, mapa, places lliures). Això permetrà escalar funcions ràpidament.

### 6. Filosofia "Anti-Facebook"
- **La veritat:** "Tenemos que hacer que el flujo de personas, empresas y gente sea muy cómodo, todo lo contrario de Facebook. Aprenderemos de Facebook lo que NO hay que hacer."
- **Implicació UX:** Prioritzar el *Trellat* absolut en la navegació. Zero fricció, sense menús infinits, i separació clara i higiènica entre Identitats (Llei_05).

## Conclusió
Aquesta directriu del Mestre redueix dramàticament el deute tècnic del MVP. Simplifica el registre d'empreses (és un simple formulari "Crea la teua empresa") i elimina la fricció d'haver de validar identitats i ajuntaments a curt termini. El focus ara passa al Frontend: un panell de control per a l'usuari net, amb opcions de publicació variades, on resulte **increïblement còmode** crear, administrar i publicar contingut.
