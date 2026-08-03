---
estat: canonic
tipus: protocol
description: Política mínima i recuperable per a canvis del projecte.
revisat: 2026-08-02
---

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
