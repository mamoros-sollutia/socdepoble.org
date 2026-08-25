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
# Resposta de DeepSeek (Auditoria Destructiva)

## 1. Function Calling
Aponta al mateix bucle d'execució ("No reenvies el resultat al model") i al mapeig de noms de `tools`. Com la resta, demana el codi de `cervell.mjs` per confirmar.

## 2. Desplegament 24/7
Acord unànime ratificat per DeepSeek: **Compute Engine (VM e2-small)** a `europe-west1`. 
Confirma la necessitat d'un disc persistent de 10GB i PM2 o Docker. Torna a descartar Cloud Run i GKE per ser inadequats per a la persistència de Baileys.

## 3. Auditoria General
Alerta de diversos colls d'ampolla:
- **Memory Leak a la Història:** Avisa que si no limitem la quantitat de missatges per sessió, la memòria petarà (això ja ho fem parcialment guardant només els últims 8, però està bé tindre-ho en compte per a millorar-ho).
- Injecció de Prompts.
- Càrrega síncrona a `iniciaCervell`.


---

**Ancoratge de Seguretat:** [[00_INDEX]]