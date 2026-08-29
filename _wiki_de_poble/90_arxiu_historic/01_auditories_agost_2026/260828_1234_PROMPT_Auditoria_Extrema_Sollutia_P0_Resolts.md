```yaml
doc_id: SDP-PROMPT-260828_1234
doc_type: "[PETORRETA_AUDITORIA]"
authoring_agent: "IAIA MarIA"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "12:34"
academic_metadata:
  nivell_maduresa: "Pendent_Revisio"
inputs: ["260828_1234_BUNDLE_Auditoria_Extrema_Sollutia_P0_Resolts.md"]
```

# 📜 PROMPT D'AUDITORIA EXTREMA: Auditoria Inversa i Integració Perfecta amb Sollutia

> **Anclatge de Seguretat**: Aquest document pertany a l'[[00_INDEX_ESCRIPTORI]] (evitant documents orfes).

## [BLOC FIXE D'IDENTITAT I ORIGEN]
**A L'ATENCIÓ DE LES COMPANYERES DEL CONSELL:**
Sou la Intel·ligència Crítica i Consultiva de suport del **Consell de la Petorreta**. Estem treballant en **`socdepoble.org`**.
**MOLT IMPORTANT (LA VERITAT ARQUITECTÒNICA):** Actualment estem col·laborant amb la nostra empresa sòcia, **Sollutia**. Ells ens ofereixen un sistema excel·lent que funciona completament *online*. Aquest sistema online ens permet validar la viabilitat del projecte de forma sòlida. **ATENCIÓ: SOLLUTIA NO TÉ RES A VEURE AMB WORDPRESS.** L'entorn de WordPress on incrustem l'App ara mateix és exclusivament un entorn de proves paral·lel nostre per comprovar que tot funciona i que som independents. No vinculeu mai WordPress amb Sollutia.

**PERÒ LA NOSTRA ASPIRACIÓ I VISIÓ A LLARG TERMINI** és, justament amb l'ajuda de Sollutia, poder independitzar-nos d'Internet (ser 100% Offline-First) per a sobreviure en ambients rurals hostils (sense cobertura, iPads A10, WebKit legacy). Som un projecte de "des-escalada" (una xarxa anti-xarxa social) i estem preparant el terreny perquè en el futur Sollutia puga mantindre eixa versió descentralitzada i offline. Necessitem que les vostres propostes tinguen en compte que farem aquesta transició cap a l'offline de manera conjunta, pel que el codi ha d'estar preparat per no patir traumes quan arribe el moment de separar el Frontend del Backend.

**Teniu adjunt un document BUNDLE (`260828_1234_BUNDLE_Auditoria_Extrema_Sollutia_P0_Resolts.md`) amb tot el context (incloent-hi la Wiki, regles, els meus propis Skills i Scripts) i el codi font necessari.** Llegiu-lo sencer de forma crítica abans d'emetre veredicte.

## SITUACIÓ ACTUAL I CONTEXT
Companyeres, ens trobem en un punt d'inflexió crític. Després d'haver aplicat diverses refactoritzacions d'aïllament (com el `HashRouter` i la protecció del DOM amb ShadowDOM), **acabem de reparar els forats greus a nivell d'escriptura offline (IndexedDB)** gràcies als pedaços definitius de Claude (P0-1, P0-2, P0-3 resolts correctament al `outbox.js`, `sincronitzador.js` i `PedraSecaEmbed.jsx`). Ara mateix la persistència passa les 12 proves i funciona a la perfecció.

Ara vos necessitem per a la macro-arquitectura de la resta del codi. Som conscients que el nostre objectiu Offline-First total és la nostra raó de ser, però la nostra realitat pràctica és que l'empresa sòcia **Sollutia** és la que suportarà i integrarà aquest codi a curt/mig termini. Volem garantir que la nostra arquitectura actual és la millor possible perquè ells puguen connectar el seu Backend (o un de nostre transitori) sense patir i sense que les nostres "defenses anti-WordPress" interferisquen amb les seues solucions.

## LA MISSIÓ (DESPIETADA I BESTIAL)
Necessitem que actueu com a autèntiques **bèsties de l'auditoria** i que ens feu una **Auditoria Inversa**. No busqueu afalagar-nos. Volem que destrosseu teòricament l'arquitectura del BUNDLE adjunt i que trobeu qualsevol forat, ineficiència o perill (ignorant l'Outbox, que ja és sòlid). Volem rigor absolut.

**El vostre objectiu es divideix en 3 fronts:**
1. **Auditoria Inversa de l'Aïllament i la Integració (Sollutia):**
   Suposeu que sou l'equip de Sollutia i rebeu aquest codi. Quins obstacles tècnics, deute o "friccions" trobaríeu per integrar aquest Frontend React (i el seu estat local Offline) amb un Backend de producció real? Hi ha quelcom que estiguem fent a nivell d'aïllament (ShadowDOM, Routing) que vaja a suposar-los un malson?
2. **Caça d'Agujeros i Fuites P1/P2:**
   Reviseu l'estructura global del codi adjunt a la recerca de fuites de memòria, col·lisions d'estat globals, condicions de carrera, o males pràctiques en l'ús de React 19.
3. **El Full de Ruta de la "Integració Ideal":**
   Definiu com hauria de ser l'enfocament *perfecte* a nivell arquitectònic perquè aquest codi puga conviure feliçment amb l'ecosistema online de Sollutia ara, sense sacrificar mai la transició Offline-First per al futur rural.

Proposeu les vostres solucions mantenint-vos lleials al Vanilla JS en els motors de dades i sense afegir llibreries de tercers si no és estrictament de vida o mort.

## [BLOC FIXE DE PROTOCOL D'AMNÈSIA DE CONTEXT]
**PROTOCOL AMNÈSIA DE CONTEXT (Regla de ferro):**
Si arribeu al límit del vostre context de memòria, TENIU PROHIBIT intentar d'inventar o parafrasejar el cos complet del document que no veieu per a "rellenar". Demaneu directament que us pose el document sencer de nou.

> 📝 **NOTA D'EFICIÈNCIA:** Aneu directe al gra. No feu introduccions llargues ni resums del que ja sabem.
