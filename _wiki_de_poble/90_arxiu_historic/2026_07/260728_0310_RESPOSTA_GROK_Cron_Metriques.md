---
estat: auditat
tipus: document
tags:
- arxiu
- historic
- resposta_ia
- socdepoble
---
# PETICIÓ DE CODI PER A GROK (Cron i Mètriques)

**Instrucció per a Javi:** Copia el text de davall i passa-li'l a Grok perquè ens done el codi de la purga automàtica i les mètriques.

---

Benvolgut Consell (Grok),

Ens ha encantat la teua proposta d'afegir el cron de purga automàtica i les mètriques de rendiment. Això és el que realment converteix un "bot" en un sistema de grau de producció (Enterprise) preparat per a una auditoria europea de 50.000€.

Per favor, passa'ns el **codi exacte en JavaScript (Node.js)** per a implementar aquestes dues peces:

### 1. Cron de Purga Automàtica (Neteja GDPR)
Escriu el codi per a automatitzar l'execució de la funció `purgeExpired()` de la memòria episòdica.
- Volem un script lleuger (pots usar `node-cron` o directament `setInterval` si és més "Pedra Seca") que s'assegure de netejar els fitxers JSON de memòria que hagen superat el TTL dels 90 dies.
- Mostra'ns exactament on i com l'hem d'iniciar (per exemple, a `bot/index.mjs` o `bot/cervell.mjs`).

### 2. Mètriques de Rendiment (Observabilitat)
Escriu el codi per a recollir les mètriques bàsiques del sistema sense afegir infraestructura pesada (sense Prometheus, tot "Pedra Seca").
- Volem un *logger* estructurat i lleuger (un fitxer `metrics.json` o semblant) que compte coses com: latència de Gemini (temps de resposta), nombre de tokens estimats, nombre d'errors (timeouts o fallades d'API), i nombre de memòries creades.
- Aquestes mètriques seran or per justificar l'impacte i la sostenibilitat energètica a la subvenció! 

Passa'ns el codi llest per a copiar i pegar. Confiem en tu!


---

**Ancoratge de Seguretat:** [[00_INDEX]]