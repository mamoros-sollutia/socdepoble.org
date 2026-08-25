import re

with open('src/sections/disseny/DesignSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the video placeholder
video_placeholder = """<div className="embed-container">
<div className="sdp-flex sdp-items-center sdp-justify-center">
<div className="sdp-flex sdp-items-center sdp-justify-center"><svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
</div>
</div>"""

youtube_embed = """<div className="embed-container">
<iframe 
  src="https://www.youtube-nocookie.com/embed/Fadaa7Kyxm0?si=G_xGeA1VqR0cX_IP" 
  title="Sóc de Poble: Portal de pobles connectats" 
  frameBorder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
  referrerPolicy="strict-origin-when-cross-origin" 
  allowFullScreen>
</iframe>
</div>"""

content = content.replace(video_placeholder, youtube_embed)


# 2. Replace the accordion placeholder
bad_accordion = """<div className="accordion sdp-mb-6">
<div className="accordion-header">
<svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Descripció del vídeo original
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20" width="20"><polyline points="6 9 12 15 18 9"></polyline></svg>
</div>
</div>"""

good_accordion = """<details className="accordion sdp-mb-6">
<summary className="accordion-header">
<svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icona-linia" viewBox="0 0 20 20" width="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Descripció del vídeo original
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20" width="20"><polyline points="6 9 12 15 18 9"></polyline></svg>
</summary>
<div className="sdp-p-4 sdp-text-content">
  <p>Sóc de Poble és un portal web nascut per interconnectar pobles d'interior i muntanya que comparteixen identitat, tradició i problemàtiques similars, com ara el despoblament.</p>
  <p>Aquest vídeo original presenta la visió de futur de crear una xarxa viva on l'actualitat i el patrimoni flueixen en obert.</p>
</div>
</details>"""

content = content.replace(bad_accordion, good_accordion)

with open('src/sections/disseny/DesignSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
