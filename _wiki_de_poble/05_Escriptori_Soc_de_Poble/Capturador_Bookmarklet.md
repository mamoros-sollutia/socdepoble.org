# 🕸️ El Capturador de l'Abocador (Bookmarklet)

Aquest xicotet giny permet agafar qualsevol web que estigues llegint al teu navegador (Chrome, Safari, Firefox) i llançar-la directament a l'Abocador (`00_Raw`) de l'Obsidian, sense trencar la teua concentració. 

## Com instal·lar-lo

1. Mostra la barra de favorits del teu navegador (Ctrl+Shift+B o Cmd+Shift+B).
2. Crea un favorit nou (clic dret a la barra > Afegeix pàgina/favorit).
3. Posa-li de nom: **Sóc de Poble: Caçar Web**
4. A la URL (el camp de l'adreça), **apega EXACTAMENT aquest codi JavaScript**:

```javascript
javascript:(function(){
    var vaultName = encodeURIComponent('socdepoble.org');
    var folder = encodeURIComponent('_wiki_de_poble/00_Raw/');
    var title = document.title;
    var safeTitle = title.replace(/[\\\/\:\*\?\"\<\>\|]/g, '-').substring(0, 50);
    var url = encodeURIComponent(window.location.href);
    var selection = window.getSelection().toString();
    var now = new Date();
    var timeStamp = String(now.getFullYear()).slice(-2) + 
                    String(now.getMonth() + 1).padStart(2, '0') + 
                    String(now.getDate()).padStart(2, '0') + '_' + 
                    String(now.getHours()).padStart(2, '0') + 
                    String(now.getMinutes()).padStart(2, '0');
    var fileName = encodeURIComponent(timeStamp + '_Captura_' + safeTitle);
    
    var content = '---\nfont: ' + window.location.href + '\n---\n\n# ' + title + '\n\n';
    if (selection.length > 0) {
        content += '> ' + selection + '\n\n';
    } else {
        content += '(Sense selecció de text, només la web)\n\n';
    }
    
    var obsidianUri = 'obsidian://new?vault=' + vaultName + '&file=' + folder + fileName + '&content=' + encodeURIComponent(content);
    window.location.href = obsidianUri;
})();
```

## Com s'utilitza

1. Estàs llegint una notícia, una llei de patrimoni o un article que t'interessa.
2. (Opcional) Selecciones/subratlles amb el ratolí el paràgraf més important.
3. Fas clic al botó "**Sóc de Poble: Caçar Web**" de la teua barra de favorits.
4. L'Obsidian s'obrirà automàticament i crearà una nota nova a la carpeta `00_Raw` amb el títol de la web, la data exacta i el text que havies seleccionat (com una cita blockquote).
5. Després només cal que em digues *"Neteja l'abocador"* i la IAIA MarIA processarà la captura i la destil·larà a la Wiki oficial.
