import re

new_content = """<section class="design-block">
<h3>24. Targeta Mestra (Sóc de Poble Universal Card)</h3>
<p class="sdp-text-center sdp-mb-2">La Targeta Mestra és un bloc modular desmuntable i enllaçable (amb <code>&lt;a class="sp-card-link-overlay"&gt;</code>). Qualsevol clic dins d'ella condueix a la pàgina, excepte els botons amb funcions específiques (z-index superior).</p>

<h4>24.1 Targeta Mestra: Mur</h4>
<article class="sp-card">
<a class="sp-card-link-overlay" href="#" title="Obrir Disseny"></a>
<header class="sp-card-header">
<a class="sp-card-author-link" href="#" title="Anar al perfil de l'autor">
<div class="sp-card-author">
<img alt="Avatar" class="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
<div class="sp-card-author-info">
<div class="sp-card-author-name">Sóc de Poble</div>
<div class="sp-card-author-location">La Torre de les Maçanes</div>
</div>
</div>
</a>
<div class="sp-card-meta sdp-gap-8">
<button class="btn-icon-orange" title="Ancorar" style="z-index: 3; position: relative;">
<svg class="icon" viewBox="0 0 24 24"><use href="#icon-9"></use></svg>
</button>
<button class="btn-date-time" title="Veure calendari d'este dia">
<span>10:00</span><span>07/8/26</span>
</button>
</div>
</header>
<div class="sp-card-media">
<img alt="Disseny" src="https://socdepoble.org/assets/uploads/brain/media__1776510300300.jpg"/>
</div>
<div class="sp-card-body">
<h1>Disseny Pedra Seca</h1>
<h2>Sistema oficial de disseny per a Sóc de Poble</h2>
<p class="sp-card-text">Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, per a que qualsevol IA puga entendre este sistema i reproduir-lo.</p>
<div class="sp-card-labels">
<span class="sp-card-label label-orange">Mur</span>
<span class="sp-card-label label-blue">Disseny UI</span>
</div>
<div class="sp-card-copyright sdp-mt-4">© Sóc de Poble / Fet per la IAIA i Nano Banana</div>
</div>
<footer class="sp-card-footer">
<div class="sp-card-actions">
<button class="sp-card-action" title="Traduir"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-6"></use></svg></button>
<button class="sp-card-action" title="Comentar (Xat Privat)"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-7"></use></svg></button>
<button class="sp-card-action" title="Compartir"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button class="sp-card-connect" title="Connectar">Connectar</button>
</footer>
</article>

<h4>24.2 Targeta Mestra: Mercat / Botiga</h4>
<article class="sp-card">
<a class="sp-card-link-overlay" href="#" title="Obrir Samarreta"></a>
<header class="sp-card-header">
<a class="sp-card-author-link" href="#" title="Anar al perfil de l'autor">
<div class="sp-card-author">
<img alt="Avatar" class="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
<div class="sp-card-author-info">
<div class="sp-card-author-name">Sóc de Poble</div>
<div class="sp-card-author-location">La Torre de les Maçanes</div>
</div>
</div>
</a>
<div class="sp-card-meta sdp-gap-8">
<button class="btn-icon-orange" title="Ancorar" style="z-index: 3; position: relative;">
<svg class="icon" viewBox="0 0 24 24"><use href="#icon-9"></use></svg>
</button>
<button class="btn-date-time" title="Veure calendari d'este dia">
<span>00:33</span><span>23/3/26</span>
</button>
</div>
</header>
<div class="sp-card-media">
<img alt="Samarreta" src="https://socdepoble.org/assets/uploads/brain/media__1776503825171.jpg"/>
</div>
<div class="sp-card-body">
<div class="sp-card-price">15.00€</div>
<h1>Samarreta Sóc de Poble</h1>
<h2>L'edició definitiva amb el logotip complet</h2>
<p class="sp-card-text">Dibuix del mapa del tresor. Cotó Roly de màxima qualitat.</p>
<div class="sp-card-labels">
<span class="sp-card-label label-blue">Mercat</span>
<span class="sp-card-label label-blue">Roba</span>
<span class="sp-card-label label-green">Samarreta</span>
</div>
<div class="sp-card-copyright sdp-mt-4">© Sóc de Poble / Fet per la IAIA i Nano Banana</div>
</div>
<footer class="sp-card-footer">
<div class="sp-card-actions">
<button class="sp-card-action" title="Traduir"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-6"></use></svg></button>
<button class="sp-card-action" title="Comentar (Xat Privat)"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-7"></use></svg></button>
<button class="sp-card-action" title="Compartir"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button class="sp-card-connect" title="Connectar">Connectar</button>
</footer>
</article>

<h4>24.3 Targeta Mestra: Calendari</h4>
<article class="sp-card sp-card--calendari">
<a class="sp-card-link-overlay" href="#" title="Obrir Esdeveniment"></a>
<header class="sp-card-header">
<a class="sp-card-author-link" href="#" title="Anar al perfil de l'autor">
<div class="sp-card-author">
<img alt="Avatar" class="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
<div class="sp-card-author-info">
<div class="sp-card-author-name">Ajuntament</div>
<div class="sp-card-author-location">La Torre de les Maçanes</div>
</div>
</div>
</a>
</header>
<div class="sp-card-body">
<div class="sp-card-calendar-badge">
    <div class="sp-card-calendar-badge__dia">14</div>
    <div class="sp-card-calendar-badge__mes">JUNY</div>
</div>
<h1>Festa Major del Poble</h1>
<h2>Plaça de l'Església</h2>
<p class="sp-card-text">Vine a gaudir de la música, el menjar i la bona companyia! Començarem a les 10:00 h.</p>
<div class="sp-card-labels">
<span class="sp-card-label label-orange">Calendari</span>
<span class="sp-card-label label-green">Festa</span>
</div>
<div class="sp-card-copyright sdp-mt-4">© Sóc de Poble / Ajuntament</div>
</div>
<footer class="sp-card-footer">
<div class="sp-card-actions">
<button class="sp-card-action" title="Traduir"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-6"></use></svg></button>
<button class="sp-card-action" title="Comentar (Xat Privat)"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-7"></use></svg></button>
<button class="sp-card-action" title="Compartir"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button class="sp-card-connect" title="Apuntar-me">Apuntar-me</button>
</footer>
</article>

<h4>24.4 Targeta Mestra: Persona</h4>
<article class="sp-card">
<a class="sp-card-link-overlay" href="#" title="Obrir Perfil"></a>
<header class="sp-card-header" style="justify-content: center; flex-direction: column; text-align: center; padding: 24px;">
<img alt="Avatar de Javi" src="https://socdepoble.org/assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg" style="width: 96px; height: 96px; border-radius: 50%; object-fit: cover; margin-bottom: 12px;"/>
<div class="sp-card-author-name" style="font-size: 1.3rem;">Javi Llinares</div>
<div class="sp-card-author-location">La Torre de les Maçanes</div>
</header>
<div class="sp-card-body">
<p class="sp-card-text">Mestre d'obres digitals, apicultor aficionat i amant de les tradicions. Sempre disposat a ajudar amb la informàtica del poble.</p>
<div class="sp-card-labels" style="justify-content: center;">
<span class="sp-card-label label-blue">Programador</span>
<span class="sp-card-label label-green">Fusteria</span>
</div>
</div>
<footer class="sp-card-footer">
<div class="sp-card-actions">
<button class="sp-card-action" title="Compartir"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button class="sp-card-connect" title="Connectar">Contactar</button>
</footer>
</article>

<h4>24.5 Targeta Mestra: Enquesta</h4>
<article class="sp-card">
<a class="sp-card-link-overlay" href="#" title="Obrir Enquesta"></a>
<header class="sp-card-header">
<a class="sp-card-author-link" href="#">
<div class="sp-card-author">
<img alt="Avatar" class="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
<div class="sp-card-author-info">
<div class="sp-card-author-name">Consell del Poble</div>
</div>
</div>
</a>
</header>
<div class="sp-card-body">
<h1>On fem la paella popular?</h1>
<h2>Vota per l'espai d'enguany</h2>
<div class="progress-bar-container sdp-mt-4 sdp-mb-4" style="text-align: left; position: relative; z-index: 2;">
<div class="progress-bar-label" style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 4px;"><span>Plaça de l'Església</span> <span>65%</span></div>
<div class="progress-bar" style="height: 12px; border-radius: 6px; background: var(--sdp-pedra-200); overflow: hidden;">
<div class="progress-bar-fill" style="width: 65%; height: 100%; background: var(--sdp-primary-500);"></div>
</div>
<div class="progress-bar-label sdp-mt-4" style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 4px;"><span>La Fonteta</span> <span>35%</span></div>
<div class="progress-bar" style="height: 12px; border-radius: 6px; background: var(--sdp-pedra-200); overflow: hidden;">
<div class="progress-bar-fill" style="width: 35%; height: 100%; background: var(--sdp-primary-300);"></div>
</div>
</div>
<div class="sp-card-labels">
<span class="sp-card-label label-orange">Decisió</span>
</div>
</div>
<footer class="sp-card-footer">
<div class="sp-card-actions">
<button class="sp-card-action" title="Comentar (Xat Privat)"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-7"></use></svg></button>
<button class="sp-card-action" title="Compartir"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button class="sp-card-connect" title="Votar">Votar</button>
</footer>
</article>

<h4>24.6 Targeta Mestra: Ajuda</h4>
<article class="sp-card">
<a class="sp-card-link-overlay" href="#" title="Obrir Peticio"></a>
<header class="sp-card-header">
<a class="sp-card-author-link" href="#">
<div class="sp-card-author">
<img alt="Avatar" class="sp-card-avatar" src="https://socdepoble.org/assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg"/>
<div class="sp-card-author-info">
<div class="sp-card-author-name">Maria</div>
</div>
</div>
</a>
<div class="sp-card-meta">
<span class="sp-card-label label-orange" style="margin:0; font-size: 0.75rem;">URGENT</span>
</div>
</header>
<div class="sp-card-body">
<h1>Necessite transport a Alcoi</h1>
<h2>Demà a les 09:00 per anar al metge</h2>
<p class="sp-card-text">Si algú baixa a Alcoi de matí i em pot portar a l'hospital, compartim despeses.</p>
<div class="sp-card-labels">
<span class="sp-card-label label-blue">Necessite</span>
<span class="sp-card-label label-green">Transport</span>
</div>
</div>
<footer class="sp-card-footer">
<div class="sp-card-actions">
<button class="sp-card-action" title="Compartir"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button class="sp-card-connect" title="T'ajude">T'ajude</button>
</footer>
</article>

<h4>24.7 Targeta Mestra: Lloc</h4>
<article class="sp-card">
<a class="sp-card-link-overlay" href="#" title="Obrir Lloc"></a>
<div class="sp-card-media">
<img alt="La Font de Dalt" src="https://socdepoble.org/assets/uploads/brain/media__1776510300300.jpg" style="aspect-ratio: 16/9; object-fit: cover;"/>
</div>
<div class="sp-card-body">
<h1>La Font de Dalt</h1>
<h2>Coordenades: 38°36'23.4"N 0°25'45.1"W</h2>
<p class="sp-card-text">Aigua fresca de naixement tot l'any. Un dels llocs més emblemàtics per refrescar-se a l'estiu.</p>
<div class="sp-card-labels">
<span class="sp-card-label label-blue">Llocs</span>
<span class="sp-card-label label-green">Patrimoni</span>
</div>
</div>
<footer class="sp-card-footer">
<div class="sp-card-actions">
<button class="sp-card-action" title="Compartir"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button class="sp-card-connect" title="Com arribar">Com arribar</button>
</footer>
</article>

<h4>24.8 Targeta Mestra: Avís (Emergència)</h4>
<article class="sp-card sp-card--avis">
<a class="sp-card-link-overlay" href="#" title="Obrir Avis"></a>
<header class="sp-card-header">
<div class="sp-card-author">
<svg class="icon" fill="none" stroke="var(--sdp-primary-600)" stroke-width="2" viewbox="0 0 24 24" style="width: 24px; height: 24px; margin-right: 12px;"><use href="#icon-19"></use></svg>
<div class="sp-card-author-info">
<div class="sp-card-author-name">Alerta Civil</div>
</div>
</div>
</header>
<div class="sp-card-body">
<h1>Tall d'Aigua Programat</h1>
<h2>Carrer Major i adjacents</h2>
<p class="sp-card-text">Demà de 9:00 a 14:00 es tallarà el subministrament d'aigua per obres de millora a la xarxa general.</p>
</div>
<footer class="sp-card-footer" style="background: var(--sdp-primary-600);">
<div class="sp-card-actions">
<button class="sp-card-action" title="Compartir"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button class="sp-card-connect" title="Entès" style="background: var(--sdp-superficie); color: var(--sdp-primary-700);">Entès</button>
</footer>
</article>

<h4>24.9 Targeta Mestra: Memòria</h4>
<article class="sp-card">
<a class="sp-card-link-overlay" href="#" title="Obrir Memoria"></a>
<header class="sp-card-header">
<div class="sp-card-author">
<div class="sp-card-author-info">
<div class="sp-card-author-name">Arxiu Històric</div>
</div>
</div>
<div class="sp-card-meta">
<div class="sp-card-price" style="margin:0; background: var(--sdp-pedra-100); color: var(--sdp-pedra-700);">1964</div>
</div>
</header>
<div class="sp-card-media">
<img alt="Foto antiga" src="https://socdepoble.org/assets/uploads/brain/media__1776503825171.jpg" style="filter: sepia(0.8) contrast(1.2);"/>
</div>
<div class="sp-card-body">
<h1>La nevada del 64</h1>
<p class="sp-card-text">Així va quedar la plaça després de tres dies nevant sense parar. Els xiquets no van anar a escola durant una setmana.</p>
</div>
<footer class="sp-card-footer" style="background: var(--sdp-pedra-800);">
<div class="sp-card-actions">
<button class="sp-card-action" title="Comentar"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-7"></use></svg></button>
<button class="sp-card-action" title="Compartir"><svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-8"></use></svg></button>
</div>
<button class="sp-card-connect" title="Més fotos" style="background: var(--sdp-pedra-700);">Més fotos</button>
</footer>
</article>
</section>
"""

import sys

with open('src/html/disseny.html', 'r') as f:
    content = f.read()

# Trobar l'inici i final de la secció 24
start_pattern = r'<section class="design-block">\s*<h3>24\. Targeta Mestra \(Sóc de Poble Universal Card\)</h3>'
end_pattern = r'<!-- SECCIÓ 25: ESTADÍSTIQUES I DASHBOARDS -->'

match_start = re.search(start_pattern, content)
match_end = re.search(end_pattern, content)

if match_start and match_end:
    new_html = content[:match_start.start()] + new_content + "\n" + content[match_end.start():]
    with open('src/html/disseny.html', 'w') as f:
        f.write(new_html)
    print("Replaced section 24 successfully!")
else:
    print("Could not find boundaries")
