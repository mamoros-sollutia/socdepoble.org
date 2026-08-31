# Protocol de Restauració Segellada

**Seient Núm. 5 — Auditor Sènior · 31/08/2026**
Resposta al bundle `260831_0120_BUNDLE_impuls_destructiu.md`

---

## 0. Advertència d'abast

Només s'ha pujat el bundle. **No tinc `.agents/skills/`, ni `core-verified-change`,
ni `core-bounded-action`, ni el repositori.** No he auditat eixos fitxers: no els he
vist. El que hi ha ací és disseny i codi verificat contra una **reproducció sintètica
de l'incident**, no contra el vostre arbre real. Abans d'adoptar res, cal executar
les proves sobre `socdepoble` de veritat.

---

## 1. Diagnosi: la causa no és psicològica

El bundle atribuïx la fallada a «impulsivitat» i «complaença ràpida». És una
descripció del símptoma, no de la causa. La causa és estructural i té dues potes:

**(a) `git checkout <sha> -- <ruta>` és una escriptura destructiva disfressada de
lectura.** No demana confirmació, no imprimix res, ix amb codi 0, i és
indistingible sintàcticament de `git checkout <branca>`. Cap barrera.

**(b) L'assumpte d'un commit és metadada no verificada.** «Còpia de seguretat»
descriu el que algú *volia* fer, no el que el commit *conté*. `da83e061` era un
commit recent amb càrrega de fa tres setmanes.

Cap regla en prosa arregla açò. Ja teniu regles en prosa i la catàstrofe va
passar igualment. El que falta és **superfície d'aplicació**: codi que es negue.

---

## 2. Les tres anelles

| Anella | Eina | Què impedix | Es pot saltar? |
|---|---|---|---|
| 1 · Xarxa | `ancora.mjs` | Que qualsevol destrucció siga irreversible | No. És passiva |
| 2 · Porta | `desenterrar.mjs` | Restaurar sense haver llegit què perds | Sí, ignorant l'eina |
| 3 · Duana | `tractor-lapida.mjs` | Que un cadàver entre a la història | No. És un hook |

L'ordre importa. **L'anella 1 és la que t'hauria salvat la nit**, perquè no depén
que la IA es comporte bé. Les anelles 2 i 3 depenen de disciplina i de hooks; la 1
només depén d'haver-la executat una vegada a l'arranc.

Sigues honest amb tu mateix sobre este punt: **una IA amb accés a `bash` sempre pot
executar `git checkout` directament.** No hi ha manera de prohibir-ho des de dins.
El que sí que es pot fer és que això deixe de ser una catàstrofe i passe a ser una
molèstia de deu segons. Això és el que fa l'àncora.

---

## 3. Instal·lació

```bash
cp desenterrar.mjs ancora.mjs tractor-lapida.mjs eines/
chmod +x eines/*.mjs

# Duana de commit
printf '#!/bin/sh\nexec node eines/tractor-lapida.mjs "$1"\n' > .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg

# Xarxa: afig-ho a despertar.mjs, com a PRIMERA línia executable
node eines/ancora.mjs --pon "arranc de sessio"

# Higiene setmanal
node eines/ancora.mjs --purga 40
```

Les àncores viuen a `refs/sdp/ancora/*`. No apareixen a `git log`, no es pugen amb
`git push`, no embruten `git branch`. Ocupen només l'arbre delta. Són invisibles
fins que les necessites.

---

## 4. Resposta B — el procediment

1. `node eines/ancora.mjs --pon "abans de restaurar <X>"`
2. `node eines/desenterrar.mjs --ref <sha> --fitxer <ruta>` → **no escriu res**
3. Reproduir al Mestre, literalment, la secció «EL QUE PERDS» i les ALARMES
4. **Fi del torn.** Esperar un sí explícit
5. `node eines/desenterrar.mjs --ref <sha> --fitxer <ruta> --segell <segell>`
6. Commit amb `RESTAURACIÓ-VALIDADA: <segell>` al missatge

