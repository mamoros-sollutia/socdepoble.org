import fs from 'fs';

const agentsIndex = '.agents/index.md';
let content = fs.readFileSync(agentsIndex, 'utf8');
content += `\n
## Orphans
- [[01_context_i_principis.md]]
- [[02_workflow_execucio.md]]
- [[03_regles_arquitectura_i_dades.md]]
- [[04_criteris_producte_i_disseny.md]]
- [[AGENTS.md]]
- [[BASELINE.md]]
- [[BOOTSTRAP.md]]
- [[PROFILE.md]]
- [[README.md]]
- [[SKILLS_SEAL.json]]
- [[cervells/placeholder.md]]
- [[codi-congelat.txt]]
- [[consell.json]]
- [[doctrina-ignora.txt]]
- [[hooks.json]]
- [[hooks/preflight_matrix_wrapper.mjs]]
- [[rules/00_BIOS_COGNITIU.md]]
- [[skills/socdepoble-workflow/SKILL.md]]
`;
fs.writeFileSync(agentsIndex, content);

const escriptoriIndex = '_wiki_de_poble/04_escriptori/00_index_escriptori.md';
let escContent = fs.readFileSync(escriptoriIndex, 'utf8');
escContent += `\n
## Orphans
- [[00_bandeja_d_entrada/claude_260910_0514/260910_auditoria_nomenclatura_wiki.md]]
- [[260910_0535_acta_marmota_migracio_nomenclatura.md]]
- [[claude_260910_0450/260910_auditoria_seient5_post_destruccio.md]]
`;
fs.writeFileSync(escriptoriIndex, escContent);

const serIndex = '_wiki_de_poble/01_ser/00_bios.md';
if (fs.existsSync(serIndex)) {
    let serContent = fs.readFileSync(serIndex, 'utf8');
    serContent += `\n
## Orphans
- [[03_equip_ia.md]]
`;
    fs.writeFileSync(serIndex, serContent);
}

const saberIndex = '_wiki_de_poble/02_saber/00_index_identitat.md';
if (fs.existsSync(saberIndex)) {
    let saberContent = fs.readFileSync(saberIndex, 'utf8');
    saberContent += `\n
## Orphans
- [[skills/contingencia_offline.md]]
`;
    fs.writeFileSync(saberIndex, saberContent);
}
