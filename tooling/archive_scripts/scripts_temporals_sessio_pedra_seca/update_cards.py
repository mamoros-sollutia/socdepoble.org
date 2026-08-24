import re

file_path = "demo_pedra_seca.html"

with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

css_to_add = """
/* ---- MODIFICACIONS TARGETA MESTRA ---- */
.sp-card { position: relative; }
.sp-card-link-overlay { position: absolute; inset: 0; z-index: 1; border-radius: inherit; outline: none; }
.sp-card-link-overlay:focus-visible { box-shadow: 0 0 0 2px var(--sp-orange) inset; }
.sp-card-header, .sp-card-footer, .sp-card-author-link, .btn-icon-orange, .btn-date-time, .sp-card-action, .sp-card-connect, .sp-card-tag, .sp-card-play { position: relative; z-index: 2; }

/* Targeta Mestra Etiquetas Gestoria */
.sp-card-labels { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 16px; margin-bottom: 8px; position: relative; z-index: 2; }
.sp-card-label { padding: 4px 12px; border-radius: var(--sdp-radi-pastilla); font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
.label-blue { background: #E0F2FE; color: #0369A1; }
.label-green { background: #DCFCE7; color: #15803D; }
.label-orange { background: #FFEDD5; color: #C2410C; }
.label-purple { background: #F3E8FF; color: #7E22CE; }

/* Tooltip (Bocata) */
.tooltip-container { position: relative; display: inline-flex; z-index: 3; }
.tooltip-text {
  visibility: hidden; opacity: 0;
  background-color: var(--sp-black); color: var(--sp-white);
  text-align: center; border-radius: 4px; padding: 6px 10px;
  position: absolute; z-index: 4;
  top: 100%; left: 50%; transform: translateX(-50%) translateY(8px);
  font-size: 0.75rem; font-weight: 700; white-space: nowrap;
  transition: opacity var(--sdp-t), visibility var(--sdp-t), transform var(--sdp-t);
  pointer-events: none;
}
.tooltip-container:hover .tooltip-text { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(4px); }
.tooltip-text::after {
  content: ""; position: absolute; bottom: 100%; left: 50%; margin-left: -5px;
  border-width: 5px; border-style: solid; border-color: transparent transparent var(--sp-black) transparent;
}
"""

if "MODIFICACIONS TARGETA MESTRA" not in html:
    html = html.replace(".sp-card:hover {", css_to_add + "\\n.sp-card:hover {")

