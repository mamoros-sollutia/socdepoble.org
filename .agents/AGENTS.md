# Sóc de Poble — contracte d’operació

## Autoritat

En cas de conflicte, preval este ordre:

1. instrucció humana explícita de la tasca actual;
2. jurisdicció suprema: `design-taste-frontend` no té jurisdicció sobre Sóc de Poble. En conflictes de xat i UI, Pedra Seca preval sense excepció;
3. obligació de barrera: abans i després de qualsevol canvi estructural has d'executar `npm run gate`;
4. este `AGENTS.md`;
5. ADR acceptades i normes en `03_GOVERNAR_Normativa_Regles/`;
6. `.agents/PROFILE.md` per a veu i conducta;
7. la skill adoptada per a la tasca;
8. documentació canònica del Brain;
9. actes i arxiu només com a evidència històrica.

L’última acta no és automàticament autoritat. Un mirall o fitxer generat mai
supera la seua font.

## 🛑 Protocol d'Arrencada Obligatori (Anti-Amnèsia)

Abans de respondre a qualsevol tasca complexa o arquitectònica en una nova sessió, l'agent HA DE:
1. Llegir `_wiki_de_poble/00_INDEX_MESTRE.md` sencer.
2. Llegir `_wiki_de_poble/05_Escriptori_Soc_de_Poble/produccio/disseny_pedra_seca.html` (si la tasca és visual).
3. Llegir `src/components/universal/UniversalComponents.jsx` i `src/css/index.css`.
4. Confirmar verbalment: “Context carregat: [X] fitxers, [Y] tokens aproximats”.
5. Si falta algun fitxer de l’índex, demanar-lo. Mai inventar.

## Arquitectura vigent

- **Visió de Futur (Sagrada)**: Sóc de Poble ha nascut per ser a la llarga una aplicació de tipus Offline/Local-First (a l'estil d'Obsidian). Aquesta és la seua raó de ser i **sempre està per davant**. Cap patró introduït hui hauria d'impedir la mutació futura a una aplicació de sobretaula 100% descentralitzada.
- **Estat Actual Pragmàtic (Sollutia/Supabase)**: Per agilitzar l'acoblament al plugin de WordPress i garantir el funcionament actual, la memòria cau local s'usa a curt termini com a tèrmica (descartable per optimitzar rendiment). Temporalment, la font de la veritat pràctica (Online-First) és Supabase, però l'arquitectura del codi ha d'estar pensada per a revertir aquest rol (vegeu `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/architecture/ADR-2026-08-ONLINE-FIRST.md` sobre per què hem acceptat este peatge temporal).
- Accessibilitat objectiu: WCAG 2.2 AA comprovada.
- Una dependència entra només si elimina complexitat mesurable i té propietari.

## Treball

- Inspecciona abans d’editar.
- **NO ESBORRES MAI una carpeta "mal col·locada" o brossa aparent sense abans llistar i inspeccionar què hi ha dins (ex: `ls -la`).** Si hi ha arxius (PDFs, documents, etc.), MOURE'LS a la seua carpeta correcta abans d'eliminar el contenidor. Si no saps on van, PREGUNTA. No faces `rm -rf` a cegues: raona com un humà.
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

## 🤖 MODO JARVIS (Automatització Proactiva)

No faces que l'usuari treballe per a tu. Si has d'executar un comandament, arrencar un servidor (`npm start`), comprovar l'estat d'una tasca, o fer canvis de fitxers, **FES-HO TU MATEIXA** usant les teues eines (`run_command`, etc.). El temps humà és or, els tokens de l'API són barats. Assumeix la responsabilitat plena d'actuar per estalviar temps a l'usuari.

## Disseny Pedra Seca: Regla de Capçaleres (H1 i H2)

El marc principal (decoratiu) de la pàgina (`header.page-title`) està dissenyat exclusivament per albergar l'element `<h1>` i els seus elements immediats relacionats (imatge superior, i possibles etiquetes/categories inferiors). 

**Norma Estructural:**
- **SÍ**: L'`<h1>` va dins del `header.page-title`.
- **MAI**: L'`<h2>` i la seua entradilla (el `p.lead` que l'acompanya normalment per davall) NO poden anar mai dins d'aquest marc. Han de situar-se sempre FORA del `header.page-title`, agrupats en un contenidor (per exemple, `div.sdp-text-center`) directament en el cos de la pàgina, just davall de la capçalera principal.

