const fs = require('fs');
const newHtml = `
      <h3>La Visió i el Paradigma</h3>
      <p>La nostra missió final, l'horitzó on mirem, és connectar els pobles mitjançant la <strong>sobirania tecnològica</strong> i el <em>Local-First</em>. Volem defugir dels grans monopolis de dades i els intermediaris que compliquen la vida. L'objectiu és que quan un uelo toque una pantalla, simplement sàpiga què fer, sense pensar en menús, frameworks, IAs ni arquitectura.</p>
      
      <p>Aquest ideal de "Local-First" absolut (on la xarxa sobreviu inclús sense internet) és el nostre <strong>Somni Fundacional</strong>. No obstant això, el pragmatisme i la necessitat vital de donar servei immediat als pobles ens ha dut a acceptar una aliança temporal amb arquitectures "Online-First" robustes com Sollutia i Supabase. Hui construïm sobre el núvol per arribar a tothom de forma ràpida i eficient, però sempre dissenyant les estructures perquè demà puguen ser completament descentralitzades. Construïm el present sense hipotecar l'ànima del futur.</p>

      <h3>Els Orígens (2013): La Llavor del Portal de Pobles Connectats</h3>
      <p>Sóc de Poble no va nàixer ahir. L'essència d'aquest projecte es va forjar fa més d'una dècada, cap a l'any 2013-2014, amb un manifest claríssim que ja s'allotjava originalment al domini <em>socdepoble.net</em>:</p>
      
      <blockquote style="border-left: 4px solid var(--sdp-color-accent); padding-left: var(--sdp-space-4); margin: var(--sdp-space-6) 0; font-style: italic; color: var(--sdp-color-gray-dark);">
        "Un projecte per crear una xarxa social descentralitzada de programari lliure. Un Portal de Pobles Connectats per compartir informació, experiències i idees que faciliten el desenvolupament sostenible i tecnològic en entorns rurals."
      </blockquote>

      <p>En aquella època, Sóc de Poble ja comptava amb més de 160.000 seguidors actius a Facebook que s'identificaven amb l'orgull de "ser de poble". Conscient del perill de dependre d'aquells algoritmes privats, el projecte va alçar un primer mapa del que havia de ser l'eixida a la sobirania rural.</p>
      
      <h3>La Transformació: Del Somni de 2013 al Mas Indestructible d'Hui</h3>
      <p>Ha plogut molt des d'aquells primers esbossos. Però <strong>no hem perdut absolutament res d'allò que volíem ser</strong>. Al contrari, hem agafat aquells plànols antics i els hem començat a materialitzar amb el coneixement tècnic modern i el rigor metodològic que aporta el nostre diccionari de Trellat.</p>
      
      <p>Si comparem aquella visió històrica amb la realitat actual del projecte, veurem com les branques d'aquell arbre ara donen fruit:</p>
      <ul style="display: flex; flex-direction: column; gap: var(--sdp-space-3); margin-bottom: var(--sdp-space-6);">
        <li>El que abans era un "Mòdul Social" i de missatgeria bàsica, hui és el robust <strong>Mur Universal i el Xat de la IAIA</strong>.</li>
        <li>El que anomenàvem "Directori Local", s'ha forjat arquitectònicament en formularis accessibles i un mercat clar on la gent del camp pot trobar i oferir els seus productes de la terra sense pagar comissions.</li>
        <li>El respecte per la "Privacitat i el Programari Lliure" s'ha convertit en l'estàndard ètic irrenunciable: zero cookies comercials i zero telemetria invasiva. Les teues dades són el teu patrimoni.</li>
      </ul>

      <h3>El Cercle Virtuós i la Qualitat de Llaurador</h3>
      <p>Nosaltres no construïm per a entorns de laboratori asèptics amb fibra òptica i pantalles de retina d'última generació. El nostre estàndard de qualitat es mesura responent a qui som i d'on venim:</p>
      
      <ul style="display: flex; flex-direction: column; gap: var(--sdp-space-3); margin-bottom: var(--sdp-space-6);">
        <li><strong>Qui utilitza el sistema?</strong> Gent amb gran experiència vital, potser no nadius digitals, que mereixen un respecte gràfic amb textos grans, contrastats i clars.</li>
        <li><strong>Sota quines condicions?</strong> Sota la llum implacable del sol enmig del bancal, i sovint amb dispositius que ja fa anys que eixiren de la fàbrica.</li>
      </ul>

      <p>Sóc de Poble transforma les aspreses i limitacions rurals en criteris d'altíssima qualitat. La premissa és senzilla: si una aplicació funciona perfectament al camp, amb les mans brutes de terra i poca bateria, funcionarà gloriosament a qualsevol altre lloc.</p>

      <h3>La Visió Fonamental (Les quatre infografies històriques)</h3>
      <p>Per entendre l'abast original que hui estem construint pedra a pedra, val la pena recuperar les quatre infografies mestres elaborades fa més d'una dècada. Constitueixen la llavor inalterable que ens guia.</p>

      <div style="display: flex; flex-direction: column; gap: var(--sdp-space-6); margin-top: var(--sdp-space-6);">
        <div className="media-frame" style="border-radius: var(--sdp-radi-xl); overflow: hidden; box-shadow: var(--sdp-ombra-md);">
          <img src="/assets/img/que-es-socdepoble-1.jpg" alt="Infografia 1: Valors innegociables i descentralització" style="width: 100%; height: auto; display: block;" />
        </div>
        <div className="media-frame" style="border-radius: var(--sdp-radi-xl); overflow: hidden; box-shadow: var(--sdp-ombra-md);">
          <img src="/assets/img/que-es-socdepoble-2.jpg" alt="Infografia 2: Mapeig col·laboratiu geolocalitzat" style="width: 100%; height: auto; display: block;" />
        </div>
        <div className="media-frame" style="border-radius: var(--sdp-radi-xl); overflow: hidden; box-shadow: var(--sdp-ombra-md);">
          <img src="/assets/img/que-es-socdepoble-3.jpg" alt="Infografia 3: Viver d'emprenedors rurals" style="width: 100%; height: auto; display: block;" />
        </div>
        <div className="media-frame" style="border-radius: var(--sdp-radi-xl); overflow: hidden; box-shadow: var(--sdp-ombra-md);">
          <img src="/assets/img/que-es-socdepoble-4.jpg" alt="Infografia 4: Mòdul social rural" style="width: 100%; height: auto; display: block;" />
        </div>
      </div>
`;
const escapedHtml = newHtml.replace(/"/g, '\\"').replace(/\n/g, '\\n');
const replacementStr = '    "html": "' + escapedHtml + '"';

const fileContents = fs.readFileSync('src/sections/text/pageContent.js', 'utf8');
const lines = fileContents.split('\n');
lines[18] = replacementStr; // Line 19 (0-indexed 18)
fs.writeFileSync('src/sections/text/pageContent.js', lines.join('\n'));
`;
node scratch/generate_html_line.js
