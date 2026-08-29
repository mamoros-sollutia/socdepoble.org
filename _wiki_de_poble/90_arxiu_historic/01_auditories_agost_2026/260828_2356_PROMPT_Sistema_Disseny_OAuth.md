```yaml
doc_id: SDP-PROMPT-260828_2356
doc_type: "[PROMPT_AUDITORIA]"
authoring_agent: "IAIA MarIA"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "23:56"
academic_metadata:
  nivell_maduresa: "Pendent_Revisio"
inputs: ["260828_2356_BUNDLE_Sistema_Disseny_OAuth.md"]
```

# 📜 PROMPT D'AUDITORIA EXTREMA: [TÍTOL DE LA MISSIÓ]

> **Anclatge de Seguretat**: Aquest document pertany a l'[[00_INDEX_ESCRIPTORI]] (evitant documents orfes).

## [BLOC FIXE D'IDENTITAT I ORIGEN]
**A L'ATENCIÓ DE LES COMPANYERES DEL CONSELL:** (Kimi AI, Claude, ChatGPT, Grok, Qwen, DeepSeek, Dola, Perplexity, Mistral Vibe, Gemini, Copilot, Z)
Sou la Intel·ligència Crítica i Consultiva de suport del **Consell de la Petorreta**. Estem treballant en **`socdepoble.org`**.
**MOLT IMPORTANT (LA VERITAT ARQUITECTÒNICA):** Actualment estem col·laborant amb la nostra empresa sòcia, **Sollutia**. Ells ens ofereixen un sistema excel·lent que funciona completament *online*. Aquest sistema online ens permet validar la viabilitat del projecte de forma sòlida. **ATENCIÓ: SOLLUTIA NO TÉ RES A VEURE AMB WORDPRESS.** L'entorn de WordPress on incrustem l'App ara mateix és exclusivament un entorn de proves paral·lel nostre per comprovar que tot funciona i que som independents. No vinculeu mai WordPress amb Sollutia.

**PERÒ LA NOSTRA ASPIRACIÓ I VISIÓ A LLARG TERMINI** és, justament amb l'ajuda de Sollutia, poder independitzar-nos d'Internet (ser 100% Offline-First) per a sobreviure en ambients rurals hostils (sense cobertura, iPads A10, WebKit legacy). Som un projecte de "des-escalada" (una xarxa anti-xarxa social) i estem preparant el terreny perquè en el futur Sollutia puga mantindre eixa versió descentralitzada i offline. Necessitem que les vostres propostes tinguen en compte que farem aquesta transició cap a l'offline de manera conjunta, pel que el codi ha d'estar preparat per no patir traumes quan arribe el moment de separar el Frontend del Backend.

**Teniu adjunt un document BUNDLE (`260828_2356_BUNDLE_Sistema_Disseny_OAuth.md`) amb tot el context (incloent-hi la Wiki, identitat, visió arquitectònica, regles, els meus propis Skills i Scripts) i el codi font complet necessari.** Llegiu-lo sencer de forma crítica abans d'emetre veredicte. Només si coneixeu la identitat de Sóc de Poble podreu donar una resposta lliure de contradiccions i IA-slop.

## [BLOC VARIABLE 1: SITUACIÓ ACTUAL I REPTE ARQUITECTÒNIC]
Al llarg de l'evolució de l'aplicació, estem notant que la disciplina de disseny de vegades es difumina:
1. **Inconsistència d'Estils:** S'introdueixen classes CSS òrfenes o específiques en comptes d'utilitzar les estructures globals i modulars com `.form-group` o utilitats globals del sistema Pedra Seca.
2. **Components Manuals vs Natius:** Elements estructurals com l'`entradilla` s'implementen de vegades manualment en lloc de fer ús del component canònic de `UniversalPage` (`lead`) que ja assegura la consistència.
3. **Mantenibilitat Front-End per Sollutia:** Com estandarditzar açò perquè la nostra empresa sòcia Sollutia tinga un sol lloc per modificar tot l'aspecte sense tindre que bussejar en cada arxiu `JSX` de secció.
4. **Single Source of Truth per a IAIA MarIA:** Estem perdent el control sobre on l'agent guarda els arxius (per exemple, desar treball actiu a `12_actes` en comptes de `05_Escriptori_Soc_de_Poble`). Els nostres *skills* i el flux de treball necessiten ser unificats.
5. **Autenticació Distribuïda:** En fer login amb Google via Supabase, el proveïdor ens redirigeix forçosament a `socdepoble.org`. Com som un sistema que funcionarà incrustat dins de la infraestructura de Sollutia o entorns locals, l'usuari ix de l'entorn de dev/tercers en el qual es troba.

## [BLOC VARIABLE 2: LA MISSIÓ (AUDITORIA INVERSA DESPIETADA)]
Necessitem que actueu com a autèntiques **bèsties de l'auditoria** fent una **AUDITORIA INVERSA**. No es tracta de donar consells generals, sinó de reconstruir l'aplicació en el vostre espai de tokens basant-vos en el BUNDLE, adoptar la personalitat de la IAIA MarIA (defensant les seues arrels i el Trellat) i destrossar qualsevol escletxa:
1. **Auditoria del Sistema de Disseny:** Proposeu un enfocament arquitectònic a nivell de components i validació `lint/Tractor` perquè construir una vista fora dels estàndards visuals de Sóc de Poble siga **impossible o falle estrepitosament en la compilació**. Volem un "ciment armat" (Pedra Seca v2).
2. **Auditoria del Flux de Treball IAIA:** Assenyaleu per què l'agent actual està desant fitxers actius en directoris històrics. Com s'ha de configurar la Single Source of Truth dels *skills* per evitar el caos i que només hi haja UN lloc on definir la ruta de l'escriptori?
3. **Auditoria d'Autenticació OAuth:** Proposeu la millor estratègia d'autenticació (OAuth) tenint en compte que som un entorn que funciona incrustat i independent, on el proveïdor d'identitat no pot conéixer per avançat tots els possibles `localhosts` o dominis de desenvolupament sense trencar la llista blanca de redireccions.
4. Sigau pragmàtiques i directes. No avalueu només per dir "molt bé". Necessitem el vostre veredicte (mode DAFO) per blindar el projecte de dalt a baix.

## [BLOC FIXE DE PROTOCOL D'AMNÈSIA DE CONTEXT]
**PROTOCOL AMNÈSIA DE CONTEXT (Regla de ferro):**
Si arribeu al límit del vostre context de memòria, TENIU PROHIBIT intentar d'inventar o parafrasejar el cos complet del document que no veieu per a "rellenar". Demaneu directament que us pose el document sencer de nou.

> 📝 **NOTA D'EFICIÈNCIA:** Aneu directe al gra. No feu introduccions llargues ni resums del que ja sabem.
