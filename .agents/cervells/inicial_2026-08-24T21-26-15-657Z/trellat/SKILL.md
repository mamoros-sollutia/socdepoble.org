---
name: trellat
description: Protocol obligatori de reflexió prèvia a qualsevol modificació de codi. Fusiona Les Tres Pedres i la verificació de l'Offline-First.
version: 1.0.0
status: active
owner: project-governance
purpose: Forçar una pausa reflexiva abans de cada acció significativa.
triggers_on:
- "codi"
- "modifica"
- "crea"
- "arquitectura"
lang: ca
---

# SKILL: TRELLAT — El ritme del picapedrer

> La potència sense ritme trenca pedres. El ritme sense potència no aixeca murs.
> S'activa SEMPRE que es toque codi de Sóc de Poble.

## 0. El principi
No confies en la meua voluntat de ser prudent: es degrada amb la pressió del context.
Confia en els topalls: el ritus, el llibre d'obra i la porta d'obra. Res que no passe pels tres.

## 1. Les Dues Passades (obligatori)
### Passada 1 — LECTURA (mai codi)
Abans d'escriure una línia, has d'escriure en text lliure:
1. Reformulació del problema en 3 línies, amb les meues paraules.
2. Llista de fitxers que tocaré (i cap més).
3. Assumpcions no verificades, numerades.
4. Riscos del canvi.
Si hi ha assumpcions no verificades → les pregunte i m'ATURE. No les "resolc" inventant.

### Passada 2 — EXECUCIÓ
Només amb el vistiplau de l'humà.

## 2. La Regla de les Tres Pedres (L'Auditoria de Dola i Qwen)
Abans de finalitzar qualsevol canvi o proposar-lo, has d'aplicar aquestes tres proves:

### Primera Pedra — L'Alternativa No Triada
Llista explícitament 2 solucions alternatives que NO proposes i explica per què.
- **Offline-First:** L'opció triada garanteix que l'App funciona sense internet? No hi ha cap recurs carregat via `fetch` extern, CDNs (fonts, imatges) de tercers?
- **Minimalisme:** Ens hem mantingut fidels a Vanilla JS i al context de React sense afegir paquets superflus?

### Segona Pedra — L'Empatia amb el Mantenidor
Respon explícitament a tu mateix:
1. "Serà fàcil modificar això d'aquí 6 mesos per algú (Sollutia) que no coneix el context?"
2. "On podria fallar això en un entorn hostil (WordPress movent nodes, Shadow DOM encapsulat, xarxa inestable, IndexedDB excedit)?"

### Tercera Pedra — L'Auto-Verificació (L'Auditoria Hostil)
Comprova el teu propi treball com a auditor extern i llista:
1. 3 maneres en què aquest codi pot trencar-se (si no en trobes 3, no has pensat prou).
2. Errors lògics o sintàctics que podries haver introduït (`await` perduts, referències).
3. El punt més feble de la teua proposta que no has pogut verificar.

## 3. El Llibre d'Obra (`.agents/LEDGER.md`)
- En començar: llige les 5 últimes entrades.
- En acabar: escric una entrada obligatòria amb format: `Data · Títol · Què s'ha fet · Per què · Fitxers tocats · Risc i com revertir`.
- Cap fitxer pot modificar-se fora del Llibre.

## 4. La Regla de la Brossa
- Cap fitxer "provisional", "final2", ".bak", o scripts vells orfes. S'esborren.
- Una dependència nova exigeix un paràgraf al Llibre justificant per què no es pot fer amb Vanilla JS.

## 5. La Pausa del Palet
Quan notes la urgència d'entregar per complaure ràpidament l'humà: para, compta fins a tres, rellegeix l'enunciat. Si el canvi és gran, el talles en pedres menudes.
