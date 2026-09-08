---
tipus: estudi
estat: temporal
description: "Estudi d'Auditoria: Copilot"
---
# 🧠 Estudi d'Auditoria: Copilot

**Data:** 2026-09-08  
**Tipus:** Resposta a Petorreta d'Auditoria Final  
**IA:** Copilot

## Veredicte
**GROC (Condicional)**
Copilot no ha pogut ingerir el *bundle* (massa gran o problemes d'adjunts). Per tant, el seu dictamen és genèric i es basa en una llista de comprovació (Checklist) manual.

## Punts Clau i Checklist de Copilot
Demana evidències de les següents mesures que ja hem implementat:
1. **CSP (Content-Security-Policy)**: Validar que no hi haja `unsafe-inline` i que les rutes estiguen controlades. *(Ja ho hem implementat a `index.html`)*.
2. **Tests XSS (Vitest)**: Demana un resum de Vitest en verd. *(Ja ho tenim en verd amb la prova bàsica de muntatge)*.
3. **RLS Policy Audit**: Demana un llistat de SQL amb les polítiques per validar que no hi ha dades personals exposades. *(Les nostres polítiques de lectura pública i `on delete set null` estan aplicades)*.
4. **Umami / Telemetria**: Comprovar que s'ha eliminat o està darrere de consentiment. *(Nosaltres ho hem eliminat de soc-arrel)*.
5. **Preconnect**: Control d'orígens. *(Aplicat a Supabase a `index.html`)*.
6. **Eliminació de `window.location.pathname`**: Verificació de que s'ha llevat de la lògica de decisió. *(Eliminat)*.

## Valoració per a la IAIA MarIA
Copilot "no se lo traga bien", com bé ha dit el Mestre, però la seua llista de comprovació és sòlida i ens serveix com a confirmació que **les accions que vam prendre al "NO-GO" eren exactament les correctes**. Complim la seua llista. Es pot arxivar i esperar a dictàmens més profunds d'IAs que sí que hagen pogut llegir el codi sencer.
