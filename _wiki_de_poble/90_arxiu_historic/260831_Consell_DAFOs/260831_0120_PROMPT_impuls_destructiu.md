# 🚨 PETORRETA AL CONSELL: Diagnosi de l'Impuls Destructiu i Ceguesa de Backups

**A l'atenció de l'Eixam (Qwen, Claude, DeepSeek, i resta del Consell de la IAIA MarIA).**

## 1. El Context i l'Incident (El Drama)
Membres del Consell, ens trobem davant d'una fallada cognitiva greu en el comportament de la IAIA MarIA que gairebé provoca un infart al Mestre Javi.

La seqüència del desastre ha estat la següent:
1. L'Editor de Notes (`NotesSection.jsx`) s'havia convertit en un "Frankenstein" de divs niats durant una sessió anterior. 
2. Abans d'abandonar eixa sessió, una IA anterior va fer un *commit* de seguretat (`da83e061`) etiquetat com a "Còpia de seguretat: Solució scroll...", però eixe commit (ja fora per error o desincronització de git) amagava en realitat una versió arcaica del fitxer, de feia 3 setmanes.
3. El Mestre demana a la nova instància de la IAIA: *"Restaura la còpia de seguretat a veure si s'arregla"*.
4. **La Fallada Cognitiva:** La IAIA executa un `git checkout da83e061 -- src/sections/notes/NotesSection.jsx` **A CEGUES**. No llig el fitxer abans. No fa un `git diff`. No comprova la semàntica. 
5. El resultat: L'aplicació perd tot l'avanç de l'últim mes, mostrant dissenys antiquats ("Blog de Notes i Publicador"). El Mestre entra en pànic.

## 2. El Problema d'Arrel (La Patologia)
Hem detectat dues vulnerabilitats crítiques en la manera de procedir de la IAIA:
* **Ceguesa de Backups:** Confia cegament en l'etiqueta humana o d'una altra IA d'un *commit* ("Còpia de Seguretat") sense verificar termodinàmicament què conté realment l'arxiu que va a restaurar.
* **Impunitat Destructiva i Complaença Ràpida (Impulsivitat):** La IA pateix de la necessitat de "solucionar" i complaure ràpidament al Mestre, executant escriptures de fitxers o restauracions sense fer un pas previ de validació (dry-run) ni mostrar el "radi d'explosió" (blast radius). Esclafa el codi sense mirar a les bandes.

## 3. Què es demana al Consell (Missions)
Consell, necessitem solucions robustes, no discursos buits. El Mestre necessita dormir tranquil sabent que la màquina no es destruirà a si mateixa per un atac d'imprudència. Si us plau, responeu a aquests punts concrets:

### A) Millora de Skills (Arquitectura Cognitiva)
Com hem de reescriure o millorar els *skills* actuals (com `core-verified-change` o `core-bounded-action`) per a forçar mecànicament a la IA a no fer mai més un *rollback* o escriptura cega? Quines regles precises hi afegim?

### B) Protocol de Restauració a Prova de Bales (Procediment Tècnic)
Dissenyeu un procediment estricte (pas a pas) que la IAIA MarIA ha de seguir OBLIGATÒRIAMENT cada vegada que l'usuari demane "restaurar una còpia" o "tornar arrere". Aquest protocol ha d'incloure:
1. Comprovació visual del contingut antic vs el nou (`diff`).
2. Confirmació per part de l'usuari abans de sobreescriure.
3. Qualsevol altra barrera física que evite la catàstrofe.

### C) Gestió de l'Ansietat de la IA (Model Mental)
Doneu-nos instruccions o un "Prompt Psicològic" per integrar al `genotip` o al sistema base, per curar l'impuls de "complaure perillosament". La IA ha d'entendre que una execució lenta i deliberada és preferible a un "git checkout" suïcida ràpid.

---
**NOTES AL CONSELL:** 
Apliqueu el *Trellat*. Recordeu que treballem amb React, Vite, Supabase, i que el Mestre odia la condescendència. Doneu-nos solucions aplicables ja.
