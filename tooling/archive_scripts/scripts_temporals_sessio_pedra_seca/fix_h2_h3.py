import re

file_path = "disseny_pedra_seca.html"
with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Fix the Header (Move H2 and P out, add badges in)
old_header = '''    <header class="page-title">
      <!-- Logotip Mode Clar -->
      <img src="assets/img/logo-socdepoble-rect-negre.svg" alt="Logotip Sóc de Poble" class="page-title-logo light-only">
      <!-- Logotip Mode Fosc -->
      <img src="https://socdepoble.org/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="Logotip Sóc de Poble" class="page-title-logo dark-only">
      <h1 class="uppercase">Disseny Pedra Seca</h1>
      <h2 style="color: var(--sp-muted); font-size: 1.2rem; font-weight: 600; text-transform: none; margin-top: 8px;">Sistema oficial de disseny per a Sóc de Poble.</h2>
      <p style="margin-top: 16px; font-size: 1rem; color: var(--sp-text); max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, per a que qualsevol IA puga entendre este sistema i reproduir-lo.</p>
    </header>
    
    <!-- 5. CONTINGUT (Harmonia) -->
    <article class="content-wrapper">'''

new_header = '''    <header class="page-title">
      <!-- Logotip Mode Clar -->
      <img src="assets/img/logo-socdepoble-rect-negre.svg" alt="Logotip Sóc de Poble" class="page-title-logo light-only">
      <!-- Logotip Mode Fosc -->
      <img src="https://socdepoble.org/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="Logotip Sóc de Poble" class="page-title-logo dark-only">
      <h1 class="uppercase" style="margin-bottom: 16px;">Disseny Pedra Seca</h1>
      <div style="display: flex; gap: 8px; justify-content: center;">
        <span class="badge" style="background: var(--sdp-primary-100); color: var(--sp-orange);">MUR</span>
        <span class="badge" style="background: var(--sdp-secondary-100); color: var(--sp-blue);">DISSENY UI</span>
      </div>
    </header>
    
    <!-- 5. CONTINGUT (Harmonia) -->
    <article class="content-wrapper">
      
      <div style="padding: 32px 24px 0;">
        <h2 style="color: var(--sp-blue); font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 800; text-transform: none; text-align: center; margin-bottom: 16px;">Sistema oficial de disseny per a Sóc de Poble.</h2>
        <p style="text-align: center; max-width: 700px; margin: 0 auto 32px; font-size: 1.1rem; line-height: 1.6; color: var(--sp-text);">Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, per a que qualsevol IA puga entendre este sistema i reproduir-lo.</p>
      </div>'''

html = html.replace(old_header, new_header)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(html)
print("Updated header")
