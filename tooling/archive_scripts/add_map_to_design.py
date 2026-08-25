import re

with open('src/sections/disseny/DesignSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'import { buildMapEmbedUrl }' not in content:
    content = content.replace("import { UniversalPage, UniversalCard } from '../../components/universal/UniversalComponents.jsx';", 
                              "import { UniversalPage, UniversalCard } from '../../components/universal/UniversalComponents.jsx';\nimport { buildMapEmbedUrl } from '../mur/mapConfig';")

iframe_html = """
            <iframe
              title="Mapa del territori"
              src={buildMapEmbedUrl()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: '100%', height: '400px', border: 0, borderRadius: 'var(--sdp-radi-lg)' }}
            />
"""

content = content.replace("[OpenStreetMap Iframe]", iframe_html)
content = content.replace('className="embed-container sdp-flex sdp-items-center sdp-justify-center"', 'className="embed-container sdp-w-full sdp-mb-4"')

with open('src/sections/disseny/DesignSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
