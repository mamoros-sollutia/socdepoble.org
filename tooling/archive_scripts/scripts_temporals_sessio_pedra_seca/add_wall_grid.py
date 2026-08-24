import re

with open("disseny_pedra_seca.html", "r") as f:
    content = f.read()

# 1. Extract the card HTML from 24.4
match = re.search(r'<h4>24\.4 Targeta Mestra: Pàgina de Mur \(Disseny\)</h4>\s*(<article class="sp-card">.*?</article>)', content, re.DOTALL)
if not match:
    print("Could not find Card 24.4!")
    exit(1)

card_html = match.group(1)

# 2. Add the CSS class for sdp-card-grid
css_rule = ".sdp-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--sdp-space-6); align-items: start; }\n"
content = content.replace('.dashboard-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--sdp-vora); }', '.dashboard-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--sdp-vora); }\n' + css_rule)

# 3. Create the new section 33.2
new_section = f"""
<h4>33.2 Pàgina de Mur (Feed / Graella de 3-2-1)</h4>
<div class="sdp-card-grid sdp-mb-8">
{card_html}
{card_html}
{card_html}
</div>
"""

# Insert it before 34. Variables CSS Fonamentals
content = content.replace('<h3>34. Variables CSS Fonamentals (Pedra Seca)</h3>', new_section + '\n<h3>34. Variables CSS Fonamentals (Pedra Seca)</h3>')

with open("disseny_pedra_seca.html", "w") as f:
    f.write(content)

print("Added Wall section and CSS.")
