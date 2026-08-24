import os
import glob

output_file = "_wiki_de_poble/05_Escriptori_Soc_de_Poble/260813_0130_PETORRETA_NETEJA_DISSENY.md"

context_files = [
    "/Users/javillinares/.gemini/antigravity-ide/knowledge/01_identitat_iaia/artifacts/soc_de_poble.md",
    "/Users/javillinares/.gemini/antigravity-ide/knowledge/04_arquitectura_disseny/artifacts/pedra_seca.md",
    "/Users/javillinares/.gemini/antigravity-ide/knowledge/01_identitat_iaia/artifacts/genotip.md",
    "/Users/javillinares/.gemini/antigravity-ide/knowledge/01_identitat_iaia/artifacts/iaia_maria.md"
]

code_files = [
    "src/sections/disseny/DesignSection.jsx",
    "src/components/design-system/sections/Cards.jsx",
    "src/components/universal/UniversalComponents.jsx",
    "src/css/index.css",
    "injected_styles.css"
]

prompt_text = """# PETORRETA PER AL CONSELL: Neteja a fons de DesignSection i Cards

**Mestre Javi sol·licita al Consell (Claude / ChatGPT):**

Hem estat refactoritzant `DesignSection.jsx` i extraient la lògica de les targetes a `Cards.jsx` utilitzant un component universal `<UniversalCard />`. Tanmateix, la pàgina encara està molt bruta.

**Objectius per al Consell:**
1. **Netejar Fantasmes:** Hi ha `divs` i estils invisibles o innecessaris a `DesignSection.jsx` i components fills que no veiem a simple vista, però que embruten el DOM. Cal netejar-ho a fons.
2. **Arreglar Imatges Idèntiques:** A `Cards.jsx` hem posat la mateixa URL d'imatge a totes les targetes que porten foto. Cal variar-ho perquè no siga repetitiu, i si cal, canviar "La Font de Dalt" pel "Pi del Pla Verd de La Torre de les Maçanes".
3. **Accessibilitat (A11y):** Assegurar que tots els botons tenen aria-labels, types correctes, contrast adequat, i arreglar qualsevol problema d'accessibilitat residual en eixos fitxers.
4. **Coherència CSS:** Tenim `index.css` i `injected_styles.css`. Vigileu l'ús de classes repetides o contradictòries.

**Per favor, proveu un codi net, accessible i lliure de "codi fantasma".**

A continuació, s'adjunta TOT el context del projecte (Qui som, la IAIA, Pedra Seca) perquè entengueu les nostres normes visuals, i el codi actual.

---

"""

with open(output_file, "w") as out:
    out.write(prompt_text)
    
    out.write("## 1. CONTEXT GLOBAL I IDENTITAT\n\n")
    for f in context_files:
        if os.path.exists(f):
            out.write(f"### Fitxer: {os.path.basename(f)}\n")
            with open(f, "r") as infile:
                out.write(infile.read() + "\n\n")
                
    out.write("## 2. CODI FONT ACTUAL\n\n")
    for f in code_files:
        if os.path.exists(f):
            out.write(f"### Fitxer: {f}\n")
            ext = f.split('.')[-1]
            out.write(f"```{ext}\n")
            with open(f, "r") as infile:
                out.write(infile.read() + "\n")
            out.write("```\n\n")

print(f"Bundle creat a {output_file}")
