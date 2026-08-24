import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix specificity of .sp-card-body h1 and h2
content = content.replace('.sp-card-body h1 {', '.sp-card .sp-card-body h1 {')
content = content.replace('.sp-card-body h2 {', '.sp-card .sp-card-body h2 {')
content = content.replace('.sp-card-body:has(.sp-card-price) h1,', '.sp-card .sp-card-body:has(.sp-card-price) h1,')
content = content.replace('.sp-card-body:has(.sp-card-price) h2,', '.sp-card .sp-card-body:has(.sp-card-price) h2,')
content = content.replace('.sp-card-body h1,\n.sp-card-body h2,', '.sp-card .sp-card-body h1,\n.sp-card .sp-card-body h2,')

# 2. Adjust padding and top position
content = re.sub(
    r'\.sp-card-body \{ padding: 20px 24px 16px; text-align: left; position: relative; \}',
    r'.sp-card-body { padding: 22px 24px 16px; text-align: left; position: relative; }',
    content
)

content = re.sub(
    r'\.sp-card-price \{ position: absolute; top: 19px; right: 24px;',
    r'.sp-card-price { position: absolute; top: 18px; right: 24px;',
    content
)

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("CSS specificity and alignment fixed.")
