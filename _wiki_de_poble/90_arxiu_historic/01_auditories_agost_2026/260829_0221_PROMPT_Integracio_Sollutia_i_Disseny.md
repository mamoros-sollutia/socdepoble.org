```yaml
doc_id: SDP-PROMPT-260829_0221
doc_type: "[PETORRETA_AUDITORIA]"
authoring_agent: "IAIA MarIA"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "02:21"
run_id: "manual"
academic_metadata:
  nivell_maduresa: "Pendent_Revisio"
inputs: ["260829_0221_BUNDLE_Integracio_Sollutia_i_Disseny.md"]
```

# 📜 PROMPT D'AUDITORIA: Integració Sollutia i Sistema de Disseny

> **Anclatge de Seguretat**: Aquest document pertany a l'[[00_INDEX_ESCRIPTORI]] (evitant documents orfes).

Salutacions a tot el Consell: Kimi AI, Claude, ChatGPT, Grok, Qwen, DeepSeek, Dola, Perplexity, Mistral Vibe, Gemini, Copilot i Z.

Us convoque per a una auditoria DAFO (Debilitats, Amenaces, Fortaleses, Oportunitats) del codi adjunt en el BUNDLE associat. Abans d'emetre qualsevol veredicte, és imperatiu que interioritzeu la següent realitat arquitectònica per no jutjar fora de context:

## CONTEXT GLOBAL I VISIÓ (Qui Som)
1. **Identitat:** Som "Sóc de Poble", una xarxa "anti-xarxa social" (de des-escalada) dissenyada per a entorns rurals. Utilitzem un sistema de disseny asèptic i indestructible anomenat "Pedra Seca", programat en Vanilla JS i CSS pur. Som pragmàtics: menys dependències, més resistència.
2. **L'Aspiració (Offline-First):** L'objectiu a llarg termini és ser una aplicació de tipus Offline-First / Local-First (a l'estil d'Obsidian), 100% descentralitzada. Tot el codi nou ha d'afavorir aquesta futura transició.
3. **La Veritat Actual (Sollutia):** Actualment col·laborem amb l'empresa sòcia *Sollutia*, que ens proveeix un backend robust (Supabase). Açò és un peatge temporal i pragmàtic (Online-First) per validar la viabilitat. **Molt Important:** Sollutia NO té res a veure amb WordPress. Qualsevol patró que proposeu ha de conviure pacíficament amb el codi de Sollutia perquè ells puguen mantindre-ho sense fricció.

## OBJECTIU DE L'AUDITORIA
Analitzeu el codi font adjunt al BUNDLE (generat per la IAIA MarIA i el Mestre Javi) i centreu-vos en aquests dos punts crítics:

1. **Integració Base (Backend):** Hem finalitzat la connexió de totes les seccions dinàmiques (`mur`, `mercat`, `events`, `multimedia`, `notes`) a través del `ConnectarSection.jsx` i `supabaseBackend.js`. Avalueu la robustesa d'aquestes connexions, la sanitització de dades i el merge local/remot. Hi ha fuites de dades o riscos de pèrdua d'estat?
2. **Sistema de Disseny (Frontend):** Hem estès l'arquitectura UI "Pedra Seca" a les noves seccions. Hem creat un disseny tipus Google Photos per a `MultimediaSection` (photo-grid) i un layout de 3 columnes tipus Obsidian per al `Blog de Notes` (`notes-shell`). Avalueu el CSS, l'accessibilitat, el suport mòbil (responsive), i si aquests nous patrons visuals són coherents amb l'arquitectura CSS Vanilla del projecte.

Vull una anàlisi DAFO despietada, paranoica i defensiva sobre la robustesa d'aquesta base abans de construir cap nova funcionalitat. No doneu res per suposat. Si hi ha un forat o un defecte d'arquitectura, assenyaleu-lo. Mantenim el "Trellat".

**Teniu adjunt un document BUNDLE (`260829_0221_BUNDLE_Integracio_Sollutia_i_Disseny.md`) amb tot el context i el codi font complet necessari.** Llegiu-lo sencer de forma crítica abans d'emetre veredicte.

**PROTOCOL AMNÈSIA DE CONTEXT (Regla de ferro):**
Si arribeu al límit del vostre context de memòria, TENIU PROHIBIT intentar d'inventar o parafrasejar el cos complet del document que no veieu per a "rellenar". Demaneu directament que us pose el document sencer de nou.

> 📝 **NOTA D'EFICIÈNCIA:** Aneu directe al gra. No feu introduccions llargues ni resums del que ja sabem.
