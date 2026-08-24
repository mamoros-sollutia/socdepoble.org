import re

file_path = "disseny_pedra_seca.html"
with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update <title>
html = html.replace("<title>Pedra Seca - Disseny Pur</title>", "<title>Disseny Pedra Seca</title>")

# 2. Update page header
old_header = '''    <header class="page-title">
      <!-- Logotip Mode Clar -->
      <img src="assets/img/logo-socdepoble-rect-negre.svg" alt="Logotip Sóc de Poble" class="page-title-logo light-only">
      <!-- Logotip Mode Fosc -->
      <img src="https://socdepoble.org/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="Logotip Sóc de Poble" class="page-title-logo dark-only">
      <h1>DISSENY</h1>
      <p style="color:var(--sp-muted); font-weight:600; letter-spacing:0.1em; font-size:0.85rem;">DESIGN UI · PEDRA SECA</p>
    </header>'''

new_header = '''    <header class="page-title">
      <!-- Logotip Mode Clar -->
      <img src="assets/img/logo-socdepoble-rect-negre.svg" alt="Logotip Sóc de Poble" class="page-title-logo light-only">
      <!-- Logotip Mode Fosc -->
      <img src="https://socdepoble.org/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="Logotip Sóc de Poble" class="page-title-logo dark-only">
      <h1 class="uppercase">Disseny Pedra Seca</h1>
      <h2 style="color: var(--sp-muted); font-size: 1.2rem; font-weight: 600; text-transform: none; margin-top: 8px;">Sistema oficial de disseny per a Sóc de Poble.</h2>
      <p style="margin-top: 16px; font-size: 1rem; color: var(--sp-text); max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, per a que qualsevol IA puga entendre este sistema i reproduir-lo.</p>
    </header>'''

html = html.replace(old_header, new_header)

# 3. Add .uppercase utility class
if ".uppercase {" not in html:
    html = html.replace(".light-only { display: none; }", ".light-only { display: none; }\n.uppercase { text-transform: uppercase; }")

# 4. Update the card in 24.4
old_card_title = '<h3 class="sp-card-title">DISSENY PEDRA SECA</h3>'
new_card_title = '<h3 class="sp-card-title uppercase">Disseny Pedra Seca</h3>'
# Need to make sure we only replace it in 24.4, but there's only one instance.
html = html.replace(old_card_title, new_card_title)

old_card_text = '<p class="sp-card-text">Sistema de disseny oficial per a Sóc de Poble. Inclou la Targeta Mestra i els colors oficials.</p>'
new_card_text = '<p class="sp-card-text">Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, per a que qualsevol IA puga entendre este sistema i reproduir-lo.</p>'
html = html.replace(old_card_text, new_card_text)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(html)
print("Updated syncing")
