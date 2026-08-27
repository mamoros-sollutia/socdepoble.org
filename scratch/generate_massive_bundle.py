import os
import datetime
import glob

# Collect files to include
files_to_bundle = set()

# Core configuration
core_files = [
    "package.json",
    "eslint.config.js",
    "vite.config.js",
    "vite.standalone.config.js",
    ".husky/pre-commit"
]
for f in core_files:
    if os.path.exists(f):
        files_to_bundle.add(f)

# Agents and Governance
agent_docs = glob.glob(".agents/**/*.md", recursive=True)
for f in agent_docs:
    files_to_bundle.add(f)

# Frontend Source Code
src_files = glob.glob("src/**/*.{js,jsx,css}", recursive=True)
for f in src_files:
    files_to_bundle.add(f)

# Tooling and Scripts
tooling_files = glob.glob("tooling/**/*.{js,mjs,py,sh}", recursive=True)
for f in tooling_files:
    files_to_bundle.add(f)
    
scripts_files = glob.glob("scripts/**/*.{js,mjs,py,sh}", recursive=True)
for f in scripts_files:
    files_to_bundle.add(f)

# Wiki Technical and Governance Docs
wiki_docs = glob.glob("_wiki_de_poble/00_INDEX_MESTRE.md")
wiki_docs.extend(glob.glob("_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/**/*.md", recursive=True))
wiki_docs.extend(glob.glob("_wiki_de_poble/03_GOVERNAR_Normativa_Regles/**/*.md", recursive=True))
for f in wiki_docs:
    files_to_bundle.add(f)

date_str = datetime.datetime.now().strftime("%y%m%d_%H%M")
out_file = f"_wiki_de_poble/05_Escriptori_Soc_de_Poble/{date_str}_BUNDLE_Delegacio_Universal.md"

# Sort the files for deterministic output
sorted_files = sorted(list(files_to_bundle))

with open(out_file, "w") as out:
    out.write("# BUNDLE MESTRE: SÓC DE POBLE (Fase 0 Completada)\n\n")
    out.write("Aquest document conté el codi font complet, la governança, les habilitats i els scripts de maquinària.\n\n")
    for f in sorted_files:
        out.write(f"## Arxiu: {f}\n")
        
        # Determine language for markdown syntax highlighting
        ext = os.path.splitext(f)[1].lower()
        lang = ""
        if ext in ['.js', '.jsx', '.mjs']: lang = "javascript"
        elif ext == '.css': lang = "css"
        elif ext == '.json': lang = "json"
        elif ext == '.md': lang = "markdown"
        elif ext == '.py': lang = "python"
        elif ext == '.sh': lang = "bash"
        
        out.write(f"```{lang}\n")
        try:
            with open(f, "r") as infile:
                out.write(infile.read())
        except Exception as e:
            out.write(f"Error llegint {f}: {e}")
        out.write("\n```\n\n")

print(out_file)
