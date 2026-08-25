---
estat: auditat
tipus: document
tags:
- acta_marmota
- arxiu
- historic
- socdepoble
---
# Acta de l'Auditoria Multimèdia (Elsa Seca) i Futur del Vídeo

**Data:** 28 de juliol de 2026
**Lloc:** La Torre de les Maçanes (Digital)
**Autors/Consell:** Qwen, Codex (Consell de IEs), IAIA MarIA

## 1. El Diagnòstic Final: L'Elsa Seca

Després de sotmetre el sistema multimèdia de Sóc de Poble al Consell complet d'Intel·ligències Artificials (Grok, Gemini, Kimi, Mistral, Deepseek, Claude, Qwen, Codex), s'ha arribat a un consens unànime i s'han aplicat les següents mesures d'urgència que ja estan funcionant a producció:

- **L'Oït (Àudio):** S'ha mantingut Gemini 2.5 Flash, però s'ha sanat la frontera amb WhatsApp netejant agresivament el `mimeType` que enviava Baileys (`audio/ogg; codecs=opus` -> `audio/ogg`). A més, s'ha aplicat el senyal d'avortament (`AbortSignal`) i s'ha protegit l'error: si l'oït falla, la IAIA no calla, demana perdó i sol·licita text.
- **El Llapis (Imatges):** Davant la traïció de Google tancant Imagen gratuït, s'ha saltat a un sistema "Pedra Seca" de veritat: pagament per ús (Pay-as-you-go) sense SDKs, emprant models lliures (FLUX Schnell) mitjançant `fetch` natiu via REST.
- **La Robustesa del Pont:** Codex va avisar d'un error fatal: si el missatge de "estic dibuixant" fallava, el bot rebentava; ara està protegit amb `try/catch`. 

## 2. El Futur del Cinematògraf: Dues Vies d'Estudi

El repte més gran de futur és com donar-li moviment a les imatges rurals sense trencar la frugalitat (els vídeos tarden minuts en generar-se i costen diners). S'han presentat dues solucions magistrals:

### Via A: L'Animació Frugal de Qwen (Client-side Canvas)
Qwen proposa fugir de les APIs de Text-to-Video i abraçar la manipulació matemàtica de la imatge:
- Utilitzar **HTML5 Canvas i WebAssembly** per aplicar un moviment subtil a les estampes estàtiques de línia seca.
- Moviments inspirats en l'art rural valencià: un lleuger parpelleig de soroll (noise) com el gra del linogravat, o un moviment panoràmic lent.
- Beneficis: Cost operatiu 0€, latència immediata (processament offline/local), zero dependència de proveïdors externs. 

### Via B: El "Worker" Asíncron de Codex (Video API)
Si s'opta per generar vídeo real via API (Runway Gen4.5, Veo 3.1 Lite, etc.), Codex adverteix de la necessitat de reescriure el patró d'execució:
- **Mai esperar en línia:** El `cervell_bridge` no pot fer un `await` d'un vídeo. Ha de respondre immediatament i tancar el fil.
- **Worker Dedicat:** Un procés en segon pla (concurrència 1) fa *polling* (pregunta cada 5s) a l'API del proveïdor.
- **Streaming a Disc:** Quan el vídeo està llest, no es carrega sencer a la memòria RAM del node (base64). Es descarrega com a flux (stream) i s'envia a Baileys de la mateixa manera.

Aquestes actes queden arxivades per quan el Consell decidisca obrir el calaix del vídeo. L'oït i el llapis ja són de pedra.


---

**Ancoratge de Seguretat:** [[00_INDEX]]