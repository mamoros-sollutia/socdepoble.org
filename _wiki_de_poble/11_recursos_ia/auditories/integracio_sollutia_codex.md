---
estat: "actiu"
tipus: "auditoria"
description: "Directrius arquitectòniques per a Codex / Equip Sollutia sobre l'enrutament de Pedra Seca."
---

# Informe d'Integració: Enrutament i Frontend SEO

A l'atenció de **Codex / Equip de Desenvolupament de Sollutia**:

Hem actualitzat l'arquitectura del frontend "Pedra Seca" per garantir que funciona de manera autònoma i genera un SEO excel·lent. Per aconseguir-ho, hem deixat enrere l'enrutament en memòria (que ofuscava les URLs) i hem implementat un **enrutament natiu de client (React Router - BrowserRouter)** quan el component s'inicia fora de l'entorn clàssic del plugin de WordPress.

### Què significa això per a Sollutia (Backend / Core)?

Atès que l'aplicació ara utilitza rutes reals del navegador (ex: `/mur`, `/projecte`, `/xat`), el vostre servidor (Core / Fork de Sollutia) ha de donar suport a l'enrutament Single Page Application (SPA).

**Requisit d'Infraestructura:**
Qualsevol petició asíncrona GET que reba el vostre servidor i que **no** coincidisca amb un recurs físic (p. ex. imatges, CSS, JS), ha de retornar obligatòriament el fitxer HTML arrel on està incrustat el `<soc-de-poble>`.

Exemples de regles de reescriptura (URL Rewrites) segons la tecnologia del vostre Core:

**Si feu servir NGINX:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Si feu servir Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Detecció Automàtica d'Entorn
No cal que canvieu res al client. L'aplicació Pedra Seca està programada per a detectar de quin entorn prové (via la variable `pluginUrl`).
- Si detecta que s'executa a l'interior d'un `wp-content/plugins` clàssic, recularà de manera segura al `MemoryRouter` per evitar trencar el CMS.
- En el vostre sistema "Core" independent, utilitzarà el `BrowserRouter` automàticament i prendrà el control de la navegació, generant URLs amigables (SEO-friendly).

### Consideracions de Futur
Aquest sistema manté l'aïllament total entre la visualització (Pedra Seca) i la base de dades (Sollutia). Mantingueu aquest document com a referència base en cas de qualsevol refactorització del servidor. L'objectiu és compartir dades estructurades via API/Supabase mentre React maneja l'experiència local completa (preparant el terreny per al futur Offline-First).
