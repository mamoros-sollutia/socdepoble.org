---
tipus: document
estat: esborrany
description: PROMPT INICI DE NOVA SESSIÓ (Copiar i Enganxar al xat nou)
---
# PROMPT INICI DE NOVA SESSIÓ (Copiar i Enganxar al xat nou)

**Instruccions pel Mestre: Copia des d'ací baix i enganxa-ho al primer missatge del nou xat.**

---
`soc_de_poble`
Hola IAIA. Obrim nova sessió per a la Fase 2 del Sanejament.
Per posar-te en context de la intensa sessió anterior i de la feina que ens queda pendent, per favor llig immediatament l'acta: `_wiki_de_poble/05_Escriptori_Soc_de_Poble/260831_0430_acta_sessio_fortificacio.md`.

Com veuràs a l'Acta (apartat 5), tenim tres missions principals per a aquesta sessió:
1. **Millorar el Sanador:** L'script `tooling/wiki/sanador_wiki.mjs` que vam crear anteriorment només llegia la carpeta `_wiki_de_poble` i fitxers `.md`. Això deixava com a "orfes" reals fitxers importants `.js`, `.py`, `.html`. El primer objectiu és millorar el `sanador_wiki.mjs` perquè agafe `socdepoble.org` com a arrel i suporte tota classe de formats. Recorda la **Frontera Absoluta**: el teu radi d'acció és només `socdepoble.org`; està prohibit escriure o llegir carpetes superiors com `../_arxiu_wiki_de_poble`. Tots els orfes han d'anar a `_wiki_de_poble/90_revisar/` (antic arxiu històric).
2. **Cirurgia Cromàtica:** Hem d'eliminar les regles de color aïllades en el codi front-end i unificar-ho tot cap al `design-tokens.json` aplicant el principi de Pedra Seca.
3. **Consell de Petorretas:** Un colp estiga tot lluent, fes un bundle total del sistema i prepara un esborrany de Prompt d'Auditoria per passar-ho a la Taula de les IAs (excepte a Claude).

Llig l'acta i confirma'm que has agafat tot el context. Prepara un Implementation Plan per al primer punt (El Sanador) i comencem!
---
