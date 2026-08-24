import { resol, escriu } from './06_EINES/canonada.mjs';

const contingut = `---
type: prompt
status: draft
---
# Prompt: Auditoria Inversa per a l'Orquestració Híbrida (WordPress i React)

Salutacions, Honorable Consell d'Intel·ligències (Qwen, Deepseek, Claude, Mistral, Kimi).

Us adjuntem el **codi font complet del nostre sistema "Sóc de Poble"** (ho rebreu com a un fitxer separat anomenat \`BUNDLE\`). Us demanem que llegiu l'arquitectura "Pedra Seca" i ens ajudeu a resoldre els següents problemes tècnics crítics d'integració entre WordPress i React.

## Ordres Concretes i Objectius:

1. **Solucionar l'Error de React en l'Entorn WordPress:**
   Hem intentat compilar el nostre \`PedraSecaEmbed.jsx\` com a mòdul autònom mitjançant \`vite.standalone.config.js\` (utilitzant \`formats: ['es']\` i externalitzant react). Però quan WordPress ho carrega, el navegador llança:
   \`Uncaught TypeError: Failed to resolve module specifier "react". Relative references must start with either "/", "./", or "../".\`
   **Tasca:** Analitzeu el \`vite.standalone.config.js\` proporcionat en el bundle i indiqueu-nos com canviar l'empaquetatge (potser IIFE o UMD?) per tal que utilitze el \`wp.element\` natiu de WordPress de manera neta i robusta.

2. **Implementar l'Orquestració de Rutes (El Repte A):**
   Volem que WordPress cedisca completament certes URL a React (sobirania de rutes). Però necessitem que aquestes URL retornen un codi HTTP 200 (i no un 404). 
   **Tasca:** Definiu exactament com hem de configurar els \`add_rewrite_rule\` en el nostre fitxer \`soc-de-poble.php\` perquè WordPress delegue l'encaminament al nostre \`index.php\` (o plantilla personalitzada) on s'allotja el component React, sense interferir en la REST API de Sollutia.

3. **Auditoria de Codi (Full Codebase):**
   Examineu el codi font empaquetat per assegurar que el nostre disseny compleix les regles de la "Pedra Seca" i garanteix un entorn 100% connectable (Shadow DOM, cap variable global, neteja de memòria) de cara a integrar-ho a Sollutia.

Si us plau, llegiu detingudament el bundle adjunt, reflexioneu pas a pas, i doneu-nos el codi precís per a \`vite.standalone.config.js\` i \`soc-de-poble.php\`.
`;

const bitllet = resol('PROMPT', 'Ordres Concretes Auditoria Wordpress', { extensio: 'md' });
escriu(bitllet, contingut, { sobreescriu: true });
console.log('Prompt generat a: ' + bitllet.ruta);
