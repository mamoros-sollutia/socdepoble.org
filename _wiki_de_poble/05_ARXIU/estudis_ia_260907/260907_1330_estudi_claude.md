---
tipus: estudi_ia
estat: actiu
description: Anàlisi de la resposta de Claude sobre orfes, RLS i identitats (Persona/Entitat)
data: 2026-09-07
---

# 🧠 ESTUDI DE IA: Resposta de Claude

**IA Auditada:** Claude
**Font:** Document d'Arquitectura (`260907_ARQ_identitats_persona_entitat.md`) i script SQL defensiu al xat.
**Tema:** Purga de perfils orfes, RLS avançat, i Refacció d'Identitats (React Context + URL)

## 1. Avaluació de la Purga SQL (Zombis i Orfes)

Claude ha destrossat les suposicions prèvies de Codex i ha pujat el nivell de l'escut defensiu al màxim (SDP-LOCK actiu).

- **Contradicció Detectada:** `username IS NULL` NO és un orfe, és un usuari legítim sense nom. Un orfe és aquell `NOT EXISTS (SELECT 1 FROM auth.users)`. Confondre açò haguera provocat esborrats de gent viva!
- **Hipòtesi del CASCADE:** Ens prohibix suposar que falta el `CASCADE`. Podria ser que falte la pròpia clau forana (FK). Ens ha dissenyat els Passos **0.a** i **0.b** en el seu script SQL justament per a que el Mestre puga diagnosticar *per què* es van crear orfes abans d'aniquilar-los.

## 2. Model de Dades: Persona i Entitat

A la base de dades, Claude rebutja el "polimorfisme" (un camp `owner_type`) i opta per la via Pedra Seca, pura i dura: **Dues columnes amb clau forana real** en les taules de contingut (com ara `notes`).

- `author_profile_id` (L'autor, no canvia mai).
- `owner_organization_id` (L'entitat propietària. Si és NULL, la dada és personal).
- **Propietat Legal:** Claude ens alerta que "passar dades lliurement" implica riscos legals de divulgació a tercers. Per això obliga a usar un RPC (`transferir(...)`) i guardar traça en `ownership_transfers`.

## 3. Descomposició de l'AppDataContext (El Canvi Paradigmàtic)

La lliçó de React més forta de l'estudi: **L'actor actiu NO és estat, és URL.**
Codex ens va proposar un `ActiveIdentityContext` (estat) per a saber si actues com a Persona o Empresa. Claude diu NO.

- **`/jo/*`** → Actor = persona.
- **`/e/:slug/*`** → Actor = entitat.
- Els contextos de dades de React només viuen per baix d'eixes rutes i, crucialment, reben una `key={actorKey}`. Si canvies de persona a empresa, canvia la URL, canvia la `key`, i React automàticament desmunta i aniquila la memòria de l'estat vell. Cero possibilitats de fuites de dades privades barrejades a la pantalla.

A més ens lliura l'script `tractor-contextos.mjs` per garantir a nivell de CI/CD que ningú torne a crear mai l'antic monstre `AppDataContext`.

## 4. Veredicte Final i Passos a Seguir

Claude rep la màxima qualificació. Ha detectat fal·làcies, ens ha evitat borrar usuaris vius, i ha resolt el puzle de l'estat global en React de la forma més estàndard i neta possible (via Routing i `key`).

**El nostre Pla d'Acció derivat d'este Estudi:**
1. **Acció Humana (Mestre):** Executar els passos **0.a, 0.b i 1** del SQL de Claude a Supabase, NO el pas 2 encara. Volem diagnosticar què passa amb les teues Claus Foranes.
2. **Acció IA (IAIA):** Anul·laré el Pla d'Implementació que havia fet seguint a Codex, i redactaré un nou Pla d'Implementació que seguisca fil per randa el model d'arbre de contextos de Claude i l'enrutament `/jo` vs `/e/:slug`.
