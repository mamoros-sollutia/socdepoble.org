import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_closing = 0

for line in lines:
    # If the line is exactly opening a cms-preview div, we skip it, but remember we need to skip a closing div.
    # Note: they might have other classes.
    if '<div class="cms-preview' in line:
        skip_closing += 1
        continue
    
    # Actually, they might be closed much later.
    # To do this safely, I will just remove <div class="cms-preview..."> entirely from the line.
    pass

