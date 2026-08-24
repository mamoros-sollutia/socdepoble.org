with open('src/sections/disseny/DesignSection.jsx', 'r') as f:
    content = f.read()

import_statement = "import IaiaIcon from '../../components/icons/IaiaIcon';\n"
if import_statement not in content:
    content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';\n" + import_statement)
    with open('src/sections/disseny/DesignSection.jsx', 'w') as f:
        f.write(content)
print("Import fixed!")
