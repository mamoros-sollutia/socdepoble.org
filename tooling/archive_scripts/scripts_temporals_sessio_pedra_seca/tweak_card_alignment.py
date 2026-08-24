import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update .sp-card-body padding-top from 18px to 20px
content = re.sub(
    r'\.sp-card-body \{ padding: 18px 24px 16px; text-align: left; position: relative; \}',
    r'.sp-card-body { padding: 20px 24px 16px; text-align: left; position: relative; }',
    content
)

# 2. Update .sp-card-price top from 22px to 19px
content = re.sub(
    r'\.sp-card-price \{ position: absolute; top: 22px; right: 24px;',
    r'.sp-card-price { position: absolute; top: 19px; right: 24px;',
    content
)

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Alignment micro-adjusted.")
