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

## Auditoria post-refactorització (260913_0345)

- Reparada la pantalla blanca: `PerfilShell` ja no nia dues closques de pàgina i l'editor té un únic contracte d'alçada i scroll (`flex`, `min-height: 0`, `overflow`) en la capa canònica de components.
- `UniversalEditorShell` cancel·la o buida els temporitzadors en `blur`, canvi d'identitat i desmuntatge; el `id` viatja amb cada escriptura per impedir desats creuats.
- `useUniversalRichText` usa callbacks actuals, conserva la identitat de la nota pendent i sincronitza canvis externs de contingut. El draft local continua sent la garantia efectiva davant `pagehide`; el desat remot asíncron no pot prometre entrega després de tancar la pàgina.
- Notes torna a passar `id`, estat, data, etiquetes i hora reals. Perfil torna a enviar els noms de camp del backend (`full_name`, `name`, `avatar_url`, `logo_url`, `description`).
- El TOC queda acotat al seu `contentRef`, genera identificadors únics per instància i els neteja. `contentAdapter` és el punt únic d'extracció de text de Notes i elimina HTML prohibit abans d'extraure text.
- Verificat visualment Notes i Perfil en escriptori i mòbil. Build web i lint dels fitxers afectats passen; 74/75 proves globals passen. L'única fallada és preexistent i fora d'abast: `UniversalCard.test.jsx` encara busca `.sp-card-time`, selector eliminat en canvis no relacionats d'`UniversalCard`.
- Veredicte: l'aïllament ha millorat, però `UniversalEditorShell` encara no és un plugin host-agnòstic pur perquè importa UI, avisos, imatges i CSS globals de Sóc de Poble. `PageFrame` sí que ha quedat lliure del router.
