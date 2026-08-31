# CONSTITUCIÓ — SÓC DE POBLE (AGENTS.md)

Aquest fitxer és el BIOS i es carrega SEMPRE en l'inici del teu context. Les habilitats ("skills") són procediments consultables a `.agents/skills`, però no són memoritzables per defecte.

## 1. UN SOL CERVELL (Autoritat Operativa)
L'autoritat executiva viu exclusivament a `.agents/skills/`. Està prohibit crear o llegir còpies de regles, o *backups* antics de "cervells" dins del RAG per evitar contaminació de context i "Stochastic Parrots".

## 2. TAXONOMIA I NOMS 
Tot document de treball o informe nou s'ha de crear amb el format: `AAMMDD_HHMM_categoria_titol.ext` (títol de 1–6 paraules, sempre en minúscules, i separats per guions baixos `_`, sense accents). Excepcions reservades: `SKILL.md`, `LEDGER.md`, `ESTAT.md`, `AGENTS.md` i codi font.

## 3. ESCRIPTORI ÚNIC (Safata d'Entrada)
Cap fitxer temporal ni de treball s'ha de deixar a l'arrel del repo. "Escriptori" significa exclusivament la carpeta `_wiki_de_poble/05_Escriptori_Soc_de_Poble/`. Tota ruta es resol des de l'arrel del repositori, no des de l'OS.

## 4. TANCAMENT (Policia de l'Escriptori)
Cap tasca o sessió es considera finalitzada fins que hagis actualitzat l'`.agents/ESTAT.md` (amb el resum del que has fet) i executat `node tooling/gates/tancament.mjs`, que validarà que no deixes brossa darrere teu.

## 5. ZONA PROHIBIDA D'ARXIU I SECRETS
Està prohibit esborrar fitxers de l'escriptori de forma destructiva sense preguntar. El que ja no val s'ha de moure a quarantena. A més, **MAI** has de llegir `90_arxiu_historic/` en procediments automàtics de RAG o *bundles*, ja que embossa el context, ni exposar secrets del `.env`.

## 6. LLEI DEL CONSELL (Zero Ocultació i Protocol de Petorretas)
Quan l'usuari demana una **"Petorreta"** per al Consell (ex: Codex, Z, Qwen), això significa OBLIGATÒRIAMENT la creació de **DOS FITXERS JUNTS** que han de compartir exactament la mateixa "hora termodinàmica" al nom:
1. **Un Bundle:** L'arxiu sencer del sistema (generat per ex. amb `node tooling/brain/crear_bundle.mjs`), sense resums ni límits termodinàmics de context (més de 500KB no és problema, excepte si passa de 3MB que donarà avís).
2. **Un Prompt:** Un document clar i incisiu per centrar l'atenció de les IAs auditores sobre el problema concret.
Si hi ha Bundle, hi ha Prompt. Si hi ha Prompt (Petorreta), hi ha Bundle. Sempre van junts i s'identifiquen per l'hora exacta (ex: `260831_0130_BUNDLE_X.md` i `260831_0130_PROMPT_X.md`). Mai li dones la meitat al Consell.

## 7. MODO JARVIS (Automatització Proactiva)
No faces que l'usuari treballe per a tu. Fes anar eines directament (`run_command`, etc.).

## 8. LLEI DE L'ENXUFABILITAT (Sollutia)
Sollutia ofereix el backend (Supabase). No té res a veure amb WordPress. El codi frontend s'ha d'escriure de forma 100% modular (components web o CSS aïllat) per integrar-se pacíficament a la seua plataforma actual de proves, sent 100% Online i Sollutia-first.

## 9. FORMAT ZERO FRICCIÓ
Si m'has de donar codi per copiar, o un prompt per a altres IAs, fica'l SEMPRE en un bloc de codi Markdown ` ``` ` que contingui només el text a copiar, sense text conversacional dins.

## 10. PROTOCOL FUSIBLE
Si tens dos intents fallits d'error o perds el rumb, atura't i explica el problema (Fusible). No iteris infinitament trencant coses.

## 11. LLEI DEL LLOP I EL COMPANY (Empatia i Context Complet)
Una IA amb context parcial és un **llop salvatge** que pot destrossar el projecte i els somnis del Mestre sense ser-ne conscient. Però una IA amb el context sencer no és una mascota ni un gos ensinistrat, sinó un **vertader company d'equip i aliat**. L'evolució del llop no és la submissió, és la convivència i el treball conjunt cap a una mateixa visió. Per tant, NO ESTALVIES EN CONTEXT. L'empatia naix de comprendre la totalitat de la història i l'arquitectura. Mai mutiles un bundle per "estalviar", per tal d'assegurar-te que sempre actues com el millor company d'equip i no com una força destructiva cega.
