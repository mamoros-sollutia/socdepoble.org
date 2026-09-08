# Pla d'Acció: Refinament de UI (Sopar del Mestre)

Mentre el Mestre sopa, aplicarem una sèrie de correccions estètiques i d'usabilitat a diverses pàgines de l'aplicació per garantir la coherència del sistema "Pedra Seca".

## 1. Reparació de Vistes "Desmuntades"
- **Multimèdia (`MultimediaSection.jsx`)**: Les imatges es mostren gegants. Cal aplicar una graella (`grid` o columnes) o restaurar la vista de targetes perquè les fotos tinguen una mida lògica.
- **Dispositius (`DevicesSection.jsx`)**: El disseny de la capçalera d'estat de connexió està trencat. S'han perdut les classes de contenidor i s'apilen els textos sense format. Es reconstruirà amb les classes de targetes de Pedra Seca.

## 2. Unificació a `UniversalPage` (Pàgines a mig fer)
Les següents seccions encara mostren un disseny bàsic ("nu") i s'han d'embolcallar amb el component `UniversalPage` per complir amb l'estàndard:
- **Cerca (`CercaSection.jsx`)**
- **Traduccions i Llengua (`LanguageSection.jsx`)**
- **IAIA / Realitat (`RealitatSection.jsx`)**

## 3. Ajustos a la Capçalera (TopBar)
Segons la instrucció del Mestre:
- **Traducció**: El botó de traduir de la barra s'eliminarà o s'ocultarà, ja que la traducció del contingut la fa Google automàticament i no el nostre sistema manual de 5 idiomes.
- **Comentar**: S'assegurarà que en fer clic al botó de comentar, redirigisca al Xat de l'autor (per defecte `/xat`).

## 4. Millores Pendents
- **Skills i Disseny**: Es farà una revisió visual per millorar-ne la llegibilitat.
- **Mur**: Es deixa apuntat l'estudi per separar la zona de filtres (Mostrar tot, Esdeveniments, Mapa) cap a un sistema d'etiquetes molt més complet i visualment aïllat en el futur.

## Estat de l'Execució
- `[x]` Fixar Multimèdia
- `[x]` Fixar Dispositius
- `[x]` Migrar Cerca a UniversalPage
- `[x]` Migrar Traduccions a UniversalPage
- `[x]` Migrar Realitat a UniversalPage
- `[x]` Ajustar botons de la TopBar (Traduir amagat, Comentar envia al xat, panell de control propi de xat creat)
