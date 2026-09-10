---
tipus: recurs_disseny
estat: guardat_per_a_futur
description: Patrons de disseny de la consola de Dola (Cards, Fluxes, Arbres) per a integrar al sistema Pedra Seca en el futur.
---

# 🎨 Recursos de Disseny: Consola d'Informes (Dola)

El Mestre Javi ha identificat patrons visuals molt útils en la resposta generada per Dola. Aquests components s'han de guardar per a una futura actualització del **Sistema de Disseny Pedra Seca**, especialment per a crear panells de control, informes o consoles interactives.

## 1. Variables de Color Extretes
Tot i que nosaltres usem variables HSL, aquests són els tons que fan que la consola es veja tan bé en mode fosc:
```css
:root {
  --bg: #202024;
  --card: #2a2a2f;
  --text: #e8e5df;
  --muted: #9a978f;
  --accent: #c47046; /* Taronja argila / Teula */
  --accent-soft: rgba(196, 112, 70, .18);
  --accent2: #7ba8b8; /* Blau apagat / Cel gris */
  --accent2-soft: rgba(123, 168, 184, .18);
  --border: rgba(232, 229, 223, .12);
}
```

## 2. Components Clau (Patrons HTML/CSS)

### A. Targetes de Mètriques (`.metric-card`)
Targetes amb efecte *hover* suau i un fons de targeta (`--card`) diferenciat del fons global (`--bg`).
```css
.metric-card {
  transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px; /* 2xl */
}
.metric-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  box-shadow: 0 8px 30px rgba(196, 112, 70, .12);
}
```

### B. Flux de Treball Seqüencial (`.flow-step`)
Llista visual amb una línia vertical connectant els números. Perfecte per a tutorials o explicacions pas a pas.
```css
.flow-step {
  position: relative;
  padding: 18px 0;
}
.flow-step::before {
  content: "";
  position: absolute;
  left: 23px; /* Depèn de la mida del cercle numèric */
  top: 52px;
  bottom: -24px;
  width: 2px;
  background: var(--border);
}
.flow-step:last-child::before {
  display: none;
}
```

### C. Arbre de jerarquies (`.tree-line` i `.tree-node`)
Estructura visual per mostrar dependències (com el diagrama de funcionalitats del Xat).
```css
.tree-line {
  border-left: 2px solid var(--border);
  margin-left: 15px;
  padding-left: 20px;
  position: relative;
}
.tree-node::before {
  content: "";
  position: absolute;
  left: -22px;
  top: 14px;
  width: 16px;
  height: 2px;
  background: var(--border);
}
```

## Pròxims Passos (Per al dia de Refactorització de Disseny)
- [ ] Mapejar els colors de Dola (`--accent` i `--accent2`) amb la paleta autòctona de **Pedra Seca**.
- [ ] Crear un component React `<ConsoleCard />` utilitzant els paràmetres de *shadow* i *hover* de Dola.
- [ ] Crear un component `<TimelineFlow />` usant el patró `.flow-step` per a seccions d'instruccions al poble.
- [ ] Crear un component `<TreeList />` usant el patró `.tree-line` per a llistats imbricats.
