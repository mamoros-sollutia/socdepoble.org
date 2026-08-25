import os
import glob
import datetime

def add_file(f_out, title, path):
    if not os.path.exists(path):
        return
    f_out.write(f"\n## {title}\n")
    f_out.write(f"**Fitxer:** `{path}`\n\n")
    
    # Determine language for markdown code block
    ext = os.path.splitext(path)[1].lower()
    lang = ""
    if ext in [".jsx", ".js", ".cjs", ".mjs"]:
        lang = "javascript"
    elif ext == ".css":
        lang = "css"
    elif ext == ".html":
        lang = "html"
    elif ext == ".md":
        lang = "markdown"
    elif ext == ".json":
        lang = "json"

    f_out.write(f"```{lang}\n")
    with open(path, "r", encoding="utf-8") as f_in:
        f_out.write(f_in.read())
    f_out.write(f"\n```\n")

bundle_path = f"_wiki_de_poble/05_Escriptori_Soc_de_Poble/{datetime.datetime.now().strftime('%y%m%d_%H%M')}_PROMPT_Experiment_Qwen_Arquitectura_Sollutia_WordPress.md"

with open(bundle_path, "w", encoding="utf-8") as f:
    f.write("---\n")
    f.write("estat: \"actiu\"\n")
    f.write("tipus: \"petorreta\"\n")
    f.write(f"data: \"{datetime.datetime.now().isoformat()}\"\n")
    f.write("---\n\n")
    f.write("# 📦 SUPER PETORRETA PER A QWEN: Experimentació i Desacoblament\n\n")
    f.write("Benvolgut Consell d'Intel·ligències (especialment Qwen),\n\n")
    f.write("Aquest document conté TOT el context necessari (identitat, disseny, HTML canònic, regles globals, skills i el codi actual) perquè treballes sense inventar absolutament res.\n\n")
    f.write("## L'OBJECTIU (EL CONTEXT) 🚨\n")
    f.write("Estem desenvolupant el sistema de disseny 'Pedra Seca' (un Front-end aïllat i pur). Aquest sistema ha de ser capaç de funcionar tant sobre el codi existent de Sollutia com, en un futur, com a un tema aïllat per a WordPress/BuddyPress. L'objectiu és que estiga totalment desacoblat.\n\n")
    f.write("## INSTRUCCIONS PRINCIPALS\n")
    f.write("1. **No inventes:** Fes servir els components i la puresa de codi que tens als fitxers adjunts.\n")
    f.write("2. **Desacoblament Total:** Tota la UI ha d'estar aïllada. Revisa el codi font adjunt i millora'l perquè siga 100% enxufable, de manera que puguem utilitzar el mateix disseny en Sollutia i en WordPress.\n")
    f.write("3. **Genera un Artefacte:** Vull que generes un artefacte de codi funcional (una targeta o pantalla completa) basant-te en els tokens de `index.css` i la nostra llei de maquetació.\n")

    # 1. Global Context and Identity
    add_file(f, "Identitat: Sóc de Poble", "/Users/javillinares/.gemini/antigravity-ide/knowledge/01_identitat_iaia/artifacts/soc_de_poble.md")
    add_file(f, "Disseny: Pedra Seca", "/Users/javillinares/.gemini/antigravity-ide/knowledge/04_arquitectura_disseny/artifacts/pedra_seca.md")
    add_file(f, "Regles Globals: AGENTS", ".agents/AGENTS.md")
    add_file(f, "Regles Globals: PROTOCOL", ".agents/PROTOCOL_PETORRETA.md")
    
    # 2. All Skills
    for skill_path in glob.glob(".agents/skills/*/SKILL.md"):
        add_file(f, f"Skill: {os.path.basename(os.path.dirname(skill_path))}", skill_path)
        
    # 3. Source of Truth
    add_file(f, "HTML Canònic (Font de Veritat)", "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/disseny_pedra_seca.html")
    
    # 4. Project Configuration
    add_file(f, "Package JSON", "package.json")
    add_file(f, "Vite Config", "vite.config.js")

    # 5. All Source Code (Recursive)
    for ext in ("*.css", "*.jsx", "*.js"):
        for path in glob.glob(f"src/**/{ext}", recursive=True):
            add_file(f, f"Source Code: {os.path.basename(path)}", path)

print(f"Mega bundle creat a {bundle_path}")
