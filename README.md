---
estat: "canonic"
tipus: "index"
description: "Documentació canònica de Sóc de Poble."
---
# Sóc de Poble: Portal de Pobles Connectats
**The Civic Hosting Stack for Rural Resilience**

Sóc de Poble és una infraestructura digital cívica, concebuda i dissenyada mitjançant el Sistema de Disseny Pedra Seca.
El projecte empra un empaquetament com a Llibreria (UMD/ESM) per oferir una integració fluïda i resistent en qualsevol lloc web (especialment WordPress), utilitzant Supabase com a font única de veritat.

La missió és proporcionar una eina on l'intercanvi cultural federat i la comunicació cívica (alertes, agenda) puguen funcionar de manera resilients, àgils i directes per al món rural.

## Estructura

- `src/config/`: configuració global i helpers compartits.
- `src/sections/`: cada secció té el seu component, el seu `*Content.js` i, si cal, el seu `*Seed.js`.
- `src/data/`: capa de backend, agregació i persistència.
- `src/components/`: peces reutilitzables de UI.
- `src/styles/`: estils globals.

## Arrencar

```bash
npm install
npm run dev
```

La instal·lació només genera derivats ignorats i reproduïbles; no ha de canviar
`package.json` ni l'índex Git. S'exigeix l'ús de `npm` per al control estricte de dependències.

## Base de dades

El projecte usa **Supabase** com a base de dades remota canònica i font única de veritat.

## Documentació

Si vols entendre com està repartit el projecte i on tocar cada cosa, mira:

- [El Cervell Tècnic: Wiki de Poble](_wiki_de_poble/00_INDEX.md)
- [Regles de Seguretat i Agents](.agents/AGENTS.md)
- [Protocol de la Petorreta](.agents/PROTOCOL_PETORRETA.md)

## Modes de dades

L'app admet `VITE_DATA_MODE` per a poder provar sense trencar la web:

- `auto`
  Mode per defecte. Si hi ha Supabase configurat, intenta BD i, si falla, cau al fallback local. Si no hi ha Supabase, cau al seed local.

- `supabase`
  Força la lectura des de BD. El xat també intenta guardar-se en la BD.

- `hybrid`
  Intenta BD i, si falla, cau al snapshot local o al seed.

- `seed`
  Mostra dades del codi. Va bé per a demos o proves ràpides.

Passos mínims:

1. Crear un projecte a Supabase.
2. Executar `supabase/schema.sql`.
3. Executar `supabase/seed.sql`.
4. Crear un `.env` amb les variables corresponents.
5. Arrancar el projecte.

Exemple de `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_DATA_MODE=auto
```

Regenerar el SQL de dades seed és una mutació governada, que requereix el segell criptogràfic de `canonada.mjs`.

## Integritat de la Wiki

La integritat de la Wiki està garantida mitjançant un contracte rígid auditat abans de cada commit. Totes les notes han de complir amb un esquema reduït de 9 propietats YAML i cap arxiu operatiu pot quedar orfe sense un índex d'ancoratge.

## Privacitat i la "Gestoria de Poble"

Aquest repositori conté el codi i el cervell tècnic (`_wiki_de_poble`). L'arquitectura informàtica està totalment separada de la burocràcia del teu grup. 

Per a mantenir la privacitat dels documents de la teua associació o poble, hauràs de crear una carpeta **fora del repositori** i utilitzar-la com un "Vault" d'Obsidian independent per a arxivar la teua burocràcia, contractes, assumptes privats i multimèdia sense perill que es pugen a GitHub.

---

**Ancoratge de Seguretat:** [[00_INDEX]]
