import os

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

copyright_html = '<div class="sp-card-copyright sdp-mt-4">© Sóc de Poble / Fet per la IAIA i Nano Banana</div>'

for f_name in files:
    if not os.path.exists(f_name): continue
    with open(f_name, "r") as f:
        content = f.read()
    
    # We want to add copyright before </div>\n<footer class="sp-card-footer"> ONLY IF it's not already there.
    # We can split by <footer class="sp-card-footer">
    parts = content.split('<footer class="sp-card-footer">')
    
    new_content = parts[0]
    for i in range(1, len(parts)):
        # Check if the previous part ends with the copyright and </div>
        # Actually, let's just look for:
        # <span class="sp-card-label label-green">Caixa Real</span>
        # </div>
        # </div>
        # <footer class="sp-card-footer">
        
        # It's safer to just do a precise replace for Caixa Real and Hisenda.
        pass

    # Let's do a precise string replacement for the two Gestoria cards:
    
    # Caixa Real
    target_caixa = """<span class="sp-card-label label-green">Caixa Real</span>
</div>
</div>
<footer class="sp-card-footer">"""
    replace_caixa = """<span class="sp-card-label label-green">Caixa Real</span>
</div>
""" + copyright_html + """
</div>
<footer class="sp-card-footer">"""
    
    # Hisenda
    target_hisenda = """<span class="sp-card-label label-orange">Hisenda</span>
</div>
</div>
<footer class="sp-card-footer">"""
    replace_hisenda = """<span class="sp-card-label label-orange">Hisenda</span>
</div>
""" + copyright_html + """
</div>
<footer class="sp-card-footer">"""

    if target_caixa in content:
        content = content.replace(target_caixa, replace_caixa)
        print(f"Fixed Caixa Real in {f_name}")
    
    if target_hisenda in content:
        content = content.replace(target_hisenda, replace_hisenda)
        print(f"Fixed Hisenda in {f_name}")
        
    with open(f_name, "w") as f:
        f.write(content)

