---
estat: auditat
tipus: document
tags:
- acta_marmota
- arxiu
- historic
- socdepoble
---
# Acta de Tancament: 27 i 28 de Juliol de 2026 (La Gran Destil·lació Tècnica)

## 1. Estat de Situació (El que hem aconseguit hui)
Mestre, ha sigut una jornada històrica. Hem passat de tindre un "bot que contesta" a tindre un sistema autònom, blindat i preparat per a operar al món real sense dependre de ningú (Arquitectura de Pedra Seca).

### Avenços Tècnics al Cervell i WhatsApp:
- **Pont Infrangible:** Hem reescrit `whatsapp_baileys.mjs` i `cervell_bridge.mjs` per tindre un adaptador robust. Ara el bot pot gestionar notes de veu i generació d'imatges sense que l'arquitectura col·lapse.
- **RAG Local:** El sistema llig directament de la Wiki del poble per obtindre context, sense enviar dades privades a servidors externs innecessaris.
- **Resolució d'Errors Crítics:** 
  - Hem arreglat un error sintàctic (una cometa invertida furtiva) que trencava `cervell.mjs`.
  - Hem ajustat la crida a l'API de Gemini (la caixa `config`) perquè reconega correctament les "Tools" (funcions de dibuix) i les Instruccions de Sistema.
  - Hem afegit el control d'errors per a **Quota Exceeded (429)**. Ara la IAIA avisa quan hem esgotat les peticions gratuïtes per minut de Google.

### Estratègia i Producte:
- **Memòria Episòdica (RAG Biogràfic):** Hem deixat preparat el concepte per demanar-li al Consell (Grok/Claude/ChatGPT) el codi exacte per a recordar als veïns preservant la privacitat.
- **La Subvenció dels 50.000€:** Hem redactat la *Petorreta* completa (`260728_0220_PETORRETA_IAIA_50k_Consell_FULL.md`) amb tot el context i codi, llesta per ser auditada pels models superiors.

## 2. La qüestió del pagament i NotebookLM (La Web de Carmen)
M'has preguntat pels pagaments a Google i per NotebookLM per a Carmen. Aci està el resum:

- **Pagaments API vs Usuari:** Tu pagues la subscripció d'usuari a Google (Advanced), però el bot utilitza l'API Key de desenvolupador en la versió gratuïta ("Free Tier"). Per això hi ha límits (15 peticions/minut). Demà podem veure de posar-la de pagament per ús en Google Cloud, però mentrestant ens val per a proves.
- **NotebookLM per a Carmen:** Totalment d'acord! És la millor eina per a ella perquè funcione en un entorn segur. Ho explicarem bé demà.
- **La Web de Carmen (Astro):** I tant, et faré el prompt perfecte ("Super Prompt") per a que ho passes pel Consell (Claude o Grok) i et vomiten tot el codi de la web d'una tirada, sense que hages de teclejar quasi res.

## 3. Planificació per a Demà
1. **Auditoria del Consell:** Passar la *Petorreta* dels 50K a Grok/Claude per obtindre el codi definitiu de la Memòria Episòdica.
2. **Implementació Final:** Integrar eixe codi al `cervell.mjs`.
3. **El Cas Carmen:** Redactar el "Super Prompt" per a l'arquitectura de la seua web amb Astro i Markdown, i muntar-li el seu "Brain" amb NotebookLM.

Ara sí, apaguem llums i baixem la persiana. El Mas està segur i la IAIA es queda vigilant. Bona nit!


---

**Ancoratge de Seguretat:** [[00_INDEX]]