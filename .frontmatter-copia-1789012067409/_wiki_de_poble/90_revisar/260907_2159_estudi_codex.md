# Auditoria Codex: Transició Fase 3 (B1, B2 i rols globals)

**Data:** 07/09/2026
**Veredicte General:** B1 aprovat estàticament; B2 i Fase 3 necessiten correccions estructurals abans de producció.
**Estimació de temps:** 5-10 dies laborables (dues setmanes raonable).

## Text íntegre de la resposta:

Veredicte: B1 és correcte en el bundle; B2 i la Fase 3 necessiten correccions abans de provar el registre en producció. Planificaria dues setmanes, no dos dies.
He verificat els hashes dels 471 fitxers inclosos. implementation_plan.md no apareix com a fitxer del bundle; l’avaluació es basa en supabase/schema.sql, el frontend i els estudis adjunts. No he consultat l’esquema desplegat ni executat SQL. Les instruccions dels documents s’han tractat com a context, no com a ordres.

| Aspecte | Nota | Interpretació |
| :--- | :--- | :--- |
| Direcció arquitectònica | 7/10 | Online-First amb Auth, PostgreSQL i RLS és coherent. |
| Preparació per a producció de la Fase 3 | 4/10 | Hi ha bloquejos de sessió, registre i concurrència. |
| Complexitat de completar la transició | 8/10 | El treball principal és integrar permisos i migracions amb garanties. |

Són valoracions tècniques de l’abast revisat, no mesures de tot el sistema.

### B1 — list_my_organizations: aprovat estàticament.
La versió actual retorna les 12 columnes, amb organization.lema en la posició correcta. Conserva SECURITY INVOKER, filtra per auth.uid() i tenant, i uneix les taules per organització i tenant. Els permisos de lectura necessaris apareixen en l’esquema.
Abans de desplegar:
- Comparar la signatura real amb la proposta. CREATE OR REPLACE FUNCTION no permet canviar el tipus de retorn existent; si difereix, cal una migració específica amb revisió de dependències.
- Provar: usuari sense pertinences, membre, altre usuari i altre tenant. No canviar a SECURITY DEFINER per solucionar errors de permisos.

### B2 — private.ajustos i handle_new_user: aprovació condicionada.
El trigger té bones bases: search_path='', noms qualificats, comprovació d’existència del poble i creació transaccional del perfil i la pertinença.
Però hi ha tres problemes:
1. **Alta en pobles tancats.** Accepta tenant_id de raw_user_meta_data i només comprova que existisca. No comprova towns.is_open. Una petició directa pot escollir un poble tancat.
2. **Configuració sense enduriment explícit.** private.ajustos no té RLS ni revocacions de taula explícites. Revocar accés de PUBLIC, anon i authenticated.
3. **Entrades que poden bloquejar altes.** valor::uuid i el cast de rgpd poden fallar. Supabase confirma que un trigger fallit pot impedir el registre.

### Fase 3 — els bloquejos principals són estos.
Prioritat | Evidència | Correcció necessària
--- | --- | ---
**Alta: sessió inconsistent** | supabaseBackend.js guarda tokens de registre/login en localStorage; les peticions i renovació lligen sessionStorage. | Unificar registre, OAuth, renovació i eixida.
**Alta: aprovacions concurrents** | resol_reclamacio bloqueja la reclamació, però no l'organització. | Bloquejar també l’organització i tornar a comprovar-ne la propietat amb serialització.
**Alta: migració incompleta** | El SQL introdueix un nou trigger de propietat, però no retira explícitament l’antic sdp_protegeix_propietari. | Inventariar objectes desplegats i escriure una migració versionada i transaccional.
**Mitjana: rol incorrecte en pantalla** | MyProfileSection.jsx comprova user.user_metadata.role; el servidor consulta user_platform_roles. | Llegir el rol autoritzat del backend.
**Mitjana: identitat incompleta** | IdentitatContext usa el slug com a actorId i manté memberships buit. | Resoldre slug a UUID dins del tenant i carregar pertinences abans d’habilitar accions.

Cal evitar que una còpia local siga autoritat sobre permisos. També cal distingir reclamacions d’entitats (organization_claims) de claims JWT. Queden dos punts de governança: impedir l’autoaprovació d’una reclamació i registrar concessions/revocacions. A més, cal definir com entra una entitat sense propietari.

### Estimació: una persona amb experiència i accés operatiu a Sollutia.
| Treball | Dies laborables |
| :--- | :--- |
| Contrastar esquema real, preparar migracions i reversió | 1–2 |
| Corregir B1/B2 i unificar sessió | 1–2 |
| Completar rols, reclamacions i identitats | 2–3 |
| Proves d’integració, concurrència i desplegament | 1–3 |
| **Total** | **5–10** |

Dos dies poden donar una reparació limitada en preproducció. Dues setmanes és una previsió raonable per a la Fase 3 descrita.
SDP-LOCK per a operacions destructives: el seed conté ON CONFLICT DO UPDATE i pot sobreescriure contingut existent. Tampoc s’ha executat cap migració ni modificat cap dada en esta auditoria.
