# DAFO AUDITORIA CLAUDE (Seient Núm. 5)

## 1. Debilitats (Errors interns i fallades crítiques)
- **Bloqueig d'Arrancada (TDZ)**: L'aplicació ni tan sols arranca per un error de sintaxi P0 (Temporal Dead Zone) a `backendPort.js`, ja que `asseguraMetode` es crida abans d'estar definit. Cap linter actual ho detecta.
- **Engoliment Silenciós d'Errors**: A `AppDataContext.jsx:440-452`, quan l'estat està carregant (`rawData === null`), `sendChatMessage` resol l'escriptura satisfactòriament sense fer res. L'optimisme s'ho engoleix.
- **Desconnexió Lectura/Escriptura**: `mergeById` no s'està utilitzant a `supabaseBackend.js`. Això vol dir que l'usuari publica a `section_submissions`, la xarxa diu "OK", però quan el mur recarrega de `app_content`, la publicació desapareix per a l'autor.
- **Simetria Imperfecta a l'Enxufe**: `host.js` importa *sempre* Supabase. A més, `arrenca()` injecta 4 mètodes d'amagat (`refreshSession`, etc.) que esquiven la rigidesa del contracte.

## 2. Amenaces (Vulnerabilitats de Seguretat i Integritat)
- **Ceguesa de Backend (RLS Desconegut)**: El fitxer `schema.sql` no s'ha enviat. Ara mateix el client posa ell mateix qui és l'autor llegint-ho del `localStorage` (`owner_user_id`). Sense RLS estricte al servidor, qualsevol pot suplantar a qualsevol altre.
- **Falsificació d'Administrador**: `isSuperAdmin` s'extrau del `localStorage`. Si el servidor no ho valida amb RLS, la UI s'obrirà a tothom qui edite el seu JWT al navegador.
- **Orfandat de Convidats**: `reclamaContingutDelConvidat` és una funció mentidera. Retorna sempre èxit sense fer res. Totes les publicacions d'un invitat es queden òrfenes quan aquest es registra.
- **Residus Zombi (Paranys Actius)**: Queden peces de l'antic sistema (usuari simulat, persistència manual en `storage.js` engolint quota) que podrien reactivar-se.

## 3. Fortaleses (La Pedra Seca que aguanta)
- **Aïllament de Contracte Assolit**: El contracte a `backendPort.js` està perfectament tancat (14 mètodes d'entrada i 14 d'eixida). Cap component de React arriba ja a Supabase. 
- **Integració de Bundle Garantida**: L'script extractiu funciona, tots els sha256 validen. L'ecosistema d'auditoria és un èxit.
- **Tancament d'XSS**: S'han tancat vectors d'atac amb DOMPurify on pertoca.

## 4. Oportunitats (Camí a la Implementació)
- **Nou Tractor de TDZ**: Claude ens regala `tractor-tdz.mjs`. El podem connectar immediatament a la porta (`npm run porta`) perquè mai més ens explote l'aplicació per una variable declarada tard.
- **Injecció de Fusió (PEDAC 03)**: Claude ens dona el codi per a resoldre la desaparició de contingut (fusionant correctament `section_submissions` cap als estats del mur). 
- **Validació Definitiva de RLS**: Ara sabem que per al proper bundle a les IAs pesades (o per tancar l'auditoria) hem d'incloure la carpeta `supabase/schema.sql` de forma imperativa.

---
> **VEREDICTE ACTITUDA DAFO:**
> Hem d'agrair profundament la troballa del TDZ (que ens haguera tombat a producció). Tot i que l'auditoria dóna solucions directes (com `tractor-tdz.mjs` i `PEDAC_03`), l'ordre de la IAIA MarIA és **NO actuar encara**. Desa aquesta anàlisi, espera la resposta dels altres membres del Consell i actua en bloc quan tinguem tota la informació.
