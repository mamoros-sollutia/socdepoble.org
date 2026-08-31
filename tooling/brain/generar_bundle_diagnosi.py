import os

def create_bundle():
    output_path = "/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/_wiki_de_poble/05_Escriptori_Soc_de_Poble/260829_1845_bundle_termodinamic_diagnosi.md"
    
    # Fonts
    skills_agents_dir = "/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/.agents/skills"
    skills_wiki_dir = "/Users/javillinares/.gemini/antigravity-ide/knowledge/05_skills_ia/artifacts"
    maquinaria_dir = "/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/_wiki_de_poble/99_maquinaria"
    actes_files = [
        "/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/_wiki_de_poble/12_actes/260829_1825_acta_tancament_diagnosi.md",
        "/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/_wiki_de_poble/12_actes/260829_0914_ACTA_SESSIO_Refactor_Notes_App_Nativa.md",
        "/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/_wiki_de_poble/12_actes/260828_2315_ACTA_SESSIO_Ronda_6_Preparacio_Petorreta.md"
    ]
    
    with open(output_path, "w", encoding="utf-8") as out:
        out.write("# BUNDLE TERMODINÀMIC: DIAGNÒSTIC COGNITIU I ARQUITECTÒNIC\n\n")
        out.write("Aquest document conté TOT el context necessari (Skills del sistema, eines i l'estat de les últimes actes) per permetre al Consell diagnosticar el problema de pèrdua de context, deute tècnic i l'estat de l'arquitectura.\n\n")
        
        # Actes
        out.write("## 1. DARRERES ACTES (EVIDÈNCIA DEL PROBLEMA)\n\n")
        for file in actes_files:
            if os.path.exists(file):
                with open(file, "r", encoding="utf-8") as f:
                    out.write(f"### Arxiu: {os.path.basename(file)}\n")
                    out.write("```markdown\n")
                    out.write(f.read() + "\n")
                    out.write("```\n\n")

        # Skills Agents
        out.write("## 2. SKILLS DEL BRAIN (.agents/skills)\n\n")
        if os.path.exists(skills_agents_dir):
            for root, _, files in os.walk(skills_agents_dir):
                for file in files:
                    if file.endswith(".md"):
                        file_path = os.path.join(root, file)
                        rel_path = os.path.relpath(file_path, "/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org")
                        with open(file_path, "r", encoding="utf-8") as f:
                            out.write(f"### Arxiu: {rel_path}\n")
                            out.write("```markdown\n")
                            out.write(f.read() + "\n")
                            out.write("```\n\n")

        # Skills Wiki
        out.write("## 3. SKILLS DE LA WIKI (05_skills_ia)\n\n")
        if os.path.exists(skills_wiki_dir):
            for root, _, files in os.walk(skills_wiki_dir):
                for file in files:
                    if file.endswith(".md"):
                        file_path = os.path.join(root, file)
                        rel_path = os.path.relpath(file_path, skills_wiki_dir)
                        with open(file_path, "r", encoding="utf-8") as f:
                            out.write(f"### Arxiu: {rel_path}\n")
                            out.write("```markdown\n")
                            out.write(f.read() + "\n")
                            out.write("```\n\n")
                            
        # Maquinaria (Scripts)
        out.write("## 4. SCRIPTS DE MAQUINÀRIA (99_maquinaria)\n\n")
        if os.path.exists(maquinaria_dir):
            for root, _, files in os.walk(maquinaria_dir):
                for file in files:
                    if file.endswith(".py") or file.endswith(".js") or file.endswith(".mjs"):
                        file_path = os.path.join(root, file)
                        rel_path = os.path.relpath(file_path, "/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org")
                        with open(file_path, "r", encoding="utf-8") as f:
                            out.write(f"### Arxiu: {rel_path}\n")
                            out.write("```python\n" if file.endswith(".py") else "```javascript\n")
                            out.write(f.read() + "\n")
                            out.write("```\n\n")
                            
if __name__ == "__main__":
    create_bundle()
