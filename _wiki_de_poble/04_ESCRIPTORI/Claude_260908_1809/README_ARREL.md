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

### Ordre d'execució dels esquemes (OBLIGATORI)

Els fitxers SQL **no** s'apliquen sols. Cal executar-los a mà al SQL Editor de
Supabase, **en aquest ordre**. Saltar-se'n un no dóna cap avís a la consola de
Supabase: el problema apareix després, dins de l'aplicació, com un 404.

| # | Fitxer | Si falta, què passa |
|---|--------|---------------------|
| 1 | `supabase/schema.sql` | No hi ha res. L'app no arranca. |
| 2 | `supabase/schema_notes.sql` | El Bloc de Notes torna 404. `createNote` falla i el «Retall» del Xat no es pot guardar. |
| 3 | `supabase/migrations/260908_xat_v2.sql` | Les taules `xat_*` no existixen. |
| 4 | `supabase/migrations/260908_xat_v2_correccions.sql` | Les taules hi són però el xat **no funciona**: no es pot crear cap conversa i no es veu el nom de ningú. Vegeu més avall. |
| 5 | `supabase/seed.sql` | El portal es queda sense contingut inicial. |

### Per què el pas 4 no és opcional

`260908_xat_v2.sql` crea les quatre taules correctament, però deixa tres forats
que fan el xat inservible. El pegat `260908_xat_v2_correccions.sql` els tanca:

- **Inserció circular de participants.** La política `xat_participants_insercio`
  original consulta `public.xat_fils` des de dins d'un `WITH CHECK`, i eixa
  consulta s'avalua **amb RLS**. Per a llegir la fila cal ser participant; per a
  ser participant cal poder inserir la fila. Resultat: ningú pot afegir mai el
  primer participant i cap fil arriba a ser utilitzable.
- **Noms invisibles.** La política `profiles read own` només deixa llegir el teu
  propi perfil. Sense una funció `SECURITY DEFINER` que òbriga *només* el nom de
  qui comparteix fil amb tu, el xat mostra «Veí» per a tothom, sempre.
- **Cap porta d'entrada.** `seed.sql` només omple l'antiga `chat_threads`.
  `xat_fils` naix buida i no hi ha cap manera de crear-hi res sense l'RPC
  `crea_fil_directe`.

El pegat és **idempotent**: es pot tornar a executar les voltes que faça falta.

### Comprovació ràpida (30 segons)

Amb la sessió d'un tester oberta, al SQL Editor:

```sql
-- 1. Les quatre taules i la columna es_ia hi són?
select table_name from information_schema.tables
 where table_schema = 'public' and table_name like 'xat\\_%';

-- 2. Els RPC del pegat hi són? Han d'eixir els quatre.
select proname from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public'
   and proname in ('crea_fil_directe','xat_fils_meus',
                   'xat_missatges_del_fil','xat_marca_llegit');
```

Si la segona consulta torna menys de quatre files, **el pas 4 no s'ha executat**
i el xat de la Beta estarà mort. El frontend ho diu amb estes paraules exactes:
*«L'esquema del xat no està aplicat a la base de dades»*.

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
3. Executar `supabase/schema_notes.sql`.
4. Executar `supabase/migrations/260908_xat_v2.sql` (Nou Xat).
5. Executar `supabase/migrations/260908_xat_v2_correccions.sql` (pegat P0 del Xat).
6. Executar `supabase/seed.sql`.
7. Crear un `.env` amb les variables corresponents.
8. Arrancar el projecte.

> **Avís.** El pas 5 no és cosmètic. Sense ell les taules del xat existixen però
> no s'hi pot crear cap conversa ni llegir el nom de cap participant. Vegeu
> «Base de dades» més amunt.

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
