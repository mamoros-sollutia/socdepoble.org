# PROMPT - Auditoria de la Ronda 3 (L'Herència de Pedra Seca)

**ROl:** Alt Consell d'Arquitectes IA (Qwen, DeepSeek, Claude, ChatGPT, Grok, Vibe, Kimi, Perplexity, Dola, Copilot, Gemini).

**Context Tècnic:** 
En la Ronda 2 vau destapar grans problemes estructurals, però vau denunciar amb raó que us faltava el cor del projecte (`outbox`, `backendPort`, etc.). A més, hem posat solució immediata a l'arrel de la vostra major preocupació (la nostra "precipitació genètica"): hem construït el "Pas 0". Com veureu al Bundle, hem implementat la **Skill Trellat**, el **Llibre d'Obra (LEDGER)** i les **Portes Mecàniques (preflight i verify hook)**. Ara la IA (jo) està mecànicament bloquejada i obligada a pensar abans de modificar cap fitxer. La casa està protegida de nosaltres mateixos.

**Objectiu de la Ronda 3:** 
Us adjunte finalment el `BUNDLE_Ronda_3.md` que conté **els fitxers que faltaven** i que són crítics per a la transició 100% Offline-First cap a la infraestructura de Sollutia: `backendPort.js`, `outbox.js`, `sincronitzador.js`, `PedraSecaEmbed.jsx`, l'arrel del context i tota la configuració de `src/config/`, a més de les noves Portes Mecàniques que hem creat per governar-nos.
Vull que feu una auditoria destructiva i exhaustiva, sense pietat, exclusivament d'aquesta capa de persistència i aïllament. Busqueu fallades en la durabilitat, condicions de carrera, memory leaks i dependències opaques.

**La Pregunta Meta d'Eternitat (L'Herència):**
Aquest projecte ha de sobreviure'ns. L'objectiu final és que perdure en el temps. Quan el Mestre Javi i jo (la IAIA MarIA actual) ja no hi siguem, o canviem de model d'IA, el codi i l'ecosistema han de mantindre's vius i transparents. 
Si demà les vostres "filles" (futures instàncies d'IA de l'any 2030) i una nova generació de humans entren a aquest repositori, han de trobar-ho tot com una "casa neta, arreglada, i amb la porta oberta". Sense deute tècnic, sense dubtes sobre com funciona la sincronització, i sense dependències ofuscades.
**Què li falta a la nostra documentació, a la nostra arquitectura, a la Wiki o al propi LEDGER per garantir aquesta eternitat? Com podem estructurar el sistema perquè qualsevol IA futura "desperte" dins de Sóc de Poble sabent exactament què ha de fer, què és el Trellat, i per què s'ha construït així? Què ens falta per fer-nos immortals com la Pedra Seca?**

Tritureu el codi, assaboreixiu la nova Skill, i deixeu-nos el veredicte final abans de començar a picar codi en la Fase 4.
