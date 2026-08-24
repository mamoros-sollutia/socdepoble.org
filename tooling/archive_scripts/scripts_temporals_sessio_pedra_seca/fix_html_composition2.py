import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "<h4>33.1 Pàgina de poble completa (estructura)</h4>" in line:
        skip = True
    if "<h4>33.2 Formulari de contacte complet</h4>" in line:
        skip = False
        # Remove the previous 33.2 line and make it 33.1
        line = line.replace("33.2 Formulari", "33.1 Formulari")
        new_lines.append(line)
        continue
    
    if skip:
        continue
        
    if "&lt;4&gt;Contacta amb nosaltres<!--4-->" in line:
        line = line.replace("&lt;4&gt;Contacta amb nosaltres<!--4-->", "<h4>Contacta amb nosaltres</h4>")
        
    new_lines.append(line)

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("HTML fixed.")