new_section_24 = '''      <section class="design-block">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">24. Targeta Mestra (Sóc de Poble Universal Card)</h2>
        <p style="text-align: center; margin-bottom: 32px; color: var(--sp-muted);">La Targeta Mestra és un bloc modular desmuntable i enllaçable (amb <code>&lt;a class="sp-card-link-overlay"&gt;</code>). Qualsevol clic dins d'ella condueix a la pàgina, excepte els botons amb funcions específiques (z-index superior).</p>

        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">24.1 Targeta Mestra: Text pur i Etiquetes (Gestoria de Poble)</h4>
        
        <article class="sp-card">
          <!-- Enllaç fantasma que recobreix tota la targeta -->
          <a href="#" class="sp-card-link-overlay" title="Obrir Caixa Real"></a>

          <header class="sp-card-header">
            <a href="#" class="sp-card-author-link" title="Anar al perfil de l'autor">
              <div class="sp-card-author">
                <img src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg" alt="Avatar" class="sp-card-avatar" style="padding: 0;">
                <div class="sp-card-author-info">
                  <div class="sp-card-author-name">Javi Llinares</div>
                  <div class="sp-card-author-location">La Torre de les Maçanes</div>
                </div>
              </div>
            </a>
            <div class="sp-card-meta" style="gap: 8px;">
              <!-- Tooltip (Bocata) d'Avís o PIN -->
              <div class="tooltip-container">
                <button class="btn-icon-orange" title="Mode Privadesa">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </button>
                <div class="tooltip-text">Mode Privadesa actiu</div>
              </div>
              <button class="btn-date-time" title="Veure calendari d'este dia">
                14:32<br>30/06/2026
              </button>
            </div>
          </header>
          
          <div class="sp-card-body">
            <h3 class="sp-card-subtitle" style="margin-bottom: 8px;">CAIXA REAL</h3>
            <p class="sp-card-text" style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: var(--sp-muted); margin-bottom: 24px;">SALDO DISPONIBLE</p>
            <div class="sp-card-price" style="font-size: 2.8rem; letter-spacing: -1px; margin-bottom: 24px;">***,** €</div>
            
            <div class="sp-card-labels">
              <span class="sp-card-label label-blue">GESTORIA</span>
              <span class="sp-card-label label-green">CAIXA REAL</span>
            </div>
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
            <button class="sp-card-connect" title="Connectar amb CAIXA REAL">+ CONNECTAR</button>
          </footer>
        </article>

        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">24.2 Targeta Mestra: Text pur (Hisenda)</h4>
        
        <article class="sp-card">
          <!-- Enllaç fantasma que recobreix tota la targeta -->
          <a href="#" class="sp-card-link-overlay" title="Obrir Hisenda"></a>

          <header class="sp-card-header">
            <a href="#" class="sp-card-author-link" title="Anar al perfil de l'autor">
              <div class="sp-card-author">
                <img src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg" alt="Avatar" class="sp-card-avatar" style="padding: 0;">
                <div class="sp-card-author-info">
                  <div class="sp-card-author-name">Javi Llinares</div>
                  <div class="sp-card-author-location">La Torre de les Maçanes</div>
                </div>
              </div>
            </a>
            <div class="sp-card-meta" style="gap: 8px;">
              <div class="tooltip-container">
                <button class="btn-icon-orange" title="Avís Important">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
                </button>
                <div class="tooltip-text">Falten 3 dies per presentar el model</div>
              </div>
              <button class="btn-date-time" title="Veure calendari d'este dia">
                14:32<br>30/06/2026
              </button>
            </div>
          </header>
          
          <div class="sp-card-body">
            <h3 class="sp-card-subtitle" style="margin-bottom: 8px;">HISENDA</h3>
            <p class="sp-card-text" style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: var(--sp-muted); margin-bottom: 24px;">MODEL 303 / 130</p>
            <div class="sp-card-price" style="font-size: 2.8rem; letter-spacing: -1px; margin-bottom: 24px;">***,** €</div>
            
            <div class="sp-card-labels">
              <span class="sp-card-label label-blue">GESTORIA</span>
              <span class="sp-card-label label-orange">HISENDA</span>
            </div>
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
            <button class="sp-card-connect" title="Connectar amb HISENDA">+ CONNECTAR</button>
          </footer>
        </article>

        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">24.3 Targeta Mestra: Imatge Completa (Producte)</h4>
        
        <article class="sp-card">
          <!-- Enllaç fantasma que recobreix tota la targeta -->
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
                00:33<br>23/3/2026
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
            
            <div class="sp-card-labels">
              <span class="sp-card-label label-purple">SOSTENIBLE</span>
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

start_marker = '      <section class="design-block">\\n        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">24. Targetes (Sóc de Poble Cards)</h2>'
end_marker = '      <!-- SECCIÓ 25: ESTADÍSTIQUES I DASHBOARDS -->'

start_idx = html.find('      <section class="design-block">\n        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">24. Targetes (Sóc de Poble Cards)</h2>')
end_idx = html.find('      <!-- SECCIÓ 25: ESTADÍSTIQUES I DASHBOARDS -->')

if start_idx != -1 and end_idx != -1:
    new_html = html[:start_idx] + new_section_24 + '\\n' + html[end_idx:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_html)
    print("Successfully replaced section 24.")
else:
    print(f"Could not find markers. start: {start_idx}, end: {end_idx}")

