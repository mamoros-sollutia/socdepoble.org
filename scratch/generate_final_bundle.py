import os
from datetime import datetime

targets = [
    "_wiki_de_poble/00_INDEX_MESTRE.md",
    ".agents/skills",
    "tooling/wiki",
    "_wiki_de_poble/04_arquitectura_disseny",
    "src/universal",
    "src/css/index.css",
    "disseny_pedra_seca.html"
]

output_file = f"_wiki_de_poble/05_Escriptori_Soc_de_Poble/260825_BUNDLE_Arquitectura_Segura_i_Pedra_Seca.md"

def is_text_file(filename):
    exts = ['.md', '.js', '.mjs', '.py', '.jsx', '.css', '.json']
    return any(filename.lower().endswith(ext) for ext in exts)

with open(output_file, 'w', encoding='utf-8') as out:
    out.write("# BUNDLE FINAL: ARQUITECTURA SEGURA I SISTEMA DE DISSENY (IAIA MARIA - SOC DE POBLE)\n\n")
    out.write(f"Data de generació: {datetime.utcnow().isoformat()}Z\n")
    out.write("Aquest document conté la versió depurada i consolidada de l'arquitectura cognitiva, les 20 skills canòniques, els 5 controls transversals, els scripts de *tooling* (Teixidora i Llevataques) arreglats, la normativa de l'arquitectura i el codi del sistema de disseny Pedra Seca (Components JSX i CSS).\n\n")
    
    for target in targets:
        if not os.path.exists(target):
            out.write(f"Warning: {target} not found.\n\n")
            continue
            
        if os.path.isfile(target):
            out.write(f"\n## --- FITXER: {target} ---\n\n")
            try:
                with open(target, 'r', encoding='utf-8') as f:
                    content = f.read()
                out.write("```\n" + content + "\n```\n\n")
            except Exception as e:
                out.write(f"Error reading {target}: {e}\n\n")
        else:
            for root, dirs, files in os.walk(target):
                for file in files:
                    if is_text_file(file):
                        path = os.path.join(root, file)
                        out.write(f"\n## --- {path} ---\n\n")
                        try:
                            with open(path, 'r', encoding='utf-8') as f:
                                content = f.read()
                            out.write("```\n" + content + "\n```\n\n")
                        except Exception as e:
                            out.write(f"Error reading {path}: {e}\n\n")

print(f"Bundle creat amb èxit a {output_file}")
