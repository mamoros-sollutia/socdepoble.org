# GLOSSARI DE TERMES CORE (Sóc de Poble)

*Aquest glossari estableix un vocabulari canònic i precís per a tots els desenvolupadors i intel·ligències artificials que treballen en l'ecosistema Sóc de Poble.*

## CONCEPTES ARQUITECTÒNICS

- **Offline-First**: La visió final i pura del projecte on totes les dades són llegides i escrites a disc local primer. La pèrdua de xarxa mai bloca l'usuari.
- **Online-First (Pragmàtic)**: L'estat temporal actual on depenem de Sollutia i Supabase per motius pràctics. Els components locals funcionen més com una memòria cau (tèrmica) que com la font primària (llevat de l'Outbox).
- **Pedra Seca**: Filosofia i Sistema de Disseny (CSS i React). Minimalisme sense dependències. Rebutja l'ús innecessari d'eines alienes si el problema pot ser resolt de manera nativa. Mínima fricció visual.
- **El LEDGER (Llibre d'Obra)**: Registre de decisions estructurals. Immune al canvi (llevat d'addicions) i verificat criptogràficament per `verify-ledger.mjs`.
- **BIOS Executable**: Seqüència d'arrencada automatitzada (`tooling/verify-bios.mjs`) que prevé l'amnèsia cognitiva assegurant la integritat del conjunt documental de les IA.

## CONCEPTES TÈCNICS

- **Outbox**: La cua de missatges local (sobre IndexedDB) encarregada d'emmagatzemar atòmicament qualsevol escriptura abans de xarxa. És la Font Única de Veritat de les transaccions d'usuari pendents.
- **Circuit Breaker (Quarantena)**: El mecanisme defensiu de l'Outbox per evitar esborrar dades de manera perjudicial. Si Safari/WebKit genera errors continus sense explicació, la base de dades es posa en `Quarantena`.
- **Portes Mecàniques (Gates o Tractors)**: Scripts dissenyats per aturar qualsevol IA que intente trencar regles invariants del sistema (per exemple, `tractor-persistencia.mjs`).
- **Làpida (Tombstone)**: Metadada `estat: 'confirmat'` utilitzada en comptes de fer esborrat quan l'IDB falla. Serveix per prevenir l'enviament duplicat de registres.
- **Sincronitzador**: El bucle en segon pla encarregat exclusivament de traspassar missatges de l'Outbox a la xarxa, processant per lots i manejant rellotges `ajorna()`.

*“La confusió lingüística precedeix l'amnèsia arquitectònica.”* (Z - Alt Consell de les IA)
