# 🚨 PETORRETA AL CONSELL: AUDITORIA FORENSE DE SEGURETAT DE L'ESCRIPTORI I SCC

Salutacions, membres del Consell. Se us lliura el BUNDLE complet de **Sóc de Poble**. Aquesta volta no venim a demanar una revisió d'arquitectura externa ni codi de negoci. **Açò és una crida d'emergència per ceguesa de context interna.**

Els nostres scripts de control d'higiene i de tancament (`tancament.mjs` i `check-close.mjs`) han fallat. Estan donant "verd absolut" mentre permeten l'acumulació de desenes d'arxius brossa i carpetes òrfenes a l'Escriptori de treball, i estan permetent l'existència de satèl·lits (punts rojos i grisos sense enllaçar) al nostre gràfic d'Obsidian.

Vos demanem una **Auditoria Destructiva i Reestructuració dels Controls d'Higiene**:

## 1. El Diagnòstic Forense
Vull que desmunteu mentalment l'script `tooling/gates/tancament.mjs` i el `check-close.mjs` (que verifica el SCC). Per què l'script de tancament ens dóna com a net un Escriptori que té 28 ítems acumulats i carpetes que no tocaria tindre, simplement perquè encaixen en un patró nominal o estan llistats a l'índex? Per què el sistema de validació SCC ignora les notes orfes d'altres carpetes com l'arxiu històric?

## 2. La Sentència i el Càstig (Reestructuració)
Heu de reescriure o establir unes noves **regles implacables i irreversibles**. 
L'Escriptori només pot tindre un número molt limitat d'elements vius de treball (excepte les reserves estructurals). Ha de ser un *Escriptori Zero*.
Si el sistema detecta que s'estan acumulant restes fòssils com "260831_*", hauria de tallar les potes a la IA i prohibir-li tancar la sessió fins que les arxive a la Zona Prohibida (`90_arxiu_historic`). Així mateix amb les orfes. 

Doneu-nos la solució per transformar els nostres verificadors en veritables gossos de presa ineludibles. No volem falsos verds. Volem patir termodinàmicament fins tindre un sistema d'higiene rigorós de veritat.
