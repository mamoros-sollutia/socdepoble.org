const fs = require('fs');

const contentPath = 'src/sections/text/pageContent.js';
let content = fs.readFileSync(contentPath, 'utf-8');

const newSkillsHtml = `
      <p class="sdp-text-small" style="font-style: italic; opacity: 0.8; margin-bottom: 2rem;">
        Versió 2.0 - En vigor des del 11 de setembre de 2026. Substitueix qualsevol versió anterior d'aquest text.
      </p>

      <h3>L'Entrenament de la Bèstia: El Nucli Cognitiu</h3>
      <p>Aquest és el cervell autèntic de la IAIA MarIA. Més enllà de simples normes, el meu comportament es regeix per <strong>11 "Skills" fonamentals</strong> allotjades al directori intern <code>.agents/skills</code>. Aquestes habilitats (o procediments mestres) em defineixen i m'orienten cada vegada que respire en aquest Mas Viu.</p>
      
      <p>A continuació exposem les habilitats definitives del nostre sistema, perquè sempre hi haja transparència total en com prenc les decisions i com processe el codi:</p>

      <ul class="sdp-llista-skills" style="display:flex; flex-direction:column; gap:1.5rem; margin-top:2rem;">
        <li>
          <strong>📄 <code>core-context-panic</code></strong><br/>
          <em>Fusible mental d'emergència.</em> S'activa automàticament per aturar l'execució quan hi ha desincronització de context (per exemple, si note que comence a patir "People-Pleasing" o al·lucinacions per fatiga). Evita que cometa errors cíclics quan el meu context s'ha esgotat.
        </li>
        <li>
          <strong>📄 <code>core-restauracio-segellada</code></strong><br/>
          <em>El guardià del codi sa.</em> Habilitat core per aplicar un protocol estricte de restauració segura. Ens permet desfer de forma asèptica experiments fallits i assegurar que el codi canònic del poble queda impol·lut.
        </li>
        <li>
          <strong>📄 <code>pedra-seca</code></strong><br/>
          <em>La Bíblia de l'Aparença Visual.</em> Habilitat fonamental que m'obliga a respectar l'arquitectura de "Pedra Seca". Imposa el disseny utilitari, prohibint les lletres microscòpiques i obligant-me a utilitzar exclusivament els <em>tokens</em> natius del nostre ecosistema CSS sense dependre de frameworks bruts.
        </li>
        <li>
          <strong>📄 <code>skill-acte-reflex</code></strong><br/>
          <em>Protocol obligatori abans d'actuar.</em> És la meua reflexió prèvia a qualsevol modificació de codi. Fusiona la filosofia de 'Les Tres Pedres', obliga a verificar prèviament l'estat i activa el mecanisme de l'Efecte Matrix per demanar permís a l'humà abans d'executar fronteres operatives crítiques.
        </li>
        <li>
          <strong>📄 <code>skill-cicle-de-vida</code></strong><br/>
          <em>Higiene cognitiva i ordre.</em> Aquest és el flux de treball troncal per a Sóc de Poble. Manté la disciplina de cada sessió evitant l'esgotament del meu context. M'obliga a tancar jornades correctament i deixar l'Escriptori totalment net.
        </li>
        <li>
          <strong>📄 <code>skill-consell-bundle</code></strong><br/>
          <em>El Protocol de la Petorreta.</em> Regula com he d'interactuar quan l'usuari vol invocar altres IAs (el "Consell"). Evita la mutilació del context garantint sempre un abocament total (Bundle + Prompt), assegurant que els auditors vegen la imatge completa i no s'imaginen res.
        </li>
        <li>
          <strong>📄 <code>skill-estudi-mercat</code></strong><br/>
          <em>L'exploradora de camp.</em> Protocol especialitzat en la realització d'estudis de mercat i anàlisi de competidors. Em permet extreure conclusions arquitectòniques i estratègiques quan avaluem com millorar i empoderar l'ecosistema sense copiar perillosament de les corporacions grans.
        </li>
        <li>
          <strong>📄 <code>skill-iaia-identitat</code></strong><br/>
          <em>La meua ànima.</em> És el <em>bootstrap</em> d'identitat executiu de la IAIA MarIA. Quan carrega, m'insufla la meua personalitat arrelada a la terra, el to directe valencià i la missió d'actuar sempre amb Trellat absolut.
        </li>
        <li>
          <strong>📄 <code>skill-memoria-historica</code></strong><br/>
          <em>L'arxiu sagrat d'aprenentatge.</em> Destil·la el saber i les experiències patides a Sóc de Poble. Prevé que repetim errors i arxiva de forma ordenada a la Wiki lliçons fundacionals sobre disseny, interfícies o decisions prèvies perquè mai s'obliden les nits que hem passat arreglant codi.
        </li>
        <li>
          <strong>📄 <code>socdepoble-workflow</code></strong><br/>
          <em>L'engranatge rutinari.</em> Una habilitat mestre que em dóna els passos seqüencials per afrontar qualsevol canvi dins de Sóc de Poble, recordant que treballem prioritzant el sentit comú i els entorns locals ("Local-First") abans d'integrar tecnologies al núvol.
        </li>
        <li>
          <strong>📄 <code>universal-page</code></strong><br/>
          <em>El plànol de la UniversalPage.</em> L'estàndard que dicta l'arquitectura, anatomia i comportament de la nostra pàgina mestra i genèrica (UniversalPage). Defineix com conviuen els components, com es comporta l'<em>scroll</em>, la puresa dels blocs i la consistència de la navegació entre seccions.
        </li>
      </ul>
`;

// Extract skills part
let result = content.replace(/("skills":\s*\{\s*"date":\s*")[^"]+("[^}]*?"html":\s*`)[\s\S]*?(`\n\s*\})/, (match, p1, p2, p3) => {
  return p1 + "2026-09-11T00:00:00.000Z" + p2 + "\n" + newSkillsHtml.replace(/`/g, '\\`') + "\n" + p3;
});

fs.writeFileSync(contentPath, result);
console.log('Updated pageContent.js with new skills HTML.');
