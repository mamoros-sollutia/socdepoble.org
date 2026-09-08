---
tipus: informe
estat: actiu
description: Auditoria de mercat sobre Puebli, competidor directe en xarxes socials rurals i govtech.
tags:
  - disseny
  - arquitectura
  - govern
---

# Auditoria de Mercat: Puebli

D'acord amb el protocol de la **SKILL: Estudi de Mercat**, a continuació es detalla l'auditoria forense externa de la plataforma Puebli, analitzada el 6 de setembre de 2026.

## A. Visió General i Posicionament
- **Nom i Eslògan:** Puebli - "Tu pueblo, tu gente, tu app."
- **Empresa:** PUEBLI CONECTA S.L. (Múrcia, Espanya).
- **Proposta de Valor:** Ofereixen als ajuntaments una plataforma completa per digitalitzar i potenciar la comunicació, el comerç i la vida social del municipi.
- **Posicionament:** Es venen com la solució integral (*Tot-en-un*) per a la vida rural. 

## B. Enginyeria Inversa i Stack Tecnològic
De l'anàlisi de la seua pàgina web (puebli.es) i les seues dades estructurades deduïm:
- **Frontend Web:** Aplicació Single Page (SPA) construïda amb React i empaquetada amb Vite (s'observen els `assets/index-[hash].js`).
- **Aplicacions Mòbils:** Disposen d'apps natives/híbrides per a iOS i Android (probablement React Native o Flutter, atès l'ecosistema React de la web).
- **Analítica i Màrqueting:** Utilitzen Google Tag Manager intensament per fer seguiment de conversions.
- **Dades Estructurades (SEO):** Fan servir JSON-LD avançat (`SoftwareApplication`, `WebSite`, `Organization`) per dominar les cerques locals relacionades amb "app pobles".

## C. Estratègia de Màrqueting i Captació (Growth Hacking)
Puebli empra una **doble estratègia molt agressiva i intel·ligent**:
1. **Bottom-Up (Lleialtat Veïnal):** Tenen un botó "Solicita tu pueblo". Açò permet recollir signatures o interessos dels veïns de pobles on encara no operen. És una generació de *leads* gratuïta.
2. **Top-Down (Venda Institucional):** Amb eixa base de "veïns interessats", aborden els Ajuntaments per vendre'ls la plataforma institucional.
3. **Monetització Híbrida:** 
   - Quotes als Ajuntaments ("Para ayuntamientos: Reserva una reunión").
   - "Entitats Premium": Els comerços locals paguen per tindre presència o destacar.
   - Figura del "Socio fundador": Mecanisme de micro-mecenatge o inversió inicial.
- **Mètriques de Tracció (Reclam):** Més de 10.000 usuaris, 50 pobles i 3.000 publicacions (afirmacions de la seua landing).

## D. Matriu de Funcionalitats
L'App aglutina múltiples serveis fragmentats en una única plataforma:
- **Institucional:** Bàndols de l'Ajuntament (talls d'aigua, avisos).
- **Social / Tauler:** Esdeveniments locals, agenda, festes.
- **Economia Circular:**
  - *Mercadillo:* Compra-venda de segona mà entre veïns.
  - *Empleo:* Ofertes i demandes de faena local.
  - *Vivienda:* Lloguer i venda de cases.
- **Mobilitat (PuebliCar):** *Carpooling* rural per compartir cotxe a la ciutat, metges, o aeroports (resol un problema real de falta de transport públic).

## E. Destil·lació del Trellat (Accionables per Sóc de Poble)
Açò és el que devem interioritzar per a l'arquitectura de **Sóc de Poble** i el backend de **Sollutia**:

1. **Què hem d'aprendre i adaptar?**
   - **L'Estratègia del Cabal de Troia (Sol·licita el teu poble):** Hem de permetre que usuaris no registrats puguen "demanar" Sóc de Poble per al seu municipi. Estes sol·licituds són munició pesada per vendre Sollutia als alcaldes.
   - **Solucions de Micro-Mobilitat (Cotxe Compartit):** És una genialitat per al món rural. Deuríem modelar una taula al backend (ex. `ridesharing` o subcategoria a `market_items`) per gestionar viatges.
   - **SEO Tècnic Rigorós:** Ells dominen els metadades i el Schema.org. Nosaltres, seguint la filosofia de la Pedra Seca, hem de tindre un HTML semàntic impecable per guanyar en els motors de cerca.

2. **Què descartem per filosofia?**
   - **La saturació del "Tot-en-un" comercial:** Puebli sembla barrejar Wallapop, BlaBlaCar, InfoJobs i Facebook de forma molt comercial ("Entitats Premium"). Nosaltres busquem "El Trellat": la connexió autèntica i la simplicitat. Si un model comercial ofega la veu del poble, l'evitarem.
   - **L'excés de tracking:** Evitarem GTM i mil scripts de tercers. Sóc de Poble aposta per un ecosistema ètic i tancat, respectant la privacitat del Llibre Blanc.

3. **La Teua Funcionalitat Demanada (Perfils d'Empresa):**
   - Com has patit abans amb la BBDD, ells separen molt bé el "Vecino" (usuari final) de la "Entitat Premium" (comerç).
   - En Sóc de Poble, l'usuari (Persona) amb el seu correu ha de ser l'amo, però ha de poder gestionar "Identitats Secundàries" (Empreses, Penyes, Associacions) sense barrejar-ho amb la seua activitat personal. Esta visió ens dóna la raó en el que m'has demanat hui: l'arquitectura ha de contemplar entitats des del primer dia.

---
**Conclusió:** Puebli és un competidor fort, però purament comercial. Sóc de Poble ha de guanyar sent més proper, més humà i més "nostre" (tecnologia arrelada al territori, Pedra Seca).
