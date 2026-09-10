---
tipus: document_estrategic
estat: obert
description: "Estratègies d'optimització i relació amb les IAs del Consell"
---
# 🧠 Estratègies per a la Relació amb les IAs (El Consell)

Aquest document centralitzat recull els patrons d'ús, casos pràctics i estratègies de mitigació quan treballem amb els diferents models del Consell d'Auditoria (siguen de pagament o no), per assegurar que el flux de treball siga sempre robust i ininterromput.

*(Ací s'aniran consolidant també les estadístiques de Claude, Code, i altres membres del Consell).*

## 1. El "Downgrade Tàctic" davant la Saturació
Quan un model capdavanter assoleix el límit d'ús, es queda penjat o rebutja connexions per saturació del servidor, cal aplicar una estratègia de contenció per no trencar l'impuls del treball. 

El cas pràctic més comú és amb **Qwen**:
- **La Configuració Òptima Inicial:** L'estàndard de màxima potència és usar `Qwen 3.8-Max` amb els modes de raonament expandit activats (*Deep Search*, *Deep Research* i *Advanced*).
- **L'Acció de Mitigació:** Quan aquesta configuració falla per saturació, s'ha de canviar manualment a la versió inferior més capaç (`Qwen 3.7-Plus`).
- **La Regla d'Or:** S'han de **mantenir sempre activats** els modes *Deep Search* i *Advanced*. Tot i baixar un graó en la versió del model, forçar-lo a iterar sobre el problema amb recerca profunda suplix la pèrdua de potència bruta. 
- *Nota d'investigació:* Caldrà investigar en el futur si existeix alguna configuració encara més potent que aquesta combinació per a Qwen.

## 2. Prevenció de Talls de Context (Límits Termodinàmics)
*(A completar a mesura que s'identifiquen nous patrons, com el que hem vist amb Deepseek i els límits termodinàmics de 2.5MB en els bundles d'auditoria).*
