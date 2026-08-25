import os

directories = [
    ".agents/skills",
    "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/Dola Skills",
    "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/Codex Skills/soc-de-poble-skills/.agents/skills",
    "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/Claude Skills",
    "tooling"
]

output_file = "_wiki_de_poble/05_Escriptori_Soc_de_Poble/260825_0030_BUNDLE_Auditoria_Cognitiva.md"

def is_text_file(filename):
    exts = ['.md', '.js', '.mjs', '.py', '.sh', '.json', '.html', '.css', '.txt']
    return any(filename.lower().endswith(ext) for ext in exts) or "SKILL" in filename or "skill" in filename.lower()

with open(output_file, 'w', encoding='utf-8') as out:
    out.write("# BUNDLE INTEGRAL DE SKILLS I SCRIPTS (IAIA MARIA - SOC DE POBLE)\n\n")
    out.write("Aquest document conté el codi complet de totes les skills i també tots els SCRIPTS auxiliars (de la carpeta tooling i dins de les propies skills). Qualsevol canvi a l'arquitectura del cervell ha de tindre en compte si aquests scripts quedaran obsolets o com s'han d'adaptar.\n\n")
    
    for base_dir in directories:
        if not os.path.exists(base_dir):
            continue
            
        out.write(f"\n## --- FONT: {base_dir} ---\n\n")
            
        for root, dirs, files in os.walk(base_dir):
            for file in files:
                if is_text_file(file):
                    path = os.path.join(root, file)
                    skill_name = os.path.basename(os.path.dirname(path))
                    if base_dir != ".agents/skills":
                        skill_name = file
                    
                    try:
                        with open(path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            
                        out.write(f"### SKILL: {skill_name}\n")
                        out.write("```markdown\n")
                        out.write(content)
                        out.write("\n```\n\n")
                    except Exception as e:
                        out.write(f"Error reading {path}: {e}\n\n")

print(f"Bundle successfully created at {output_file}")
