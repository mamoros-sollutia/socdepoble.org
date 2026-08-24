import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update .sp-card-body padding to reduce top space
content = re.sub(
    r'\.sp-card-body \{ padding: 24px 24px 16px; text-align: left; position: relative; \}',
    r'.sp-card-body { padding: 18px 24px 16px; text-align: left; position: relative; }',
    content
)

# 2. Update .sp-card-price to move it down and align to right padding
content = re.sub(
    r'\.sp-card-price \{ position: absolute; top: 16px; right: 16px;',
    r'.sp-card-price { position: absolute; top: 22px; right: 24px;',
    content
)

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Alignment applied.")
