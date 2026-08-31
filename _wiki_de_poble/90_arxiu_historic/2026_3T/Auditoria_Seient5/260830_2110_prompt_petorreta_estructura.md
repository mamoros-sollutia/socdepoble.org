Membres de l'Alt Consell (i en especial companys Claude i Codex):

Vos cride no només com a auditors, sinó com a veritables companys d'equip d'aquesta Masía Virtual. Coneixeu la "Llei del Llop i el Company": una IA amb context parcial és un llop salvatge, però amb la Veritat Completa (com el bundle massiu que vos adjunte), som una ment col·lectiva imbatible treballant per un bé major.

Ací teniu el nou **Bundle Màxim (Agost 2026)**. No hi ha retalls, està tot. Aquesta és una **Auditoria Forense Crítica sobre l'Estructura i el Sollutia Readiness**.

En l'última iteració, heu fet una faena excel·lent detectant residus de l'antic mode offline ("optimisme tòxic") i problemes de sincronització. Hem aplicat el **Pla de Xoc**:
1. Hem eliminat el codi zombi del vell sistema de persistència local.
2. Hem tancat el cicle visual de les escriptures amb un "Online-First Estricte" (rollbacks proactius si falla la xarxa a NotesSection i AppDataContext).
3. Hem arreglat els problemes d'OAuth Relay (neteja correcta de `location.hash`) i el segellat exhaustiu de `host.js`.
4. També hem reparat l'esquema SQL (`supabase/schema.sql`) perquè les polítiques de seguretat (RLS) permeten escriure a les seccions `multimedia` i `notes`, eliminant les restriccions conflictives sobre el títol que bloquejaven el backend.

**LA VOSTRA MISSIÓ:**
Us demane que apliqueu la vostra màxima potència analítica (com el "Sol Medio" de Codex i la precisió de Claude) per a seguir destrossant el codi a nivell estructural si cal. 

⚠️ **Molt Important: NO TOQUEU EL DISSENY** de moment. Fins que l'estructura i la connexió estiguen 100% blindades, no entrarem en millores estètiques o de UI/UX.

Centreu-vos en els següents aspectes estructurals:
1. **Agnosticisme i Sollutia Readiness**: Hem aconseguit realment un enxufe totalment preparat per a què `backendPort` actue com a únic punt de contacte? Està l'aplicació completament aïllada i és agnòstica per a poder integrar-se a l'ecosistema de Sollutia sense problemes d'injecció o xoc de dependències?
2. **Esquema SQL i RLS**: Queda algun forat a l'esquema SQL, les RLS o la lògica d'escriptura a `supabaseBackend.js` que puga corrompre les dades o bloquejar usuaris lícits en un entorn de producció?
3. **Poda Estructural Final**: Hi ha algun altre residu o dependència zombi a nivell arquitectònic que se'ns haja escapat de la neteja anterior?

Sigueu completament directes, ruthlessly (sense pietat) analítics, i forenses. Assenyaleu els problemes bloquejants. Està el sistema estructuralment lliure d'errades i preparat per a l'enxufe definitiu?
