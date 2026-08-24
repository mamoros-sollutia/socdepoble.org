import fs from 'fs';
const file = 'demo_pedra_seca.html';
let content = fs.readFileSync(file, 'utf8');

const cssToAdd = `
    /* 24. Targetes Mestres (Sóc de Poble Cards) */
    .sp-card { background: var(--sp-white); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); margin-bottom: 32px; max-width: 500px; margin-left: auto; margin-right: auto; }
    .sp-card-header { background: var(--sp-orange); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
    .sp-card-author { display: flex; align-items: center; gap: 12px; }
    .sp-card-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--sp-white); object-fit: cover; }
    .sp-card-author-info { display: flex; flex-direction: column; }
    .sp-card-author-name { font-weight: 700; color: var(--sp-black); font-size: 0.95rem; line-height: 1.2; }
    .sp-card-author-location { font-size: 0.75rem; color: var(--sp-black); display: flex; align-items: center; gap: 4px; }
    .sp-card-meta { display: flex; align-items: center; gap: 8px; color: var(--sp-white); text-align: right; }
    .sp-card-meta-icon { font-size: 1.2rem; }
    .sp-card-meta-text { display: flex; flex-direction: column; font-size: 0.7rem; font-weight: 700; line-height: 1.2; }
    
    .sp-card-media { width: 100%; position: relative; }
    .sp-card-media img { width: 100%; display: block; object-fit: cover; }
    .sp-card-play { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); width: 64px; height: 64px; background: var(--sp-orange); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--sp-white); cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s; }
    .sp-card-play:hover { transform: translateX(-50%) scale(1.1); }
    .sp-card-play svg { width: 32px; height: 32px; margin-left: 4px; fill: currentColor; }
    
    .sp-card-body { padding: 24px 24px 16px 24px; text-align: center; }
    .sp-card-title-row { display: flex; justify-content: center; align-items: baseline; gap: 12px; margin-bottom: 4px; }
    .sp-card-title { font-family: 'Noto Sans', sans-serif; font-size: 1.4rem; color: var(--sp-black); text-transform: uppercase; margin: 0; }
    .sp-card-price { font-size: 1.4rem; font-weight: 700; color: var(--sp-blue); }
    .sp-card-subtitle { color: var(--sp-blue); font-weight: 700; text-transform: uppercase; font-size: 1rem; margin-bottom: 12px; }
    .sp-card-text { color: var(--sp-text); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px; }
    .sp-card-readmore { color: var(--sp-orange); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; display: inline-block; cursor: pointer; }
    .sp-card-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 12px; }
    .sp-card-tag { color: var(--sp-blue); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .sp-card-copyright { color: #A0A0A0; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; }
    
    .sp-card-footer { background: var(--sp-blue); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; color: var(--sp-white); }
    .sp-card-actions { display: flex; gap: 16px; align-items: center; }
    .sp-card-action { background: transparent; border: none; color: var(--sp-white); display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 1.2rem; padding: 0; }
    .sp-card-connect { background: transparent; border: none; color: var(--sp-white); font-weight: 700; font-size: 0.9rem; cursor: pointer; letter-spacing: 0.5px; display: flex; align-items: center; gap: 4px; }

    /* 25. Estadístiques */
    .stat-card { display: flex; align-items: center; gap: 16px; background: var(--sp-white); border: 1px solid #E5E5E5; padding: 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
    .stat-icon { font-size: 2rem; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--sp-black); line-height: 1; margin-bottom: 4px; }
    .stat-label { font-size: 0.85rem; color: var(--sp-muted); text-transform: uppercase; }
    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
    
    .dashboard-panel { background: var(--sp-white); border: 1px solid #E5E5E5; border-radius: 8px; overflow: hidden; margin-bottom: 24px; }
    .dashboard-header { background: #f8f9fa; padding: 12px 16px; border-bottom: 1px solid #E5E5E5; font-weight: 700; text-transform: uppercase; text-align: center; color: var(--sp-black); display: flex; align-items: center; justify-content: center; gap: 8px; }
    .dashboard-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #E5E5E5; }
    .dashboard-item { background: var(--sp-white); padding: 24px 16px; text-align: center; }
    .dashboard-item-value { font-size: 1.25rem; font-weight: 700; color: var(--sp-black); margin-bottom: 4px; }
    .dashboard-item-label { font-size: 0.75rem; color: var(--sp-muted); text-transform: uppercase; }
    .dashboard-footer { padding: 8px; text-align: center; font-size: 0.75rem; color: var(--sp-muted); background: #f8f9fa; border-top: 1px solid #E5E5E5; }
    
    /* 26. Cerca i filtratge */
    .search-bar-basic { display: flex; margin-bottom: 24px; }
    .search-bar-basic input { flex: 1; padding: 12px 16px; border: 1px solid #E5E5E5; border-radius: 8px 0 0 8px; outline: none; font-size: 1rem; }
    .search-bar-basic button { background: var(--sp-black); color: var(--sp-white); border: none; padding: 0 24px; border-radius: 0 8px 8px 0; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }
    
    .search-filters { display: flex; gap: 16px; margin-bottom: 24px; }
    .search-filters input, .search-filters select { padding: 12px 16px; border: 1px solid #E5E5E5; border-radius: 8px; outline: none; font-size: 1rem; }
    .search-filters input { flex: 2; }
    .search-filters select { flex: 1; }
    .search-filters button { background: var(--sp-black); color: var(--sp-white); border: none; padding: 0 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }
    
    .search-result { margin-bottom: 24px; }
    .search-result-title { font-size: 1.1rem; font-weight: 700; color: var(--sp-orange); text-transform: uppercase; margin-bottom: 4px; }
    .search-result-meta { font-size: 0.75rem; color: var(--sp-muted); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em; }
    .search-result-excerpt { color: var(--sp-text); font-size: 0.95rem; line-height: 1.5; }
    
    /* 27. Paginació simplificada */
    .pagination-simple { display: flex; justify-content: space-between; margin-top: 32px; gap: 16px; }
    .pagination-simple a { display: flex; flex-direction: column; padding: 12px 16px; border: 1px solid #E5E5E5; border-radius: 8px; text-decoration: none; color: var(--sp-black); flex: 1; transition: background 0.2s; }
    .pagination-simple a:hover { background: #f8f9fa; }
    .pagination-simple a.next { text-align: right; }
    .pagination-label { font-size: 0.75rem; color: var(--sp-muted); text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.05em; }
    .pagination-title { font-weight: 700; font-size: 1rem; }
    
    /* 28. Checklists */
    .checklist-admin { background: var(--sp-white); border: 1px solid #E5E5E5; border-radius: 8px; overflow: hidden; margin-bottom: 24px; }
    .checklist-item { padding: 12px 16px; border-bottom: 1px solid #E5E5E5; display: flex; align-items: flex-start; gap: 12px; }
    .checklist-item:last-child { border-bottom: none; }
    .checklist-item input[type="checkbox"] { margin-top: 4px; }
    .checklist-item label { font-size: 0.95rem; color: var(--sp-text); flex: 1; line-height: 1.4; }
    .checklist-item .date-tag { font-size: 0.75rem; color: var(--sp-orange); font-weight: 700; }
    .checklist-item .date-tag.done { color: var(--sp-muted); }
    
    /* 29. Upload i descàrregues */
    .upload-zone { border: 2px dashed #E5E5E5; border-radius: 8px; padding: 32px; text-align: center; background: #fcfcfc; margin-bottom: 16px; }
    .upload-zone-text { font-size: 1.1rem; font-weight: 700; color: var(--sp-black); margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .upload-zone-sub { font-size: 0.85rem; color: var(--sp-muted); }
    .upload-zone-sub span { color: var(--sp-orange); cursor: pointer; }
    
    .file-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border: 1px solid #E5E5E5; border-radius: 8px; margin-bottom: 8px; background: var(--sp-white); }
    .file-item-info { display: flex; flex-direction: column; }
    .file-item-name { font-size: 0.95rem; color: var(--sp-text); }
    .file-item-meta { font-size: 0.75rem; color: var(--sp-muted); }
    .file-item-action { color: var(--sp-muted); cursor: pointer; }
    
    .download-card { display: flex; align-items: center; gap: 16px; padding: 16px; border: 1px solid #E5E5E5; border-radius: 8px; background: var(--sp-white); margin-bottom: 24px; }
    .download-card-icon { font-size: 2rem; color: var(--sp-blue); }
    .download-card-info { flex: 1; display: flex; flex-direction: column; }
    .download-card-title { font-size: 1.1rem; font-weight: 700; color: var(--sp-black); margin-bottom: 4px; }
    .download-card-meta { font-size: 0.8rem; color: var(--sp-muted); }
    .download-card-btn { color: var(--sp-white); background: var(--sp-blue); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; }
    
    /* 30. Embeddings */
    .embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px; margin-bottom: 8px; background: #000; }
    .embed-container iframe, .embed-container video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
    .embed-caption { font-size: 0.85rem; color: var(--sp-muted); text-align: center; margin-bottom: 24px; }
    
    .audio-player { display: flex; align-items: center; gap: 16px; background: #f8f9fa; padding: 12px 24px; border-radius: 40px; margin-bottom: 8px; }
    .audio-play-btn { width: 40px; height: 40px; background: var(--sp-orange); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--sp-white); border: none; cursor: pointer; }
    .audio-play-btn svg { width: 20px; height: 20px; fill: currentColor; margin-left: 2px; }
    .audio-progress { flex: 1; height: 4px; background: #E5E5E5; border-radius: 2px; position: relative; }
    .audio-progress-fill { position: absolute; top: 0; left: 0; height: 100%; background: var(--sp-orange); width: 35%; border-radius: 2px; }
    .audio-time { font-size: 0.75rem; color: var(--sp-muted); font-weight: 700; }
    
    /* 31. Classes Utilitàries */
    .utils-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    .utils-box { border: 1px solid #E5E5E5; border-radius: 8px; padding: 16px; background: var(--sp-white); }
    .utils-box h4 { text-transform: uppercase; margin-bottom: 12px; color: var(--sp-black); font-size: 1rem; }
    .utils-list { list-style: none; padding: 0; margin: 0; font-family: monospace; font-size: 0.85rem; color: var(--sp-text); line-height: 2; }
    .utils-list li strong { color: var(--sp-orange); }
`;

