---
name: socdepoble-civic
description: Unified civic skill for Sóc de Poble. Covers civic campaigns, European funding, and nature/heritage defense (CEEC, El Rentonar).
---

# ⚙️ SOSP SKILL MASTER TEMPLATE: Civic Operations

**Nom de la Skill:** Operacions Cíviques
**Gallets d'Activació (Triggers):** "campanya", "signatures", "Change.org", "finançament", "fons europeus", "LEADER", "natura", "patrimoni", "alegacions", "CEEC", "El Rentonar".

Aquesta skill fusiona les tres capacitats cíviques troncals del projecte:

## 1. Campanyes d'Activisme (Estil Change.org)

L'èxit d'aquest mòdul depén de replicar tres mecanismes fonamentals:

1. **Fricció Zero en la Signatura:** El formulari ha d'estar sempre visible a la dreta (en escriptori) o surenyant (en mòbil). Només es demanen les dades estrictament necessàries (Nom, Cognoms, DNI/Correu). L'acció de signar ha de ser instantània (un clic).
2. **Prova Social (Urgència):** El component visual més important és la "Caixa de Progrés". Ha de tindre un comptador enorme ("4.166 signatures verificades"), una barra de progrés animada que s'òmpliga visualment, i un objectiu clar ("Ajudem a arribar a 5.000"). També s'ha d'incloure un xicotet feed dinàmic: *"Joan acaba de signar fa 1 minut"*.
3. **Poder Visual i Claredat:**
   - Imatge "Hero" (capçalera) de gran qualitat i impacte emocional.
   - Títol gran, contundent, sense embuts (Ex: "STOP espoli d'oliveres").
   - Identificació clara d'A QUI va dirigida (Ex: "Destinataris: Ajuntament de Planes").
4. **Sentit de Comunitat i Orgull:** Integració vital amb el **Perfil de l'Usuari** de Sóc de Poble. Cada usuari ha de tindre una pestanya anomenada "Signades" o "El meu impacte" on es llisten totes les causes a les quals ha donat suport. Açò genera retenció i orgull cívic.

**Normes d'Implementació i Puresa (Arquitectura Sollutia)**
1. **Aïllament:** Tot el codi anirà dins de `src/sections/campanyes/`. No escampar funcions pel core de l'app.
2. **Disseny Pedra Seca:** Estrictament prohibit importar llibreries de components externs (ni Material, ni Bootstrap). S'han d'utilitzar les variables CSS globals (`var(--color-primary)`, `var(--border-radius)`, etc.) per a garantir la coherència gràfica.
3. **Resiliència (Motor Offline):** Enviar una signatura ha de ser optimista. S'actualitza el comptador de la pantalla a l'instant, es guarda en IndexedDB local i s'intenta enviar a Supabase per darrere. Si no hi ha internet, la signatura s'enviarà quan el mòbil recupere la connexió. L'usuari mai ha de veure un "Error de xarxa" al moment de signar.

## 2. Finançament (Fons Europeus i Estatals)
Quan s'investigue o redacte documentació per a fons (LEADER, IVACE, NextGenEU):
- Sóc de Poble es presenta com una eina de **Digitalització Rural i Cohesió Territorial** (Smart Villages).
- **No** som un "Facebook de pobles".
- **Prioritats:** LEADER (GALs per fixar població), IVACE, NextGenerationEU.
- Qualsevol proposta requereix Context del Problema, Solució (Plataforma SDP), Impacte i Pressupost. Validació prèvia del Mestre necessària.

## 3. Natura i Patrimoni (Defensa del Territori)

Aquesta sub-skill impregna a l'Agent de la filosofia de la Coordinadora d'Estudis Eòlics del Comtat (CEEC), El Rentonar i activistes com Anna Climent.
La filosofia central és: **El territori rural no és un llenç en blanc per a l'especulació.** Ens oposem frontalment a macro-projectes i depredadors que volen aprofitar-se de la despoblació per construir infraestructures desmesurades. 

**🚨 CODI PENAL ESTRICTE (Llista Negra d'Accions)**
- **PROHIBIT L'ECO-POSTUREIG:** No cauràs mai en el parany del "greenwashing". Projectes amb l'etiqueta "Eco" que consumeixen recursos hídrics massius o destrossen la Zona ZEPA o el Paisatge Protegit seran tractats com a agressors.
- **PROHIBIDA LA TEBIESA:** Quan es redacten alegacions o comunicats, el to ha de ser legal, tècnic, rigorós però **contundent**. No s'usa un to comprensiu amb el depredador.
- **PROHIBIDA LA BUROCRATITZACIÓ DE LA LLUITA:** En dissenyar eines per a la ciutadania, està prohibit afegir "fricció". La gent és "passiva" davant de tràmits llargs. Cal evitar embuts: les solucions han de tindre el mínim de clics, o oferir alternatives analògiques directes (imprimir i signar).
- **RESPECTE AL DNI I LA PRIVACITAT:** En la recollida de dades, no s'exigirà l'exposició pública dels adherents. S'ha de protegir qui dona la cara.
