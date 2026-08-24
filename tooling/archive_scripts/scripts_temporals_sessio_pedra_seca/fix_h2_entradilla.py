import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update H2 font-size to 1.25rem
content = re.sub(
    r'\.sp-card \.sp-card-body h2 \{\s*font-size: 1\.15rem;',
    r'.sp-card .sp-card-body h2 {\n  font-size: 1.25rem;',
    content
)

# 2. Update .sp-card-text font-size to 1rem (16px)
content = re.sub(
    r'\.sp-card-text \{ font-size: 1\.15rem;',
    r'.sp-card-text { font-size: 1rem;',
    content
)

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("H2 and entradilla resized.")
