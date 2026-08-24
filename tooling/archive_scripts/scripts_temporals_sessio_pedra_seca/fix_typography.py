import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # 1. Remove max-width: var(--sdp-measure-editorial);
    content = re.sub(r'\s*max-width: var\(--sdp-measure-editorial\);', '', content)
    
    # 2. Fix the .lead text
    old_lead = r' és una plataforma dedicada a preservar la memòria digital\. Aquesta és la <em>entradilla</em>'
    new_lead = r'Aquesta és l\'<em>entradilla</em>'
    content = re.sub(old_lead, new_lead, content)

    with open(filename, "w") as f:
        f.write(content)
    print(f"Fixed typography in {filename}")

