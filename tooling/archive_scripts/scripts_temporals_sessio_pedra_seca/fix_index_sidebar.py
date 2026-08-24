import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

new_js = """<script>
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

    // 3. Index Button (TOC - Sidebar)
    const indexBtn = document.querySelector('button[title="Índex de secció"]');
    if (indexBtn) {
        indexBtn.addEventListener('click', () => {
            let tocSidebar = document.getElementById('sdp-toc-sidebar');
            let tocBackdrop = document.getElementById('sdp-toc-backdrop');
            
            if (!tocSidebar) {
                // Create Backdrop
                tocBackdrop = document.createElement('div');
                tocBackdrop.id = 'sdp-toc-backdrop';
                tocBackdrop.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 9998; opacity: 0; transition: opacity 0.3s ease; display: none;';
                
                // Create Sidebar
                tocSidebar = document.createElement('div');
                tocSidebar.id = 'sdp-toc-sidebar';
                tocSidebar.style.cssText = 'position: fixed; top: 0; right: 0; width: 340px; max-width: 90vw; height: 100%; background: var(--sdp-superficie); z-index: 9999; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: -4px 0 24px rgba(0,0,0,0.15); overflow-y: auto; padding: 0; display: flex; flex-direction: column;';
                
                // Sidebar Header
                const sidebarHeader = document.createElement('div');
                sidebarHeader.style.cssText = 'padding: 24px 24px 16px; border-bottom: 1px solid var(--sdp-vora); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--sdp-superficie); z-index: 1;';
                
                const title = document.createElement('h2');
                title.textContent = 'Índex de Contingut';
                title.style.cssText = 'margin: 0; color: var(--sdp-pedra-900); font-size: 1.25rem; font-family: var(--sdp-font-display);';
                
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                closeBtn.style.cssText = 'background: none; border: none; cursor: pointer; color: var(--sdp-pedra-600); padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s;';
                closeBtn.onmouseover = () => closeBtn.style.background = 'var(--sdp-pedra-100)';
                closeBtn.onmouseout = () => closeBtn.style.background = 'transparent';
                
                const closeSidebar = () => {
                    tocSidebar.style.transform = 'translateX(100%)';
                    tocBackdrop.style.opacity = '0';
                    setTimeout(() => { tocBackdrop.style.display = 'none'; }, 300);
                };
                
                closeBtn.addEventListener('click', closeSidebar);
                tocBackdrop.addEventListener('click', closeSidebar);
                
                sidebarHeader.appendChild(title);
                sidebarHeader.appendChild(closeBtn);
                
                // Sidebar Content (List)
                const listContainer = document.createElement('div');
                listContainer.style.cssText = 'padding: 16px 24px 24px; flex-grow: 1;';
                
                const list = document.createElement('ul');
                list.style.cssText = 'list-style: none; padding: 0; margin: 0; font-family: var(--sdp-font-principal);';
                
                // Select H1, H2, H3 inside main
                const headings = document.querySelectorAll('.app-main h1, .app-main h2, .app-main h3');
                headings.forEach((h, i) => {
                    // Skip visually hidden or empty headings
                    if (h.classList.contains('sr-only') || h.textContent.trim() === '') return;
                    
                    if (!h.id) h.id = 'sdp-heading-' + i;
                    const li = document.createElement('li');
                    
                    let padding = '0';
                    let fontSize = '1rem';
                    let fontWeight = 'normal';
                    let color = 'var(--sdp-primary-600)';
                    let marginTop = '12px';
                    
                    if (h.tagName === 'H1') {
                        fontWeight = 'bold';
                        fontSize = '1.05rem';
                        marginTop = '24px';
                        color = 'var(--sdp-pedra-900)';
                    } else if (h.tagName === 'H2') {
                        padding = '12px';
                        fontWeight = '600';
                        color = 'var(--sdp-primary-700)';
                    } else if (h.tagName === 'H3') {
                        padding = '24px';
                        fontSize = '0.9rem';
                        color = 'var(--sdp-pedra-600)';
                    }
                    
                    li.style.cssText = `margin-top: ${marginTop}; margin-bottom: 8px; padding-left: ${padding};`;
                    
                    const a = document.createElement('a');
                    a.href = '#' + h.id;
                    a.textContent = h.textContent.trim();
                    a.style.cssText = `color: ${color}; text-decoration: none; font-weight: ${fontWeight}; font-size: ${fontSize}; transition: color var(--sdp-t); display: block; line-height: 1.4;`;
                    
                    a.addEventListener('mouseover', () => { a.style.color = 'var(--sdp-primary-500)'; });
                    a.addEventListener('mouseout', () => { a.style.color = color; });
                    
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        closeSidebar();
                        const offsetTop = h.getBoundingClientRect().top + window.scrollY - 80;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    });
                    
                    li.appendChild(a);
                    list.appendChild(li);
                });
                
                if (list.children.length === 0) {
                    const empty = document.createElement('p');
                    empty.textContent = 'No hi ha cap secció disponible en esta pàgina.';
                    empty.style.color = 'var(--sdp-pedra-500)';
                    list.appendChild(empty);
                }
                
                listContainer.appendChild(list);
                tocSidebar.appendChild(sidebarHeader);
                tocSidebar.appendChild(listContainer);
                
                document.body.appendChild(tocBackdrop);
                document.body.appendChild(tocSidebar);
                
                // Trigger reflow to ensure transition works on first open
                tocSidebar.offsetHeight;
            }
            
            // Open Sidebar
            tocBackdrop.style.display = 'block';
            setTimeout(() => {
                tocBackdrop.style.opacity = '1';
                tocSidebar.style.transform = 'translateX(0)';
            }, 10);
        });
    }
});
</script>
</body>"""

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Find where the script starts
    start_match = re.search(r"<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => {\s*// 1\. FAB Button", content)
    if start_match:
        start_idx = start_match.start()
        end_idx = content.find("</body>", start_idx) + len("</body>")
        
        new_content = content[:start_idx] + new_js + content[end_idx:]
        with open(filename, "w") as f:
            f.write(new_content)
        print(f"Updated interactions in {filename}")
    else:
        print(f"Could not find old script block in {filename}")

