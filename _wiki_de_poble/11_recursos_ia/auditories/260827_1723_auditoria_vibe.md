# Auditoria Vibe - 27 Agost 2026 (Sóc de Poble)

🔍 AUDITORIA TÈCNICA: ANÀLISI CRÍTICA I PROPOSTES D'ACCIO IMMEDIATA

## 1. Aïllament React i Riscos Residuals amb WordPress
Problema identificat: El canvi de BrowserRouter a MemoryRouter no garanteix aïllament absolut davant WordPress. El MemoryRouter evita col·lisions d’URLs, però el DOM global i el global scope de JavaScript segueixen sent compartits. Si WordPress o qualsevol plugin modifica el window o el DOM on es munta PedraSecaEmbed, podria corrompre l’estat de React o inyectar dependències no desitjades.
Riscs específics:
* Contaminació del global scope: WordPress o plugins poden sobreescriure variables globals (ex: window.React, window.indexedDB) o afegir event listeners que interfereixin amb el vostre codi.
* Conflictes de CSS/JS: Estils o scripts de WordPress podrien sobrescriure els vostres (ex: classes CSS, !important, o libreries com jQuery que modifiquen el DOM).
* Singleton Guard: Si el Singleton Guard no és hermètic, podria fallar en entorns amb múltiples instàncies de React.

Proposta de codi (Vanilla JS): Aïllament absolut amb Shadow DOM + iframe.

## 2. Escletxes a IndexedDB: Bloquejos Mortals i Patró Làzaro
Problema identificat: La migració a getSnapshot/saveSnapshot no garanteix que no hi hagi bloquejos durant el muntatge inicial de React. Escenaris crítics:
* Race Condition a loadAppData: Si loadAppData (asíncron) i el muntatge de React (síncron) competixen per accedir a IndexedDB, podria produir-se un deadlock si una transacció no es tanca.
* QuotaExceededError: El handler global purga IndexedDB automàticament sense verificar si hi ha transaccions obertes.

## 3. Deute Tècnic: On Estem Jugant amb Foc
* IndexedDB sense ORM: Codi manual propens a errors. Recomana `idb`.
* MemoryRouter: No suporta deep linking. Recomana `HashRouter`.
* Singleton Guard: No verifica versió de React.
* Purga automàtica: Pèrdua de dades irrecuperable.
* Dependència de Sollutia: El bootloader assumeix que `BOOTSTRAP.md` estarà disponible. Fragilitat offline.

## 4. Resiliència Màxima: Circuit Breaker i Arrendament de Registres
Problema identificat:
* El Circuit Breaker (3 falls → purga IDB) no té en compte si les falls són temporals ni si la purga resol el problema.
* Arrendament de registres: No hi ha neteja de registres obsolets a IndexedDB (ex: snapshots antics).

Proposa Circuit Breaker + Cleanup de registres amb backoff exponencial.

## Pregunta clau per al Consell:
Quina d’aquestes propostes (aïllament amb iframe, Circuit Breaker millorat, o cleanup de snapshots) voleu que implementem primera? O preferiu una revisió més profunda d’algun punt en concret?