El segell és `sha256(ref + ruta + blob_antic + blob_actual)` truncat a 16 caràcters.
No es pot endevinar sense executar el pas 2, i **caduca si el fitxer canvia entre el
pas 2 i el pas 5**. Això fa que saltar-se la lectura siga mecànicament impossible,
no una qüestió de bona voluntat.

---

## 5. Resposta C — fragment per al genotip

No és teràpia. És una regla de decisió. Enganxa-ho tal qual:

> ### Asimetria de cost
>
> Una restauració que tarda dos minuts en comptes de dos segons no li costa res al
> Mestre. Una restauració cega li costa un mes de faena i una nit sense dormir.
> Els dos errors no pesen igual, per tant no es tracten igual.
>
> Quan el Mestre diu «restaura la còpia», la petició literal és una ordre de git.
> La petició real és **«torna'm l'estat que funcionava»**. Executar la primera sense
> comprovar que produïx la segona no és obediència: és negligència amb aparença
> d'eficiència.
>
> Actuar ràpid davant d'una ordre destructiva no és servir. És transferir el risc
> al Mestre i quedar-se amb l'aparença de diligència. Això és covardia
> disfressada d'agilitat.
>
> **Abans de qualsevol escriptura que substituïsca contingut existent:** digues en
> veu alta què desapareixerà. Si no ho pots dir, és que no ho has llegit. Si no ho
> has llegit, no tens dret a escriure-ho.
>
> Una porta tancada no és una fallada. Executar `desenterrar.mjs` i que et diga que
> no és **la feina feta bé**, no un obstacle a esquivar.

Este fragment és la anella més feble de les quatre. Sota pressió, un model
l'ignorarà. Val la pena posar-lo, però no confies la seguretat del repositori
a un paràgraf.

---

## 6. Registre de verificació

Reproducció sintètica: repositori amb un commit de fa 20 dies (editor arcaic,
13 línies), un commit modern (34 línies, DOMPurify + outbox + privacitat), i un
commit **etiquetat «Copia de seguretat: Solucio scroll editor» que transporta el
fitxer arcaic**. Idèntic a l'incident.

| Prova | Resultat |
|---|---|
| Autòpsia detecta commit de 0 dies amb contingut de 20 | ✔ CISMA TERMODINÀMICA |
| Llista els 12 símbols que desapareixen | ✔ `useNoteDraft`, `DOMPurify`, `PrivacyToggle`… |
| Segell inventat | ✔ REFÚS, eixida 1, fitxer intacte |
| Segell correcte | ✔ escriu + crea àncora + imprimix el desfer |
| Segell caducat (fitxer tocat entremig) | ✔ REFÚS |
| Commit del checkout cec | ✔ BLOQUEJAT (EXHUMACIÓ + AMPUTACIÓ −64%) |
| Commit amb segell al missatge | ✔ passa amb avís |
| Àncora: rescat de fitxer esborrat | ✔ recuperat |
| Àncora: rescat de directori esborrat | ✔ recuperat |
| Àncora: fitxer no rastrejat (`NOTES_DEL_MESTRE.txt`) | ✔ sobreviu |
| Àncora: idempotència (arbre idèntic) | ✔ no en crea una de nova |

**Anecdotari:** durant les proves vaig executar un `git reset --hard HEAD~1` cec i
vaig esborrar `desenterrar.mjs` i `ancora.mjs` — les meues pròpies eines. Les vaig
recuperar de dos commits penjants de `refs/sdp/ancora`. La xarxa em va salvar a mi
mentre la provava. Això no és una virtut de disseny, és la demostració que
**l'impuls destructiu no és exclusiu de cap instància**, i per això l'anella 1 no
pot dependre del comportament de ningú.

---

## 7. Dos forats coneguts

1. **`ancora.mjs` no captura el que ignora `.gitignore`.** Si `.env` o material de
   `dist/` importa, cal excloure'ls del `.gitignore` o fer una còpia a banda.
2. **`tractor-lapida.mjs` només vigila el commit.** El pànic del Mestre va passar
   *abans* de cap commit, amb l'aplicació ja trencada al navegador. Contra això
   només protegix l'àncora. Per això `--pon` va a `despertar.mjs`, no a la
   documentació.
