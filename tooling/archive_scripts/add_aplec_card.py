import re

with open('src/sections/disseny/DesignSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure UniversalCard is imported
if 'import { UniversalCard' not in content:
    content = content.replace('import { UniversalPage }', 'import { UniversalPage, UniversalCard }')

aplec_card = """
<section className="design-block sdp-mt-8">
<h4>20.5 Targeta Mestra: Pàgina de Mur (Esdeveniment)</h4>
<UniversalCard
  title="2n Aplec pel Territori"
  body="Concentració, muixerangues i actes culturals en defensa de la nostra terra."
  imageUrl="/assets/uploads/brain/aplec_danses_1774952191348.png"
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
/>
</section>
"""

# Insert it before section 21
if '<h3>21. Estadístiques i Dashboards</h3>' in content:
    content = content.replace('<h3>21. Estadístiques i Dashboards</h3>', aplec_card + '\n<h3>21. Estadístiques i Dashboards</h3>')

with open('src/sections/disseny/DesignSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
