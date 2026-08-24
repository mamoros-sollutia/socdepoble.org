import fs from 'fs';
const file = 'demo_pedra_seca.html';
let content = fs.readFileSync(file, 'utf8');

// First, remove the misplaced closing tags from before Section 34
content = content.replace(/    <\/article>\n  <\/main>\n\n      <!-- SECCIÓ 34: VARIABLES CSS -->/g, '      <!-- SECCIÓ 34: VARIABLES CSS -->');

// Also handle the case where they are not exactly separated by \n\n
content = content.replace(/<\/article>\s*<\/main>\s*<!-- SECCIÓ 34/g, '<!-- SECCIÓ 34');

// Finally, add them back before the FAB if they aren't there
if (!content.match(/<\/article>\s*<\/main>\s*<!-- FAB -->/)) {
    content = content.replace(/  <!-- FAB -->/g, '    </article>\n  </main>\n\n  <!-- FAB -->');
}

fs.writeFileSync(file, content);
