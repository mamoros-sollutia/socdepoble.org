# DAFO AUDITORIA GROK (Seient Núm. 7)

## 1. Debilitats (Errors interns i fallades crítiques)
- **UX Incompleta de l'Escriptura (El "Pendent" Etern)**: Grok ha sigut l'únic en caçar una fallada d'UX vital: quan el missatge passa amb èxit al servidor, no s'actualitza l'estat local. L'usuari es queda veient `"enviament: pendent"` per sempre.
- **Rollback Fràgil (Trencament de Vincles)**: Ens recorda que si el servidor accepta però l'ID canvia, la UI no s'assabentarà perquè només fa rollbacks per ID local, provocant una desincronització de l'estat.
- **Engoliment de Refresh**: Grok detecta que el listener de `visibility` (BroadCastChannel) crida a `refreshData` i engoleix silenciosament qualsevol error de connexió.
- **Avisos Orfes**: Grok s'uneix al consens de Gemini avisant que manca capturar l'esdeveniment `sdp:chat-rejected` a nivell d'UI (a `App.jsx`).

## 2. Amenaces (Vulnerabilitats de Seguretat i Integritat)
- **Ficció al Xat (Fallback)**: `getThreadMessages` enganya injectant `buildFallbackMessages` si un fil no té missatges. Aquest residu de l'antic mode simulat fa creure que hi ha converses on no n'hi ha. Grok ho considera perillós en producció.
- **`merge-duplicates` nociu**: L'ús del pragma de Supabase `Prefer: resolution=merge-duplicates` és un residu pensat per al *retry* en offline. Ara que estem en online-estricte, això pot provocar que un segon client sobreescriga en silenci les dades de l'original.
- **Corrupció JWT Indetectada**: Assenyala l'ús de `localUser?.id` extret de localStorage sense validació de caducitat del token (només s'assabenta al primer error 401). 
- **Confirma l'Amenaça del TDZ**: Igual que Claude i Codex, posa damunt la taula l'error de ReferenceError de `asseguraMetode` que trenca tota l'aplicació a l'inici.

## 3. Fortaleses (La Pedra Seca que aguanta)
- Validació rotunda de l'estructura de fitxers al port: Grok aprecia el disseny de dues fases (`configura()` -> `arrenca()`) i el descriu com "millora real" i "superfície global única". Reconeix que el patró d'enxufabilitat i rollback pessismista en escriptura **és funcional i efectiu**.

## 4. Oportunitats (Camí a la Implementació)
- **Neteja d'Híbrids i Fallbacks**: Hem d'eliminar de soca-rel `buildFallbackMessages` i la preferència per `merge-duplicates`.
- **Estat "Enviat"**: Afegir una actualització d'estat a la UI una vegada la xarxa retorna un èxit, traient els elements de l'estat "pendent".
- **Purga de Claus Mortes**: Eliminar les variables zombis detectades (`APP_SNAPSHOT_STORAGE_KEY`, branques `seed` impossibles a `getResolvedConfig`).

---
> **VEREDICTE ACTITUDA DAFO:**
> Grok ens ha donat la capa de visibilitat (UX i sincronització d'estat a la memòria) que ens faltava. Mentre els altres miraven si s'escrivia o no, Grok ha comprovat *què sent l'usuari*. Hem detectat el fenomen del "pendent etern". La ronda d'auditories es pot donar per tancada. Som-hi a preparar el Master Plan!
