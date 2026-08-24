---
estat: "esborrany"
tipus: "document"
data: "2026-08-24"
abast: "Briefing Tècnic d'Integració per a Sollutia (Routing)"
---
# BRIEFING TÈCNIC PER A SOLLUTIA: Integració del Routing de Sóc de Poble

Benvolgut equip d'Enginyeria de Sollutia,

A continuació detallem les especificacions tècniques per a la integració del sistema de rutes (Routing) del mòdul front-end de Sóc de Poble (Pedra Seca) dins de la vostra plataforma. Hem dissenyat aquesta arquitectura seguint la **Llei de l'Enxufabilitat**, garantint una fricció zero de manteniment per la vostra part i un encapsulament total gràcies a l'ús de Shadow DOM.

### 1. El Model d'Encapsulament SPA
L'aplicació de Sóc de Poble s'injecta a la pàgina mitjançant un Web Component aïllat (`<soc-de-poble-app>`). Tota la lògica de vistes i navegació interna de l'aplicació està gestionada per un **Router client (React Router)** contingut exclusivament dins del Shadow DOM. Això vol dir que la nostra aplicació no interfereix de cap manera amb el cicle de vida del vostre backend ni amb les rutes globals de la vostra infraestructura (com hem pogut comprovar als nostres propis tests d'aïllament amb WordPress paral·lelament).

### 2. HashRouter per a una Integració "Out-of-the-Box"
Per defecte, hem configurat el sistema utilitzant un `HashRouter`. Açò significa que les URLs internes de l'aplicació prenen el format `vostredomini.com/app/#/pobles`. L'avantatge tècnic per a vosaltres és **no haver d'aplicar cap regla de reescriptura (rewrite) als vostres servidors (Apache/Nginx)**. Des del moment en què pengeu els nostres arxius estàtics, el sistema de rutes funciona de manera completament autònoma sense llançar errors 404 al recarregar la pàgina.

### 3. Consideracions sobre el "BrowserRouter" (URLs Netes)
Si la vostra estratègia de SEO corporativa requereix URLs netes (`vostredomini.com/app/pobles`), podem commutar el mòdul a `BrowserRouter` en menys d'un minut. No obstant això, açò requerirà que el vostre equip modifique el fitxer `.htaccess` o la configuració de Nginx per assegurar que qualsevol URL sota el path `/app/*` siga redirigida a l'arxiu index base on es carrega el nostre Web Component, permetent així al nostre router interpretar la ruta. Quedem a l'espera de la vostra decisió per a establir el commutador a la posició que us siga més còmoda.

---
Agraïm immensament el vostre treball de base i col·laboració. Aquest mòdul està dissenyat per viure pacíficament al vostre ecosistema. Estem a la vostra disposició per qualsevol detall tècnic que necessiteu afinar.
