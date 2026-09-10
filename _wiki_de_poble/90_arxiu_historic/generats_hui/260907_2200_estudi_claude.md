---
tipus: document
estat: esborrany
description: "Auditoria Claude: Transició Fase 3 (B1, B2 i rols globals)"
---
# Auditoria Claude: Transició Fase 3 (B1, B2 i rols globals)

**Data:** 07/09/2026
**Veredicte General:** B1 i B2 funcionen en execució real. L'arquitectura Fase 3 té un pany (deadlock) lògic que fa impossible el sistema de reclamacions. Nota: 5.5/10.
**Estimació de temps:** 6-8 dies de faena (~2 setmanes de calendari).

## Text íntegre de la resposta:

**`implementation_plan.md` no és al paquet.** He auditat el SQL lliurat, no el proposat. Si el pla diu coses distintes, açò no les cobrix.

**El paquet és honest**: 471/471 fitxers, 471/471 sha256 correctes. Primera vegada en la sèrie que el manifest no ment.

**B1 i B2 ja estan bé** — verificats executant l'esquema en un PostgreSQL 16 real amb un shim de Supabase. El registre ja crea `town_memberships`; el P0 que bloquejava tot el contingut RLS està tancat.

El problema és un altre, i és el nucli de la Fase 3:

**El sistema de reclamació d'entitats és inabastable.** `created_by` és `not null`, el trigger assigna propietària a tota organització en inserir-la, i `sdp_una_propietaria` exigix exactament 1 al commit. `sollicita_reclamacio` exigix que no en tinga cap. Provat com a `postgres`, superusuari:

```
ERROR:  SDP-LOCK: l'organització 8888… ha de tindre exactament 1 propietària (en té 0).
```

Entitats reclamables al sistema: **0**, i estructuralment sempre 0. Com que `create_organization` refusa crear `entity` i `city_hall` dient «es reclamen», i el `seed.sql` no en porta cap, **els ajuntaments i les entitats no poden existir**. Hi ha taula, RPC, RLS, `ClaimStep` i botó — i cap camí: el `backendPort` no exporta cap mètode de reclamació i ningú importa la pantalla.

També: tota organització naix `public` fix i la política de lectura no filtra per `tenant_id` (un usuari d'Altea veu les de La Torre), i l'esquema no s'executa fora de Supabase perquè 5 taules depenen dels *default privileges* implícits.

**Nota global: 5,5/10.** No és fràgil; és sòlid amb una peça central desconnectada. L'ofici de l'SQL és bo — `search_path` net, `constraint trigger` diferit, `for update` a la resolució.

**Temps: 6–8 dies de faena, ~2 setmanes de calendari.** Els 2 dies només donen per als cosmètics.

Abans de tocar res, contesta't una pregunta: **una entitat pot existir sense propietària?** Si sí, l'invariant ha de ser condicional a un estat de gestió. Si no, sobra la reclamació i cal esborrar les tres capes mortes. Fins que això no tinga resposta, la resta d'estimacions són fum.
