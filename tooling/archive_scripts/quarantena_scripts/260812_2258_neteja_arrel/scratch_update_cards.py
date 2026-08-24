import re

with open('src/components/design-system/sections/Cards.jsx', 'r') as f:
    content = f.read()

new_cards = """
      {/* Targeta 5: Targeta Mestra: Mercat / Botiga */}
      <article className="sp-card">
        <a className="sp-card-link-overlay" href="#" title="Obrir Samarreta"></a>
        <header className="sp-card-header">
          <a className="sp-card-author-link" href="#" title="Anar al perfil de l'autor">
            <div className="sp-card-author">
              <img alt="Avatar" className="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
              <div className="sp-card-author-info">
                <div className="sp-card-author-name">Sóc de Poble</div>
                <div className="sp-card-author-location">La Torre de les Maçanes</div>
              </div>
            </div>
          </a>
          <div className="sp-card-meta sdp-gap-8">
            <button className="btn-icon-orange" style={{ zIndex: 3, position: 'relative' }} title="Ancorar">
              <svg className="icon" viewBox="0 0 24 24">
                <use href="#icon-9"></use>
              </svg>
            </button>
            <button className="btn-date-time" style={{ zIndex: 3, position: 'relative' }} title="Veure calendari d'este dia">
              <span>10:00</span><span>07/8/26</span>
            </button>
          </div>
        </header>
        <div className="sp-card-media">
          <img alt="Samarreta" src="https://socdepoble.org/assets/uploads/brain/media__1776503825171.jpg"/>
        </div>
        <div className="sp-card-body">
          <div className="sp-card-price">15.00€</div>
          <h1>Samarreta Sóc de Poble</h1>
          <h2>L'edició definitiva amb el logotip complet</h2>
          <p className="sp-card-text">Dibuix del mapa del tresor. Cotó Roly de màxima qualitat.</p>
          <div className="sp-card-labels">
            <span className="sp-card-label label-blue">Mercat</span>
            <span className="sp-card-label label-blue">Roba</span>
            <span className="sp-card-label label-green">Samarreta</span>
          </div>
          <div className="sp-card-copyright sdp-mt-4">© Sóc de Poble / Fet per la IAIA i Nano Banana</div>
        </div>
        <footer className="sp-card-footer">
          <div className="sp-card-actions">
            <button className="sp-card-action" title="Traduir">
              <svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-6"></use></svg>
            </button>
            <button className="sp-card-action" title="Comentar (Xat Privat)">
              <svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-7"></use></svg>
            </button>
            <button className="sp-card-action" title="Compartir">
              <svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-8"></use></svg>
            </button>
          </div>
          <button className="sp-card-connect" title="Connectar">Connectar</button>
        </footer>
      </article>

      {/* Targeta 6: Targeta Mestra: Calendari */}
      <article className="sp-card sp-card--calendari">
        <a className="sp-card-link-overlay" href="#" title="Obrir Esdeveniment"></a>
        <header className="sp-card-header">
          <a className="sp-card-author-link" href="#" title="Anar al perfil de l'autor">
            <div className="sp-card-author">
              <img alt="Avatar" className="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
              <div className="sp-card-author-info">
                <div className="sp-card-author-name">Sóc de Poble</div>
                <div className="sp-card-author-location">La Torre de les Maçanes</div>
              </div>
            </div>
          </a>
          <div className="sp-card-meta sdp-gap-8">
            <button className="btn-icon-orange" title="Ancorar" style={{ zIndex: 3, position: 'relative' }}>
              <svg className="icon" viewBox="0 0 24 24"><use href="#icon-9"></use></svg>
            </button>
            <button className="btn-date-time" title="Veure calendari d'este dia" style={{ zIndex: 3, position: 'relative' }}>
              <span>10:00</span><span>07/8/26</span>
            </button>
          </div>
        </header>
        <div className="sp-card-media">
          <img alt="Festa Major" src="https://socdepoble.org/assets/uploads/brain/media__1776503825171.jpg"/>
        </div>
        <div className="sp-card-body">
          <div className="sp-card-calendar-badge">
              <div className="sp-card-calendar-badge__dia">14</div>
              <div className="sp-card-calendar-badge__mes">JUNY</div>
          </div>
          <h1>Festa Major del Poble</h1>
          <h2>Plaça de l'Església</h2>
          <p className="sp-card-text">Vine a gaudir de la música, el menjar i la bona companyia! Començarem a les 10:00 h.</p>
          <div className="sp-card-labels">
            <span className="sp-card-label label-orange">Calendari</span>
            <span className="sp-card-label label-green">Festa</span>
          </div>
          <div className="sp-card-copyright sdp-mt-4">© Sóc de Poble / Ajuntament</div>
        </div>
        <footer className="sp-card-footer">
          <div className="sp-card-actions">
            <button className="sp-card-action" title="Traduir">
              <svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-6"></use></svg>
            </button>
            <button className="sp-card-action" title="Comentar (Xat Privat)">
              <svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-7"></use></svg>
            </button>
            <button className="sp-card-action" title="Compartir">
              <svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-8"></use></svg>
            </button>
          </div>
          <button className="sp-card-connect" title="Connectar">Connectar</button>
        </footer>
      </article>

      {/* Targeta 7: Targeta Mestra: Bàsica (Mínima) */}
      <article className="sp-card">
        <a className="sp-card-link-overlay" href="#" title="Obrir Targeta"></a>
        <header className="sp-card-header">
          <a className="sp-card-author-link" href="#" title="Anar al perfil de l'autor">
            <div className="sp-card-author">
              <img alt="Avatar" className="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
              <div className="sp-card-author-info">
                <div className="sp-card-author-name">Sóc de Poble</div>
                <div className="sp-card-author-location">La Torre de les Maçanes</div>
              </div>
            </div>
          </a>
          <div className="sp-card-meta sdp-gap-8">
            <button className="btn-icon-orange" title="Ancorar" style={{ zIndex: 3, position: 'relative' }}>
              <svg className="icon" viewBox="0 0 24 24"><use href="#icon-9"></use></svg>
            </button>
            <button className="btn-date-time" title="Veure calendari d'este dia" style={{ zIndex: 3, position: 'relative' }}>
              <span>10:00</span><span>07/8/26</span>
            </button>
          </div>
        </header>
        <div className="sp-card-body">
          <h1>Exemple de card mínima</h1>
        </div>
        <footer className="sp-card-footer">
          <div className="sp-card-actions">
            <button className="sp-card-action" title="Traduir">
              <svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-6"></use></svg>
            </button>
            <button className="sp-card-action" title="Comentar (Xat Privat)">
              <svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-7"></use></svg>
            </button>
            <button className="sp-card-action" title="Compartir">
              <svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-8"></use></svg>
            </button>
          </div>
          <button className="sp-card-connect" title="Connectar">Connectar</button>
        </footer>
      </article>

    </div>
"""
content = content.replace('    </div>\n  </Section>', new_cards + '  </Section>')

with open('src/components/design-system/sections/Cards.jsx', 'w') as f:
    f.write(content)

