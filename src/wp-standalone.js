/**
 * src/wp-standalone.js — entrada del build standalone per a WordPress.
 *
 * Existeix per una raó mecànica: si l'entrada té `export`, Rollup en format
 * IIFE ha d'assignar-los a `window.<name>`. Una entrada sense exports genera
 * un IIFE tancat `(function(){ ... })();` i cap variable global.
 *
 * Simètric a `src/main.jsx` (entrada de dev). No hi ha res més ací a propòsit.
 */
import { defineCustomElement } from './PedraSecaEmbed';

defineCustomElement();
