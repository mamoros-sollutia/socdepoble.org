import re

with open("disseny_pedra_seca.html", "r") as f:
    content = f.read()

# Extract Card 24.4
match = re.search(r'<h4>24\.4 Targeta Mestra: Pàgina de Mur \(Disseny\)</h4>\s*(<article class="sp-card">.*?</article>)', content, re.DOTALL)
card_html = match.group(1) if match else "<!-- Card HTML missing -->"

# Extract header, nav, up to the start of content-wrapper
pre_match = re.search(r'^(.*?)<article class="content-wrapper">', content, re.DOTALL)
pre_content = pre_match.group(1) if pre_match else ""

# Extract everything from the end of <main> to the EOF
post_match = re.search(r'(</main>.*)', content, re.DOTALL)
post_content = post_match.group(1) if post_match else ""

if pre_content and post_content:
    # Modify title in pre_content
    pre_content = re.sub(r'<h1>Disseny Pedra Seca</h1>', '<h1>Mur de Sóc de Poble</h1>', pre_content)
    pre_content = re.sub(r'<h2>Sistema oficial de disseny per a Sóc de Poble</h2>', '<h2>El pols del nostre poble en temps real</h2>', pre_content)
    pre_content = re.sub(r'<p class="lead">.*?</p>', '<p class="lead">Descobreix tot el que passa a La Torre de les Maçanes. Anuncis, esdeveniments, memòria i molt més.</p>', pre_content, flags=re.DOTALL)
    pre_content = re.sub(r'<a class="nav-item active" href="#">Disseny</a>', '<a class="nav-item" href="#">Disseny</a>', pre_content)
    pre_content = re.sub(r'<a class="nav-item" href="#">Mur</a>', '<a class="nav-item active" href="#">Mur</a>', pre_content)

    wall_content = f"""
    <article class="content-wrapper">
        <div class="sdp-card-grid sdp-mb-8">
{card_html}
{card_html}
{card_html}
{card_html}
{card_html}
{card_html}
        </div>
    </article>
    """

    with open("mur_socdepoble.html", "w") as f:
        f.write(pre_content + wall_content + post_content)
    print("mur_socdepoble.html successfully created!")
else:
    print("Extraction failed")
