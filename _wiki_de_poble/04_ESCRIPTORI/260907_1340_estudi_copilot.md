---
tipus: estudi_ia
estat: descartat
description: Anàlisi de la resposta de Copilot (inferior a Claude)
data: 2026-09-07
---

# 🧠 ESTUDI DE IA: Resposta de Copilot

**IA Auditada:** Copilot
**Font:** Resposta pegada al xat.
**Tema:** Neteja de perfils zombis i Arquitectura d'Identitats

## 1. Avaluació de la Purga SQL

L'aproximació de Copilot és molt genèrica i cau exactament en la fal·làcia que Claude ens va advertir: **usa `username IS NULL` com a criteri principal d'esborrat**, recolzant-se només en el `NOT EXISTS` a auth.
- **Risc:** No fa simulacres reals (`aplicar=false`), no té transaccions blindades de recompte obligatori com feia Claude, i et diu de fer un `CREATE TABLE admin_backup` manual. 
- **Veredicte:** El codi SQL de Claude és infinitament més segur (SDP-LOCK) i madur. Descartem l'script de Copilot.

## 2. Model de Dades

Copilot s'ha deixat enganyar per l'abstracció i proposa crear taules noves innecessàries: `entities` i `entity_memberships`.
- **Error Crític:** Nosaltres ja tenim `organizations` i `organization_memberships` (connectades al poble). Si férem cas a Copilot, duplicaríem l'estructura de la base de dades.
- D'altra banda, la seua idea de `identity_shares` per auditar "qui compartix què" és equivalent a la taula `ownership_transfers` que ens va proposar Claude per a complir la legalitat, però la de Claude estava millor aterrada al nostre contracte.

## 3. Descomposició de l'AppDataContext

Copilot proposa una clàssica refacció de contexts per dominis (`UserProfileContext`, `EntitiesContext`, etc.) però manté el vici de Codex: gestiona la identitat **per Estat** en comptes de fer-ho **per URL**.
- Sense lligar l'actor a la ruta (`/jo` vs `/e/empresa`), el frontend sempre tindrà problemes de memòria cau quan canvies de context. La proposta de Claude amb el `key={actorKey}` directament sobre el Provider mata el problema d'arrel i Copilot no arriba a eixe nivell de sofisticació.

## 4. Veredicte Final

**Copilot ha emès una resposta "AI-slop" estàndard.** No ha llegit bé l'esquema actual (inventant-se `entities`) i el seu SQL és confiat i perillós.

**Mantenim Claude com a guanyador indiscutible del Consell.**
Continuem amb el Pla d'Implementació basat exclusivament en l'arquitectura de Claude.
