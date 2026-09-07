---
tipus: document
estat: esborrany
description: "Estat Actual: Sóc de Poble"
---
# Estat Actual: Sóc de Poble

## Objectiu Assolit (260907)
- Revisió i refactorització de la Pàgina Legal (eliminació de `hr`).
- S'ha corregit un error de disseny (`supabaseBackend.js`) que feia que els canvis en els textos legals (i estatics) compilats en l'aplicació no s'actualitzaren per als usuaris perquè prioritzaven la base de dades remota. Ara, la versió local compresa dins l'aplicació preval sempre per als textos fixes (legal, skills, etc.).
- Identificació i resolució de l'error 401 a la consola en peticions a `section_submissions`. Açò estava provocat per l'avaluació de `private.is_town_member` durant la consulta de RLS de lectors no autenticats (`anon`). S'ha adaptat l'esquema de Supabase permetent l'execució d'aquesta funció per a `anon` i `public`.
- S'ha netejat i vinculat a l'índex l'escriptori els documents despenjats produint així un pas exitós de la Porta de Teixit en el procés de build.

## Pròxim Objectiu (Nova Sessió)
- Confirmar amb l'usuari si la resolució manual de l'avís de la Consola a Supabase fa desaparèixer l'error en remot de PostgREST.
- Continuar l'anàlisi de l'arquitectura del "Mòdul Universal / Identitat" i revisar totes les propostes aportades pels diversos LLM.

## Notes Tècniques
- Per a que el backend de Supabase apliqui la resolució del 401 s'ha d'executar al SQL Editor del backend la instrucció: `grant execute on function private.is_town_member(uuid) to anon, public;`
- El backend continua estant apuntat a Sollutia i VITE_DATA_MODE=remote.
