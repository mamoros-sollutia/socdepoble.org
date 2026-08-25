import { defineCustomElement } from './PedraSecaEmbed';

defineCustomElement();

// Per a l'entorn de desenvolupament local de Vite, simplement
// instanciem l'element personalitzat al DOM, igual que faria WordPress.
const arrel = document.getElementById('root');
if (arrel && !arrel.innerHTML) {
  const element = document.createElement('soc-de-poble');
  // Afegim una configuració mock per a dev local i l'atribut de fonts
  element.setAttribute('fonts-href', '/src/assets/fonts/noto-sans.css');
  element.setAttribute('config', JSON.stringify({
    pluginUrl: '/',
    supabaseUrl: (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_SUPABASE_URL : '',
  }));
  arrel.appendChild(element);
}
