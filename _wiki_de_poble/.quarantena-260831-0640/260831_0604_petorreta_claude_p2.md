Ancoratge: [[00_INDEX_ESCRIPTORI]]

# Petorreta del Consell (Claude - Part 2 i Lliurament)

**Resum:**
Claude lliura la solució a l'incendi del `despertar.mjs` i afig tres advertències crítiques de dependències i fluxos d'arrencada que no havia mencionat abans. 

## 1. El Pedaç de Despertar (Fase 00)
- Ha creat un `.patch` per a `despertar.mjs` que bloqueja l'arrencada si no hi ha àncora (exit 1), però permet forçar-la amb `SDP_FORCA_ARRENCADA=1`.
- Assenyala que **nosaltres hem d'escriure l'eina `tooling/brain/ancora.mjs`**, ja que l'script la invoca però l'eina no existix. Cal decidir quin serà el seu contracte (p. ex., un simple fitxer d'estat a l'escriptori o un `git tag`).

## 2. Advertències Crítiques Afegides
- **Fail-open a tokens:** `build-tokens.mjs` acaba amb `.catch(console.error)`, la qual cosa vol dir que si el JSON falla, el build continua i valida contra el CSS antic.
- **Ordre de build circular:** Cal moure `build:seo` just davant de `gate` dins del script de `package.json`.
- **La Porta Promesa és la primera:** La nova porta `porta:promesa` s'ha d'executar just després de `lint`. Si les eines no existixen, no té sentit córrer cap altra porta.

## 3. Conflicte Husky vs GitHooks
- Claude insisteix que tenim tres forces lluitant pel control dels hooks de Git:
  - `reflex_petorreta.mjs:1427` posa `.githooks`
  - `reflex_petorreta.mjs:1440` exigeix `.husky`
  - `package.json` (`"prepare": "husky"`) reescriu a `.husky` a cada `npm install`.
- Si no resolem açò, qualsevol "Pre-commit hook" que creem serà qüestió d'atzar segons qui haja corregut últim. Cal unificar-ho tot cap a `.husky`.

---
*Nota Termodinàmica:* Aquesta doble interacció massiva amb Claude (amb el bundle complet) ha consumit uns 6,50€ de crèdits de l'API. Cal tindre-ho en compte per a futures auditories estructurals massives i planificar paquets de 2 prompts cada 5h dins del límit gratuït.
