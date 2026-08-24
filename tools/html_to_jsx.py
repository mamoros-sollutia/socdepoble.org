import re
import sys

def html_to_jsx(html):
    # Basic replacements for JSX
    jsx = html.replace('class="', 'className="')
    jsx = jsx.replace('for="', 'htmlFor="')
    jsx = jsx.replace('onclick="', 'onClick="')
    jsx = jsx.replace('onsubmit="', 'onSubmit="')
    jsx = jsx.replace('onchange="', 'onChange="')
    jsx = jsx.replace('tabindex="', 'tabIndex="')
    jsx = jsx.replace('readonly', 'readOnly')
    jsx = jsx.replace('autocomplete="', 'autoComplete="')
    jsx = jsx.replace('autofocus', 'autoFocus')
    jsx = jsx.replace('novalidate', 'noValidate')
    jsx = jsx.replace('checked="checked"', 'defaultChecked')
    jsx = jsx.replace('checked ', 'defaultChecked ')
    jsx = jsx.replace('selected="selected"', 'defaultValue')
    
    # Close self-closing tags
    jsx = re.sub(r'<(img|hr|br|input|meta|link)([^>]*?)(?<!/)>', r'<\1\2 />', jsx)
    
    # Remove onclick attributes with alerts since we don't want them executing
    jsx = re.sub(r'onClick="[^"]*"', 'onClick={() => {}}', jsx)
    
    # Fix inline styles (very naive, assumes simple styles or just removes them if complex)
    jsx = re.sub(r'style="([^"]*)"', '', jsx) # Remove style attributes to avoid React errors

    # Remove SVG xmlns and other react-unfriendly things
    jsx = jsx.replace('xmlns:xlink="http://www.w3.org/1999/xlink"', '')
    jsx = jsx.replace('xml:space="preserve"', '')
    
    return jsx

with open('_wiki_de_poble/05_Escriptori_Soc_de_Poble/produccio/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract content-wrapper
match = re.search(r'<article class="content-wrapper">(.*?)</article>\s*</main>', content, re.DOTALL)
if match:
    inner_html = match.group(1)
    jsx_code = html_to_jsx(inner_html)
    
    output = f"""import React from 'react';
import {{ UniversalPage }} from '../../components/universal/UniversalComponents.jsx';
import '../../pages/features/sosp-components.css';
import {{ useAppData }} from '../../app/AppDataContext';

export default function DesignSection() {{
  const {{ t }} = useAppData();

  return (
    <UniversalPage
      chrome="context"
      title="Disseny Pedra Seca"
      lead="Inclou la Targeta Mestra, els colors oficials, i tots els elements preparats, inclús els skills i scripts, perquè qualsevol IA puga entendre este sistema i reproduir-lo."
      labels={{[
        {{ text: 'MUR', className: 'label-orange' }},
        {{ text: 'Disseny UI', className: 'label-blue' }}
      ]}}
      copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
      heroImage="https://socdepoble.org/assets/uploads/brain/ibanez_pedra_seca_design_1780873465211.png"
      authorName="Sóc de Poble"
      authorLocation="La Torre de les Maçanes"
      time="23:29"
      date="22/3/22"
    >
      <div className="universal-content sosp-design-system sdp-manual-disseny">
        <h2>Sistema oficial de disseny per a Sóc de Poble</h2>
        {{/* Generated JSX from HTML */}}
        {jsx_code}
      </div>
    </UniversalPage>
  );
}}
"""
    with open('src/sections/disseny/DesignSection.jsx', 'w', encoding='utf-8') as f:
        f.write(output)
    print("Successfully converted and injected JSX into DesignSection.jsx")
else:
    print("Could not find content-wrapper")
