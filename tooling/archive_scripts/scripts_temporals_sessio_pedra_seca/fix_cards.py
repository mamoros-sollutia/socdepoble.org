import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix Connect button style
# Find .sp-card-connect css and add text-transform: uppercase; font-weight: 600;
# It's currently font-weight: 800; let's change it to 600.
content = re.sub(
    r'\.sp-card-connect \{ background: var\(--sdp-secondary-700\); border: none; color: #ffffff; font-weight: 800;',
    r'.sp-card-connect { background: var(--sdp-secondary-700); border: none; color: #ffffff; font-weight: 600; text-transform: uppercase;',
    content
)

# 2. Remove '+ ' from all buttons that have '+ Connectar'
content = content.replace('+ Connectar', 'Connectar')

# 3. Update Caixa Real card headers
# <h4 class="sp-card-subtitle sdp-mb-2">Caixa Real</h4>
# <p class="sp-card-text sdp-mb-6">Saldo Disponible</p>
content = re.sub(
    r'<h4 class="sp-card-subtitle sdp-mb-2">Caixa Real</h4>\n\s*<p class="sp-card-text sdp-mb-6">Saldo Disponible</p>',
    r'<h1>Caixa Real</h1>\n<h2>Saldo Disponible</h2>',
    content
)

# 4. Update Hisenda card headers
# <h4 class="sp-card-subtitle sdp-mb-2">Hisenda</h4>
# <p class="sp-card-text sdp-mb-6">Model 303 / 130</p>
content = re.sub(
    r'<h4 class="sp-card-subtitle sdp-mb-2">Hisenda</h4>\n\s*<p class="sp-card-text sdp-mb-6">Model 303 / 130</p>',
    r'<h1>Hisenda</h1>\n<h2>Model 303 / 130</h2>',
    content
)

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed cards.")
