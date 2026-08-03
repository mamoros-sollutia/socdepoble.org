---
estat: canonic
tipus: plantilla
description: "Guia la definició de marca, narrativa, identitat visual i criteris de coherència."
temes:
- sistema
tags:
- dev
- maquina
- socdepoble
- tecnica
---
# Plantilla de Branding (Sóc de Poble)
**Categoria:** Plantilla
**Data:** 2026-06-19
**Hora:** 14:30

---

## LOGOS OFICIALS (Font de la Veritat)
Els únics logos vàlids per al projecte s'ubiquen a `public/assets/system/ui/`. Quan s'invoquen des del codi Font/HTML, la ruta és `/assets/system/ui/...`:
- **Quadrat Verd (Icones/Avatars):** `/assets/system/ui/logo-socdepoble-cuadrat-verd.svg`
- **Rectangular Blanc (Per a Dark Mode):** `/assets/system/ui/logo-socdepoble-rect-blanc.svg`
- **Rectangular Negre (Per a Light Mode):** `/assets/system/ui/logo-socdepoble-rect-negre.svg`
- **Rectangular Estàndard:** `/assets/system/ui/logo-socdepoble-rect.svg`

## MISSIÓ DEL PROTOCOL
Recursos mestres per a forçar la consistència en tot el contingut generat (disseny, text i estructura). Aquest protocol és el filtre sagrat abans de qualsevol acte.

## 1. ESTIL VISUAL (JSON)
```json
{
  "project": "Sóc de Poble!",
  "palette": {
    "primary": "rgb(255, 115, 0)",
    "secondary": "rgb(9, 132, 227)",
    "tertiary": "rgb(0, 0, 0)",
    "neutral": "rgb(255, 255, 255)"
  },
  "typography": {
    "headings": "Roboto",
    "body": "Roboto",
    "base_size": "19px"
  },
  "geometry": {
    "radius_card": "28px",
    "radius_button": "18px"
  }
}
```

## 2. GUIA DE TEXTOS (EL TO DE LA TIA MARIA)
- **Estil:** Directe, didàctic, honest i sense "fum" comercial.
- **Vocabulari:** Usa paraules de la terra com "Trellat", "Pedra Seca", "Oli Suau".
- **Prohibit:** Evitar paraules buides com "revolucionari", "disruptiu" o "solució integral". Parlem de veïns, no de clients.

## 3. REGLES TÈCNIQUES
- **Mobile-First:** La botiga de diumenge es mira al mòbil.
- **Codi Net:** Preferència per Vanilla CSS i components modulars.
- **Accessibilitat:** Contrast alt per a llegir sota el sol de l'horta.
- **Protocols de Color:**
  - **Primary:** rgb(255, 115, 0) (Color Taronja principal per a identitat i botons primaris)
  - **Secondary:** rgb(9, 132, 227) (Color Blau per a elements secundaris)
  - **Tertiary:** rgb(0, 0, 0) (Color Negre per a contrasts forts o fons de targeta)
  - **Neutral:** rgb(255, 255, 255) (Color Blanc per a fons generals o text en mode fosc)

---
_Fent poble amb [[el_projecte|Sóc de Poble]]! © 2026_

---


## Taxonomia
- **Categoria:** [[Maquina]]
- **Etiquetes:** [[Graf]]


**Ancoratge de Seguretat:** [[00_INDEX]]


---
**Categoria:** [[07_plantilles]]
**Relacionat:** [[00_arquitectura_tecnica_unificada]], [[00_INDEX]]
**Ancoratge de Seguretat:** [[00_INDEX]]
