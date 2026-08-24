import re

with open('src/html/disseny.html', 'r') as f:
    content = f.read()

# Replace any button text in .sp-card-connect with "Connectar"
# Example: <button class="sp-card-connect" title="Votar">Votar</button> -> <button class="sp-card-connect" title="Connectar">Connectar</button>

# We can use a regex to match <button class="sp-card-connect" .*?>.*?</button>
def replace_button(match):
    inner_text = match.group(0)
    # We want to replace the title="..." if it exists, and the inner text.
    # Actually, the user just wants the button to say "CONNECTAR" or "Connectar".
    # Let's replace the whole tag while preserving style attributes if any.
    # It's safer to just regex replace the title and inner content.
    inner = re.sub(r'title="[^"]*"', 'title="Connectar"', inner_text)
    inner = re.sub(r'>.*?<', '>Connectar<', inner)
    return inner

content = re.sub(r'<button class="sp-card-connect"[^>]*>.*?</button>', replace_button, content)

with open('src/html/disseny.html', 'w') as f:
    f.write(content)

print("Updated connect buttons")
