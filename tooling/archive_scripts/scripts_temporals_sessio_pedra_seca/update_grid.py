import re

file_path = "demo_pedra_seca.html"

with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

# Change H1 color
target_h1 = "header.page-title h1 {\n  font-size: clamp(1.8rem, 4.5vw, 2.5rem);\n  color: var(--sp-blue);\n  margin-bottom: 8px;\n  letter-spacing: 0.02em;\n}"
replacement_h1 = "header.page-title h1 {\n  font-size: clamp(1.8rem, 4.5vw, 2.5rem);\n  color: var(--sp-black);\n  margin-bottom: 8px;\n  letter-spacing: 0.02em;\n}"

if target_h1 in html:
    html = html.replace(target_h1, replacement_h1)
    print("Successfully replaced H1 color.")
else:
    print("Could not find H1 target.")

# Insert new grid
new_grid = '''        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">24.4 Targetes en graella (Mur / Mercat)</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; max-width: 1000px; margin: 0 auto;">
          <!-- Card 1: Samarreta placeholder -->
          <article class="sp-card" style="margin: 0; max-width: none;">
            <a href="#" class="sp-card-link-overlay" title="Obrir Samarreta"></a>
            <header class="sp-card-header">
              <a href="#" class="sp-card-author-link" title="Anar al perfil de l'autor">
                <div class="sp-card-author">
                  <img src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg" alt="Avatar" class="sp-card-avatar" style="padding: 0;">
                  <div class="sp-card-author-info">
                    <div class="sp-card-author-name">Sóc de Poble</div>
                    <div class="sp-card-author-location">La Torre de les Maçanes</div>
                  </div>
                </div>
              </a>
              <div class="sp-card-meta" style="gap: 8px;">
                <button class="btn-date-time" title="Veure calendari d'este dia">
                  23:33<br>22/3/2026
                </button>
              </div>
            </header>
            <div class="sp-card-media">
              <img src="assets/img/ibanez_pedra_seca_design_1780873465211.png" alt="Samarreta">
            </div>
            <div class="sp-card-body">
              <div class="sp-card-title-row">
                <h3 class="sp-card-title">SAMARRETA SÓC DE POBLE</h3>
                <div class="sp-card-price">15.00€</div>
              </div>
              <p class="sp-card-text">L'edició definitiva amb el Logotip Complet (Mapa del Tresor). Cotó Roly de màxima qualitat.</p>
            </div>
            <footer class="sp-card-footer">
              <div class="sp-card-actions">
                <button class="sp-card-action" title="Traduir">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
                </button>
              </div>
              <button class="sp-card-connect" title="Connectar">+ CONNECTAR</button>
            </footer>
          </article>

          <!-- Card 2: Design Page -->
          <article class="sp-card" style="margin: 0; max-width: none;">
            <a href="#" class="sp-card-link-overlay" title="Obrir Disseny"></a>
            <header class="sp-card-header">
              <a href="#" class="sp-card-author-link" title="Anar al perfil de l'autor">
                <div class="sp-card-author">
                  <img src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg" alt="Avatar" class="sp-card-avatar" style="padding: 0;">
                  <div class="sp-card-author-info">
                    <div class="sp-card-author-name">Sóc de Poble</div>
                    <div class="sp-card-author-location">UI / UX</div>
                  </div>
                </div>
              </a>
              <div class="sp-card-meta" style="gap: 8px;">
                <button class="btn-date-time" title="Veure calendari d'este dia">
                  10:00<br>07/8/2026
                </button>
              </div>
            </header>
            <div class="sp-card-media" style="padding: 32px; background: var(--sdp-pedra-100); display: flex; align-items: center; justify-content: center; min-height: 200px;">
              <img src="assets/img/logo-socdepoble-rect-negre.svg" alt="Disseny" style="max-width: 200px;" class="light-only">
              <img src="https://socdepoble.org/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="Disseny" style="max-width: 200px;" class="dark-only">
            </div>
            <div class="sp-card-body">
              <div class="sp-card-title-row">
                <h3 class="sp-card-title">DISSENY PEDRA SECA</h3>
              </div>
              <p class="sp-card-text">Sistema de disseny oficial per a Sóc de Poble. Inclou la Targeta Mestra i els colors oficials.</p>
            </div>
            <footer class="sp-card-footer">
              <div class="sp-card-actions">
                <button class="sp-card-action" title="Compartir">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                </button>
              </div>
              <button class="sp-card-connect" title="Veure Disseny">+ CONNECTAR</button>
            </footer>
          </article>
        </div>
      </section>
      <!-- SECCIÓ 25: ESTADÍSTIQUES I DASHBOARDS -->'''

target_grid = "      </section>\n      <!-- SECCIÓ 25: ESTADÍSTIQUES I DASHBOARDS -->"

if target_grid in html:
    html = html.replace(target_grid, new_grid)
    print("Successfully added grid.")
else:
    print("Could not find Grid target.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(html)

