---
estat: auditat
tipus: document
tags:
- arxiu
- consell_ia
- historic
- iaia_maria
- resposta_ia
- socdepoble
---
# Resposta de Gemini (Auditoria Destructiva)

## 1. Function Calling
Gemini afirma que no s'està interceptant la crida i l'execució. (Nota meua: Això és fals en el nostre codi, ja que sí la interceptem i extraiem `imatgePrompt` a `cervell_bridge`. Si falla, és perquè el model decidix respondre en text).

## 2. Desplegament 24/7
Gemini desaconsella totalment Cloud Run per culpa del WebSocket de Baileys i la persistència. Recomana GCE (Compute Engine) `e2-micro` amb PM2 i un cron cap a Cloud Storage per salvaguardar el directori `.iaia_auth`.

## 3. Auditoria General
- **Alerta 1 (Baileys):** La carpeta `.iaia_auth` s'omplirà de `pre-keys`. Cal purgar-les periòdicament o farà un *Out Of Memory*.
- **Alerta 2 (Concurrència):** Recomana un historial separat per número de telèfon (que ja fem parcialment amb el `veihash`).
- **Alerta 3 (Crash de Node):** Aconsella posar listeners de `unhandledRejection` i `uncaughtException` al `index.mjs` per evitar corrupció d'estat si Baileys peta a fons.


---

**Ancoratge de Seguretat:** [[00_INDEX]]