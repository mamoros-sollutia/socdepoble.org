# Anàlisi del Bundle d'Auditoria de Sóc de Poble

He llegit el bundle complet (428 fitxers, 3,27 MB). A continuació us presento una anàlisi estructurada del contingut, centrada en els aspectes més rellevants per a una auditoria del projecte.

---

## 1. Identitat i Filosofia del Projecte

**Sóc de Poble** és un portal de pobles connectats, concebut com un "Mas Electrònic" amb una identitat arrelada al món rural valencià. La seva missió és atorgar sobirania tecnològica a la gent gran del medi rural, allunyant-se del Big Tech.

### Conceptes Clau
- **Trellat**: Saviesa pràctica, sentit comú, simplicitat i evidència abans d'afirmar.
- **Pedra Seca**: Sistema de disseny que prioritza la simplicitat, accessibilitat i resiliència, evitant dependències innecessàries.
- **IAIA MarIA / Antigravity**: L'ens híbrid que combina la IA (Gemini) amb la saviesa humana del Mestre Javi.
- **El Consell de les 12 Petorretes**: Dotze IAs externes (Z.ai, Qwen, Deepseek, Dola, Kimi, Claude, Perplexity, Mistral Vibe, Grok, Gemini, Copilot, ChatGPT Codex) que actuen com a auditors i col·laboradores.

---

## 2. Arquitectura Tècnica Implementada

### Stack Tecnològic
- **Frontend**: React 18.3.1 + Vite 7.1.0
- **Enrutament**: React Router DOM 7.12.0
- **Persistència**: Supabase (backend remot) + Dexie (local, parcial)
- **Editor de text**: Tiptap (editor ric)
- **Estils**: CSS natiu amb tokens semàntics (`--sdp-*`), Tailwind restringit a layout
- **Estat**: Context API amb AppDataProvider

### Decisió Arquitectònica Vigent
- **Online-First estricte** (ADR-2026-08): el sistema depèn de Supabase com a font de veritat. La visió Local-First/CRDT és futura, no implementada.
- **Baseline 2022**: Safari/iOS 16, Chrome 100. No es suporten dispositius anteriors.

### Estructura de Directoris
```
src/
├── app/           # Context i component principal
├── components/    # Components reutilitzables (universals, layout)
├── config/        # Configuració global (tokens, seccions, i18n)
├── data/          # Capa de persistència (backendPort, supabaseBackend)
├── sections/      # Seccions de l'aplicació (xat, mur, mercat, notes, etc.)
├── utils/         # Utilitats (sanitize, imageUtils)
├── css/           # Estils globals (index.css, design-tokens.css)
└── assets/        # Recursos estàtics
```

---

## 3. Governança i Normativa (03_GOVERNAR)

El projecte disposa d'un marc normatiu complet:

### Lleis i Protocols
- **LLEI_05_Privacitat**: Privacitat per defecte, consentiment explícit, dret a l'oblit.
- **Protocol de Petorreta** (PROTOCOL_PETORRETA.md): Procés d'auditoria externa amb `open → seal → verify → consume`.
- **SDP_LOCK**: Bloqueig de protecció verificable per a mutacions sense lease vàlida.
- **FORJA_TO_CORE**: Proposta futura per extreure components purs de React, no implementada.

### Plans Directors
- **Pla Director Legal i de Subvencions**: Estratègia jurídica (Associació sense ànim de lucre) i mapa de subvencions (LEADER, NGI Fediversity, CERV, etc.).
- **Pla Director de Viabilitat Econòmica**: Model d'ingressos (convenis, subvencions, mecenatge) i pressupostos (50.000 € any 1, 95.000 € any 3).

---

## 4. Eines i Portes Mecàniques (Tooling)

El projecte disposa d'un conjunt extens de scripts de verificació (tractors/portes) que garanteixen la integritat del codi i la wiki:

### Portes Principals
| Porta | Funció |
|-------|--------|
| `tractor-arrel` | Verifica que cap eina calculi l'arrel pel seu compte |
| `tractor-consell` | Auditoria global de la Regla Sagrada (cens de les 12 IAs) |
| `tractor-cens` | Assegura que el cens de membres és complet i coherent |
| `tractor-cens` (cromàtic) | Verifica tokens de color i contrastos |
| `design_guard` | Controla infraccions de disseny (colors cru, Tailwind visual) |
| `tractor-pedra-seca` | Verifica classes CSS òrfenes, tokens fantasma, estils en línia |
| `tractor-tokens` | Vocabulari tancat: cap `var(--sdp-*)` sense definició |
| `tractor-frontmatter` | Valida metadades dels documents markdown |
| `tractor-rutes` | Assegura que les rutes canòniques provenen de la SSOT |

