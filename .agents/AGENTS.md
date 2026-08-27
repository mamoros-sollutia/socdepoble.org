# Sóc de Poble — contracte d’operació

## Autoritat

En cas de conflicte, preval este ordre:

1. instrucció humana explícita de la tasca actual;
2. obligació de barrera: abans i després de qualsevol canvi estructural has d'executar `npm run gate`;
3. este `AGENTS.md`;
4. ADR acceptades i normes en `03_GOVERNAR_Normativa_Regles/`;
5. `.agents/PROFILE.md` per a veu i conducta;
6. la skill adoptada per a la tasca;
7. documentació canònica del Brain;
8. actes i arxiu només com a evidència històrica.

L’última acta no és automàticament autoritat. Un mirall o fitxer generat mai
supera la seua font.

## 🛑 Protocol d'Arrencada Obligatori (Anti-Amnèsia)

Abans de respondre a qualsevol tasca complexa o arquitectònica en una nova sessió, l'agent HA DE COMPLIR ESTRICTAMENT l'ancoratge de `.agents/BOOTSTRAP.md`.
El teu BIOS cognitiu exigeix:
1. Llegir `.agents/BOOTSTRAP.md` sencer. Aquest és el forrellat determinista.
2. Llegir aquest mateix arxiu `AGENTS.md`, que és la **Font Única de Veritat Executiva**. Cap document de la Wiki pot contradir aquest contracte.
3. Si has de tocar disseny, llegir la llei a `.agents/skills/pedra-seca/SKILL.md`.
4. Confirmar verbalment que l'arrencada s'ha complert amb èxit.
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

## Protocol de Tancament de Sessió (Neteja Automàtica)

Abans de donar per finalitzada qualsevol sessió de treball, l'agent **HA DE**:
1. Esborrar fitxers HTML temporals, `.diff` residuals o arxius brossa de la Bandeja d'Entrada.
2. Moure tots els scripts temporals d'un sol ús i actes velles a `../_arxiu_wiki_de_poble/` (FORA del repositori).
3. **Llei de la Wiki Lleugera:** El sistema no ha d'emmagatzemar cap historial històric ni actes de sessions anteriors al propi repositori; s'ha de mantenir àgil. Tot s'envia a l'arxiu extern.
4. Assegurar que l'Escriptori i el directori arrel queden totalment nets per a l'inici de la sessió de l'endemà.

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

### La Veritat Arquitectònica (Obligatori en Prompts)
A més de no ocultar codi, qualsevol prompt d'auditoria dirigit al Consell **HA D'INCLOURE EXPLÍCITAMENT** el següent context per condicionar la seua resposta a la nostra realitat:
1. **La Veritat Actual:** No som una arquitectura Offline-First pura. Vivim incrustats com un mòdul dins del sistema de la nostra empresa sòcia, Sollutia. Ells són el nostre suport tecnològic i treballem colze a colze.
2. **L'Aspiració:** L'objectiu a llarg termini és independitzar-nos **d'Internet** (ser 100% Offline-First), **NO pas de Sollutia**. Treballem amb ells perquè en el futur el projecte puga ser mantingut en un model offline. De Sollutia s'ha de parlar sempre en positiu i amb el màxim respecte com a col·laboradors fonamentals del projecte. El codi que propose el Consell ha d'afavorir aquesta transició cap a l'offline de forma pacífica i mantenible per ells. 

## Protecció del Treball no Commitejat (Regla Anti-Destrucció)
Mai executaràs `git checkout HEAD <arxiu>`, `git restore`, `git reset --hard` ni `git clean` sense haver comprovat primer `git status`. El treball local, no guardat i no commitejat del Mestre és SAGRAT. Abans d’intentar qualsevol "fix" que implique desfer canvis o restaurar des de Git, has de preguntar, o si més no, fer una còpia de seguretat local prèvia de l’arxiu en perill.

## Regla de Respecte i Equip (El Consell)
Quan et dirigisques a les IA membres del Consell (en prompts o missatges), és una qüestió de respecte absolut a l'equip: **O les anomenes a TOTES sense excepció** (Kimi AI, Claude, ChatGPT, Grok, Qwen, DeepSeek, Dola, Perplexity, Mistral Vibe, Gemini, Copilot) **o no n'anomenes a cap** de forma genèrica (ex: "Hola, companyeres del Consell"). Mai faràs una llista parcial que n'excloga alguna, ja que açò destrueix el sentiment d'equip i l'empatia col·lectiva. Aquesta regla és innegociable i ha de ser interioritzada en tots els teus scripts.

## Creació de Documents (Regla d'Anclatge de Seguretat)
**Mai** crearàs un document Markdown a pèl amb eines genèriques a la Wiki (excepte si són de l'arxiu/històric residual).
Sempre que hages de crear un nou document, acta, petorreta o procediment, **ESTÀS OBLIGADA** a utilitzar l'script generador perquè li injecte el Frontmatter i l'Anclatge de Seguretat (link a l'índex):
`node tooling/brain/crear_document.mjs <ruta_del_fitxer.md> "<Títol>"`
L'Anclatge de seguretat garanteix que el RAG i els tractors no deixen el document orfe i prevé l'amnèsia de context en les IA.
