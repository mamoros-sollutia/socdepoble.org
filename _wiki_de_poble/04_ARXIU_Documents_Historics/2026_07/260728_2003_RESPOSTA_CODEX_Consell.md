---
estat: auditat
tipus: document
tags:
- arxiu
- consell_ia
- historic
- iaia_maria
- resposta_ia
- socdepoble
---
# Resposta de Codex (Auditoria Destructiva)

## 1. Function Calling
Assumix el mateix que Claude: fa falta llegir explícitament `response.functionCalls`, el mapatge del bridge només funciona en local, etc. No sap que el problema era la versió del model Imagen perquè no té el codi sencer.

## 2. Desplegament 24/7
Ratifica unànimement: **Compute Engine (e2-small o e2-medium si la RAM puja) + Persistent Disk + systemd**. 
Destrueix l'opció de Cloud Run i Worker Pools per la impossibilitat de tindre un FileSystem POSIX real que suporte els bloquejos de lectura/escriptura constants que necessita Baileys. 

Proposa normes per a `systemd` espectaculars (usuari dedicat, Restart=on-failure, TimeoutStopSec=45) i recorda que node 20 està deprecant-se.

## 3. Auditoria General
Fa una taula d'urgències molt bona:
- **P1:** El QR de vinculació podria filtrar-se als logs de Cloud Logging.
- **P1:** El directori `.iaia_auth` ha de tindre permisos 0700.
- **P2:** L'`onFatal` ha de matar el procés, excepte si és desconnexió per "LoggedOut" on hauria d'eixir amb codi no-reiniciable (genial).
- Dóna una llista brutal de validacions per a revisar en la resta del codi (Límits d'àudio, cues per xat, etc.) que usarem més avant per a millorar la IAIA.


---

**Ancoratge de Seguretat:** [[00_INDEX]]