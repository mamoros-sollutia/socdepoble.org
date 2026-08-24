import fs from 'fs';

const dolaFile = '/Users/javillinares/.gemini/antigravity-ide/brain/0c901aba-6de2-437d-afb5-c03c443da90d/00_dashboard_cognitiu.html';
const targetFile = 'demo_pedra_seca.html';

let dolaContent = fs.readFileSync(dolaFile, 'utf8');

// Remove <html>, Tailwind script, etc to prevent total destruction of the host page
dolaContent = dolaContent.replace(/<html[^>]*>/i, '');
dolaContent = dolaContent.replace(/<\/html>/i, '');
// Replace tailwind CDN script to avoid breaking our native CSS!
dolaContent = dolaContent.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/i, '<!-- Tailwind eliminat per a forçar adaptació nativa -->');

const section37 = `
      <!-- SECCIÓ 37: DASHBOARD COGNITIU (PROPOSTA DOLA) -->
      <section class="design-block" id="seccio-37" style="margin-bottom: 80px; max-width: 100%;">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">37. Consola del Cervell (Proposta Dola)</h2>
        <p style="font-size: 0.85rem; color: var(--sp-muted); margin-bottom: 24px; text-align: center;">HTML inserit directament per a ser auditat i adaptat a la Pedra Seca en la propera sessió.</p>
        
        <div style="border: 2px dashed #E5E5E5; border-radius: 12px; overflow: hidden; background: #1a1a1d;">
          ${dolaContent}
        </div>
      </section>
`;

let targetContent = fs.readFileSync(targetFile, 'utf8');

// Insert before the closing </article>
targetContent = targetContent.replace(/    <\/article>/, section37 + '\n    </article>');

fs.writeFileSync(targetFile, targetContent);
console.log("Section 37 injected successfully.");
