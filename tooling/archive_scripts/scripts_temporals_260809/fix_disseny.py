import re

with open('src/html/disseny.html', 'r') as f:
    content = f.read()

# Replace broken images
content = re.sub(
    r'src="https://socdepoble\.org/assets/uploads/brain/media__\d+\.jpg"',
    'src="../assets/img/ibanez_pedra_seca_design_1780873465211.png"',
    content
)

# Renumber sections from 24 to 33 to be 20 to 29
for old_num in range(24, 34):
    new_num = old_num - 4
    
    # Replace main h3 headings
    content = re.sub(
        rf'<h3>{old_num}\. ',
        f'<h3>{new_num}. ',
        content
    )
    
    # Replace subheadings h4
    content = re.sub(
        rf'<h4>{old_num}\.',
        f'<h4>{new_num}.',
        content
    )

with open('src/html/disseny.html', 'w') as f:
    f.write(content)

print("Fixed images and section numbering")
