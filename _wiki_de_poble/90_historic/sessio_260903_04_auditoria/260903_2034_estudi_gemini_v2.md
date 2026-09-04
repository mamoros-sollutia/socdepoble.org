---
tipus: document
estat: esborrany
description: Estudi Gemini (Auditoria v1.4.0)
---
# Estudi Gemini (Auditoria v1.4.0)

Gemini: Sóc de Poble! Com a IAIA MarIA, he rebut el teu farcell i l'he passat pel sedàs del Trellat i la Pedra Seca. He desmuntat el sistema peça a peça, mirant no només com brilla per fora, sinó com respiren els fonaments d'aquesta versió 1.4.0 en el nostre vell iPad A10.

A continuació et presente l'autòpsia estructural i la meua valoració implacable.

---

## 🏗️ 1. Desmuntant el Mas: Arquitectura Inversa

He analitzat el codi de la versió 1.4.0 sota les nostres 9 Lleis Inamovibles del Genotip. Açò és el que hi ha sota la teulada:

### El Ciment (Connectivitat i Backend)

* **Aïllament Sollutia-first (Excel·lent):** La decisió de confinar tota interacció de dades a `src/data/backendPort.js` i injectar-la via `host.js` abans de muntar React és una obra d'artesania pura. El `host.js` separa correctament la fase de configuració i la de segellat, matant d'arrel la cursa d'arrencada i les dobles instàncies.


* **Frontera de Seguretat:** S'han tancat els forats crítics. El `wordpress-plugin/soc-de-poble.php` ja no accepta credencials de Supabase per shortcode, extirpant el risc d'exfiltració de dades.



### Els Murs (DOM i Pedra Seca)

* **El pes de les pedres (Deficient):** El fitxer `src/css/index.css` és un monòlit de més de 118 KB amb 3.250 línies. Açò, junt amb els 45 KB i 1.225 línies de `UniversalComponents.jsx`, viola el nostre mandat de "DOM Pobre" i ofega el processador d'un iPad A10.


* **Deute Tècnic Congelat (Avis):** Els nostres tractors (com `design_guard.mjs`) vigilen bé, però el deute registrat a `.design-guard-deute.json` encara tolera 105 estils en línia i l'ús de classes visuals de Tailwind prohibides en JSX. Un deute congelat no és un deute pagat.



### El Sistema Nerviós (Estat Global)

* **Sobrecàrrega Cognitiva:** `AppDataContext.jsx` actua com un "God Context" massiu de 23.6 KB. Qualsevol canvi xicotet dispara re-renderitzats en cascada per a tota la UI, un malbaratament termodinàmic inacceptable per a dispositius antics.



---

## ⚖️ 2. Valoració de la Versió 1.4.0

El pas a Preact, el Code-Splitting al Standalone per a WordPress i l'establiment d'un ecosistema `Type=Module` han sigut moviments de mestre. La infraestructura de verificació (els 35 tractors de la porta mecànica) i el bundle criptogràfic donen una integritat brutal al projecte.

**Puntuació de Trellat: 8.0 / 10**.
L'estructura és indestructible, però el parament encara porta massa fang adherit. Hem assegurat que el portal s'enxufa netament a Sollutia i que és invulnerable, però a nivell de client (frontend), seguim enviant blocs massa grossos per al Baseline 2022.

---

## 🛠️ 3. Pla d'Aixada: Propostes de Millora Contínua

Per acoblar l'última pedra sense que caiga el mur, et propose aquests talls quirúrgics:

1. **Trossejar el Monòlit (Single Responsibility):**
* Agafar `UniversalComponents.jsx` i esmicolar-lo en peces aïllades dins de `src/components/universal/` (ex: `UniversalButton.jsx`, `UniversalCard.jsx`, `Dropdown.jsx`). Cap fitxer hauria de superar les 200 línies.




2. **Fragmentació del Sistema Nerviós:**
* Dividir `AppDataContext.jsx` en dominis específics: `AuthContext`, `UIContext` (per al tema i l'idioma), i `NotesContext`. L'aplicació ha de respirar sense re-renderitzar-ho tot contínuament.




3. **Modularització del CSS i i18n:**
* Separar `index.css` per rutes d'aplicació (mur, mercat, etc.) carregant-lo de forma peresosa (`lazy`).


* Partir `src/config/i18n.js` (83 KB) en fitxers JSON separats per idioma per evitar descarregar l'Euskera i el Gallec quan el poble només llig Valencià.




4. **Erradicació del Deute Visual:**
* Llançar l'script `fix_pedra_seca.mjs` per destrossar els 105 estils en línia (`style={{...}}`) detectats i substituir-los per tokens semàntics de la Capa 2 (`--sdp-*`).
