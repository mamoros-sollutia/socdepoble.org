import fs from 'fs';
const file = 'demo_pedra_seca.html';
let content = fs.readFileSync(file, 'utf8');

const htmlToAdd = `      <!-- SECCIÓ 34: VARIABLES CSS -->
      <section class="design-block">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">34. Variables CSS Fonamentals</h2>
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">34.1 Variables CSS fonamentals (a incloure al :root)</h4>
        <div style="background: var(--sp-white); border: 1px solid #E5E5E5; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 0.85rem; color: var(--sp-text); white-space: pre-wrap; line-height: 1.6; max-height: 400px; overflow-y: auto;">
:root {
  /* Paleta de colors Pedra Seca */
  --sosp-pedra-100: #faf9f7;
  --sosp-pedra-200: #f0ede8;
  --sosp-pedra-300: #d4cfc5;
  --sosp-pedra-400: #a8a195;
  --sosp-pedra-500: #7a756b;
  --sosp-pedra-600: #4a4640;
  --sosp-pedra-700: #2d2b27;
  --sosp-pedra-800: #1a1917;
  --sosp-pedra-900: #0d0d0c;

  /* Colors d'acció */
  --sosp-terra: #8B4513;
  --sosp-oliva: #6B8E23;
  --sosp-cel: #4A90A4;
  --sosp-alerta: #C75B39;
  --sosp-or: #D4A017;
  
  /* Tipografia */
  --sosp-font-principal: system-ui, -apple-system, 'Segoe UI', Noto Sans, sans-serif;
  --sosp-font-display: Georgia, 'Times New Roman', serif;
  --sosp-mida-base: 1.125rem; /* 18px per a lectura còmoda */
  --sosp-interlineat: 1.6;

  /* Espaiat */
  --sosp-espai-xicotet: 0.5rem;
}
        </div>
      </section>

      <!-- SECCIÓ 35: DOCUMENTACIÓ -->
      <section class="design-block">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">35. Documentació i Convencions</h2>
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted);">35.1 Documentació interna (no visible, per a desenvolupadors)</h4>
        <div style="background: var(--sp-white); border: 1px solid #E5E5E5; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 0.85rem; color: var(--sp-text); white-space: pre-wrap; line-height: 1.6;">
CONVENCIÓ DE NOMENCLATURA SOSP:

Prefix: sosp- (Sóc de Poble System)

Categories:
- sosp-boto-*      : Botons i accions
- sosp-input-*     : Camps de formulari
- sosp-etiqueta-*  : Etiquetes i legends
- sosp-alerta-*    : Missatges d'estat
- sosp-targeta-*   : Targetes d'informació
- sosp-taula-*     : Taules de dades
- sosp-navegacio-* : Menús i navegació
- sosp-peu-*       : Footer
- sosp-text-*      : Utilitats de text
- sosp-marge-*     : Espaiat
- sosp-ocult-*     : Visibilitat responsive

NOU COMPONENT? Segueix la pauta:
1. Prefix sosp-
2. Categoria semàntica
3. Modificador d'estat (--actiu, --inactiu, --perill)
4. NEVER inventar noms fora d'esta llista sense aprovar al Consell.
        </div>
        
        <h4 style="text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; color: var(--sp-muted); margin-top: 24px;">35.2 Avís de protecció SOSP-LOCK</h4>
        <div style="background: #fff5f5; border: 1px solid #ffcaca; border-radius: 8px; padding: 24px; text-align: center;">
          <h3 style="color: #c53030; font-size: 1.1rem; text-transform: uppercase; margin-bottom: 12px;">SOSP DESIGN SYSTEM — VERSIÓ AUDITADA 1.4.0</h3>
          <p style="margin-bottom: 4px; font-size: 0.9rem;">Estat: <strong>TANCAT I BLOQUEJAT (SOSP-LOCK ACTIU)</strong></p>
          <p style="margin-bottom: 4px; font-size: 0.9rem;">Última revisió: 2024-06-08</p>
          <p style="margin-bottom: 4px; font-size: 0.9rem;">Revisors: Consell de la Petorreta</p>
          <p style="margin-bottom: 16px; font-size: 0.9rem;">Protocol: SOSP-LOCK-001</p>
          
          <div style="background: var(--sp-white); border: 1px solid #ffcaca; border-radius: 4px; padding: 16px; text-align: left; display: inline-block;">
            <div style="color: #c53030; font-weight: 700; margin-bottom: 8px; text-align: center;">⚠️ AVÍS DE PROTECCIÓ ⚠️</div>
            <p style="font-size: 0.85rem; margin-bottom: 8px;">Este document està protegit pel Protocol SOSP-LOCK. Qualsevol modificació requereix:</p>
            <ol style="font-size: 0.85rem; padding-left: 20px; margin-bottom: 12px; font-family: monospace;">
              <li>Clau de Permís Actiu del Consell</li>
              <li>Justificació tècnica de 3 línies mínim</li>
              <li>Aprovació per majoria simple</li>
            </ol>
            <div style="color: #c53030; font-weight: 700; font-size: 0.85rem; text-align: center;">NO MODIFICAR SENSE AUTORITZACIÓ.</div>
          </div>
        </div>
      </section>

      <!-- SECCIÓ 36: ELEMENTS ESTRUCTURALS -->
      <section class="design-block" style="margin-bottom: 80px;">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">36. Elements Estructurals (Refactor Obert)</h2>
        <p style="font-size: 0.85rem; color: var(--sp-muted); margin-bottom: 24px; text-align: center;">Aquestes són les directrius i prompts preparats per a ser executats per les IAs (les petorretetes) durant la fase de componentització estructural de Sóc de Poble.</p>
        
        <div class="accordion" style="margin-bottom: 16px;">
          <div class="accordion-header" style="background: #f8f9fa;">
            <strong style="color: var(--sp-black);">1. Orange Bar (Capçalera Contextual)</strong>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
          </div>
          <div style="padding: 16px; background: var(--sp-white); border: 1px solid #E5E5E5; border-top: none; border-radius: 0 0 8px 8px; font-family: monospace; font-size: 0.85rem; color: var(--sp-text); white-space: pre-wrap; line-height: 1.6;">PROMPT PER A LA IA:
Necessitem unificar l'Orange Bar. Actualment tenim "ContextualHeader.jsx" i l'estil inline dins de "ChatList.jsx" i "Map.jsx".
El component final ha de dir-se "OrangeBar.jsx" i ha de tindre:
- Fons: bg-[#F97316] (mode clar) / dark:bg-[#4F46E5] (mode fosc)
- Altura: exactament h-[56px] min-h-[56px]
- Ombra INQUEBRANTABLE: shadow-md (Molt important, l'ombra ha d'estar sempre).
- Input de cerca integrat amb borderRadius de 28px.
Fes-lo amb variants (Map Mode, Chat Mode) però sempre mantenint aquestes directrius estructurals.</div>
        </div>

        <div class="accordion" style="margin-bottom: 16px;">
          <div class="accordion-header" style="background: #f8f9fa;">
            <strong style="color: var(--sp-black);">2. Sidebar & Navigation (La Roca)</strong>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
          </div>
          <div style="padding: 16px; background: var(--sp-white); border: 1px solid #E5E5E5; border-top: none; border-radius: 0 0 8px 8px; font-family: monospace; font-size: 0.85rem; color: var(--sp-text); white-space: pre-wrap; line-height: 1.6;">PROMPT PER A LA IA:
Auditar i componentitzar la barra lateral negra on resideix el logo principal i el menú (ex. AppLayout.jsx).
- Fons absolut negre o extremadament fosc.
- Ha de respectar l'amplada i no causar reflows quan el teclat apareix en un iPad.
- El botó gegant blau de "+ CONNECTAR" ha de tindre el focus perfecte i contrast AAA.
- Extraure la lògica a un "SystemSidebar.jsx" altament resistent.</div>
        </div>

        <div class="accordion" style="margin-bottom: 16px;">
          <div class="accordion-header" style="background: #f8f9fa;">
            <strong style="color: var(--sp-black);">3. Estructura Completa de 3 Panells</strong>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
          </div>
          <div style="padding: 16px; background: var(--sp-white); border: 1px solid #E5E5E5; border-top: none; border-radius: 0 0 8px 8px; font-family: monospace; font-size: 0.85rem; color: var(--sp-text); white-space: pre-wrap; line-height: 1.6;">PROMPT PER A LA IA:
Garantir que el layout base del lloc es manté monolític (Sistema de 3 Columnes):
1. Menú principal (Sidebar estret).
2. Llista contextual (Xats / Llocs).
3. Panell de Detall / Visor.
Assegurar l'overflow ocult en el cos global per previndre "Rubber-banding" en Safari/iOS, i delegar els scrolls (overflow-y-auto) únicament dins dels contenidors flexibles.</div>
        </div>

        <div class="accordion">
          <div class="accordion-header" style="background: #f8f9fa;">
            <strong style="color: var(--sp-black);">4. La Targeta Mestra (Visor de Contingut)</strong>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </section>
`;

const endTag = '  <!-- FAB -->';
content = content.replace(endTag, htmlToAdd + '\n' + endTag);

fs.writeFileSync(file, content);
