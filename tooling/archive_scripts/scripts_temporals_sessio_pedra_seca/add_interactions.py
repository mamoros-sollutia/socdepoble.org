import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

js_code = """
<script>
document.addEventListener('DOMContentLoaded', () => {
    // 1. FAB Button (Scroll to top)
    const fab = document.querySelector('.fab-button');
    if (fab) {
        fab.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 2. Back Button (Volver Atrás)
    const backBtn = document.querySelector('button[title="Tornar arrere"]');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            history.back();
        });
    }

    // 3. Index Button (TOC)
    const indexBtn = document.querySelector('button[title="Índex de secció"]');
    if (indexBtn) {
        indexBtn.addEventListener('click', () => {
            let tocOverlay = document.getElementById('sdp-toc-overlay');
            if (!tocOverlay) {
                tocOverlay = document.createElement('div');
                tocOverlay.id = 'sdp-toc-overlay';
                tocOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);';
                
                const tocContent = document.createElement('div');
                tocContent.style.cssText = 'background: var(--sdp-superficie); padding: var(--sdp-space-6); border-radius: var(--sdp-radi-g); width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.2); position: relative;';
                
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '✕';
                closeBtn.style.cssText = 'position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--sdp-pedra-600);';
                closeBtn.addEventListener('click', () => { tocOverlay.style.display = 'none'; });
                
                const title = document.createElement('h2');
                title.textContent = 'Índex de Contingut';
                title.style.cssText = 'margin-top: 0; margin-bottom: 24px; color: var(--sdp-pedra-900); font-size: 1.5rem; font-family: var(--sdp-font-display);';
                
                const list = document.createElement('ul');
                list.style.cssText = 'list-style: none; padding: 0; margin: 0; font-family: var(--sdp-font-principal);';
                
                // Only index inside the main area, ignore sidebars
                const headings = document.querySelectorAll('.app-main h1, .app-main h2');
                headings.forEach((h, i) => {
                    if (!h.id) h.id = 'sdp-heading-' + i;
                    const li = document.createElement('li');
                    li.style.cssText = `margin-bottom: 12px; padding-left: ${h.tagName === 'H2' ? '16px' : '0'};`;
                    
                    const a = document.createElement('a');
                    a.href = '#' + h.id;
                    a.textContent = h.textContent;
                    a.style.cssText = `color: var(--sdp-primary-600); text-decoration: none; font-weight: ${h.tagName === 'H1' ? 'bold' : 'normal'}; transition: color var(--sdp-t);`;
                    a.addEventListener('mouseover', () => { a.style.color = 'var(--sdp-primary-800)'; });
                    a.addEventListener('mouseout', () => { a.style.color = 'var(--sdp-primary-600)'; });
                    
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        tocOverlay.style.display = 'none';
                        const offsetTop = h.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    });
                    
                    li.appendChild(a);
                    list.appendChild(li);
                });
                
                if (headings.length === 0) {
                    const empty = document.createElement('p');
                    empty.textContent = 'No hi ha cap secció disponible en esta pàgina.';
                    empty.style.color = 'var(--sdp-pedra-500)';
                    list.appendChild(empty);
                }
                
                tocContent.appendChild(closeBtn);
                tocContent.appendChild(title);
                tocContent.appendChild(list);
                tocOverlay.appendChild(tocContent);
                
                tocOverlay.addEventListener('click', (e) => {
                    if (e.target === tocOverlay) tocOverlay.style.display = 'none';
                });
                
                document.body.appendChild(tocOverlay);
            } else {
                tocOverlay.style.display = 'flex';
            }
        });
    }
});
</script>
</body>"""

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Don't inject multiple times
    if "document.querySelector('.fab-button')" not in content:
        content = content.replace("</body>", js_code)
        with open(filename, "w") as f:
            f.write(content)
        print(f"Added interactions to {filename}")
    else:
        print(f"Interactions already present in {filename}")

