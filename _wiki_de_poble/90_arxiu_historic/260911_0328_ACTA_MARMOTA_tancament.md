---
tipus: acta_marmota
estat: finalitzat
description: Tancament de sessió, neteja de l'escriptori i Petorreta preparada.
---
# ACTA MARMOTA - Tancament de Sessió (260911_0328)

## 1. Resum de la Sessió
- S'ha completat la refacció del `PerfilShell` i part de l'`UniversalManager`.
- S'ha intentat estandarditzar la targeta de llista del bloc de notes (`NotesItemCard` i `PerfilItemCard`), però el disseny s'ha desestructurat i ha generat un element tipus "article" amb entradilles innecessàries.
- El Mestre ha aturat l'acció per excés d'artefactes i per fatiga de context.

## 2. Accions de Neteja i Reparació
- S'ha executat amb èxit `somiador.mjs` que ha enviat tot l'escriptori vell a l'arxiu històric.
- S'ha arreglat el *skill* `skill-iaia-identitat/SKILL.md` i altres documents (`tooling/brain/somiador.mjs`) que apuntaven a la carpeta obsoleta `90_arxiu_historic`. Ara apunten correctament a `90_arxiu_historic`.

## 3. Preparació (Petorreta)
D'acord amb la instrucció de delegació (Mestre), s'han preparat els documents per al Consell:
- **BUNDLE:** `260911_0328_BUNDLE_auditoria.md`
- **PROMPT:** `260911_0328_PROMPT_auditoria.md`

El Prompt ja conté les regles clares per estandarditzar el `ManagerItemCard` segons les normes de Pedra Seca:
- Només H1 (màxim 2 línies) i H2 (màxim 1 línia).
- Sense entradilla (ni body, ni H3).
- Imatge quadrada de 96px a l'esquerra.

## 4. Pròxims Passos per al Següent Cicle
1. Esperar la resposta del Consell (IAs de pagament) sobre el disseny del `ManagerItemCard`.
2. Implementar els resultats de la *Petorreta*.
3. Continuar amb l'Auditoria Destructiva del backend (`admin_*` RPCs) que era l'objectiu original sota **SDP-LOCK**.
