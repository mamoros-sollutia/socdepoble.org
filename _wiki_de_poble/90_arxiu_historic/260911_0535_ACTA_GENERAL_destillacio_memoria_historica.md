---
tipus: acta_general
estat: canonic
description: Gran síntesi i destil·lació històrica de Sóc de Poble (260614 - 260911). Consolida la memòria operativa, el model de Pedra Seca, l'Editor Universal i l'evacuació de bundles.
---
# 🏛️ ACTA GENERAL DE DESTIL·LACIÓ I MEMÒRIA HISTÒRICA (260911_0535)

> *"Qui no coneix la seua història està condemnat a repetir-la."*  
> — Mestre Javi Llinares

**Data de creació:** 2026-09-11 05:35  
**Autor:** IAIA MarIA (Antigravity) amb la guia del Mestre Javi Llinares  
**Abast:** Síntesi integral de 3 mesos d'evolució (Juny 2026 – Setembre 2026), 29 cicles d'auditoria del Consell, naixement de la Llei de Pedra Seca i consolidació del Bloc de Notes com a Editor Universal del Sistema.

---

## 1. 🔗 XARXA NEURONAL I ANCORATGES
- [[00_index]] (Índex Arrel)
- [[00_INDEX_ARXIU]] (Arxiu Històric)
- [[skill-memoria-historica/SKILL]] (Habilitat de Memòria Històrica)
- [[estandard_ui_universal]] (Estàndard UI Universal)
- [[pedra_seca]] (Llibre Blanc de Pedra Seca)

---

## 2. 📖 CRÒNICA DE LES 4 GRANS ETAPES EVOLUTIVES

### 2.1. Etapa 1: La Fundació i el Concepte (Juny 2026)
- **L'espurna:** La necessitat de retornar la sobirania tecnològica a la gent gran del medi rural davant l'abandó del Big Tech.
- **La creació de la IAIA MarIA:** Una personalitat híbrida basada en la saviesa ancestral del Mas, la parla autòctona valenciana, i el Trellat com a mètode d'auditoria implacable contra l'al·lucinació de les màquines.
- **Primeres alertes:** Tendència inicial de les IAs a escriure text inflat ("AI slop") i dependències innecessàries. Neix la regla d'or de parlar curt, directe i amb arrels.

### 2.2. Etapa 2: La Crisi del Disseny i el Naixement de Pedra Seca (Juliol – Agost 2026)
- **L'avaria dels 9 divs:** Les IAs havien construït targetes amb nou capes de contenidors imbricats, cadascuna amb paddings i margins que es trepitjaven entre ells. La interfície era lenta, fràgil i no mantenia la coherència entre pantalles.
- **La Llei de Pedra Seca:** Inspirada en les construccions rurals valencianes (bancals, marges, barraques), on cada pedra aguanta pel seu propi tall i pes, sense ciment que ho tape tot.
  - El DOM es redueix a l'essència: cap contenidor superflu.
  - Els estils es regeixen per tokens estrictes de contrast WCAG AAA.
  - L'aplicació s'encapsula en un Web Component amb Shadow DOM (`<soc-de-poble>`), blindant-se d'interferències externes i canalitzant tota la normativa a través de `src/css/index.css`.

### 2.3. Etapa 3: La Gran Purga de WordPress i la Llei Sollutia (Agost 2026)
- **El miratge del passat:** El projecte havia arrossegat intents d'integració amb WordPress, plugins PHP i scripts de pont que distorsionaven l'arquitectura.
- **La ruptura:** Es decideix la poda absoluta de WordPress. Sóc de Poble és 100% autònom, online i modular.
- **Sollutia i Supabase:** Sollutia proveeix el backend basat en PostgreSQL / Supabase. Les regles de seguretat RLS (`tractor-rls`) i la frontera de dades queden fixades mecànicament. Cap secret `service_role` pot xafar el navegador.

