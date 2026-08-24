import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # 1. Remove max-width from .lead
    content = content.replace("  max-width: 75ch;\n", "")

    # 2. Extract and remove the H2 paragraph
    old_h2_para = r'<p>L\'H2 divideix els grans blocs temàtics de la pàgina\. El text de cos \(<code>&lt;p&gt;</code>\) funciona com a ciment\. No pot baixar mai dels 16px en mòbil, però l\'estàndard base d\'este sistema és 18px\. Este paràgraf demostra la llegibilitat continuada i serveix d\'exemple de com es veu un text normal després de l\'entradilla\.</p>\n'
    content = re.sub(old_h2_para, '', content)

    # 3. Add the first part to the H1 preamble
    old_preamble = r'(<p>Dalt del títol pot anar una imatge o multimèdia d\\\'un ample màxim de 600x600\. Baix d\\\'aquest H1 aniran exclusivament els components de presentació de la Targeta Mestra: categoria, etiqueta i copyright\.</p>)'
    new_preamble = r'\1\n<p>L\'H2 divideix els grans blocs temàtics de la pàgina.</p>'
    content = re.sub(old_preamble, new_preamble, content)
    
    # 4. Add the second part under H3
    old_h3 = r'(<h3>H3: Sub-secció Temàtica \(24px\)</h3>\n<p>L\'H3 s\'empra per donar jerarquia interna dins d\'un bloc H2\. Sol acompanyar llistes de dades o enumeracions llargues\.</p>)'
    new_h3 = r'\1\n<p>El text de cos (<code>&lt;p&gt;</code>) funciona com a ciment. No pot baixar mai dels 16px en mòbil, però l\'estàndard base d\'este sistema és 18px. Este paràgraf demostra la llegibilitat continuada i serveix d\'exemple de com es veu un text normal després de l\'entradilla.</p>'
    content = re.sub(old_h3, new_h3, content)

    with open(filename, "w") as f:
        f.write(content)
    print(f"Fixed lead and text in {filename}")

