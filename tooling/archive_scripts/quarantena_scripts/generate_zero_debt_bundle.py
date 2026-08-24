import os
import glob

output_file = "_wiki_de_poble/05_Escriptori_Soc_de_Poble/260821_0535_PETORRETA_Auditoria_Deute_Zero.md"

context_files = [
    "/Users/javillinares/.gemini/antigravity-ide/knowledge/01_identitat_iaia/artifacts/soc_de_poble.md",
    "/Users/javillinares/.gemini/antigravity-ide/knowledge/04_arquitectura_disseny/artifacts/pedra_seca.md",
    "/Users/javillinares/.gemini/antigravity-ide/knowledge/01_identitat_iaia/artifacts/genotip.md",
    "/Users/javillinares/.gemini/antigravity-ide/knowledge/01_identitat_iaia/artifacts/iaia_maria.md"
]

prompt_text = """# PETORRETA PER AL CONSELL: Auditoria Deute Tècnic Zero i Orquestració

**Mestre Javi sol·licita al Consell:**

Hem netejat la WIKI i volem fer un "Bundle de Deute Zero". Desitgem auditar el codi actual completament per assegurar que no hi ha forats de seguretat, vulnerabilitats, codi redundant o "fantasmes" de sessions anteriors, ABANS de començar a crear pàgines noves (Mercat, Mapa, Events, etc).

**Objectius per al Consell:**
1. **Zero Deute Tècnic:** Revisa tot el codi de `src/` (React SPA, Vite) i `wordpress-plugin/` (El codi de Sollutia per la part de WordPress). Busca codi no utilitzat, males pràctiques, injeccions manuals de Shadow DOM o duplicacions d'etiquetes (ex: divs fantasmes `sdp-app-wrapper`).
2. **Seguretat i A11y:** Detectar vulnerabilitats (ex: pas de dades no segures, exposició d'API keys si n'hi hagués), i validar l'accessibilitat.
3. **Orquestració Wordpress <-> React:** Valida l'estructura de rutes i el `vite.standalone.config.js`. S'encarrega bé WordPress de servir la SPA en les rutes corresponents?
4. **Veredicte General i Millores:** Digueu-nos si estem llestos per escalar a noves pàgines o quines 3 refactoritzacions clau hem de fer primer.

A continuació, s'adjunta TOT el context del projecte (Qui som, la IAIA, Pedra Seca) perquè entengueu les nostres normes visuals, i el codi complet.

---

"""

with open(output_file, "w") as out:
    out.write(prompt_text)
    
    out.write("## 1. CONTEXT GLOBAL I IDENTITAT\n\n")
    for f in context_files:
        if os.path.exists(f):
            out.write(f"### Fitxer de Context: {os.path.basename(f)}\n")
            out.write("```markdown\n")
            with open(f, "r") as infile:
                out.write(infile.read() + "\n")
            out.write("```\n\n")
    
    out.write("## 2. CODI DE SOLLUTIA (Wordpress Plugin)\n\n")
    for ext in ["php", "js", "css"]:
        for f in glob.glob(f"wordpress-plugin/**/*.{ext}", recursive=True):
            if "dist/" in f or "node_modules" in f: continue
            out.write(f"### Fitxer: {f}\n")
            out.write(f"```{ext}\n")
            with open(f, "r") as infile:
                out.write(infile.read() + "\n")
            out.write("```\n\n")

    out.write("## 3. CODI FRONTEND (React SPA i Vite)\n\n")
    out.write("### Fitxer: vite.standalone.config.js\n")
    out.write("```javascript\n")
    with open("vite.standalone.config.js", "r") as infile:
        out.write(infile.read() + "\n")
    out.write("```\n\n")
    
    for ext in ["jsx", "js", "css"]:
        for f in glob.glob(f"src/**/*.{ext}", recursive=True):
            if "dist/" in f or "node_modules" in f: continue
            out.write(f"### Fitxer: {f}\n")
            if ext == "jsx" or ext == "js":
                out.write("```javascript\n")
            else:
                out.write("```css\n")
            with open(f, "r") as infile:
                out.write(infile.read() + "\n")
            out.write("```\n\n")

print(f"Bundle generat: {output_file}")
