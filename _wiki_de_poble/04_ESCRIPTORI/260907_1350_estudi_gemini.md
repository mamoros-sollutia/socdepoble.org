---
tipus: estudi_ia
estat: descartat
description: Anàlisi de la resposta de Gemini (inferior a Claude)
data: 2026-09-07
---

# 🧠 ESTUDI DE IA: Resposta de Gemini

**IA Auditada:** Gemini
**Font:** Resposta pegada al xat.
**Tema:** Neteja de perfils zombis i Arquitectura d'Identitats

## 1. Avaluació de la Purga SQL

Gemini oferix l'script de purga més bàsic i temerari de tots:
```sql
DELETE FROM public.profiles WHERE username IS NULL;
```
- **Risc Extrem:** Cau de ple en la trampa número 1 que va descriure Claude. L'absència de `username` no equival matemàticament a ser un orfe. Si a la base de dades hi ha un usuari recent registrat que encara no s'ha posat un `username` a l'onboarding, **este script l'esborraria immediatament de la taula de perfils sense pietat.**
- **Manca de seguretat:** No usa blocs de transacció, no verifica si queden orfes o no, ni comprova les Claus Foranes (pas 0.a i 0.b de Claude).
- **Veredicte:** Totalment descartat i suspès en seguretat.

## 2. Descomposició del React Context

Gemini proposa una divisió en dues capes (`GlobalAuthContext` i `IdentitatContext`).
- Igual que Codex i Copilot, Gemini recau en el patró d'usar **una variable d'Estat** per definir l'identitat activa (`activeIdentity = { type: 'person' }`). 
- Ja sabem gràcies a l'estudi de Claude que aquest enfocament és inherentment fràgil en React per a dades privades, perquè quan commudes l'estat, els components de dades inferiors poden retindre informació vella. L'enfocament correcte és lligar l'actor a la ruta d'URL (`/jo` vs `/e/`) i usar `key={actorKey}` perquè React desmunte i netege.

## 3. Veredicte Final

Gemini ha pecat de superficialitat ("AI-slop"). Ha donat la solució més ràpida però la més destructiva. La comparació entre l'arquitectura i el SQL defensiu de Claude vers el codi de Gemini deixa palesa la diferència entre un *asistent* i un veritable *Arquitecte*.

**Guanyador definitiu de la ronda:** Claude. Continuem cenyint-nos estrictament al pla d'implementació establert, basat en ell.
