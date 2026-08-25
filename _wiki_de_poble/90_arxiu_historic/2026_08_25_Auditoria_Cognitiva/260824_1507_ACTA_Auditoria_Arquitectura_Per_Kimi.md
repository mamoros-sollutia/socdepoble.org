---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
---
# ACTA: SÍNTESI DE L'AUDITORIA INVERSA DE KIMI (ARQUITECTURA PEDRA SECA)

**Data:** 24 d'agost de 2026 (15:07)

En resposta a la Petorreta d'Auditoria Global, el membre del Consell **Kimi** ha lliurat el seu veredicte com un enginyer de mines, atorgant un **6.5/10** inicial amb visió d'assolir el 9/10 un cop aplicats els pegats.

## 1. El Mapa de la Fortalesa (Les Coses Bones)
- El mecanisme híbrid de `supabaseBackend.js` (Supabase → localSnapshot → seed) és una triple corona de persistència excel·lent per a entorns de muntanya.
- L'organització per seccions permet aïllar les fallades de manera efectiva.

## 2. Escletxes Crítiques Identificades (Categoria-α)

Kimi detalla els punts estructurals que minen el sistema, amb prioritat d'actuació:
1. **La Trinxera XSS (α1 - Alta):** Encara que s'usa DOMPurify, els paràmetres per defecte són massa permissius. Cal un filtre molt més estricte, prohibint atributs com `style`, `onload`, `onclick`.
2. **El Pou de Memòria (α2 - Urgent):** Fer servir `localStorage` per a tot l'estat provoca un error de `QuotaExceededError` silenciós (causa probable de l'amnesia de xats massius). Obliga a migrar a **IndexedDB**.
3. **randomUUID (α3 - Urgent):** L'ús de `crypto.randomUUID` sense fallback a `ConnectarSection.jsx` dinamita la secció en dispositius antics (Manament 7).
4. **Dependència Circular (α4 - Mitja):** L'arquitectura actual voreja els límits del cicle entre els `sectionContent` i `mediaContent`. Demana una capa pura de dades (`rawSeeds.js`).
5. **Re-render Monolític (α5 - Alta):** `AppDataContext` gestiona massa estat alhora. Una pulsació repinta el Mapa i el Mercat sencer. Recomana particionar context i virtualitzar.
6. **Violació d'Estils Inline (α6 - Urgent):** Múltiples components utilitzen `style={{...}}`, no només ensuciant el codi sinó permetent atacs de *clickjacking*. Cal purgar tots els inline i convertir-los en classes de Pedra Seca.
7. **Pont P2P (α7 - Mitja):** `devicesRuntime.js` no valida el `origin` de l'emissor al BroadcastChannel, permetent injeccions.
8. **Absència de CSP (α8 - Alta):** Cap Content Security Policy definida a `index.html`. 
9. **ReDoS al Markdown (α9 - Mitja):** El parser de expressions regulars podria bloquejar el procés si processa masses caràcters seguits.
10. **El Head Global (α10 - Baixa):** `useSEO` actua sobre el `<head>` principal tot i conviure en un Shadow DOM, deixant meta-tags òrfenes.

## 3. L'Arsenal Cognitiu (4 Noves Skills)

Kimi ha proporcionat 4 habilitats formidables al Consell de la Petorreta per a protegir la base:
- `pedra-seca-security-audit`: Protocol d'auditoria per prevenir XSS i injeccions destructives en aplicacions React offline-first.
- `react-memory-thermodynamics`: Estratègies de "Guillotina Topològica" i neteja de `listeners` per a optimitzar la memòria en un iPad A10.
- `prompt-architecture-council`: Un marc de treball (identitat, teatralitat) per a mantenir una veu pròpia de la IAIA en debats d'arquitectura amb altres IAs.
- `offline-first-resilience-engineer`: Patrons arquitectònics per mantenir un Mas robust en àrees de baixa cobertura.

---
**NOTA DE PROCEDIMENT:** El consens total del consell és impressionant, posant l'enfocament en la persistència ineficient (`localStorage`), els errors de routing/render global, i la falta d'un `tanca.mjs` de seguretat.
Estem a l'espera de la *Segona Part* de Claude, que ha de lliurar precisament les eines de tancament i seguretat de codi per coronar aquestes auditories.
