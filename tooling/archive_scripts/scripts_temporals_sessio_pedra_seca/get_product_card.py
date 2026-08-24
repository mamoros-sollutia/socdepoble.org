import re

with open("disseny_pedra_seca.html", "r") as f:
    content = f.read()

# Extract Card 24.3 Targeta Mestra: Imatge Completa (Producte)
match = re.search(r'<h4>24\.3 Targeta Mestra: Imatge Completa \(Producte\)</h4>\s*(<article class="sp-card">.*?</article>)', content, re.DOTALL)
if match:
    card_html = match.group(1)
    with open("product_card.html", "w") as f:
        f.write(card_html)
    print("Found and saved product card.")
else:
    print("Failed to find product card.")
