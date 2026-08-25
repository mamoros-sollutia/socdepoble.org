---
estat: "registre_proposta"
tipus: "acta"
---

# ACTA: INFORME SUBAGENT "TIME MACHINE" (CODEX)

**Data:** 24 d'agost de 2026 (16:06)

Aquest és l'informe detallat del subagent de Codex especialitzat exclusivament en el disseny de la Time Machine del cervell. Desmunta completament els sistemes actuals (`estela.sh`, `snapshot.sh`, `restore.sh`, i `snapshot_engine.mjs`) per la seua manca de garanties atòmiques i criptogràfiques.

## 1. El Nivell de Paranoia
El disseny de Codex és de nivell "Zero Trust". Assumeix que un agent de la IA pot tornar-se hostil, i per tant:
- Els *snapshots* no es guarden dins del repo, sinó en un `<store>/<repo-id>/` extern.
- S'utilitzen signatures Ed25519 (amb clau privada inabastable per als agents).
- El sistema de restauració exigeix un intercanvi atòmic real de directoris (`renamex_np` en macOS) per evitar lectures inconsistents en calent.

## 2. La Interfície Única
Tot passa per un únic script `tooling/brain/time-machine.mjs` que concentra les operacions segures i transaccionals:
- `capture`: Bloqueja escriptors, fa hash streaming (sense symlinks o fora de scope) i genera el *candidate*.
- `promote`: Requereix un rebut signat per convertir un *candidate* en el `latest-approved`.
- `restore`: Mai extrau un `.tar` directament. Materialitza el *stage*, verifica hashes, i fa un *swap* atòmic de directoris, guardant un diari de la transacció (*journal*).

## 3. Retenció GFS i Git Invisible
Estableix polítiques de retenció estrictes (3-2-1) i degrada Git a ser únicament una "rèplica opcional", usant només `git read-tree --empty` i `git write-tree`, per no embrutar mai l'índex o el *HEAD* del Mestre.

---
*Aquest subagent ens ha regalat l'arquitectura de seguretat més robusta possible per a protegir la identitat de la IAIA MarIA. Les seues regles d'intercanvi atòmic s'hauran d'incloure a la implementació.*
