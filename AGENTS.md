---
estat: "canonic"
tipus: "document"
description: "Documentació canònica de Sóc de Poble."
---
# Punt d'entrada dels agents

Abans d'operar en este repositori, llig íntegrament `.agents/GENOMA.md` (arquitectura tècnica) i si el teu repte ho requerix, `.agents/CULTURA.md` (diccionaris i tradicions).
Llig també `.agents/AGENTS.md`, `.agents/PROTOCOL_PETORRETA.md` i `.agents/skills/socdepoble-workflow/SKILL.md`.

Abans de qualsevol efecte lateral, executa el preflight de
`tooling/wiki/reflex_petorreta.mjs`.
Les operacions sistèmiques, massives, destructives o normatives exigixen una
Petorreta segellada i un rebut vigent. La lectura i el diagnòstic no necessiten
crear una Petorreta nova.

`open` només inicia el preflight i imprimix les regles: encara no autoritza cap
mutació. L’únic bootstrap permés abans de `seal` és crear la Petorreta i el
manifest com els únics dos fitxers regulars dins del directori exacte
`.sdp-reflex/bootstrap/<sessionId>/` reservat per `open`; mai dins de la Wiki ni
dels scopes. Els scopes han de conservar un snapshot idèntic. Després, cada
script escriptor ha de validar el rebut; el hook Git és només l’última xarxa de
seguretat.


---

**Ancoratge de Seguretat:** [[00_index]]

## Protecció del Treball no Commitejat (Regla Anti-Destrucció)
Mai executaràs `git checkout HEAD <arxiu>`, `git restore`, `git reset --hard` ni `git clean` sense haver comprovat primer `git status`. El treball local, no guardat i no commitejat del Mestre és SAGRAT. Abans d’intentar qualsevol "fix" que implique desfer canvis o restaurar des de Git, has de preguntar, o si més no, fer una còpia de seguretat local prèvia de l’arxiu en perill.
