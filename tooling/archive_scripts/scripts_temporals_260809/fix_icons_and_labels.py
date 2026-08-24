import glob
import re

# 1. Fix JS theme toggle
js_file = 'src/js/pedra-seca.js'
with open(js_file, 'r') as f:
    js = f.read()

# Replace the moonPaths/sunPaths logic with href swapping
js = re.sub(r'const moonPaths = themeToggle\.querySelectorAll\(\'\.moon-path\'\);.*?const sunPaths = themeToggle\.querySelectorAll\(\'\.sun-path\'\);', '', js, flags=re.DOTALL)

update_icon_logic = """    function updateIcon() {
      const useEl = themeToggle.querySelector('use');
      if (useEl) {
        useEl.setAttribute('href', isDark ? '#icon-sun' : '#icon-moon');
      }
    }"""
js = re.sub(r'function updateIcon\(\) \{.*?\s*\} \}', update_icon_logic, js, flags=re.DOTALL)

with open(js_file, 'w') as f:
    f.write(js)

# 2. Fix HTML files
for html_file in glob.glob('src/html/*.html'):
    with open(html_file, 'r') as f:
        html = f.read()
    
    # Replace icon-3 symbol with icon-moon and icon-sun
    moon_symbol = '<symbol id="icon-moon" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></symbol>'
    sun_symbol = '<symbol id="icon-sun" viewBox="0 0 24 24"><path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"></path><line x1="12" x2="12" y1="1" y2="3"></line><line x1="12" x2="12" y1="21" y2="23"></line><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"></line><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"></line><line x1="1" x2="3" y1="12" y2="12"></line><line x1="21" x2="23" y1="12" y2="12"></line><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"></line><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"></line></symbol>'
    
    html = re.sub(r'<symbol id="icon-3".*?</symbol>', moon_symbol + '\n  ' + sun_symbol, html, flags=re.DOTALL)
    
    # Replace the initial use of icon-3 with icon-moon
    html = html.replace('<use href="#icon-3"></use>', '<use href="#icon-moon"></use>')

    # 3. Fix Labels
    if 'mur.html' in html_file:
        html = re.sub(r'<div class="sp-card-labels page-title-labels">.*?</div>', '<div class="sp-card-labels page-title-labels">\n<span class="sp-card-label label-orange">MUR</span>\n</div>', html, flags=re.DOTALL)
    elif 'mercat.html' in html_file:
        html = re.sub(r'<div class="sp-card-labels page-title-labels">.*?</div>', '<div class="sp-card-labels page-title-labels">\n<span class="sp-card-label label-orange">MERCAT</span>\n</div>', html, flags=re.DOTALL)

    with open(html_file, 'w') as f:
        f.write(html)
