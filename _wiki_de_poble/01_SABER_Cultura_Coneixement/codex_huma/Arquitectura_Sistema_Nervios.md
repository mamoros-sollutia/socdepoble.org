---
tipus: document
estat: esborrany
description: Descriu com a visió futura una sincronització CRDT/P2P i explicita que Y.js i WebRTC no estan implementats.
tags:
  - saber
---
# Sistema nerviós CRDT/P2P — visió futura

Esta pàgina és una hipòtesi de disseny, no la descripció de la baseline. El
projecte actual no declara Y.js com a dependència, no implementa un protocol de
sincronització WebRTC i no ha demostrat convergència entre dispositius.

## Problema que la visió vol resoldre

Diverses persones podrien editar dades mentre estan sense connexió i
retrobar-se després. Una arquitectura futura hauria de preservar cada canvi,
resoldre conflictes de manera explicable i funcionar en dispositius modestos
sense convertir un servei central en propietari de la dada.

Un CRDT és una família possible de solucions, però no elimina per si mateix la
necessitat d'identitat, permisos, xifratge, transport, persistència, migracions,
garbage collection ni recuperació davant corrupció. WebRTC també necessita
signaling, gestió de NAT, autenticació i un model d'amenaça.

## Porta de maduresa

Abans de promoure esta visió a `canonic` i “implementat” cal:

1. ADR amb alternatives, abast i propietari;
2. prototip localitzat en el repositori i dependències declarades;
3. proves de convergència, partició, duplicació, ordre i esborrat;
4. identitat, permisos, xifratge i tractament de dispositius perduts;
5. proves multi-dispositiu offline/reconnexió en Safari/iPad A10;
6. pressupost de memòria, tombstones i migració/rollback;
7. observabilitat i procediment de recuperació reproduïble.

Fins aleshores, la realitat verificable és la descrita en
[[00_arquitectura_tecnica_unificada]]: React/Vite, persistència local parcial,
PWA i integració Supabase amb fallbacks.


## Taxonomia
- **Categoria:** [[Coneixement]]
- **Etiquetes:** [[Graf]]


**Ancoratge de Seguretat:** [[00_INDEX]]


---

**Ancoratge de Seguretat:** [[00_INDEX]]

## Sinapsis Entrants (Autogenerat)

- [[00_INDEX|00_INDEX.md]] — [[Arquitectura_Sistema_Nervios]]
- [[260901_2359_BUNDLE_auditoria|05_Escriptori_Soc_de_Poble/260901_2359_BUNDLE_auditoria.md]] — [[Arquitectura_Sistema_Nervios]]
- [[260902_0001_BUNDLE_auditoria|05_Escriptori_Soc_de_Poble/260902_0001_BUNDLE_auditoria.md]] — [[Arquitectura_Sistema_Nervios]]
- [[260902_0156_BUNDLE_auditoria_v7|05_Escriptori_Soc_de_Poble/260902_0156_BUNDLE_auditoria_v7.md]] — [[Arquitectura_Sistema_Nervios]]

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
