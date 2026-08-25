import fs from 'fs';

const files = [
  'AGENTS.md',
  '.agents/AGENTS.md',
  'bot/index.mjs',
  'bot/cervell.mjs',
  'bot/cervell_bridge.mjs',
  'bot/whatsapp_baileys.mjs'
];

let content = `---
tipus: petorreta
estat: obert
---

# 🚀 PETORRETA AL CONSELL: LA GRAN IAIA MARÍA 50K (Auditoria i Context Total)

Aquest és un document "Petorreta" generat per Antigravity (la IAIA MarIA) destinat a ser llegit pel Consell (ChatGPT, Claude, etc.). Conté **TOT** el codi i context rellevant.

**Instruccions per a Javi:** Copia tot el text que hi ha per davall de la línia i apega'l a ChatGPT o Claude (si és massa llarg, divideix-ho o adjunta-ho com a fitxer .txt o .md).

---

> [!CONTEXT GLOBAL PER AL CONSELL]
> Sou el Consell. Sóc Javi, creador de *Sóc de Poble*, un ecosistema digital rural basat en l'arquitectura de "Pedra Seca" i la filosofia del "Trellat". El nostre objectiu és lluitar contra el despoblament rural (Repte Demogràfic) creant un "Territori Intel·ligent" a La Torre de les Maçanes que connecte la saviesa de la gent gran amb la tecnologia, sense dependre d'infrastructures invasives, conservant la privacitat i la identitat local.
> 
> He desenvolupat un Bot de WhatsApp anomenat "IAIA MarIA". Aquesta IA té visió (Gemini Flash) i capacitat de generar imatges (Imagen 3). Ja funciona increïblement bé: transcriu notes de veu de la gent major i genera dibuixos estil "Berlanga" de les seues fotos, i a més envia missatges intermedis per a fer l'espera agradable.
> 
> Estem preparant-nos per sol·licitar una **subvenció europea de 50.000€ per al Repte Demogràfic**. Necessite que el cervell de la IAIA siga tan espectacular i autònom que els beta-testers i els jutges al·lucinen.

### LA PETICIÓ AL CONSELL (Objectiu 50K)
Vull que actueu com els arquitectes d'IA més potents del món. Us passe TOT el codi del bot (Cervell, Pont i Adaptador de WhatsApp) i el nostre context arquitectònic. **Necessite una auditoria màxima i propostes per aconseguir els 50.000€.**

Necessite que em proposeu:
1. **Prompts del Sistema Revolucionaris:** Com estructurem la identitat de la IAIA perquè tinga "memòria episòdica" (sense trencar la privacitat) i siga una *veïna* que s'anticipa?
2. **Ampliació de Funcionalitats (Beta Wow Factor):** Tenint accés complet a text, veu i imatge, quines funcionalitats he de programar hui mateix per al·lucinar els betatesters?
3. **Discurs per a la Subvenció:** Com empaquetem aquest avanç tecnològic de manera que cride l'atenció del tribunal europeu de "Territorios Inteligentes"?
4. **Auditoria del Codi:** Reviseu el codi adjunt. Hi ha alguna vulnerabilitat, coll d'ampolla o millora d'arquitectura que hem de fer abans de llançar?

---

# CONTEXT I CODI FONT PER A L'AUDITORIA

`;

for (const f of files) {
  if(fs.existsSync(f)) {
    content += `\n## FITXER: ${f}\n\`\`\`javascript\n${fs.readFileSync(f, 'utf8')}\n\`\`\`\n`;
  }
}

fs.writeFileSync('_wiki_de_poble/05_Escriptori_Soc_de_Poble/260728_0220_PETORRETA_IAIA_50k_Consell_FULL.md', content);
console.log("Petorreta creada amb èxit!");
