import re

with open('src/sections/disseny/DesignSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix viewBox globally
content = content.replace('viewBox="0 0 20 20"', 'viewBox="0 0 24 24"')

# Replace the hardcoded 20.3 Targeta Mestra (Producte) with the UniversalCard
# and replace 20.4 Targeta Mestra (Disseny) with the Aplec UniversalCard.

# Ensure UniversalCard is imported
if 'import { UniversalCard' not in content:
    content = content.replace('import { UniversalPage }', 'import { UniversalPage, UniversalCard }')

# Find 20.3
targeta_mestra = """<h4>20.3 Targeta Mestra: Imatge Completa (Producte)</h4>
<UniversalCard
  title="Samarreta Sóc de Poble"
  subtitle="L'edició definitiva amb el logotip complet"
  body="Dibuix del mapa del tresor. Cotó Roly de màxima qualitat."
  imageUrl="/assets/uploads/brain/media__1776503825171.jpg"
  imageAlt="Samarreta"
  price="15.00€"
  labels={[
    { text: 'Mercat', className: 'sdp-badge-system' },
    { text: 'Roba', className: 'sdp-badge-category' },
    { text: 'Samarreta', className: 'sdp-badge-tag' }
  ]}
  author="Sóc de Poble"
  location="La Torre de les Maçanes"
  avatarUrl="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"
  time="00:29"
  date="23/03/22"
  copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
  hasFooter={true}
  showTranslate={true}
  showComment={true}
  showShare={true}
  showConnect={true}
  mainHref="#samarreta"
/>

<h4>20.4 Targeta Mestra: Pàgina de Mur (Esdeveniment)</h4>
<UniversalCard
  title="2n Aplec pel Territori"
  body="Concentració, muixerangues i actes culturals en defensa de la nostra terra."
  imageUrl="/assets/uploads/brain/aplec.jpg"
  imageAlt="Cartell Aplec"
  labels={[
    { text: 'event', className: 'sdp-badge-system' }
  ]}
  author="Coordinadora d'Estudis..."
  location="La Torre de les Maçanes"
  avatarUrl="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"
  time="01:00"
  date="17/11/23"
  calendarBadge={{ dia: '17', mes: 'NOVEMBRE', any: '2023', dateTime: '2023-11-17' }}
  copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
  hasFooter={true}
  showTranslate={true}
  showComment={true}
  showShare={true}
  showConnect={true}
  mainHref="#aplec"
/>"""

# Regex to replace from <h4>20.3 Targeta Mestra: Imatge Completa (Producte)</h4> up to the end of 20.4 article
pattern = re.compile(r'<h4>20\.3 Targeta Mestra: Imatge Completa \(Producte\)</h4>.*?</article>\s*<h4>20\.4 Targeta Mestra: Pàgina de Mur \(Disseny\)</h4>.*?</article>', re.DOTALL)
content = pattern.sub(targeta_mestra, content)

with open('src/sections/disseny/DesignSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
