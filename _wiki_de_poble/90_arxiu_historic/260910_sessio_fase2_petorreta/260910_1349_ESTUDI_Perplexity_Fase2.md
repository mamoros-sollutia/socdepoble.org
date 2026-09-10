---
tipus: estudi_ia
estat: tancat
description: "Auditoria de Fase 2 (Post-P0) per Perplexity"
---
# 🧠 ESTUDI CONSELL: Perplexity (Fase 2)

Perplexity ofereix una visió més profunda i alerta sobre riscos de seguretat, discrepant lleugerament en l'ordre d'execució respecte a la resta del Consell (posant l'autenticació per davant del CSS).

### 1. Risc Sever: Autenticació i Model de Tenant
- **RLS Incompleta:** Un error ací permetria a un usuari veure o modificar dades d'un altre (creuament de tenants). Les polítiques han de ser estrictes a Supabase, no a la UI.
- **JWT a localStorage:** Vulnerabilitat XSS. S'ha de canviar cap a un sistema més segur i centralitzat (`AuthProvider`).

### 2. Frontera de Dades (React ↔ Supabase)
- El client de Supabase està massa exposat als components. La UI no hauria de fer crides directes, sinó consumir *hooks* o selectors purs.

### 3. Estat i Realtime
- L'embut de contextos (magatzem global de tot) provoca dependències implícites. 
- Subscripcions al xat o mur han de ser idempotents per evitar missatges duplicats per race conditions de xarxa o reconnexions.

### 4. Visió del Deute CSS
- El deute no és l'`index.css` per se, sinó l'acumulació de "classes orfes" i "tokens fantasma".
- Perplexity proposa una estructura en capes (`@layer reset, tokens, foundations, primitives...`) mantenint-ho tot orquestrat per `index.css` sense reescriure-ho de colp (SDP-LOCK actiu per evitar destruccions massives).

### 5. Ordre de Gravetat (La Discrepància)
Per a Perplexity, l'ordre d'emergència és:
1. Autorització i model de tenant (Fase 2A - Seguretat).
2. Contracte de dades i estat remot (Fase 2B - Arquitectura).
3. Identitat visual i CSS (Fase 2C - CSS).
4. Shell de layout i SSR (Fase 2D).
