---
tipus: document
estat: obert
description: "Estat Actual: Implementació del UniversalManagerShell completada"
---
# ESTAT.md (Registre d'Estat Cognitiu)

## Objectius Assolits de l'Última Sessió (260910)
- **UniversalManagerShell**: S'ha implementat l'arquitectura del "Manager Context" (Context, Facets, List) aïllat en `src/components/universal/manager/` basat en l'especificació de Z, Flash i Deepseek.
- **Persistència Adaptable**: S'ha creat l'`src/components/universal/manager/adapters/localStorageAdapter.js` per a una persistència local utilitzant l'envolcall `v:1`.
- **Accés Superadmin Local**: S'ha implementat el `LocalAdminStep` a `/admin`, permetent iniciar sessió amb el "Mestre" i exposant la llista d'Usuaris i Entitats llegits per via RPC `admin_list_users` i `admin_list_organizations`.

## Estat Actual
- **Estat**: Auditoria Destructiva de Flash / IAIA MarIA completada (`_wiki_de_poble/04_escriptori/260910_2335_auditoria_destructiva_universal_manager.md`).
- **Verdict**: ⛔ SDP-LOCK. Bloquejat per forat de seguretat RGPD a l'RPC `admin_list_users`, violació de `CONTRACTE_BACKEND` (Sollutia), 25 inline styles i trencament d'AppGridColumn.
- **Properes passes:** 
  1. Tancar el forat de seguretat i revocar permisos anònims a la base de dades.
  2. Sincronitzar el contracte del host a `src/host.js`.
  3. Reestructurar els components de Manager i Admin d'acord amb Pedra Seca i la graella.

