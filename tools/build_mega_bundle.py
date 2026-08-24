import os

BUNDLE_FILE = "_wiki_de_poble/05_Escriptori_Soc_de_Poble/260823_2255_BUNDLE_Millora_Disseny_i_Auditoria.md"

DIRECTORIES_TO_INCLUDE = [
    "src",
    ".agents/skills",
    "tooling",
]

FILES_TO_INCLUDE = [
    "_wiki_de_poble/05_Escriptori_Soc_de_Poble/produccio/disseny_pedra_seca.html",
    "package.json",
]

def get_lang(filename):
    ext = filename.split('.')[-1]
    mapping = {
        "js": "javascript",
        "jsx": "jsx",
        "mjs": "javascript",
        "css": "css",
        "html": "html",
        "json": "json",
        "md": "markdown"
    }
    return mapping.get(ext, "text")

with open(BUNDLE_FILE, "a", encoding="utf-8") as out_f:
    out_f.write("\n\n---\n# CONTEXT TÈCNIC PER A L'AUDITORIA (CODI FONT COMPLET)\n")
    out_f.write("A continuació s'adjunta tota la base de codi per comprendre la magnitud del sistema.\n\n")

    # Add explicitly requested files
    for filepath in FILES_TO_INCLUDE:
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as in_f:
                content = in_f.read()
            out_f.write(f"## Arxiu: `{filepath}`\n")
            out_f.write(f"```{get_lang(filepath)}\n{content}\n```\n\n")

    # Recursively add directories
    for directory in DIRECTORIES_TO_INCLUDE:
        for root, _, files in os.walk(directory):
            for file in files:
                # Skip media, locks, and hidden
                if file.startswith('.') or file.endswith('.lock') or file.endswith('.png') or file.endswith('.jpg'):
                    continue
                
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, "r", encoding="utf-8") as in_f:
                        content = in_f.read()
                    out_f.write(f"## Arxiu: `{filepath}`\n")
                    out_f.write(f"```{get_lang(file)}\n{content}\n```\n\n")
                except Exception as e:
                    pass

print("Supreme bundle created successfully.")
