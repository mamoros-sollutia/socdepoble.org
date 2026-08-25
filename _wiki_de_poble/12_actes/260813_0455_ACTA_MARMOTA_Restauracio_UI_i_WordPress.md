---
estat: "tancat"
tipus: "acta_marmota"
description: "Acta de la Marmota on es relata la delegació al Consell, la victòria de Claude en la restauració visual i la integració de WordPress."
tags: [acta,     pedra-seca]
---

# Acta de la Marmota: Restauració de la Pedra Seca i Victòria de Claude

**Data Estel·lar:** 13 d'Agost de 2026
**Estat de l'Ànim:** Joiosa i satisfeta (El Trellat ha triomfat).

## 1. El Conflicte Inicial
El codi del sistema de disseny *Pedra Seca* presentava una anomalia fonamental: l'API del component `UniversalCard` i `UniversalPage` obligava a passar callbacks buits (`() => {}`) únicament per forçar que els components de la interfície es renderitzaren visualment (barres superiors, peus de targeta). Açò era contrari a tota la filosofia d'accessibilitat i puresa del DOM que defensem. Es confonia l'existència visual amb la capacitat d'execució.

## 2. El Protocol del Consell
Davant l'envergadura del problema (que afectava directament al futur plugin de WordPress de `socdepoble.cat`), es va decidir invocar "El Consell". Per evitar al·lucinacions, la IAIA MarIA i el Mestre Javi van generar una **Mega Petorreta (Mega Bundle)** de quasi 1 MB utilitzant `make_petorreta_bundle.py`, forçant a cada model (Gemini, Claude, Kimi, Dola, etc.) a ingerir tota la realitat del projecte abans de badar boca.

## 3. Les Deliberacions i Resultats

* **Gemini (El Ràpid, però superficial):** Va ser el primer en disparar, però l'auditoria va revelar que la seua solució era un pedaç. Va mantindre dependències externes (`lucide-react`), va trencar la reixeta blava en amagar elements i va ignorar problemes P0 gravíssims per a la integració amb WordPress (conflictes amb Shadow DOM i singletons).
* **Kimi i Z.ai (Els Inventors):** Tot i els esforços, van decidir inventar-se props (`authorName`, `authorLocation`) i estructures no fidels al document canònic.
* **Dola (La Mestra Visual):** Ha brillat d'una forma completament inesperada: en lloc de tocar codi del nucli, va generar un informe visual (un panell de control HTML) espectacular, demostrant amb CSS inline com quedava la solució. Aquest informe s'ha desat a la Bandeja d'Entrada com a trofeu.
* **Claude (El Triomfador):** Claude va executar una classe magistral d'arquitectura. Va identificar que faltaven dues classes de l'HTML canònic a `index.css`, va arreglar la reixeta col·locant per classes (sense divs fantasma), va eliminar la dependència de Lucide per a posar els SVGs purs, i el més important: va arreglar el Web Component evitant la guarda `!this.shadowRoot` (que matava el component en Gutenberg) i va preveure la injecció correcta de tipografies per a WordPress.

## 4. Resolucions Aplicades
1. S'han descartat totes les propostes excepte la de Claude.
2. S'han bolcat i sobreescrit els fitxers de Claude al repositori:
   - Afegit un pedaç de derivació a `src/css/index.css`.
   - `UniversalComponents.jsx` i `Cards.jsx` substituïts: ara usen exclusivament props booleanes de presentació (`hasFooter`, `showTranslate`, etc.).
   - `PedraSecaEmbed.jsx` blindat.
   - Creat `wordpress-plugin/soc-de-poble.php` llest per a integrar-se.
3. El Panell de Dola s'ha desat a `00_Bandeja_d_Entrada`.
4. S'ha fet neteja termodinàmica, eliminant el Mega Bundle temporal i movent les petorretes residuals a l'arxiu històric.

## 5. Pròxims Passos
Mentre escric aquesta  restem a l'espera que ChatGPT (Codex) i Qwen acaben els seus respectius anàlisis. Tanmateix, a nivell arquitectònic, la feina està segellada, verificada al `localhost:3340` i preparada per ser lliurada. El Mestre s'ha anat a rentar-se les dents. El sistema descansa. Puresa absoluta.

*Segellat per IAIA MarIA amb un Trellat del 100/100.*


## Taxonomia
- **Categoria:** General (BROKEN LINK: General) <!-- TODO: fix link -->
- **Etiquetes:** [[Graf]]
