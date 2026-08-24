with open('src/sections/disseny/DesignSection.jsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if 'import { ' in line and 'lucide-react' in line and not any('IaiaIcon' in l for l in new_lines):
        new_lines.append(line)
        new_lines.append("import IaiaIcon from '../../components/icons/IaiaIcon';\n")
        continue

    if '<svg className="icon iaia-icon"' in line:
        new_lines.append('            <IaiaIcon />\n')
        skip = True
        continue
    
    if skip:
        if '</svg>' in line:
            skip = False
        continue
        
    new_lines.append(line)

with open('src/sections/disseny/DesignSection.jsx', 'w') as f:
    f.writelines(new_lines)
print("Fixed IaiaIcon in DesignSection")
