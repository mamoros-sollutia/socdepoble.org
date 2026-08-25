import re

with open('src/sections/disseny/DesignSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_desc = """<div className="sdp-p-4 sdp-text-content">
  <p>Sóc de Poble és un portal web nascut per interconnectar pobles d'interior i muntanya que comparteixen identitat, tradició i problemàtiques similars, com ara el despoblament.</p>
  <p>Aquest vídeo original presenta la visió de futur de crear una xarxa viva on l'actualitat i el patrimoni flueixen en obert.</p>
</div>"""

new_desc = """<div className="sdp-p-4 sdp-text-content" style={{ whiteSpace: 'pre-wrap' }}>
  <p>Un Projecte per col·laborar en el desenvolupament sostenible i tecnològic en entorns rurals.</p>
  <p>Sóc del Poble serà un PORTAL DE POBLES CONNECTATS on compartir informació, experiències i idees que faciliten el desenvolupament sostenible i tecnològic en entorns rurals, per posar en valor els recursos locals, que són l'essència de la nostra identitat, i mostrar l'atractiu dels pobles com a llocs on viure i treballar.</p>
  <p>Serà un canal orientat a la difusió dels beneficis que les Noves Tecnologies poden aportar al món rural, utilitzant ferramentes col·laboratives:</p>
  <p>
    1. BASE DE DADES OBERTES. MAPA DIRECTORI DE RECURSOS LOCALS.<br/>
    2. CERCADOR TEMÀTIC.<br/>
    3. XARXA SOCIAL DE PRODUCTIVITAT.<br/>
    4. REVISTA DIGITAL.<br/>
    5. VIVERS TIC DE POBLE. Vivers Virtuals d'Emprenedors Rurals.
  </p>
  <p>★ Actualment comptem al Facebook amb més de 200.000 seguidors que se senten identificats amb el concepte de "Ser de Poble". Aquesta xarxa ens permet interactuar amb milers de persones amb les que compartim la nostra percepció del món rural.</p>
  <hr className="sdp-my-4" />
  <h4>GUIÓ DEL VÍDEO</h4>
  <p>
    Pepet toca el clarinet...<br/>
    Viu tranquil i be en un poble menut<br/>
    A l'escola de música del seu poblet aprèn... I ho fa be, si...<br/>
    Vol aprendre més, però ha d'anar a la ciutat... I puja i baixa i va i torna...<br/>
    I fa música i vol que tothom escolte el so del seu clarinet...<br/>
    Però és tot tan difícil al seu poblet!!!<br/>
    Com faré? Es pregunta Pepet.
  </p>
  <p>
    A l'altra banda de les muntanyes viu la Rosa,<br/>
    Ha decidit viure en el camp, té una granja i és apicultora...<br/>
    Les ovelles, les abelles... i els pots de mel, de la bona, de la millor qualitat...<br/>
    Però ha de baixar a la ciutat a vendre la seva mel i obrir-se camí entre marques, mercats, xarxes de distribució...<br/>
    I li ve tot difícil, complex, costerut...
  </p>
  <p>
    Hi ha qualitat de vida a aquells pobles... Es viu tranquil, i es poden fer coses interessants, saludables, arrelades, autèntiques...<br/>
    Però hi ha massa preguntes sense contestar... Massa dificultats... Gent que fa coses als pobles, que necessita oportunitats...<br/>
    Sóc de Poble vol ser pont, xarxa oberta que connecte pobles, persones, empreses, col·lectius, fer fàcil el que sembla difícil entre muntanyes i complexitats tecnològiques...<br/>
    Pep i Rosa ja s'han sumat i formen part de la gentada que vol viure als pobles i contribuir a mantenir-los vius, actius...<br/>
    Gent que té idees i vol fer-les realitat en llocs amb qualitat de vida, amb respecte per les arrels, la natura, la gent...<br/>
    Sóc de poble... i tinc veu...<br/>
    I tu?, et sumes?
  </p>
</div>"""

if old_desc in content:
    content = content.replace(old_desc, new_desc)
    with open('src/sections/disseny/DesignSection.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced old description with new one.")
else:
    print("Could not find old description string.")
