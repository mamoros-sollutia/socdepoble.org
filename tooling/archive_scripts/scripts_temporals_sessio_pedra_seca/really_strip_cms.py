from bs4 import BeautifulSoup

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

previews = soup.find_all('div', class_=lambda c: c and 'cms-preview' in c.split())

for preview in previews:
    preview.unwrap()

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

print("Unwrapped cms-preview divs.")
