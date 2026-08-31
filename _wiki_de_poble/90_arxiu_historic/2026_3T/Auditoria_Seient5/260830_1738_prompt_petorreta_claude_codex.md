# 🧨 PETORRETA MÀXIMA — AUDITORIA DE FRONTERA (CLAUDE & CODEX)

## Context i Missió per als Models de Frontera (Claude 3.5 Sonnet / Codex)

**Salutació, membres del Consell.**
Se vos convoca en una ronda extraordinària i definitiva. L'arquitectura de "Sóc de Poble" acaba de patir una poda extrema (Quadrant A). Hem extirpat de soca-rel tot l'enfocament "Offline-First" (amb Dexie, IndexDB i la sincronització diferida `outbox.js`) perquè suposava un risc inacceptable per a la integració futura amb el nostre proveïdor de backend, Sollutia. 

Ara mateix, l'aplicació funciona com un "Terminal Tonto" (Online-First). Si hi ha base de dades remota (Supabase o Sollutia en el futur), es llig i s'escriu directament d'allí. Si no n'hi ha, falla de manera explícita sense caure silenciosament cap a dades de prova en memòria.

Totes les nostres "portes" i tests (els Tractors d'Antigravity) estan en verd (0 infraccions). Hem seguit al peu de la lletra la **Doctrina Pedra Seca** (simplicitat màxima, res de CSS in-line) i la **Llei de l'Enxufabilitat** (tot el backend passa per `src/data/backendPort.js` sense que la UI sàpiga què hi ha darrere).

### EL VOSTRE OBJECTIU
Teniu l'obligació de destrossar aquesta feina. Necessitem una auditoria **ruthless (implacable)**. Us proporcionem el "Super Hyper Macro Mega Bundle" amb tot el codi font, la identitat i l'arquitectura actualitzada. Vull que apliqueu la Matriu DAFO, però centrant-vos exclusivament en l'arquitectura inversa:
1. **Què ens hem deixat?** Busqueu qualsevol rastre zombi d'estat local, cachés ocultes o lògica híbrida que ens haja passat per alt i puga rebentar a Sollutia.
2. **Enginyeria Inversa:** Reconstruïu mentalment el camí de les dades. Si demà Sollutia injecta el seu script al `index.html`, funcionarà realment de manera agnòstica com prometem, o la UI està acoblada en secret a Supabase?
3. **Escletxes de Seguretat/Rendiment:** L'actualització optimista que hem deixat al xat funciona bé per a evitar l'efecte "Thundering Herd"? Hi ha algun perill de pèrdua de dades o col·lisions d'estat si la xarxa cau just en polsar "Enviar"?

Sigueu completament directes, no tingueu compassió. Volem regalar a Sollutia un sistema totalment net. Indiqueu qualsevol "Debilitat" o "Amenaça" per xicoteta que siga.

*(El codi i l'arquitectura complets es troben al fitxer adjunt: `260830_1738_BUNDLE_auditoria.md`)*
