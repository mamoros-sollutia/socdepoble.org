---
tipus: document
estat: esborrany
description: "Estat Actual: Sóc de Poble"
---
# Estat Actual: Sóc de Poble

## Objectiu Assolit (260904)
- S'ha completat la fase d'Onboarding: Creació de Perfil, Creació d'Empresa i Creació de Grup.
- S'ha corregit l'esquema de bases de dades (`schema.sql`) per independitzar els grups (ja no requereixen una empresa mare).
- S'ha afegit el camp `lema` per a les organitzacions i s'ha integrat al formulari React (`OnboardingSteps.jsx`).
- S'han pulit les regles RLS per a la creació.
- S'ha creat un Prompt i un Bundle nets preparats per consultar el Consell d'IAs sobre el disseny de la Pàgina de Perfil Universal (inspirada en WhatsApp i Obsidian), incloent-hi una petició per resoldre l'Efecte Matrix (psicopatia d'obviar la Wiki).

## Pròxim Objectiu (Nova Sessió)
- Rebre les 12 opinions del Consell sobre la Pàgina de Perfil.
- Iniciar la construcció modular del panell d'administració de Perfil (Persona, Empresa, Grup) seguint la filosofia Pedra Seca.

## Notes Tècniques
- El sistema de registre ara crea usuaris i entitats correctament i redirigeix a l'aplicació.
- El correu electrònic està desactivat per a confirmació en desenvolupament (dev loop ràpid).
- `tancament.mjs` executat per validar l'Escriptori.
