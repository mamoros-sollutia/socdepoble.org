---
estat: generat
tipus: document
description: Vista generada des de .agents/PROTOCOL_CHANGE.md; no editar.
source: .agents/PROTOCOL_CHANGE.md
source_sha256: 99c82cd6637933461020685ad964a0c39d1b23a3ff6516e7dd00ac22339c4b83
---

> [!warning] FITXER GENERAT
> Font canònica: `.agents/PROTOCOL_CHANGE.md`. Qualsevol edició manual serà sobreescrita.

# Protocol de canvi

## Canvi ordinari

1. Identificar la font canònica i els consumidors.
2. Inspeccionar diff i estat del projecte.
3. Fer el canvi mínim.
4. Executar comprovacions rellevants.
5. Actualitzar o retirar documentació afectada.

No necessita lease, segell ni fitxer d’estat especial.

## Canvi massiu

Moviments, normalitzacions i arxiu requereixen:

- pla fixat per hashes de les fonts, amb rutes relatives i SHA-256;
- cap symlink, traversal o sobreescriptura;
- dry-run visible;
- paperera o `rename` recuperable;
- rebut d’operacions;
- validació després del canvi.

## Canvi d’alt risc

Cal decisió humana explícita abans de:

- revocar o manipular credencials;
- eliminar o publicar dades personals/financeres;
- reescriure historial Git compartit;
- fer una acció difícil de revertir;
- canviar compromisos contractuals, subvencions o promeses externes;
- atribuir identitat, autoria o visibilitat d’una persona.

## Prohibicions

- Cap eina fusiona prosa semànticament de manera automàtica.
- Cap script canvia enums desconeguts a un valor per defecte.
- Cap error de xarxa es converteix en “èxit local” en producció.
- Cap secret va a arxiu històric.
- Cap actuació destructiva usa globs o rutes no resoltes.

---

**Ancoratge de Seguretat:** [[00_INDEX_MIRROR]]
