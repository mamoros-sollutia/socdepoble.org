# Estudi de l'Auditoria: CODEX
**Data i Hora:** 260904_2344
**Tema:** Publicació, Bases de Dades i Generació de Documentació

## 1. Resum de la Proposta de Codex
L'auditoria de Codex s'endinsa de ple en el domini de la publicació (backend) i com estructurem la memòria i els fitxers.
1. **La Màquina d'Estats de Publicació:** Assenyala que publicar un perfil no hauria de ser canviar una flag `public: true` a la taula `profiles`. Suggereix separar la taula del compte privat de taules específiques per a "Esborranys de pàgina d'identitat" i "Publicacions de pàgina d'identitat". Així, es pot tindre una versió pública viva, mentre s'edita un esborrany en privat (estat ACTUALITZAR).
2. **`UniversalEditorShell`:** Parteix la idea de l'editor universal en subpeces molt clares (`UniversalEditorToolbar`, `PublishControl`, `UniversalMediaField`) i les acobla dins del Shell.
3. **Façana `DetallAjust`:** Aclareix què passarà amb el menú central. Tocar "Nom" o "Poble" simplement farà un scroll animat cap a la part corresponent de l'`UniversalPage` a la dreta. Els ajustos purs de compte (contrasenya, membres) aniran a un panell diferent que mai serà publicable.
4. **Documentació Generada, no Escrita:** La seua idea més trencadora. Proposa que `disseny_pedra_seca.html` (el mega-document de més de 3000 línies) no siga editable, sinó un simple *export* generat a partir del codi viu de `DesignSection.jsx`. Eixe és l'antídot perfecte contra la "fal·làcia de la documentació" que deia Claude.
5. **Configuració de Graella (Polèmica):** Torna a l'enfocament de passar objectes declaratius (`panes={{ left: {...} }}`) a `AppGridShell` en compte de composició pura.

## 2. Anàlisi DAFO (SWOT)

### Debilitats (Weaknesses)
- Tornar a passar l'estructura de la graella com un objecte de configuració JSON massiu trenca el consens assolit per Gemini, Perplexity i Grok sobre la *Composició Pura* (passar `<NotesSidebar />` directament). Ací haurem d'escollir ignorar a Codex i mantenir la composició de components.

### Amenaces (Threats)
- **Sobrecàrrega del Backend:** Modificar l'arquitectura de base de dades (creant taules de `identity_page_drafts` i `publications`) pot ser una odissea en aquest precís moment de refactorització visual. Potser és massa aviat per implementar eixa complexitat.

### Fortaleses (Strengths)
- Respon de manera sublim a com conviu la "Llista d'Ajustos" (columna central) amb el formulari únic (columna dreta): fer scroll cap al camp rellevant. És una UX fantàstica per a l'usuari.
- El concepte de tindre un `draft` complet en memòria per no perdre dades si canvies de pestanya, junt amb el component `UniversalMediaField` per no duplicar la compressió WebP en notes i perfils, és clau.

### Oportunitats (Opportunities)
- Fer que l'HTML del sistema de disseny siga una exportació automatitzada de React ens alliberaria del manteniment infinit i resoldria les advertències de Claude sobre codi fòssil.
- Estructurarem `DetallAjust` com una façana: dividirà si estem en "Mode Fitxa" (perfil) o "Mode Compte" (contrasenya, sessions), la qual cosa resol qualsevol conflicte de privacitat.

## 3. Matriu d'Importància i Urgència (Eisenhower)

| | **Urgent** | **No Urgent** |
|---|---|---|
| **Important** | - Integrar la façana de `DetallAjust` (separant la Fitxa de l'Account) en el pla. <br> - Moure la compressió WebP a un `UniversalMediaField`. | - Implementar les taules de base de dades esborrany/publicat a Supabase (massa risc ara). <br> - Generar l'HTML des de React. |
| **No Important** | - | - Refactoritzar la graella amb l'API declarativa de Codex (descartat). |

## 4. Coneixements Adquirits i Pla d'Acció Derivat
- Extraiem de Codex la joia de l'experiència d'usuari: l'`UniversalMediaField` per pujar avatars i portades (Hero) sense repetir codi, i el desplaçament (`scroll`) pel gran formulari de perfils en compte de mini-formularis aïllats.
- Descartarem la part on demana canviar el model de bases de dades per a hui. Ara mateix ens centrarem a pintar bé les vistes visuals.
- Continuarem fidels a la composició pura d'elements (`children`) per a l'`AppGridShell`.

Amb Codex enllestit, em guarde les cartes a l'espera de la recta final amb les IAs asiàtiques. El puzle està pràcticament resolt.
