import re

with open("disseny_pedra_seca.html", "r") as f:
    content = f.read()

# 1. Extract the card HTML from 24.4 again (since we need it)
match = re.search(r'<h4>24\.4 Targeta Mestra: Pàgina de Mur \(Disseny\)</h4>\s*(<article class="sp-card">.*?</article>)', content, re.DOTALL)
if not match:
    print("Could not find Card 24.4!")
    exit(1)

card_html = match.group(1)

# 2. Extract everything before the content-wrapper
pre_content_match = re.search(r'(.*<article class="content-wrapper">)', content, re.DOTALL)
if not pre_content_match:
    print("Could not find start of content-wrapper")
    exit(1)

pre_content = pre_content_match.group(1)

# 3. Extract everything after the content-wrapper
post_content_match = re.search(r'(</article>\s*</main>\s*<button class="fab-button">.*)', content, re.DOTALL)
if not post_content_match:
    print("Could not find end of content-wrapper")
    exit(1)

post_content = post_content_match.group(1)

# 4. Modify the Page Title in pre_content
pre_content = re.sub(r'<h1>Disseny Pedra Seca</h1>', '<h1>Mur de Sóc de Poble</h1>', pre_content)
pre_content = re.sub(r'<h2>Sistema oficial de disseny per a Sóc de Poble</h2>', '<h2>El pols del nostre poble en temps real</h2>', pre_content)
pre_content = re.sub(r'<p class="lead">.*?</p>', '<p class="lead">Descobreix tot el que passa a La Torre de les Maçanes. Anuncis, esdeveniments, memòria i molt més.</p>', pre_content, flags=re.DOTALL)
# Also change the active nav item in the sidebar
pre_content = re.sub(r'<a class="nav-item active" href="#">Disseny</a>', '<a class="nav-item" href="#">Disseny</a>', pre_content)
pre_content = re.sub(r'<a class="nav-item" href="#">Mur</a>', '<a class="nav-item active" href="#">Mur</a>', pre_content)

# 5. Assemble the new page content
wall_content = f"""
<!-- GRID DEL MUR (3 columnes escriptori, 2 tauleta, 1 mòbil) -->
<div class="sdp-card-grid">
{card_html}
{card_html}
{card_html}
{card_html}
{card_html}
{card_html}
</div>
"""

new_page_content = pre_content + "\n" + wall_content + "\n" + post_content

with open("pagina_mur.html", "w") as f:
    f.write(new_page_content)

print("Created pagina_mur.html")
