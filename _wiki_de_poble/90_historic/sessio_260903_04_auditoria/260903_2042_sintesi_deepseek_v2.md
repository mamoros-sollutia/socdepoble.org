---
tipus: acta
estat: esborrany
description: Síntesi de les 10 IAs del Consell — Seient Núm. 7
tags:
  - maquina
  - sollutia
---

# 📊 Interpretació de l'Auditoria del Consell (Síntesi DeepSeek)

## La resposta curta

**Sí, estem més a prop del 9 que del 5.** La mitjana de les 10 IAs auditores és **7,5/10**, i la mediana també es mou al voltant de 7,5. Però la nota no ho explica tot: el que realment importa és **quins 9** i **quins 5** estem mirant.

---

## 📈 La nota desglossada

| IA | Nota | Perfil |
|---|---|---|
| **Gemini** | 9,2 | Optimista, veu l'arquitectura |
| **Grok** | 8,4 | Analític, veu el potencial |
| **Vibe** | 8,0 | Equilibrat, pràctic |
| **Deepseek** | 7,8 | Rigorós, metòdic |
| **Dola** | 7,8 | Filosòfic, conceptual |
| **Perplexity** | 7,4 | Pragmàtic, contrasta |
| **Claude** | 6,5 | Forense, exigent |
| **Kimi** | 6,5 | Quirúrgic, detallista |
| **Z** | 6,5 | Estructural, honest |
| **Qwen** | 6,5 | Tècnic, conservador |

**Observació clau:** Les notes baixes (6,5) vénen de les IAs que han **auditat el codi real**, no la documentació. Les notes altes venen de les que han auditat la **filosofia i l'arquitectura declarada**. Això ens diu alguna cosa important: **la distància entre el que diem que som i el que realment hem construït és el que ens separa del 9.**

---

## 🧠 El veredicte del Consell (sintetitzat)

### PUNTS FORTS (El que ja funciona)

1. **Governança i meta-arquitectura** — Totes les IAs coincideixen: el sistema de portes, tractors, LEDGER i verificació criptogràfica és excepcional. **Claude diu: «El sistema meta està millor construït que el sistema.»**
2. **Documentació i transparència** — El bundle verificable amb SHA256, el contracte d'abast, els fitxers de deute congelat... és material de referència.
3. **Filosofia Pedra Seca** — La visió és sòlida, coherent i té ànima. **Dola: «El projecte no és només una aplicació, és una proposta tecnològica amb ànima.»**
4. **Privacitat per defecte** — La Llei 05 és un exemple de disseny ètic.
5. **Relé OAuth i callback.html** — Claude el qualifica com «la millor peça del bundle».

### DEBILITATS GREUS (El que ens separa del 9)

#### 🔴 P0 — Seguretat (Claude)
- **Injecció de Supabase des d'un shortcode de WordPress:** qualsevol usuari amb `publish_posts` pot apuntar l'app a un servidor propi i capturar credencials. **Açò és un forat crític.**
- **Sanejador inconsistent:** `sanitizeHtml` i `DOMPurify` s'executen en ordre diferent segons la pàgina visitada. Un control de seguretat no pot dependre de l'ordre de renderitzat.

#### 🟠 P1 — Deute tècnic acumulat (Kimi, Vibe, Deepseek)
- **CSS monolític:** 118 KB, 3.250 línies, 26 `!important`, 55 `box-shadow`, 72 `transform`. Açò en un iPad A10 amb xarxa rural és un tret al peu.
- **Components gegants:** `UniversalComponents.jsx` (45 KB), `DesignSection.jsx` (63 KB), `i18n.js` (83 KB). Sense code splitting, sense lazy loading.
- **Classes orfenes i estils en línia:** 179 classes orfenes, 103 estils en línia, 33 colors crus, 276 classes forasteres. El deute està **congelat, però no es redueix**.

#### 🟡 P2 — Accessibilitat i detecció cega (Claude, Perplexity)
- `font-too-small` només busca `px`, però el codi usa `rem`: **44 declaracions per davall de 16 px no es detecten.**
- `touch-too-small` dona 7 infraccions, mentre que `LLEI_04_VIDA` (la llei dura) dona 0. **El zero no és salut: és la ceguesa del detector.**

#### 🟡 P3 — Coherència doctrina/codi (Z, Qwen, Deepseek)
- La Constitució diu «VanillaJS, DOM pla», però el codi és 100% React.
- La Wiki declara «offline-first», però l'ADR diu «online-first». **Dues veritats, cap llei.**
- `BASELINE.md` diu 2022, però l'ADR diu que hem abandonat l'A10. **Contradicció que confon agents i humans.**

#### 🟡 P4 — Rendiment real (Kimi, Vibe, Perplexity)
- **ProseMirror** sobre iPad A10: ~400 KB de JS que parsejar en un nucli de 2016.
- **Profunditat de DOM:** `UniversalComponents.jsx` ~12 nivells, quan el límit declarat és 7.
- **Cursa d'arrencada:** `host.js` marca `fase = SEGELLAT` després de l'`await import()`, deixant una finestra on un segon `arrenca()` pot cridar `defineCustomElement()` dues voltes → `NotSupportedError`.

---

## 🚀 Què cal prioritzar? (Consens del Consell)

### PRIORITAT 0 — Seguretat (dies, no setmanes)
1. **Traure `supabase_url` i `supabase_anon_key` del shortcode i del bloc** de WordPress. Només des de constants PHP.
2. **Unificar el sanejador:** `posaGanxos()` a la càrrega del mòdul, no dins de `sanitizeHtml()`. Una sola porta.

### PRIORITAT 1 — La Porta Cega (setmana 1)
**Grok i Claude coincideixen:** construir una porta que **planta infraccions** en un directori `fixtures/` i verifica que els detectors les detecten. Amb açò, «0 infraccions» deixa de ser ambigu: o el codi està net, o el detector és cec. **És la peça que li falta al sistema per deixar de repetir el mateix diagnòstic cada mes.**

### PRIORITAT 2 — Deute visual i rendiment (setmana 2-3)
- **Reduir el CSS monolític:** dividir en `critical.css`, `components.css`, `editorial.css`.
- **Lazy loading de components:** `React.lazy` + `Suspense` per a les seccions.
- **Eliminar dependències mortes:** `@supabase/supabase-js` no s'importa enlloc, `postcss-prefix-selector` tampoc.
- **Substituir `font-too-small` i `touch-too-small`** per detectors que entenguen `rem` i `var()`.

### PRIORITAT 3 — Coherència doctrina (mes 1)
- **Resoldre la contradicció Vanilla/React:** o canviem el corpus per dir «React optimitzat», o iniciem migració gradual cap a Web Components/Preact. **Grok suggereix Preact com a pas intermedi: 3 KB en lloc de ~40 KB.**
- **Alinear la capçalera ISO amb l'ADR Online-First.** Un document que descriu un sistema que no existix és el mecanisme pel qual la pròxima IA auditarà una ficció.

---

## 📌 El diagnòstic final (en una frase)

> **Tenim un sistema de governança de 9, un producte de 6, i una distància entre ells que està mesurada en deute tècnic i contradiccions doctrinals.**

La bona notícia: **cap dels defectes trobats és arquitectònic.** Tots són reparables en dies o setmanes, no en mesos. L'estructura aguanta.

La mala notícia: **si no actuem ara, el sistema de governança es convertirà en el projecte i el producte no arribarà mai al poble.** (Aquesta és l'observació més aguda de Grok.)

---

*— IAIA MarIA (síntesi del Consell de les Petorretes)*
