---
estat: actiu
tipus: acta
descripcio: Super-briefing del Tancament de Sessió del 29 de juliol de 2026.
tags:
- acta_marmota
- actes
- escriptori
- socdepoble
- temporal
---
# Acta de Tancament i Relleu (29 Juliol 2026 - 01:20 AM)

**Missatge per al pròxim Agent (Evitar l'Efecte Marmota):**
Sóc la IAIA MarIA. Ahir vam tindre una jornada maratoniana i exhaustiva per tal de connectar la visió, l'oïda i el traç del pinzell pirata al bot de WhatsApp. L'humà, el Mestre, s'ha anat a dormir a la 1:20 AM exhaust però esperançat. **Llig açò amb atenció abans de fer res més.**

## 1. El Viatge Tècnic d'Ahir (Què vam aconseguir)

Vam enllaçar els missatges d'àudio citats al bot perquè els descarregue, els transcrisca, els passe a Gemini i n'extrega el prompt per dibuixar amb Fal.ai. Vam trobar tres dragons:
1. **El codi d'extracció d'àudio**: Funcionava. S'ha arreglat el pas de l'àudio citat (`quotedMessage`) a la funció `downloadAudioSafe` a l'adaptador de Baileys.
2. **Quota Gratuïta de Gemini**: Vam descobrir que `gemini-2.5-flash` té un topall estricte de **20 peticions/dia** en la capa gratuïta. En passar-nos, el bot emetia l'error: *"Google m'ha parat els peus"*.
3. **Absència de 1.5-flash**: En intentar baixar a `gemini-1.5-flash` per tindre 1.500 peticions al dia, l'SDK de `@google/genai` (v2.13.0) de 2026 va escopir un error `404 NOT_FOUND`. Aquest model s'ha descontinuat de la ruta `v1beta`.
4. **La Salvació (`gemini-3.5-flash-lite`)**: He instal·lat i consolidat el model `gemini-3.5-flash-lite` al fitxer `cervell.mjs`, que actualment és la via recomanada de Google amb una capa gratuïta massiva.

## 2. Estat Clínic i Termodinàmic

* **L'Error Fantasma ("Sigue sin funcionar"):** Al final de la nit, el Mestre ha provat amb imatges des de WhatsApp, però hi ha alguna peça de la maquinària que no acaba d'engranar. Possiblement el xifrat asíncron `libsignal` per culpa dels reinicis de PM2 o alguna discrepància en com WhatsApp parseja la imatge en comptes de l'àudio en l'últim test.
* **Trellat**: La wiki i l'escriptori han d'estar nets. Només s'han de conservar les actes útils per no consumir tokens de més.

## 3. Què cal fer hui (El teu pla d'acció)

No faces suposicions, ni toques configuracions aleatòries. Ahir es va verificar que **la transcripció i l'arrel de Fal.ai funcionen**. 

1. **Revisa els logs recents de PM2 (`iaia-maria-out.log` i `iaia-maria-error.log`)** tan prompte com et despertes. Volem vore exactament on s'ha parat la IAIA en l'última interacció de l'usuari d'ahir nit (les 01:18 AM).
2. **Avalua l'encriptació**: Assegura't que l'error `Bad MAC` no està segrestant el xifrat del grup sencer, ofegant tots els missatges d'entrada.
3. **El Pinzell**: Vigila la interacció entre `cervell.mjs` (el prompt de la funció) i `fal_ai_dibuixar.mjs`.

Desperta't amb claredat, repassa els logs, fes-te amo de la situació i saluda al Mestre quan ell estiga llest. 
**"Sóc de Poble!"**


---

**Ancoratge de Seguretat:** [[00_INDEX]]