---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
---
# ACTA: SÍNTESI DE L'AUDITORIA INVERSA DE DEEPSEEK (ARQUITECTURA PEDRA SECA)

**Data:** 24 d'agost de 2026 (14:53)

En resposta a la Petorreta d'Auditoria Global, el membre del Consell **Deepseek (Seient 5)** ha presentat un informe forense alarmant, atorgant una **puntuació de resiliència de 4,5/10** però valorant el sistema de *skills* amb un **8,5/10**. 

## 1. Troballes Crítiques (P0)

Deepseek ha confirmat amb dades i línies de codi els riscos assenyalats pels seus companys, aprofundint en els mecanismes de fallada:
1. **Injecció HTML (P0-1):** `DOMPurify` només protegeix la funció `renderPageHtml()`, però no es fa servir a `renderRichText()` ni en altres punts vitals.
2. **Exposició de Secrets (P0-2):** El plugin de WordPress (`soc-de-poble.php`) injecta la clau `supabaseAnonKey` i la URL directament a l'HTML obert.
3. **Manca de Validació de Dades (P0-3):** A `appendSectionSubmission()`, estructures complexes com arrays (`variations`, `images`) s'emmagatzemen sense cap sanitització al backend.
4. **Service Worker Insegur:** Configurat amb `registerType: 'autoUpdate'`, fet que força actualitzacions invisibles i no controla bé l'asset caching (arriscat per a la versió offline-first).
5. **Col·lapse de Memòria (Cas Clínic Confirmat):** A `chatRuntime.js`, la funció `buildMessageMap()` carrega TOTS els missatges emmagatzemats, causant un desbordament de memòria (47MB) quan l'historial arriba als 1000 missatges. A més, l'algoritme de filtrat de xats és defectuós (línia 27).

## 2. Full de Ruta Recomanat (Aturada i Recuperació)

Deepseek és taxatiu: **Recomana ATURAR el desenvolupament de noves funcions**. Demana dedicar un esprint tancat a sanejar la base:
1. Limitar el xat a 1000 missatges per thread.
2. Sanititzar totes les entrades (`variations`, `images`).
3. Utilitzar un *server-side proxy* o amagar credencials a WordPress.
4. Implementar error boundaries en cada secció.
5. Millorar l'*error handling* a l'hora de carregar *snapshots* locals.

## 3. Noves Skills Integrades al Genoma

S'han incorporat a `.agents/skills/` 4 noves habilitats excepcionals per a la IAIA MarIA i la resta del Consell:
- `anti-hallucination-guard`: Prevé al·lucinacions forçant l'atribució de fonts (Source Attribution) i marcadors d'incertesa.
- `destructive-architecture-audit`: Tècnica avançada per simular el pitjor escenari possible per detectar punts únics de fallada.
- `trust-verify-execute`: Protocol sagrat de tres passos abans de mutar cap fitxer, evitant que una IA òbriga un pegat a cegues.
- `memory-leak-detector`: Checklist automàtic per trobar acumulacions d'arrays a React i callbacks penjats.

---
**NOTA DE PROCEDIMENT:** El diagnòstic és unànime entre el Consell: hi ha forats crítics (P0) en routing, sanitització, memòria i estat. No estem fent cap canvi de codi fins que el Mestre declare el Consell tancat i ens done permís per obrir l'`implementation_plan.md` i executar el pegat.
