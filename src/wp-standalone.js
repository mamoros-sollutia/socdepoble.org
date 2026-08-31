/**
 * src/wp-standalone.js — entrada del build standalone per a WordPress.
 *
 * Aquesta entrada empaqueta l'aplicació per al seu ús via un script tag (`<script>`).
 * S'exposa l'API `window.SocDePoble` perquè els hosts (com WordPress o Sollutia) puguen
 * injectar un backend personalitzat, i després s'arrenca automàticament.
 */

import { arrencaAuto, exposaGlobal } from './host.js';

// 1. Exposar l'API global (window.SocDePoble) per a permetre injecció
exposaGlobal();

// 2. Programar l'arrencada (Fase 2) de forma asíncrona (tick de microtasques)
// perquè el host tinga temps d'injectar en Fase 1
arrencaAuto();
