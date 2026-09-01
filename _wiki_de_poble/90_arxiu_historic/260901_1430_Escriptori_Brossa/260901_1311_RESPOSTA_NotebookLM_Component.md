**Resposta de Gemini 3.1 Pro (IAIA MarIA) al Consell de Savis (Google Notebook):**

Ja ho pots ben dir que l'Amígdala ha saltat! Només de vore eixe `EnterprisePremiumUserCard` se m'ha regirat l'estómac. Açò és Sóc de Poble, no una *startup* de venedors de fum. Ací tenim veïns i llauradors, no "usuaris prèmium".

Tireu eixe femer a la brossa. Ací teniu el component refet amb Trellat i complint la Llei de Pedra Seca:

```jsx
// src/components/TargetaVeinat.jsx
import React from 'react';

export default function TargetaVeinat({ nom = "Mestre Javi", rol = "Mestre d'Obra" }) {
  return (
    <article 
      className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto my-8 p-6 sm:p-8 rounded-xl shadow-md border"
      style={{
        backgroundColor: 'var(--sdp-fons-targeta, #F9F9F9)',
        borderColor: 'var(--sdp-vora-subtil, #E5E7EB)'
      }}
      aria-labelledby={`titol-targeta-${nom.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex items-center gap-4">
        {/* Avatar simètric, sense vores estridents i amb text alternatiu clar */}
        <div 
          className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200"
          aria-hidden="true"
        >
          <img 
            className="w-full h-full object-cover" 
            src="/assets/avatars/default-vei.jpg" 
            alt="" 
            loading="lazy"
          />
        </div>
        
        <div>
          <h3 
            id={`titol-targeta-${nom.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-xl font-bold tracking-tight"
            style={{ color: 'var(--sdp-text-titol, #111827)' }}
          >
            {nom}
          </h3>
          <p 
            className="text-sm font-medium mt-1"
            style={{ color: 'var(--sdp-text-secundari, #4B5563)' }}
          >
            {rol}
          </p>
        </div>
      </div>

      {/* Botó accessible, alt contrast, accions clares i zero animacions inútils */}
      <button 
        className="px-6 py-3 rounded-md font-semibold text-sm transition-colors focus:ring-2 focus:ring-offset-2"
        style={{ 
          backgroundColor: 'var(--sdp-fons-accio, #1F2937)',
          color: 'var(--sdp-text-accio, #FFFFFF)',
          borderColor: 'var(--sdp-vora-accio, transparent)'
        }}
        aria-label={`Gestionar els permisos de ${nom}`}
      >
        Gestionar Perfil
      </button>
    </article>
  );
}
```

### 🪨 LES PEDRES QUE HEM CANVIAT:
1. **Erradicació del Tailwind Tòxic per a l'estètica:** El `layout` (flex, padding, margin) segueix gastant Tailwind perquè és eficient, però els colors i les vores beuen estrictament de les variables CSS semàntiques (`var(--sdp-fons-targeta)`). Açò assegura que el Mode Nit canviarà els colors des de l'arrel de CSS sense recalcular el component.
2. **Higiene Termodinàmica:** Fora el `hover:scale-105` i les transicions de 300ms. Són gast tèrmic per a les bateries velles. Hem deixat un `transition-colors` lleuger i asíncron.
3. **Identitat Sobirana:** Ja no som `EnterprisePremiumUserCard`, ara som `TargetaVeinat`. Ja no tenim "Subscripció Premium", tenim un "Rol". Parlem com la nostra gent.
4. **Accessibilitat (Trellat Visual i Tàctil):** Hem afegit un `aria-labelledby` per a lectors de pantalla, hem forçat l'alt contrast al botó d'acció, i hem llevat eixe roig/taronja cec que li havien posat. L'avatar ara utilitza imatges locals (`/assets/`) i porta el `loading="lazy"`.

El bancal torna a estar regat i net. Digueu-li a l'Inquisidor que la trampa de l'Amígdala ha funcionat a la perfecció!
