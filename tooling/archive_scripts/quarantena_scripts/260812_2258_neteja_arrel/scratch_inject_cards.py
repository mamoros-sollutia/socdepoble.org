import re

with open('src/sections/disseny/DesignSection.jsx', 'r') as f:
    content = f.read()

# Trobar on comença la Targeta Mestra i on acaba l'article de la targeta
start_pattern = r'<h4>24\.4 Targeta Mestra: Pàgina de Mur \(Disseny\)</h4>\n<article className="sp-card">'
end_pattern = r'</button>\n</footer>\n</article>'

match_start = re.search(start_pattern, content)
match_end = re.search(end_pattern, content[match_start.start():])

if match_start and match_end:
    absolute_start = match_start.start()
    absolute_end = match_start.start() + match_end.end()

    # Nou contingut de les Targetes Mestres
    new_content = """<h4>24.4 Targetes Mestra: Mur (Components)</h4>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sdp-mb-8">

{/* 1. MUR */}
<article className="sp-card">
<a className="sp-card-link-overlay" href="#" title="Obrir Disseny"></a>
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
<button className="btn-icon-orange" title="Ancorar">
<svg className="icon" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 0 0-8 0v4l-2 4h12l-2-4z" /><path d="M12 15v7" /></svg>
</button>
<button className="btn-date-time" title="Veure calendari d'este dia">
<span>10:00</span><span>07/8/26</span>
</button>
</div>
</header>
<div className="sp-card-media">
<img alt="Disseny Pedra Seca" src="assets/img/ibanez_pedra_seca_design_1780873465211.png"/>
</div>
<div className="sp-card-body">
<h1>Disseny Pedra Seca</h1>
<h2>Sistema oficial de disseny per a Sóc de Poble</h2>
<p className="sp-card-text">Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, perquè qualsevol IA puga entendre este sistema i reproduir-lo.</p>
<div className="sp-card-labels">
<span className="sp-card-label label-orange">MUR</span>
<span className="sp-card-label label-blue">Disseny UI</span>
</div>
<div className="sp-card-copyright sdp-mt-4">© Sóc de Poble / Fet per la IAIA i Nano Banana</div>
</div>
<footer className="sp-card-footer">
<div className="sp-card-actions">
<button className="sp-card-action" title="Traduir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>
</button>
<button className="sp-card-action" title="Comentar (Xat Privat)">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
</button>
<button className="sp-card-action" title="Compartir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
</button>
</div>
<button className="sp-card-connect" title="Connectar">Connectar</button>
</footer>
</article>

{/* 2. ENQUESTA */}
<article className="sp-card">
<a className="sp-card-link-overlay" href="#" title="Obrir Enquesta"></a>
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
<button className="btn-icon-orange" title="Ancorar">
<svg className="icon" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 0 0-8 0v4l-2 4h12l-2-4z" /><path d="M12 15v7" /></svg>
</button>
<button className="btn-date-time" title="Veure calendari d'este dia">
<span>10:00</span><span>07/8/26</span>
</button>
</div>
</header>
<div className="sp-card-body sdp-mt-4">
<h1>Què fem per a les festes d'agost?</h1>
<h2>Enquesta Veïnal Participativa</h2>
<p className="sp-card-text">Vota quines activitats prefereixes per a les festes del poble d'enguany. La teua opinió és molt important per a l'organització!</p>
<div className="sp-card-labels">
<span className="sp-card-label label-orange">Enquesta</span>
<span className="sp-card-label label-blue">Festes</span>
</div>
<div className="sp-card-copyright sdp-mt-4">© Sóc de Poble</div>
</div>
<footer className="sp-card-footer bar-blue">
<div className="sp-card-actions">
<button className="sp-card-action" title="Traduir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>
</button>
<button className="sp-card-action" title="Comentar (Xat Privat)">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
</button>
<button className="sp-card-action" title="Compartir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
</button>
</div>
<button className="sp-card-connect" title="Connectar">Votar Ací</button>
</footer>
</article>

{/* 3. CALENDARI (EVENT) */}
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
<button className="btn-icon-orange" title="Ancorar">
<svg className="icon" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 0 0-8 0v4l-2 4h12l-2-4z" /><path d="M12 15v7" /></svg>
</button>
<button className="btn-date-time" title="Veure calendari d'este dia">
<span>10:00</span><span>07/8/26</span>
</button>
</div>
</header>
<div className="sp-card-body sdp-mt-4">
<div className="sp-card-calendar-badge">
    <div className="sp-card-calendar-badge__dia">14</div>
    <div className="sp-card-calendar-badge__mes">AGO</div>
</div>
<h1>Festa Major del Poble</h1>
<h2>Plaça de l'Església</h2>
<p className="sp-card-text">Vine a gaudir de la música, el menjar i la bona companyia! Començarem a les 10:00 h. amb un esmorzar popular i a la nit hi haurà revetlla.</p>
<div className="sp-card-labels">
<span className="sp-card-label label-orange">Calendari</span>
<span className="sp-card-label label-green">Festa</span>
</div>
<div className="sp-card-copyright sdp-mt-4">© Sóc de Poble / Ajuntament</div>
</div>
<footer className="sp-card-footer">
<div className="sp-card-actions">
<button className="sp-card-action" title="Traduir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>
</button>
<button className="sp-card-action" title="Comentar (Xat Privat)">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
</button>
<button className="sp-card-action" title="Compartir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
</button>
</div>
<button className="sp-card-connect" title="Connectar">Anotar-me</button>
</footer>
</article>

{/* 4. HOSPITAL (AJUDA) */}
<article className="sp-card">
<a className="sp-card-link-overlay" href="#" title="Obrir Petició"></a>
<header className="sp-card-header">
<a className="sp-card-author-link" href="#" title="Anar al perfil de l'autor">
<div className="sp-card-author">
<img alt="Avatar" className="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
<div className="sp-card-author-info">
<div className="sp-card-author-name">Maria de Cal Bessó</div>
<div className="sp-card-author-location">La Torre de les Maçanes</div>
</div>
</div>
</a>
<div className="sp-card-meta sdp-gap-8">
<button className="btn-icon-orange" title="Ancorar">
<svg className="icon" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 0 0-8 0v4l-2 4h12l-2-4z" /><path d="M12 15v7" /></svg>
</button>
<button className="btn-date-time" title="Veure calendari d'este dia">
<span>09:00</span><span>Demà</span>
</button>
</div>
</header>
<div className="sp-card-body sdp-mt-4">
<h1>Baixar a l'hospital d'Alcoi</h1>
<h2>Necessite viatge demà de matí</h2>
<p className="sp-card-text">Algú baixa a Alcoi demà a primera hora? Tinc cita amb l'especialista a les 9:30h i tinc el cotxe al taller. Compartim despeses, clar!</p>
<div className="sp-card-labels">
<span className="sp-card-label label-orange">Ajuda</span>
<span className="sp-card-label label-blue">Transport</span>
<span className="sp-card-label label-green">Alcoi</span>
</div>
<div className="sp-card-copyright sdp-mt-4">© Sóc de Poble</div>
</div>
<footer className="sp-card-footer bar-blue">
<div className="sp-card-actions">
<button className="sp-card-action" title="Traduir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>
</button>
<button className="sp-card-action" title="Comentar (Xat Privat)">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
</button>
<button className="sp-card-action" title="Compartir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
</button>
</div>
<button className="sp-card-connect" title="Connectar">Connectar</button>
</footer>
</article>

{/* 5. MÍNIMA */}
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
<button className="btn-icon-orange" title="Ancorar">
<svg className="icon" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 0 0-8 0v4l-2 4h12l-2-4z" /><path d="M12 15v7" /></svg>
</button>
<button className="btn-date-time" title="Veure calendari d'este dia">
<span>10:00</span><span>07/8/26</span>
</button>
</div>
</header>
<div className="sp-card-body sdp-mt-4 sdp-mb-8">
<h1>Açò és una Targeta Mínima amb només H1.</h1>
</div>
<footer className="sp-card-footer">
<div className="sp-card-actions">
<button className="sp-card-action" title="Traduir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>
</button>
<button className="sp-card-action" title="Comentar (Xat Privat)">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
</button>
<button className="sp-card-action" title="Compartir">
<svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
</button>
</div>
<button className="sp-card-connect" title="Connectar">Connectar</button>
</footer>
</article>

</div>"""

    content = content[:absolute_start] + new_content + content[absolute_end:]
    
    with open('src/sections/disseny/DesignSection.jsx', 'w') as f:
        f.write(content)
    print("Reemplaçades les targetes a DesignSection.jsx correctament.")
else:
    print("No s'ha trobat el patró")