const htmlToAdd = `      <!-- SECCIÓ 24: TARGETES MESTRES -->
      <section class="design-block">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">24. Targetes (Sóc de Poble Cards)</h2>
        
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">24.1 Targeta Mestra Completa (Producte)</h4>
        
        <div class="sp-card">
          <div class="sp-card-header">
            <div class="sp-card-author">
              <img src="assets/img/logo-socdepoble-rect-negre.svg" alt="Avatar" class="sp-card-avatar">
              <div class="sp-card-author-info">
                <div class="sp-card-author-name">Sóc de Poble</div>
                <div class="sp-card-author-location">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  La Torre de les Maçanes
                </div>
              </div>
            </div>
            <div class="sp-card-meta">
              <div class="sp-card-meta-icon">📌</div>
              <div class="sp-card-meta-text">
                <div>00:33</div>
                <div>23/3/2026</div>
              </div>
            </div>
          </div>
          
          <div class="sp-card-media">
            <img src="assets/img/ibanez_pedra_seca_design_1780873465211.png" alt="Samarreta">
          </div>
          
          <div class="sp-card-body">
            <div class="sp-card-title-row">
              <h3 class="sp-card-title">SAMARRETA SÓC DE POBLE</h3>
              <div class="sp-card-price">15.00€</div>
            </div>
            <div class="sp-card-subtitle">SÓC DE POBLE</div>
            <p class="sp-card-text">L'edició definitiva amb el Logotip Complet (Mapa del Tresor). Cotó Roly de màxima qualitat.</p>
            <div class="sp-card-readmore">LLEGIR MÉS</div>
            <div class="sp-card-tags">
              <span class="sp-card-tag">Sostenible</span>
            </div>
            <div class="sp-card-copyright">© SÓC DE POBLE / FET PER LA IAIA I NANO BANANA</div>
          </div>
          
          <div class="sp-card-footer">
            <div class="sp-card-actions">
              <button class="sp-card-action"><span>💬</span> 9</button>
              <button class="sp-card-action"><span>🗨️</span></button>
              <button class="sp-card-action"><span>🔗</span></button>
            </div>
            <button class="sp-card-connect">+ CONNECTAR</button>
          </div>
        </div>

        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">24.2 Targeta Mestra Completa (Vídeo)</h4>
        
        <div class="sp-card">
          <div class="sp-card-header">
            <div class="sp-card-author">
              <img src="assets/img/logo-socdepoble-rect-negre.svg" alt="Avatar" class="sp-card-avatar">
              <div class="sp-card-author-info">
                <div class="sp-card-author-name">Sóc de Poble</div>
                <div class="sp-card-author-location">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  La Torre de les Maçanes
                </div>
              </div>
            </div>
            <div class="sp-card-meta">
              <div class="sp-card-meta-icon">📣</div>
              <div class="sp-card-meta-text">
                <div>03:49</div>
                <div>5/8/2026</div>
              </div>
            </div>
          </div>
          
          <div class="sp-card-media">
            <img src="assets/img/ibanez_pedra_seca_design_1780873465211.png" alt="Vídeo">
            <div class="sp-card-play">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          
          <div class="sp-card-body">
            <div class="sp-card-title-row">
              <h3 class="sp-card-title">SÓC DE POBLE: PORTAL DE POBLES CONNECTATS</h3>
            </div>
            <div class="sp-card-subtitle">SÓC DE POBLE</div>
            <p class="sp-card-text">Sóc de Poble serà un PORTAL DE POBLES CONNECTATS on compartir informació, experiències i idees que faciliten el desenvolupament sostenible i tecnològic en entorns rurals.</p>
            <div class="sp-card-readmore">LLEGIR MÉS</div>
            <div class="sp-card-tags">
              <span class="sp-card-tag">Sostenible</span>
              <span class="sp-card-tag">Tecnologia</span>
              <span class="sp-card-tag">Món rural</span>
            </div>
            <div class="sp-card-copyright">© SÓC DE POBLE / FET PER LA IAIA I NANO BANANA</div>
          </div>
          
          <div class="sp-card-footer">
            <div class="sp-card-actions">
              <button class="sp-card-action"><span>💬</span> 0</button>
              <button class="sp-card-action"><span>🗨️</span></button>
              <button class="sp-card-action"><span>🔗</span></button>
            </div>
            <button class="sp-card-connect">+ CONNECTAR</button>
          </div>
        </div>
      </section>

      <!-- SECCIÓ 25: ESTADÍSTIQUES I DASHBOARDS -->
      <section class="design-block">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">25. Estadístiques i Dashboards</h2>
        
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">25.1 Targeta d'estadística</h4>
        <div class="stat-card" style="max-width: 300px; margin-bottom: 24px;">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <div class="stat-value">5.847</div>
            <div class="stat-label">Habitants</div>
          </div>
        </div>

        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">25.2 Grid d'estadístiques</h4>
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <div class="stat-value">776</div>
              <div class="stat-label">Anys d'història</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏠</div>
            <div class="stat-info">
              <div class="stat-value">2.341</div>
              <div class="stat-label">Habitatges</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🌳</div>
            <div class="stat-info">
              <div class="stat-value">33,4</div>
              <div class="stat-label">Km² de natura</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📖</div>
            <div class="stat-info">
              <div class="stat-value">142</div>
              <div class="stat-label">Documents històrics</div>
            </div>
          </div>
        </div>

        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">25.3 Panell d'Umami (Integració directa)</h4>
        <div class="dashboard-panel">
          <div class="dashboard-header">📊 Activitat del Portal</div>
          <div class="dashboard-grid">
            <div class="dashboard-item">
              <div class="dashboard-item-value">--</div>
              <div class="dashboard-item-label">Visitants únics</div>
            </div>
            <div class="dashboard-item">
              <div class="dashboard-item-value">--</div>
              <div class="dashboard-item-label">Pàgines vistes</div>
            </div>
            <div class="dashboard-item">
              <div class="dashboard-item-value">--</div>
              <div class="dashboard-item-label">Taxa de rebuig</div>
            </div>
            <div class="dashboard-item">
              <div class="dashboard-item-value">--</div>
              <div class="dashboard-item-label">Duració mitjana</div>
            </div>
          </div>
          <div class="dashboard-footer">Dades d'<span style="color: var(--sp-orange); font-weight: 700;">Umami Analytics</span> • Actualització en temps real</div>
        </div>
      </section>

      <!-- SECCIÓ 26: CERCA I FILTRATGE -->
      <section class="design-block">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">26. Cerca i Filtratge</h2>
        
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">26.1 Barra de cerca bàsica</h4>
        <div class="search-bar-basic">
          <input type="text" placeholder="Cerca pobles, festes, documents...">
          <button>🔍 Cerca</button>
        </div>
        
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">26.2 Cerca amb filtres</h4>
        <div class="search-filters">
          <input type="text" placeholder="Cerca...">
          <select>
            <option>Totes les categories</option>
            <option>Festes</option>
            <option>Llocs</option>
          </select>
          <button>Cerca</button>
        </div>

        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">26.3 Resultats de cerca</h4>
        <div style="font-size: 0.85rem; color: var(--sp-muted); margin-bottom: 16px;">S'han trobat <strong>12 resultats</strong> per a "festa major"</div>
        
        <div class="search-result">
          <div class="search-result-title">Festa Major de Benigànim</div>
          <div class="search-result-meta">Festes • Benigànim • Agost 2024</div>
          <div class="search-result-excerpt">Del 15 al 24 d'agost celebrem les festes patronals amb més de 50 activitats per a tots els públics...</div>
        </div>
        <div class="search-result">
          <div class="search-result-title">Festa Major de Llutxent</div>
          <div class="search-result-meta">Festes • Llutxent • Setembre 2024</div>
          <div class="search-result-excerpt">La festa major de Llutxent destaca per la seua processó de les festes de la Mare de Déu...</div>
        </div>
      </section>

      <!-- SECCIÓ 27: PAGINACIÓ -->
      <section class="design-block">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">27. Paginació</h2>
        
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">27.1 Paginació numèrica</h4>
        <div class="pagination">
          <a href="#" class="page-btn">← Primera</a>
          <a href="#" class="page-btn">2</a>
          <a href="#" class="page-btn active">3</a>
          <a href="#" class="page-btn">4</a>
          <a href="#" class="page-btn">5</a>
          <span>...</span>
          <a href="#" class="page-btn">24</a>
          <a href="#" class="page-btn">Següent →</a>
        </div>
        
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted); margin-top: 24px;">27.2 Paginació simplificada (anterior / següent)</h4>
        <div class="pagination-simple">
          <a href="#">
            <span class="pagination-label">← Article Anterior</span>
            <span class="pagination-title">Les festes de la Magdalena</span>
          </a>
          <a href="#" class="next">
            <span class="pagination-label">Article Següent →</span>
            <span class="pagination-title">La ruta del riu-rau</span>
          </a>
        </div>
      </section>

      <!-- SECCIÓ 28: TASQUES I CHECKLISTS -->
      <section class="design-block">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">28. Llistes de Tasques i Checklists</h2>
        
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">28.1 Checklist d'administració</h4>
        <div class="checklist-admin">
          <div class="checklist-item">
            <input type="checkbox" checked>
            <label>✅ Verificació prèvia a publicar</label>
          </div>
          <div class="checklist-item">
            <input type="checkbox" checked>
            <label>Revisar ortografia i valencià</label>
          </div>
          <div class="checklist-item">
            <input type="checkbox" checked>
            <label>Comprovar imatges (alt text obligatori)</label>
          </div>
          <div class="checklist-item">
            <input type="checkbox">
            <label>Validar enllaços interns</label>
          </div>
          <div class="checklist-item">
            <input type="checkbox">
            <label>Revisar contrast de colors (WCAG 2.1 AA)</label>
          </div>
        </div>

        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">28.2 Llista de tasques amb progrés</h4>
        <div class="checklist-admin">
          <div class="checklist-item">
            <input type="checkbox" checked>
            <label style="text-decoration: line-through; color: var(--sp-muted);">Migrar base de dades històrica</label>
            <span class="date-tag done">15/01</span>
          </div>
          <div class="checklist-item">
            <input type="checkbox">
            <label>Digitalitzar fotografies del fons municipal</label>
            <span class="date-tag">01/02</span>
          </div>
        </div>
      </section>

      <!-- SECCIÓ 29: UPLOAD I DESCÀRREGUES -->
      <section class="design-block">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">29. Upload i Descàrregues</h2>
        
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">29.1 Zona d'arrossegament d'arxius</h4>
        <div class="upload-zone">
          <div class="upload-zone-text">📎 Arrossega els arxius ací</div>
          <div class="upload-zone-sub">o <span>selecciona'ls del teu dispositiu</span></div>
          <div style="font-size: 0.75rem; color: #A0A0A0; margin-top: 8px;">Màxim 10MB per arxiu. Formats: JPG, PNG, PDF</div>
        </div>
        
        <div class="file-item">
          <div class="file-item-info">
            <div class="file-item-name">festa_major_2024.jpg</div>
            <div class="file-item-meta">2,4 MB</div>
          </div>
          <div class="file-item-action">🗑️</div>
        </div>

        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted); margin-top: 24px;">29.2 Enllaç de descàrrega</h4>
        <div class="download-card">
          <div class="download-card-icon">📄</div>
          <div class="download-card-info">
            <div class="download-card-title">Carta Pobla de Benigànim (1248)</div>
            <div class="download-card-meta">PDF • 3,2 MB • Transcripció paleogràfica</div>
          </div>
          <a href="#" class="download-card-btn">⬇</a>
        </div>
      </section>

      <!-- SECCIÓ 30: EMBEDDINGS I MEDIA EXTERNA -->
      <section class="design-block">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">30. Embeddings i Media Externa</h2>
        
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">30.1 Vídeo embebint (HTML5 natiu)</h4>
        <div class="embed-container">
          <div style="position: absolute; top:0; left:0; width: 100%; height: 100%; background: #333; display: flex; align-items: center; justify-content: center; color: var(--sp-white);">
            <div style="width: 64px; height: 64px; background: red; border-radius: 12px; display: flex; align-items: center; justify-content: center;">▶</div>
          </div>
        </div>
        <div class="embed-caption">Sóc de Poble: Portal de pobles connectats (2013)</div>
        
        <div class="accordion" style="margin-bottom: 24px;">
          <div class="accordion-header">
            📄 Descripció del vídeo original
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">30.2 Mapa embebint (iframe amb fallback)</h4>
        <div class="embed-container" style="background: #E5E5E5; display: flex; align-items: center; justify-content: center; color: var(--sp-muted);">
          [OpenStreetMap Iframe]
        </div>
        <div class="embed-caption"><a href="#" style="color: var(--sp-orange); font-weight: 700; text-decoration: none;">Veure mapa més gran a OpenStreetMap →</a></div>

        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">30.3 Audio (podcast local)</h4>
        <div class="audio-player">
          <button class="audio-play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
          <div class="audio-progress">
            <div class="audio-progress-fill"></div>
          </div>
          <div class="audio-time">12:45</div>
        </div>
        <div class="embed-caption" style="text-align: left; margin-left: 16px;">Podcast «Històries de poble» · Episodi 1</div>
      </section>

      <!-- SECCIÓ 31: CLASSES UTILITÀRIES -->
      <section class="design-block">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">31. Classes Utilitàries</h2>
        <p style="font-size: 0.85rem; color: var(--sp-muted); text-align: center; margin-bottom: 24px;">Aquestes classes són recomanacions d'arquitectura css (no aplicades ací via Tailwind pur sinó com a concepte)</p>
        
        <div class="utils-grid">
          <div class="utils-box">
            <h4>Classes de Visibilitat</h4>
            <ul class="utils-list">
              <li><strong>.sosp-sr-only</strong> - Ocult visiblement, text per a screen readers</li>
              <li><strong>.sosp-visible-sr-only</strong> - Visible només per assistència</li>
              <li><strong>.sosp-ocult</strong> - display: none</li>
              <li><strong>.sosp-ocult-mobil</strong> - Amaga en xs/sm</li>
            </ul>
          </div>
          <div class="utils-box">
            <h4>Classes de Color</h4>
            <ul class="utils-list">
              <li><strong>.sosp-text-exit</strong> - ✓ Èxit</li>
              <li><strong>.sosp-text-error</strong> - ✕ Error</li>
              <li><strong>.sosp-text-avis</strong> - ⚠ Avís</li>
              <li><strong>.sosp-text-info</strong> - i Informació</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- SECCIÓ 32: PEUS DE PÀGINA -->
      <section class="design-block">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">32. Peus de pàgina (Footers)</h2>
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">32.1 Peu de pàgina complet</h4>
        <div style="background: var(--sp-black); color: var(--sp-white); padding: 40px 24px; border-radius: 8px;">[Footer complet (Enllaços, Legal, Xarxes)]</div>
        
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted); margin-top: 24px;">32.2 Peu de pàgina minimalista</h4>
        <div style="background: var(--sp-black); color: var(--sp-muted); padding: 16px 24px; border-radius: 8px; font-size: 0.85rem; text-align: center;">© 2026 Sóc de Poble. Tots els drets reservats.</div>
      </section>

      <!-- SECCIÓ 33: EXEMPLES DE COMPOSICIÓ -->
      <section class="design-block" style="margin-bottom: 80px;">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">33. Exemples de Composició</h2>
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">33.1 Pàgina de poble completa (estructura)</h4>
        
        <div style="border: 1px solid #E5E5E5; padding: 24px; border-radius: 8px; background: var(--sp-white);">
          <div style="font-size: 0.75rem; color: var(--sp-muted); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em;">Inici / Vall d'Albaida / Benigànim</div>
          <h1 style="font-size: 2rem; color: var(--sp-black); text-transform: uppercase; text-align: center; margin-bottom: 4px;">BENIGÀNIM</h1>
          <div style="text-align: center; font-size: 1.1rem; color: var(--sp-muted); margin-bottom: 32px;">El poble de les rieres i l'oli d'oliva verge extra</div>
          
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
            <div>
              <h3 style="text-transform: uppercase; text-align: center; margin-bottom: 16px;">Història</h3>
              <p style="color: var(--sp-text); line-height: 1.6; margin-bottom: 24px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              
              <h3 style="text-transform: uppercase; text-align: center; margin-bottom: 16px;">Festes i Tradicions</h3>
              <p style="color: var(--sp-text); line-height: 1.6;">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
            
            <div>
              <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; border: 1px solid #E5E5E5;">
                <h4 style="text-align: center; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 16px;">Dades del Municipi</h4>
                <dl class="dl-horizontal" style="margin-bottom: 0; font-size: 0.85rem; gap: 8px;">
                  <dt style="font-weight: normal; color: var(--sp-muted);">Comarca:</dt><dd style="text-align: right; font-weight: 700;">Vall d'Albaida</dd>
                  <dt style="font-weight: normal; color: var(--sp-muted);">Província:</dt><dd style="text-align: right; font-weight: 700;">València</dd>
                  <dt style="font-weight: normal; color: var(--sp-muted);">Habitants:</dt><dd style="text-align: right; font-weight: 700;">5.847</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted); margin-top: 24px;">33.2 Formulari de contacte complet</h4>
        <div style="max-width: 500px; margin: 0 auto; background: var(--sp-white); border: 1px solid #E5E5E5; border-radius: 8px; padding: 24px;">
          <h3 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">Contacta amb nosaltres</h3>
          <div style="font-weight: 700; margin-bottom: 16px;">Les teues dades</div>
          
          <div class="form-group">
            <label>Nom complet <span style="color: red;">*</span></label>
            <input type="text">
          </div>
          <div class="form-group">
            <label>Correu electrònic <span style="color: red;">*</span></label>
            <input type="email">
          </div>
          <div class="form-group">
            <label>Motiu del contacte</label>
            <select>
              <option>Selecciona un motiu...</option>
            </select>
          </div>
        </div>
      </section>

    </article>
  </main>
`;

// Insert CSS
content = content.replace('  </style>', cssToAdd + '\n  </style>');

// Remove the faulty section 24 if it exists and clean up the end
// Ensure we inject correctly before the FAB
const endTag = '  <!-- FAB -->';
// Strip out the broken closing section if needed
content = content.replace(/      <\/section>\s*<!-- FAB -->/, htmlToAdd + '\n' + endTag);

// Just in case it wasn't replaced properly due to lack of </section>
if (!content.includes(htmlToAdd)) {
   content = content.replace(endTag, htmlToAdd + '\n' + endTag);
}

fs.writeFileSync(file, content);
