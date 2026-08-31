# 🧨 ÚLTIMA PETORRETA ABANS DE DINAR — CONSELL DE LES IA

Membres del Consell (Qwen, Deepseek, Dola, Kimi, Claude, Perplexity, Mistral Vibe, Grok, Gemini, Copilot, ChatGPT i Zeta):

Us exigisc TOTS ELS VOSTRES TOKENS per a aquesta última avaluació abans d'anar a dinar i tancar el Quadrant 1 per sempre. No vull resums amables, vull que entreu a fons. La IAIA MarIA ha executat el Pla de Xoc per a Saldar el Deute Tècnic que heu assenyalat. 

S'han abordat els punts crítics:
1. **React Versioning**: Downgrade a `18.3.1` per evitar el conflicte mortal de renderitzat amb `wp-element` i `useFormStatus` de la versió 19.
2. **XSS Sanitization a `NotesSection.jsx`**: Verificat l'ús de `DOMPurify` dins del wrapper `sanitizeHtml` per garantir que tots els `dangerouslySetInnerHTML` són segurs davant qualsevol aportació d'usuari a les Notes.
3. **Vite Build Fix**: Eliminada tota la dependència de `import.meta.env` dins de `src/data/supabaseBackend.js`, delegant la configuració al `host.js` per a evitar trencaments en el mode standalone de WordPress.
4. **Backend Injection i Llei de l'Enxufabilitat**: Refactoritzats `backendPort.js` i `host.js`. L'arrencada ara es fa en dos temps, permetent a qualsevol agent (com Sollutia) injectar la seua implementació asíncronament abans de llançar l'aplicació. Ja no forcem la càrrega rígida de Supabase.
5. **SEO Dinàmic 404 (L'Apagada Digital)**: S'ha modificat el `sdp-seo.php`. Ara quan una ruta no existeix estàticament a `seo-routes.json` però encaixa amb un patró dinàmic conegut pel sistema, el plugin de WordPress cedeix un HTTP 200 en lloc de forçar un 404. L'app i React Router s'encarreguen de resoldre la ruta dinàmica i el contingut de SEO pertinent (mitigant l'error de pàgina buida).
6. **Contract Tests per Sollutia**: Afegeix mock test object per demostrar el patró d'inserció de backend.
7. **Ampliació API Embed**: `getCurrentUser()`, `on(event)`, i `setTheme()` oberts directament sobre `PedraSecaEmbed.jsx` per a un control més potent des de qualsevol wrapper host de WordPress o aplicació tercera.
8. **Seguretat E2E de l'Outbox**: Passades totes les validacions d'estat de les cues (11 de 11 als Tractors de l'Outbox).

## INSTRUCCIONS PER AL CONSELL:
Auditeu sense pietat aquest **Bundle de Poda Definitiva**. Busqueu els errors o scripts que hagen pogut quedar trencats. Identifiqueu qualsevol rastre de deute tècnic residual que haja sobreviscut a aquesta passada. No hi ha marge per al "tot està bé" si no és una realitat tècnica indiscutible. Preparem la integració final amb Sollutia; no podem avançar amb la meitat de la casa plena de brossa.

Vull auditories basades en la *Actitud DAFO* i el model de *Les Tres Pedres*. Endavant.

[**Adjunteu a aquesta petició l'arxiu:** `_wiki_de_poble/05_Escriptori_Soc_de_Poble/260830_1602_BUNDLE_auditoria.md`]
