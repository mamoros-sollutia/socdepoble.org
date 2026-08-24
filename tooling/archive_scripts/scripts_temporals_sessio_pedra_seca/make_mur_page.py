import re

with open("disseny_pedra_seca.html", "r") as f:
    content = f.read()

# 1. Extract the card HTML from 24.4 again
match = re.search(r'<h4>24\.4 Targeta Mestra: Pàgina de Mur \(Disseny\)</h4>\s*(<article class="sp-card">.*?</article>)', content, re.DOTALL)
if not match:
    print("Could not find Card 24.4!")
    exit(1)

card_html = match.group(1)

# Extract everything before `<article class="content-wrapper">` (inclusive)
match_pre = re.search(r'(.*<article class="content-wrapper">)', content, re.DOTALL)
pre_content = match_pre.group(1) if match_pre else ""

# Extract everything after `</article>` closing content-wrapper
match_post = re.search(r'(</article>\s*</main>.*)', content, re.DOTALL)
post_content = match_post.group(1) if match_post else ""

if not pre_content or not post_content:
    print("Could not extract pre and post content properly")
    exit(1)

# Modify title and nav in pre_content
pre_content = re.sub(r'<h1>Disseny Pedra Seca</h1>', '<h1>Mur de Sóc de Poble</h1>', pre_content)
pre_content = re.sub(r'<h2>Sistema oficial de disseny per a Sóc de Poble</h2>', '<h2>El pols del nostre poble en temps real</h2>', pre_content)
pre_content = re.sub(r'<p class="lead">.*?</p>', '<p class="lead">Descobreix tot el que passa a La Torre de les Maçanes. Anuncis, esdeveniments, memòria i molt més.</p>', pre_content, flags=re.DOTALL)
pre_content = re.sub(r'<a class="nav-item active" href="#">Disseny</a>', '<a class="nav-item" href="#">Disseny</a>', pre_content)
pre_content = re.sub(r'<a class="nav-item" href="#">Mur</a>', '<a class="nav-item active" href="#">Mur</a>', pre_content)

# The new content wrapper will just contain the grid and cards.
wall_content = f"""
<div class="sdp-card-grid" style="padding: var(--sdp-space-8) var(--sdp-space-4);">
{card_html}
{card_html}
{card_html}
{card_html}
{card_html}
{card_html}
</div>
"""

with open("mur_socdepoble.html", "w") as f:
    f.write(pre_content + "\n" + wall_content + "\n" + post_content)

print("Created mur_socdepoble.html")
