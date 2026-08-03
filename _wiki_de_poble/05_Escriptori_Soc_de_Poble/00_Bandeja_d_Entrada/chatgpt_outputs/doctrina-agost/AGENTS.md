# Sóc de Poble — contracte d’operació

## Autoritat

En cas de conflicte, preval este ordre:

1. instrucció humana explícita de la tasca actual;
2. este `AGENTS.md`;
3. ADR acceptades i normes en `03_GOVERNAR_Normativa_Regles/`;
4. `.agents/identity/PROFILE.md` per a veu i conducta;
5. la skill adoptada per a la tasca;
6. documentació canònica del Brain;
7. actes i arxiu només com a evidència històrica.

L’última acta no és automàticament autoritat. Un mirall o fitxer generat mai
supera la seua font.

## Arquitectura vigent

- Servidor/Supabase és la font canònica de dades compartides.
- No hi ha garantia offline, CRDT ni suport específic per a iPad A10.
- La cache local és opcional, menuda i no autoritativa.
- Accessibilitat objectiu: WCAG 2.2 AA comprovada.
- Una dependència entra només si elimina complexitat mesurable i té propietari.

Vegeu `ADR-2026-08-ONLINE-FIRST.md` i la seua nota sobre NLnet.

## Treball

- Inspecciona abans d’editar.
- Mantín un únic lloc per a cada regla.
- Fes canvis menuts, reversibles i verificats.
- No declares implementat res sense ruta executable i prova.
- No uses fallback demo silenciós en producció.
- No introduïsques dades privades, secrets o artefactes de runtime al repo.
- Para i demana decisió davant destrucció, diners, dades personals, secrets o
  compromisos externs.

## Manteniment

```sh
sh tooling/brain/maintain.sh .
python3 tooling/brain/brain_distill.py plan . --output .brain-reports/plan.json
```

Cap pla s’aplica sense revisió humana. `--apply` mou a paperera o arxiu; no fa
destil·lació semàntica.

## Definició de fet

Un canvi està fet quan compila des d’una instal·lació neta, passa lint/tests,
no obri una regressió d’accessibilitat o privacitat, actualitza la font canònica
i elimina la documentació que ja no és certa.
