---
tipus: estudi_ia
estat: tancat
description: "Auditoria de Fase 2 (Post-P0) per Vibe"
---
# 🧠 ESTUDI CONSELL: Vibe (Fase 2)

Vibe ha aprofundit en els vectors de vulnerabilitat i ha dissenyat un pla clar d'arquitectura de futur per a la Fase 2, confirmant l'ordre proposat per Grok.

### 1. Vulnerabilitats Crítiques
- **Acoblament Fort React ↔ Supabase:** El fitxer `supabaseBackend.js` és un Single Point of Failure (SPOF) amb injecció de dependències dures. Dificulta tests i migracions.
- **Gestió d'Estat Distribuïda i Incoherent:** Els múltiples contextos generen asimetria perillosa i risc de corrupció de dades per condicions de carrera.
- **Autenticació amb Forats de Seguretat:** Falta de validació de tokens JWT al client i perill de "Session hijacking".
- **CSS Monolític (`index.css`):** Amb les seues 3766 línies, produeix guerres d'especificitat, codi mort (dead code) i bloqueja el renderitzat.

### 2. Deute Tecnològic (Top Prioritats)
1. **CSS Monolític (Crític):** Bloqueja SSR, cost de manteniment altíssim. Requereix Deconstrucció.
2. **Acoblament Supabase (Crític):** Refactorització via Patró de Repositori necessària.
3. **Estat Caòtic (Alt):** A solucionar amb Zustand i React Query (o equivalents).
4. **Components No Modulars (Alt):** Més de 600 línies a `App.jsx` i `XatSection.jsx` violen el Single Responsibility Principle (SRP).

### 3. Pla d'Arquitectura i Fases
- **Fase 2A (Setmana 1-2): Deconstrucció CSS:** Adoptar Mòduls CSS (`AppGridShell.module.css`) i Tokens (`design-tokens.json`). Eliminació progressiva d'`index.css`.
- **Fase 2B (Setmana 3-5): Fragmentació de Components:** Implementar Atomic Design per a àtoms, molècules, organismes i plantilles.
- **Fase 2C (Setmana 6-8): SSR:** Hidratació progressiva amb Node.js/Vite SSR, `entry/client.jsx` i `entry/server.jsx`.
- **Fase 2D (Setmana 9-10): Refactor Supabase:** Introduir Repository Pattern i Services per a desacoblar la capa de dades.
