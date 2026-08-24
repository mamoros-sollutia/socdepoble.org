import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix capitalization
content = content.replace(
    "<h2>L'edició definitiva amb el Logotip Complet</h2>",
    "<h2>L'edició definitiva amb el logotip complet</h2>"
)

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("H2 case fixed.")
