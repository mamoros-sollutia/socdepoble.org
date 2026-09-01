---
name: core-brain-hygiene
description: Control transversal d’obertura, ancoratge i tancament de cada torn.
version: 1.0.0
status: canonic
lang: ca
# 260831: cedix el gallet `bundle` — abocament-total posseïx el concepte de bundle/context complet.
# 260831: cedix el gallet `escriptori` — core-higiene-reflexa posseïx l'ancoratge de fitxers i l'Escriptori.
triggers_on:
  - fitxer
  - document
  - prompt
  - produccio
  - tancament
---

# HIGIENE DEL MAS — Cada ferramenta torna al seu clau
S’aplica a tots els torns. No és consell: és porta.

## 1. En entrar
Executa `node tooling/gates/obrir_torn.mjs --json`. Conserva el `turn_id`.
Sense `turn_id`, no crees ni mous fitxers.

## 2. En treballar
Tot artefacte nou ha de quedar registrat com una d’estes quatre coses:
- `temporal`: s’elimina o va a quarantena abans d’eixir.
- `lliurable`: queda a l’Escriptori i s’ancora al seu índex.
- `produccio`: queda al camí canònic i s’ancora al seu índex.
- `historic`: va a quarantena o arxiu amb manifest reversible.
No deixes còpies `*.abans-*`, proves soltes ni carpetes amb nom d’agent. No mogues un fitxer a Producció només per buidar una safata. Primer classifica’l.

## 3. En ancorar
Crear el fitxer i crear la sinapsi és una sola operació. Si falta l’índex, el treball no està acabat.
Un text que diu “estic ancorat” no és un ancoratge: l’índex ha d’enllaçar-lo.

## 4. En eixir
1. Classifica tots els canvis del `turn_id`.
2. Retira els temporals de forma reversible.
3. Actualitza `.agents/ESTAT.md` amb el mateix `turn_id`.
4. Executa `node tooling/gates/tancament.mjs --turn-id=<id> --json`.
5. Comprova que existix un rebut amb `ok: true`. Sense rebut verd, no afirmes que has acabat i no envies la resposta final.

> Bancal treballat, aixada penjada, marge cosit.
