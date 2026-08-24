import re

with open("mercat_socdepoble.html", "r") as f:
    content = f.read()

# The grid starts at <div class="sdp-card-grid sdp-mb-8">
# We want to replace everything from there up to </article>\n    </main> 
# wait, </article>\n    </main> closes the content-wrapper.

# Let's find the exact boundaries.
start_idx = content.find('<div class="sdp-card-grid sdp-mb-8">')
# To find the end of the grid, we can just find the NEXT </article> that corresponds to content-wrapper.
# In mur_socdepoble.html, it's </div>\n    </article>\n    </main>
end_idx = content.find('</article>\n    </main>')

if start_idx != -1 and end_idx != -1:
    grid_content = content[start_idx:end_idx]
    
    # We want to keep only the first 6 cards.
    # We can split by '<article class="sp-card">'
    parts = grid_content.split('<article class="sp-card">')
    
    # parts[0] is '<div class="sdp-card-grid sdp-mb-8">\n'
    # parts[1] to parts[6] are the 6 Samarreta cards.
    # Each part ends with '</article>\n' EXCEPT the last one which might have '</div>\n    '
    
    new_grid_content = parts[0]
    for i in range(1, 7):
        # We need to make sure we append '<article class="sp-card">' back since we split by it.
        new_grid_content += '<article class="sp-card">' + parts[i]
        
    # The last part (parts[6]) might not have the closing </div> for the grid because it's in parts[-1]
    # Let's just add the closing </div>
    # Actually, parts[6] ends with '</article>\n', so we just add '</div>\n    '
    
    # Wait, parts[6] might have other stuff if it was originally followed by more cards.
    # Let's just cleanly get one Samarreta card, and multiply by 6.
    
    one_card = '<article class="sp-card">' + parts[1]
    # parts[1] might have the full card up to </article>\n
    # let's find the exact end of one_card
    card_end = one_card.find('</article>') + len('</article>')
    clean_card = one_card[:card_end]
    
    new_grid = '<div class="sdp-card-grid sdp-mb-8">\n' + (clean_card + '\n') * 6 + '        </div>\n    '
    
    new_content = content[:start_idx] + new_grid + content[end_idx:]
    
    with open("mercat_socdepoble.html", "w") as f:
        f.write(new_content)
    print("Cleaned mercat grid.")
else:
    print("Could not find grid boundaries.")

