import fs from 'fs';

const graphPath = '_wiki_de_poble/.obsidian/graph.json';
const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));

graph.showOrphans = false;
graph.hideUnresolved = true;
graph.showAttachments = false;
graph.search = '-path:"90_historic" -path:"04_escriptori" -path:"00_SER_Brain_Identitat/00_AGENTS_I_SKILLS_MIRROR" -path:"00_SER_Brain_Identitat/Sollutia" -path:"03_GOVERNAR_Normativa_Regles/agents_actius"';

graph.colorGroups = [
  { query: 'path:"00_SER_Brain_Identitat"', color: { a: 1, rgb: 14701138 } },
  { query: 'path:"01_SABER_Cultura_Coneixement"', color: { a: 1, rgb: 5423851 } },
  { query: 'path:"02_ACTUAR_Maquina_Tecnica"', color: { a: 1, rgb: 5413083 } },
  { query: 'path:"03_GOVERNAR_Normativa_Regles"', color: { a: 1, rgb: 14725458 } }
];

fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2));
