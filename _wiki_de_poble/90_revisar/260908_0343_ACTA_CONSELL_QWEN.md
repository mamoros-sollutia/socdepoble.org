---
tipus: document
estat: esborrany
description: "🛡️ ACTA DEL CONSELL: VEREDICTE QWEN"
---
# 🛡️ ACTA DEL CONSELL: VEREDICTE QWEN

**Data:** 8 de setembre de 2026
**Estat:** NO-GO
**Font:** Qwen (via Mestre Javi)

---

## 1. Seguretat i Pedaços (OAuth i RLS)

**VEREDICTE: NO-GO (Risc Crític Teòric).**
Qwen emet un NO-GO basat principalment en riscos teòrics de l'estàndard web:
- **OAuth i Open Redirect:** Considera que l'ús combinat de `window.location.origin` i `sessionStorage` obri la porta a atacs d'Open Redirect i injecció si hi ha XSS. Recomana l'ús estricte del paràmetre `state` d'OAuth 2.0 i llistes blanques al servidor.
- **RLS i Disparadors:** Adverteix sobre el perill de `USING(true)` (tot i que ja sabem que no s'aplica a les dades privades ací) i avisa del risc que un superusuari desactive els triggers amb `session_replication_role = replica`.

## 2. Deute Tècnic: Monolits

**VEREDICTE: Cal refactoritzar (post-producció).**
Acepta el deute tècnic per a aquesta iteració per protegir la visual, però fa una recomanació molt forta cap a una arquitectura Monorepo (Turborepo/NX) a llarg termini per a extraure els components de `UniversalComponents.jsx`.

## 3. Pregunta Arquitectònica: Carpeta `03_Actuar`

**VEREDICTE: NO CREAR `03_Actuar` a la Wiki.**
Igual que Kimi, Dola, Grok i Gemini, Qwen prohibeix incloure codi executable a la Wiki per protegir el RAG (sistemes de recuperació). Suggereix mantindre els scripts a `tooling/` i usar un document índex (`03_Actuar_Index.md` dins de `02_Saber`) per a documentar-los sense duplicar codi.

## 4. Conclusió

S'alinea amb el NO-GO, tot i que els seus motius són amenaces teòriques estructurals més que defectes reals de codi (com els que va trobar Claude). Ens demana arreglar l'emmagatzematge de la URL de redirecció, auditar RLS i planificar el trossejament dels monolits.
