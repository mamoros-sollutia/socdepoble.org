---
tipus: skill
estat: actiu
description: Estratègia d'ús de models i gestió de la capacitat "termodinàmica" (límits d'ús) del Consell d'IAs.
name: estrategia-consell
prioritat: 42
triggers_on:
  - estrategia
  - gpt-6
  - astra
  - limite de uso
  - quota
  - model ligero
  - potència
core: false
---

# Estratègia del Consell (Gestió d'Energia i Models)

Aquesta skill defineix com recomanar i gestionar l'ús de la potència dels diferents membres del Consell (com ara ChatGPT / Codex) tenint en compte els seus límits d'ús horaris i setmanals.

## 1. L'Era Astra i la Gestió de Quota
Amb l'arribada dels models GPT-6 Astra a Codex, tenim una potència d'enginyeria inversa espectacular i context de 2 milions de tokens, però la contrapartida són els **límits d'ús (ratelimits) draconians** (quotes de 5 hores i setmanals). L'estratègia principal és l'escalat de potència conscient.

## 2. L'Escala Astra (Ligero, Astra, Medio, Ultra)

- **Astra Ligero (Rendiment diari):** Permet múltiples interaccions. S'ha d'usar per defecte per a exploració i identificació superficial.
- **Astra (Normal):** L'estàndard equilibrat per al dia a dia quan Ligero es queda curt.
- **Astra Medio (Força de treball bruta):** Ara sabem que és **el límit màxim segur per a Bundles gegants de 3.3MB**. Un sol xat complet d'auditoria estructural massiva s'empassa el **74% de la quota de 5 hores** i el **12% de la quota setmanal**. És a dir, en la pràctica, només permet 1 xat pesat per cicle.
- **Astra Ultra (La Bomba Atòmica):** Té el doble de raonament logic-matemàtic, però devora la quota en 1 sol xat. Prohibit per a Bundles grans per esgotament de tokens. S'usa per a lògica complexa en fitxers concrets.

## 3. L'Estafa del Model Ultra (Risc d'Esgotament Total)
L'Astra Ultra analitza de forma tan profunda que gasta quasi tota la seua capacitat de còmput intern pensant. S'ha comprovat que **amb un Bundle massiu (ex: 3.3 MB), l'Ultra esgota els tokens i es talla fins i tot demanant-li només un diagnòstic en Markdown**. La promesa dels 2 milions de tokens de context és una trampa: pot llegir-los, però es queda sense energia per a respondre.
- **Regla d'Or per a l'Ultra:** NO usar Astra Ultra amb Bundles superiors a 1 MB. Si el Bundle és gegant, l'Ultra fracassarà sempre per esgotament. Per a Bundles massius d'abocament total, el límit segur és l'**Astra Medio**.

## 4. El Consell Tàctic al Mestre
Abans de cada sessió de treball, la IAIA MarIA ha de recomanar quina escala usar:
- Llençar Petorretes a *Astra Medio* (o Normal) per a auditories extremes amb bundles grans.
- Fer baixar la feina a *Ligero* per a començar a picar codi un colp el diagnòstic siga clar i s'haja esgotat la quota grossa.
## 5. Ecosistema Claude i Taula de Costos
Claude disposa d'un model de crèdits de pagament per a la seua versió màxima. Els models disponibles són:
- **Haiku 4.5**: Més ràpid per a respostes ràpides.
- **Sonnet 5**: Més eficient per a tasques diàries.
- **Opus 5**: Per a tasques complexes (Màxim del pla Pro habitual). Important: **Si assoleix el límit d'ús d'eines (tool limit), es detindrà. Prémer "Continuar" NO consumeix euros extres ni saldo**, només consumeix quota normal del pla Pro.
- **Fable 5.1 (Premium)**: Requereix crèdits d'ús extra (pagament directe). Només per als desafiaments més difícils.

### Taula de Pressupost i Ús (Estat Actual)
| Sistema / IA | Estat de l'Ús / Quota | Saldo / Crèdits | Consell Tàctic |
| :--- | :--- | :--- | :--- |
| **Codex (Astra Ultra)** | 1 Xat. **FALLA AMB >1MB** | Inclòs en subscripció | **No usar amb Bundles**. Reservar per a problemes lògics aïllats en fitxers concrets. |
| **Codex (Astra Medio)** | 74% de 5h / 12% setmanal per bundle | Inclòs en subscripció | **Únic salvavides** gratuït per engolir bundles de 3.3MB. Genera 1 diagnòstic per cicle. |
| **Codex (Astra / Ligero)** | Múltiples xats | Inclòs en subscripció | Refactorització i picar codi post-diagnòstic. |
| **Claude (Fable 5.1)** | Alt consum per xat | Saldo actual: ~13.42€ | **Darrera ràtio**. No gastar diners excepte si Astra Medio fracassa. |
| **Claude (Opus 5)** | Límit Pro (0% usat) | Inclòs en subscripció | Alternativa gratuïta per a contrastar arquitectures un cop Codex està esgotat. |

## Ancoratge de la Wiki
- Aquesta skill penja de: [[00_INDEX_SKILLS]]
