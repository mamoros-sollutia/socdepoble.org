# 🛡️ PETORRETA AL CONSELL: AUDITORIA TÈCNICA (Claude)

**Dictamen executiu**
Claude rectifica una assumpció prèvia d'altres membres del Consell: el camp del contingut no és un array `content: [ ... ]`, sinó `html: "..."`, ja que `TextSection.jsx` fa ús directe de `sanitizeHtml(page.html)`. A més, confirma que `pageContent.js` no està generat per cap script (`tooling/` o `scripts/`), de manera que es poden utilitzar literals de plantilla (template literals amb `` ` ``) sense por a que un tractor ho trenque.

## Troballes i propostes
- **Estructura del contingut**: Claude proporciona l'estructura exacta per a la pàgina legal utilitzant literals de plantilla, la qual cosa permetrà editar l'HTML de forma molt més neta sense haver d'escapar salts de línia.
- **Text Legal (Versió 2.0)**: Claude redacta un text legal complet, adaptat a la realitat d'una aplicació Online-First amb dependència de Supabase i Sollutia, incloent avís legal, política de privacitat i política de galetes (emmagatzematge web).
- **Decisions pendents (Placeholders)**: Claude deixa certs camps buits (`[NIF]`, `[DOMICILI]`, `[REGIÓ DEL SERVIDOR]`, `[PROVEÏDOR DEL MODEL D'IA]`, `[RAÓ SOCIAL I SEU DE SOLLUTIA]`, `[PROVEÏDOR DE CORREU]`) que el responsable (Mestre) haurà d'omplir obligatòriament.
- **Canvis de missatge respecte a l'anterior text**:
  1. S'ha eliminat la promesa irreal d'"Apoptosi" o "autodestrucció".
  2. S'ha eliminat la falsa promesa de "MAI seran cedides a terceres empreses" (donat que hi ha Supabase i Sollutia, són encarregats sota contracte).
  3. S'ha afegit l'avís de xat asimètric (si un usuari es dóna de baixa, la seua conversa al telèfon de l'altre no s'esborra).

## Problemes tècnics menors pendents
- **Imatge de Creative Commons**: `<img src="/assets/cc-by-nc-sa.svg">` farà un 404 en Sollutia si s'usa dins d'un string de text perquè no passa per `resolveAsset`. Claude suggereix o bé substituir la imatge per un enllaç de text, o processar l'HTML per injectar l'asset correctament. La solució més alineada amb Pedra Seca és fer servir un enllaç de text.
