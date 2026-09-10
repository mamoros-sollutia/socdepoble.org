---
tipus: estudi
estat: actiu
description: Auditoria estructural extrema (Sóc de Poble × Supabase × Sollutia)
---

# Auditoria estructural extrema (Sóc de Poble × Supabase × Sollutia)

> Som l'Associació ecologista El Rentonar i Sóc de Poble. Aquest projecte és l'hereu de més de 30 anys d'activisme rural i lluita pel nostre entorn natural i patrimonial.  
> `OBJECTIU: Enginyeria inversa i auditoria salvatge per trobar deute tècnic estructural.`

---

## 1. Resum executiu: on pot rebentar demà

- **Punt de fractura 1 — Autenticació/RLS com a “fe” i no com a sistema:** si les polítiques RLS no estan definides per a *tots* els verbs (`SELECT/INSERT/UPDATE/DELETE`), si es confia en `raw_user_meta_data` o en JWTs fràgils, tens un model d’autorizació aparent, no real.   [cleanissue.io](https://cleanissue.io/en/blog/rls-row-level-security-mistakes-guide-2026)  
- **Punt de fractura 2 — Esquema Supabase sense migracions versionades:** si el model de dades s’ha anat tocant des de Supabase Studio, sense CLI ni migracions, tens incoherències latents entre entorns i un futur on cada canvi per integrar Sollutia és una ruleta russa.   [hrekov.com](https://www.hrekov.com/blog/supabase-common-mistakes)  
- **Punt de fractura 3 — Clau `service_role` exposada o usada des del client:** qualsevol ús d’aquesta clau en React o en plugins de Sollutia converteix RLS en decoració; és via lliure a destrucció de dades.   [leanware.co](https://leanware.co/insights/supabase-best-practices)  
- **Punt de fractura 4 — Integració amb Sollutia sense límit de responsabilitats:** si el “mòdul” per Sollutia parla directament amb Supabase com si fóra un client més, sense capa de domini pròpia, acabes amb l’ERP decidint invariants de la teua base de dades.  
- **Punt de fractura 5 — Online-First sense pla de fallada:** cap estratègia clara per quan Supabase cau, Sollutia cau o la connexió rural balla—el sistema no degrada amb gràcia, simplement es trenca.

---

*(Resumit per termodinàmica. Per a llegir el contingut complet, referir-se a l'original)*

**Ancoratge de Seguretat:** [[00_index_escriptori]]
