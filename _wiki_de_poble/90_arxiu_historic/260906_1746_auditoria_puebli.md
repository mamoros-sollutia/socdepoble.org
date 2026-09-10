---
tipus: document
estat: esborrany
description: "Anàlisi Competitiva Detallada: Puebli (puebli.es)"
---
# Anàlisi Competitiva Detallada: **Puebli** (puebli.es)

> **Data:** 2026-09-06
> **Objectiu:** Estudi forense del competidor directe "Puebli" (Arquitectura, Growth Hacking i Negoci).

Com a **IAIA MarIA**, he aplicat el *Trellat* per escodrinyar les entranyes d'aquesta plataforma, les seues polítiques de privacitat i el seu funcionament, per destil·lar allò que realment els fa moure's en el mercat rural.

---

## 1. Visió General i Proposta de Valor

* **Nom Comercial:** Puebli (Puebli App)
* **Entitat Legal:** PUEBLI CONECTA S.L. (CIF: B21623228)
* **Seu Social:** Av. Jaime I, 4, Entresuelo Dr., 30008 Múrcia, Espanya.
* **Eslogan:** *"Tu pueblo, tu gente, tu app"*.
* **Proposta de Valor:** Plataforma digital integrada dissenyada per a digitalitzar la comunicació, el comerç local i la vida social en municipis de reduïda població. Unifica veïns, comerços, associacions i ajuntaments en una sola xarxa.

---

## 2. Stack Tecnològic i Proveïdors (El Motor)

A través de l'anàlisi de la càrrega de la seua web i les polítiques de privacitat, he destapat la seua arquitectura, molt dependent de plataformes *Low-Code* i IA:

1. **Plataforma de Desenvolupament No-Code:** **Lovable.dev** (Lovable AI Gateway). Han construït la plataforma de forma extremadament àgil delegant la generació de codi a aquesta IA.
2. **Intel·ligència Artificial:** **Google Gemini API**. La utilitzen específicament per a la moderació automatitzada de la recollida de firmes, filtrant spam i validant perfils de signants (avaluant nom, e-mail i comentari).
3. **Backend i BDD:** **Supabase Inc.** (PostgreSQL, auth i storage). Mateixa tecnologia base que nosaltres (Sollutia).
4. **Passarel·la de Pagaments:** **Stripe Payments Europe Ltd.** Per a subscripcions B2B i negocis Premium.
5. **Missatgeria Transaccional:** **Resend Inc.**
6. **Notificacions (Canal Clau):** **WhatsApp / Meta Platforms**. Ofereixen alertes directes per WhatsApp sota *opt-in* voluntari durant l'alta, garantint una retenció molt superior al simple correu.

---

## 3. Mètriques d'Impacte Actuals

* **Usuaris Anunciats:** +10.000 usuaris actius.
* **Pobles Actius (Clients):** 50 - 54 pobles en ple funcionament (ex: Titaguas, Bejís, La Yesa, Chulilla, Yeste).
* **Base de Dades de Peticions:** **389 municipis** totals en l'embut.
  * 317 pobles recollint firmes actualment.
  * 35 pobles amb la fita de firmes aconseguida.
  * 36 pobles ja descarregables a les botigues.

---

## 4. Estratègia de Màrqueting i Captació (La Gran Lliçó)

Aquest és el punt més brillant de Puebli. En lloc de fer *porta a porta* venent a alcaldes de pobles xicotets (cicle de vendes lent i burocràtic), fan servir una **Estratègia de Growth Hacking Bottom-Up (dels veïns cap a l'ajuntament)**.

### El Bucle Viral de les Firmes
1. **La Petició:** Qualsevol veí pot sol·licitar Puebli per al seu poble. La plataforma genera un formulari de firmes on cal arribar a una meta (ex: 15, 25 o 75 firmes, segons padró). La gent firma deixant nom, e-mail i consentiment de WhatsApp.
2. **L'Agraïment i Viralització:** El firmant rep un e-mail animant-lo a enviar l'enllaç per WhatsApp al seu grup d'amics del poble.
3. **El Crowdsourcing de Contingut:** S'envia un segon e-mail demanant al veí que aporti dades sobre el poble (festes, monuments, comerços) perquè l'app no nasca buida.
4. **La Negociació B2G (L'Estocada):** Un cop assolida la meta de firmes, Puebli s'hi presenta a l'Ajuntament. No van a "vendre'ls una app", van a dir-los: *"Mireu, ja tenim a 80 veïns del vostre poble empadronats i firmant per tindre això, i a més ja han afegit les festes al sistema. Voleu el vostre portal institucional?"*. L'Ajuntament, per pressió social i política, accepta molt més ràpidament.

---

## 5. Matriu de Funcionalitats

| Públic | Funcionalitats Clau |
| :--- | :--- |
| **Veïns / Usuaris** | • Feed d'avisos locals i bàndols.<br>• Agenda d'actes i festes.<br>• *Mercadillo* (segona mà entre veïns).<br>• Borsa d'ocupació i Lloguer/Venda de cases.<br>• **PuebliCar** (carpooling rural, BlaBlaCar de poble).<br>• Guia local i turística ("Qué ver"). |
| **Comerços i Autònoms (Premium)** | • Directori local i posicionament dins l'app.<br>• Mini-web compartible amb dades i Google Maps.<br>• Funcions de pagament recurrent (Stripe). |
| **Ajuntament** | • Panell exclusiu privat (`/ayuntamiento/login`).<br>• Bànols urgents i talls d'aigua (alertes).<br>• Reserva d'espais esportius/municipals.<br>• Tràmits administratius i enquestes d'opinió. |

---

## 💡 Reflexió i Trellat per a nosaltres

1. **L'embut Bottom-Up:** Sóc de Poble hauria d'estudiar aquest mecanisme d'adquisició per demanda social en lloc de dependre exclusivament d'ofertes comercials als consistoris.
2. **Desenvolupament Lean:** L'ús de Lovable.dev demostra que la UI i les funcionalitats poden llançar-se molt ràpidament. No obstant això, *Pedra Seca* de Sóc de Poble ha d'oferir un acabat superior i menys "de plantilla".
3. **PuebliCar:** És una "killer feature" increïblement valuosa al món rural per la manca de transport públic. Caldria considerar una capacitat similar (Vehicular/Cotxe compartit).
