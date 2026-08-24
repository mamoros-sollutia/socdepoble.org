import re
import os

with open("mur_socdepoble.html", "r") as f:
    mur_content = f.read()

with open("product_card.html", "r") as f:
    product_card_html = f.read()

# Generate the 6-card grid for mercat
mercat_grid = f'<div class="sdp-card-grid sdp-mb-8">\n' + (product_card_html + '\n') * 6 + '</div>'

# 1. Add "Mercat" link to all three files (disseny, mur, mercat will have it)
# We need to insert it right after the "Mur" link in the sidebar
sidebar_mur_link = r'<a class="nav-item(.*?)href="(.*?)">Mur</a>'
def insert_mercat_link(content):
    # Find the Mur link and append Mercat link
    return re.sub(
        r'(<a class="nav-item(?: active)?" href=".*?">Mur</a>)',
        r'\1\n<a class="nav-item" href="mercat_socdepoble.html">Mercat</a>',
        content
    )

# 2. Prepare mercat_socdepoble.html content
mercat_content = mur_content

# Replace the grid in mercat
mercat_content = re.sub(
    r'<div class="sdp-card-grid sdp-mb-8">.*?</div>',
    mercat_grid,
    mercat_content,
    flags=re.DOTALL
)

# Update the header titles in mercat
mercat_content = mercat_content.replace('<h1>Mur de Sóc de Poble</h1>', '<h1>Mercat de Sóc de Poble</h1>')
mercat_content = mercat_content.replace('<h2>El pols del nostre poble en temps real</h2>', '<h2>Productes locals, de la terra al cabàs</h2>')
mercat_content = mercat_content.replace('<p class="lead">Descobreix tot el que passa a La Torre de les Maçanes. Anuncis, esdeveniments, memòria i molt més.</p>', '<p class="lead">Troba els millors productes de proximitat oferts pels veïns i comerços de La Torre de les Maçanes.</p>')

# Add Mercat link to all
for filename in ["disseny_pedra_seca.html", "mur_socdepoble.html"]:
    with open(filename, "r") as f:
        file_content = f.read()
    
    # We must be careful not to duplicate if we run it multiple times.
    if ">Mercat</a>" not in file_content:
        file_content = insert_mercat_link(file_content)
        with open(filename, "w") as f:
            f.write(file_content)

# For mercat_socdepoble.html, add the link, then make it active instead of Mur
mercat_content = insert_mercat_link(mercat_content)
mercat_content = mercat_content.replace('<a class="nav-item active" href="mur_socdepoble.html">Mur</a>', '<a class="nav-item" href="mur_socdepoble.html">Mur</a>')
mercat_content = mercat_content.replace('<a class="nav-item" href="mercat_socdepoble.html">Mercat</a>', '<a class="nav-item active" href="mercat_socdepoble.html">Mercat</a>')

with open("mercat_socdepoble.html", "w") as f:
    f.write(mercat_content)

os.remove("product_card.html")
print("Mercat created and linked.")
