import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make all numbered main sections H3 without classes
# They might currently be <h2>...</h2> or <h3 class="...">...</h3>
# Let's target the inner text that looks like "Number. Title"
def fix_numbered_h(match):
    tag = match.group(1)
    classes = match.group(2)
    inner = match.group(3)
    # Check if inner starts with a number and a dot, like "4. Botons" or "24. Targeta Mestra"
    if re.match(r'^\d+\.\s', inner):
        return f'<h3>{inner}</h3>'
    # If it's like "24.1 Targeta", make it H4
    elif re.match(r'^\d+\.\d+\s', inner):
        return f'<h4>{inner}</h4>'
    
    # Otherwise, return original but strip utility classes if it's an H tag
    # Actually, let's just strip utility classes for all H tags to be safe, except specific ones?
    # No, let's just do the ones we know are wrong.
    return match.group(0)

content = re.sub(r'<h([1-6])(.*?)>(.*?)</h\1>', fix_numbered_h, content)

# Remove the "Sistema de espaciado" paragraph that user didn't like
# User said: "luego no sé por qué debajo pones 'sistema de espaciado' un párrafo inventado..."
content = re.sub(r'<h6 class="sdp-mb-1">Sistema d\'Espaiat \(escala modular base 4/8\)</h6>\n?', '', content)

# Fix remaining H3/H4 that were changed to H2 by my previous script
# Some might not have matched the above if they were already H2 without classes but had numbered titles.
# The regex above catches <h([1-6])(.*?)>(.*?)</h\1> so it will catch <h2>4. Botons</h2> and turn it into <h3>4. Botons</h3>.

# Remove the CMS preview div in Espaiat i Grid if they hate divs so much?
# Wait, "no has conseguido mostrarme párrafos, sigo viendo divs". Maybe they meant in the Typography section?
# Let's check what divs are still in Typography section.
# None! I removed them. But maybe they are looking at the previous commit? Yes, my last fix removed the grey box from Typography. They are probably reacting to the state *before* my last two messages, or they saw the `cms-preview` div in Espaiat i Grid.
# To be safe, let's remove <div class="cms-preview sdp-mt-0 sdp-p-6"> from Espaiat. No, how will the spacing bars render?
# Let's leave Espaiat alone except for the heading.

# Let's find ANY OTHER headers with utility classes and remove the utility classes, except for maybe cards.
def clean_header_classes(match):
    tag = match.group(1)
    attrs = match.group(2)
    inner = match.group(3)
    if 'class="' in attrs:
        # if it's inside a card (e.g., class="sp-card-title"), keep it
        if 'sp-card' in attrs:
            return match.group(0)
        # otherwise strip class
        return f'<{tag}>{inner}</{tag}>'
    return match.group(0)

# Run a second pass to clean up classes on headers
content = re.sub(r'<h([1-6])([^>]*)>(.*?)</h\1>', clean_header_classes, content)

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed HTML.")
