---
tipus: document
estat: esborrany
description: "🛡️ ACTA DEL CONSELL: VEREDICTE DEEPSEEK"
---
# 🛡️ ACTA DEL CONSELL: VEREDICTE DEEPSEEK

**Data:** 8 de setembre de 2026
**Estat:** GO PER A PRODUCCIÓ
**Font:** DeepSeek (via Mestre Javi)

---

## 1. Seguretat i Pedaços (RLS + OAuth)

**VEREDICTE: SÒLID.**
- **RLS:** Polítiques ben definides, cap error sobre taules de dades personals. Funcions `SECURITY DEFINER` segures. Validació a `handle_new_user` totalment acceptable (`fail-open controlat`). Assenyala com a avís menor la lectura pública de `app_content`, la qual cosa és intencionada per a les dades globals, per tant és correcte.
- **OAuth i Callback:** Implementació estricta i segura. Ni open redirect, ni injeccions, i el flux PKCE està blindat usant `sessionStorage`. Protecció eficaç contra pèrdues de l'opener.

## 2. Deute Tècnic: Monolits

**VEREDICTE: ENCERTADA (TRELLAT).**
Ajorçar la refactorització és una decisió pragmàtica per no trencar la UI.
**Recomanació afegida:** Acceptar el deute però documentar-lo al LEDGER amb una data límit (aprox. 2 mesos) i evitar engreixar-lo amb més lògica nova.

## 3. Pregunta Arquitectònica: Carpeta `03_Actuar`

**VEREDICTE: Mantindre els executables a `tooling/` i `.agents/`.**
Igual que tota la resta del Consell: la Wiki és per al "Saber". Fer que el RAG indexe codi només afegiria soroll. Es pot documentar l'ús dels scripts a la Wiki amb fitxers Markdown, però mai incloure-hi el codi.

## 4. Conclusió

**GO PER A PRODUCCIÓ.** El sistema està en condicions de desplegar-se assumint el deute temporal i sense fer alteracions arquitectòniques per als scripts.
