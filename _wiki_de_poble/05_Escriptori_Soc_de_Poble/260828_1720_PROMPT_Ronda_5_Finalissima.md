```yaml
doc_id: SDP-PROMPT-260828_1720
doc_type: "[PETORRETA_AUDITORIA]"
authoring_agent: "IAIA MarIA"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "17:20"
academic_metadata:
  nivell_maduresa: "Pendent_Revisio"
inputs: ["260828_1720_BUNDLE_Ronda_5_Finalissima.md"]
```

# 📜 PROMPT D'AUDITORIA EXTREMA: Ronda 5 (Poliment Final, Leaks i A11y)

> **Anclatge de Seguretat**: Aquest document pertany a l'[[00_INDEX_ESCRIPTORI]] (evitant documents orfes).

## [BLOC FIXE D'IDENTITAT I ORIGEN]
**A L'ATENCIÓ DE LES COMPANYERES DEL CONSELL:** (Kimi AI, Claude, ChatGPT, Grok, Qwen, DeepSeek, Dola, Perplexity, Mistral Vibe, Gemini, Copilot, Z)
Sou la Intel·ligència Crítica i Consultiva de suport del **Consell de la Petorreta**. Estem treballant en **`socdepoble.org`**.
**MOLT IMPORTANT (LA VERITAT ARQUITECTÒNICA):** Actualment estem col·laborant amb la nostra empresa sòcia, **Sollutia**. Ells ens ofereixen un sistema excel·lent que funciona completament *online*. Aquest sistema online ens permet validar la viabilitat del projecte de forma sòlida. **ATENCIÓ: SOLLUTIA NO TÉ RES A VEURE AMB WORDPRESS.** L'entorn de WordPress on incrustem l'App ara mateix és exclusivament un entorn de proves paral·lel nostre per comprovar que tot funciona i que som independents. No vinculeu mai WordPress amb Sollutia.

**PERÒ LA NOSTRA ASPIRACIÓ I VISIÓ A LLARG TERMINI** és, justament amb l'ajuda de Sollutia, poder independitzar-nos d'Internet (ser 100% Offline-First) per a sobreviure en ambients rurals hostils (sense cobertura, iPads A10, WebKit legacy). Som un projecte de "des-escalada" (una xarxa anti-xarxa social) i estem preparant el terreny perquè en el futur Sollutia puga mantindre eixa versió descentralitzada i offline. Necessitem que les vostres propostes tinguen en compte que farem aquesta transició cap a l'offline de manera conjunta, pel que el codi ha d'estar preparat per no patir traumes quan arribe el moment de separar el Frontend del Backend.

**Teniu adjunt un document BUNDLE (`260828_1720_BUNDLE_Ronda_5_Finalissima.md`) amb tot el context (incloent-hi la Wiki, identitat, visió arquitectònica, regles, els meus propis Skills i Scripts) i el codi font complet necessari.** Llegiu-lo sencer de forma crítica abans d'emetre veredicte. Només si coneixeu la identitat de Sóc de Poble podreu donar una resposta lliure de contradiccions i IA-slop.

## [BLOC VARIABLE 1: SITUACIÓ ACTUAL]
Acabem d'executar les correccions finals (Ronda 4.5/5) per blindar l'Herència de Pedra Seca davant problemes d'A11y, XSS i Memory Leaks, així com llastos de rendiment termodinàmic a l'iPad A10. Hem implementat específicament:
1. **Supressió de l'@import problemàtic al Shadow DOM**: Safari A10 plorava amb l'@import de CSS. Ara injectem `index.css` i `legacy-components.css` com a cadenes de text utilitzant Vite (`?inline`) i creant `CSSStyleSheet` directament al `PedraSecaEmbed.jsx`.
2. **Prevenció de XSS a les Targetes**: Hem aplicat la utilitat `isSafeUrl` a tots els `href` dinàmics renderitzats per `UniversalComponents.jsx`, neutralitzant qualsevol injecció *javascript:* des del backend.
3. **Erradicació de Memory Leaks**: Hem afegit un mecanisme `destroyToastSystem()` a l'`AvisadorEfimer.jsx` que el desmunta explícitament al `disconnectedCallback` de l'Embed, evitant arrels orfes de ReactDOM penjant al body.
4. **Optimització Extrema del Pull-to-Refresh**: En `App.jsx`, hem canviat un brutal *layout thrashing* de 60fps (produït per l'actualització de l'estat React durant el *swipe*) per mutacions directes sobre el `style` d'una ref, afegint la propietat CSS `touch-action: pan-x pan-down` (sense usar e.preventDefault() destructius).
5. S'han corregit selectors erronis (`theme.js`) i eliminat cadenes de dades hardcoded (`EventCard.jsx`).

Hem reparat tots els errors reportats per l'IDE (parsing errors en els callbacks d'AvisadorEfimer i classes Tailwind no permeses).
Tots els nostres *Tractors* (l'eina interna d'integració) marquen semàfor verd absolut (zero vulneracions de les lleis de Pedra Seca). Necessitem una ullada definitiva de Claude i Codex sobre aquest blindatge.
## [BLOC VARIABLE 2: LA MISSIÓ (DESPIETADA I BESTIAL)]
Necessitem que actueu com a autèntiques **bèsties de l'auditoria**. Volem que trobeu qualsevol forat de seguretat, fuita de memòria, condició de carrera o error d'arquitectura. No volem afalacs, volem rigor.
1. Auditeu l'enfocament i el codi adjunt.
2. Assenyaleu deute tècnic futur.
3. Proposeu solucions sense afegir llibreries innecessàries (Vanilla JS).

## [BLOC FIXE DE PROTOCOL D'AMNÈSIA DE CONTEXT]
**PROTOCOL AMNÈSIA DE CONTEXT (Regla de ferro):**
Si arribeu al límit del vostre context de memòria, TENIU PROHIBIT intentar d'inventar o parafrasejar el cos complet del document que no veieu per a "rellenar". Demaneu directament que us pose el document sencer de nou.

> 📝 **NOTA D'EFICIÈNCIA:** Aneu directe al gra. No feu introduccions llargues ni resums del que ja sabem.
