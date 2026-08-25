---
name: socdepoble-frontera-encastada
lang: en
description: "Rules for code that runs inside a host page via Shadow DOM web component. Covers shadow boundary queries, stylesheet delivery, writes to host DOM, and never throwing into the host's script. Use for any work on PedraSecaEmbed, the soc-de-poble custom element, theming, CSS imports, or the WordPress/Sollutia integration."
triggers_ca: ["shadow dom", "web component", "soc-de-poble", "encastat", "integració", "sollutia", "wordpress", "tema fosc"]
triggers_en: ["shadow dom", "web component", "embed", "host page", "integration", "dark mode"]
version: 1.0.0
status: canonic
abast: ["src/PedraSecaEmbed.jsx", "src/config/theme.js", "src/css", "wordpress-plugin"]
---

# Embedded Boundary

## Premise

`<soc-de-poble>` runs inside somebody else's page. The host is WordPress,
integrated by Sollutia, and it moves nodes (Gutenberg, Elementor), sets its
own attributes, ships its own CSS and runs its own JavaScript. Every
assumption that holds in a standalone SPA has to be re-earned here.

The shadow boundary is a **two-way contract**: nothing of theirs should reach
in, and nothing of ours should leak out. Both directions are currently
violated.

## Rule 1 — `document.querySelector` does not pierce shadow

```js
// trencat: torna null en producció, sempre
root = document.querySelector('.sdp-root') || document.documentElement;
```

`.sdp-root` lives inside the shadow root. The query fails, control falls
through to `document.documentElement`, and the component reads WordPress's
`<html data-theme>` — Sollutia's theme silently overrides the user's stored
preference.

**Always reach the root from a node you own:**

```js
const arrel = node.getRootNode();                 // ShadowRoot o Document
const host  = arrel instanceof ShadowRoot ? arrel.host : arrel.documentElement;
```

Pass the root in. A module that guesses its own container by querying the
whole document is broken by definition once there can be two instances.

## Rule 2 — Only `?inline` CSS reaches the shadow root

```js
import styles from './css/index.css?inline';        // ✅ entra al full adoptat
import '../../pages/features/sosp-components.css';  // ❌ va al <head> del host
```

A plain side-effect CSS import is injected into `document.head`. That fails
in **both** directions at once: 484 lines contaminate Sollutia's page, and
the styles never reach the component that needed them. `DesignSection.jsx`
does exactly this today.

Related trap: `CSSStyleSheet.replaceSync()` **ignores `@import` rules** by
specification. `index.css` line 12 imports `legacy-components.css`. If the
bundler does not inline it, those rules vanish on the `adoptedStyleSheets`
path and survive on the `<style>` fallback path — producing "works in Safari,
broken in Chrome". Verify the built artefact, do not assume the bundler
inlined it.

## Rule 3 — Namespace anything written to the host

```js
host.classList.toggle('sidebar-closed');       // ❌ col·lisió garantida
host.classList.toggle('sdp-sidebar-closed');   // ✅
```

Writing to the host element is sometimes legitimate — outer layout cannot be
driven from inside `:host`. When it is, the name must be prefixed, the write
must be documented in the integration contract, and it must be reverted on
`disconnectedCallback`.

Never write to `document.documentElement`, `document.body` or `document.title`
unless the attribute is explicitly part of the agreed contract with the host.

## Rule 4 — Never throw into the host's script

```js
const configHash = JSON.stringify(rawConfig);   // ❌ sense guarda
```

Sollutia sets `el.config = {...}`. If that object carries a circular
reference — a DOM node, jQuery, `window` — `JSON.stringify` throws, and the
exception propagates into *their* code. Every entry point the host can call
(attribute setters, property setters, custom element callbacks) wraps its
body and degrades to a documented fallback. An embedded component that takes
the host page down with it will not be embedded twice.

## Rule 5 — Survive node movement

Gutenberg moves nodes constantly. `connectedCallback` and
`disconnectedCallback` fire in pairs during a move, so:

- The shadow root **survives** the move — reuse it, do not guard on its
  absence.
- Deferred teardown must be cancellable from `connectedCallback`.
- Shared document-level resources (font `<link>`, instance counters) must be
  reference-counted, and the count must not drop to zero mid-move and cause a
  flash of unstyled text.

## Rule 6 — Target hardware is the constraint

iPad A10, Safari/WebKit. Feature-detect `adoptedStyleSheets`, `BroadcastChannel`
and `CSSStyleSheet` and provide a real fallback path, then **test the fallback
path**, because on the target device it is the primary one.

## Checklist before touching the boundary

- [ ] Does any new code call `document.querySelector` for something of ours?
- [ ] Does every new CSS import carry `?inline`?
- [ ] Is every class written to the host prefixed `sdp-`?
- [ ] Can any host-callable entry point throw?
- [ ] Does the change survive disconnect → reconnect within one tick?
- [ ] Has it been checked on the `<style>` fallback path, not just adopted?
