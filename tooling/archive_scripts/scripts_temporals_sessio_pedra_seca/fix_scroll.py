import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # 1. Fix FAB scroll
    old_fab = r"window\.scrollTo\(\{\s*top:\s*0,\s*behavior:\s*'smooth'\s*\}\);"
    new_fab = "const scrollContainer = document.querySelector('.app-main');\n            if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });"
    content = re.sub(old_fab, new_fab, content, count=1)

    # 2. Fix TOC scroll
    old_toc_scroll = r"const offsetTop = h\.getBoundingClientRect\(\)\.top \+ window\.scrollY - 80;\s*window\.scrollTo\(\{ top: offsetTop, behavior: 'smooth' \}\);"
    new_toc_scroll = """const scrollContainer = document.querySelector('.app-main');
                        if (scrollContainer) {
                            const scrollContainerRect = scrollContainer.getBoundingClientRect();
                            const targetRect = h.getBoundingClientRect();
                            const offsetTop = targetRect.top - scrollContainerRect.top + scrollContainer.scrollTop - 80;
                            scrollContainer.scrollTo({ top: offsetTop, behavior: 'smooth' });
                        } else {
                            // Fallback
                            const offsetTop = h.getBoundingClientRect().top + window.scrollY - 80;
                            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                        }"""
    content = re.sub(old_toc_scroll, new_toc_scroll, content)

    with open(filename, "w") as f:
        f.write(content)
    print(f"Fixed scrolling in {filename}")

