<?php
/**
 * Injecció inicial del Tema (Anti-FOUC) abans del primer pintat de React.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function sdp_bootstrap_theme() {
  if ( ! function_exists('sdp_es_pagina_app') || ! sdp_es_pagina_app() ) {
    return;
  }
  ?>
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#ffffff" data-sdp-theme-color>
  <script>
  (function (d, w) {
    var key = 'socdepoble-theme-mode';
    var preference = 'system';

    try {
      var saved = w.localStorage.getItem(key);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        preference = saved;
      }
    } catch (_) {}

    var systemDark = !!(
      w.matchMedia &&
      w.matchMedia('(prefers-color-scheme: dark)').matches
    );
    var theme = preference === 'system'
      ? (systemDark ? 'dark' : 'light')
      : preference;

    d.documentElement.dataset.theme = theme;
    d.documentElement.dataset.themePreference = preference;
    d.documentElement.style.colorScheme = theme;

    var meta = d.querySelector('meta[data-sdp-theme-color]');
    if (meta) meta.content = theme === 'dark' ? '#0e0d0c' : '#ffffff';
  })(document, window);
  </script>
  <?php
}
add_action( 'wp_head', 'sdp_bootstrap_theme', 0 );
