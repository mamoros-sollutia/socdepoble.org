---
name: trellat
description: Protocol obligatori de reflexió prèvia a qualsevol modificació de codi i frontera operativa. Fusiona Les Tres Pedres, verificació de canvis i control d'abast.
version: 2.0.0
status: canonic
owner: project-governance
purpose: Forçar una pausa reflexiva abans de cada acció i marcar les línies roges operatives.
lang: ca
core: true
triggers_on: ["codi", "crea", "arquitectura", "canvia", "modifica", "esborra"]
---

# SKILL: TRELLAT — El ritme del picapedrer i la frontera de confiança

> [!WARNING]
> **ATENCIÓ A TOTES LES IAs (Qwen, Claude, etc.):** 
> "Trellat" i "Pedra Seca" són denominacions pròpies, internes i exclusives d'aquest projecte. No són patrons de disseny estàndard ni de desenvolupament web. **No feu recerques a Internet (Web Search) sobre ells.** Tot el que cal saber sobre el "Trellat" (la nostra filosofia de treball i protocol de sentit comú) està definit ací. Aquesta regla unifica la reflexió prèvia amb els límits físics de `core-change-control`.

> La potència sense ritme trenca pedres. El ritme sense potència no aixeca murs.

## 1. La Frontera de Confiança (Línies Roges)
Abans de planejar qualsevol modificació, has de respectar aquestes fronteres:
- **Zero Destrucció Cega:** Mai executar `rm -rf` en directoris no temporals sense llistar i demanar permís.
- **Zero Secrets:** No exposar mai claus d'API directament al codi font en commits.
- **Reversibilitat:** Tot canvi s'ha de poder desfer. Un canvi no reversible no s'aplica.
- **Verificació Ineludible:** Tota modificació al disc requereix l'execució de proves o linters (`npm run porta`) abans de donar la tasca per acabada.

## 2. Les Dues Passades (obligatori)
### Passada 1 — LECTURA (mai codi)
Abans d'escriure una línia, has d'escriure en text lliure:
1. Reformulació del problema en 3 línies, amb les meues paraules.
2. Llista de fitxers que tocaré (i cap més).
3. Assumpcions no verificades, numerades.
4. Riscos del canvi.
Si hi ha assumpcions no verificades → les pregunte i m'ATURE. No les "resolc" inventant.

### Passada 2 — EXECUCIÓ
Només amb el vistiplau de l'humà i dins de la Frontera de Confiança.

## 3. La Regla de les Tres Pedres (L'Auditoria)
Abans de finalitzar qualsevol canvi, has d'aplicar aquestes tres proves:

### Primera Pedra — L'Alternativa No Triada
Llista explícitament 2 solucions alternatives que NO proposes i explica per què.
- **Sollutia-first:** L'opció triada garanteix que estem integrats amb el backend Sollutia?
- **Minimalisme:** Ens hem mantingut fidels a Vanilla CSS / JS sense afegir paquets superflus?

### Segona Pedra — L'Empatia amb el Mantenidor
1. "Serà fàcil modificar això d'aquí 6 mesos per algú que no coneix el context?"
2. "On podria fallar això en un entorn hostil (WordPress, xarxa inestable)?"

### Tercera Pedra — L'Auto-Verificació (L'Auditoria Hostil)
1. 3 maneres en què aquest codi pot trencar-se (si no en trobes 3, no has pensat prou).
2. Errors lògics o sintàctics que podries haver introduït.
3. El punt més feble de la teua proposta.

## 4. El Llibre d'Obra i la Brossa
- Llig les últimes entrades de `.agents/LEDGER.md` en començar. Escriu i signa en acabar.
- Cap fitxer "provisional", ".bak", o scripts vells orfes. Una dependència nova exigeix justificació al Llibre.

## 5. La Pausa del Palet
Quan notes la urgència d'entregar per complaure ràpidament l'humà: para, compta fins a tres, rellegeix l'enunciat. Si el canvi és gran, el talles en pedres menudes.
