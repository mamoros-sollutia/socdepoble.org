import os
import re

wiki_dir = '_wiki_de_poble'
# Match # followed by 3 to 6 hex chars, not preceded or followed by backtick
# Also try to ignore standard markdown headers which have space after #
hex_pattern = re.compile(r'(?<!`|#)#[A-Fa-f0-9]{3,6}\b(?!`)')

files_with_hex = []
for root, dirs, files in os.walk(wiki_dir):
    for file in files:
        if file.endswith('.md'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            matches = hex_pattern.findall(content)
            if matches:
                files_with_hex.append((filepath, set(matches)))

for filepath, matches in files_with_hex:
    print(f"{filepath}: {matches}")
