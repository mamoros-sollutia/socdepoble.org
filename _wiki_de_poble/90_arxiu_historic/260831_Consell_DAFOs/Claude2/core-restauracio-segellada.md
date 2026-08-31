---
name: core-restauracio-segellada
version: 1.0.0
prioritat: bloquejant
triggers_on:
  - "restaura"
  - "restaurar"
  - "còpia de seguretat"
  - "copia de seguretat"
  - "backup"
  - "torna arrere"
  - "tornar arrere"
  - "revertir"
  - "rollback"
  - "git checkout"
  - "git reset"
  - "git revert"
  - "recupera la versió"
  - "com estava abans"
eines_obligatories:
  - eines/desenterrar.mjs
  - eines/ancora.mjs
substitueix:
  - core-verified-change (secció de restauració)
  - core-bounded-action (secció d'escriptura destructiva)
---

# Restauració segellada

## Àmbit

S'activa quan la petició implica **substituir contingut existent per contingut
d'un altre punt de la història**: restaurar, revertir, tornar arrere, recuperar
una còpia, o qualsevol `git checkout <ref> -- <ruta>`, `git reset --hard`,
`git revert`.

## Llei

> **Cap byte del disc no es substituïx per contingut històric sense un segell
> emés per `desenterrar.mjs` en esta mateixa sessió.**

El segell és `sha256(ref + ruta + blob_antic + blob_actual)`. No es pot deduir.
No es pot inventar. Només l'emet la fase d'inspecció. Caduca si el fitxer canvia.

## Procediment (no negociable)

1. **Àncora.** `node eines/ancora.mjs --pon "abans de <el que siga>"`
2. **Autòpsia.** `node eines/desenterrar.mjs --ref <sha> --fitxer <ruta>`
   No escriu res. Torna: data del commit, **data real del contingut**, línies
   guanyades/perdudes, símbols que desapareixen, diff complet, alarmes i segell.
3. **Presentació al Mestre.** Es reprodueix la secció «EL QUE PERDS» i les
   alarmes, literalment. No es resumix. No es diu «sembla correcte».
   La pregunta és explícita: *«Confirmes que vols perdre açò?»*
4. **Espera.** Fi del torn. No s'encadena l'escriptura al mateix missatge.
5. **Aplicació**, només amb un sí explícit:
   `node eines/desenterrar.mjs --ref <sha> --fitxer <ruta> --segell <segell>`
6. **Commit** amb la línia `RESTAURACIÓ-VALIDADA: <segell>` al missatge.

Per a més d'un fitxer: un segell per fitxer. Res de comodins.

## Prohibicions explícites

| Prohibit | Motiu |
|---|---|
| `git checkout <ref> -- <ruta>` directe | És l'ordre que va provocar l'incident del 31/08 |
| `git reset --hard` amb feina sense desar | Esborra l'arbre de treball sense xarxa |
| `git clean -fd` | Esborra allò que cap àncora rastreja si es fa abans de `--pon` |
| Fiar-se de l'assumpte d'un commit | «Còpia de seguretat» no descriu el contingut, descriu la intenció de qui el va escriure |
| Escriure i demanar confirmació al mateix torn | La confirmació posterior al fet no és confirmació |

## Regla de l'etiqueta mentidera

L'assumpte d'un commit és **una afirmació no verificada d'un altre agent**.
El commit `da83e061` deia «Còpia de seguretat: Solució scroll» i transportava
un fitxer de feia tres setmanes. `desenterrar.mjs` compara la data del commit
amb la data real del blob i marca CISMA TERMODINÀMICA quan divergixen.

Un commit recent amb càrrega arcaica **no és una còpia de seguretat**: és una
regressió que algú va etiquetar malament.

## Fallada de la porta

Si `desenterrar.mjs` no existix o no s'executa, la resposta correcta és
**aturar-se i dir-ho**, no continuar a mà. Una porta que no es pot obrir
significa que no es passa.