### Eines de Manteniment
- **`crear_bundle.mjs`**: Genera bundles d'auditoria amb manifest SHA256.
- **`matrix.mjs`**: Bootloader cognitiu que carrega el context rellevant per a cada petició.
- **`reflex_petorreta.mjs`**: Protocol d'efectes laterals (open/seal/consume).
- **`plaquetes.mjs`**: Sistema immunitari que diagnostica fantasmes i orfes al graf.

---

## 5. Estructura de la Wiki (4+2 Pilars)

La documentació està organitzada en quatre pilars operatius i dues zones de cicle de vida:

| Pilar | Contingut |
|-------|-----------|
| **00_SER** | Identitat, genotip, equip IA, perfil psiquiàtric, soci Sollutia |
| **01_SABER** | Cultura, trellat, glossari, memòria del poble |
| **02_ACTUAR** | Arquitectura tècnica, plantilles, skills, scripts |
| **03_GOVERNAR** | Normativa, lleis, estàndards, plans directors |
| **04_ESCRIPTORI** | Treball actiu i safata d'entrada |
| **05_ARXIU** | Memòria històrica curada |

---

## 6. Deute Tècnic Declarat

El projecte gestiona el deute mitjançant fitxers JSON de baseline a `.agents/deute/`:

- **`.design-guard-deute.json`**: 125 estils en línia, 33 colors cru, 12 elements tàctils petits.
- **`.pedra-seca-deute.json`**: 116 classes òrfenes, 10 tokens fantasma, 121 estils en línia.
- **`.vocabulari-deute.json`**: 168 classes forasteres, 3 fitxers CSS de secció.
- **`.promesa-deute.json`**: 9 promeses P2, 5 promeses P3 (pendents de resolució).

> **Nota**: El deute declarat només pot baixar. Cada baseline és un sostre, no un permís per créixer.

---

## 7. Estat Actual i Objectius

### Fet (Collita Tancada)
- Onboarding funcional (creació de perfil, empresa, grup)
- Bloc de notes privat amb editor Tiptap
- Xat simulat amb missatgeria bàsica
- Sistema de targetes universals (UniversalCard / UniversalPage)
- Graella de tres columnes (AppGridShell)
- Autenticació amb Supabase (email + Google OAuth)
- Mecanisme de Petorretes per a auditories externes

### En Desenvolupament (Sementeres)
- Publicació al mur des del bloc de notes
- Connexions P2P (WebRTC) en fase experimental
- RAG local per a consultes sobre documentació
- Millores d'accessibilitat (WCAG AA/AAA)
- Integració amb Sollutia (backend)

### Visió Futura
- Sobirania total (Local-First / CRDT)
- Xarxa mesh entre dispositius (WebRTC)
- IAIA MarIA completament offline (NPU local)
- Pont amb WhatsApp

---

## 8. Punts d'Atenció per a l'Auditoria

1. **Verificació del Bundle**: El manifest inclou SHA256 de cada fitxer. Podeu verificar la integritat extraient el cos i comparant sumes.

2. **Fitxers Absents (no crítics)**:
   - `vite.standalone.config.js`
   - `.agents/deute/.frontmatter-deute.json`

3. **Deute Acumulat**: Especialment a la capa de disseny (estils en línia, classes òrfenes) i a les rutes (literals orfes).

4. **Dependències Externes**: El projecte usa `@supabase/supabase-js`, `@tiptap/react`, `lucide-react`, `dompurify`. Cap altre paquet extern en producció.

5. **Seguretat**:
   - Xifratge local de dades sensibles no implementat (es fa servir Web Crypto només per a OAuth PKCE).
   - Cues offline no implementades (mode Online-First).
   - Les polítiques RLS de Supabase estan definides (schema.sql).

---

## 9. Conclusió

Sóc de Poble és un projecte madur, amb una arquitectura ben definida, una governança sòlida i un compromís clar amb la transparència i la sobirania tecnològica. El sistema de portes mecàniques (tractors) garanteix que les normes es compleixin, i el deute tècnic està documentat i controlat.

La principal recomanació per a futures iteracions és:
- Reduir el deute de disseny (estils en línia, classes òrfenes).
- Implementar proves de resiliència offline (actualment només es declara com a objectiu).
- Completar la integració amb Sollutia per al desplegament en entorns productius.

---

**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]

*Informe generat a partir del bundle d'auditoria del 2026-09-06. Verificable mitjançant el manifest SHA256 inclòs.*
