import re

with open('src/sections/mur/MurSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add useSearchParams to imports
content = content.replace("import React, { useMemo, useState } from 'react';", "import React, { useMemo, useState } from 'react';\nimport { useSearchParams } from 'react-router-dom';")

# Add searchParams hooks inside MurSection
hook_insertion = """  const { sortedEvents, sortedFeedPosts, sortedMarketItems, sortedTowns, pageCopy, t } = useAppData();
  const [searchParams, setSearchParams] = useSearchParams();
  const dateFilter = searchParams.get('date');
  const categoryFilter = searchParams.get('category');
"""
content = content.replace("  const { sortedEvents, sortedFeedPosts, sortedMarketItems, sortedTowns, pageCopy, t } = useAppData();", hook_insertion)

# Update displayedItems
new_displayed_items = """  const displayedItems = useMemo(() => {
    let items = allItems;
    if (filterType === 'events') items = items.filter(i => i.type === 'event');
    if (filterType === 'sistema') items = items.filter(i => i.type === 'sistema');

    if (dateFilter) {
      items = items.filter(i => {
        const rawDate = i.date || i.publish_date || i.created_at;
        if (!rawDate) return false;
        return rawDate.startswith ? rawDate.startswith(dateFilter) : String(rawDate).startsWith(dateFilter);
      });
    }
    
    if (categoryFilter) {
      items = items.filter(i => {
        const labels = i.labels || [{ text: i.isSystem ? 'Sistema' : (i.type || 'Publicació') }];
        return labels.some(l => l.text.toLowerCase() === categoryFilter.toLowerCase());
      });
    }

    return items;
  }, [allItems, filterType, dateFilter, categoryFilter]);"""

# Replace old displayedItems
content = re.sub(r'  const displayedItems = useMemo\(\(\) => \{.*?\n  \}, \[allItems, filterType\]\);', new_displayed_items, content, flags=re.DOTALL)

# Add new inputs to the filter bar
new_buttons = """            <button 
              className={`sdp-button ${filterType === 'sistema' ? 'sdp-button-primary' : 'sdp-button-secondary'}`} 
              onClick={() => { setFilterType('sistema'); setIsMapOpen(false); }}
            >
              Sistema
            </button>
            <input 
              type="date"
              className="sdp-button sdp-button-secondary"
              value={dateFilter || ''}
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams);
                if (e.target.value) {
                  newParams.set('date', e.target.value);
                } else {
                  newParams.delete('date');
                }
                setSearchParams(newParams);
              }}
              style={{ fontFamily: 'inherit', color: dateFilter ? 'var(--sdp-text)' : 'var(--sdp-text-suau)' }}
            />
            <select
              className="sdp-button sdp-button-secondary"
              value={categoryFilter || ''}
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams);
                if (e.target.value) {
                  newParams.set('category', e.target.value);
                } else {
                  newParams.delete('category');
                }
                setSearchParams(newParams);
              }}
              style={{ fontFamily: 'inherit', color: categoryFilter ? 'var(--sdp-text)' : 'var(--sdp-text-suau)', paddingRight: 'var(--sdp-space-8)' }}
            >
              <option value="">Totes les categories</option>
              <option value="Mur">Mur</option>
              <option value="Mercat">Mercat</option>
              <option value="Pobles">Pobles</option>
              <option value="Roba">Roba</option>
              <option value="Samarreta">Samarreta</option>
            </select>"""

content = re.sub(r'            <button \n              className={`sdp-button \$\{filterType === \'sistema\'.*?</button>', new_buttons, content, flags=re.DOTALL)

with open('src/sections/mur/MurSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MurSection!")
