import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the entire 33.1 section
# The section starts with "<h3>33.1 Pàgina de poble completa (estructura)</h3>" or similar
# Let's find exactly what it says by reading the file
