# Acta Marmota: Sessió Refactorització UniversalEditorShell (Fase 3)

## 📌 Què s'ha fet?
Hem completat amb èxit l'aïllament arquitectònic de l'`UniversalEditorShell`, assolint l'estàndard de Pedra Seca.

1. **Desacoblament TipTap (P3):** TipTap i la lògica de desat (amb debounce i guardat en `pagehide`) s'han encapsulat en `useUniversalRichText`, `UniversalRichTextToolbar` i `UniversalRichTextContent`. `NotesEditor.jsx` ha esdevingut exclusivament un adaptador de dades (host).
2. **Desacoblament de capçalera (P5):** S'ha inclòs el *debounce* i un `id` a `UniversalEditorShell.jsx` per tal d'evitar usar l'estat global, passant un `id` que re-munta el HTML del títol quan l'objecte actiu canvia.
3. **Compressió d'Imatges (P4):** S'ha afegit `compressImage` a `useHeroImageHandler.js` transformant a WebP (màx 600px/1200px) per a optimitzar la pujada d'imatges.
4. **Higiene del DOM (P7):** S'ha corregit el mètode de cerca del TOC dins de `PageFrame.jsx` per usar un `ref` en lloc de crides al document global.
5. **SEO Adapter (P6):** Creat `contentAdapter.js` per a extracció de metadades i sanejament agnòstic.

## 📦 Bundles
Hem netejat l'escriptori d'estudis antics, arxivant-los a `90_arxiu_historic`, i s'ha creat un nou bundle global més la seua *Petorreta* pel Consell per fer un stress-test d'estes últimes millores: `260913_0320_BUNDLE_auditoria.md` i `260913_0320_PETORRETA_EXCELENCIA.md`.

## ⏭️ Pròxims passos
1. Llançar la `PETORRETA_EXCELENCIA` a Qwen o Deepseek per confirmar la integritat del model Pedra Seca i cercar si queden traces de fugues de dependències.
2. Començar la implementació real de Supabase (Backend/Network) i assegurar-se que els models de persistència estan llestos un cop el component és modular i està garantit pel Consell.

## 🩺 Cirurgia Final (Consell de la Petorreta - 260913_0410)

S'han implementat les correccions definitives exigides per les 8 IAs auditores:
1. **Composició Invertida:** `NotesEditor` ara munta el `PageFrame` i injecta `UniversalEditorShell` pur, alliberant l'editor de responsabilitats d'enrutament de la pàgina.
2. **Caixa Única (CSS):** S'ha implementat el sistema rígid de capses `ues-root`, `ues-header`, `ues-scroll` i `ues-canvas` a `modules.css`, garantint el flexbox des de l'arrel per evitar col·lapses d'alçada.
3. **Protocol de Commit:** Refactoritzat `useUniversalRichText` per emprar *refs* per emmagatzemar el darrer esborrany i escoltar simultàniament a `pagehide` i `visibilitychange` sense llegir l'HTML destruit de ProseMirror, eliminant les fuites de memòria on el destruit intentava renderitzar o perdia el text en canviar notes.
4. **Acoblaments Eradicats:** S'han eliminat els "Barrel Imports" a l'Editor i s'ha convertit `onToast` en una propietat injectable amb comportament segur per defecte per evitar penjar la UI si Sollutia no posseeix eixe component global.
5. **DOMParser i Observadors:** El generador SEO ara usa l'API del navegador `DOMParser` de forma elegant en lloc de regEx bàsic. L'índex visual (TOC) usa un `MutationObserver` per actualitzar-se quan es tecleja dins l'editor.

Amb això, la refactorització assoleix per fi el veritable grau d'incrustabilitat exigit a l'Escriptori de Sollutia sense pèrdua de dades.
