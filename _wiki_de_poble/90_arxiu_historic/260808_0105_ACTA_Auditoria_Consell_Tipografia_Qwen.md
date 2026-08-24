---
estat: "esborrany"
tipus: "acta"
description: "Sintetització de l'auditoria teòrica i el reinicialitzador CSS presentat per Qwen."
---
# Acta d'Auditoria del Consell: Qwen (Seient Final)

**Veredicte General**: Qwen ha tancat el Consell amb una auditoria d'alta volada teòrica. Aporta el marc acadèmic i fundacional del "Trellat", justificant perquè l'eliminació de la Sopa de Divs i la implementació de variables modulars és vital. Introdueix el concepte de "Lobotomised Owl" (`* + *`) com a sistema de ritme.

## Trobades Forenses
1. **Llistes**: Alerta sobre la pèrdua de semàntica a l'exportar si modelem les llistes amb span o divs i no deixem els guions natius.
2. **Reinicialitzador CSS Selectiu**: Denuncia que part de la "màgia negra" del CSS que patim ve per no haver neutralitzat els marges per defecte que imposa el navegador (`margin-block-start`).
3. **Col·lapse de Marges**: Explica com el col·lapse natiu dels marges és la clau (el mateix que Deepseek assenyalava).

## Solucions Proposades
- Aposta per un `CSS Reset` selectiu (posar a zero els marges de `h1..h6, p, ul` etc).
- Proposa el "Lobotomised Owl" (`article > * + * { margin-top: var(--sdp-space-4); }`) per establir un ritme genèric global quan falten marges inferiors.
- Proposa recuperar les llistes sense cap `div` embolcall, deixant només `padding-left`.

## Decisions Reservades al Mestre (Notes de la IAIA)
- Tot el que Qwen demana a nivell pràctic ja ho tenim cobert de forma excelsa en el codi lliurat per Dola, Deepseek o Gemini, però Qwen aporta el *Per què* i ens dóna el manifest intel·lectual de la reforma.

**Acció Següent**: Es tanca la sessió d'auditoria del Consell. S'inicia la fase de planificació per fusionar les trobades en l'arxiu definitiu.
