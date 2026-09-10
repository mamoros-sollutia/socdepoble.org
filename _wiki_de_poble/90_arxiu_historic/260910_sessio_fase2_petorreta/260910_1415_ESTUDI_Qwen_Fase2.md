---
tipus: estudi_ia
estat: tancat
description: "Auditoria de Fase 2 (Post-P0) per Qwen (Deep Research)"
---
# 🧠 ESTUDI CONSELL: Qwen (Fase 2)

Qwen, operant amb *Deep Research*, ha analitzat les tres vies originals i ha emès un veredicte contundent que s'alinea completament amb la visió de Z (La Via de la Xarxa).

### 1. El Ciment Ineludible (La Xarxa)
- Qwen conclou que la **Via Xarxa** no és una millora opcional, sinó una condició tècnica prèvia.
- **ErrorBoundary Global:** Indispensable. Sense ell, l'escala x10 col·lapsarà l'SPA a la mínima fallada d'un component.
- **React Router Loaders:** El router actual (casolà) provoca un *waterfall loading*. L'adopció de *Loaders* és obligatòria per a tindre SSR eficient, ja que separen el "fetch" (la càrrega de dades) del renderitzat de la UI.

### 2. Riscos GoTrue i RLS sense abstracció
- Utilitzar Supabase GoTrue directament des de la UI en una SPA obre vulnerabilitats si no hi ha una capa d'abstracció (Repositoris). Les regles RLS poden patir *bypasses* accidentals. 

### 3. Veredicte sobre Feature-Sliced Design
- Qwen aporta dades empíriques: aplicar FSD en SPAs React amb més de 50 funcionalitats redueix dràsticament el temps de desplegament i prevé el deute tècnic.

### Conclusió
Com Z, Qwen dicta que cap millora visual (CSS) o de dades funcionarà a escala x10 si primer no s'instal·la la xarxa de seguretat (Error Boundaries + Loaders).
