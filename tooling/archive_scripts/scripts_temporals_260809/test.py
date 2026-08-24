import re

with open('src/css/pedra-seca.css', 'r') as f:
    content = f.read()

content = content.replace(
    '.sp-card-author-link { display: flex; align-items: center; min-width: 0; }',
    '.sp-card-author-link { display: flex; align-items: center; min-width: 0; flex: 1; align-self: stretch; }'
)

with open('src/css/pedra-seca.css', 'w') as f:
    f.write(content)

print("Updated CSS")
