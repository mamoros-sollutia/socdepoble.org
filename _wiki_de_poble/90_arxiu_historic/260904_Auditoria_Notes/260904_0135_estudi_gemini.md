---
tipus: estudi_auditoria
estat: tancat
description: "Estudi de les propostes de Gemini per a l'auditoria de NotesEditor i UniversalCard"
---

# 🕵️ ESTUDI D'AUDITORIA: GEMINI (260904_0135)

## 1. Entrada Rebutjada / Proposada
Gemini va proposar tres grans blocs d'acció:
1. Neteja del Hero Image (`NotesEditor.jsx`): Eliminar estils en línia de la imatge i utilitzar classes transversals (`sdp-flex-col`, `sdp-items-center`, `btn-outline-dark`, etc.).
2. Píndoles de Taxonomia (`NotesContext.jsx`): Substituir estils en línia per la classe `badge-outline`.
3. Poda d'AI Slop (`DesignSection.jsx` i spans): Eliminar divs "wrapper" amb max-width i min-width forçat.

## 2. Anàlisi DAFO de la Proposta

### Debilitats (D)
- Gemini s'havia inventat la classe `badge-outline` en lloc d'utilitzar l'estàndard canònic de Pedra Seca.

### Amenaces (A)
- Executar cegament el codi de Gemini (com s'ha fet inicialment) pot introduir classes no documentades al sistema de disseny.

### Fortaleses (F)
- Identificació precisa de l'"AI Slop" i l'excés de `style={{...}}`.
- Aplicació correcta de la filosofia "poda" per reduir el DOM.

### Oportunitats (O)
- Aprofitar la neteja per establir un nou estàndard de component `EditableHeading` en comptes de dependre d'estils en línia.

## 3. Matriu d'Importància i Urgència (Eisenhower)
- **Important i Urgent:** Poda de divs innecessaris (AI slop) en DesignSection i NotesEditor.
- **Important, no urgent:** Corregir l'estil en línia de les píndoles amb l'estàndard `sdp-badge-*`.

## 4. Pla d'Acció Derivat
1. Rebutjar l'ús de `badge-outline` i substituir-lo exclusivament per les variables del cànon. (Fet: s'ha deixat preparat amb `badge-outline` temporalment i s'haurà de revisar respecte a `sdp-badge-neutral` o similars a index.css).
2. Eliminar l'AI Slop (wrappers) de DesignSection. (Fet).
3. Moure els estils en línia de NotesEditor al CSS. (Fet).

---
**Nota de l'Escriptori:** Aquest document s'aixeca a posteriori per esmenar l'execució directa sense reflexió ("com cagalló per sèquia"). A partir d'ara, tot codi d'IA passa per aquesta duana abans d'escriure un sol caràcter.
