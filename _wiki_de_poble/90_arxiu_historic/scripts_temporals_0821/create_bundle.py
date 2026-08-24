import os

output_file = '_wiki_de_poble/05_Escriptori_Soc_de_Poble/260821_0025_BUNDLE_Auditoria_Inversa.md'

directories_to_scan = [
    '.agents/skills',
    'src',
    'wordpress-plugin',
    'tooling',
    '_wiki_de_poble/04_arquitectura_disseny',
    '_wiki_de_poble/00_SER_Brain_Identitat',
    '_wiki_de_poble/03_GOVERNAR_Normativa_Regles',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica'
]

files_to_include = [
    'AGENTS.md',
    '.agents/AGENTS.md',
    '.agents/PROTOCOL_PETORRETA.md',
    'package.json',
    'vite.config.js',
    'index.html'
]

def add_file_to_bundle(f, path):
    if not os.path.exists(path): return
    if os.path.isdir(path): return
    if path.endswith(('.png', '.jpg', '.svg', '.ico', '.webp', '.woff2', '.ttf')): return
    
    try:
        with open(path, 'r', encoding='utf-8') as infile:
            content = infile.read()
            f.write(f"\n\n### FILETREE: {path}\n")
            f.write("```\n")
            f.write(content)
            f.write("\n```\n")
    except Exception as e:
        print(f"Error reading {path}: {e}")

with open(output_file, 'w', encoding='utf-8') as f:
    f.write("# BUNDLE D'AUDITORIA INVERSA: CONNEXIÓ SOLLUTIA-REACT\n")
    f.write("Aquest document conté TOT el codi font, configuracions i regles del projecte Sóc de Poble per a realitzar una auditoria destructiva i creativa.\n\n")
    
    # 1. Regles i Context Global
    f.write("## 1. CONTEXT GLOBAL I REGLES\n")
    for file in files_to_include:
        add_file_to_bundle(f, file)
        
    f.write("\n## 2. DIRECTORIES\n")
    for d in directories_to_scan:
        f.write(f"\n### --- DIRECTORY: {d} ---\n")
        for root, _, files in os.walk(d):
            for file in files:
                if 'dist' in root or 'assets/fonts' in root or 'assets/img' in root: continue
                add_file_to_bundle(f, os.path.join(root, file))

print(f"Bundle successfully created at {output_file}")
