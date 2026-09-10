---
tipus: estudi_ia
estat: tancat
description: "Auditoria de Fase 2 (Post-P0) per Dola"
---
# 🧠 ESTUDI CONSELL: Dola (Fase 2)

Dola ha analitzat el codi font POST-P0 i fa una diagnosi profunda sobre els patrons de flux de dades, aportant una solució arquitectònica unificada (FSD).

### 1. Fragilitats Estructurals i de Dades
- **Senyals de Fum (Events Globals):** Hi ha 8+ contextos independents que es comuniquen via `window.dispatchEvent`. És fràgil i no escala.
- **REST Directe vs Client Supabase:** S'usa `fetch` directe al backend. Açò provoca absència de renovació de tokens, impossibilitat de *realtime*, i absència de caché.
- **Sessió vs Identitat:** Estan perillosament desacoblades. No hi ha sincronització entre pestanyes del navegador.
- **`backendPort.js` és un Big Bang:** Amb 30+ mètodes, impedeix migrar una sola funcionalitat (ex. el Mur) cap a Sollutia.

### 2. El Vertader Deute a x10
- **Redundància i Memòria:** Sense una memòria cau centralitzada (com React Query/TanStack), l'App pateix d'Over-fetching i dades inconsistents.
- **CSS Monolític:** Conflictes d'especificitat constants.

### 3. La Visió de Dola: Feature-Sliced Design (FSD) + Hexagonal
Dola proposa no elegir entre arreglar el CSS o les Dades, sinó fer-ho alhora adoptant un patró de disseny orientat a dominis (FSD):
- **Estructura FSD:** `app/`, `features/`, `entities/`, `shared/`, `pages/`.
- **Capa de Repositoris (Hexagonal):** Abstraure Supabase darrere de repositoris purament funcionals (`PostRepository`, `ChatRepository`). Això permetrà connectar l'app a Sollutia mòdul a mòdul, no de colp.
- **CSS Modules i `@layer`:** Aplicat dins de cada component aïllat (`features/xat/ui/Chat.module.css`).
- **SSR Streaming:** "Server-Compatible per defecte". Els components naixen sent estàtics i només la "Client Boundary" fa la hidratació interactiva.
