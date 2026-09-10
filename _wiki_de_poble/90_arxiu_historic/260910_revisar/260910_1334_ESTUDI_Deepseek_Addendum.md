---
tipus: estudi_ia
estat: tancat
description: "Addendum de Deepseek sobre la Fossilització Inversa i la necessitat d'ancorar els contractes en maquinari viu."
---

# 🧠 ESTUDI CONSELL: Deepseek (Addendum)

## 1. La Llei del Maquinari Viu
Deepseek ha aportat una reflexió final brillant: **"Una font de veritat sense una porta que la lligga és una preferència, no una llei."**
Si creem `DESTINS_CANONICS.json` però els scripts de `tooling/` no el llegeixen activament i el forcen de manera elèctrica al codi, acabarà sent un altre document mort com `doctrina-ignora.txt`.

## 2. Acció Correctiva Immediata
He modificat `verify.mjs` perquè **llegeixi elèctricament i en temps d'execució** el fitxer `DESTINS_CANONICS.json`. Qualsevol intent per part d'una IA de generar un document (`.md`, `.csv`, etc.) que vagi a parar a un lloc aliè al diccionari de destins permesos (o l'arrel de codi font) patirà un **REBUIG ABSOLUT**.

## 3. ADR (Decisió d'Arquitectura)
Quant als canvis a `supabaseBackend.js`, les recomanacions de bloquejar fallbacks rotatoris de *seeds* silenciosos han sigut incorporades a l'estricta política d'estat: Si estem en mode remot, si la configuració falla o està absent, **rebenta amb un throw**, no intentes dissimular amb dades locals falses. Això blinda Supabase per a Sollutia.
