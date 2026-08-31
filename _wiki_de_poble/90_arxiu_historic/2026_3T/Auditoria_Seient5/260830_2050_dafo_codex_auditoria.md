# DAFO AUDITORIA CODEX (Seient Núm. 4)

## 1. Debilitats (Errors interns i fallades crítiques)
- **Confirmació dels Bloquejants P0**: Codex corrobora fil per randa les tres grates errades trobades per Claude: el **TDZ a `backendPort.js`**, la **desaparició de publicacions (falta d'ús de `mergeById`)**, i la **ceguesa sobre l'esquema RLS**.
- **Falsos Èxits (Fals Optimisme)**: S'ha detectat que si el backend retorna un error silenciós, `undefined` o `false`, la promesa es resol com a positiva i l'UI no fa el rollback. L'enxufe no audita la resposta.
- **Rollback Destructiu**: En el cas d'una edició (on l'ítem ja existeix), si l'escriptura falla al servidor, el rollback elimina l'element per complet de la UI en lloc de restaurar la versió prèvia.
- **Errors Invisibles**: El xat emet `sdp:chat-rejected` però la UI no l'escolta per mostrar un avís a l'usuari. L'autoguardat de les notes engoleix l'error amb un simple `console.error`.
- **Fuga de Seguretat a l'OAuth**: Codex ha detectat que l'emergent d'OAuth fa `postMessage` des del mateix origen de l'App (després de la redirecció), però el *listener* de l'App l'espera des de l'origen del Relé, rebutjant-lo. A més, `netejaRetorn` deixa el fragment (`#sdp_code`) visible a la URL, exposant el codi.

## 2. Amenaces (Vulnerabilitats de Seguretat i Integritat)
- **Hibridació Obligatòria a `host.js`**: `arrenca()` sempre importa Supabase i fusiona els mètodes. Si el backend de Sollutia no implementa un mètode per oblit, l'App es connectarà a Supabase de forma fantasma en compte de trencar-se i avisar. **El contracte no és excloent.**
- **Carrera d'Injecció Tardana**: L'`await import(supabase)` obri una finestra asíncrona on `configura()` pot ser cridada i introduir un backend alternatiu just abans de segellar el contracte, creant una condició de carrera.
- **Acoblament Tòxic al Contracte**: `getResolvedConfig` encara demana i retorna les claus de Supabase (`supabaseUrl`, `supabaseAnonKey`), trencant l'agnosticisme total del contracte.

## 3. Fortaleses (La Pedra Seca que aguanta)
- El procés d'extracció del bundle és madur. El model "Sol" de nivell mitjà ha estat capaç d'ingerir, comprendre i creuar milers de línies de codi de manera impecable.
- Els canvis estructurals fets fins ara (com evitar imports directes a `supabaseBackend.js` des de React) han funcionat i Codex els valida com un "progrés real".

## 4. Oportunitats (Camí a la Implementació)
- **Redisseny de `host.js`**: Podem convertir l'arrencada en un sistema **excloent i síncron**. O hi ha backend injectat o hi ha Supabase, mai una quimera dels dos.
- **Validació de Respostes**: És el moment de tipificar el que torna el backend. Exigirem que els mètodes d'escriptura retornen un objecte estructurat `{ success: true, data: ... }` i llançaran error en cas contrari.
- **Estratègia de Rollback**: Substituirem el filtre destructiu per un sistema d'emmagatzematge del *snapshot* previ a nivell de component o mètode, per garantir que si l'edició falla, tornem a la versió original, no al no-res.

---
> **VEREDICTE ACTITUDA DAFO:**
> L'anàlisi de Codex ha sigut demolidor però necessari. S'ha focalitzat especialment en l'agnosticisme (Sollutia Readiness) i els fluxos d'error (Rollback Destructiu, OAuth). Les seues observacions completen perfectament el diagnòstic de Claude. Mantindrem la disciplina: observem, desem el DAFO i esperem a les IAs gratuïtes abans de teclejar codi.
