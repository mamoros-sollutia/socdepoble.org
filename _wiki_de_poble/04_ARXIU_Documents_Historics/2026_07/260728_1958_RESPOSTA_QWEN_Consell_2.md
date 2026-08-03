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
# Resposta de Qwen (Auditoria Destructiva)

## 1. Function Calling
Sense el codi, especula que és un problema d'ubicació de la propietat `tools` en la crida de configuració. (Com ja he descobert jo, estava equivocat).

## 2. Desplegament 24/7
Acord unànime ratificat (ja van 6 membres del Consell): **Compute Engine (VM e2-micro)**.
Descarta de ple Cloud Run. Proposa Ubuntu LTS + disc persistent `pd-balanced` de 20GB. Assenyala la necessitat de fer un servei de `systemd` que incloga la directiva `Restart=always`.

## 3. Auditoria General
Com els altres, alerta sobre les promeses no resoltes (`unhandledRejection`) i proposa la combinació d'eixe control amb el servei de `systemd` per aconseguir un grau d'estabilitat extrema (el procés peta -> systemd el torna a alçar).
També recomana estendre el `onFatal` del Baileys per fer un `process.exit(1)` per a forçar el reinici.


---

**Ancoratge de Seguretat:** [[00_INDEX]]