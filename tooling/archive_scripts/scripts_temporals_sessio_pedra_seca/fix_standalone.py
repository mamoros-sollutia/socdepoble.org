import re

file_path = "demo_pedra_seca.html"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "24.4 Targetes en graella" in line:
        start_idx = i
    if "<!-- SECCIÓ 25: ESTADÍSTIQUES I DASHBOARDS -->" in line:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_card = '''        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">24.4 Targeta Mestra: Pàgina de Mur (Disseny)</h4>
        
        <article class="sp-card">
          <a href="#" class="sp-card-link-overlay" title="Obrir Disseny"></a>
          
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
                10:00<br>07/8/2026
              </button>
            </div>
          </header>
          
          <div class="sp-card-media">
            <img src="assets/img/ibanez_pedra_seca_design_1780873465211.png" alt="Disseny Pedra Seca">
          </div>
          
          <div class="sp-card-body">
            <div class="sp-card-title-row">
              <h3 class="sp-card-title">DISSENY PEDRA SECA</h3>
            </div>
            <p class="sp-card-text">Sistema de disseny oficial per a Sóc de Poble. Inclou la Targeta Mestra i els colors oficials.</p>
            
            <div class="sp-card-labels">
              <span class="sp-card-label label-orange">MUR</span>
              <span class="sp-card-label label-blue">DISSENY UI</span>
            </div>
            <div class="sp-card-copyright" style="margin-top: 16px;">© SÓC DE POBLE / FET PER LA IAIA I NANO BANANA</div>
          </div>
          
          <footer class="sp-card-footer">
            <div class="sp-card-actions">
              <button class="sp-card-action" title="Traduir">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
              </button>
              <button class="sp-card-action" title="Comentar (Xat Privat)">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              </button>
              <button class="sp-card-action" title="Compartir">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
            </div>
            <button class="sp-card-connect" title="Connectar">CONNECTAR</button>
          </footer>
        </article>
      </section>
'''

    lines = lines[:start_idx] + [new_card] + lines[end_idx:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Replaced grid with standalone card.")
else:
    print(f"Indices not found. start: {start_idx}, end: {end_idx}")

