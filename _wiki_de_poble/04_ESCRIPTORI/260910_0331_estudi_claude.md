# Estudi Claude: Auditoria Estructural
**Data:** 10 de setembre de 2026 (03:31)
**IA:** Claude
**Origen:** Petorreta d'Auditoria Estructural

# 🛡️ AUDITORIA ESTRUCTURAL · Seient Núm. 5

**Bundle:** `260910_0301_BUNDLE_auditoria_estructural.md`

429/429 fitxers verificats amb SHA-256. Zero discrepàncies.

**Els tres blocatges que has de saber ara mateix:**

1. **El xat no s'instal·la.** `260908_xat_v2.sql:120` crea una política que referencia `es_ia`, columna que només existix a partir de `correccions.sql:62`. Al SQL Editor això és rollback complet. I si l'executes sentència a sentència, `xat_missatges_insercio` és **l'única** política d'INSERT de missatges del projecte i cap fitxer posterior la recrea: xat de només lectura, sense error.

2. **`supabase/schema.sql` no existix.** Es referencia sis voltes, i una és un missatge d'error en temps d'execució. El tester falla al pas 1 del README.

3. **`npm run build:web` produïx una pantalla en blanc.** `main.jsx` només instancia `<soc-de-poble>` dins de `import.meta.env.DEV`.

I el que m'ha semblat més greu de tot: el pany de 5 segons de `backendPort.js` mata l'arrencada quan el chunk de Supabase tarda més d'eixe temps per xarxa. Has posat un temporitzador de rellotge de paret exactament al camí de la persona per a qui construïxes això.

El diagnòstic de fons: 45 portes, 28.368 línies de tooling contra 15.188 d'aplicació — **1,87:1** — i cap porta executa res. Totes llegixen text. Per això la deriva del contracte sí que es va detectar (és textual) i cap dels tres blocatges no.

**5,5/10.** Disseny 8,5, desplegabilitat 2. Els set arreglaments de la §7 no són arquitectònics i valen dos punts i mig.
