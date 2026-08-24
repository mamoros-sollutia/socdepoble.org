import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # 1. Remove margin-left/right: auto from global typography elements
    # h1-h6
    content = re.sub(r'  max-width: var\(--sdp-measure-editorial\);\n  margin-left: auto;\n  margin-right: auto;\n', r'  max-width: var(--sdp-measure-editorial);\n', content)
    # p, .lead, ul, ol
    content = re.sub(r'  margin-left: auto;\n  margin-right: auto;\n', r'', content)
    
    # 2. Remove typography-demo divs from HTML in disseny_pedra_seca.html
    content = re.sub(r'<div class="typography-demo">(<h[1-6][^>]*>.*?</h[1-6]>)</div>', r'\1', content)
    
    # 3. Remove .typography-demo CSS
    content = re.sub(r'/\* ── MOSTRES TIPOGRÀFIQUES DINS DEL MANUAL ──\n   Eviten que els H1/H2/H3/H4 d\'exemple generin salts\n   de 56px de "nova secció" dins del flux del manual\. \*/\n\.typography-demo h1,\n\.typography-demo h2,\n\.typography-demo h3,\n\.typography-demo h4 \{\n  margin-top: 24px;\n\}\n\.typography-demo \+ p \{ margin-top: 8px; \}\n', r'', content, flags=re.DOTALL)
    content = re.sub(r'/\* ── MOSTRES TIPOGRÀFIQUES.*?\+ p \{ margin-top: 8px; \}', '', content, flags=re.DOTALL)
    
    # 4. Remove section.design-block > p margin auto
    content = re.sub(r'section\.design-block > p,\nsection\.design-block > \.lead,\nsection\.design-block > ul,\nsection\.design-block > ol,\nsection\.design-block > blockquote \{\n\n\}', r'', content)

    with open(filename, "w") as f:
        f.write(content)
    print(f"Cleaned {filename}")

