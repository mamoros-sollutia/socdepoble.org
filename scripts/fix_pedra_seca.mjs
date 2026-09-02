import fs from 'node:fs';
import path from 'node:path';

function fixInlineStyles() {
    const srcDir = './src';
    const cssPath = './src/css/index.css';

    // Regex to match style={{ ... }}
    const styleRegex = /style=\{\{([\s\S]*?)\}\}/g;
    const bannedProps = /color|background|font/i;

    let utilityClassesFound = new Set();
    
    function processDir(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                processDir(filePath);
            } else if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
                processFile(filePath);
            }
        }
    }

    function processFile(filePath) {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;
        
        // This is a naive replacement. It looks for banned properties and just removes them.
        // It's dangerous for complex JS objects, but since it's just inline styles, we can try to
        // just delete lines or properties containing color, background, font.
        
        let newContent = content.replace(styleRegex, (match, styleContent) => {
            if (bannedProps.test(styleContent)) {
                hasChanges = true;
                
                // Extract var(...) usage to see if we can infer utility classes
                let newStyle = styleContent.replace(/([a-zA-Z0-9_]+)\s*:\s*([^,}]+)(,|$)/gi, (m, prop, val, comma) => {
                    if (prop.toLowerCase().includes('color') || prop.toLowerCase().includes('background') || prop.toLowerCase().includes('font')) {
                        return '';
                    }
                    return m;
                });
                
                if (newStyle.trim() === '') {
                    return ''; // Remove style completely if empty
                }
                return `style={{ ${newStyle} }}`;
            }
            return match;
        });

        // Also we might end up with ` style={{  }}` or `<div >` empty spaces, but it's valid JSX.
        // Also need to clean up `style=""`
        newContent = newContent.replace(/style=\{\{\s*\}\}/g, '');
        newContent = newContent.replace(/style=\{\{,\s*/g, 'style={{');
        newContent = newContent.replace(/,\s*\}\}/g, '}}');
        
        if (hasChanges) {
            console.log(`Fixing inline styles in ${filePath}`);
            fs.writeFileSync(filePath, newContent, 'utf8');
        }
    }

    processDir(srcDir);
    console.log("Done fixing inline styles.");
}

fixInlineStyles();
