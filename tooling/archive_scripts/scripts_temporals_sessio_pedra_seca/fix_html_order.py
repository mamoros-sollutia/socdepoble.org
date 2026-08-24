import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # 1. Swap H1 and the paragraph
    old_h1_block = r'<h1>H1: Títol Principal \(40px\)</h1>\n<p>Dalt del títol pot anar una imatge o multimèdia d\'un ample màxim de 600x600\. Baix d\'aquest H1 aniran exclusivament els components de presentació de la Targeta Mestra: categoria, etiqueta i copyright\.</p>'
    new_h1_block = r'<p>Dalt del títol pot anar una imatge o multimèdia d\'un ample màxim de 600x600. Baix d\'aquest H1 aniran exclusivament els components de presentació de la Targeta Mestra: categoria, etiqueta i copyright.</p>\n<h1>H1: Títol Principal (40px)</h1>'
    content = re.sub(old_h1_block, new_h1_block, content)
    
    # 2. Wrap H2 and .lead in <div class="sdp-text-center">
    old_h2_block = r'(<h2>H2: Secció Major \(32px\)</h2>\n<p class="lead">\nAquesta és l\'<em>entradilla</em> \(<code>&lt;p class="lead"&gt;</code>\)\. S\'usa exclusivament sota l\'H2 per establir la premissa de la secció amb un cos superior al text normal\.\n</p>)'
    new_h2_block = r'<div class="sdp-text-center">\n\1\n</div>'
    content = re.sub(old_h2_block, new_h2_block, content)

    with open(filename, "w") as f:
        f.write(content)
    print(f"Fixed {filename}")