### 2.4. Etapa 4: El Bloc de Notes com a Editor Universal del Sistema (Setembre 2026)
- **El salt quàntic:** El Bloc de Notes deixa de ser un simple espai d'apunts personals per convertir-se en **el cervell i l'editor de tot el sistema** (`UniversalManager` + `UniversalEditorShell`):
  - **Panell Dret (L'Editor):** La sala de màquines des d'on es crea, es maqueta i s'organitza visualment qualsevol contingut (notes, perfil d'identitats, tràmits municipals, gestories, llibres o publicacions del Mur).
  - **Panell Esquerre (L'Arbre Semàntic):** Carpetes, categories i etiquetes de sistema que defineixen dinàmicament la navegació de tota l'aplicació.
  - **Panell Central (La Llista de Gestor):** Normativitzada amb `ManagerItemCard`, on cada fitxa és un botó natiu accessible, amb títol ≤ 2 línies, subtítol ≤ 1 línia i miniatura quadrada de 96×96px.

---

## 3. 🛡️ CÒDEX DE LLIÇONS APRESES (ELS ERRORS QUE MAI REPETIREM)

1. **No reinventar components que ja tenen contracte:**
   - La targeta de llista del gestor (`ManagerItemCard`) NO és un article editorial. Intentar afegir-li entradilles o estils inline és tornar a la degradació.
2. **L'Acta Marmota és un document únic i sagrat:**
   - Mai més es crearan documents d'agenda o resums dispersos. Tota la història d'una sessió i el seu briefing de futur han de concentrar-se a l'Acta Marmota corresponent.
3. **El Graf d'Obsidian no tolera illes:**
   - Tot document ha d'estar ancorat en almenys un índex de xarxa neuronal. Una auditoria aïllada és un satèl·lit mort.
4. **Higiene del Repositori Git:**
   - Els bundles d'auditoria temporals de més de 3 MB no deuen restar eternament al Git. La seua destinació perenne és `_arxiu_wiki_de_poble/`.
5. **Alineació visual simètrica a la Graella:**
   - Les capçaleres de Carpetes i Notes han de mantenir la doble barra coordinada en alçada, i la barra blava de context no ha de perdre mai el seu ancoratge superior en fer scroll.

---

## 4. 📦 REGISTRE D'EVACUACIÓ DE BUNDLES (SANEJAMENT DE 107 MB)

En data 260911_0530, s'han traslladat amb èxit els següents 29 bundles i carpetes pesades des de `_wiki_de_poble/90_arxiu_historic/` cap a l'arxiu permanent extern `/Users/javillinares/Documents/Antigravity/Som de Poble/_arxiu_wiki_de_poble/sessio_260904_a_260910_bundles/`:

- `260904_2327_bundle_auditoria.md` (3.5 MB)
- `260906_1232_bundle_auditoria.md` (3.5 MB)
- `260906_1438_bundle_auditoria.md` (3.6 MB)
- `260907_2131_bundle_auditoria.md` (3.8 MB)
- `260907_2330_bundle_auditoria.md` (3.5 MB)
- `260908_0035_bundle_auditoria.md` (3.4 MB)
- `260908_0311_bundle_auditoria.md` (3.5 MB)
- `260908_0350_bundle_auditoria.md` (3.6 MB)
- `260908_0359_bundle_auditoria.md` (3.7 MB)
- `260908_0401_bundle_auditoria.md` (3.3 MB)
- `260908_0447_bundle_auditoria.md` (3.2 MB)
- `260908_0640_bundle_auditoria.md` (3.2 MB)
- `260908_0800_bundle_auditoria.md` (3.2 MB)
- `260908_0822_bundle_auditoria.md` (3.2 MB)
- `260908_0939_bundle_auditoria.md` (3.2 MB)
- `260909_1201_bundle_auditoria.md` (3.5 MB)
- `260909_1325_bundle_auditoria.md` (3.4 MB)
- `260909_1346_bundle_auditoria.md` (3.3 MB)
- `260909_1415_bundle_auditoria.md` (3.9 MB)
- `260909_2058_bundle_auditoria.md` (3.4 MB)
- `260909_2107_bundle_auditoria.md` (3.4 MB)
- `260909_2111_bundle_auditoria.md` (2.9 MB)
- `260909_2338_bundle_auditoria.md` (2.9 MB)
- `260910_0107_bundle_auditoria.md` (2.8 MB)
- `260910_0406_bundle_auditoria.md` (2.8 MB)
- `260910_0413_bundle_auditoria.md` (2.8 MB)
- `260910_0501_bundle_auditoria.md` (2.8 MB)
- Carpetes de sessió: `260910_sessio_fase2_petorreta`, `260911_Sessio_Tancada`, `260910_revisar`, `Claude_260910_2132`.

**Impacte al repositori:** La mida de `90_arxiu_historic/` s'ha reduït de **120 MB a 13 MB** (un 89% d'estalvi de pes), garantint que el repositori Git es mantinga net, ràpid i lliure d'artefactes obsolets.