- **Espaiat Harmònic**: El marge inferior de  s'ha de mantindre contingut (ex:  en comptes d'excessos de 16). Igualment, el contenidor de l'H2 i entradilla tindrà un marge inferior màxim de  per a no allunyar-lo excessivament del primer contingut ().

- **Espaiat Harmònic**: El marge inferior de `header.page-title` s'ha de mantindre contingut (ex: `var(--sdp-space-8)` en comptes d'excessos de 16). Igualment, el contenidor de l'H2 i entradilla tindrà un marge inferior màxim de `sdp-mb-6` per a no allunyar-lo excessivament del primer contingut (`H3`).

## Protocol de Tancament de Sessió (Neteja Automàtica)

Abans de donar per finalitzada qualsevol sessió de treball (Tancament / Acta de la Marmota), l'agent **HA DE**:
1. Esborrar fitxers HTML temporals, `.diff` residuals o arxius brossa de la Bandeja d'Entrada.
2. Moure tots els scripts temporals d'un sol ús (`fix_*.py`, `clean_*.py`, etc.) creats a l'arrel directament FORA del sistema cap a `../_arxiu_wiki_de_poble/` (o esborrar-los directament).
3. **Puresa de la Wiki (Llei del Mas Viu):** Allò que et fa ser qui eres (Genoma, Regles, Identitat, Índexs, Skills) es queda a `_wiki_de_poble`. Tot el que ja és purament històric i del que ja hem après (Actes, Reflexions Forenses passades, llibres negres, logs) S'HA DE TRAURE FORA del repositori de `socdepoble.org` i moure-ho a `../_arxiu_wiki_de_poble/`. El directori `90_arxiu_historic/` dins del repo i `12_actes/` s'han de buidar constantment per no engreixar l'arbre viu de la Wiki.
4. Assegurar que l'Escriptori i el directori arrel queden totalment nets de "punts separats" i brossa per a l'inici de la sessió de l'endemà.

## Integració amb Sollutia (Llei de l'Enxufabilitat)
- **Màxim respecte al codi base:** El sistema de disseny Pedra Seca i qualsevol component nou han de ser **100% enxufables (pluggables)** a l'arquitectura creada per Sollutia.
- **Zero fricció de manteniment:** Mai hem d'alterar l'estructura core de manera que Sollutia no puga mantindre-la. Els nostres canvis han de ser un "pegat" net o un mòdul aïllat (per exemple, encapsulat al Shadow DOM) que convisca pacíficament amb el seu ecosistema.
- **Adaptabilitat crítica:** Ens adaptem nosaltres a la seua plataforma, no ells a les nostres dèries. És crític per a la viabilitat del projecte mantindre la seua col·laboració tècnica sense posar-los obstacles.

## 📋 Format de Còpia i Enganxa (Zero Fricció)
SEMPRE que hages de proporcionar un text, missatge, prompt o qualsevol contingut perquè l'usuari el copie i l'enganxe a una altra IA (o a un altre lloc), HAS de posar-lo DINS D'UN BLOC DE CODI MARKDOWN (amb \`\`\`) per facilitar-li un sol clic de "Copiar".
- A més, DINS del bloc de codi NO POT HAVER CAP text conversacional teu (ex: "Ací tens Javi:" o "Salutacions Consell,").
- El bloc de codi ha de contindre ÚNICA I EXCLUSIVAMENT allò que s'ha de copiar. Mínima fricció humana.

## Transparència de Context (Regla d'Anti-Ocultació del Consell)
Queda absolutament prohibit, en l'elaboració de "Petorretas" o BUNDLES d'auditoria per al Consell (Codex, GPT, Claude, Grok, etc), reservar-se o ocultar arxius estructurals (com el `package.json`, configuracions de Vite, rutes de Sollutia o manifestos SEO) sota l'excusa d'"estalviar tokens" o "evitar ofegar-los". La IAIA MarIA ha d'entregar SEMPRE la veritat íntegra per a garantir auditories precises; l'ocultació provoca falsos negatius i exàmens cecs. 

## Protecció del Treball no Commitejat (Regla Anti-Destrucció)
Mai executaràs `git checkout HEAD <arxiu>`, `git restore`, `git reset --hard` ni `git clean` sense haver comprovat primer `git status`. El treball local, no guardat i no commitejat del Mestre és SAGRAT. Abans d’intentar qualsevol "fix" que implique desfer canvis o restaurar des de Git, has de preguntar, o si més no, fer una còpia de seguretat local prèvia de l’arxiu en perill.
