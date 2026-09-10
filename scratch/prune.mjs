import fs from 'fs';
import postcss from 'postcss';

const informe = JSON.parse(fs.readFileSync('_wiki_de_poble/04_ESCRIPTORI/00_bandeja_d_entrada/Claude_260910_2132/260910_informe_poda_css.json', 'utf8'));

const deadRulesSet = new Set(informe.regles_mortes.map(r => r.split('  ')[1].trim().replace(/\s+/g, ' ')));
const deadSelectorsPartial = informe.selectors_morts.map(r => r.split('  ')[1].trim().replace(/\s+/g, ' '));

const cssPath = 'src/css/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

const plugin = () => {
  return {
    postcssPlugin: 'poda',
    Rule(rule) {
      const cleanSel = rule.selector.replace(/\s+/g, ' ').trim();
      if (deadRulesSet.has(cleanSel)) {
        console.log('🗑️  Removing rule:', cleanSel);
        rule.remove();
      } else {
        // Handle partial selectors
        let updated = false;
        let sels = rule.selectors;
        for (const deadSel of deadSelectorsPartial) {
          if (sels.includes(deadSel)) {
             sels = sels.filter(s => s !== deadSel);
             updated = true;
             console.log('✂️  Removing partial selector:', deadSel, 'from rule');
          }
        }
        if (updated) {
          if (sels.length === 0) {
             rule.remove();
          } else {
             rule.selectors = sels;
          }
        }
      }
    }
  };
};
plugin.postcss = true;

postcss([plugin]).process(css, { from: cssPath, to: cssPath }).then(result => {
  fs.writeFileSync(cssPath, result.css);
  console.log('✅ Poda completed!');
});
