import os
import re
import glob

wiki_dir = '_wiki_de_poble'
color_pattern = re.compile(r'(?<![`\'"])(#[0-9a-fA-F]{6})\b')

count = 0
for root, dirs, files in os.walk(wiki_dir):
    for file in files:
        if file.endswith('.md'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = color_pattern.sub(r'`\1`', content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed colors in {filepath}")
                count += 1

print(f"Total files fixed: {count}")
