import re

with open('src/sections/disseny/DesignSection.jsx', 'r') as f:
    content = f.read()

# Trobar on comença la secció de targetes
start_pattern = r'<h4>24\.4 Targetes Mestra: Mur \(Components\)</h4>'
end_pattern = r'</section>\n\s*{\/\*\s*SECCIÓ 25'

match_start = re.search(start_pattern, content)
match_end = re.search(end_pattern, content[match_start.start():])

if match_start and match_end:
    absolute_start = match_start.start()
    absolute_end = match_start.start() + match_end.start() # we don't want to replace the </section>

    new_content = """<h4>24.4 Targetes Mestra (Totes les variants recuperades)</h4>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sdp-mb-8">

{/* 24.1 Targeta Mestra: Mur */}
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
<button className="btn-icon-orange" title="Ancorar" style={{ zIndex: 3, position: 'relative' }}>
<svg className="icon" viewBox="0 0 24 24"><use href="#icon-9"></use></svg>
</button>
<button className="btn-date-time" title="Veure calendari d'este dia">
<span>10:00</span><span>07/8/26</span>
</button>
</div>
</header>
<div className="sp-card-media">
<img alt="Disseny" src="https://socdepoble.org/assets/uploads/brain/media__1776510300300.jpg"/>
</div>
<div className="sp-card-body">
<h1>Disseny Pedra Seca</h1>
<h2>Sistema oficial de disseny per a Sóc de Poble</h2>
<p className="sp-card-text">Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, per a que qualsevol IA puga entendre este sistema i reproduir-lo.</p>
<div className="sp-card-labels">
<span className="sp-card-label label-orange">Mur</span>
<span className="sp-card-label label-blue">Disseny UI</span>
</div>
<div className="sp-card-copyright sdp-mt-4">© Sóc de Poble / Fet per la IAIA i Nano Banana</div>
</div>
<footer className="sp-card-footer">
<div className="sp-card-actions">
<button className="sp-card-action" title="Traduir"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-6"></use></svg></button>
<button className="sp-card-action" title="Comentar (Xat Privat)"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-7"></use></svg></button>
<button className="sp-card-action" title="Compartir"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button className="sp-card-connect" title="Connectar">Connectar</button>
</footer>
</article>

{/* 24.2 Targeta Mestra: Mercat / Botiga */}
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
<button className="btn-icon-orange" title="Ancorar" style={{ zIndex: 3, position: 'relative' }}>
<svg className="icon" viewBox="0 0 24 24"><use href="#icon-9"></use></svg>
</button>
<button className="btn-date-time" title="Veure calendari d'este dia">
<span>00:33</span><span>23/3/26</span>
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
<button className="sp-card-action" title="Traduir"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-6"></use></svg></button>
<button className="sp-card-action" title="Comentar (Xat Privat)"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-7"></use></svg></button>
<button className="sp-card-action" title="Compartir"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button className="sp-card-connect" title="Connectar">Connectar</button>
</footer>
</article>

{/* 24.3 Targeta Mestra: Calendari */}
<article className="sp-card sp-card--calendari">
<a className="sp-card-link-overlay" href="#" title="Obrir Esdeveniment"></a>
<header className="sp-card-header">
<a className="sp-card-author-link" href="#" title="Anar al perfil de l'autor">
<div className="sp-card-author">
<img alt="Avatar" className="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
<div className="sp-card-author-info">
<div className="sp-card-author-name">Ajuntament</div>
<div className="sp-card-author-location">La Torre de les Maçanes</div>
</div>
</div>
</a>
</header>
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
<button className="sp-card-action" title="Traduir"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-6"></use></svg></button>
<button className="sp-card-action" title="Comentar (Xat Privat)"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-7"></use></svg></button>
<button className="sp-card-action" title="Compartir"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button className="sp-card-connect" title="Apuntar-me">Apuntar-me</button>
</footer>
</article>

{/* 24.4 Targeta Mestra: Persona */}
<article className="sp-card">
<a className="sp-card-link-overlay" href="#" title="Obrir Perfil"></a>
<header className="sp-card-header" style={{ justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '24px' }}>
<img alt="Avatar de Javi" src="https://socdepoble.org/assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg" style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }}/>
<div className="sp-card-author-name" style={{ fontSize: '1.3rem' }}>Javi Llinares</div>
<div className="sp-card-author-location">La Torre de les Maçanes</div>
</header>
<div className="sp-card-body">
<p className="sp-card-text">Mestre d'obres digitals, apicultor aficionat i amant de les tradicions. Sempre disposat a ajudar amb la informàtica del poble.</p>
<div className="sp-card-labels" style={{ justifyContent: 'center' }}>
<span className="sp-card-label label-blue">Programador</span>
<span className="sp-card-label label-green">Fusteria</span>
</div>
</div>
<footer className="sp-card-footer">
<div className="sp-card-actions">
<button className="sp-card-action" title="Compartir"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button className="sp-card-connect" title="Connectar">Contactar</button>
</footer>
</article>

{/* 24.5 Targeta Mestra: Enquesta */}
<article className="sp-card">
<a className="sp-card-link-overlay" href="#" title="Obrir Enquesta"></a>
<header className="sp-card-header">
<a className="sp-card-author-link" href="#">
<div className="sp-card-author">
<img alt="Avatar" className="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
<div className="sp-card-author-info">
<div className="sp-card-author-name">Consell del Poble</div>
</div>
</div>
</a>
</header>
<div className="sp-card-body">
<h1>On fem la paella popular?</h1>
<h2>Vota per l'espai d'enguany</h2>
<div className="progress-bar-container sdp-mt-4 sdp-mb-4" style={{ textAlign: 'left', position: 'relative', zIndex: 2 }}>
<div className="progress-bar-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}><span>Plaça de l'Església</span> <span>65%</span></div>
<div className="progress-bar" style={{ height: '12px', borderRadius: '6px', background: 'var(--sdp-pedra-200)', overflow: 'hidden' }}>
<div className="progress-bar-fill" style={{ width: '65%', height: '100%', background: 'var(--sdp-primary-500)' }}></div>
</div>
<div className="progress-bar-label sdp-mt-4" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}><span>La Fonteta</span> <span>35%</span></div>
<div className="progress-bar" style={{ height: '12px', borderRadius: '6px', background: 'var(--sdp-pedra-200)', overflow: 'hidden' }}>
<div className="progress-bar-fill" style={{ width: '35%', height: '100%', background: 'var(--sdp-primary-300)' }}></div>
</div>
</div>
<div className="sp-card-labels">
<span className="sp-card-label label-orange">Decisió</span>
</div>
</div>
<footer className="sp-card-footer">
<div className="sp-card-actions">
<button className="sp-card-action" title="Comentar (Xat Privat)"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-7"></use></svg></button>
<button className="sp-card-action" title="Compartir"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button className="sp-card-connect" title="Votar">Votar</button>
</footer>
</article>

{/* 24.6 Targeta Mestra: Ajuda */}
<article className="sp-card">
<a className="sp-card-link-overlay" href="#" title="Obrir Peticio"></a>
<header className="sp-card-header">
<a className="sp-card-author-link" href="#">
<div className="sp-card-author">
<img alt="Avatar" className="sp-card-avatar" src="https://socdepoble.org/assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg"/>
<div className="sp-card-author-info">
<div className="sp-card-author-name">Maria</div>
</div>
</div>
</a>
<div className="sp-card-meta">
<span className="sp-card-label label-orange" style={{ margin: 0, fontSize: '0.75rem' }}>URGENT</span>
</div>
</header>
<div className="sp-card-body">
<h1>Necessite transport a Alcoi</h1>
<h2>Demà a les 09:00 per anar al metge</h2>
<p className="sp-card-text">Si algú baixa a Alcoi de matí i em pot portar a l'hospital, compartim despeses.</p>
<div className="sp-card-labels">
<span className="sp-card-label label-blue">Necessite</span>
<span className="sp-card-label label-green">Transport</span>
</div>
</div>
<footer className="sp-card-footer">
<div className="sp-card-actions">
<button className="sp-card-action" title="Compartir"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button className="sp-card-connect" title="T'ajude">T'ajude</button>
</footer>
</article>

{/* 24.7 Targeta Mestra: Lloc */}
<article className="sp-card">
<a className="sp-card-link-overlay" href="#" title="Obrir Lloc"></a>
<div className="sp-card-media">
<img alt="La Font de Dalt" src="https://socdepoble.org/assets/uploads/brain/media__1776510300300.jpg" style={{ aspectRatio: '16/9', objectFit: 'cover' }}/>
</div>
<div className="sp-card-body">
<h1>La Font de Dalt</h1>
<h2>Coordenades: 38°36'23.4"N 0°25'45.1"W</h2>
<p className="sp-card-text">Aigua fresca de naixement tot l'any. Un dels llocs més emblemàtics per refrescar-se a l'estiu.</p>
<div className="sp-card-labels">
<span className="sp-card-label label-blue">Llocs</span>
<span className="sp-card-label label-green">Patrimoni</span>
</div>
</div>
<footer className="sp-card-footer">
<div className="sp-card-actions">
<button className="sp-card-action" title="Compartir"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button className="sp-card-connect" title="Com arribar">Com arribar</button>
</footer>
</article>

{/* 24.8 Targeta Mestra: Avís (Emergència) */}
<article className="sp-card sp-card--avis">
<a className="sp-card-link-overlay" href="#" title="Obrir Avis"></a>
<header className="sp-card-header">
<div className="sp-card-author">
<svg className="icon" fill="none" stroke="var(--sdp-primary-600)" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', marginRight: '12px' }}><use href="#icon-19"></use></svg>
<div className="sp-card-author-info">
<div className="sp-card-author-name">Alerta Civil</div>
</div>
</div>
</header>
<div className="sp-card-body">
<h1>Tall d'Aigua Programat</h1>
<h2>Carrer Major i adjacents</h2>
<p className="sp-card-text">Demà de 9:00 a 14:00 es tallarà el subministrament d'aigua per obres de millora a la xarxa general.</p>
</div>
<footer className="sp-card-footer" style={{ background: 'var(--sdp-primary-600)' }}>
<div className="sp-card-actions">
<button className="sp-card-action" title="Compartir"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button className="sp-card-connect" title="Entès" style={{ background: 'var(--sdp-superficie)', color: 'var(--sdp-primary-700)' }}>Entès</button>
</footer>
</article>

{/* 24.9 Targeta Mestra: Memòria */}
<article className="sp-card">
<a className="sp-card-link-overlay" href="#" title="Obrir Memoria"></a>
<header className="sp-card-header">
<div className="sp-card-author">
<div className="sp-card-author-info">
<div className="sp-card-author-name">Arxiu Històric</div>
</div>
</div>
<div className="sp-card-meta">
<div className="sp-card-price" style={{ margin: 0, background: 'var(--sdp-pedra-100)', color: 'var(--sdp-pedra-700)' }}>1964</div>
</div>
</header>
<div className="sp-card-media">
<img alt="Foto antiga" src="https://socdepoble.org/assets/uploads/brain/media__1776503825171.jpg" style={{ filter: 'sepia(0.8) contrast(1.2)' }}/>
</div>
<div className="sp-card-body">
<h1>La nevada del 64</h1>
<p className="sp-card-text">Així va quedar la plaça després de tres dies nevant sense parar. Els xiquets no van anar a escola durant una setmana.</p>
</div>
<footer className="sp-card-footer" style={{ background: 'var(--sdp-pedra-800)' }}>
<div className="sp-card-actions">
<button className="sp-card-action" title="Comentar"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-7"></use></svg></button>
<button className="sp-card-action" title="Compartir"><svg className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button className="sp-card-connect" title="Més fotos" style={{ background: 'var(--sdp-pedra-700)' }}>Més fotos</button>
</footer>
</article>

</div>
"""
    content = content[:absolute_start] + new_content + content[absolute_end:]
    
    with open('src/sections/disseny/DesignSection.jsx', 'w') as f:
        f.write(content)
    print("Reemplaçades les targetes a DesignSection.jsx correctament amb totes les versions de l'esborrany de Python!")
else:
    print("No s'ha trobat el patró")
