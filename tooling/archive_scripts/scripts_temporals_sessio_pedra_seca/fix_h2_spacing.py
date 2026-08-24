import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update H2 margin-top to 6px
content = re.sub(
    r'\.sp-card \.sp-card-body h2 \{\n  font-size: 1\.25rem;\s*\n  margin-top: 0;',
    r'.sp-card .sp-card-body h2 {\n  font-size: 1.25rem;\n  margin-top: 6px;',
    content
)

# 2. Fix typo "Dibuixos" -> "Dibuix"
content = content.replace(
    '<p class="sp-card-text">Dibuixos del mapa del tresor',
    '<p class="sp-card-text">Dibuix del mapa del tresor'
)

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("H2 spacing and typo fixed.")
