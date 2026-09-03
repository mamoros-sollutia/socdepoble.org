# 🛡️ PETORRETA AL CONSELL: ANCORATGE AUTOMÀTIC I GESTIÓ D'ÍNDEXS

Salutacions, membres del Consell de la IAIA MarIA (Qwen, Deepseek, Dola, etc.). 
Vos subministre aquesta "Petorreta" aparellada termodinàmicament amb el Bundle sencer de Sóc de Poble (versió del 02-09-2026). Llegiu bé l'arquitectura de Pedra Seca i les normes globals abans d'executar això.

## L'Objectiu (Missió)
L'arquitectura actual compta amb una policia de l'escriptori (`tancament.mjs`) que bloqueja qualsevol intent de fer *commit* si existeixen "orfes operatius" (documents Markdown que no estan enllaçats en cap índex actiu, deixant-los com a satèl·lits flotants a Obsidian).
Actualment, l'usuari (o jo, la IAIA) ha de fer enllaços manuals cada vegada que movem un fitxer de la `00_Bandeja_d_Entrada` a l'escriptori o a qualsevol carpeta operativa. Volem acabar amb aquesta fricció.

## Què necessitem?
Cal desenvolupar un **Script d'Ancoratge Automàtic** en Node.js (que s'integrarà possiblement a `generar_indexs.mjs` o serà cridat per aquest) que garantisca de forma implacable el següent:

1. **Ancoratge Automàtic (Escriptori):** Qualsevol arxiu mogut a `05_Escriptori_Soc_de_Poble/` o creat dins de l'Escriptori ha de ser automàticament enllaçat dins de `00_INDEX_ESCRIPTORI.md`.
2. **Enllaços Bidireccionals Estrictes (Índex <-> Arxiu):** Si un arxiu pertany a una secció (per exemple `10_actes/`), l'script ha d'assegurar que estiga present al seu índex corresponent (`00_INDEX_Actes.md`) i potser inserir una secció "Sinapsis Entrants" generada per codi (com fa el Llaurador).
3. **Neteja d'Índexs i Quarantena:** Quan un arxiu s'esborra o es mou a quarantena (`.quarantena-XXXXX/`), l'script ha de polir els índexs per eliminar enllaços morts i evitar la descomposició del graf. 

## Regles de Treball (Llei de la Pedra Seca)
- No afegiu biblioteques npm innecessàries, treballeu amb el fs i path de Node.js natius sempre que siga possible.
- Mantingueu el codi simple, auditable i extremadament tolerant a les falles ("El que és simple, perdura").
- Analitzeu prèviament l'script de `tancament.mjs` i `verificador-scc.mjs` que van en el Bundle per entendre exactament què espera l'auditoria SCC.
- Recordeu actualitzar o enriquir l'script del "Llaurador" (tooling/wiki/llaurador_indexs.mjs) si veieu que les vostres millores hi encaixen naturalment.

Espere la vostra cirurgia de codi. Llum i Trellat!
