import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Samarreta
content = re.sub(
    r'<h3 class="sp-card-title">Samarreta Sóc de Poble</h3>',
    r'<h1>Samarreta Sóc de Poble</h1>',
    content
)
content = re.sub(
    r'<p class="sp-card-text">L\'edició definitiva amb el Logotip Complet \(Mapa del Tresor\)\. Cotó Roly de màxima qualitat\.</p>',
    r'<h2>L\'edició definitiva amb el Logotip Complet</h2>\n<p class="sp-card-text">Dibuixos del mapa del tresor. Cotó Roly de màxima qualitat.</p>',
    content
)

# 2. Update Disseny Pedra Seca
content = re.sub(
    r'<h3 class="sp-card-title">Disseny Pedra Seca</h3>',
    r'<h1>Disseny Pedra Seca</h1>',
    content
)
content = re.sub(
    r'<h4 class="sp-card-subtitle[^>]*>Sistema oficial de disseny per a Sóc de Poble</h4>',
    r'<h2>Sistema oficial de disseny per a Sóc de Poble</h2>',
    content
)

# 3. Inject CSS for .sp-card-body h1 and h2
css_addition = """
.sp-card-body h1 { font-size: 1.4rem; margin-top: 0; margin-bottom: var(--sdp-space-1); text-align: center; color: var(--sdp-secondary-600); line-height: var(--sdp-leading-tight); font-weight: 800; }
.sp-card-body h2 { font-size: 1.15rem; margin-top: 0; margin-bottom: var(--sdp-space-3); text-align: center; color: var(--sdp-primary-600); line-height: var(--sdp-leading-snug); font-weight: 700; }
.sp-card-copyright { text-align: center; }
"""
content = re.sub(r'(\.sp-card-title \{[^}]*\})', r'\1\n' + css_addition, content)

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Cards uniformized and CSS updated.")
