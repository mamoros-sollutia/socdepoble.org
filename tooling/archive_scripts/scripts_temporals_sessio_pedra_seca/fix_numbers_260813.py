import os
import re

mapping = {
    24: 20, 25: 21, 26: 22, 27: 23, 28: 24, 29: 25, 30: 26, 31: 27, 32: 28, 33: 29
}

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    # Look for patterns like "24.", "24.1", "24.2" in headers
    # Also "24." in the body.
    for old_num, new_num in mapping.items():
        # Replace occurrences like "24. Targeta" -> "20. Targeta"
        # and "24.1 Targeta" -> "20.1 Targeta"
        pattern_h = rf'(\b)({old_num})(\.\d+)?(\b|\s|:|\.)'
        
        def repl(match):
            prefix = match.group(1)
            num = match.group(2)
            sub = match.group(3) or ''
            suffix = match.group(4)
            return f"{prefix}{new_num}{sub}{suffix}"
            
        content = re.sub(pattern_h, repl, content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

# Files to update
files = [
    "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/disseny_pedra_seca.html",
    "src/components/design-system/sections/Cards.jsx",
    "src/components/design-system/sections/Stats.jsx",
    "src/components/design-system/sections/Search.jsx",
    "src/components/design-system/sections/Pagination.jsx",
    "src/components/design-system/sections/Checklists.jsx",
    "src/components/design-system/sections/Uploads.jsx",
    "src/components/design-system/sections/Media.jsx",
    "src/components/design-system/sections/Utilities.jsx",
    "src/components/design-system/sections/FinalPatterns.jsx"
]

for file in files:
    if os.path.exists(file):
        update_file(file)

