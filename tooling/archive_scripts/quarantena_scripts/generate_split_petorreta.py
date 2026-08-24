import os
import glob

prompt_file = "_wiki_de_poble/05_Escriptori_Soc_de_Poble/260821_0545_PROMPT_Auditoria_Orquestracio_i_SEO.md"
bundle_file = "_wiki_de_poble/05_Escriptori_Soc_de_Poble/260821_0545_BUNDLE_Auditoria_Orquestracio_i_SEO.md"

prompt_text = """# PETORRETA PER AL CONSELL: Auditoria Deute Tècnic Zero, SEO i Mode Fosc

**Mestre Javi sol·licita al Consell:**

Volem fer una auditoria completa del sistema per assegurar que els fonaments estan immaculats ABANS de continuar construint pàgines noves. Us hem preparat un BUNDLE amb tot el context (identitat i disseny), tot el codi del plugin de WordPress de Sollutia i tot el nostre codi Frontend (React SPA).

**Objectius de l'Auditoria:**

1. **Deute Tècnic Zero i Neteja de "Fantasmes":**
   - Busqueu codi redundant, males pràctiques o restes de sessions anteriors.
   - Valideu que l'estructura del DOM (components com `UniversalPage`, `AppShell`, wrappers) està neta, sense divs "fantasmes" que trenquen layouts flexbox.

2. **SEO Impecable (El millor SEO possible):**
   - Volem que l'aplicació SPA siga perfectament indexable.
   - Valideu la injecció de meta tags, l'ús correcte del Shadow DOM (com afecta al SEO?), links interns i accessibilitat. Volem la perfecció en SEO.

3. **Mode Fosc / Clar (Nit i Dia):**
   - Actualment tenim un esbós del canvi de tema (basat en `[data-theme="dark"]`).
   - Com podem perfeccionar aquesta implementació perquè la transició i la persistència siguen robustes i sense parpellejos ("FOUC")? Doneu-nos la clau per fer-ho perfecte.

4. **Orquestració WordPress <-> React:**
   - Valideu la configuració autonòma de Vite (`vite.standalone.config.js`).
   - L'enxufabilitat en WordPress (`soc-de-poble.php`): El servidor retorna `HTTP 200` i delega el routing correctament sense trencar les rutes natives del plugin original de Sollutia?

5. **Escalat Responsive a partir de la base de 320px:**
   - Acabem de resoldre i mil·limetrar l'estat a 320px (mòbils molt estrets) d'una forma magistral: paddings de la barra a 8px, logo a 112px d'amplària màxima, i tots els botons/icones atapeïts (gap: 0) en contenidors min-width/min-height de 36px. A la barra negra agrupats a la dreta, i a la blava agrupats a l'esquerra excepte "Connectar".
   - Demanem al Consell: Fixeu-vos com hem resolt aquest repte extrem a 320px en el CSS actual, i proporcioneu-nos el codi CSS i els *Media Queries* ja preparats (per a 375px, 480px, 720px, etc.) perquè el disseny escale automàticament. Exemples: tornar als contenidors tàctils de 44/48px naturals quan hi haja espai, separar els tridents d'icones de la barra blava (esquerra, centre, dreta), etc.

**Instruccions per al Consell:**
- Analitzeu el BUNDLE adjunt.
- Retorneu un diagnòstic clar per a cada punt.
- Proporcioneu el codi exacte per aplicar les millores i netejar qualsevol deute tècnic.

---
"""

with open(prompt_file, "w") as out:
    out.write(prompt_text)

context_files = [
    "/Users/javillinares/.gemini/antigravity-ide/knowledge/01_identitat_iaia/artifacts/soc_de_poble.md",
    "/Users/javillinares/.gemini/antigravity-ide/knowledge/04_arquitectura_disseny/artifacts/pedra_seca.md",
    "/Users/javillinares/.gemini/antigravity-ide/knowledge/01_identitat_iaia/artifacts/genotip.md",
    "/Users/javillinares/.gemini/antigravity-ide/knowledge/01_identitat_iaia/artifacts/iaia_maria.md"
]

with open(bundle_file, "w") as out:
    out.write("# BUNDLE: Codi Font Sóc de Poble (WP + React SPA)\n\n")
    
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

print(f"Prompt i Bundle generats.")
